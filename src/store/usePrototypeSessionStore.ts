import { create } from 'zustand';
import type { InteractionLink, OverlayConfig } from '../models/node';

export interface ActiveOverlayState {
  id: string;
  sourceNodeId: string;
  targetPageId?: string;
  config: OverlayConfig;
}

export interface PrototypeInteractionLog {
  id: string;
  timestamp: number;
  trigger: string;
  action: string;
  sourceNodeId: string;
  details?: string;
}

export interface PrototypeSessionState {
  activeScreenId: string | null;
  historyStack: string[];
  variables: Record<string, any>;
  activeOverlays: ActiveOverlayState[];
  interactionLogs: PrototypeInteractionLog[];
  isDebuggerOpen: boolean;

  // Actions
  initSession: (startScreenId: string, initialVars?: Record<string, any>) => void;
  executeInteraction: (link: InteractionLink, sourceNodeId: string) => void;
  setVariableValue: (name: string, value: any) => void;
  toggleVariableValue: (name: string) => void;
  stepVariableValue: (name: string, delta: number) => void;
  openOverlay: (sourceNodeId: string, config: OverlayConfig, targetPageId?: string) => void;
  closeOverlay: (overlayId?: string) => void;
  navigateBack: () => void;
  navigateToScreen: (screenId: string) => void;
  resetSession: (startScreenId: string) => void;
  setDebuggerOpen: (open: boolean) => void;
}

export const usePrototypeSessionStore = create<PrototypeSessionState>((set, get) => ({
  activeScreenId: null,
  historyStack: [],
  variables: {},
  activeOverlays: [],
  interactionLogs: [],
  isDebuggerOpen: false,

  initSession: (startScreenId, initialVars = {}) => {
    set({
      activeScreenId: startScreenId,
      historyStack: [startScreenId],
      variables: { ...initialVars },
      activeOverlays: [],
      interactionLogs: [
        {
          id: `log_${Date.now()}`,
          timestamp: Date.now(),
          trigger: 'pageLoad',
          action: 'init',
          sourceNodeId: startScreenId,
          details: `Session started at screen ${startScreenId}`
        }
      ]
    });
  },

  executeInteraction: (link, sourceNodeId) => {
    const { variables, historyStack, activeScreenId } = get();

    // 1. Evaluate condition if present
    if (link.condition) {
      const { variableId, operator, value } = link.condition;
      const currentVal = variables[variableId];

      let conditionPassed = false;
      if (operator === '==') conditionPassed = currentVal == value;
      else if (operator === '!=') conditionPassed = currentVal != value;
      else if (operator === '>') conditionPassed = currentVal > value;
      else if (operator === '<') conditionPassed = currentVal < value;
      else if (operator === '>=') conditionPassed = currentVal >= value;
      else if (operator === '<=') conditionPassed = currentVal <= value;

      if (!conditionPassed) {
        return;
      }
    }

    // 2. Perform Action
    const logEntry: PrototypeInteractionLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
      trigger: link.trigger,
      action: link.action,
      sourceNodeId
    };

    switch (link.action) {
      case 'navigate':
        if (link.targetPageId && link.targetPageId !== activeScreenId) {
          set({
            activeScreenId: link.targetPageId,
            historyStack: [...historyStack, link.targetPageId],
            activeOverlays: [], // Clear transient overlays on navigation
            interactionLogs: [
              { ...logEntry, details: `Navigated to ${link.targetPageId}` },
              ...get().interactionLogs
            ]
          });
        }
        break;

      case 'back':
        get().navigateBack();
        break;

      case 'openOverlay':
      case 'openModal':
        if (link.overlayConfig) {
          get().openOverlay(sourceNodeId, link.overlayConfig, link.targetPageId);
        }
        break;

      case 'closeOverlay':
        get().closeOverlay();
        break;

      case 'setVariable':
        if (link.variableConfig) {
          get().setVariableValue(link.variableConfig.variableId, link.variableConfig.value);
        }
        break;

      case 'toggleVariable':
        if (link.variableConfig) {
          get().toggleVariableValue(link.variableConfig.variableId);
        }
        break;

      case 'incrementVariable':
        if (link.variableConfig) {
          get().stepVariableValue(link.variableConfig.variableId, link.variableConfig.delta ?? 1);
        }
        break;

      case 'decrementVariable':
        if (link.variableConfig) {
          get().stepVariableValue(link.variableConfig.variableId, -(link.variableConfig.delta ?? 1));
        }
        break;

      case 'url':
        if (link.targetUrl) {
          window.open(link.targetUrl, '_blank', 'noopener,noreferrer');
        }
        break;
    }
  },

  setVariableValue: (name, value) => {
    set((state) => ({
      variables: { ...state.variables, [name]: value },
      interactionLogs: [
        {
          id: `log_${Date.now()}`,
          timestamp: Date.now(),
          trigger: 'variableChange',
          action: 'setVariable',
          sourceNodeId: 'runtime',
          details: `${name} = ${JSON.stringify(value)}`
        },
        ...state.interactionLogs
      ]
    }));
  },

  toggleVariableValue: (name) => {
    set((state) => {
      const current = Boolean(state.variables[name]);
      return {
        variables: { ...state.variables, [name]: !current },
        interactionLogs: [
          {
            id: `log_${Date.now()}`,
            timestamp: Date.now(),
            trigger: 'variableChange',
            action: 'toggleVariable',
            sourceNodeId: 'runtime',
            details: `${name} = ${!current}`
          },
          ...state.interactionLogs
        ]
      };
    });
  },

  stepVariableValue: (name, delta) => {
    set((state) => {
      const current = Number(state.variables[name] || 0);
      const next = current + delta;
      return {
        variables: { ...state.variables, [name]: next },
        interactionLogs: [
          {
            id: `log_${Date.now()}`,
            timestamp: Date.now(),
            trigger: 'variableChange',
            action: 'stepVariable',
            sourceNodeId: 'runtime',
            details: `${name} changed by ${delta} to ${next}`
          },
          ...state.interactionLogs
        ]
      };
    });
  },

  openOverlay: (sourceNodeId, config, targetPageId) => {
    const newOverlay: ActiveOverlayState = {
      id: `overlay_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      sourceNodeId,
      targetPageId,
      config
    };
    set((state) => ({
      activeOverlays: [...state.activeOverlays, newOverlay]
    }));
  },

  closeOverlay: (overlayId) => {
    set((state) => ({
      activeOverlays: overlayId
        ? state.activeOverlays.filter((o) => o.id !== overlayId)
        : state.activeOverlays.slice(0, -1) // Close topmost overlay
    }));
  },

  navigateBack: () => {
    const { historyStack } = get();
    if (historyStack.length > 1) {
      const newStack = historyStack.slice(0, -1);
      const previousScreen = newStack[newStack.length - 1];
      set({
        historyStack: newStack,
        activeScreenId: previousScreen,
        activeOverlays: [],
        interactionLogs: [
          {
            id: `log_${Date.now()}`,
            timestamp: Date.now(),
            trigger: 'back',
            action: 'navigateBack',
            sourceNodeId: 'navigation',
            details: `Navigated back to ${previousScreen}`
          },
          ...get().interactionLogs
        ]
      });
    }
  },

  navigateToScreen: (screenId) => {
    set((state) => ({
      activeScreenId: screenId,
      historyStack: [...state.historyStack, screenId],
      activeOverlays: []
    }));
  },

  resetSession: (startScreenId) => {
    get().initSession(startScreenId);
  },

  setDebuggerOpen: (open) => set({ isDebuggerOpen: open })
}));
