const DB_NAME = 'madiaba-cms';
const STORE = 'images';

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx(db, mode, run) {
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const result = run(t.objectStore(STORE));
    t.oncomplete = () => resolve(result?.result !== undefined ? result.result : undefined);
    t.onerror = () => reject(t.error);
  });
}

export async function idbPut(record) {
  const db = await openDb();
  return tx(db, 'readwrite', (store) => store.put(record));
}

export async function idbAll() {
  const db = await openDb();
  return tx(db, 'readonly', (store) => store.getAll());
}

export async function idbDelete(id) {
  const db = await openDb();
  return tx(db, 'readwrite', (store) => store.delete(id));
}

export async function idbClear() {
  const db = await openDb();
  return tx(db, 'readwrite', (store) => store.clear());
}
