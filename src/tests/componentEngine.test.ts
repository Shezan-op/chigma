import { describe, it, expect } from 'vitest';
import { createDefaultNode } from '../models/document';
import {
  createComponentMaster,
  createInstanceFromMaster,
  detachInstance,
  syncInstanceWithMaster
} from '../engine/components/componentEngine';

describe('Component System & Instance Engine', () => {
  it('converts a node into a Master Component with ❖ prefix', () => {
    const buttonNode = createDefaultNode('button', 100, 100, { label: 'Submit Order' });
    const { master, updatedNode } = createComponentMaster(buttonNode, 'Button / Primary');

    expect(master.name).toBe('Button / Primary');
    expect(updatedNode.isComponent).toBe(true);
    expect(updatedNode.name).toContain('❖ Button / Primary');
    expect(updatedNode.componentId).toBe(master.id);
  });

  it('creates an instance linked to the master component', () => {
    const box = createDefaultNode('rectangle', 0, 0, { fill: '#3B82F6', width: 200 });
    const { master, updatedNode } = createComponentMaster(box, 'Hero Box');

    const instance = createInstanceFromMaster(master, updatedNode, 300, 400);
    expect(instance.instanceOf).toBe(master.id);
    expect(instance.x).toBe(300);
    expect(instance.y).toBe(400);
    expect(instance.name).toContain('◇ Hero Box');
  });

  it('preserves overrides when syncing instances with modified master component', () => {
    const box = createDefaultNode('rectangle', 0, 0, { fill: '#3B82F6', width: 200 });
    const { master, updatedNode } = createComponentMaster(box, 'Card');

    const instance = createInstanceFromMaster(master, updatedNode, 10, 10);
    // User overrides the fill on the instance
    instance.overrides = { fill: '#EF4444' };

    // Now designer updates master width from 200 to 320
    const modifiedMaster = { ...updatedNode, width: 320 };

    const synced = syncInstanceWithMaster(instance, modifiedMaster);
    expect(synced.width).toBe(320); // inherited change from master
    expect(synced.fill).toBe('#EF4444'); // overridden property preserved!
  });

  it('detaches an instance safely preserving visual properties and removing linkage', () => {
    const card = createDefaultNode('card', 50, 50);
    const { master, updatedNode } = createComponentMaster(card, 'Card');
    const instance = createInstanceFromMaster(master, updatedNode, 100, 100);

    const detached = detachInstance(instance);
    expect(detached.instanceOf).toBeUndefined();
    expect(detached.name).toBe('Card');
    expect(detached.width).toBe(card.width);
  });
});
