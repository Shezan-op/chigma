# AI Co-Designer Architecture

## Overview
Chigma includes an embedded, offline-capable AI system that enables natural language design generation, layout refactoring, spacing normalization, and accessibility compliance.

## Key Subsystems
1. **Model Provider Abstraction (`src/engine/ai/aiProvider.ts`)**:
   - `RuleBasedOfflineAiProvider`: Deterministic offline layout synthesizer capable of generating SaaS dashboards, marketing landing pages, navigation bars, and data grids without internet access.
   - External provider interface ready for local Ollama (`http://localhost:11434`) and OpenAI/Anthropic compatible endpoints.
2. **Context Builder (`src/engine/ai/aiContextBuilder.ts`)**:
   - Converts the canvas document graph into a compact, token-efficient semantic hierarchy.
   - Extracts active design tokens, master component signatures, and viewport constraints.
3. **Agent Orchestrator (`src/engine/ai/aiOrchestrator.ts`)**:
   - Manages task execution plans with step-by-step progress tracking.
   - Records transactional snapshots prior to applying changes for 1-click Rollback/Undo.
   - Logs design decisions directly into `document.decisionLog`.
