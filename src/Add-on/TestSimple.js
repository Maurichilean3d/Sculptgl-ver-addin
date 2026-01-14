/**
 * TestSimple - Plugin ULTRA simple para verificar que el sistema funciona
 * Si ves el alert, el sistema de plugins está funcionando correctamente.
 */
class TestSimple {
  constructor(scene) {
    this.scene = scene;
    this.enabled = false;
    this.name = 'Test Simple';

    console.log('✅ TestSimple: Constructor ejecutado');
    alert('✅ PLUGIN CARGADO! Si ves este mensaje, el sistema de plugins funciona.');
  }

  onActivate() {
    this.enabled = true;
    console.log('🟢 TestSimple: ACTIVADO');

    // Mostrar alert
    alert('🎉 PLUGIN ACTIVADO!\n\nEl sistema de plugins está funcionando.\n\nAhora hacé click en la mesh y revisá la consola.');

    // Crear panel SUPER visible
    this.panel = document.createElement('div');
    this.panel.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: red;
      color: white;
      padding: 50px;
      font-size: 30px;
      font-weight: bold;
      z-index: 999999;
      border: 5px solid yellow;
      text-align: center;
    `;
    this.panel.innerHTML = '🎉 PLUGIN ACTIVO 🎉<br><br>Haz click en la mesh';
    document.body.appendChild(this.panel);

    // Quitar el panel después de 3 segundos
    setTimeout(() => {
      if (this.panel && this.panel.parentNode) {
        this.panel.parentNode.removeChild(this.panel);
        this.panel = null;
      }
      this._createSmallPanel();
    }, 3000);
  }

  _createSmallPanel() {
    // Panel pequeño persistente
    this.smallPanel = document.createElement('div');
    this.smallPanel.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff0000;
      color: white;
      padding: 20px;
      font-size: 16px;
      font-weight: bold;
      z-index: 99999;
      border: 3px solid #ffff00;
      border-radius: 10px;
    `;
    this.smallPanel.innerHTML = '🔥 Test Simple<br>ACTIVO<br>Clicks: 0';
    document.body.appendChild(this.smallPanel);
  }

  onDeactivate() {
    this.enabled = false;
    console.log('🔴 TestSimple: DESACTIVADO');

    alert('❌ Plugin desactivado');

    if (this.panel && this.panel.parentNode) {
      this.panel.parentNode.removeChild(this.panel);
    }
    if (this.smallPanel && this.smallPanel.parentNode) {
      this.smallPanel.parentNode.removeChild(this.smallPanel);
    }
  }

  onInput(type, input, picking) {
    if (!this.enabled) return false;

    if (type === 'start') {
      console.log('🖱️ CLICK detectado por TestSimple!');
      console.log('Input:', input);
      console.log('Picking:', picking);

      // Incrementar contador
      if (!this.clicks) this.clicks = 0;
      this.clicks++;

      // Actualizar panel
      if (this.smallPanel) {
        this.smallPanel.innerHTML = `🔥 Test Simple<br>ACTIVO<br>Clicks: ${this.clicks}`;
      }

      // Cambiar color de fondo random
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

      // Si hay mesh, cambiar su color
      const mesh = picking ? picking.getMesh() : null;
      if (mesh) {
        console.log('🎨 Modificando mesh:', mesh.getName());
        this._randomizeMeshColor(mesh);
      }

      return true; // Bloquear herramientas de SculptGL
    }

    return false;
  }

  _randomizeMeshColor(mesh) {
    try {
      const colors = mesh.getColors();
      if (!colors) {
        console.warn('⚠️ No se pudo obtener colors de la mesh');
        return;
      }

      const nbVertices = mesh.getNbVertices();
      console.log(`🎨 Cambiando color de ${nbVertices} vértices`);

      for (let i = 0; i < nbVertices; i++) {
        const idx = i * 3;
        colors[idx] = Math.random();
        colors[idx + 1] = Math.random();
        colors[idx + 2] = Math.random();
      }

      mesh.updateColors();

      if (this.scene && this.scene.render) {
        this.scene.render();
      }

      console.log('✅ Color de mesh cambiado exitosamente');
    } catch (e) {
      console.error('❌ Error al cambiar color de mesh:', e);
    }
  }

  dispose() {
    this.onDeactivate();
  }
}

export default TestSimple;
