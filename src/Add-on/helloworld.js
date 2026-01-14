/**
 * HelloWorld Plugin - Plugin simple para verificar el sistema de plugins
 * Este plugin muestra mensajes en consola y cuenta los clicks del usuario.
 */

import Plugin from '../plugins/Plugin';

class HelloWorldPlugin extends Plugin {
  constructor(scene) {
    super(scene);
    this.name = 'HelloWorld';

    // Contador de clicks
    this.clickCount = 0;
    this.moveCount = 0;

    console.log('🎨 HelloWorld Plugin: Constructor ejecutado');
  }

  onActivate() {
    super.onActivate();
    console.log('✅ HelloWorld Plugin: ACTIVADO');
    console.log('👆 Haz click en el canvas para ver eventos...');

    // Resetear contadores
    this.clickCount = 0;
    this.moveCount = 0;
  }

  onDeactivate() {
    super.onDeactivate();
    console.log('❌ HelloWorld Plugin: DESACTIVADO');
    console.log(`📊 Estadísticas: ${this.clickCount} clicks, ${this.moveCount} movimientos`);
  }

  /**
   * Maneja eventos de input
   * @param {string} type - 'start', 'move', 'end'
   * @param {Object} input - { x, y, buttons, pressure, pointerType, ... }
   * @param {Object} picking - Resultado del picking
   */
  onInput(type, input, picking) {
    if (!this.enabled) return false;

    // Obtener información del mesh si hay picking
    const mesh = picking ? picking.getMesh() : null;
    const meshName = mesh ? mesh.getName() : 'ninguno';

    if (type === 'start') {
      this.clickCount++;
      console.log(`🖱️ CLICK #${this.clickCount}`);
      console.log(`   Posición: (${input.x.toFixed(3)}, ${input.y.toFixed(3)})`);
      console.log(`   Presión: ${input.pressure || 'N/A'}`);
      console.log(`   Mesh: ${meshName}`);

      if (mesh && picking.getIntersectionPoint) {
        const point = picking.getIntersectionPoint();
        console.log(`   Punto 3D: (${point[0].toFixed(2)}, ${point[1].toFixed(2)}, ${point[2].toFixed(2)})`);
      }

      return true; // Consumir el evento
    }

    if (type === 'move') {
      this.moveCount++;

      // Mostrar cada 50 movimientos para no saturar la consola
      if (this.moveCount % 50 === 0) {
        console.log(`🖱️ MOVIMIENTO #${this.moveCount} en (${input.x.toFixed(3)}, ${input.y.toFixed(3)})`);
      }

      return true; // Consumir el evento
    }

    if (type === 'end') {
      console.log(`✋ FIN de interacción - Total movimientos: ${this.moveCount}`);
      this.moveCount = 0;
      return true;
    }

    return false;
  }

  onRender() {
    // Hook de renderizado - se ejecuta cada frame
    // Por ahora solo verificamos que se llama
    // Descomenta la siguiente línea si quieres ver cuántas veces se renderiza
    // console.log('🎬 Render frame');
  }

  onToolChange(toolId) {
    console.log(`🔧 Herramienta cambiada a: ${toolId}`);
  }

  dispose() {
    console.log('🧹 HelloWorld Plugin: Limpieza y dispose');
    super.dispose();
  }

  // Métodos adicionales de utilidad
  getStats() {
    return {
      clicks: this.clickCount,
      moves: this.moveCount,
      enabled: this.enabled
    };
  }

  resetStats() {
    this.clickCount = 0;
    this.moveCount = 0;
    console.log('📊 Estadísticas reseteadas');
  }
}

export default HelloWorldPlugin;
