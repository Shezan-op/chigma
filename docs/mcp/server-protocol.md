# Model Context Protocol (MCP) Server

## Protocol Specification
Chigma implements the **2026-07-28 Model Context Protocol (MCP)** specification over JSON-RPC 2.0.

## Tools Reference
| Tool Name | Description | Key Parameters |
|---|---|---|
| `get_project` | Returns project metadata, pages, tokens, and components | None |
| `get_page` | Returns nodes and background for a page | `pageId` (string) |
| `get_node` | Retrieves a specific node by ID | `nodeId` (string) |
| `create_node` | Creates a new vector node or wireframe component | `type`, `x`, `y`, `customProps` |
| `modify_node` | Modifies properties of an existing node | `nodeId`, `updates` |
| `apply_auto_layout` | Sets auto-layout rules on a container frame | `nodeId`, `direction`, `gap` |
| `inspect_design` | Runs automated design health linter | None |
| `export_code` | Generates React + Tailwind, CSS, or Next.js code | `nodeId`, `format` |

## Resources Reference
- `chigma://project/current`: Current active project structure.
- `chigma://design-system`: Design variables, token collections, and color palettes.
- `chigma://components`: Registered master component definitions.

## Prompts Reference
- `design-review`: Automated aesthetic and WCAG review.
- `create-saas-dashboard`: Instant synthesis of full SaaS operations dashboard.
- `make-responsive`: Adds horizontal/vertical constraints to all layout containers.
