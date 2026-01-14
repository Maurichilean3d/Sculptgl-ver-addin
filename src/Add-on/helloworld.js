/**
 * HelloWorld Plugin - Versión corregida (Autónoma)
 */
class HelloWorldPlugin {
  constructor(scene) {
    this.scene = scene;
    this.enabled = false;
    this.name = 'HelloWorld';
    this.clickCount = 0;
    this.moveCount = 0;
    console.log('🎨 HelloWorld Plugin: Cargado correctamente');
  }

  onActivate() {
    this.enabled = true;
    this.clickCount = 0;
    this.moveCount = 0;
    console.log('✅ HelloWorld Plugin: ACTIVADO');
  }

  onDeactivate() {
    this.enabled = false;
    console.log(`❌ DESACTIVADO. Clicks: ${this.clickCount}`);
  }

  onInput(type, input, picking) {
    if (!this.enabled) return false;
    if (type === 'start') {
      this.clickCount++;
      const mesh = picking ? picking.getMesh() : null;
      console.log(`🖱️ CLICK #${this.clickCount} sobre: ${mesh ? mesh.getName() : 'nada'}`);
      return true; 
    }
    return false;
  }
}

export default HelloWorldPlugin;
