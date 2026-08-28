import { describe, it, expect, beforeEach } from 'vitest';
import type { ChigmaDocument } from '../models/document';
import {
  saveCrashRecoverySnapshot,
  getCrashRecoverySnapshot,
  clearCrashRecoverySnapshot,
  getStorageQuotaInfo
} from '../persistence/storageManager';

describe('Storage & Crash Recovery Engine', () => {
  beforeEach(() => {
    clearCrashRecoverySnapshot();
  });

  it('saves and retrieves crash recovery snapshot from storage', () => {
    const doc: ChigmaDocument = {
      id: 'doc_recovery_test',
      name: 'Unsaved Crash Test',
      version: 2,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      pages: []
    };

    saveCrashRecoverySnapshot(doc);

    const snapshot = getCrashRecoverySnapshot();
    expect(snapshot).not.toBeNull();
    expect(snapshot?.document.id).toBe('doc_recovery_test');
    expect(snapshot?.document.name).toBe('Unsaved Crash Test');
    expect(snapshot?.timestamp).toBeGreaterThan(0);
  });

  it('clears crash recovery snapshot on dismissal or project save', () => {
    const doc: ChigmaDocument = {
      id: 'doc_recovery_test_2',
      name: 'Test Project',
      version: 2,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      pages: []
    };

    saveCrashRecoverySnapshot(doc);
    expect(getCrashRecoverySnapshot()).not.toBeNull();

    clearCrashRecoverySnapshot();
    expect(getCrashRecoverySnapshot()).toBeNull();
  });

  it('estimates storage quota safely without crashing', async () => {
    const info = await getStorageQuotaInfo();
    expect(info.quotaBytes).toBeGreaterThan(0);
    expect(info.percentage).toBeGreaterThanOrEqual(0);
  });
});
