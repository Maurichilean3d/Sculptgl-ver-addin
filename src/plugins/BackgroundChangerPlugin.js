// BackgroundChangerPlugin.js
/**
 * Plugin de Ejemplo: Cambiador de Color de Fondo al hacer clic
 * Muestra visualmente que el sistema de plugins está operando.
 */
class BackgroundChangerPlugin {
  constructor(scene) {
    this.scene = scene;
    this.enabled = false;
    this.name = 'Background Changer';
    this.messageElement = null; // Elemento para mostrar mensajes en pantalla
    this.clickCount = 0;
    console.log('🎨 Background Changer Plugin: Cargado correctamente');
  }

  // Se llama cuando el plugin es activado
  onActivate() {
    this.enabled = true;
    this.clickCount = 0;
    console.log('✅ Background Changer Plugin: ACTIVADO');

    // Crea y añade un elemento DIV para mostrar mensajes
    this.messageElement = document.createElement('div');
    this.messageElement.id = 'plugin-message';
    this.messageElement.style.position = 'absolute';
    this.messageElement.style.top = '50%';
    this.messageElement.style.left = '50%';
    this.messageElement.style.transform = 'translate(-50%, -50%)';
    this.messageElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    this.messageElement.style.color = 'white';
    this.messageElement.style.padding = '20px';
    this.messageElement.style.borderRadius = '10px';
    this.messageElement.style.fontSize = '2em';
    this.messageElement.style.fontFamily = 'Arial, sans-serif';
    this.messageElement.style.zIndex = '1000';
    this.messageElement.style.pointerEvents = 'none'; // Para que no bloquee los clics en el canvas
    this.messageElement.innerText = 'Plugin ACTIVO. ¡Haz clic!';
    document.body.appendChild(this.messageElement);

    // Cambia el cursor a una flecha para indicar que está activo
    if (this.scene.setCanvasCursor) {
        this.scene.setCanvasCursor('pointer');
    }

    this._updateBackgroundColor(); // Establece un color inicial
  }

  // Se llama cuando el plugin es desactivado
  onDeactivate() {
    this.enabled = false;
    console.log(`❌ Background Changer Plugin: DESACTIVADO. Clicks: ${this.clickCount}`);

    // Elimina el elemento de mensaje
    if (this.messageElement && this.messageElement.parentNode) {
      this.messageElement.parentNode.removeChild(this.messageElement);
      this.messageElement = null;
    }

    // Restaura el cursor a su estado por defecto
    if (this.scene.setCanvasCursor) {
        this.scene.setCanvasCursor('default');
    }

    // Opcional: restaurar color de fondo original (requeriría guardarlo en onActivate)
    // Para este ejemplo, lo dejaremos como está al desactivar.
  }

  // Se llama en cada evento de entrada (mouse, táctil, lápiz)
  onInput(type, input, picking) {
    if (!this.enabled) return false; // Si el plugin no está activo, no hacemos nada

    if (type === 'start') { // Cuando se pulsa el botón del ratón/lápiz
      this.clickCount++;
      console.log(`🖱️ Background Changer: Click #${this.clickCount}`);
      
      // Actualiza el color de fondo
      this._updateBackgroundColor();

      // Actualiza el mensaje en pantalla
      if (this.messageElement) {
        this.messageElement.innerText = `¡Fondo cambiado! Clicks: ${this.clickCount}`;
      }

      // IMPORTANTE: Devolvemos 'true' para indicar que hemos manejado el evento.
      // Esto evita que SculptGL ejecute sus propias herramientas de esculpido.
      return true;
    }
    
    // Si no es un evento 'start', no hacemos nada, pero tampoco bloqueamos otros eventos.
    return false;
  }

  // Método auxiliar para cambiar el color de fondo de forma aleatoria
  _updateBackgroundColor() {
    const r = Math.random();
    const g = Math.random();
    const b = Math.random();
    
    // Asumiendo que `this.scene.renderer.clearColor_` es el array RGB del color de fondo
    // y que `this.scene.render()` redibuja la escena.
    if (this.scene && this.scene.renderer && this.scene.renderer.clearColor_) {
      this.scene.renderer.clearColor_[0] = r;
      this.scene.renderer.clearColor_[1] = g;
      this.scene.renderer.clearColor_[2] = b;
      if (this.scene.render) {
        this.scene.render(); // Asegurarse de que la escena se redibuje
      }
    } else {
        // Fallback si no encontramos la propiedad esperada
        console.warn("No se pudo acceder al color de fondo de la escena. Asegúrate de que this.scene.renderer.clearColor_ exista.");
        document.body.style.backgroundColor = `rgb(${r*255}, ${g*255}, ${b*255})`; // Cambia el fondo del BODY
    }
  }
}

export default BackgroundChangerPlugin;
