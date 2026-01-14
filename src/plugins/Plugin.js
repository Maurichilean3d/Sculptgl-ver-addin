/**
 * Plugin - Clase base para plugins de SculptGL
 */
class Plugin {
  constructor(scene) {
    this.scene = scene;
    this.enabled = false;
    this.name = 'BasePlugin';
  }

  onActivate() {
    this.enabled = true;
    console.log(`[${this.name}] Activated`);
  }

  onDeactivate() {
    this.enabled = false;
    console.log(`[${this.name}] Deactivated`);
  }

  /**
   * @param {string} type - 'start', 'move', 'end'
   * @param {Object} input - { x, y, buttons, pressure, pointerType, ... }
   * @param {Object} picking - Resultado del picking
   */
  onInput(type, input, picking) {
    return false;
  }

  onRender() {
    // Override si necesitas renderizado custom
  }

  onToolChange(toolId) {
    // Override si necesitás reaccionar al cambio de herramienta
  }

  dispose() {
    this.enabled = false;
  }
}

export default Plugin;
