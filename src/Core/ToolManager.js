class ToolManager {
  constructor(main) {
    this.main = main;
    this.activeTool = null;
    this.registry = new Map();
    this.legacyTool = null;
  }

  registerTool(name, toolInstance) {
    this.registry.set(name, toolInstance);
  }

  registerLegacySculpt(sculptManager) {
    this.legacyTool = {
      name: 'LegacySculpt',
      
      onStart: (input) => {
        // --- LOGICA DE TAP FUERA ---
        // Usamos las coordenadas que SculptGL ya procesó (escaladas e invertidas)
        // main._mouseX y main._mouseY ya son correctos aquí.
        const mesh = this.main.getMesh();
        const picking = this.main.getPicking();
        
        // Lanzamos el rayo. Si devuelve false (no tocó nada), cancelamos la herramienta.
        if (mesh && !picking.intersectionMouse(mesh, this.main._mouseX, this.main._mouseY)) {
            return false; // Esto activa el fallback de cámara en SculptGL.js
        }
        
        // Si tocó la malla, esculpimos.
        return sculptManager.start(input.shiftKey);
      },
      
      onMove: (input) => {
        sculptManager.preUpdate();
        sculptManager.update(this.main);
        return true; 
      },
      
      onEnd: (input) => {
        sculptManager.end();
        return true;
      }
    };
    this.activeTool = this.legacyTool;
  }

  setTool(name) {
    if (name === 'SCULPT') { this.activeTool = this.legacyTool; return; }
    const tool = this.registry.get(name);
    if (!tool) return;
    if (this.activeTool && this.activeTool.onExit) this.activeTool.onExit();
    this.activeTool = tool;
    if (this.activeTool.onEnter) this.activeTool.onEnter();
  }

  handleInput(type, input, rawEvent) {
    if (!this.activeTool) return false;
    // Delegamos a la herramienta
    if (type === 'start' && this.activeTool.onStart) return this.activeTool.onStart(input, rawEvent);
    if (type === 'move' && this.activeTool.onMove) return this.activeTool.onMove(input, rawEvent);
    if (type === 'end' && this.activeTool.onEnd) return this.activeTool.onEnd(input, rawEvent);
    return false;
  }
}
export default ToolManager;
