import ‘misc/Polyfill’;
import { vec3 } from ‘gl-matrix’;
import Tablet from ‘misc/Tablet’;
import Enums from ‘misc/Enums’;
import Utils from ‘misc/Utils’;
import Scene from ‘Scene’;
import Multimesh from ‘mesh/multiresolution/Multimesh’;

import PluginManager from ‘./PluginManager_NON_INVASIVE’;

/**

- SculptGL - Versión con sistema de plugins NO-INVASIVO
- 
- CAMBIOS vs versión rota:
- 1. Restaura flujo original de onDeviceDown/Move/Up
- 1. Plugins solo se consultan DESPUÉS del picking
- 1. Touch funciona porque el flujo de coordenadas es correcto
- 1. Escalado de pixelRatio en UN SOLO LUGAR
   */

class SculptGL extends Scene {

constructor() {
super();

```
this._pluginManager = new PluginManager(this);

// Variables de estado (ORIGINAL)
this._mouseX = 0;
this._mouseY = 0;
this._lastMouseX = 0;
this._lastMouseY = 0;
this._action = Enums.Action.NOTHING;

this.addSystemEvents();
```

}

start() {
super.start();

```
// Cargar plugin persistido
if (this._pluginManager) {
  try {
    this._pluginManager.loadPersisted();
  } catch (e) {
    console.error('Error loading persisted plugins:', e);
  }
}
```

}

applyRender() {
super.applyRender();

```
// Hook de renderizado para plugins
if (this._pluginManager) {
  this._pluginManager.onRender();
}
```

}

getPluginManager() {
return this._pluginManager;
}

// =========================================================================
// EVENTOS DE DISPOSITIVO (FLUJO ORIGINAL RESTAURADO)
// =========================================================================

/**

- onDeviceDown - Maneja inicio de interacción
- ESTE ES EL FLUJO ORIGINAL con hooks para plugins
  */
  onDeviceDown(event) {
  event.stopPropagation();
  event.preventDefault();

```
// 1. OBTENER COORDENADAS (ORIGINAL)
// Tablet.js ya aplica pixelRatio internamente
const mouseX = Tablet.mouseX;
const mouseY = Tablet.mouseY;

this._lastMouseX = mouseX;
this._lastMouseY = mouseY;

// Coordenadas para picking (Y invertido para WebGL)
this._mouseX = mouseX;
this._mouseY = this._height - mouseY;

// 2. DETERMINAR TIPO DE ACCIÓN (ORIGINAL)

// ALT + Click Izquierdo = Controles de cámara
if (event.altKey && event.which === 1) {
  if (event.ctrlKey) {
    this._action = Enums.Action.CAMERA_ZOOM;
  } else if (event.shiftKey) {
    this._action = Enums.Action.CAMERA_PAN;
  } else {
    this._action = Enums.Action.CAMERA_ROTATE;
  }
  this._camera.start(mouseX, mouseY);
  return;
}

// Click Derecho = Rotar cámara
if (event.which === 3) {
  this._action = event.ctrlKey ? 
    Enums.Action.CAMERA_ZOOM : 
    (event.shiftKey ? Enums.Action.CAMERA_PAN : Enums.Action.CAMERA_ROTATE);
  this._camera.start(mouseX, mouseY);
  return;
}

// Click Medio = Pan
if (event.which === 2) {
  this._action = Enums.Action.CAMERA_PAN;
  this._camera.start(mouseX, mouseY);
  return;
}

// 3. CLICK IZQUIERDO: Picking + Plugin/Escultura
if (event.which === 1) {
  const mesh = this.getMesh();
  const picking = this.getPicking();

  if (!mesh || !picking) {
    // No hay malla, default a rotar cámara
    this._action = Enums.Action.CAMERA_ROTATE;
    this._camera.start(mouseX, mouseY);
    return;
  }

  // PICKING: ¿Tocamos la malla?
  const intersected = picking.intersectionMouse(mesh, this._mouseX, this._mouseY);

  if (intersected) {
    // 🎯 TOCAMOS LA MALLA: Preguntar a PluginManager primero
    const input = {
      x: Tablet.mouseX,
      y: Tablet.mouseY,
      buttons: event.which,
      pressure: Tablet.pressure,
      pointerType: Tablet.pointerType
    };

    const pluginHandled = this._pluginManager.tryHandleInput('start', input, picking);

    if (pluginHandled) {
      // Plugin manejó el evento
      this._action = Enums.Action.NOTHING; // No hacer nada más
      return;
    }

    // Plugin no manejó (o no hay plugin): Escultura normal
    this._action = Enums.Action.SCULPT_EDIT;
    this._sculptManager.start(event.shiftKey);
    
  } else {
    // 🌍 NO TOCAMOS: Rotar cámara (COMPORTAMIENTO TÁCTIL ESPERADO)
    this._action = Enums.Action.CAMERA_ROTATE;
    this._camera.start(mouseX, mouseY);
  }
}
```

}

/**

- onDeviceMove - Maneja movimiento durante interacción
  */
  onDeviceMove(event) {
  const mouseX = Tablet.mouseX;
  const mouseY = Tablet.mouseY;

```
// Coordenadas para picking
this._mouseX = mouseX;
this._mouseY = this._height - mouseY;

// Si estamos en una acción de cámara
if (this._isCameraAction()) {
  Multimesh.RENDER_HINT = Multimesh.CAMERA;
  
  const dx = mouseX - this._lastMouseX;
  const dy = mouseY - this._lastMouseY;
  const speedFactor = this._cameraSpeed / this._height;

  if (this._action === Enums.Action.CAMERA_ROTATE) {
    this._camera.rotate(mouseX, mouseY);
  } else if (this._action === Enums.Action.CAMERA_PAN) {
    this._camera.translate(dx * speedFactor, dy * speedFactor);
  } else if (this._action === Enums.Action.CAMERA_ZOOM) {
    this._camera.zoom((dx + dy) * speedFactor);
  }

  this.render();
}
// Si estamos esculpiendo
else if (this._action === Enums.Action.SCULPT_EDIT) {
  // Preguntar primero al plugin manager
  const input = {
    x: Tablet.mouseX,
    y: Tablet.mouseY,
    buttons: event.which,
    pressure: Tablet.pressure,
    pointerType: Tablet.pointerType
  };

  const picking = this.getPicking();
  const pluginHandled = this._pluginManager.tryHandleInput('move', input, picking);

  if (!pluginHandled) {
    // Plugin no manejó: escultura normal
    this._sculptManager.preUpdate();
    this._sculptManager.update(this);
    Multimesh.RENDER_HINT = Multimesh.SCULPT;
    
    if (this.getMesh().isDynamic) {
      this._gui.updateMeshInfo();
    }
    
    this.render();
  }
}
// Si no estamos en ninguna acción: hover
else {
  this.renderSelectOverRtt();
}

this._lastMouseX = mouseX;
this._lastMouseY = mouseY;
```

}

/**

- onDeviceUp - Maneja fin de interacción
  */
  onDeviceUp(event) {
  // Si había plugin activo
  if (this._pluginManager.hasActivePlugin()) {
  const input = {
  x: Tablet.mouseX,
  y: Tablet.mouseY,
  buttons: 0,
  pressure: 0,
  pointerType: Tablet.pointerType
  };
  
  const picking = this.getPicking();
  this._pluginManager.tryHandleInput(‘end’, input, picking);
  }

```
// Finalizar escultura si estaba activa
if (this._action === Enums.Action.SCULPT_EDIT) {
  this._sculptManager.end();
}

// Reset
this._action = Enums.Action.NOTHING;
this.setCanvasCursor('default');
Multimesh.RENDER_HINT = Multimesh.NONE;
this.render();
```

}

/**

- onDeviceWheel - Maneja zoom con rueda
  */
  onDeviceWheel(dir) {
  if (Math.abs(dir) > 0.0 && !this._isWheelingIn) {
  this._isWheelingIn = true;
  this._camera.start(this._mouseX, this._mouseY);
  }

```
this._camera.zoom(dir * 0.02);
Multimesh.RENDER_HINT = Multimesh.CAMERA;
this.render();

if (this._timerEndWheel) {
  window.clearTimeout(this._timerEndWheel);
}

this._timerEndWheel = window.setTimeout(this._endWheel.bind(this), 300);
```

}

_endWheel() {
Multimesh.RENDER_HINT = Multimesh.NONE;
this._isWheelingIn = false;
this.render();
}

_isCameraAction() {
return this._action === Enums.Action.CAMERA_ROTATE ||
this._action === Enums.Action.CAMERA_PAN ||
this._action === Enums.Action.CAMERA_ZOOM;
}

// =========================================================================
// EVENTOS DEL SISTEMA (ORIGINAL)
// =========================================================================

addSystemEvents() {
var canvas = this._canvas;

```
// Mouse events
var cbMouseDown = this.onDeviceDown.bind(this);
var cbMouseMove = this.onDeviceMove.bind(this);
var cbMouseUp = this.onDeviceUp.bind(this);
canvas.addEventListener('mousedown', cbMouseDown, false);
canvas.addEventListener('mouseup', cbMouseUp, false);
canvas.addEventListener('mouseout', cbMouseUp, false);
canvas.addEventListener('mousemove', cbMouseMove, false);

// Touch events
canvas.addEventListener('touchstart', cbMouseDown, false);
canvas.addEventListener('touchmove', cbMouseMove, false);
canvas.addEventListener('touchend', cbMouseUp, false);
canvas.addEventListener('touchcancel', cbMouseUp, false);

// Pointer events (si está disponible)
if (window.PointerEvent) {
  canvas.addEventListener('pointerdown', cbMouseDown, false);
  canvas.addEventListener('pointermove', cbMouseMove, false);
  canvas.addEventListener('pointerup', cbMouseUp, false);
  canvas.addEventListener('pointercancel', cbMouseUp, false);
}

// Mouse wheel
var cbMouseWheel = this.onMouseWheel.bind(this);
canvas.addEventListener('mousewheel', cbMouseWheel, false);
canvas.addEventListener('DOMMouseScroll', cbMouseWheel, false);

// Keyboard
window.addEventListener('keydown', this.onKeyDown.bind(this), false);
window.addEventListener('keyup', this.onKeyUp.bind(this), false);

// Drag & Drop
var cbLoadFiles = this.loadFiles.bind(this);
var cbStopAndPrevent = this.stopAndPrevent.bind(this);
window.addEventListener('dragenter', cbStopAndPrevent, false);
window.addEventListener('dragover', cbStopAndPrevent, false);
window.addEventListener('drop', cbLoadFiles, false);

// WebGL context
canvas.addEventListener('webglcontextlost', this.onContextLost.bind(this), false);
canvas.addEventListener('webglcontextrestored', this.onContextRestored.bind(this), false);

// File input
if (document.getElementById('fileopen')) {
  document.getElementById('fileopen').addEventListener('change', cbLoadFiles, false);
}
```

}

stopAndPrevent(event) {
event.stopPropagation();
event.preventDefault();
}

onContextLost() {
window.alert(‘Oops… WebGL context lost.’);
}

onContextRestored() {
window.alert(‘Wow… Context is restored.’);
}

onKeyDown(e) {
this._gui.callFunc(‘onKeyDown’, e);
}

onKeyUp(e) {
this._gui.callFunc(‘onKeyUp’, e);
}

onMouseWheel(event) {
event.stopPropagation();
event.preventDefault();
this._gui.callFunc(‘onMouseWheel’, event);

```
var dir = event.wheelDelta === undefined ? -event.detail : event.wheelDelta;
this.onDeviceWheel(dir > 0 ? 1 : -1);
```

}

// =========================================================================
// CARGA DE ARCHIVOS (ORIGINAL)
// =========================================================================

getFileType(name) {
var lower = name.toLowerCase();
if (lower.endsWith(’.obj’)) return ‘obj’;
if (lower.endsWith(’.sgl’)) return ‘sgl’;
if (lower.endsWith(’.stl’)) return ‘stl’;
if (lower.endsWith(’.ply’)) return ‘ply’;
if (lower.endsWith(’.glb’)) return ‘glb’;
if (lower.endsWith(’.gltf’)) return ‘glb’;
return;
}

loadFiles(event) {
event.stopPropagation();
event.preventDefault();

```
var files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
for (var i = 0, nb = files.length; i < nb; ++i) {
  this.readFile(files[i]);
}
```

}

readFile(file) {
var fileType = this.getFileType(file.name);
if (!fileType) return;

```
var reader = new FileReader();
var self = this;

reader.onload = function (evt) {
  self.loadScene(evt.target.result, fileType);
  if (document.getElementById('fileopen')) {
    document.getElementById('fileopen').value = '';
  }
};

if (fileType === 'obj') {
  reader.readAsText(file);
} else {
  reader.readAsArrayBuffer(file);
}
```

}
}

export default SculptGL;