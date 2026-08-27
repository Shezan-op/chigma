# Chigma MCP Tools Reference

## Registered MCP Tools

### 1. `get_project`
Retrieves project metadata, page list, variable collections, master components, and decision log.

### 2. `get_page`
Retrieves all canvas nodes and background configuration for a specific page.
- **Parameters**: `pageId` (string, optional)

### 3. `get_node`
Retrieves full geometry, layout, typography, fills, strokes, and constraints of a single node.
- **Parameters**: `nodeId` (string, required)

### 4. `create_node`
Creates and inserts a new vector node or pre-composed wireframe component onto the active page.
- **Parameters**:
  - `type` (string, required): e.g. `'rectangle'`, `'button'`, `'navbar'`, `'card'`, `'line-chart'`, `'table'`
  - `x` (number, optional): X coordinate (defaults to 100)
  - `y` (number, optional): Y coordinate (defaults to 100)
  - `customProps` (object, optional): Custom visual and layout properties

### 5. `modify_node`
Updates geometry, visual styling, text copy, or constraints of an existing node.
- **Parameters**:
  - `nodeId` (string, required)
  - `updates` (object, required)

### 6. `apply_auto_layout`
Enables or configures auto-layout rules on a frame container.
- **Parameters**:
  - `nodeId` (string, required)
  - `direction` (`'horizontal' | 'vertical'`, required)
  - `gap` (number, required)
  - `paddingX` (number, optional)
  - `paddingY` (number, optional)

### 7. `inspect_design`
Runs an automated design health audit (spacing, token linkage, touch target sizes, WCAG AA contrast).
- **Parameters**: None

### 8. `export_code`
Generates idiomatic code in the requested format.
- **Parameters**:
  - `nodeId` (string, optional): If omitted, exports the active page
  - `format` (`'react_tailwind' | 'nextjs' | 'html_css'`, required)
