# Chigma Release & Production Readiness Checklist

## Production Readiness Criteria

- [x] **Core Vector Engine**: 2D Boolean CSG (Union, Subtract, Intersect, Exclude), Bézier pen path editing, snapping, and distance measurement.
- [x] **Components & Variants**: Master component creation, instance synchronization with override preservation, and variant properties.
- [x] **Design Tokens**: Multi-mode collections (Light, Dark, High Contrast), multi-hop variable aliases (`A -> B -> C`), and cycle detection.
- [x] **Asset Storage**: Client-side image downscaling (max 2048px), SHA-256 duplicate content deduplication, and non-destructive image cropping.
- [x] **AI Co-Designer**: 100% offline deterministic provider, local Ollama integration, OpenAI-compatible endpoints, and direct vision screenshot context.
- [x] **MCP External Bridge**: Stdio-to-WebSocket local daemon (`chigma-mcp-bridge.cjs`), expanded semantic tools, and structured error codes.
- [x] **Developer Handoff**: React + Tailwind, Next.js, and CSS multi-framework code export with 1-click clipboard copy.
- [x] **Persistence & Integrity**: Dexie IndexedDB, autosave debounce, document integrity validation, auto-repair, and crash recovery snapshots.
- [x] **PWA & Offline**: Service worker caching, manifest, and storage quota manager.
- [x] **Automated Testing**: 50+ passing Vitest unit and end-to-end workflow tests.
- [x] **Open Source Sanitization**: 0 private machine paths, 0 hardcoded secrets, MIT licensing.
