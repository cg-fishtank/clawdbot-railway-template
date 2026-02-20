# Troubleshooting Guide

## Common Errors and Solutions

| Error | Cause | Solution |
|:------|:------|:---------|
| "Template not available" | Wrong parent location | Verify parent is /Articles folder |
| "Cannot find field" | Wrong field name | Check field names (case-sensitive) - see `article-page-template.md` |
| Tag update fails | Invalid tag format | Use `/sitecore-author-tags` skill |
| Date not saving | Wrong date format | Use `YYYYMMDDTHHmmssZ` format - see `date-formatting.md` |
| Image field not working | Invalid XML format | Use `/sitecore-author-image` skill |
| "Parent not found" | Incorrect parent ID | Search for /Articles folder using `marketer_search_site` |
| Field value not appearing | Missing language version | Add language version first using `marketer_add_language_to_page` |
| Component not added | Wrong placeholder path | Verify placeholder is `headless-main` |
| Preview URL not loading | Page not published | Check page workflow state |

## Debugging Workflow

1. **Verify Template ID**: Ensure using `f201f27e-c1ca-4949-be52-539bcc3b89d0`
2. **Check Parent Location**: Articles folder should be under `/sitecore/content/sites/main/home/articles`
3. **Validate Field Names**: Field names are case-sensitive (e.g., `heading` not `Heading`)
4. **Check Date Format**: Must be `YYYYMMDDTHHmmssZ` (see `date-formatting.md`)
5. **Use Specialized Skills**:
   - Tags → `/sitecore-author-tags`
   - Images → `/sitecore-author-image`
   - Links → `/sitecore-author-link`

## MCP Call Failures

If MCP calls fail:

1. **Check connection**: Ensure marketer-mcp is configured in `.mcp.json`
2. **Verify site name**: Should be "main" for most operations
3. **Check language**: Default is "en" - specify if different
4. **Validate IDs**: Ensure GUIDs are in correct format (with hyphens)

## Getting Help

- **Component field names**: Use `/sitecore-component-docs` skill
- **Site configuration**: Check `.claude/data/site-config.md`
- **Tag reference**: Use `/sitecore-author-tags` skill
