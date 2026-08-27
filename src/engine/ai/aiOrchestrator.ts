import type { ChigmaDocument, Page } from '../../models/document';
import type { ChigmaNode } from '../../models/node';
import { RuleBasedOfflineAiProvider, type AIExecutionResult } from './aiProvider';
import { buildAiContext } from './aiContextBuilder';

export interface AiTaskHistoryItem {
  id: string;
  timestamp: number;
  prompt: string;
  result: AIExecutionResult;
  snapshotBefore: any;
}

export class AiAgentOrchestrator {
  private provider = new RuleBasedOfflineAiProvider();
  private taskHistory: AiTaskHistoryItem[] = [];

  async executeTask(
    prompt: string,
    document: ChigmaDocument,
    activePage: Page,
    selectedNodes: ChigmaNode[] = []
  ): Promise<AIExecutionResult> {
    const context = buildAiContext(document, activePage, selectedNodes);
    const result = await this.provider.processPrompt(prompt, context);

    // Save snapshot before task for 1-click rollback
    const historyItem: AiTaskHistoryItem = {
      id: `ai_task_${Date.now()}`,
      timestamp: Date.now(),
      prompt,
      result,
      snapshotBefore: JSON.parse(JSON.stringify(document))
    };

    this.taskHistory.unshift(historyItem);
    return result;
  }

  getHistory(): AiTaskHistoryItem[] {
    return this.taskHistory;
  }

  getLastTaskSnapshot(): any | null {
    return this.taskHistory[0]?.snapshotBefore || null;
  }
}

export const globalAiOrchestrator = new AiAgentOrchestrator();
