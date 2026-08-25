import type { Command } from './Command';
import type { ChigmaNode } from '../../models/node';

/**
 * Command for adding nodes to a page.
 */
export class AddNodesCommand implements Command {
  description: string;
  private nodes: ChigmaNode[];
  private pageId: string;
  private addNodesFn: (pageId: string, nodes: ChigmaNode[]) => void;
  private removeNodesFn: (pageId: string, nodeIds: string[]) => void;

  constructor(
    nodes: ChigmaNode[],
    pageId: string,
    addNodesFn: (pageId: string, nodes: ChigmaNode[]) => void,
    removeNodesFn: (pageId: string, nodeIds: string[]) => void
  ) {
    this.nodes = nodes;
    this.pageId = pageId;
    this.addNodesFn = addNodesFn;
    this.removeNodesFn = removeNodesFn;
    this.description = `Add ${nodes.length} element${nodes.length > 1 ? 's' : ''}`;
  }

  execute(): void {
    this.addNodesFn(this.pageId, this.nodes);
  }

  undo(): void {
    this.removeNodesFn(
      this.pageId,
      this.nodes.map((n) => n.id)
    );
  }
}

/**
 * Command for deleting nodes from a page.
 */
export class DeleteNodesCommand implements Command {
  description: string;
  private nodesWithIndex: { node: ChigmaNode; index: number }[];
  private pageId: string;
  private restoreNodesFn: (pageId: string, items: { node: ChigmaNode; index: number }[]) => void;
  private removeNodesFn: (pageId: string, nodeIds: string[]) => void;

  constructor(
    nodesWithIndex: { node: ChigmaNode; index: number }[],
    pageId: string,
    restoreNodesFn: (pageId: string, items: { node: ChigmaNode; index: number }[]) => void,
    removeNodesFn: (pageId: string, nodeIds: string[]) => void
  ) {
    this.nodesWithIndex = nodesWithIndex;
    this.pageId = pageId;
    this.restoreNodesFn = restoreNodesFn;
    this.removeNodesFn = removeNodesFn;
    this.description = `Delete ${nodesWithIndex.length} element${nodesWithIndex.length > 1 ? 's' : ''}`;
  }

  execute(): void {
    this.removeNodesFn(
      this.pageId,
      this.nodesWithIndex.map((i) => i.node.id)
    );
  }

  undo(): void {
    this.restoreNodesFn(this.pageId, this.nodesWithIndex);
  }
}

/**
 * Command for updating node properties with granular diff undo/redo.
 */
export class UpdateNodesPropsCommand implements Command {
  description: string;
  private pageId: string;
  private diffs: { id: string; before: Partial<ChigmaNode>; after: Partial<ChigmaNode> }[];
  private applyPropsFn: (pageId: string, updates: { id: string; props: Partial<ChigmaNode> }[]) => void;

  constructor(
    pageId: string,
    diffs: { id: string; before: Partial<ChigmaNode>; after: Partial<ChigmaNode> }[],
    applyPropsFn: (pageId: string, updates: { id: string; props: Partial<ChigmaNode> }[]) => void,
    description = 'Update elements'
  ) {
    this.pageId = pageId;
    this.diffs = diffs;
    this.applyPropsFn = applyPropsFn;
    this.description = description;
  }

  execute(): void {
    const updates = this.diffs.map((d) => ({ id: d.id, props: d.after }));
    this.applyPropsFn(this.pageId, updates);
  }

  undo(): void {
    const updates = this.diffs.map((d) => ({ id: d.id, props: d.before }));
    this.applyPropsFn(this.pageId, updates);
  }
}

/**
 * Command for grouping multiple nodes into a single group node.
 */
export class GroupNodesCommand implements Command {
  description = 'Group elements';
  private pageId: string;
  private groupNode: ChigmaNode;
  private memberIds: string[];
  private groupFn: (pageId: string, groupNode: ChigmaNode, memberIds: string[]) => void;
  private ungroupFn: (pageId: string, groupId: string) => void;

  constructor(
    pageId: string,
    groupNode: ChigmaNode,
    memberIds: string[],
    groupFn: (pageId: string, groupNode: ChigmaNode, memberIds: string[]) => void,
    ungroupFn: (pageId: string, groupId: string) => void
  ) {
    this.pageId = pageId;
    this.groupNode = groupNode;
    this.memberIds = memberIds;
    this.groupFn = groupFn;
    this.ungroupFn = ungroupFn;
  }

  execute(): void {
    this.groupFn(this.pageId, this.groupNode, this.memberIds);
  }

  undo(): void {
    this.ungroupFn(this.pageId, this.groupNode.id);
  }
}

/**
 * Command for ungrouping a group node.
 */
export class UngroupNodesCommand implements Command {
  description = 'Ungroup elements';
  private pageId: string;
  private groupNode: ChigmaNode;
  private children: ChigmaNode[];
  private ungroupFn: (pageId: string, groupId: string) => void;
  private regroupFn: (pageId: string, groupNode: ChigmaNode, children: ChigmaNode[]) => void;

  constructor(
    pageId: string,
    groupNode: ChigmaNode,
    children: ChigmaNode[],
    ungroupFn: (pageId: string, groupId: string) => void,
    regroupFn: (pageId: string, groupNode: ChigmaNode, children: ChigmaNode[]) => void
  ) {
    this.pageId = pageId;
    this.groupNode = groupNode;
    this.children = children;
    this.ungroupFn = ungroupFn;
    this.regroupFn = regroupFn;
  }

  execute(): void {
    this.ungroupFn(this.pageId, this.groupNode.id);
  }

  undo(): void {
    this.regroupFn(this.pageId, this.groupNode, this.children);
  }
}

/**
 * Command for reordering layer z-index order.
 */
export class ReorderNodesCommand implements Command {
  description = 'Reorder layers';
  private pageId: string;
  private beforeNodes: ChigmaNode[];
  private afterNodes: ChigmaNode[];
  private setNodesFn: (pageId: string, nodes: ChigmaNode[]) => void;

  constructor(
    pageId: string,
    beforeNodes: ChigmaNode[],
    afterNodes: ChigmaNode[],
    setNodesFn: (pageId: string, nodes: ChigmaNode[]) => void
  ) {
    this.pageId = pageId;
    this.beforeNodes = beforeNodes;
    this.afterNodes = afterNodes;
    this.setNodesFn = setNodesFn;
  }

  execute(): void {
    this.setNodesFn(this.pageId, this.afterNodes);
  }

  undo(): void {
    this.setNodesFn(this.pageId, this.beforeNodes);
  }
}
