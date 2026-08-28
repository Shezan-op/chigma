import { describe, it, expect } from 'vitest';
import { RuleBasedOfflineAiProvider, OllamaAiProvider } from '../engine/ai/aiProvider';

describe('AI Provider Architecture & Generation', () => {
  it('deterministic offline provider generates SaaS dashboard with KPIs and charts', async () => {
    const provider = new RuleBasedOfflineAiProvider();
    const result = await provider.processPrompt('Create a modern SaaS analytics dashboard with revenue charts', {
      documentName: 'Project A',
      activePageName: 'Page 1'
    });

    expect(result.success).toBe(true);
    expect(result.createdNodes).toBeDefined();
    expect(result.createdNodes!.length).toBeGreaterThan(4);
    expect(result.plan.length).toBeGreaterThan(3);

    const hasChart = result.createdNodes!.some((n) => n.type === 'line-chart' || n.type === 'donut-chart');
    expect(hasChart).toBe(true);
  });

  it('deterministic offline provider generates mobile app wireframe', async () => {
    const provider = new RuleBasedOfflineAiProvider();
    const result = await provider.processPrompt('Build mobile iOS profile screen with settings buttons', {
      documentName: 'Mobile App',
      activePageName: 'Profile'
    });

    expect(result.success).toBe(true);
    const hasFrame = result.createdNodes!.some((n) => n.type === 'frame' && n.width === 375);
    expect(hasFrame).toBe(true);
  });

  it('Ollama provider reports capabilities and falls back gracefully when server offline', async () => {
    const ollama = new OllamaAiProvider({ baseUrl: 'http://127.0.0.1:9999', model: 'llama3.2' });
    const caps = ollama.getCapabilities();
    expect(caps.tools).toBe(true);

    const result = await ollama.processPrompt('Create landing page', {
      documentName: 'Test',
      activePageName: 'Main'
    });
    // Should gracefully fallback to deterministic offline generation
    expect(result.success).toBe(true);
    expect(result.createdNodes!.length).toBeGreaterThan(0);
  });
});
