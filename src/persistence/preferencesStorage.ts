const PREF_PREFIX = 'chigma_pref_';

export interface AppPreferences {
  theme: 'dark' | 'light';
  sidebarWidth: number;
  lastOpenedProjectId?: string;
  showGrid: boolean;
  showRulers: boolean;
  gridSize: number;
  snapToGrid: boolean;
  snapToObjects: boolean;
  leftSidebarTab: 'layers' | 'components' | 'assets' | 'variables' | 'decisionLog';
}

const DEFAULT_PREFERENCES: AppPreferences = {
  theme: 'dark',
  sidebarWidth: 260,
  showGrid: true,
  showRulers: true,
  gridSize: 8,
  snapToGrid: true,
  snapToObjects: true,
  leftSidebarTab: 'layers'
};

export function getPreference<K extends keyof AppPreferences>(
  key: K,
  defaultValue = DEFAULT_PREFERENCES[key]
): AppPreferences[K] {
  try {
    const raw = localStorage.getItem(`${PREF_PREFIX}${key}`);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

export function setPreference<K extends keyof AppPreferences>(
  key: K,
  value: AppPreferences[K]
): void {
  try {
    localStorage.setItem(`${PREF_PREFIX}${key}`, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed to persist preference ${key}:`, err);
  }
}

export function getAllPreferences(): AppPreferences {
  return {
    theme: getPreference('theme', 'dark'),
    sidebarWidth: getPreference('sidebarWidth', 260),
    lastOpenedProjectId: getPreference('lastOpenedProjectId', undefined),
    showGrid: getPreference('showGrid', true),
    showRulers: getPreference('showRulers', true),
    gridSize: getPreference('gridSize', 8),
    snapToGrid: getPreference('snapToGrid', true),
    snapToObjects: getPreference('snapToObjects', true),
    leftSidebarTab: getPreference('leftSidebarTab', 'layers')
  };
}
