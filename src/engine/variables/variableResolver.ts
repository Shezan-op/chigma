import type { ChigmaDocument, DesignVariable } from '../../models/document';

/**
 * Finds a design variable by ID across all variable collections in the document.
 */
export function findVariableById(
  document: ChigmaDocument,
  variableId: string
): DesignVariable | undefined {
  if (!document.variableCollections) return undefined;

  for (const collection of document.variableCollections) {
    const found = collection.variables.find((v) => v.id === variableId);
    if (found) return found;
  }
  return undefined;
}

/**
 * Finds a design variable by name or alias path (e.g. "color.text.primary").
 */
export function findVariableByName(
  document: ChigmaDocument,
  nameOrPath: string
): DesignVariable | undefined {
  if (!document.variableCollections) return undefined;

  const normalized = nameOrPath.replace(/^\{|\}$/g, '').trim();
  for (const collection of document.variableCollections) {
    const found = collection.variables.find((v) => v.name === normalized);
    if (found) return found;
  }
  return undefined;
}

/**
 * Resolves the active value of a variable, traversing aliases (A -> B -> C) with cycle detection
 * and mode resolution.
 */
export function resolveVariableValue(
  document: ChigmaDocument,
  variableId?: string,
  modeId?: string,
  visited: Set<string> = new Set()
): any {
  if (!variableId) return undefined;
  if (visited.has(variableId)) {
    console.warn(`Circular variable alias detected for ${variableId}`);
    return undefined;
  }

  const variable = findVariableById(document, variableId);
  if (!variable) return undefined;

  visited.add(variableId);

  const activeMode = modeId || document.activeModeId || 'light';
  let rawVal = variable.value;

  if (variable.valuesByMode && variable.valuesByMode[activeMode] !== undefined) {
    rawVal = variable.valuesByMode[activeMode];
  }

  // Check if rawVal is an alias reference: object { type: 'VARIABLE_ALIAS', id: 'var_xxx' } or string 'var_xxx'
  if (rawVal && typeof rawVal === 'object' && rawVal.type === 'VARIABLE_ALIAS' && rawVal.id) {
    return resolveVariableValue(document, rawVal.id, activeMode, visited);
  }

  if (typeof rawVal === 'string' && (rawVal.startsWith('var_') || rawVal.startsWith('{'))) {
    const targetVar = rawVal.startsWith('var_')
      ? findVariableById(document, rawVal)
      : findVariableByName(document, rawVal);

    if (targetVar) {
      return resolveVariableValue(document, targetVar.id, activeMode, visited);
    }
  }

  return rawVal;
}

/**
 * Resolves a fill/color property that may either be a raw hex color or a variable ID/alias.
 */
export function resolveColor(
  document: ChigmaDocument,
  colorOrVar?: string,
  modeId?: string
): string {
  if (!colorOrVar) return 'transparent';
  if (colorOrVar.startsWith('var_') || colorOrVar.startsWith('{')) {
    const targetVar = colorOrVar.startsWith('var_')
      ? findVariableById(document, colorOrVar)
      : findVariableByName(document, colorOrVar);

    if (targetVar) {
      const resolved = resolveVariableValue(document, targetVar.id, modeId);
      if (typeof resolved === 'string') return resolved;
    }
  }
  return colorOrVar;
}

/**
 * Resolves a spacing or dimension property that may either be a number or a variable ID/alias.
 */
export function resolveSpacing(
  document: ChigmaDocument,
  spacingOrVar?: number | string,
  modeId?: string
): number {
  if (spacingOrVar === undefined) return 0;
  if (typeof spacingOrVar === 'number') return spacingOrVar;
  if (typeof spacingOrVar === 'string' && (spacingOrVar.startsWith('var_') || spacingOrVar.startsWith('{'))) {
    const targetVar = spacingOrVar.startsWith('var_')
      ? findVariableById(document, spacingOrVar)
      : findVariableByName(document, spacingOrVar);

    if (targetVar) {
      const resolved = resolveVariableValue(document, targetVar.id, modeId);
      if (typeof resolved === 'number') return resolved;
      if (typeof resolved === 'string') return parseFloat(resolved) || 0;
    }
  }
  return parseFloat(spacingOrVar) || 0;
}
