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
 * Resolves the active value of a variable based on the document's active mode (e.g. Light or Dark).
 */
export function resolveVariableValue(
  document: ChigmaDocument,
  variableId?: string
): any {
  if (!variableId) return undefined;

  const variable = findVariableById(document, variableId);
  if (!variable) return undefined;

  const activeMode = document.activeModeId || 'light';
  if (variable.valuesByMode && variable.valuesByMode[activeMode] !== undefined) {
    return variable.valuesByMode[activeMode];
  }

  return variable.value;
}

/**
 * Resolves a fill/color property that may either be a raw hex color or a variable ID.
 */
export function resolveColor(
  document: ChigmaDocument,
  colorOrVar?: string
): string {
  if (!colorOrVar) return 'transparent';
  if (colorOrVar.startsWith('var_')) {
    const resolved = resolveVariableValue(document, colorOrVar);
    if (typeof resolved === 'string') return resolved;
  }
  return colorOrVar;
}

/**
 * Resolves a spacing or dimension property that may either be a number or a variable ID.
 */
export function resolveSpacing(
  document: ChigmaDocument,
  spacingOrVar?: number | string
): number {
  if (spacingOrVar === undefined) return 0;
  if (typeof spacingOrVar === 'number') return spacingOrVar;
  if (typeof spacingOrVar === 'string' && spacingOrVar.startsWith('var_')) {
    const resolved = resolveVariableValue(document, spacingOrVar);
    if (typeof resolved === 'number') return resolved;
  }
  return parseFloat(spacingOrVar) || 0;
}
