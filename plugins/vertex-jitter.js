/**
 * Vertex Jitter Plugin - Ejemplo de Plugin de Modificación de Geometría
 *
 * Este plugin demuestra cómo modificar la geometría de la malla.
 * Agrega una herramienta que desplaza aleatoriamente los vértices
 * para crear un efecto de "vibración" o textura rugosa.
 *
 * Uso:
 * 1. Cargar este archivo desde Add-ons → "Desde archivo (.js)"
 * 2. Activar el plugin desde Add-ons → "Administrar plugins..."
 * 3. Hacer clic/tocar sobre la malla para aplicar el efecto
 */

class VertexJitterPlugin {
  constructor(scene, meta) {
    this.scene = scene;
    this.meta = meta;
    this.name = 'Vertex Jitter';
    this.description = 'Desplaza vértices aleatoriamente para crear textura';

    // Parámetros del efecto
    this.strength = 0.05; // Intensidad del jitter
    this.isActive = false;
    this.isApplying = false;

    console.log('[Vertex Jitter] Plugin inicializado');
  }

  onActivate() {
    this.isActive = true;
    console.log('[Vertex Jitter] Plugin activado');

    if (window.alert) {
      window.alert(
        'Vertex Jitter activado!\n\n' +
        'Toca/clic sobre la malla para aplicar desplazamiento aleatorio a los vértices.\n' +
        'Mantén presionado y arrastra para aplicar continuamente.'
      );
    }
  }

  onDeactivate() {
    this.isActive = false;
    this.isApplying = false;
    console.log('[Vertex Jitter] Plugin desactivado');
  }

  onInput(type, input, picking) {
    if (!this.isActive) return false;

    const mesh = this.scene.getMesh();
    if (!mesh) return false;

    const intersected = picking.intersectionMouseMeshes();

    if (type === 'start' && intersected) {
      this.isApplying = true;
      this._applyJitter(picking);
      return true;
    }

    if (type === 'move' && this.isApplying) {
      if (intersected) {
        this._applyJitter(picking);
      }
      return true;
    }

    if (type === 'end') {
      this.isApplying = false;
      return true;
    }

    return false;
  }

  /**
   * Aplica desplazamiento aleatorio a los vértices
   * @private
   */
  _applyJitter(picking) {
    const mesh = picking.getMesh();
    if (!mesh) return;

    try {
      // Obtener vértices en el área de influencia
      const iVertsInRadius = picking.getPickedVertices();
      if (!iVertsInRadius || iVertsInRadius.length === 0) return;

      // Obtener arrays de vértices y normales
      const vertices = mesh.getVertices();
      const normals = mesh.getNormals();

      if (!vertices || !normals) return;

      // Aplicar jitter a cada vértice
      for (let i = 0; i < iVertsInRadius.length; ++i) {
        const iVert = iVertsInRadius[i];
        const ind = iVert * 3;

        // Generar desplazamiento aleatorio en la dirección normal
        const randomOffset = (Math.random() - 0.5) * this.strength;

        // Aplicar desplazamiento en la dirección de la normal
        vertices[ind] += normals[ind] * randomOffset;
        vertices[ind + 1] += normals[ind + 1] * randomOffset;
        vertices[ind + 2] += normals[ind + 2] * randomOffset;
      }

      // Actualizar geometría y normales
      mesh.updateGeometry(mesh.getFacesFromVertices(iVertsInRadius), iVertsInRadius);
      mesh.updateDuplicateGeometry(iVertsInRadius);

      // Recalcular normales para que se vea bien
      mesh.updateFlatShading();

      // Forzar render
      this.scene.render();

    } catch (error) {
      console.error('[Vertex Jitter] Error aplicando jitter:', error);
    }
  }

  dispose() {
    this.isActive = false;
    this.isApplying = false;
    console.log('[Vertex Jitter] Plugin descargado');
  }
}

// Exportar el plugin
export default VertexJitterPlugin;
