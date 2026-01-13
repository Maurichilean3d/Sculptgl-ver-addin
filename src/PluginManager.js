import PluginStore from './plugins/PluginStore';

function _nowISO() {
  try { return new Date().toISOString(); } catch (e) { return ''; }
}

function _safeNameFromUrl(url) {
  try {
    const parsed = new URL(url, window.location.href);
    const name = parsed.pathname.split('/').pop() || parsed.hostname;
    return name || 'plugin';
  } catch (e) {
    return 'plugin';
  }
}

function _idFromUrl(url) {
  return `url:${url}`;
}

function _randomId(prefix) {
  if (window.crypto && window.crypto.randomUUID) {
    return `${prefix}:${window.crypto.randomUUID()}`;
  }
  return `${prefix}:${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

class PluginManager {
  constructor(scene) {
    this.scene = scene;
    this._plugins = new Map();
    this._meta = new Map();
    this._loading = new Map();
    this._activePluginId = null;
    this._persistKey = 'sculptgl_active_plugin';
  }

  register(id, plugin, meta = null) {
    if (!id || !plugin) return false;
    this._plugins.set(id, plugin);
    if (meta) this._meta.set(id, meta);
    const displayName = (meta && meta.name) || plugin.name || id;
    console.log(`[PluginManager] Registered plugin: ${displayName}`);
    return true;
  }

  async installFromUrl(url) {
    const trimmed = (url || '').trim();
    if (!trimmed) throw new Error('Empty plugin URL');

    const meta = {
      id: _idFromUrl(trimmed),
      name: _safeNameFromUrl(trimmed),
      type: 'url',
      source: trimmed,
      enabled: true,
      updatedAt: _nowISO()
    };

    PluginStore.upsertMeta(meta);
    await this._loadAndRegister(meta);
  }

  async installFromFile(file) {
    if (!file) throw new Error('No plugin file provided');

    const code = typeof file.text === 'function'
      ? await file.text()
      : await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (evt) => resolve(evt.target.result || '');
        reader.onerror = () => reject(reader.error || new Error('Failed to read file'));
        reader.readAsText(file);
      });

    const meta = {
      id: _randomId('file'),
      name: file.name || 'plugin',
      type: 'file',
      source: file.name || 'archivo',
      enabled: true,
      updatedAt: _nowISO()
    };

    PluginStore.upsertMeta(meta);
    await PluginStore.putCode(meta.id, code);
    await this._loadAndRegister(meta);
  }

  listInstalled() {
    return PluginStore.loadMetaList();
  }

  async setEnabled(id, enabled) {
    const list = PluginStore.loadMetaList();
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) return;

    list[idx] = { ...list[idx], enabled: !!enabled, updatedAt: _nowISO() };
    PluginStore.saveMetaList(list);

    if (!enabled) {
      if (this._activePluginId === id) {
        this.deactivate();
      }
      this._plugins.delete(id);
      this._meta.delete(id);
      this._loading.delete(id);
      return;
    }

    await this._loadAndRegister(list[idx]);
  }

  async uninstall(id) {
    if (this._activePluginId === id) {
      this.deactivate();
    }
    this._plugins.delete(id);
    this._meta.delete(id);
    this._loading.delete(id);
    PluginStore.deleteMeta(id);
    await PluginStore.deleteCode(id);
  }

  async clearAll() {
    this.deactivate();
    this._plugins.clear();
    this._meta.clear();
    this._loading.clear();
    await PluginStore.clearAll();
  }

  async loadPersisted() {
    const list = PluginStore.loadMetaList();
    this._meta.clear();

    const enabledList = list.filter((p) => p && p.enabled);
    for (const meta of enabledList) {
      await this._loadAndRegister(meta);
    }

    const saved = this._safeGetStorage(this._persistKey);
    if (saved && this._plugins.has(saved)) {
      this.activate(saved);
      return;
    }

    if (saved) this._safeRemoveStorage(this._persistKey);
  }

  activate(id) {
    if (!this._plugins.has(id)) {
      console.warn(`[PluginManager] Plugin not found: ${id}`);
      return false;
    }

    if (this._activePluginId) {
      const current = this._plugins.get(this._activePluginId);
      if (current && current.onDeactivate) current.onDeactivate();
    }

    this._activePluginId = id;
    const plugin = this._plugins.get(id);

    if (plugin && plugin.onActivate) {
      plugin.onActivate();
    }

    this._persistActive();
    console.log(`[PluginManager] Activated plugin: ${id}`);
    return true;
  }

  deactivate() {
    if (!this._activePluginId) return;
    const plugin = this._plugins.get(this._activePluginId);
    if (plugin && plugin.onDeactivate) {
      plugin.onDeactivate();
    }
    this._activePluginId = null;
    this._persistActive();
    console.log('[PluginManager] Deactivated all plugins');
  }

  getActivePlugin() {
    if (!this._activePluginId) return null;
    return this._plugins.get(this._activePluginId);
  }

  getPluginNames() {
    return Array.from(this._plugins.keys());
  }

  hasActivePlugin() {
    return this._activePluginId !== null;
  }

  tryHandleInput(type, input, picking) {
    const plugin = this.getActivePlugin();

    if (!plugin) return false;

    if (typeof plugin.onInput !== 'function') {
      console.warn('[PluginManager] Active plugin has no onInput method');
      return false;
    }

    try {
      const handled = plugin.onInput(type, input, picking);
      return handled === true;
    } catch (error) {
      console.error('[PluginManager] Plugin error:', error);
      return false;
    }
  }

  onRender() {
    const plugin = this.getActivePlugin();
    if (plugin && typeof plugin.onRender === 'function') {
      try {
        plugin.onRender();
      } catch (error) {
        console.error('[PluginManager] Plugin render error:', error);
      }
    }
  }

  onToolChange(toolId) {
    const plugin = this.getActivePlugin();
    if (plugin && typeof plugin.onToolChange === 'function') {
      try {
        plugin.onToolChange(toolId);
      } catch (error) {
        console.error('[PluginManager] Plugin tool change error:', error);
      }
    }
  }

  dispose() {
    for (const plugin of this._plugins.values()) {
      if (plugin && plugin.dispose) plugin.dispose();
    }
    this._plugins.clear();
    this._meta.clear();
    this._activePluginId = null;
  }

  async _loadAndRegister(meta) {
    if (!meta || !meta.id) return null;

    if (this._plugins.has(meta.id)) {
      return this._plugins.get(meta.id);
    }

    if (this._loading.has(meta.id)) {
      return this._loading.get(meta.id);
    }

    const promise = (async () => {
      const mod = await this._loadModule(meta);
      const plugin = this._createPluginInstance(mod, meta);
      if (!plugin) return null;

      if (!meta.name && plugin.name) {
        meta.name = plugin.name;
        PluginStore.upsertMeta(meta);
      }

      this.register(meta.id, plugin, meta);
      return plugin;
    })();

    this._loading.set(meta.id, promise);
    try {
      const plugin = await promise;
      return plugin;
    } finally {
      this._loading.delete(meta.id);
    }
  }

  async _loadModule(meta) {
    if (meta.type === 'url') {
      return import(/* webpackIgnore: true */ meta.source);
    }

    const code = await PluginStore.getCode(meta.id);
    if (!code) throw new Error('Plugin code not found');

    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    try {
      return await import(/* webpackIgnore: true */ url);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  _createPluginInstance(mod, meta) {
    if (!mod) return null;

    const exported = mod.default || mod.plugin || mod.Plugin || mod;

    if (!exported) return null;

    if (typeof exported === 'function') {
      if (exported.prototype && (exported.prototype.onInput || exported.prototype.onActivate)) {
        return new exported(this.scene, meta);
      }
      return exported(this.scene, meta);
    }

    if (typeof exported === 'object') {
      return exported;
    }

    return null;
  }

  _persistActive() {
    try {
      if (this._activePluginId) {
        window.localStorage.setItem(this._persistKey, this._activePluginId);
      } else {
        window.localStorage.removeItem(this._persistKey);
      }
    } catch (e) {
      // ignore storage errors
    }
  }

  _safeGetStorage(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  _safeRemoveStorage(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      // ignore
    }
  }
}

export default PluginManager;
