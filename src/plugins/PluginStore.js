/**
 * PluginStore
 * - Metadata in localStorage
 * - Optional plugin code in IndexedDB (for "installed from file" plugins)
 */
const LS_KEY = 'sculptgl.plugins.v1';

const DB_NAME = 'sculptgl-plugin-store';
const DB_VERSION = 1;
const STORE_NAME = 'plugins';

function _nowISO() {
  try { return new Date().toISOString(); } catch (e) { return ''; }
}

function _safeJSONParse(str, fallback) {
  try { return JSON.parse(str); } catch (e) { return fallback; }
}

function _openDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) return reject(new Error('IndexedDB not available'));
    const req = window.indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('Failed to open IndexedDB'));
  });
}

function _tx(db, mode) {
  const t = db.transaction(STORE_NAME, mode);
  return { tx: t, store: t.objectStore(STORE_NAME) };
}

async function _idbGet(id) {
  const db = await _openDB();
  return new Promise((resolve, reject) => {
    const { tx, store } = _tx(db, 'readonly');
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
  });
}

async function _idbPut(record) {
  const db = await _openDB();
  return new Promise((resolve, reject) => {
    const { tx, store } = _tx(db, 'readwrite');
    const req = store.put(record);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
  });
}

async function _idbDelete(id) {
  const db = await _openDB();
  return new Promise((resolve, reject) => {
    const { tx, store } = _tx(db, 'readwrite');
    const req = store.delete(id);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => db.close();
  });
}

class PluginStore {
  static loadMetaList() {
    try {
      const raw = window.localStorage.getItem(LS_KEY);
      const list = _safeJSONParse(raw, []);
      return Array.isArray(list) ? list : [];
    } catch (e) {
      // Safari/iOS puede lanzar en algunos contextos (modo privado, restricciones)
      return [];
    }
  }

  static saveMetaList(list) {
    try {
      window.localStorage.setItem(LS_KEY, JSON.stringify(list || []));
    } catch (e) {
      // ignorar: si no hay storage, al menos evitamos romper el arranque
    }
  }

  static upsertMeta(meta) {
    const list = PluginStore.loadMetaList();
    const idx = list.findIndex(p => p.id === meta.id);
    if (idx >= 0) list[idx] = meta;
    else list.push(meta);
    PluginStore.saveMetaList(list);
    return meta;
  }

  static deleteMeta(id) {
    const list = PluginStore.loadMetaList().filter(p => p.id !== id);
    PluginStore.saveMetaList(list);
  }

  static async putCode(id, code) {
    const rec = { id, code: code || '', updatedAt: _nowISO() };
    await _idbPut(rec);
  }

  static async getCode(id) {
    try {
      const rec = await _idbGet(id);
      return rec ? rec.code : null;
    } catch (e) {
      return null;
    }
  }

  static async deleteCode(id) {
    try { await _idbDelete(id); } catch (e) { /* ignore */ }
  }

  static clearAllMeta() {
    PluginStore.saveMetaList([]);
  }

  static async clearAllCode() {
    try {
      if (window.indexedDB && window.indexedDB.deleteDatabase) {
        window.indexedDB.deleteDatabase(DB_NAME);
      }
    } catch (e) {
      // ignore
    }
  }

  static async clearAll() {
    PluginStore.clearAllMeta();
    await PluginStore.clearAllCode();
  }
}

export default PluginStore;
