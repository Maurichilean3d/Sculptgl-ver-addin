/**
 * VertexPaint Plugin - Ejemplo de plugin funcional
 * Este plugin pinta vértices en lugar de esculpir.
 */

import Plugin from '../plugins/Plugin';

class VertexPaintPlugin extends Plugin {
  constructor(scene) {
    super(scene);
    this.name = 'VertexPaint';

    // Configuración del plugin
    this.paintColor = [1.0, 0.0, 0.0]; // Rojo por defecto
    this.brushRadius = 0.05; // Radio en espacio 3D
    this.brushStrength = 0.8;

    // Estado interno
    this._painting = false;
  }

  onActivate() {
    super.onActivate();
    if (this.scene.setCanvasCursor) {
      this.scene.setCanvasCursor('crosshair');
    }
  }

  onDeactivate() {
    super.onDeactivate();
    this._painting = false;
    if (this.scene.setCanvasCursor) {
      this.scene.setCanvasCursor('default');
    }
  }

  onInput(type, input, picking) {
    if (!this.enabled) return false;

    const mesh = picking.getMesh();
    if (!mesh) return false;

    if (type === 'start') {
      this._painting = true;
      this._paintAtPoint(picking);
      return true;
    }

    if (type === 'move' && this._painting) {
      this._paintAtPoint(picking);
      return true;
    }

    if (type === 'end') {
      this._painting = false;
      if (mesh.getStateManager) {
        mesh.getStateManager().pushState();
      }
      return true;
    }

    return false;
  }

  _paintAtPoint(picking) {
    const mesh = picking.getMesh();
    const point = picking.getIntersectionPoint();

    if (!mesh || !point) return;

    const colors = mesh.getColors();
    const verticesXYZ = mesh.getVerticesProxy();

    const radiusSquared = this.brushRadius * this.brushRadius;
    const nbVertices = mesh.getNbVertices();

    let modified = false;

    for (let i = 0; i < nbVertices; i++) {
      const ind = i * 3;
      const vx = verticesXYZ[ind];
      const vy = verticesXYZ[ind + 1];
      const vz = verticesXYZ[ind + 2];

      const dx = vx - point[0];
      const dy = vy - point[1];
      const dz = vz - point[2];
      const distSquared = dx * dx + dy * dy + dz * dz;

      if (distSquared < radiusSquared) {
        const dist = Math.sqrt(distSquared);
        const falloff = 1.0 - (dist / this.brushRadius);
        const strength = falloff * this.brushStrength;

        colors[ind] += (this.paintColor[0] - colors[ind]) * strength;
        colors[ind + 1] += (this.paintColor[1] - colors[ind + 1]) * strength;
        colors[ind + 2] += (this.paintColor[2] - colors[ind + 2]) * strength;

        modified = true;
      }
    }

    if (modified) {
      mesh.updateColors();
      if (this.scene.render) {
        this.scene.render();
      }
    }
  }

  onRender() {
    // Aquí podrías dibujar el preview del brush, etc.
  }

  setPaintColor(r, g, b) {
    this.paintColor = [r, g, b];
  }

  setBrushRadius(radius) {
    this.brushRadius = Math.max(0.01, radius);
  }

  setBrushStrength(strength) {
    this.brushStrength = Math.max(0.0, Math.min(1.0, strength));
  }
}

export default VertexPaintPlugin;
