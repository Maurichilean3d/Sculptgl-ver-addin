/**
 * HelloWorld Plugin - ejemplo mínimo para validar carga de add-ons.
 */

import Plugin from '../plugins/Plugin';

class HelloWorldPlugin extends Plugin {
  constructor(scene) {
    super(scene);
    this.name = 'HelloWorld';
  }

  onActivate() {
    super.onActivate();
    if (typeof window !== 'undefined') {
      console.log('[HelloWorld] Plugin activo');
    }
  }

  onDeactivate() {
    super.onDeactivate();
    if (typeof window !== 'undefined') {
      console.log('[HelloWorld] Plugin desactivado');
    }
  }
}

if (typeof window !== 'undefined' && !window.SculptGLPlugin) {
  window.SculptGLPlugin = HelloWorldPlugin;
}

export default HelloWorldPlugin;
