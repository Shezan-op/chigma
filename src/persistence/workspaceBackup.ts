import { db } from './db';

export interface WorkspaceBackupPayload {
  version: number;
  exportedAt: number;
  projects: any[];
  preferences: Record<string, any>;
}

/**
 * Exports all local projects and user preferences to a JSON backup bundle.
 */
export async function exportWorkspaceBackup(): Promise<string> {
  const allProjects = await db.projects.toArray();
  const allPrefs = await db.preferences.toArray();

  const prefsMap: Record<string, any> = {};
  allPrefs.forEach((p) => {
    prefsMap[p.key] = p.value;
  });

  const payload: WorkspaceBackupPayload = {
    version: 2,
    exportedAt: Date.now(),
    projects: allProjects,
    preferences: prefsMap
  };

  return JSON.stringify(payload, null, 2);
}

/**
 * Restores a workspace backup into local IndexedDB storage.
 */
export async function importWorkspaceBackup(jsonContent: string): Promise<{ restoredCount: number }> {
  const parsed: WorkspaceBackupPayload = JSON.parse(jsonContent);
  if (!parsed.projects || !Array.isArray(parsed.projects)) {
    throw new Error('Invalid workspace backup format');
  }

  let count = 0;
  for (const proj of parsed.projects) {
    await db.projects.put(proj);
    count++;
  }

  if (parsed.preferences) {
    for (const [key, value] of Object.entries(parsed.preferences)) {
      await db.preferences.put({ key, value });
    }
  }

  return { restoredCount: count };
}

/**
 * Estimates local storage space used by projects and assets.
 */
export async function estimateStorageUsage(): Promise<{ totalBytes: number; projectCount: number }> {
  const allProjects = await db.projects.toArray();
  const rawString = JSON.stringify(allProjects);
  return {
    totalBytes: new Blob([rawString]).size,
    projectCount: allProjects.length
  };
}
