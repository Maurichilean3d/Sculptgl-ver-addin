import 'misc/Polyfill';
import Enums from 'misc/Enums';
import Multimesh from 'mesh/multiresolution/Multimesh';
import Scene from 'Scene';
import Tablet from 'misc/Tablet';
import InputManager from 'Input/inputManager';
import PluginManager from './PluginManager';

class SculptGL extends Scene {
  constructor() {
    super();

    this._pluginManager = new PluginManager(this);
    this._inputManager = new InputManager(this._canvas);
    this._inputManager.onInput = this._handleInput.bind(this);

    // Variables de estado
    this._mouseX = 0;
    this._mouseY = 0;
    this._lastMouseX = 0;
    this._lastMouseY = 0;
    this._action = Enums.Action.NOTHING;

    this._isWheelingIn = false;
    this._timerEndWheel = null;

    this.addSystemEvents();
  }

  start() {
    super.start();

    // Cargar plugins persistidos (async)
    if (this._pluginManager) {
      this._pluginManager.loadPersisted().catch((e) => {
        console.error('Error loading persisted plugins:', e);
      });
    }
  }

  applyRender() {
    super.applyRender();

    // Hook de renderizado para plugins
    if (this._pluginManager) {
      this._pluginManager.onRender();
    }
  }

  getPluginManager() {
    return this._pluginManager;
  }

  // =========================================================================
  // INPUT MANAGER
  // =========================================================================

  _handleInput(type, input, rawEvent) {
    const mouseX = input.nX * this._canvasWidth;
    const mouseY = input.nY * this._canvasHeight;
    const which = this._buttonsToWhich(input.buttons);

    if (typeof input.pressure === 'number') {
      Tablet.pressure = input.pressure;
    }

    Tablet.pointerType = input.pointerType || Tablet.pointerType;
    Tablet.mouseX = mouseX;
    Tablet.mouseY = mouseY;

    if (type === 'wheel') {
      this._mouseX = mouseX;
      this._mouseY = this._canvasHeight - mouseY;
      this._lastMouseX = mouseX;
      this._lastMouseY = mouseY;
      this.onDeviceWheel(input.wheelDelta);
      return;
    }

    if (type === 'hover') {
      this._mouseX = mouseX;
      this._mouseY = this._canvasHeight - mouseY;
      this._lastMouseX = mouseX;
      this._lastMouseY = mouseY;
      this.renderSelectOverRtt();
      return;
    }

    const inputPayload = {
      x: mouseX,
      y: mouseY,
      buttons: which,
      pressure: Tablet.pressure,
      pointerType: Tablet.pointerType,
      altKey: input.altKey,
      ctrlKey: input.ctrlKey,
      shiftKey: input.shiftKey
    };

    if (type === 'start') {
      this.onDeviceDown(inputPayload, rawEvent);
      return;
    }

    if (type === 'move') {
      this.onDeviceMove(inputPayload, rawEvent);
      return;
    }

    if (type === 'end') {
      this.onDeviceUp(inputPayload, rawEvent);
    }
  }

  _buttonsToWhich(buttons) {
    if (buttons & 4) return 2;
    if (buttons & 2) return 3;
    if (buttons & 1) return 1;
    return 0;
  }

  // =========================================================================
  // EVENTOS DE DISPOSITIVO (FLUJO ORIGINAL RESTAURADO)
  // =========================================================================

  onDeviceDown(input) {
    const mouseX = input.x;
    const mouseY = input.y;

    this._lastMouseX = mouseX;
    this._lastMouseY = mouseY;

    // Coordenadas para picking (Y invertido para WebGL)
    this._mouseX = mouseX;
    this._mouseY = this._canvasHeight - mouseY;

    // ALT + Click Izquierdo = Controles de cámara
    if (input.altKey && input.buttons === 1) {
      if (input.ctrlKey) {
        this._action = Enums.Action.CAMERA_ZOOM;
      } else if (input.shiftKey) {
        this._action = Enums.Action.CAMERA_PAN;
      } else {
        this._action = Enums.Action.CAMERA_ROTATE;
      }
      this._camera.start(mouseX, mouseY);
      return;
    }

    // Click Derecho = Rotar cámara
    if (input.buttons === 3) {
      this._action = input.ctrlKey ?
        Enums.Action.CAMERA_ZOOM :
        (input.shiftKey ? Enums.Action.CAMERA_PAN : Enums.Action.CAMERA_ROTATE);
      this._camera.start(mouseX, mouseY);
      return;
    }

    // Click Medio / Gesto pan = Pan cámara
    if (input.buttons === 2) {
      this._action = Enums.Action.CAMERA_PAN;
      this._camera.start(mouseX, mouseY);
      return;
    }

    // Click Izquierdo: Picking + Plugin/Escultura
    if (input.buttons === 1) {
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
        const pluginHandled = this._pluginManager.tryHandleInput('start', input, picking);

        if (pluginHandled) {
          this._action = Enums.Action.NOTHING;
          return;
        }

        this._action = Enums.Action.SCULPT_EDIT;
        this._sculptManager.start(input.shiftKey);
      } else {
        // No tocamos: rotar cámara
        this._action = Enums.Action.CAMERA_ROTATE;
        this._camera.start(mouseX, mouseY);
      }
    }
  }

  onDeviceMove(input) {
    const mouseX = input.x;
    const mouseY = input.y;

    this._mouseX = mouseX;
    this._mouseY = this._canvasHeight - mouseY;

    if (this._isCameraAction()) {
      Multimesh.RENDER_HINT = Multimesh.CAMERA;

      const dx = mouseX - this._lastMouseX;
      const dy = mouseY - this._lastMouseY;
      const speedFactor = this._cameraSpeed / this._canvasHeight;

      if (this._action === Enums.Action.CAMERA_ROTATE) {
        this._camera.rotate(mouseX, mouseY);
      } else if (this._action === Enums.Action.CAMERA_PAN) {
        this._camera.translate(dx * speedFactor, dy * speedFactor);
      } else if (this._action === Enums.Action.CAMERA_ZOOM) {
        this._camera.zoom((dx + dy) * speedFactor);
      }

      this.render();
    } else if (this._action === Enums.Action.SCULPT_EDIT) {
      const picking = this.getPicking();
      const pluginHandled = this._pluginManager.tryHandleInput('move', input, picking);

      if (!pluginHandled) {
        this._sculptManager.preUpdate();
        this._sculptManager.update(this);
        Multimesh.RENDER_HINT = Multimesh.SCULPT;

        if (this.getMesh().isDynamic) {
          this._gui.updateMeshInfo();
        }

        this.render();
      }
    } else {
      this.renderSelectOverRtt();
    }

    this._lastMouseX = mouseX;
    this._lastMouseY = mouseY;
  }

  onDeviceUp(input) {
    if (this._pluginManager.hasActivePlugin()) {
      const picking = this.getPicking();
      this._pluginManager.tryHandleInput('end', { ...input, buttons: 0, pressure: 0 }, picking);
    }

    if (this._action === Enums.Action.SCULPT_EDIT) {
      this._sculptManager.end();
    }

    this._action = Enums.Action.NOTHING;
    this.setCanvasCursor('default');
    Multimesh.RENDER_HINT = Multimesh.NONE;
    this.render();
  }

  onDeviceWheel(dir) {
    if (Math.abs(dir) > 0.0 && !this._isWheelingIn) {
      this._isWheelingIn = true;
      this._camera.start(this._mouseX, this._mouseY);
    }

    this._camera.zoom(dir * 0.02);
    Multimesh.RENDER_HINT = Multimesh.CAMERA;
    this.render();

    if (this._timerEndWheel) {
      window.clearTimeout(this._timerEndWheel);
    }

    this._timerEndWheel = window.setTimeout(this._endWheel.bind(this), 300);
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
  // EVENTOS DEL SISTEMA (NO pointer/touch aquí)
  // =========================================================================

  addSystemEvents() {
    const canvas = this._canvas;

    // Keyboard
    window.addEventListener('keydown', this.onKeyDown.bind(this), false);
    window.addEventListener('keyup', this.onKeyUp.bind(this), false);

    // Drag & Drop
    const cbLoadFiles = this.loadFiles.bind(this);
    const cbStopAndPrevent = this.stopAndPrevent.bind(this);
    window.addEventListener('dragenter', cbStopAndPrevent, false);
    window.addEventListener('dragover', cbStopAndPrevent, false);
    window.addEventListener('drop', cbLoadFiles, false);

    // WebGL context
    canvas.addEventListener('webglcontextlost', this.onContextLost.bind(this), false);
    canvas.addEventListener('webglcontextrestored', this.onContextRestored.bind(this), false);

    // File input
    const fileInput = document.getElementById('fileopen');
    if (fileInput) {
      fileInput.addEventListener('change', cbLoadFiles, false);
    }
  }

  stopAndPrevent(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  onContextLost() {
    window.alert('Oops… WebGL context lost.');
  }

  onContextRestored() {
    window.alert('Wow… Context is restored.');
  }

  onKeyDown(e) {
    this._gui.callFunc('onKeyDown', e);
  }

  onKeyUp(e) {
    this._gui.callFunc('onKeyUp', e);
  }

  onMouseWheel(event) {
    event.stopPropagation();
    event.preventDefault();
    this._gui.callFunc('onMouseWheel', event);

    const dir = event.wheelDelta === undefined ? -event.detail : event.wheelDelta;
    this.onDeviceWheel(dir > 0 ? 1 : -1);
  }

  // =========================================================================
  // CARGA DE ARCHIVOS
  // =========================================================================

  getFileType(name) {
    const lower = name.toLowerCase();
    if (lower.endsWith('.obj')) return 'obj';
    if (lower.endsWith('.sgl')) return 'sgl';
    if (lower.endsWith('.stl')) return 'stl';
    if (lower.endsWith('.ply')) return 'ply';
    if (lower.endsWith('.glb')) return 'glb';
    if (lower.endsWith('.gltf')) return 'glb';
    return null;
  }

  loadFiles(event) {
    event.stopPropagation();
    event.preventDefault();

    const files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    for (let i = 0, nb = files.length; i < nb; ++i) {
      this.readFile(files[i]);
    }
  }

  readFile(file) {
    const fileType = this.getFileType(file.name);
    if (!fileType) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      this.loadScene(evt.target.result, fileType);
      const fileInput = document.getElementById('fileopen');
      if (fileInput) {
        fileInput.value = '';
      }
    };

    if (fileType === 'obj') {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  }
}

export default SculptGL;
