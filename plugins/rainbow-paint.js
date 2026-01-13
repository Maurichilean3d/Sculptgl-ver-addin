/**
 * Rainbow Paint Plugin - Ejemplo de Plugin para SculptGL
 *
 * Este plugin demuestra cómo extender SculptGL con nuevas herramientas.
 * Agrega una herramienta de "pintura arcoíris" que pinta la malla con
 * colores del arcoíris mientras arrastras el cursor/dedo.
 *
 * Uso:
 * 1. Cargar este archivo desde Add-ons → "Desde archivo (.js)"
 * 2. Activar el plugin desde Add-ons → "Administrar plugins..."
 * 3. Hacer clic/tocar y arrastrar sobre la malla para pintar
 */

class RainbowPaintPlugin {
  constructor(scene, meta) {
    this.scene = scene;
    this.meta = meta;
    this.name = 'Rainbow Paint';
    this.description = 'Pinta la malla con colores del arcoíris';

    // Estado interno
    this.isActive = false;
    this.isPainting = false;
    this.hue = 0; // Para el efecto arcoíris (0-360)
    this.paintRadius = 50; // Radio de pintura en píxeles

    console.log('[Rainbow Paint] Plugin inicializado');
  }

  /**
   * Llamado cuando el plugin se activa
   */
  onActivate() {
    this.isActive = true;
    this.hue = 0;
    console.log('[Rainbow Paint] Plugin activado - ¡Toca y arrastra para pintar!');

    // Mostrar mensaje al usuario
    if (window.alert) {
      window.alert('Rainbow Paint activado!\n\nToca/clic y arrastra sobre la malla para pintar con colores del arcoíris.');
    }
  }

  /**
   * Llamado cuando el plugin se desactiva
   */
  onDeactivate() {
    this.isActive = false;
    this.isPainting = false;
    console.log('[Rainbow Paint] Plugin desactivado');
  }

  /**
   * Maneja eventos de entrada (mouse/touch)
   * @param {string} type - 'start', 'move', 'end', 'hover'
   * @param {object} input - Datos del input (x, y, buttons, etc.)
   * @param {object} picking - Sistema de picking para detectar intersección
   * @returns {boolean} true si el evento fue manejado
   */
  onInput(type, input, picking) {
    if (!this.isActive) return false;

    const mesh = this.scene.getMesh();
    if (!mesh) return false;

    // Detectar intersección con la malla
    const intersected = picking.intersectionMouseMeshes();

    if (type === 'start' && intersected) {
      this.isPainting = true;
      this._paintAtPosition(picking);
      return true;
    }

    if (type === 'move' && this.isPainting) {
      if (intersected) {
        this._paintAtPosition(picking);
      }
      return true;
    }

    if (type === 'end') {
      this.isPainting = false;
      return true;
    }

    return false;
  }

  /**
   * Pinta en la posición actual del picking
   * @private
   */
  _paintAtPosition(picking) {
    const mesh = picking.getMesh();
    if (!mesh) return;

    try {
      // Obtener vértices afectados en el radio de pintura
      const iVertsInRadius = picking.getPickedVertices();
      if (!iVertsInRadius || iVertsInRadius.length === 0) return;

      // Obtener arrays de colores
      const colors = mesh.getColors();
      if (!colors) {
        console.warn('[Rainbow Paint] Esta malla no soporta colores de vértice');
        return;
      }

      // Calcular color arcoíris actual
      const color = this._hslToRgb(this.hue / 360, 1.0, 0.5);

      // Pintar cada vértice en el radio
      for (let i = 0; i < iVertsInRadius.length; ++i) {
        const iVert = iVertsInRadius[i];
        const ind = iVert * 3;

        // Aplicar color
        colors[ind] = color[0];
        colors[ind + 1] = color[1];
        colors[ind + 2] = color[2];
      }

      // Incrementar hue para efecto arcoíris
      this.hue = (this.hue + 2) % 360;

      // Actualizar la malla
      mesh.updateGeometry(mesh.getFacesFromVertices(iVertsInRadius), iVertsInRadius);
      mesh.updateDuplicateColorsAndMaterials(iVertsInRadius);

      // Forzar render
      this.scene.render();

    } catch (error) {
      console.error('[Rainbow Paint] Error pintando:', error);
    }
  }

  /**
   * Convierte HSL a RGB
   * @private
   */
  _hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [r, g, b];
  }

  /**
   * Llamado en cada frame (opcional)
   */
  onRender() {
    // Aquí podrías dibujar overlays o efectos visuales
    // Para este ejemplo simple, no necesitamos nada
  }

  /**
   * Limpieza cuando se descarga el plugin
   */
  dispose() {
    this.isActive = false;
    this.isPainting = false;
    console.log('[Rainbow Paint] Plugin descargado');
  }
}

// Exportar el plugin
export default RainbowPaintPlugin;
