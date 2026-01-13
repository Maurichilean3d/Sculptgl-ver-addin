/**

- Plugin - Clase base para plugins de SculptGL
- 
- Los plugins extienden esta clase e implementan los métodos que necesiten
  */

class Plugin {
constructor(scene) {
this.scene = scene;
this.enabled = false;
this.name = ‘BasePlugin’;
}

/**

- Llamado cuando el plugin se activa
  */
  onActivate() {
  this.enabled = true;
  console.log(`[${this.name}] Activated`);
  }

/**

- Llamado cuando el plugin se desactiva
  */
  onDeactivate() {
  this.enabled = false;
  console.log(`[${this.name}] Deactivated`);
  }

/**

- Llamado cuando el usuario interactúa con la malla (DESPUÉS del picking)
- 
- @param {string} type - ‘start’, ‘move’, ‘end’
- @param {Object} input - { x, y, buttons, pressure, pointerType, … }
- @param {Object} picking - Resultado del picking
- - picking.getMesh() - Malla intersectada
- - picking.getPickedFace() - Índice de cara
- - picking.getIntersectionPoint() - Punto 3D
- - picking.getIntersectionNormal() - Normal en el punto
- 
- @returns {boolean} true si manejaste el evento, false para fallback a escultura
  */
  onInput(type, input, picking) {
  return false; // Por defecto, no maneja nada
  }

/**

- Llamado cada frame (para renderizado custom)
  */
  onRender() {
  // Override en subclase si necesitas renderizar algo
  }

/**

- Cleanup
  */
  dispose() {
  this.enabled = false;
  }
  }

export default Plugin;