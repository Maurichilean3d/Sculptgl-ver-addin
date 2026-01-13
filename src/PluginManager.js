/**

- PluginManager - Sistema de plugins NO-INVASIVO para SculptGL
- 
- En lugar de interceptar TODOS los eventos, este sistema:
- 1. Solo se activa cuando el usuario toca la malla (después del picking)
- 1. Permite que plugins “opten” por manejar el evento
- 1. Fallback automático a escultura si el plugin no maneja
   */

class PluginManager {
constructor(scene) {
this.scene = scene;
this._plugins = new Map();
this._activePluginName = null;
this._persistKey = ‘sculptgl_active_plugin’;
}

/**

- Registrar un nuevo plugin
- @param {string} name - Nombre único del plugin
- @param {Plugin} plugin - Instancia del plugin
  */
  register(name, plugin) {
  this._plugins.set(name, plugin);
  console.log(`[PluginManager] Registered plugin: ${name}`);
  }

/**

- Activar un plugin específico
- @param {string} name - Nombre del plugin a activar
  */
  activate(name) {
  if (!this._plugins.has(name)) {
  console.warn(`[PluginManager] Plugin not found: ${name}`);
  return false;
  }

```
// Desactivar plugin actual
if (this._activePluginName) {
  const currentPlugin = this._plugins.get(this._activePluginName);
  if (currentPlugin && currentPlugin.onDeactivate) {
    currentPlugin.onDeactivate();
  }
}

// Activar nuevo plugin
this._activePluginName = name;
const plugin = this._plugins.get(name);

if (plugin && plugin.onActivate) {
  plugin.onActivate();
}

this._persist();
console.log(`[PluginManager] Activated plugin: ${name}`);
return true;
```

}

/**

- Desactivar plugin actual (volver a escultura normal)
  */
  deactivate() {
  if (this._activePluginName) {
  const plugin = this._plugins.get(this._activePluginName);
  if (plugin && plugin.onDeactivate) {
  plugin.onDeactivate();
  }
  this._activePluginName = null;
  this._persist();
  console.log(’[PluginManager] Deactivated all plugins’);
  }
  }

/**

- Obtener el plugin activo
  */
  getActivePlugin() {
  if (!this._activePluginName) return null;
  return this._plugins.get(this._activePluginName);
  }

/**

- Llamado cuando el usuario toca la malla (DESPUÉS del picking)
- 
- @param {string} type - ‘start’, ‘move’, ‘end’
- @param {Object} input - { x, y, buttons, pressure, … }
- @param {Object} picking - Objeto de picking con la malla intersectada
- @returns {boolean} true si el plugin manejó el evento
  */
  tryHandleInput(type, input, picking) {
  const plugin = this.getActivePlugin();

```
if (!plugin) {
  return false; // No hay plugin activo, continuar normal
}

if (typeof plugin.onInput !== 'function') {
  console.warn(`[PluginManager] Active plugin has no onInput method`);
  return false;
}

try {
  const handled = plugin.onInput(type, input, picking);
  return handled === true; // Explícitamente true
} catch (error) {
  console.error('[PluginManager] Plugin error:', error);
  return false; // En caso de error, continuar normal
}
```

}

/**

- Hook de renderizado (llamado cada frame)
  */
  onRender() {
  const plugin = this.getActivePlugin();
  if (plugin && typeof plugin.onRender === ‘function’) {
  try {
  plugin.onRender();
  } catch (error) {
  console.error(’[PluginManager] Plugin render error:’, error);
  }
  }
  }

/**

- Obtener lista de plugins registrados
  */
  getPluginNames() {
  return Array.from(this._plugins.keys());
  }

/**

- Verificar si hay un plugin activo
  */
  hasActivePlugin() {
  return this._activePluginName !== null;
  }

/**

- Persistir estado en localStorage
  */
  _persist() {
  try {
  if (this._activePluginName) {
  localStorage.setItem(this._persistKey, this._activePluginName);
  } else {
  localStorage.removeItem(this._persistKey);
  }
  } catch (e) {
  // Ignorar errores de localStorage
  }
  }

/**

- Cargar estado persistido
  */
  loadPersisted() {
  try {
  const saved = localStorage.getItem(this._persistKey);
  if (saved && this._plugins.has(saved)) {
  this.activate(saved);
  }
  } catch (e) {
  // Ignorar errores de localStorage
  }
  }

/**

- Limpiar todos los plugins
  */
  dispose() {
  for (const [name, plugin] of this._plugins.entries()) {
  if (plugin && plugin.dispose) {
  plugin.dispose();
  }
  }
  this._plugins.clear();
  this._activePluginName = null;
  }
  }

export default PluginManager;