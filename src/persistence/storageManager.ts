import type { ChigmaDocument } from '../models/document';

const RECOVERY_KEY = 'chigma_crash_recovery_snapshot';

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
  if (navigator.storage && navigator.storage.estimate) {
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
  try {
    const payload = {
      timestamp: Date.now(),
      document
    };
    localStorage.setItem(RECOVERY_KEY, JSON.stringify(payload));
  } catch (e) {
    // ignore quota error for fallback snapshot
  }
}

/**
 * Retrieves the last crash recovery snapshot if available.
 */
export function getCrashRecoverySnapshot(): { timestamp: number; document: ChigmaDocument } | null {
  try {
    const raw = localStorage.getItem(RECOVERY_KEY);
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
  try {
    localStorage.removeItem(RECOVERY_KEY);
  } catch (e) {
    // ignore
  }
}
