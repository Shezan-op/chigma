import type { ComponentMaster } from '../../models/document';
import type { ChigmaNode } from '../../models/node';

/**
 * Converts any existing node or frame into a reusable Main Component.
 */
export function createComponentMaster(
  node: ChigmaNode,
  customName?: string
): { master: ComponentMaster; updatedNode: ChigmaNode } {
  const componentId = `cmp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const name = customName || node.name || 'Component';

  const master: ComponentMaster = {
    id: componentId,
    name,
    mainNodeId: node.id,
    properties: [
      { name: 'label', type: 'text', defaultValue: (node as any).label || (node as any).text || name },
      { name: 'visible', type: 'boolean', defaultValue: true }
    ],
    variants: []
  };

  const updatedNode: ChigmaNode = {
    ...node,
    isComponent: true,
    componentId,
    name: `❖ ${name}`
  };

  return { master, updatedNode };
}

/**
 * Spawns a new Component Instance linked to a Component Master.
 */
export function createInstanceFromMaster(
  master: ComponentMaster,
  mainNode: ChigmaNode,
  x: number,
  y: number
): ChigmaNode {
  const instanceId = `inst_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  // Clone geometry and styling from mainNode, marking it as an instance
  const instance: ChigmaNode = {
    ...JSON.parse(JSON.stringify(mainNode)),
    id: instanceId,
    name: `◇ ${master.name}`,
    x,
    y,
    isComponent: false,
    componentId: undefined,
    instanceOf: master.id,
    overrides: {},
    variantProperties: {}
  };

  return instance;
}

/**
 * Detaches an instance, converting it into an independent editable node or frame.
 */
export function detachInstance(instanceNode: ChigmaNode): ChigmaNode {
  const detached: ChigmaNode = {
    ...JSON.parse(JSON.stringify(instanceNode)),
    instanceOf: undefined,
    overrides: undefined,
    name: instanceNode.name.replace(/^◇\s*/, '')
  };

  return detached;
}

/**
 * Synchronizes an instance with changes from the master component
 * while preserving all intentional user overrides.
 */
export function syncInstanceWithMaster(
  instanceNode: ChigmaNode,
  masterNode: ChigmaNode
): ChigmaNode {
  if (!instanceNode.instanceOf) return instanceNode;

  const overrides = instanceNode.overrides || {};

  // Copy non-overridden properties from master
  const synced: ChigmaNode = {
    ...JSON.parse(JSON.stringify(masterNode)),
    id: instanceNode.id,
    x: instanceNode.x,
    y: instanceNode.y,
    rotation: instanceNode.rotation,
    name: instanceNode.name,
    instanceOf: instanceNode.instanceOf,
    overrides,
    variantProperties: instanceNode.variantProperties
  };

  // Apply recorded overrides
  Object.keys(overrides).forEach((key) => {
    (synced as any)[key] = overrides[key];
  });

  return synced;
}
