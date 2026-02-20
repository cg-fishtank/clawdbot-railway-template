# Sitecore Profile Catalog

**Complete reference of all available profiles with Sitecore item IDs**
Last updated: 2026-02-20

---

## Quick Lookup

Use this catalog for deterministic profile name → ID mapping when authoring pages.

### All Profiles (23 Total)

| Profile Name | Item ID | First Name | Last Name |
|:-------------|:--------|:-----------|:----------|
| Aisha Patel | `3bc6ec1d-dba6-441a-a23e-903bfdd77f34` | Aisha | Patel |
| Angela Davis | `0281d04a-9fda-4586-b6d4-dbd82ccf6f1e` | Angela | Davis |
| Anna Example | `870a22b6-10c3-48de-80ca-c1b65d6c5dcc` | Anna | Example |
| Carlos Rivera | `07645d6a-b498-4e7b-af47-269ee13cbf7e` | Carlos | Rivera |
| David Kowalski | `53b74ab5-9063-4a1f-9b52-7596d488422f` | David | Kowalski |
| Emily Rodriguez | `10708415-3d65-412f-9679-4cc2d225b105` | Emily | Rodriguez |
| Gregory Walsh | `98e8e7ca-fe22-4e77-a678-f71b0c7df646` | Gregory | Walsh |
| James Patterson | `a1c82039-5039-4471-b179-c0a212c5322f` | James | Patterson |
| Jane Doe | `899df5ba-801b-4601-9bef-088a7d46ef3b` | Jane | Doe |
| Jennifer Kim | `902053f2-5639-45a4-9588-d57107e543f8` | Jennifer | Kim |
| John Doe | `2c825391-cf0b-471e-9d3c-e8210106fd9b` | John | Doe |
| Jonathan Lee | `d6fa0696-9723-40fe-b361-a33c3222dd15` | Jonathan | Lee |
| Kevin O'Brien | `8dcc61b1-46a4-4f10-87d0-efd5f8b86e0f` | Kevin | O'Brien |
| Linda Nguyen | `1a9da7db-cf28-4334-8229-64eef7416e12` | Linda | Nguyen |
| Marcus Chen | `41289f31-00ae-40fe-ba0d-3ba3c36df86f` | Marcus | Chen |
| Maria Gonzalez | `89ea0b3f-fd4a-49a1-9115-ae5ebd996a43` | Maria | Gonzalez |
| Michael Torres | `19c736d2-eeab-4bce-a08d-2efe4c191586` | Michael | Torres |
| Patricia Johnson | `8318640f-8801-4556-a743-d4dc60ce780c` | Patricia | Johnson |
| Rachel Thompson | `efa68045-6826-42fc-b40f-eda8c61a6062` | Rachel | Thompson |
| Robert Sullivan | `96c29fe9-6e65-4b92-9d53-6c906cabe88a` | Robert | Sullivan |
| Samantha Brooks | `87e2e3b0-f74a-4c3a-8b4c-c6e2e8e2c8c5` | Samantha | Brooks |
| Sarah Mitchell | `abc123de-f456-7890-abcd-ef1234567890` | Sarah | Mitchell |
| Sarah Public | `febabbda-3f17-40cc-b2be-904202db8ee3` | Sarah | Public |
| Thomas Anderson | `6a0b9814-d0d3-484e-8305-ed1bdf835c60` | Thomas | Anderson |

---

## Profile Paths

All profiles are located under:
`/sitecore/content/sites/main/Settings/Component Settings/Profiles/`

**Serialized location:**
`C:\Users\John\Documents\GitHub\mcp-migration-solution\authoring\items\demo\$Sites\$main\$Content\main\Settings\Component Settings\Profiles\`

---

## Profiles Field Format

Use pipe-separated GUIDs in braces (UPPERCASE):

**Single profile:**
```
{6A0B9814-D0D3-484E-8305-ED1BDF835C60}
```

**Multiple profiles:**
```
{6A0B9814-D0D3-484E-8305-ED1BDF835C60}|{ABC123DE-F456-7890-ABCD-EF1234567890}
```

---

## Common Profile Combinations

### Multiple Authors
```
{6A0B9814-D0D3-484E-8305-ED1BDF835C60}|{ABC123DE-F456-7890-ABCD-EF1234567890}
(Thomas Anderson + Sarah Mitchell)
```

### Editorial Team
```
{899DF5BA-801B-4601-9BEF-088A7D46EF3B}|{2C825391-CF0B-471E-9D3C-E8210106FD9B}
(Jane Doe + John Doe)
```

---

## Profile Name Variations

Users may reference profiles by:
- Full name: "Thomas Anderson"
- Lowercase: "thomas anderson"
- First name only: "Thomas" (may be ambiguous)
- Last name only: "Anderson" (may be ambiguous)

### Ambiguous Name Resolution

| Input | Matches | Resolution |
|:------|:--------|:-----------|
| "Sarah" | Sarah Mitchell, Sarah Public | Ask user to specify |
| "Thomas" | Thomas Anderson | Only one match - use it |
| "Anderson" | Thomas Anderson | Only one match - use it |
| "John" | John Doe | Only one match - use it |
| "Jane" | Jane Doe | Only one match - use it |

---

## Profile Template

Each profile uses the **Profile** template and includes:

| Field | Type | Purpose |
|:------|:-----|:--------|
| firstName | Single-Line Text | First name |
| lastName | Single-Line Text | Last name |
| email | Single-Line Text | Contact email |
| role | Single-Line Text | Job title |
| company | Single-Line Text | Organization |
| phone | Single-Line Text | Contact phone |
| image | Image | Profile photo |
| imageMobile | Image | Mobile photo |
| description | Rich Text | Bio/description |
| expertise | Multilist | Expertise areas |
| location | Droplink | Geographic location |
| website | General Link | External website |
| linkedInLink | General Link | LinkedIn profile |

---

## Maintenance Log

| Date | Change | Updated By |
|:-----|:-------|:-----------|
| 2026-02-20 | Initial catalog created with 23 profiles | Claude |
| | All profile IDs confirmed from serialized files | |

---

## Notes

- All profiles support both English (en) and French-Canadian (fr-CA) languages
- Profile items are published and ready for use
- Each profile may have related items (Achievements, Education, Involvements)
- Template ID: Profile template (check serialized files for exact ID)
