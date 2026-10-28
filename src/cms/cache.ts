// Browser copy of the last published snapshot, so a repeat visit only has to
// ask the database what changed (see hydrate.ts).
//
// Every content table carries an `updated_at` maintained by a trigger, so
// `${row count}:${latest updated_at}` identifies a table's published state.
// Hydrate compares that against the server before trusting a cached table, so
// nothing here is ever shown without the server confirming it is current.

import type { CmsPages, CmsTables } from './store';

const DB_NAME = 'vkv-cms';
const STORE = 'snapshot';
const RECORD_KEY = 'published';

export type CachedTable<K extends keyof CmsTables = keyof CmsTables> = {
  sig: string;
  rows: CmsTables[K];
};

export type CmsCache = {
  /** Bumped whenever the shape of what hydrate stores changes. */
  version: string;
  tables: { [K in keyof CmsTables]?: CachedTable<K> };
  pages: { sig: string; data: CmsPages } | null;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB open failed'));
    request.onblocked = () => reject(new Error('IndexedDB blocked'));
  });
}

/** The cached snapshot, or null when there is none or it predates `version`. */
export async function readCache(version: string): Promise<CmsCache | null> {
  try {
    const db = await openDb();
    const value = await new Promise<unknown>((resolve, reject) => {
      const request = db.transaction(STORE, 'readonly').objectStore(STORE).get(RECORD_KEY);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    db.close();
    const cache = value as CmsCache | undefined;
    return cache && cache.version === version && cache.tables ? cache : null;
  } catch {
    return null;
  }
}

export async function writeCache(cache: CmsCache): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE, 'readwrite');
      transaction.objectStore(STORE).put(cache, RECORD_KEY);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
    db.close();
  } catch {
    // Private mode or quota: the next visit simply fetches everything again.
  }
}
