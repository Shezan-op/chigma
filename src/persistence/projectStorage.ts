import { db, type StoredProject } from './db';
import { type ChigmaDocument, type ProjectMetadata, createDefaultDocument } from '../models/document';

export async function getAllProjects(): Promise<ProjectMetadata[]> {
  try {
    const records = await db.projects.orderBy('updatedAt').reverse().toArray();
    return records.map(p => ({
      id: p.id,
      name: p.name,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      pageCount: p.document.pages ? p.document.pages.length : 1,
      nodeCount: p.document.pages
        ? p.document.pages.reduce((acc, page) => acc + (page.children ? page.children.length : 0), 0)
        : 0,
      previewThumbnail: p.previewThumbnail
    }));
  } catch (err) {
    console.error('Failed to list projects from IndexedDB:', err);
    return [];
  }
}

export async function getProjectById(id: string): Promise<ChigmaDocument | null> {
  try {
    const record = await db.projects.get(id);
    return record ? record.document : null;
  } catch (err) {
    console.error(`Failed to get project ${id} from IndexedDB:`, err);
    return null;
  }
}

export async function saveProject(
  doc: ChigmaDocument,
  previewThumbnail?: string
): Promise<void> {
  try {
    const existing = await db.projects.get(doc.id);
    const now = Date.now();
    const stored: StoredProject = {
      id: doc.id,
      name: doc.name,
      createdAt: existing ? existing.createdAt : doc.createdAt || now,
      updatedAt: now,
      document: {
        ...doc,
        updatedAt: now
      },
      previewThumbnail: previewThumbnail || existing?.previewThumbnail
    };

    await db.projects.put(stored);
  } catch (err) {
    console.error(`Failed to save project ${doc.id} to IndexedDB:`, err);
    throw err;
  }
}

export async function createNewProject(name = 'Untitled Design'): Promise<ChigmaDocument> {
  const newDoc = createDefaultDocument(name);
  await saveProject(newDoc);
  return newDoc;
}

export async function duplicateProject(id: string): Promise<ChigmaDocument | null> {
  const original = await getProjectById(id);
  if (!original) return null;

  const now = Date.now();
  const newDoc: ChigmaDocument = {
    ...JSON.parse(JSON.stringify(original)),
    id: `doc_${now}_${Math.random().toString(36).slice(2, 7)}`,
    name: `${original.name} (Copy)`,
    createdAt: now,
    updatedAt: now
  };

  await saveProject(newDoc);
  return newDoc;
}

export async function renameProject(id: string, newName: string): Promise<boolean> {
  const existing = await db.projects.get(id);
  if (!existing) return false;

  const updatedDoc: ChigmaDocument = {
    ...existing.document,
    name: newName,
    updatedAt: Date.now()
  };

  await db.projects.put({
    ...existing,
    name: newName,
    updatedAt: Date.now(),
    document: updatedDoc
  });

  return true;
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    await db.projects.delete(id);
    return true;
  } catch (err) {
    console.error(`Failed to delete project ${id} from IndexedDB:`, err);
    return false;
  }
}
