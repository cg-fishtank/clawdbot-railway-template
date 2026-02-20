---
name: sitecore-publish
description: |
  Publishes Sitecore XM Cloud items to Experience Edge using the Authoring and Management GraphQL API.
  Use this skill when:
  - Publishing individual items or pages to Experience Edge
  - Publishing content trees with subitems
  - Checking publishing job status
  - Triggering smart or full publish operations
  Triggers: "publish to edge", "publish item", "publish page", "publish to sitecore", "check publish status"
---

# Sitecore Publish Skill

Publish items from Sitecore XM Cloud to Experience Edge using the Authoring and Management GraphQL API.

## Prerequisites

Required environment variables:
- `SITECORE_CLIENT_ID` - Client ID from XM Cloud Deploy credentials
- `SITECORE_CLIENT_SECRET` - Client Secret from XM Cloud Deploy credentials
- `SITECORE_AUTHORING_ENDPOINT` - GraphQL endpoint (e.g., `https://<instance>/sitecore/api/authoring/graphql/v1/`)
- `SITECORE_SITE_URL` - Public site URL for preview links (e.g., `https://www.example.com`). If not set, derive from `SITECORE_AUTHORING_ENDPOINT` by extracting the host (e.g., `https://xmc-fishtankcon026e-mcpmigratiod738-devc899.sitecorecloud.io`).

## Authentication Flow

1. Obtain access token from Sitecore Identity:
```
POST https://auth.sitecorecloud.io/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
client_id={SITECORE_CLIENT_ID}
client_secret={SITECORE_CLIENT_SECRET}
audience=https://api.sitecorecloud.io
```

2. Use the `access_token` from response as Bearer token for GraphQL requests.

## Publish Item Mutation

```graphql
mutation {
  publishItem(input: {
    sourceDatabase: "master"
    targetDatabases: ["experienceedge"]
    rootItemIds: ["{ITEM-GUID}"]
    publishSubItems: true
    publishRelatedItems: false
    publishItemMode: SMART
    languages: ["en"]
    displayName: "Publish description"
  }) {
    operationId
  }
}
```

### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sourceDatabase` | String | Yes | Source database, usually `"master"` |
| `targetDatabases` | [String!]! | Yes | Target databases, e.g., `["experienceedge"]` |
| `rootItemId` | ID | No | Single item GUID to publish |
| `rootItemIds` | [ID] | No | Multiple item GUIDs to publish |
| `rootItemPath` | String | No | Item path (ignored if ID provided) |
| `rootItemPaths` | [String] | No | Multiple item paths |
| `publishSubItems` | Boolean | No | Include children (default: false) |
| `publishRelatedItems` | Boolean | No | Include related items (default: false) |
| `publishItemMode` | PublishItemMode | Yes | `SMART` or `FULL` |
| `languages` | [String!]! | Yes | Languages to publish, e.g., `["en"]` |
| `displayName` | String | No | Friendly name for the operation |

### Publish Modes

- **SMART**: Only publishes items with changed revision IDs (recommended)
- **FULL**: Republishes all items regardless of changes

## Check Publish Status

```graphql
query {
  publishingStatus(publishingOperationId: "{operationId}") {
    state
    isDone
    isFailed
    processed
    languages {
      name
    }
    targetDatabase {
      name
    }
  }
}
```

### Status States

- `RUNNING` - Publish in progress
- `FINISHED` - Publish completed successfully
- `FAILED` - Publish failed

## Workflow

1. **Get auth token** from Sitecore Identity
2. **Execute publishItem mutation** with item ID/path
3. **Store operationId** from response
4. **Poll publishingStatus** query until `isDone: true`
5. **Report success or failure** to user
6. **Output preview URL** on success (see below)

## Preview URL

After a successful publish, construct and display the preview URL so the user can verify the published page.

### Construction Rules

1. **Base URL**: Use `SITECORE_SITE_URL` env var if set. Otherwise, extract the host from `SITECORE_AUTHORING_ENDPOINT` (strip the `/sitecore/api/authoring/graphql/v1/` path).
2. **Page path**: Derive from the Sitecore item path by stripping the content tree prefix up to and including `Home`:
   - `/sitecore/content/Sites/main/Home/MyPage` → `/MyPage`
   - `/sitecore/content/Sites/main/Home/about/team` → `/about/team`
   - `/sitecore/content/Sites/main/Home` → `/` (the homepage itself)
3. **Combine**: `{base_url}{page_path}`

### Example Output

After a successful publish, include the preview URL in the results summary:

| Field | Value |
|-------|-------|
| **Item** | `/sitecore/content/Sites/main/Home/MyPage` |
| **State** | FINISHED |
| **Items Processed** | 5 |
| **Preview URL** | `https://www.example.com/MyPage` |

## Example: Publish Single Item

To publish item `{1C7EACDF-51E7-4760-9153-F02AE8E67E00}` to Edge:

```graphql
mutation {
  publishItem(input: {
    sourceDatabase: "master"
    targetDatabases: ["experienceedge"]
    rootItemIds: ["{1C7EACDF-51E7-4760-9153-F02AE8E67E00}"]
    publishSubItems: false
    publishRelatedItems: false
    publishItemMode: SMART
    languages: ["en"]
  }) {
    operationId
  }
}
```

## Example: Publish Item with Children

```graphql
mutation {
  publishItem(input: {
    sourceDatabase: "master"
    targetDatabases: ["experienceedge"]
    rootItemPaths: ["/sitecore/content/Sites/main/Home"]
    publishSubItems: true
    publishRelatedItems: true
    publishItemMode: SMART
    languages: ["en"]
  }) {
    operationId
  }
}
```

## Error Handling

Common errors:
- **401 Unauthorized**: Token expired or invalid credentials
- **403 Forbidden**: User lacks publish permissions
- **404 Not Found**: Item ID/path does not exist

Check item publish permissions:
```graphql
query {
  item(where: {path: "/sitecore/content/Home"}) {
    canPublish
  }
}
```

## References

- [Sitecore Authoring API Docs](https://doc.sitecore.com/sai/en/developers/sitecoreai/sitecore-authoring-and-management-graphql-api.html)
- [Publish Mutation Examples](https://doc.sitecore.com/sai/en/developers/sitecoreai/query-examples-for-management-operations.html)
