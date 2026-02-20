# Date Formatting Reference

Sitecore date fields use **ISO 8601 format**.

## Format Specification

**Format:** `YYYYMMDDTHHmmssZ`

| Component | Description | Example |
|:----------|:------------|:--------|
| YYYY | 4-digit year | 2026 |
| MM | 2-digit month | 02 |
| DD | 2-digit day | 20 |
| T | Time separator | T |
| HH | 2-digit hour (24h) | 12 |
| mm | 2-digit minute | 00 |
| ss | 2-digit second | 00 |
| Z | UTC timezone | Z |

## Examples

```javascript
// Today's date at noon UTC
const today = "20260220T120000Z";

// Specific date: December 31, 2025 at 23:59:59 UTC
const specificDate = "20251231T235959Z";

// January 1, 2026 at midnight
const newYear = "20260101T000000Z";

// February 14, 2026 at 3:30 PM
const valentines = "20260214T153000Z";
```

## Usage in Code

```javascript
await marketer_update_fields_on_content_item({
  itemId: pageId,
  fields: {
    datePublished: "20260220T120000Z",
    lastUpdated: "20260220T120000Z"
  }
});
```

## Common Mistakes

**Wrong:**
- `2026-02-20` (missing time)
- `02/20/2026` (wrong format)
- `20260220` (missing time separator)
- `20260220T12:00:00Z` (colons not allowed)

**Right:**
- `20260220T120000Z` ✓
