# Chigma MCP Security Model

## 1. Local-Only Boundary
The Chigma MCP Server runs strictly in the local environment. It never transmits project data, design tokens, or document trees to external third-party cloud servers without explicit user-configured API endpoints.

## 2. Human-In-The-Loop & Rollback Safety
- All modifications produced by MCP tools or AI agents execute as reversible transactions.
- Chigma automatically preserves a pre-mutation snapshot enabling 1-click **Rollback / Undo**.
- Destructive actions (such as deleting entire pages or bulk node deletions) require explicit confirmation.

## 3. Secret Isolation
API keys for optional external model providers (e.g. OpenAI, Anthropic, Ollama) are stored strictly in local browser storage (`localStorage`) and are never written to exported `.chigma.json` project files.
