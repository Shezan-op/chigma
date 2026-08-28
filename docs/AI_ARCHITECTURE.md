# Chigma AI Architecture & Vision Loop

## Overview

Chigma includes an AI architecture that operates both 100% offline without network access and with local (Ollama) or remote (OpenAI-compatible) LLM providers.

```text
┌─────────────────────────────────────────────────────────────┐
│                      User AI Prompt                         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     AI Context Builder                      │
│  - Active Page Elements      - Design Token Collections     │
│  - Selected Node Metrics     - Available Components         │
│  - Direct Canvas Screenshot (Base64 PNG Vision Context)     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     AI Provider Layer                       │
│  ├── RuleBasedOfflineAiProvider (Deterministic, Zero-Net)   │
│  ├── OllamaAiProvider (Local http://localhost:11434)        │
│  └── OpenAICompatibleProvider (OpenAI / OpenRouter / API)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Transactional AI Execution                  │
│  - Multi-Step Plan Verification                             │
│  - Before/After Snapshot Recording                          │
│  - Reversible Operations & 1-Click Rollback                 │
│  - Canvas Re-render & Visual Evaluation                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Provider Abstraction (`IAiProvider`)

Implemented in `src/engine/ai/aiProvider.ts`:
- **`RuleBasedOfflineAiProvider`**: Instant heuristic generators for dashboards, SaaS landing pages, mobile apps, navigation systems, and 8px grid alignments.
- **`OllamaAiProvider`**: Connects to local Ollama runtime, detects models via `/api/tags`, streams tokens, and formats structured JSON mutations.
- **`OpenAICompatibleProvider`**: Handles external multimodal models with image payloads and structured outputs.

---

## 2. Direct Screenshot / Vision Context

Implemented in `src/engine/ai/aiVisionContext.ts`:
- Serializes the live SVG artboard directly into an image bitmap using HTML5 canvas.
- Converts to high-resolution PNG data URLs and injects into multimodal model context for visual design evaluation.

---

## 3. Transaction Safety & Rollback

Every AI execution creates a document snapshot before applying mutations. If the result fails quality or linting checks, the user can click **Undo AI Changes** to restore the document state instantly.
