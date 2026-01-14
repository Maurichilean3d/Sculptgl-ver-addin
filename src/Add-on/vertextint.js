/**
 * VertexTint Plugin - Variante simple para teñir vértices.
 * Útil como ejemplo de plugin legacy o ES module.
 */

import Plugin from '../plugins/Plugin';

class VertexTintPlugin extends Plugin {
  constructor(scene) {
    super(scene);
    this.name = 'VertexTint';
    this.tintColor = [0.1, 0.6, 1.0];
    this.tintStrength = 0.35;
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
      this._tintAtPoint(picking);
      return true;
    }

    if (type === 'move' && this._painting) {
      this._tintAtPoint(picking);
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

  _tintAtPoint(picking) {
    const mesh = picking.getMesh();
    const point = picking.getIntersectionPoint();

    if (!mesh || !point) return;

    const colors = mesh.getColors();
    const verticesXYZ = mesh.getVerticesProxy();
    const radius = this.scene.getSculptManager().getCurrentTool().getScreenRadius() / this.scene.getCanvas().width;
    const radiusSquared = radius * radius;
    const nbVertices = mesh.getNbVertices();

    let modified = false;

    for (let i = 0; i < nbVertices; i++) {
      const ind = i * 3;
      const dx = verticesXYZ[ind] - point[0];
      const dy = verticesXYZ[ind + 1] - point[1];
      const dz = verticesXYZ[ind + 2] - point[2];
      const distSquared = dx * dx + dy * dy + dz * dz;

      if (distSquared < radiusSquared) {
        colors[ind] += (this.tintColor[0] - colors[ind]) * this.tintStrength;
        colors[ind + 1] += (this.tintColor[1] - colors[ind + 1]) * this.tintStrength;
        colors[ind + 2] += (this.tintColor[2] - colors[ind + 2]) * this.tintStrength;
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

  setTintColor(r, g, b) {
    this.tintColor = [r, g, b];
  }

  setTintStrength(strength) {
    this.tintStrength = Math.max(0.0, Math.min(1.0, strength));
  }
}

if (typeof window !== 'undefined' && !window.SculptGLPlugin) {
  window.SculptGLPlugin = VertexTintPlugin;
}

export default VertexTintPlugin;
