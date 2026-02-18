---
name: sitecore-upload-media
description: Upload media files to Sitecore XM Cloud Media Library using the Authoring GraphQL API presigned URL method
---

# Media Uploader (GraphQL API)

Upload media files to Sitecore XM Cloud Media Library using the **Authoring GraphQL API** presigned URL method.

## What I do
- Upload media files to Sitecore XM Cloud Media Library
- Get presigned upload URLs via GraphQL mutation
- Support both local files and remote URLs
- Handle authentication via OAuth Client Credentials
- Report upload results with Sitecore item IDs

## When to use
Use this skill when:
- Uploading images to Sitecore Media Library
- Migrating media assets to XM Cloud
- Preparing images for component authoring
- You have local files or URLs to upload

## Required Inputs

| Input | Description | Example |
|:------|:------------|:--------|
| **Authentication** | OAuth Client Credentials (from `.env`) | See Prerequisites section |
| **Image Source** | Local file path OR external URL | `C:\images\hero.jpg` or `https://example.com/image.jpg` |
| **Target Path** | Destination in Media Library | `Project/main/Images/hero-banner` |

## Prerequisites

**Environment variables** (from `.env` file at project root):

```bash
SITECORE_CLIENT_ID=your-client-id
SITECORE_CLIENT_SECRET=your-client-secret
SITECORE_AUTHORING_ENDPOINT=https://<instance>.sitecorecloud.io/sitecore/api/authoring/graphql/v1/
```

## Authentication Flow

**OAuth Client Credentials Grant:**

Get Bearer token via OAuth before making API calls:

```bash
POST https://auth.sitecorecloud.io/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
client_id={SITECORE_CLIENT_ID}
client_secret={SITECORE_CLIENT_SECRET}
audience=https://api.sitecorecloud.io
```

The response will contain an `access_token` field - use this as the Bearer token for all subsequent API calls.

## Image Source Requirements

**CRITICAL**: DO NOT accept pasted/embedded images.

The image source MUST be one of:
- **Local file path**: `C:\Users\John\images\hero.jpg`
- **External URL**: `https://example.com/image.jpg`

If user pastes an image directly:
> "I cannot process pasted images directly. Please provide the local file path where the image is saved, or a URL to download it from."

## Upload Workflow

### Step 0: Load Environment Variables & Get Auth Token

**IMPORTANT:** Read `.env` file from project root before starting:

```bash
# Read from: C:\Users\John\Documents\GitHub\mcp-migration-solution\.env
Read('.env')

# Parse and extract:
# - SITECORE_CLIENT_ID (required)
# - SITECORE_CLIENT_SECRET (required)
# - SITECORE_AUTHORING_ENDPOINT (required)
```

Get Bearer token via OAuth flow (see Authentication Flow above):

```bash
curl -s -X POST "https://auth.sitecorecloud.io/oauth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=${SITECORE_CLIENT_ID}&client_secret=${SITECORE_CLIENT_SECRET}&audience=https://api.sitecorecloud.io"
```

Extract `access_token` from response to use as Bearer token.

### Step 1: Validate Inputs
- Check OAuth credentials available (CLIENT_ID and CLIENT_SECRET)
- Check image source exists (local) or is accessible (URL)
- Determine target path

### Step 2: Download Remote Image (if URL)
```bash
curl -L -o ".opencode/assets/temp-upload.jpg" "https://example.com/image.jpg"
```

### Step 3: Get Presigned Upload URL
```bash
curl -s -X POST "<AUTHORING_ENDPOINT>" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <AUTH_TOKEN>" \
  -d '{"query":"mutation { uploadMedia(input: { itemPath: \"<TARGET_PATH>\" }) { presignedUploadUrl } }"}'
```

### Step 4: Upload File to Presigned URL
```bash
curl --request POST "<PRESIGNED_URL>" \
  --header "Authorization: Bearer <AUTH_TOKEN>" \
  --form "=@<LOCAL_FILE_PATH>"
```

### Step 5: Report Results
```
==============================================================
MEDIA UPLOAD COMPLETE
==============================================================

Source:        <original source>
Target:        /sitecore/media library/<target-path>

RESULT
--------------------------------------------------------------
Status:        SUCCESS
Sitecore ID:   <item-id>
Item Path:     <full-sitecore-path>
Media URL:     /-/media/<target-path>

==============================================================
```

## Common Errors

| Error | Cause | Resolution |
|:------|:------|:-----------|
| `AUTH_NOT_AUTHENTICATED` | Invalid OAuth credentials | Verify CLIENT_ID and CLIENT_SECRET in `.env` |
| `401 Unauthorized` | Token expired or invalid credentials | Re-authenticate via OAuth to get fresh token |
| `invalid_client` | Invalid CLIENT_ID or CLIENT_SECRET | Check OAuth credentials in `.env` |
| `presignedUploadUrl is null` | Mutation failed | Check error message in response |
| `404 on upload` | Presigned URL expired | Get new presigned URL |
| `no decode delegate` | Corrupted image file | Ask for file path/URL, don't save pasted images |
| No credentials found | Missing .env configuration | Add SITECORE_CLIENT_ID and SITECORE_CLIENT_SECRET to `.env` |

## Key Principles

1. **Load .env first** - Check for OAuth credentials before starting
2. **Get OAuth token first** - Always authenticate via OAuth Client Credentials before API calls
3. **NEVER modify the bearer token** - Use exactly as provided from OAuth response
4. **NEVER save pasted images with write tool** - This corrupts binary data
5. **Path format matters** - `itemPath` should NOT include `/sitecore/media library/` prefix
6. **Use POST with --form** - Upload via `curl --request POST --form "=@file"`
7. **Include Bearer token on upload** - Presigned URL still requires Authorization header

## Usage

```
/sitecore-upload-media

Image: C:\Users\John\images\hero-banner.jpg
Target: Project/main/Banners/hero
```

**With URL source**:
```
/sitecore-upload-media

Image: https://example.com/hero-banner.jpg
Target: Project/main/Banners/hero
```
