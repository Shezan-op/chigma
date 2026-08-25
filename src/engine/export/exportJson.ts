import type { ChigmaDocument } from '../../models/document';
import { downloadFile, readFileAsText } from '../../utils/file';

export function exportDocumentToJson(doc: ChigmaDocument): void {
  const jsonString = JSON.stringify(doc, null, 2);
  const cleanName = (doc.name || 'untitled').toLowerCase().replace(/[^a-z0-9-_]/g, '-');
  const filename = `${cleanName}.chigma.json`;
  downloadFile(jsonString, filename, 'application/json');
}

export async function importDocumentFromJson(file: File): Promise<ChigmaDocument> {
  const content = await readFileAsText(file);
  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('Invalid JSON format: Could not parse project file.');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid Chigma document: File does not contain a valid JSON object.');
  }

  if (!parsed.pages || !Array.isArray(parsed.pages) || parsed.pages.length === 0) {
    throw new Error('Invalid Chigma document: No pages found in document.');
  }

  const document: ChigmaDocument = {
    id: parsed.id || `doc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: parsed.name || 'Imported Design',
    version: parsed.version || 1,
    createdAt: parsed.createdAt || Date.now(),
    updatedAt: Date.now(),
    pages: parsed.pages.map((p: any, idx: number) => ({
      id: p.id || `page_${idx}_${Date.now()}`,
      name: p.name || `Page ${idx + 1}`,
      background: p.background || '#FFFFFF',
      children: Array.isArray(p.children) ? p.children : []
    }))
  };

  return document;
}
