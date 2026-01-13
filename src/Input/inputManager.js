import { vec2 } from 'gl-matrix';

class InputManager {
  constructor(canvas) {
    this.canvas = canvas;
    
    // Blindaje iPad
    this.canvas.style.touchAction = 'none';
    this.canvas.style.userSelect = 'none';
    this.canvas.style.webkitUserSelect = 'none';
    this.canvas.style.webkitTouchCallout = 'none';

    this.current = {
      nX: 0, // Normalized X (0.0 a 1.0)
      nY: 0, // Normalized Y (0.0 a 1.0)
      buttons: 0,
      pressure: 1.0,
      isDown: false,
      altKey: false, ctrlKey: false, shiftKey: false,
      pointerType: 'mouse'
    };

    this._pointers = new Map();
    this._prevDist = 0;
    this.onInput = null;
    this._bindEvents();
  }

  _bindEvents() {
    const opts = { passive: false };
    this.canvas.addEventListener('pointerdown', this._onDown.bind(this), opts);
    this.canvas.addEventListener('pointermove', this._onMove.bind(this), opts);
    this.canvas.addEventListener('pointerup', this._onUp.bind(this), opts);
    this.canvas.addEventListener('pointercancel', this._onUp.bind(this), opts);
    this.canvas.addEventListener('pointerout', this._onOut.bind(this), opts);
    this.canvas.addEventListener('wheel', this._onWheel.bind(this), opts);
    this.canvas.addEventListener('contextmenu', e => e.preventDefault());
  }

  _updateNormalizedCoords(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    
    // SOLUCIÓN DEFINITIVA: 
    // Calculamos el porcentaje (0.0 a 1.0)
    // Esto es inmune a la densidad de píxeles del dispositivo.
    this.current.nX = (clientX - rect.left) / rect.width;
    this.current.nY = (clientY - rect.top) / rect.height;
  }

  _processGesture(e, phase) {
    const pointers = Array.from(this._pointers.values());
    
    // 1 Dedo / Mouse
    if (pointers.length === 1) {
      const p = pointers[0];
      this._updateNormalizedCoords(p.x, p.y);
      
      this.current.isDown = true;
      this.current.buttons = (e.pointerType === 'mouse') ? e.buttons : 1;
      this.current.pointerType = p.type;
      this._updateModifiers(e);
      
      if (this.onInput) this.onInput(phase, this.current, e);
      return;
    }

    // 2 Dedos (Pan/Zoom)
    if (pointers.length === 2) {
      const p1 = pointers[0];
      const p2 = pointers[1];
      
      // Centro entre dedos
      const cx = (p1.x + p2.x) / 2;
      const cy = (p1.y + p2.y) / 2;
      this._updateNormalizedCoords(cx, cy);

      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);

      if (phase === 'start' || !this._prevDist) {
        this._prevDist = dist;
        // Reset para evitar saltos
        if (this.onInput) this.onInput('end', this.current, e);
        if (this.onInput) {
            this.current.buttons = 4; // Pan
            this.current.isDown = true;
            this.onInput('start', this.current, e);
        }
        return;
      }

      if (phase === 'move') {
        this.current.buttons = 4; 
        this.current.isDown = true;
        if (this.onInput) this.onInput('move', this.current, e);

        // Zoom Threshold
        if (Math.abs(dist - this._prevDist) > 5.0) {
            const dir = (dist - this._prevDist) > 0 ? 1 : -1;
            // Sensibilidad de zoom
            if (this.onInput) this.onInput('wheel', { ...this.current, wheelDelta: dir }, e);
            this._prevDist = dist;
        }
      }
    }
  }

  _onDown(e) {
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
    this.canvas.setPointerCapture(e.pointerId);
    this._pointers.set(e.pointerId, { id: e.pointerId, x: e.clientX, y: e.clientY, type: e.pointerType });
    this._processGesture(e, 'start');
  }

  _onMove(e) {
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
    if (this._pointers.has(e.pointerId)) {
      const p = this._pointers.get(e.pointerId);
      p.x = e.clientX; p.y = e.clientY;
    }
    if (this._pointers.size === 0) {
        this._updateNormalizedCoords(e.clientX, e.clientY);
        if (this.onInput) this.onInput('hover', this.current, e);
        return;
    }
    this._processGesture(e, 'move');
  }

  _onUp(e) {
    if (e.cancelable) e.preventDefault();
    try { this.canvas.releasePointerCapture(e.pointerId); } catch(err) {}
    this._pointers.delete(e.pointerId);
    if (this._pointers.size > 0) {
        this._prevDist = 0;
        this._processGesture(e, 'move');
        return;
    }
    this.current.isDown = false;
    this.current.buttons = 0;
    this.current.pressure = 0;
    this._prevDist = 0;
    if (this.onInput) this.onInput('end', this.current, e);
  }

  _onWheel(e) {
    if (e.cancelable) e.preventDefault(); e.stopPropagation();
    this._updateNormalizedCoords(e.clientX, e.clientY);
    const delta = e.deltaY > 0 ? -1 : 1;
    if (this.onInput) this.onInput('wheel', { ...this.current, wheelDelta: delta }, e);
  }

  _updateModifiers(e) {
    this.current.altKey = e.altKey; this.current.ctrlKey = e.ctrlKey; this.current.shiftKey = e.shiftKey;
    if (e.pressure !== undefined) {
        this.current.pressure = e.pressure;
        if (this.current.pressure === 0 && e.pointerType === 'pen') this.current.pressure = 0.5;
    }
  }
}
export default InputManager;
