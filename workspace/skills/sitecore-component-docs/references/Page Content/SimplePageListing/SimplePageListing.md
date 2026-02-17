# SimplePageListing

## Purpose

The SimplePageListing component displays a paginated list of child pages from a selected parent item. It queries pages based on a specific template (Landing Page) and presents them as cards with image, heading, and subheading. The component supports optional tag-based filtering, allowing visitors to see filtered results when page tags are active in the context. It's commonly used for resource libraries, article listings, or any parent-child page navigation.

## Sitecore Configuration

### Template Path

`/sitecore/templates/Project/[Site]/Page Content/Simple Page Listing`

### Data Source Location

`/sitecore/content/[Site]/Home/Data/Page Listings/`

## Fields

| Field         | Sitecore Type | Required | Constraints                        | Description                              |
| ------------- | ------------- | -------- | ---------------------------------- | ---------------------------------------- |
| heading       | Single-Line Text | Yes   | Max 100 characters                 | Section heading above the listing        |
| selectedPage  | Droptree      | No       | Must reference a valid parent page | Parent page whose children to list       |
| filterByTags  | Checkbox      | No       | true/false                         | Enable tag-based filtering               |
| tagsHeading   | Single-Line Text | No    | Max 50 characters                  | Custom label for "Filtering by tags:" text |
| noResultsText | Single-Line Text | No    | Max 100 characters                 | Custom message when no results match filters |

### Field Details

#### heading

- **Type:** Single-Line Text
- **Required:** Yes
- **Constraints:** Maximum 100 characters recommended
- **Guidance:** Provide a clear section title that describes the content being listed.
- **Example:** `Related Resources`

#### selectedPage

- **Type:** Droptree
- **Required:** No
- **Constraints:** Must reference a page item with children
- **Guidance:** Select the parent page whose children should be displayed. If not set, uses the current page as the parent.
- **Example:** Reference to `/sitecore/content/Site/Home/Resources`

#### filterByTags

- **Type:** Checkbox
- **Required:** No
- **Default:** false
- **Guidance:** Enable to allow filtering based on page tags from context. When enabled, only pages matching current context tags are shown.
- **Example:** `true`

#### tagsHeading

- **Type:** Single-Line Text
- **Required:** No
- **Guidance:** Customize the label shown when tag filtering is active. Falls back to "Filtering by tags:" if not set.
- **Example:** `Showing results for:`

#### noResultsText

- **Type:** Single-Line Text
- **Required:** No
- **Guidance:** Customize the message shown when filtering returns no matches. Falls back to "No results" if not set.
- **Example:** `No matching resources found. Showing all results.`

## Rendering Parameters

| Parameter | Type     | Options                      | Default | Description                     |
| --------- | -------- | ---------------------------- | ------- | ------------------------------- |
| theme     | Droplist | primary, secondary, tertiary | primary | Container background/text theme |

## Component Interface

```typescript
type SelectedPage = {
  id: string;
  url: string;
  name: string;
  displayName: string;
  fields: SelectedPageFields;
};

type SimplePageListingFields = {
  heading: Field<string>;
  selectedPage: SelectedPage;
  filterByTags: Field<boolean>;
  tagsHeading: Field<string>;
  noResultsText: Field<string>;
};

export type SimplePageListingProps = ComponentProps & {
  rendering: ComponentRendering & {
    data: PageDataType[];
  };
  fields: SimplePageListingFields;
};
```

## GraphQL Query

The component uses a GraphQL query to fetch child pages:

```graphql
query SimplePageListing(
  $pageID: String!
  $language: String!
  $endCursor: String
  $first: Int = 5
  $templateId: String!
) {
  item(path: $pageID, language: $language) {
    pages: children(includeTemplateIDs: [$templateId], first: $first, after: $endCursor) {
      total
      pageInfo {
        endCursor
        hasNext
      }
      results {
        name
        url { path }
        ... on CommonBasePage {
          ...ImageFieldFragment
          ...HeadingFieldFragment
          ...SubheadingFieldFragment
        }
      }
    }
  }
}
```

## Content Examples

### Minimal (Required Fields Only)

```json
{
  "fields": {
    "heading": { "value": "Explore Our Resources" }
  }
}
```

### Complete (All Fields)

```json
{
  "fields": {
    "heading": { "value": "Related Resources" },
    "selectedPage": {
      "id": "{ABC123-GUID}",
      "name": "Resources",
      "url": "/resources"
    },
    "filterByTags": { "value": true },
    "tagsHeading": { "value": "Showing results for:" },
    "noResultsText": { "value": "No matching resources found. Showing all results." }
  }
}
```

## Authoring Rules

1. **Set selectedPage:** If you want to list pages from a specific section, set the selectedPage. Otherwise, it defaults to the current page's children.
2. **Landing Page template:** Only pages using the Landing Page template are displayed. Ensure child pages use this template.
3. **Tag filtering:** When filterByTags is enabled, the component respects page tags from context. Ensure pages have SxaTags assigned.
4. **Pagination:** Results are paginated with 8 items per page. Plan content accordingly.

## Common Mistakes

| Mistake                   | Why It's Wrong                               | Correct Approach                           |
| ------------------------- | -------------------------------------------- | ------------------------------------------ |
| No child pages found      | selectedPage has no valid children           | Verify children exist with correct template|
| Tag filtering shows all   | filterByTags disabled or no context tags     | Enable filterByTags and ensure tags exist  |
| Wrong pages displayed     | Incorrect selectedPage reference             | Verify selectedPage points to right parent |
| Empty listing             | Children don't use Landing Page template     | Ensure children use correct template       |

## Related Components

- `ArticleListing` - For article-specific listings with different card format
- `CTACard` - Individual card used within card grids
- `ContentBlock` - For static content rather than dynamic listings

## Visual Layout

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  Section Heading                                                   │
│                                                                    │
│  Filtering by tags: Tag1, Tag2                                    │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ [Image] Page Title                                            │ │
│  │         Page subheading text...                               │ │
│  └──────────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ [Image] Page Title                                            │ │
│  │         Page subheading text...                               │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│                      [ 1 ] [ 2 ] [ 3 ] →                          │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

## Special Behavior

### Data Fetching

This component uses `getStaticProps`/`getServerSideProps` to fetch page data at build/request time. The data is fetched via the `getPageListingWithDetails` helper function.

### Tag Filtering

When `filterByTags` is enabled:
1. Component reads tags from `useContextPageTags` context
2. Filters pages that have matching `sxaTags`
3. If no matches found, shows all pages with a "no results" message

### Pagination

- Displays 8 items per page
- Pagination controls appear when more than 8 items exist
- Uses client-side pagination of pre-fetched data

---

## MCP Authoring Instructions

This section provides instructions for programmatically authoring the SimplePageListing component using the Marketer MCP tools.

### Prerequisites

Before authoring this component via MCP:
1. Have the target page ID (use `mcp__marketer-mcp__search_site`)
2. Have the SimplePageListing rendering ID from the component manifest
3. Know the target placeholder (typically `"headless-main"` for root placement)
4. Have the selectedPage item ID if specifying a parent page

### Step 1: Find the Target Page

```javascript
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Resources Hub"
});
const pageId = pageSearch.results[0].itemId;
```

### Step 2: Add SimplePageListing to Page

```javascript
const result = await mcp__marketer-mcp__add_component_on_page({
  pageId: "page-guid",
  componentRenderingId: "simplepagelisting-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "SimplePageListing_1",
  language: "en",
  fields: {
    "heading": "Related Resources",
    "filterByTags": "1"  // "1" for true, "" for false
  }
});

const datasourceId = result.datasourceId;
```

### Step 3: Update selectedPage Reference (Optional)

If you need to specify a parent page different from the current page:

```javascript
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "selectedPage": "{PARENT-PAGE-GUID}"
  }
});
```

### Complete Authoring Example

```javascript
// ═══════════════════════════════════════════════════════════════
// STEP 1: Find target page
// ═══════════════════════════════════════════════════════════════
const pageSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Resource Center"
});
const pageId = pageSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 2: Find the parent page for listing
// ═══════════════════════════════════════════════════════════════
const parentSearch = await mcp__marketer-mcp__search_site({
  site_name: "main",
  search_query: "Whitepapers"
});
const parentPageId = parentSearch.results[0].itemId;

// ═══════════════════════════════════════════════════════════════
// STEP 3: Add SimplePageListing component
// ═══════════════════════════════════════════════════════════════
const addResult = await mcp__marketer-mcp__add_component_on_page({
  pageId: pageId,
  componentRenderingId: "simplepagelisting-rendering-id",
  placeholderPath: "headless-main",
  componentItemName: "SimplePageListing_Whitepapers",
  language: "en",
  fields: {
    "heading": "Download Our Whitepapers",
    "filterByTags": "1",
    "tagsHeading": "Showing results for:",
    "noResultsText": "No matching whitepapers found."
  }
});

const datasourceId = addResult.datasourceId;

// ═══════════════════════════════════════════════════════════════
// STEP 4: Set the selectedPage reference
// ═══════════════════════════════════════════════════════════════
await mcp__marketer-mcp__update_content({
  siteName: "main",
  itemId: datasourceId,
  language: "en",
  fields: {
    "selectedPage": parentPageId
  }
});

// ═══════════════════════════════════════════════════════════════
// COMPLETE: SimplePageListing configured to show whitepaper children
// ═══════════════════════════════════════════════════════════════
```

### Field Type Quick Reference

| Field         | Type             | MCP Format                  |
|:--------------|:-----------------|:----------------------------|
| heading       | Single-Line Text | `"Plain text value"`        |
| selectedPage  | Droptree         | `"{PAGE-GUID}"`             |
| filterByTags  | Checkbox         | `"1"` (true) or `""` (false)|
| tagsHeading   | Single-Line Text | `"Plain text value"`        |
| noResultsText | Single-Line Text | `"Plain text value"`        |

### MCP Authoring Checklist

Before authoring SimplePageListing via MCP, verify:

- [ ] Have page ID (from `mcp__marketer-mcp__search_site`)
- [ ] Have SimplePageListing rendering ID (from component manifest)
- [ ] Placeholder path is `"headless-main"` (no leading slash for root)
- [ ] Component item name is unique (e.g., `SimplePageListing_1`)
- [ ] Parent page (selectedPage) has children with Landing Page template
- [ ] Children have heading, subheading, and image fields populated

### MCP Error Handling

| Error                 | Cause                    | Solution                                  |
|:----------------------|:-------------------------|:------------------------------------------|
| "Item already exists" | Duplicate component name | Use unique suffix: `SimplePageListing_2`  |
| Component not visible | Wrong placeholder path   | Use `"headless-main"` without leading slash |
| No pages displayed    | selectedPage has no children | Verify children exist with correct template |
| Empty listing         | Children use wrong template | Ensure children use Landing Page template |

---

## Change Log

| Date       | Change                | Author      |
|------------|----------------------|-------------|
| 2026-02-09 | Initial documentation | Claude Code |
