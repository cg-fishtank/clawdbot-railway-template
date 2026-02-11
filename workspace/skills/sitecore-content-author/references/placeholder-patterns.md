# Dynamic Placeholder Patterns

**Reference for constructing placeholder paths in Sitecore**
Last updated: 2026-02-05

---

## Format Rules

### Root-Level Components
- **Format**: `headless-main`
- **NO leading slash**
- **Example**: `headless-main`

### Child Components (Nested)
- **Format**: `/{parent-placeholder}/{child-key}-{dynamic-id}`
- **HAS leading slash**
- **Example**: `/headless-main/buttons-1`

---

## Common Patterns

| Parent Component | Child Placeholder Key | Child Component | Full Path Example |
|:-----------------|:----------------------|:----------------|:------------------|
| HeroBanner | buttons | Button | /headless-main/buttons-1 |
| SplitBanner | buttons | Button | /headless-main/buttons-2 |
| ContentBlock | buttons | Button | /headless-main/buttons-3 |
| ContentBanner | buttons | Button | /headless-main/buttons-4 |
| CTABlock | buttons | Button | /headless-main/buttons-5 |
| Accordion | accordion | AccordionDrawer | /headless-main/accordion-1 |
| AccordionDrawer | buttons | Button | /headless-main/accordion-1/buttons-1 |
| CardGrid | cards | Card | /headless-main/cards-1 |
| CardBanner | cards | Card | /headless-main/cards-2 |
| CardCarousel | cards | Card | /headless-main/cards-3 |
| IconFeatureCardGrid | cards | IconFeatureCard | /headless-main/cards-4 |
| TabsContainer | tabscontainer | TabItem | /headless-main/tabscontainer-1 |
| FooterMain | footer-cols | FooterCol | /headless-main/footer-cols-1 |

---

## Dynamic ID Extraction

After adding a component with `add_component_on_page`, the response includes:
```json
{
  "datasourceId": "e4bc8b94-452c-4127-b759-42cabb7e448f",
  "placeholderId": "headless-main"
}
```

To get the dynamic ID for adding children, call `get_components_on_page` and find the component:
```json
{
  "parameters": {
    "DynamicPlaceholderId": "2"
  }
}
```

### Construction Steps
1. Parent added to page → Gets `DynamicPlaceholderId` (e.g., "2")
2. Child placeholder = `/{parent-placeholder}/{child-key}-{dynamic-id}`
3. Example: Accordion with ID 2 → child path = `/headless-main/accordion-2`

---

## Deeply Nested Example

```
Page: /home/products
├─ CardGrid (dynamic ID: 1)
│  └─ Card (dynamic ID: 5)
│     └─ Placeholder: /headless-main/cards-1 (Card has no placeholders)
```

**Construction**:
1. CardGrid on page → `headless-main` → dynamic ID = 1
2. Card in CardGrid → `/headless-main/cards-1`
3. (Card has no placeholders, so this is terminal)

---

## Three-Level Nesting Example

```
Page: /home/faqs
├─ Accordion (dynamic ID: 2)
│  ├─ AccordionDrawer (dynamic ID: 3)
│  │  └─ Button
│  │     └─ Placeholder: /headless-main/accordion-2/buttons-3
│  ├─ AccordionDrawer (dynamic ID: 4)
│  │  └─ Button
│  │     └─ Placeholder: /headless-main/accordion-2/buttons-4
```

**Construction**:
1. Accordion on page → `headless-main` → dynamic ID = 2
2. AccordionDrawer in Accordion → `/headless-main/accordion-2` → dynamic ID = 3
3. Button in AccordionDrawer → `/headless-main/accordion-2/buttons-3`

---

## Optimization Tips

### Track Dynamic IDs Locally
Instead of calling `get_components_on_page` repeatedly, track dynamic IDs as you add components:

1. After adding a component, store its datasourceId
2. Query page once to get the dynamic ID
3. Use that dynamic ID for all children without additional queries

**Token savings**: ~3k tokens per avoided `get_components_on_page` call

---

## Common Errors

| Error | Cause | Solution |
|:------|:------|:---------|
| Component not visible | Wrong placeholder path | Check leading slash rules |
| "Cannot add to placeholder" | Invalid placeholder key | Check component-registry.md for correct key |
| Child appears at root | Missing leading slash | Add `/` prefix for nested paths |
| "Placeholder not found" | Parent not added yet | Add parent before children |

---

## Usage Notes

- **Always check**: Component registry for placeholder keys before authoring
- **Root vs nested**: Root = no slash, nested = with slash
- **Dynamic IDs**: Sequential integers assigned by Sitecore (1, 2, 3...)
- **Reusability**: Same child key can appear in multiple components (e.g., `buttons`)
