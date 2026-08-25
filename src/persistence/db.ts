import Dexie, { type EntityTable } from 'dexie';
import type { ChigmaDocument } from '../models/document';

export interface StoredProject {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  document: ChigmaDocument;
  previewThumbnail?: string;
}

export interface StoredPreference {
  key: string;
  value: unknown;
}

export class ChigmaDatabase extends Dexie {
  projects!: EntityTable<StoredProject, 'id'>;
  preferences!: EntityTable<StoredPreference, 'key'>;

  constructor() {
    super('ChigmaDB');
    this.version(1).stores({
      projects: 'id, name, createdAt, updatedAt',
      preferences: 'key'
    });
  }
}

export const db = new ChigmaDatabase();
