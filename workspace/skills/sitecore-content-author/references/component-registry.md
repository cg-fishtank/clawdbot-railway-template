# Sitecore Component Registry

**Source of truth for TIDAL components**
Last updated: 2026-02-05
Generated from: Component manifest + Marketer MCP `list_components`

Use this file to look up rendering IDs and field schemas without MCP calls.

---

## Accordions

### Accordion
**Rendering ID**: `8cb91616-d630-4732-b520-4d3a0c4931e4`

| Field | Type | Required |
|:------|:-----|:---------|
| heading | Field<string> | ✓ |
| subheading | Field<string> | ✓ |
| link | LinkField | |

**Placeholders**: `accordion` → AccordionDrawer

---

### AccordionDrawer
**Rendering ID**: `4e1df4d2-a674-4502-a9e0-7828a9536cd9`

| Field | Type | Required |
|:------|:-----|:---------|
| heading | Field<string> | ✓ |
| body | RichTextField | ✓ |

**Placeholders**: `buttons` → Button

---

## Banners

### HeroBanner
**Rendering ID**: `5e9d7b60-f61b-407b-b04b-2eeba60b0ec0`

| Field | Type | Required |
|:------|:-----|:---------|
| backgroundImage | ImageField | ✓ |
| backgroundImageMobile | ImageField | ✓ |
| heading | Field<string> | ✓ |
| subheading | Field<string> | |

**Placeholders**: `buttons` → Button

---

### SplitBanner
**Rendering ID**: `f22c31f6-9a23-406b-8285-4391a49926f7`

| Field | Type | Required |
|:------|:-----|:---------|
| image | ImageField | ✓ |
| imageMobile | ImageField | ✓ |
| heading | Field<string> | ✓ |
| subheading | Field<string> | |
| body | Field<string> | |
| link | LinkField | |

**Placeholders**: `buttons` → Button

---

### ContentBanner
**Rendering ID**: `c03d8136-d9f7-498c-b6dc-a0db7ef4aa91`

| Field | Type | Required |
|:------|:-----|:---------|
| heading | Field<string> | ✓ |
| subheading | Field<string> | |
| body | Field<string> | |

**Placeholders**: `buttons` → Button

---

### TextBanner
**Rendering ID**: `e1c23b3a-a5fd-45b3-a686-6e08a04a5fe6`

| Field | Type | Required |
|:------|:-----|:---------|
| heading | Field<string> | ✓ |
| subheading | Field<string> | |
| body | Field<string> | |

**Placeholders**: `buttons` → Button

---

### VideoBanner
**Rendering ID**: `77685258-dca2-4a26-90ab-1844f73548f7`

| Field | Type | Required |
|:------|:-----|:---------|
| heading | Field<string> | ✓ |
| subheading | Field<string> | |
| videoUrl | Field<string> | ✓ |

**Placeholders**: None

---

## Cards

### CardGrid
**Rendering ID**: `e78b588a-a213-411d-bfae-dd607ffd2c8b`

| Field | Type | Required |
|:------|:-----|:---------|
| heading | Field<string> | ✓ |

**Placeholders**: `cards` → Card

**Note**: In Sitecore, use placeholder key `cards` (not `cardgrid` from manifest)

---

### Card
**Rendering ID**: `022420b6-3db0-4eab-9ea5-1f57e0f345bf`

| Field | Type | Required |
|:------|:-----|:---------|
| badge | Field<string> | |
| image | ImageField | ✓ |
| imageMobile | ImageField | ✓ |
| heading | Field<string> | ✓ |
| body | RichTextField | ✓ |
| link | LinkField | ✓ |

**Placeholders**: None

---

### CardBanner
**Rendering ID**: `57c51166-b04d-47ef-ad66-2d9b566bc436`

| Field | Type | Required |
|:------|:-----|:---------|
| heading | Field<string> | ✓ |
| subheading | Field<string> | |

**Placeholders**: `cards` → Card

---

### CardCarousel
**Rendering ID**: `4180edc5-2601-4b67-bea5-586bdd311311`

| Field | Type | Required |
|:------|:-----|:---------|
| heading | Field<string> | ✓ |

**Placeholders**: `cards` → Card

---

## Page Content

### Button
**Rendering ID**: `c152f7dc-6c01-4380-babb-97c9f080cf00`

| Field | Type | Required |
|:------|:-----|:---------|
| link | LinkField | ✓ |

**Placeholders**: None

---

### ContentBlock
**Rendering ID**: `8c914279-4a11-4de7-a6bc-ef0c9d9d253a`

| Field | Type | Required |
|:------|:-----|:---------|
| image | ImageField | |
| mobileImage | ImageField | |
| heading | Field<string> | ✓ |
| body | Field<string> | |

**Placeholders**: `buttons` → Button

---

### Image
**Rendering ID**: `5ce3099c-120e-474d-99fe-165eb5804db5`

| Field | Type | Required |
|:------|:-----|:---------|
| image | ImageField | ✓ |
| altText | Field<string> | |

**Placeholders**: None

---

### Video
**Rendering ID**: `d5c05809-7a34-4b0f-9f63-7df2306dbaf3`

| Field | Type | Required |
|:------|:-----|:---------|
| videoUrl | Field<string> | ✓ |
| heading | Field<string> | |

**Placeholders**: None

---

### CTABlock
**Rendering ID**: `e276274f-5c13-4b76-ac83-d7a867975696`

| Field | Type | Required |
|:------|:-----|:---------|
| heading | Field<string> | ✓ |
| subheading | Field<string> | |
| body | Field<string> | |

**Placeholders**: `buttons` → Button

---

### CTACard
**Rendering ID**: `af4506a4-555c-4847-bc15-58ef83108dea`

| Field | Type | Required |
|:------|:-----|:---------|
| heading | Field<string> | ✓ |
| body | Field<string> | |
| image | ImageField | |

**Placeholders**: None

---

### CommonRichtext
**Rendering ID**: `45d05c34-9edf-48d5-9226-ff2c7bc3abb4`

| Field | Type | Required |
|:------|:-----|:---------|
| body | RichTextField | ✓ |

**Placeholders**: None

---

### Callout
**Rendering ID**: `a5968db4-1d40-437e-9e9d-23733660f793`

| Field | Type | Required |
|:------|:-----|:---------|
| heading | Field<string> | ✓ |
| body | RichTextField | |
| image | ImageField | |

**Placeholders**: None

---

### Separator
**Rendering ID**: `21ef8e28-97a9-4b50-850e-ab87fa7dc0dc`

| Field | Type | Required |
|:------|:-----|:---------|

**Placeholders**: None

---

### AlertBanner
**Rendering ID**: `e47956bb-0dd7-47fa-a28c-2c9b3358c0f9`

| Field | Type | Required |
|:------|:-----|:---------|
| heading | Field<string> | ✓ |
| body | Field<string> | |

**Placeholders**: None

---

## Tabs

### TabsContainer
**Rendering ID**: `c19fbdf2-75e8-4462-be2e-0c6e8b055886`

| Field | Type | Required |
|:------|:-----|:---------|

**Placeholders**: `tabscontainer` → TabItem

---

### TabItem
**Rendering ID**: `186e303e-912a-404d-a73f-8e205bfb970e`

| Field | Type | Required |
|:------|:-----|:---------|

**Placeholders**: None

---

## Navigation

### Header
**Rendering ID**: `ddd5f8c3-6e84-404a-b49d-43bbf28d00f4`

| Field | Type | Required |
|:------|:-----|:---------|
| logo | ImageField | |

**Placeholders**: Multiple navigation placeholders

---

### Breadcrumbs
**Rendering ID**: `dbc13b39-e3ea-4974-9623-50116bda8feb`

| Field | Type | Required |
|:------|:-----|:---------|

**Placeholders**: None

---

### Navigation
**Rendering ID**: `1deb067f-0bb1-405e-94f5-2abb537a6160`

| Field | Type | Required |
|:------|:-----|:---------|

**Placeholders**: Multiple

---

### SideNav
**Rendering ID**: `8d0d45d7-6e63-4e9c-a90d-4bfbaeec0787`

| Field | Type | Required |
|:------|:-----|:---------|

**Placeholders**: None

---

## Footer

### FooterMain
**Rendering ID**: `d63f334e-d240-47da-87b6-2c61c6413f8a`

| Field | Type | Required |
|:------|:-----|:---------|

**Placeholders**: `footer-cols` → FooterCol

---

### FooterCol
**Rendering ID**: `267ec5a1-36d9-4a3c-92b2-620a56806568`

| Field | Type | Required |
|:------|:-----|:---------|
| heading | Field<string> | |

**Placeholders**: None

---

### FooterLegal
**Rendering ID**: `77d7145d-775c-4fac-9191-bdb7ad03de9f`

| Field | Type | Required |
|:------|:-----|:---------|

**Placeholders**: None

---

### FooterMenu
**Rendering ID**: `a6f3622c-d750-4887-8a4b-22a3bd0f4e87`

| Field | Type | Required |
|:------|:-----|:---------|

**Placeholders**: None

---

## Icon Feature Cards

### IconFeatureCardGrid
**Rendering ID**: `1b8a9932-1383-4d81-aedd-0e86025c0a98`

| Field | Type | Required |
|:------|:-----|:---------|
| heading | Field<string> | ✓ |

**Placeholders**: `cards` → IconFeatureCard

---

### IconFeatureCard
**Rendering ID**: `a4f9ff7a-3b2f-46b5-a2ca-ee9aee97fac7`

| Field | Type | Required |
|:------|:-----|:---------|
| icon | Field<string> | |
| heading | Field<string> | ✓ |
| body | Field<string> | |

**Placeholders**: None

---

## Usage Notes

- **Context Savings**: This registry eliminates `list_components` MCP calls (~13k tokens)
- **Quick Lookup**: Search for components by name to find rendering IDs and field schemas
- **Field Validation**: Check this file before calling `add_component_on_page` to avoid field errors
- **Placeholder Keys**: Some keys differ from manifest (e.g., CardGrid uses `cards` not `cardgrid`)
