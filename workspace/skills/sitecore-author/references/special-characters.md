# Special Character Handling

**CRITICAL**: Improper special character handling will cause visible escaped characters on the published website.

---

## Quotation Marks in Content

**NEVER use escaped double quotes (`\"`) in field values.** They will render as literal backslash-quote (`\"`) on the published website.

### ❌ WRONG - Escaped quotes become visible backslashes
```javascript
fields: {
  "body": "Reusable UI labels (e.g., \"Register\", \"Read More\")"
}
```
Output displays: `Reusable UI labels (e.g., \"Register\", \"Read More\")`

### ✓ CORRECT - Use HTML entities for quotes
```javascript
fields: {
  "body": "Reusable UI labels (e.g., &quot;Register&quot;, &quot;Read More&quot;)"
}
```
Output displays: `Reusable UI labels (e.g., "Register", "Read More")`

### Alternative - Use single quotes where appropriate
```javascript
fields: {
  "body": "Reusable UI labels (e.g., 'Register', 'Read More')"
}
```

### Key Rules for Quotation Marks:
1. **Use `&quot;` for double quotes** - the HTML entity renders as `"`
2. **Never use `\"`** - backslash-quote renders literally, not as a quote
3. **Single quotes `'` work directly** - no escaping needed
4. **Applies to all text fields** - Rich Text, Single-Line Text, Multi-Line Text

---

## Newline Character Handling

**NEVER use literal `\n` escape sequences in field values.** They will render as the text "\n" on the published website.

### ❌ WRONG - Literal newlines become visible text
```javascript
fields: {
  "Description": "Line one\nLine two"  // ❌ Displays as "Line one\nLine two"
}
```

### ✓ CORRECT - Use HTML formatting instead

| Field Type | Solution | Example |
|:-----------|:---------|:--------|
| Multi-Line Text | Use `<br />` tags | `"Line one<br />Line two"` |
| Rich Text | Use `<p>` tags for paragraphs | `"<p>Paragraph one</p><p>Paragraph two</p>"` |
| Rich Text | Use `<br />` for soft breaks | `"<p>Line one<br />Line two</p>"` |
| Single-Line Text | No line breaks allowed | `"Single line only"` |

### Examples

**Multi-Line Text field:**
```javascript
await marketer_update_content({
  siteName: "main",
  itemId: datasourceId,
  fields: {
    "Address": "123 Main Street<br />Suite 100<br />New York, NY 10001"
  }
});
```

**Rich Text field with paragraphs:**
```javascript
await marketer_update_content({
  siteName: "main",
  itemId: datasourceId,
  fields: {
    "Body": "<p>First paragraph of content.</p><p>Second paragraph with more details.</p>"
  }
});
```

**Rich Text with mixed formatting:**
```javascript
await marketer_update_content({
  siteName: "main",
  itemId: datasourceId,
  fields: {
    "Description": "<p>Welcome to our site.<br />We offer great services.</p><p>Contact us today!</p>"
  }
});
```

---

## Code Blocks in Rich Text (`<pre><code>`)

When including code blocks in rich text fields, **NEVER use `\n` escape sequences**. They will render as literal "\n" text because the MCP API stores escape sequences literally.

### ❌ WRONG - Literal \n shows in output
```javascript
fields: {
  "body": "<pre><code>/Components\n  /EventCard\n    key-name</code></pre>"
}
```
Output displays: `/Components\n  /EventCard\n    key-name`

### ✓ CORRECT - Use `&#10;` HTML entity for newlines
```javascript
fields: {
  "body": "<pre><code>/Components&#10;  /EventCard&#10;    key-name</code></pre>"
}
```
Output displays properly formatted:
```
/Components
  /EventCard
    key-name
```

### Key Rules for Code Blocks:
1. **Use `&#10;` for newlines** - the HTML entity for line feed character
2. **Never use `\n`** - it renders as literal text, not a newline
3. **Preserve indentation** - use spaces directly (not tabs) for consistent rendering
4. **HTML-escape special characters** inside code:
   - `<` → `&lt;`
   - `>` → `&gt;`
   - `&` → `&amp;`
   - `"` → `&quot;`
   - newline → `&#10;`

### TypeScript/JavaScript Code Block Example:
```javascript
fields: {
  "body": "<p>Here is the component code:</p><pre><code>const EventCard = ({ title }: Props): JSX.Element =&gt; {&#10;  return (&#10;    &lt;div className=\"event-card\"&gt;&#10;      &lt;h2&gt;{title}&lt;/h2&gt;&#10;    &lt;/div&gt;&#10;  );&#10;};</code></pre>"
}
```
