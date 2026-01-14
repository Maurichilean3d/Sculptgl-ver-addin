/**
 * Demo UI Plugin - Plugin con interfaz visual completa
 * Demuestra cómo crear plugins que alteran la mesh y muestran UI
 */
class DemoUIPlugin {
  constructor(scene) {
    this.scene = scene;
    this.enabled = false;
    this.name = 'Demo UI Plugin';
    this.clickCount = 0;

    // Elementos UI
    this.panel = null;
    this.statusText = null;

    console.log('🎨 Demo UI Plugin: Cargado');
  }

  onActivate() {
    this.enabled = true;
    this.clickCount = 0;
    console.log('✅ Demo UI Plugin: ACTIVADO');

    this._createUI();
    this._showActivationMessage();
  }

  onDeactivate() {
    this.enabled = false;
    console.log(`❌ Demo UI Plugin: DESACTIVADO (${this.clickCount} clicks)`);

    this._removeUI();
  }

  onInput(type, input, picking) {
    if (!this.enabled) return false;

    if (type === 'start') {
      this.clickCount++;
      this._updateStatus(`Clicks: ${this.clickCount}`);

      // Modificar la mesh si hay una seleccionada
      const mesh = picking ? picking.getMesh() : null;
      if (mesh) {
        this._modifyMesh(mesh, picking);
      }

      return true; // Bloquear herramientas de esculpido
    }

    return false;
  }

  // ==================== UI METHODS ====================

  _createUI() {
    // Panel flotante
    this.panel = document.createElement('div');
    this.panel.id = 'demo-plugin-panel';
    this.panel.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      width: 280px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 15px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.5);
      font-family: Arial, sans-serif;
      z-index: 9999;
      border: 2px solid rgba(255,255,255,0.3);
    `;

    // Título
    const title = document.createElement('h3');
    title.textContent = '🎨 Demo Plugin';
    title.style.cssText = 'margin: 0 0 15px 0; font-size: 18px; font-weight: bold;';
    this.panel.appendChild(title);

    // Estado
    this.statusText = document.createElement('div');
    this.statusText.textContent = 'Estado: Activo';
    this.statusText.style.cssText = 'margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.2); border-radius: 8px;';
    this.panel.appendChild(this.statusText);

    // Botones de acción
    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = 'margin-top: 15px; display: flex; flex-direction: column; gap: 8px;';

    const btnColorRandom = this._createButton('🎨 Color Aleatorio', () => this._randomizeMeshColor());
    const btnColorRed = this._createButton('🔴 Teñir Rojo', () => this._tintMesh([1, 0.2, 0.2]));
    const btnColorBlue = this._createButton('🔵 Teñir Azul', () => this._tintMesh([0.2, 0.3, 1]));
    const btnReset = this._createButton('↺ Reset Clicks', () => {
      this.clickCount = 0;
      this._updateStatus('Clicks reseteados');
    });

    btnContainer.appendChild(btnColorRandom);
    btnContainer.appendChild(btnColorRed);
    btnContainer.appendChild(btnColorBlue);
    btnContainer.appendChild(btnReset);
    this.panel.appendChild(btnContainer);

    // Info
    const info = document.createElement('div');
    info.textContent = '💡 Hacé click en la mesh para pintarla';
    info.style.cssText = 'margin-top: 15px; font-size: 11px; opacity: 0.8; text-align: center;';
    this.panel.appendChild(info);

    document.body.appendChild(this.panel);
  }

  _createButton(text, onClick) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.style.cssText = `
      background: rgba(255,255,255,0.25);
      border: 1px solid rgba(255,255,255,0.4);
      color: white;
      padding: 10px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.2s;
    `;
    btn.onmouseover = () => btn.style.background = 'rgba(255,255,255,0.35)';
    btn.onmouseout = () => btn.style.background = 'rgba(255,255,255,0.25)';
    btn.onclick = onClick;
    return btn;
  }

  _removeUI() {
    if (this.panel && this.panel.parentNode) {
      this.panel.parentNode.removeChild(this.panel);
      this.panel = null;
    }
  }

  _updateStatus(text) {
    if (this.statusText) {
      this.statusText.textContent = text;
    }
  }

  _showActivationMessage() {
    const msg = document.createElement('div');
    msg.textContent = '🎉 Demo Plugin Activado!';
    msg.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 30px 50px;
      border-radius: 15px;
      font-size: 24px;
      font-weight: bold;
      z-index: 99999;
      animation: fadeInOut 2s ease-in-out;
    `;

    // Agregar keyframes
    if (!document.getElementById('plugin-animations')) {
      const style = document.createElement('style');
      style.id = 'plugin-animations';
      style.textContent = `
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(msg);
    setTimeout(() => {
      if (msg.parentNode) msg.parentNode.removeChild(msg);
    }, 2000);
  }

  // ==================== MESH MODIFICATION ====================

  _modifyMesh(mesh, picking) {
    const point = picking ? picking.getIntersectionPoint() : null;
    if (!point) return;

    // Obtener arrays de vértices y colores
    const vertices = mesh.getVerticesProxy();
    const colors = mesh.getColors();
    const nbVertices = mesh.getNbVertices();

    // Color aleatorio para este click
    const r = Math.random();
    const g = Math.random();
    const b = Math.random();

    // Pintar vértices cercanos al punto de click
    const radius = 0.05; // Radio de influencia
    const radiusSquared = radius * radius;
    let modified = false;

    for (let i = 0; i < nbVertices; i++) {
      const idx = i * 3;
      const dx = vertices[idx] - point[0];
      const dy = vertices[idx + 1] - point[1];
      const dz = vertices[idx + 2] - point[2];
      const distSquared = dx * dx + dy * dy + dz * dz;

      if (distSquared < radiusSquared) {
        // Mezclar color
        const factor = 0.5;
        colors[idx] = colors[idx] * (1 - factor) + r * factor;
        colors[idx + 1] = colors[idx + 1] * (1 - factor) + g * factor;
        colors[idx + 2] = colors[idx + 2] * (1 - factor) + b * factor;
        modified = true;
      }
    }

    if (modified) {
      mesh.updateColors();
      if (this.scene.render) {
        this.scene.render();
      }
      this._updateStatus(`Click #${this.clickCount} - Mesh modificada!`);
    }
  }

  _randomizeMeshColor() {
    const mesh = this.scene.getMesh();
    if (!mesh) {
      this._updateStatus('⚠️ No hay mesh seleccionada');
      return;
    }

    const colors = mesh.getColors();
    const nbVertices = mesh.getNbVertices();

    for (let i = 0; i < nbVertices; i++) {
      const idx = i * 3;
      colors[idx] = Math.random();
      colors[idx + 1] = Math.random();
      colors[idx + 2] = Math.random();
    }

    mesh.updateColors();
    if (this.scene.render) {
      this.scene.render();
    }

    this._updateStatus('🎨 Colores aleatorizados!');
  }

  _tintMesh(color) {
    const mesh = this.scene.getMesh();
    if (!mesh) {
      this._updateStatus('⚠️ No hay mesh seleccionada');
      return;
    }

    const colors = mesh.getColors();
    const nbVertices = mesh.getNbVertices();

    for (let i = 0; i < nbVertices; i++) {
      const idx = i * 3;
      const factor = 0.4;
      colors[idx] = colors[idx] * (1 - factor) + color[0] * factor;
      colors[idx + 1] = colors[idx + 1] * (1 - factor) + color[1] * factor;
      colors[idx + 2] = colors[idx + 2] * (1 - factor) + color[2] * factor;
    }

    mesh.updateColors();
    if (this.scene.render) {
      this.scene.render();
    }

    this._updateStatus(`🎨 Mesh teñida!`);
  }

  dispose() {
    this._removeUI();
    this.enabled = false;
  }
}

export default DemoUIPlugin;
