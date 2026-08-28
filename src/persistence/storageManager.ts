import type { ChigmaDocument } from '../models/document';

const RECOVERY_KEY = 'chigma_crash_recovery_snapshot';

// In-memory fallback if localStorage is unavailable or in Node/Vitest
let memoryStore: Record<string, string> = {};

export interface StorageQuotaInfo {
  usedBytes: number;
  quotaBytes: number;
  percentage: number;
  isPressure: boolean;
}

/**
 * Queries the browser StorageManager API for IndexedDB storage estimates.
 */
export async function getStorageQuotaInfo(): Promise<StorageQuotaInfo> {
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      const used = estimate.usage || 0;
      const quota = estimate.quota || (1024 * 1024 * 1024); // default 1GB fallback
      const pct = quota > 0 ? (used / quota) * 100 : 0;
      return {
        usedBytes: used,
        quotaBytes: quota,
        percentage: Math.round(pct * 10) / 10,
        isPressure: pct > 80
      };
    } catch (e) {
      // ignore error
    }
  }

  return {
    usedBytes: 1024 * 1024 * 3, // ~3MB default fallback
    quotaBytes: 1024 * 1024 * 1024,
    percentage: 0.3,
    isPressure: false
  };
}

/**
 * Saves a crash recovery snapshot to localStorage before critical actions or on autosave.
 */
export function saveCrashRecoverySnapshot(document: ChigmaDocument): void {
  const payload = {
    timestamp: Date.now(),
    document
  };
  const str = JSON.stringify(payload);
  memoryStore[RECOVERY_KEY] = str;

  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(RECOVERY_KEY, str);
    } catch (e) {
      // ignore quota error
    }
  }
}

/**
 * Retrieves the last crash recovery snapshot if available.
 */
export function getCrashRecoverySnapshot(): { timestamp: number; document: ChigmaDocument } | null {
  try {
    let raw: string | null = null;
    if (typeof localStorage !== 'undefined') {
      raw = localStorage.getItem(RECOVERY_KEY);
    }
    if (!raw) {
      raw = memoryStore[RECOVERY_KEY] || null;
    }
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

/**
 * Clears the crash recovery snapshot.
 */
export function clearCrashRecoverySnapshot(): void {
  delete memoryStore[RECOVERY_KEY];
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.removeItem(RECOVERY_KEY);
    } catch (e) {
      // ignore
    }
  }
}
