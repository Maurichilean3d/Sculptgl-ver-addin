<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <title>MR Studio Diamond v6.0 Pro Edition</title>
  <script src="https://unpkg.com/omggif@1.0.10/omggif.js"></script>
  <style>
    * { box-sizing: border-box; user-select: none; }
    body { margin: 0; overflow: hidden; background: transparent; font-family: 'Segoe UI', system-ui, sans-serif; color: #eee; }
    #c { position: fixed; inset: 0; width: 100%; height: 100%; touch-action: none; z-index: 0; }

    .ui-panel {
      position: fixed; left: 20px; top: 20px; width: 420px; max-height: 95vh;
      background: rgba(10, 10, 14, 0.96); backdrop-filter: blur(25px);
      border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 18px;
      padding: 20px; overflow-y: auto; z-index: 100;
      box-shadow: 0 25px 60px rgba(0,0,0,0.85);
      transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      scrollbar-width: thin; scrollbar-color: #6c5ce7 transparent;
    }
    .ui-panel.hidden { transform: translateX(-480px); }

    h2 { 
      margin: 0 0 18px 0; font-size: 20px; color: #a29bfe; font-weight: 900; 
      text-transform: uppercase; letter-spacing: 1.5px; 
      border-bottom: 2px solid rgba(108, 92, 231, 0.3); padding-bottom: 10px;
      background: linear-gradient(135deg, #6c5ce7, #a29bfe);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .sec-head { 
      font-size: 11px; font-weight: 800; color: #b2b9c6; margin: 18px 0 10px 0; 
      text-transform: uppercase; letter-spacing: 0.8px; display: flex; align-items: center; gap: 8px;
    }

    .row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
    label { font-size: 12px; flex: 1; color: #d1d5db; white-space: nowrap; font-weight: 500; }
    input[type=range] { flex: 2; height: 5px; background: #2a2d35; border-radius: 3px; accent-color: #6c5ce7; cursor: pointer; }
    input[type=text] { flex: 2; background: #1e1e24; border: 1px solid #444; color: #eee; padding: 8px; border-radius: 8px; font-size: 11px; outline: none; }
    input[type=text]:focus { border-color: #6c5ce7; }
    .val { width: 50px; text-align: right; font-size: 11px; font-family: 'Consolas', monospace; color: #a29bfe; font-weight: 600; }
    select, input[type=file] { width: 100%; background: #1e1e24; border: 1px solid #444; color: #eee; padding: 10px; border-radius: 10px; font-size: 11px; outline: none; cursor: pointer; transition: 0.2s; }
    select:hover, input[type=file]:hover { border-color: #6c5ce7; }

    button { 
      flex: 1; padding: 13px; border-radius: 10px; border: none; font-size: 12px; 
      font-weight: 800; cursor: pointer; color: white; background: #2a2d35; 
      transition: all 0.25s; text-transform: uppercase; letter-spacing: 0.5px;
    }
    button:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
    button.primary { background: linear-gradient(135deg, #6c5ce7, #a29bfe); box-shadow: 0 5px 20px rgba(108,92,231,0.4); }
    button.primary:hover { box-shadow: 0 8px 25px rgba(108,92,231,0.6); }
    button.danger { background: rgba(255, 71, 87, 0.2); border: 1px solid rgba(255, 71, 87, 0.4); color: #ff7675; }
    button.warn { background: rgba(253, 203, 110, 0.2); border: 1px solid rgba(253, 203, 110, 0.4); color: #ffeaa7; }
    button.success { background: rgba(85, 239, 196, 0.2); border: 1px solid rgba(85, 239, 196, 0.4); color: #55efc4; }

    .layer-list { max-height: 220px; overflow-y: auto; background: rgba(0,0,0,0.4); border-radius: 10px; padding: 6px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.05); }
    .layer-item { 
      padding: 12px; font-size: 12px; border-radius: 8px; cursor: move; 
      display: flex; align-items: center; gap: 12px; margin-bottom: 5px; 
      border: 1px solid transparent; transition: all 0.2s;
      background: rgba(255,255,255,0.02);
    }
    .layer-item:hover { background: rgba(108, 92, 231, 0.15); border-color: rgba(108, 92, 231, 0.3); }
    .layer-item.active { background: rgba(108, 92, 231, 0.3); border-color: rgba(108, 92, 231, 0.6); color: white; box-shadow: 0 0 15px rgba(108, 92, 231, 0.3); }
    .layer-item.dragging { opacity: 0.5; transform: scale(0.95); }

    .toggle-ui { 
      position: fixed; bottom: 30px; right: 30px; width: 56px; height: 56px; 
      background: linear-gradient(135deg, #1e1e24, #2a2d35); border-radius: 50%; 
      display: grid; place-items: center; font-size: 22px; 
      border: 2px solid #6c5ce7; z-index: 200; cursor: pointer; 
      box-shadow: 0 8px 25px rgba(108, 92, 231, 0.5); transition: 0.3s;
    }
    .toggle-ui:hover { transform: scale(1.1); box-shadow: 0 10px 30px rgba(108, 92, 231, 0.7); }

    #vrBtn { 
      position: fixed; bottom: 35px; left: 50%; transform: translateX(-50%); 
      padding: 16px 50px; background: linear-gradient(135deg, #6c5ce7, #0984e3); 
      color: white; border-radius: 60px; border: none; font-weight: 900; 
      cursor: pointer; z-index: 1000; display: none; font-size: 14px;
      box-shadow: 0 0 35px rgba(108,92,231,0.7); animation: pulse 2s infinite;
      text-transform: uppercase; letter-spacing: 2px;
    }
    @keyframes pulse { 
      0% {box-shadow: 0 0 25px rgba(108,92,231,0.7);} 
      50% {box-shadow: 0 0 45px rgba(108,92,231,0.9);} 
      100% {box-shadow: 0 0 25px rgba(108,92,231,0.7);} 
    }

    #modeBadge{
      position: fixed; top: 20px; right: 20px; z-index: 1200;
      background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.15);
      padding: 12px 16px; border-radius: 14px; font-size: 13px;
      display:flex; gap:12px; align-items:center;
      backdrop-filter: blur(15px);
      box-shadow: 0 5px 20px rgba(0,0,0,0.5);
    }
    #modeDot{ width:12px; height:12px; border-radius:50%; background:#55efc4; box-shadow: 0 0 20px rgba(85,239,196,0.7); }
    #modeText{ color:#e8e8e8; font-weight:900; letter-spacing:0.8px; }
    #exitXrBtn{ 
      display:none; padding:10px 14px; border-radius:12px; 
      border:1px solid rgba(255,255,255,0.2); background:rgba(255,255,255,0.1); 
      color:#fff; cursor:pointer; font-weight:900; transition: 0.2s;
      text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;
    }
    #exitXrBtn:hover { background:rgba(255,255,255,0.15); }

    .loader { 
      position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 5000; 
      display: none; place-items: center; flex-direction: column; gap: 20px; 
      color: #a29bfe; font-size: 15px; font-weight: 900; letter-spacing: 3px; 
    }
    .spinner { 
      width: 50px; height: 50px; border: 5px solid #333; 
      border-top-color: #6c5ce7; border-right-color: #a29bfe;
      border-radius: 50%; animation: spin 1s infinite linear; 
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .hint {
      font-size: 11px; color: #9aa5b1; line-height: 1.4;
      background: rgba(108, 92, 231, 0.08); border: 1px solid rgba(108, 92, 231, 0.2);
      padding: 12px; border-radius: 12px; margin-top: 12px;
    }
    .kbd { 
      font-family: 'Consolas', monospace; font-size: 11px; color:#fff;
      background: rgba(108, 92, 231, 0.25); padding: 3px 8px; border-radius: 8px; 
      border: 1px solid rgba(108, 92, 231, 0.3); font-weight: 700;
    }

    #mediaPlayer {
      position: fixed; bottom: 110px; left: 50%; transform: translateX(-50%);
      background: rgba(10, 10, 14, 0.97); backdrop-filter: blur(25px);
      border: 1px solid rgba(108, 92, 231, 0.3); border-radius: 18px;
      padding: 18px 24px; display: none; z-index: 150;
      box-shadow: 0 12px 45px rgba(0,0,0,0.8);
      min-width: 450px;
    }
    #mediaPlayer.show { display: block; }
    .media-type-badge { 
      font-size: 10px; padding: 4px 10px; border-radius: 6px; 
      background: rgba(108, 92, 231, 0.2); color: #a29bfe; 
      font-weight: 800; letter-spacing: 0.5px; margin-bottom: 10px;
      display: inline-block;
    }
    .media-btn-row { display: flex; gap: 12px; align-items: center; margin-bottom: 14px; }
    .media-btn { 
      width: 44px; height: 44px; border-radius: 50%; background: #2a2d35; 
      border: 1px solid #555; display: grid; place-items: center; 
      cursor: pointer; transition: 0.2s; font-size: 20px;
    }
    .media-btn:hover { background: #3a3d45; border-color: #6c5ce7; transform: scale(1.05); }
    .media-btn.active { background: #6c5ce7; border-color: #a29bfe; }
    .media-progress { flex: 1; height: 8px; background: #2a2d35; border-radius: 4px; cursor: pointer; position: relative; }
    .media-progress-bar { height: 100%; background: linear-gradient(90deg, #6c5ce7, #a29bfe); border-radius: 4px; width: 0%; transition: width 0.1s; }
    .media-time { font-size: 12px; color: #b2b9c6; font-family: 'Consolas', monospace; min-width: 110px; text-align: center; font-weight: 600; }

    .preset-grid { display: flex; gap: 8px; flex-wrap: wrap; margin: 10px 0; }
    .preset-item { 
      width: 38px; height: 38px; border-radius: 10px; cursor: pointer; 
      border: 2px solid transparent; transition: 0.2s; position: relative;
      display: grid; place-items: center; font-size: 20px;
    }
    .preset-item:hover { border-color: #6c5ce7; transform: scale(1.1); }
    .preset-item.active { border-color: #a29bfe; box-shadow: 0 0 20px rgba(108,92,231,0.7); }

    .model-components { 
      max-height: 180px; overflow-y: auto; background: rgba(0,0,0,0.4); 
      border-radius: 10px; padding: 10px; margin: 10px 0; 
      border: 1px solid rgba(255,255,255,0.05);
    }
    .model-comp-item { 
      display: flex; align-items: center; gap: 10px; padding: 8px; 
      font-size: 11px; border-radius: 8px; margin-bottom: 5px;
      background: rgba(255,255,255,0.02); transition: 0.2s;
    }
    .model-comp-item:hover { background: rgba(108, 92, 231, 0.1); }
    .model-comp-item input[type=checkbox] { width: 18px; height: 18px; cursor: pointer; }
    .model-comp-item label { font-size: 11px; flex: 1; cursor: pointer; color: #d1d5db; }

    .view-mode-toggle {
      display: flex; gap: 8px; background: rgba(0,0,0,0.3); padding: 6px;
      border-radius: 10px; margin: 10px 0;
    }
    .view-mode-btn {
      flex: 1; padding: 10px; background: transparent; border: 1px solid transparent;
      border-radius: 8px; font-size: 11px; font-weight: 700; color: #999;
      cursor: pointer; transition: 0.2s; text-align: center;
    }
    .view-mode-btn.active {
      background: linear-gradient(135deg, #6c5ce7, #a29bfe);
      color: white; border-color: rgba(255,255,255,0.2);
    }
    .size-badge {
      display: inline-block; background: rgba(108, 92, 231, 0.15); 
      color: #a29bfe; padding: 4px 10px; border-radius: 6px; 
      font-size: 10px; font-weight: 700; margin-left: 8px;
      border: 1px solid rgba(108, 92, 231, 0.3);
    }
  </style>
</head>
<body>

<canvas id="c"></canvas>
<div class="loader" id="loader"><div class="spinner"></div><span>CARGANDO...</span></div>

<div id="modeBadge">
  <div id="modeDot"></div>
  <div id="modeText">MODO EDITOR</div>
  <button id="exitXrBtn" title="Salir de XR para editar">SALIR</button>
</div>

<div id="mediaPlayer">
  <div class="media-type-badge" id="mediaTypeBadge">VIDEO</div>
  <div class="media-btn-row">
    <div class="media-btn" id="mediaPlayPause" title="Play/Pause">▶️</div>
    <div class="media-btn" id="mediaStop" title="Stop">⏹️</div>
    <div class="media-progress" id="mediaProgress">
      <div class="media-progress-bar" id="mediaProgressBar"></div>
    </div>
    <div class="media-time" id="mediaTime">0:00 / 0:00</div>
  </div>
  <div class="row">
    <label>🔊 Volumen</label>
    <input type="range" id="mediaVolume" min="0" max="1" step="0.01" value="1">
    <span class="val" id="v_mediaVolume">100</span>
  </div>
  <div id="audioControls" style="display:none;">
    <div class="row">
      <label>⚡ Velocidad</label>
      <input type="range" id="audioSpeed" min="0.25" max="2" step="0.05" value="1">
      <span class="val" id="v_audioSpeed">1.0x</span>
    </div>
    <div class="row">
      <label>🎚️ Tipo Audio</label>
      <select id="audioType">
        <option value="global">Global (2D)</option>
        <option value="spatial">Espacial 3D</option>
      </select>
    </div>
    <div id="spatialControls" style="display:none;">
      <div class="row">
        <label>📏 Distancia Ref.</label>
        <input type="range" id="audioRefDist" min="0.1" max="50" step="0.1" value="1">
        <span class="val" id="v_audioRefDist">1.0</span>
      </div>
      <div class="row">
        <label>🌀 Efecto Doppler</label>
        <input type="range" id="audioDoppler" min="0" max="10" step="0.1" value="1">
        <span class="val" id="v_audioDoppler">1.0</span>
      </div>
    </div>
  </div>
</div>
<div class="ui-panel" id="ui">
  <h2>🥽 MR Studio Diamond v6.0</h2>

  <div class="sec-head">📂 Archivos <button class="warn" style="padding:6px 12px; font-size:10px; width:auto; flex:0;" onclick="fileInput.click()">+ IMPORTAR</button></div>
  <input type="file" id="fileInput" accept="image/*,video/*,audio/*,.gif,.glb,.gltf,.fbx,.obj" multiple style="display:none;" />
  
  <div class="sec-head">🌐 Cargar desde URL</div>
  <div class="row">
    <input type="text" id="urlInput" placeholder="https://ejemplo.com/video.mp4" style="flex:3;">
    <button class="success" onclick="loadFromURL()" style="flex:0; padding:10px 16px; white-space:nowrap;">Cargar</button>
  </div>

  <div class="layer-list" id="layerList"></div>

  <div class="sec-head">🧭 Editor Avanzado</div>
  <div class="row">
    <label><input type="checkbox" id="checkGrid" checked> Grilla</label>
    <label><input type="checkbox" id="checkAxes" checked> Ejes</label>
  </div>
  <div class="row">
    <label><input type="checkbox" id="checkSnap"> Snap (0.25m)</label>
    <label><input type="checkbox" id="checkGizmo" checked> Gizmos</label>
  </div>
  <div class="row">
    <label><input type="checkbox" id="checkOcclusion"> Oclusión Real</label>
  </div>
  <div class="row">
    <label><input type="checkbox" id="checkRealScale"> Escala Real (1:1)</label>
  </div>

  <div id="generalControls">
    <div class="sec-head">📍 Proyección & Vista</div>
    <div class="row">
      <select id="projSelect">
        <option value="plane">Plano 2D</option>
        <option value="360">Esfera 360° (Inmersiva)</option>
        <option value="180">Domo 180° (Inmersiva)</option>
      </select>
    </div>

    <div id="viewModeSection" style="display:none;">
      <div class="sec-head">🌟 Modo de Vista 360/180</div>
      <div class="view-mode-toggle">
        <div class="view-mode-btn active" data-mode="orb">🔮 Orbe</div>
        <div class="view-mode-btn" data-mode="immersive">🌊 Inmersivo</div>
      </div>
      <div class="hint"><b>Orbe:</b> Ves el 360° como una esfera exterior (movible).<br><b>Inmersivo:</b> Estás dentro del contenido 360°.</div>
    </div>

    <div class="row" id="surfaceRow" style="display:none;">
      <label>Superficie</label>
      <select id="surfaceSelect" style="flex:2;">
        <option value="sphere">Esfera</option>
        <option value="cube">Cubo</option>
        <option value="ovoid">Ovoide</option>
      </select>
    </div>

    <div class="row" id="followRow" style="display:none;">
      <label>Centrar en Usuario</label>
      <input type="checkbox" id="followViewer" style="flex:0; width:20px; height:20px;">
    </div>

    <div class="sec-head">📏 Transformación <span class="size-badge" id="sizeInfo">--</span></div>
    <div class="row">
      <label>Escala</label>
      <input type="range" id="scale" min="0.001" max="500" step="0.001" value="1">
      <span class="val" id="v_scale">1.00</span>
    </div>
    <div class="row">
      <label>Flip Horizontal</label>
      <input type="checkbox" id="checkFlip" style="flex:0; width:20px; height:20px;">
    </div>

    <div id="posControls">
      <div class="row">
        <label>Pos X</label>
        <input type="range" id="posX" min="-20" max="20" step="0.1" value="0">
        <span class="val" id="v_posX">0.0</span>
      </div>
      <div class="row">
        <label>Pos Y (Altura)</label>
        <input type="range" id="posY" min="-10" max="10" step="0.1" value="1.6">
        <span class="val" id="v_posY">1.6</span>
      </div>
      <div class="row">
        <label>Pos Z (Distancia)</label>
        <input type="range" id="posZ" min="-30" max="30" step="0.1" value="-2">
        <span class="val" id="v_posZ">-2.0</span>
      </div>
    </div>
    
    <div class="row">
      <label>Rotación Y</label>
      <input type="range" id="rotY" min="0" max="360" step="1" value="0">
      <span class="val" id="v_rotY">0</span>
    </div>
  </div>

  <div id="modelControls" style="display:none;">
    <div class="sec-head">🎨 Renderizado 3D</div>
    <div class="row">
      <select id="renderMode">
        <option value="standard">Standard (PBR)</option>
        <option value="wireframe">Wireframe</option>
        <option value="flat">Flat Shading</option>
        <option value="workbench">Workbench</option>
      </select>
    </div>

    <div class="sec-head">🧩 Componentes</div>
    <div class="model-components" id="modelComponentsList"></div>

    <div class="sec-head">🖼️ Material</div>
    <div class="row">
      <label>Textura</label>
      <input type="file" id="textureInput" accept="image/*" style="flex:2; padding:8px; font-size:10px;">
    </div>
  </div>

  <div id="mediaControls" style="display:none;">
    <div class="sec-head">🎨 Color & Imagen</div>
    <div class="row">
      <label>Brillo</label>
      <input type="range" id="brightness" min="-1" max="1" step="0.05" value="0">
      <span class="val" id="v_brightness">0.00</span>
    </div>
    <div class="row">
      <label>Contraste</label>
      <input type="range" id="contrast" min="0" max="3" step="0.1" value="1">
      <span class="val" id="v_contrast">1.0</span>
    </div>
    <div class="row">
      <label>Saturación</label>
      <input type="range" id="saturation" min="0" max="3" step="0.1" value="1">
      <span class="val" id="v_saturation">1.0</span>
    </div>
    <div class="row">
      <label>Gamma</label>
      <input type="range" id="gamma" min="0.1" max="3" step="0.1" value="1">
      <span class="val" id="v_gamma">1.0</span>
    </div>

    <div class="sec-head">🧼 Anti Dominante</div>
    <div class="row">
      <label>Anti-Azul</label>
      <input type="range" id="deblue" min="0" max="1" step="0.01" value="0">
      <span class="val" id="v_deblue">0.00</span>
    </div>
    <div class="row">
      <label>Anti-Verde</label>
      <input type="range" id="degreen" min="0" max="1" step="0.01" value="0">
      <span class="val" id="v_degreen">0.00</span>
    </div>

    <div class="sec-head">🖼️ Ajuste Visual</div>
    <div class="row">
      <label>Offset X</label>
      <input type="range" id="offsetX" min="-1" max="1" step="0.01" value="0">
      <span class="val" id="v_offsetX">0.00</span>
    </div>
    <div class="row">
      <label>Offset Y</label>
      <input type="range" id="offsetY" min="-1" max="1" step="0.01" value="0">
      <span class="val" id="v_offsetY">0.00</span>
    </div>

    <div class="sec-head">🎭 Chroma Key Ultra Pro</div>
    <div class="row">
      <label>Activar Chroma</label> 
      <input type="checkbox" id="chromaActive" style="flex:0; width:20px; height:20px;">
    </div>

    <div id="chromaControls" style="display:none;">
      <div style="font-size:10px; color:#b2b9c6; margin-bottom:10px; font-weight:600;">Presets Rápidos:</div>
      <div class="preset-grid">
        <div class="preset-item" data-color="0,1,0" style="background:#0f0;">🟢</div>
        <div class="preset-item" data-color="0,0,1" style="background:#00f;">🔵</div>
        <div class="preset-item" data-color="1,0,0" style="background:#f00;">🔴</div>
        <div class="preset-item" data-color="1,1,0" style="background:#ff0;">🟡</div>
        <div class="preset-item" data-color="1,0,1" style="background:#f0f;">🟣</div>
        <div class="preset-item" data-color="0,1,1" style="background:#0ff;">🔷</div>
        <div class="preset-item" data-color="0.5,0.5,0.5" style="background:#888;">⚪</div>
        <div class="preset-item" data-color="0,0,0" style="background:#000; border:1px solid #555;">⚫</div>
        <div class="preset-item" data-color="1,1,1" style="background:#fff; border:1px solid #555;">⚪</div>
      </div>

      <div class="row">
        <label>Invertir</label> 
        <input type="checkbox" id="chromaInvert" style="flex:0; width:20px; height:20px;">
      </div>

      <div style="background:rgba(108,92,231,0.1); padding:12px; border-radius:10px; margin:10px 0; border:1px solid rgba(108,92,231,0.2);">
        <div class="row">
          <label style="color:#ff7675">🔴 Rojo</label>
          <input type="range" id="keyR" min="0" max="1" step="0.01" value="0">
          <span class="val" id="v_keyR">0.00</span>
        </div>
        <div class="row">
          <label style="color:#55efc4">🟢 Verde</label>
          <input type="range" id="keyG" min="0" max="1" step="0.01" value="1">
          <span class="val" id="v_keyG">1.00</span>
        </div>
        <div class="row">
          <label style="color:#74b9ff">🔵 Azul</label>
          <input type="range" id="keyB" min="0" max="1" step="0.01" value="0">
          <span class="val" id="v_keyB">0.00</span>
        </div>
        <div id="colorPrev" style="height:10px; width:100%; border-radius:6px; background:#0f0; margin-top:8px;"></div>
      </div>

      <div class="sec-head">🎨 Chroma Avanzado (Multicolor)</div>
      <div class="row">
        <label>Color 2 R</label>
        <input type="range" id="keyR2" min="0" max="1" step="0.01" value="0">
        <span class="val" id="v_keyR2">0.00</span>
      </div>
      <div class="row">
        <label>Color 2 G</label>
        <input type="range" id="keyG2" min="0" max="1" step="0.01" value="0">
        <span class="val" id="v_keyG2">0.00</span>
      </div>
      <div class="row">
        <label>Color 2 B</label>
        <input type="range" id="keyB2" min="0" max="1" step="0.01" value="0">
        <span class="val" id="v_keyB2">0.00</span>
      </div>
      <div class="row">
        <label>Mezcla Color 2</label>
        <input type="range" id="chromaMix" min="0" max="1" step="0.01" value="0">
        <span class="val" id="v_chromaMix">0.00</span>
      </div>

      <div class="row">
        <label>Similitud</label>
        <input type="range" id="sim" min="0" max="1" step="0.0001" value="0.4">
        <span class="val" id="v_sim">0.4000</span>
      </div>
      <div class="row">
        <label>Suavizado</label>
        <input type="range" id="smooth" min="0" max="0.5" step="0.0001" value="0.08">
        <span class="val" id="v_smooth">0.0800</span>
      </div>
      <div class="row">
        <label>Despill</label>
        <input type="range" id="despill" min="0" max="1" step="0.01" value="0.5">
        <span class="val" id="v_despill">0.50</span>
      </div>
    </div>
    
    <div class="row">
      <label>Opacidad</label>
      <input type="range" id="opacity" min="0" max="1" step="0.01" value="1">
      <span class="val" id="v_opacity">1.00</span>
    </div>

    <div class="sec-head">✨ Efectos & Shaders</div>
    <div class="row">
      <select id="shaderEffect">
        <option value="none">Sin Efecto</option>
        <option value="glitch">Glitch Digital</option>
        <option value="vhs">VHS Retro</option>
        <option value="pixelate">Pixelado</option>
        <option value="edge">Edge Detection</option>
        <option value="invert">Invertir Colores</option>
        <option value="sepia">Sepia Vintage</option>
      </select>
    </div>
    <div class="row" id="fxIntensityRow" style="display:none;">
      <label>Intensidad FX</label>
      <input type="range" id="fxIntensity" min="0" max="1" step="0.01" value="0.5">
      <span class="val" id="v_fxIntensity">0.50</span>
    </div>
  </div>

  <div style="margin-top:25px; display:flex; gap:10px;">
    <button class="primary" onclick="centerActive()">🎯 Centrar</button>
    <button class="warn" onclick="reloadMedia()">🔄 Reload</button>
    <button class="danger" onclick="deleteActive()">🗑️ Borrar</button>
  </div>

  <div class="hint">
    <b>Atajos:</b> <span class="kbd">G</span> mover, <span class="kbd">R</span> rotar, <span class="kbd">S</span> escala, <span class="kbd">Supr</span> borrar.
  </div>
</div>

<div class="toggle-ui" onclick="toggleUI()">👁️</div>
<button id="vrBtn">🥽 ENTRAR EN MR</button>

<script type="importmap">
  { "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/"
    } }
</script>

<script type="module">
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

console.log('🚀 MR Studio Diamond v6.0 iniciando...');

let scene, camera, renderer, xrSession, xrRefSpace;
let objects = [];
let activeId = null;
let transformControl, orbit;
let grid, axes;
let raycaster, mouse = new THREE.Vector2();
let hoverId;
let occlusionEnabled = false;
let realScaleMode = false;
let audioListener;

const ctrl = {
  right: { gripped: false, lastPos: new THREE.Vector3(), lastQuat: new THREE.Quaternion(), lastTrig: false, lastBtn: false, currPos: new THREE.Vector3(), currQuat: new THREE.Quaternion() },
  left: { gripped: false },
  gesture: { active: false, startDist: 0, startScale: 1 }
};

let rightRay, rayCursor;

const vertShader = `
varying vec2 vUv;
uniform vec2 offset;
void main() {
  vUv = uv + offset;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragShader = `
uniform sampler2D map;
uniform bool chromaEnabled, chromaInvert;
uniform vec3 keyColor, keyColor2;
uniform float chromaMix;
uniform float similarity, smoothness, opacity, despill;
uniform float brightness, contrast, saturation, gamma;
uniform float deblue, degreen;
uniform int shaderEffect;
uniform float fxIntensity;
uniform float time;
varying vec2 vUv;

vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 adjustColor(vec3 color) {
  color += brightness;
  color = (color - 0.5) * contrast + 0.5;
  float gray = dot(color, vec3(0.299, 0.587, 0.114));
  color = mix(vec3(gray), color, saturation);
  color = pow(max(color, 0.0), vec3(1.0 / gamma));
  return color;
}

vec3 removeBlueGray(vec3 col, float amt) {
  if(amt <= 0.0) return col;
  vec3 hsv = rgb2hsv(col);
  float lowSat = 1.0 - smoothstep(0.20, 0.45, hsv.y);
  float midVal = smoothstep(0.15, 0.95, hsv.z);
  float hueCyan = 1.0 - smoothstep(0.20, 0.32, abs(hsv.x - 0.50));
  float w = amt * lowSat * midVal * hueCyan;
  float g = dot(col, vec3(0.299, 0.587, 0.114));
  vec3 neutral = vec3(g);
  vec3 outc = mix(col, neutral, w * 0.65);
  outc.b = mix(outc.b, outc.b * (1.0 - 0.35*w), 1.0);
  return outc;
}

vec3 removeGreenGray(vec3 col, float amt) {
  if(amt <= 0.0) return col;
  vec3 hsv = rgb2hsv(col);
  float lowSat = 1.0 - smoothstep(0.20, 0.45, hsv.y);
  float midVal = smoothstep(0.15, 0.95, hsv.z);
  float hueGreen = 1.0 - smoothstep(0.15, 0.30, abs(hsv.x - 0.33));
  float w = amt * lowSat * midVal * hueGreen;
  float g = dot(col, vec3(0.299, 0.587, 0.114));
  vec3 neutral = vec3(g);
  vec3 outc = mix(col, neutral, w * 0.65);
  outc.g = mix(outc.g, outc.g * (1.0 - 0.35*w), 1.0);
  return outc;
}

vec3 applyShaderEffect(vec3 col, vec2 uv) {
  if(shaderEffect == 1) {
    float glitch = sin(time * 10.0 + uv.y * 50.0) * fxIntensity * 0.05;
    vec2 uvG = uv + vec2(glitch, 0.0);
    vec3 glitchCol = texture2D(map, uvG).rgb;
    return mix(col, glitchCol, fxIntensity);
  }
  else if(shaderEffect == 2) {
    float noise = fract(sin(dot(uv + time, vec2(12.9898, 78.233))) * 43758.5453);
    float scanline = sin(uv.y * 800.0 + time * 10.0) * 0.04;
    vec3 vhs = col + vec3(noise * 0.1 + scanline) * fxIntensity;
    return vhs;
  }
  else if(shaderEffect == 3) {
    float pixelSize = mix(1.0, 32.0, fxIntensity);
    vec2 pixelUv = floor(uv * pixelSize) / pixelSize;
    return texture2D(map, pixelUv).rgb;
  }
  else if(shaderEffect == 4) {
    vec2 texelSize = vec2(1.0 / 1024.0);
    float edge = 0.0;
    edge += length(texture2D(map, uv + texelSize * vec2(1,0)).rgb - col);
    edge += length(texture2D(map, uv + texelSize * vec2(0,1)).rgb - col);
    return mix(col, vec3(edge * 4.0), fxIntensity);
  }
  else if(shaderEffect == 5) {
    return mix(col, 1.0 - col, fxIntensity);
  }
  else if(shaderEffect == 6) {
    vec3 sepia = vec3(
      dot(col, vec3(0.393, 0.769, 0.189)),
      dot(col, vec3(0.349, 0.686, 0.168)),
      dot(col, vec3(0.272, 0.534, 0.131))
    );
    return mix(col, sepia, fxIntensity);
  }
  return col;
}

void main() {
  vec4 tex = texture2D(map, vUv);
  vec3 col = tex.rgb;
  float alpha = tex.a * opacity;

  if (chromaEnabled) {
    vec3 targetKey = mix(keyColor, keyColor2, chromaMix);
    vec3 hsv = rgb2hsv(col);
    vec3 kHsv = rgb2hsv(targetKey);

    float hueDist = abs(hsv.x - kHsv.x);
    if (hueDist > 0.5) hueDist = 1.0 - hueDist;
    
    float satDist = abs(hsv.y - kHsv.y);
    float valDist = abs(hsv.z - kHsv.z);
    
    float rgbDist = distance(col, targetKey);
    float isGray = 1.0 - smoothstep(0.0, 0.3, kHsv.y);
    
    float dist = mix(
      sqrt(pow(hueDist * 2.0, 2.0) + pow(satDist, 2.0) + pow(valDist * 0.5, 2.0)),
      rgbDist,
      isGray
    );
    
    float mask = smoothstep(similarity, similarity + smoothness, dist);

    float skinProtect = 0.0;
    if(targetKey.g > 0.7 || targetKey.b > 0.7) {
      float skinHue = smoothstep(0.0, 0.1, hsv.x) * (1.0 - smoothstep(0.1, 0.15, hsv.x));
      float skinSat = smoothstep(0.2, 0.6, hsv.y);
      skinProtect = skinHue * skinSat * 3.0;
    }
    if(skinProtect > 0.0) mask = clamp(mask + skinProtect, 0.0, 1.0);

    if (!chromaInvert) {
      alpha *= mask;
      
      if(mask < 0.95 && despill > 0.0) {
        if(targetKey.g > targetKey.r && targetKey.g > targetKey.b) {
          float maxRB = max(col.r, col.b);
          col.g = mix(col.g, maxRB, (1.0 - mask) * despill);
        } else if(targetKey.b > targetKey.g && targetKey.b > targetKey.r) {
          float maxRG = max(col.r, col.g);
          col.b = mix(col.b, maxRG, (1.0 - mask) * despill);
        }
      }
    } else {
      alpha *= (1.0 - mask);
    }
  }

  col = removeBlueGray(col, deblue);
  col = removeGreenGray(col, degreen);
  col = adjustColor(col);
  col = applyShaderEffect(col, vUv);

  gl_FragColor = vec4(col, alpha);
  if (alpha < 0.01) discard;
}
`;
function init() {
  console.log('Iniciando renderer...');
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('c'), alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType('local-floor');

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.01, 2000);
  camera.position.set(0, 1.6, 3);

  audioListener = new THREE.AudioListener();
  camera.add(audioListener);

  scene.add(new THREE.AmbientLight(0xffffff, 1.2));
  const d = new THREE.DirectionalLight(0xffffff, 1.5); 
  d.position.set(2, 5, 2); 
  scene.add(d);

  grid = new THREE.GridHelper(30, 60, 0x6c5ce7, 0x333333);
  grid.position.y = 0;
  scene.add(grid);

  axes = new THREE.AxesHelper(2.5);
  axes.position.set(0, 0.01, 0);
  scene.add(axes);

  orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enableDamping = true;
  orbit.dampingFactor = 0.06;
  orbit.target.set(0, 1.6, 0);
  orbit.update();

  transformControl = new TransformControls(camera, renderer.domElement);
  transformControl.setSize(1.3);
  transformControl.addEventListener('dragging-changed', e=>{ orbit.enabled = !e.value; });
  transformControl.setTranslationSnap(null);
  transformControl.setRotationSnap(null);
  transformControl.setScaleSnap(null);
  scene.add(transformControl);

  setupVR();
  initRay();
  initMousePick();
  initShortcuts();
  initMediaPlayer();
  initChromaPresets();
  initLayerDragDrop();
  initViewModeToggle();
  initEventListeners();

  window.addEventListener('resize', onResize);
  renderer.setAnimationLoop(render);

  document.getElementById('exitXrBtn').onclick = ()=>{ if(xrSession) xrSession.end(); };
  setMode(false);

  console.log('✅ MR Studio Diamond v6.0 inicializado');
}

function initEventListeners() {
  document.getElementById('checkGrid').addEventListener('change', e=>grid.visible=e.target.checked);
  document.getElementById('checkAxes').addEventListener('change', e=>axes.visible=e.target.checked);
  document.getElementById('checkGizmo').addEventListener('change', e=>transformControl.visible=e.target.checked);
  document.getElementById('checkSnap').addEventListener('change', e=>{ transformControl.setTranslationSnap(e.target.checked ? 0.25 : null); });
  document.getElementById('checkRealScale').addEventListener('change', e=>{ realScaleMode = e.target.checked; updateSizeInfo(); });
  document.getElementById('chromaActive').addEventListener('change', e=>{ document.getElementById('chromaControls').style.display = e.target.checked ? 'block' : 'none'; });
  document.getElementById('renderMode').addEventListener('change', e=>{ const o = objects.find(x=>x.id===activeId); if(o && o.type==='model') applyRenderMode(o, e.target.value); });
  document.getElementById('textureInput').addEventListener('change', async e=>{ if(!e.target.files.length) return; const o = objects.find(x=>x.id===activeId); if(!o || o.type!=='model') return; const tex = await new THREE.TextureLoader().loadAsync(URL.createObjectURL(e.target.files[0])); tex.colorSpace = THREE.SRGBColorSpace; o.mesh.traverse(c=>{ if(c.isMesh && c.material) { if(Array.isArray(c.material)) c.material.forEach(m=>m.map=tex); else c.material.map = tex; } }); });
  document.getElementById('shaderEffect').addEventListener('change', e=>{ const o = objects.find(x=>x.id===activeId); if(!o || o.type==='model' || o.type==='audio') return; const val = parseInt(e.target.value === 'none' ? 0 : e.target.selectedIndex); o.settings.shaderEffect = val; document.getElementById('fxIntensityRow').style.display = val > 0 ? 'flex' : 'none'; applyUniforms(o); });
  document.getElementById('audioType').addEventListener('change', e=>{ document.getElementById('spatialControls').style.display = e.target.value === 'spatial' ? 'block' : 'none'; const o = objects.find(x=>x.id===activeId); if(o && o.audio) updateAudioType(o); });
  document.getElementById('fileInput').addEventListener('change', handleFileUpload);
}

function onResize() {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function setMode(isXR){
  const dot = document.getElementById('modeDot');
  const text = document.getElementById('modeText');
  const exitBtn = document.getElementById('exitXrBtn');
  if(isXR){ 
    dot.style.background = '#ff7675'; 
    dot.style.boxShadow = '0 0 20px rgba(255,118,117,0.8)'; 
    text.innerText = 'MODO MR'; 
    exitBtn.style.display = 'inline-block'; 
    orbit.enabled = false; 
    grid.visible = false; 
    axes.visible = false; 
  } else { 
    dot.style.background = '#55efc4'; 
    dot.style.boxShadow = '0 0 20px rgba(85,239,196,0.7)'; 
    text.innerText = 'MODO EDITOR'; 
    exitBtn.style.display = 'none'; 
    orbit.enabled = true; 
    grid.visible = document.getElementById('checkGrid').checked; 
    axes.visible = document.getElementById('checkAxes').checked; 
  }
}

function initViewModeToggle() {
  document.querySelectorAll('.view-mode-btn').forEach(btn => {
    btn.onclick = () => {
      const mode = btn.dataset.mode;
      const o = objects.find(x=>x.id===activeId);
      if(!o || (o.settings.projection !== '360' && o.settings.projection !== '180')) return;
      document.querySelectorAll('.view-mode-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      o.settings.viewMode = mode;
      applyViewMode(o);
    };
  });
}

function applyViewMode(obj) {
  if(obj.settings.projection === 'plane' || obj.type === 'model' || obj.type === 'audio') return;
  const mode = obj.settings.viewMode || 'immersive';
  if(mode === 'orb') { 
    obj.mesh.scale.set(2, 2, 2); 
    obj.mesh.position.set(0, 1.6, -3); 
    obj.settings.scale = 2; 
    obj.settings.posX = 0; 
    obj.settings.posY = 1.6; 
    obj.settings.posZ = -3; 
    if(obj.mesh.material) obj.mesh.material.side = THREE.FrontSide; 
  } else { 
    const bs = obj.baseScale || 1; 
    obj.mesh.scale.set(20 * bs, 20 * bs, 20 * bs); 
    obj.mesh.position.set(0, 0, 0); 
    obj.settings.scale = 20; 
    obj.settings.posX = 0; 
    obj.settings.posY = 0; 
    obj.settings.posZ = 0; 
    if(obj.mesh.material) obj.mesh.material.side = THREE.BackSide; 
  }
  syncUI();
}

function initMediaPlayer() {
  let activeMedia = null;
  const updatePlayer = () => {
    const o = objects.find(x=>x.id===activeId);
    const player = document.getElementById('mediaPlayer');
    const badge = document.getElementById('mediaTypeBadge');
    const audioCtrl = document.getElementById('audioControls');
    if(o && (o.video || o.audio)) { 
      activeMedia = o.video || o.audio; 
      player.classList.add('show'); 
      badge.innerText = o.video ? '🎬 VIDEO' : '🎵 AUDIO'; 
      audioCtrl.style.display = o.audio ? 'block' : 'none'; 
      const btn = document.getElementById('mediaPlayPause'); 
      btn.innerHTML = activeMedia.paused ? '▶️' : '⏸️'; 
      document.getElementById('mediaVolume').value = activeMedia.volume; 
      document.getElementById('v_mediaVolume').innerText = Math.round(activeMedia.volume * 100); 
    } else { 
      activeMedia = null; 
      player.classList.remove('show'); 
    }
  };
  document.getElementById('mediaPlayPause').onclick = () => { if(!activeMedia) return; if(activeMedia.paused) activeMedia.play(); else activeMedia.pause(); updatePlayer(); };
  document.getElementById('mediaStop').onclick = () => { if(!activeMedia) return; activeMedia.pause(); activeMedia.currentTime = 0; updatePlayer(); };
  document.getElementById('mediaProgress').onclick = (e) => { if(!activeMedia) return; const rect = e.currentTarget.getBoundingClientRect(); const x = e.clientX - rect.left; const pct = x / rect.width; activeMedia.currentTime = pct * activeMedia.duration; };
  document.getElementById('mediaVolume').oninput = (e) => { if(!activeMedia) return; activeMedia.volume = parseFloat(e.target.value); document.getElementById('v_mediaVolume').innerText = Math.round(activeMedia.volume * 100); };
  setInterval(() => { if(!activeMedia || activeMedia.paused) return; const pct = (activeMedia.currentTime / activeMedia.duration) * 100; document.getElementById('mediaProgressBar').style.width = pct + '%'; const fmt = (s) => { if(!isFinite(s)) return '0:00'; const m = Math.floor(s/60); const sec = Math.floor(s%60); return `${m}:${sec.toString().padStart(2,'0')}`; }; document.getElementById('mediaTime').innerText = `${fmt(activeMedia.currentTime)} / ${fmt(activeMedia.duration)}`; }, 100);
  window.addEventListener('activeObjChanged', updatePlayer);
}

function initChromaPresets() {
  document.querySelectorAll('.preset-item').forEach(el=>{ el.onclick = () => { const color = el.dataset.color; if(!color) return; const [r,g,b] = color.split(',').map(Number); updateObj('keyR', r); updateObj('keyG', g); updateObj('keyB', b); syncUI(); document.querySelectorAll('.preset-item').forEach(e=>e.classList.remove('active')); el.classList.add('active'); }; });
}

function initLayerDragDrop() {
  let draggedId = null;
  window.addEventListener('layerListUpdated', ()=>{ document.querySelectorAll('.layer-item').forEach(el=>{ el.draggable = true; el.ondragstart = (e) => { draggedId = el.dataset.id; el.classList.add('dragging'); }; el.ondragend = () => { el.classList.remove('dragging'); draggedId = null; }; el.ondragover = (e) => { e.preventDefault(); const afterElement = getDragAfterElement(e.clientY); const dragging = document.querySelector('.dragging'); if(afterElement == null) { document.getElementById('layerList').appendChild(dragging); } else { document.getElementById('layerList').insertBefore(dragging, afterElement); } }; el.ondrop = (e) => { e.preventDefault(); if(!draggedId) return; const items = [...document.querySelectorAll('.layer-item')]; const newOrder = items.map(item=>item.dataset.id); const newObjects = []; newOrder.forEach(id=>{ const obj = objects.find(o=>o.id===id); if(obj) newObjects.push(obj); }); objects = newObjects; updateRenderOrder(); }; }); });
}

function getDragAfterElement(y) {
  const draggableElements = [...document.querySelectorAll('.layer-item:not(.dragging)')];
  return draggableElements.reduce((closest, child) => { const box = child.getBoundingClientRect(); const offset = y - box.top - box.height / 2; if (offset < 0 && offset > closest.offset) { return { offset: offset, element: child }; } else { return closest; } }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateRenderOrder() {
  objects.forEach((o, i) => { if(o.mesh) o.mesh.renderOrder = i; });
}

function populateModelComponents(obj) {
  const list = document.getElementById('modelComponentsList');
  list.innerHTML = '';
  const components = [];
  obj.mesh.traverse(child => { if(child.isMesh || child.isLight) { components.push({ name: child.name || child.type, obj: child, type: child.isLight ? '💡' : '📦' }); } });
  if(components.length === 0) { list.innerHTML = '<div style="color:#888; font-size:10px; padding:10px;">Sin componentes</div>'; return; }
  components.forEach(comp => { const item = document.createElement('div'); item.className = 'model-comp-item'; item.innerHTML = `<input type="checkbox" checked data-compname="${comp.name}"><label>${comp.type} ${comp.name}</label>`; item.querySelector('input').onchange = (e) => { comp.obj.visible = e.target.checked; }; list.appendChild(item); });
}

function applyRenderMode(obj, mode) {
  obj.renderMode = mode;
  obj.mesh.traverse(child => { if(!child.isMesh) return; const mats = Array.isArray(child.material) ? child.material : [child.material]; mats.forEach(mat => { switch(mode) { case 'wireframe': mat.wireframe = true; mat.flatShading = false; break; case 'flat': mat.wireframe = false; mat.flatShading = true; mat.needsUpdate = true; break; case 'workbench': mat.wireframe = false; mat.flatShading = true; mat.color.setHex(0xcccccc); mat.roughness = 0.8; mat.metalness = 0.1; mat.needsUpdate = true; break; default: mat.wireframe = false; mat.flatShading = false; mat.needsUpdate = true; } }); });
}

window.loadFromURL = async () => {
  const url = document.getElementById('urlInput').value.trim();
  if(!url) { alert('Por favor ingresa una URL'); return; }
  
  toggleLoader(true);
  try {
    let finalUrl = url;
    
    if(url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
      const videoId = url.includes('youtu.be/') ? url.split('youtu.be/')[1].split('?')[0] : new URLSearchParams(url.split('?')[1]).get('v');
      finalUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}`;
      
      const iframe = document.createElement('iframe');
      iframe.src = finalUrl;
      iframe.style.display = 'none';
      iframe.allow = 'autoplay';
      document.body.appendChild(iframe);
      
      alert('YouTube detectado: Usa la opción de captura de pantalla de tu navegador para proyectar el video en MR.');
      toggleLoader(false);
      return;
    }
    
    const ext = finalUrl.split('.').pop().split('?')[0].toLowerCase();
    const name = finalUrl.split('/').pop().split('?')[0] || 'recurso_web';
    
    if(['mp4', 'webm', 'ogg'].includes(ext) || url.includes('video')) {
      await loadVideo(finalUrl, name);
    } else if(['mp3', 'wav', 'ogg', 'm4a'].includes(ext) || url.includes('audio')) {
      await loadAudio(finalUrl, name);
    } else if(['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      if(ext === 'gif') {
        const response = await fetch(finalUrl);
        const blob = await response.blob();
        const file = new File([blob], name, { type: 'image/gif' });
        await loadGif(file, name);
      } else {
        await loadImg(finalUrl, name);
      }
    } else if(['glb', 'gltf'].includes(ext)) {
      await load3D(finalUrl, name, 'gltf');
    } else {
      alert('Formato no soportado. Intenta con: video (mp4, webm), audio (mp3, wav), imagen (jpg, png, gif) o 3D (glb, gltf)');
    }
    
    document.getElementById('urlInput').value = '';
  } catch(err) {
    console.error('Error cargando desde URL:', err);
    alert('Error al cargar el recurso. Verifica la URL y los permisos CORS.');
  }
  toggleLoader(false);
};

async function handleFileUpload(e) {
  if(!e.target.files.length) return;
  toggleLoader(true);
  for(const f of e.target.files) {
    try {
      const url = URL.createObjectURL(f);
      const n = f.name.toLowerCase();
      if(n.match(/\.(glb|gltf)$/)) await load3D(url, n, 'gltf');
      else if(n.match(/\.fbx$/)) await load3D(url, n, 'fbx');
      else if(n.match(/\.obj$/)) await load3D(url, n, 'obj');
      else if(n.match(/\.gif$/)) await loadGif(f, n);
      else if(f.type.startsWith('video/') || n.includes('360') || n.includes('180')) await loadVideo(url, n);
      else if(f.type.startsWith('audio/') || n.match(/\.(mp3|wav|m4a|ogg)$/)) await loadAudio(url, n);
      else if(f.type.startsWith('image/')) await loadImg(url, n);
    } catch(err) { console.error('Error cargando:', f.name, err); }
  }
  toggleLoader(false);
  e.target.value = '';
}

async function loadVideo(url, name) {
  const vid = document.createElement('video');
  vid.src = url; 
  vid.crossOrigin = 'anonymous';
  vid.loop = true; 
  vid.muted = false;
  vid.playsInline = true;
  vid.style.display = 'none'; 
  document.body.appendChild(vid);

  await new Promise(resolve => {
    vid.onloadedmetadata = () => resolve();
    vid.play().catch(e=>console.log("Autoplay:", e));
  });

  const tex = new THREE.VideoTexture(vid);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping; 
  tex.wrapT = THREE.RepeatWrapping;
  tex.minFilter = THREE.LinearFilter; 
  tex.magFilter = THREE.LinearFilter;

  let proj = 'plane';
  if(name.includes('360')) proj='360';
  else if(name.includes('180')) proj='180';

  const ar = (vid.videoWidth && vid.videoHeight) ? vid.videoWidth/vid.videoHeight : 1.77;
  const mesh = createMesh(proj, 'sphere', tex, ar);
  const obj = { id: uid(), mesh, name, type:'video', video:vid, tex, settings: defSettings() };
  obj.settings.projection = proj;
  
  if(proj !== 'plane') { 
    obj.settings.viewMode = 'immersive'; 
    obj.mesh.frustumCulled = false;
    applyViewMode(obj); 
  } else { 
    mesh.position.set(0, 1.6, -2); 
    obj.settings.posX = 0; 
    obj.settings.posY = 1.6; 
    obj.settings.posZ = -2; 
  }
  addObj(obj);
}

async function loadAudio(url, name) {
  const audio = new THREE.Audio(audioListener);
  const loader = new THREE.AudioLoader();
  await new Promise((resolve, reject) => { loader.load(url, buffer => { audio.setBuffer(buffer); audio.setLoop(true); audio.setVolume(1.0); resolve(); }, undefined, reject); });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshStandardMaterial({ color: 0x6c5ce7, emissive: 0x6c5ce7, emissiveIntensity: 0.5 }));
  mesh.position.set(0, 1.6, -2);
  const obj = { id: uid(), mesh, name, type: 'audio', audio, settings: defSettings() };
  obj.settings.audioType = 'global'; obj.settings.audioSpeed = 1.0; obj.settings.audioRefDist = 1.0; obj.settings.audioDoppler = 1.0; obj.settings.posX = 0; obj.settings.posY = 1.6; obj.settings.posZ = -2;
  addObj(obj);
  audio.play();
}

async function loadGif(file, name) {
  const buf = await file.arrayBuffer();
  let R = window.GifReader || (window.Omggif ? window.Omggif.GifReader : null);
  if(!R) return;
  const r = new R(new Uint8Array(buf));
  const w=r.width, h=r.height;
  const cvs=document.createElement('canvas'); cvs.width=w; cvs.height=h;
  const ctx=cvs.getContext('2d'); const dat=ctx.createImageData(w,h);
  const tex=new THREE.CanvasTexture(cvs); tex.colorSpace=THREE.SRGBColorSpace; tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
  const mesh = createMesh('plane', 'sphere', tex, w/h);
  mesh.position.set(0, 1.6, -2);
  const obj = { id:uid(), mesh, name, type:'gif', settings:defSettings(), gif:{r,ctx,dat,tex,f:0,num:r.numFrames(),t:0,fps:10} };
  obj.settings.posX = 0; obj.settings.posY = 1.6; obj.settings.posZ = -2;
  addObj(obj);
}

async function loadImg(url, name) {
  const tex = await new THREE.TextureLoader().loadAsync(url);
  tex.colorSpace = THREE.SRGBColorSpace; tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
  const mesh = createMesh('plane', 'sphere', tex, tex.image.width/tex.image.height);
  mesh.position.set(0, 1.6, -2);
  const obj = { id:uid(), mesh, name, type:'image', tex, settings:defSettings() };
  obj.settings.posX = 0; obj.settings.posY = 1.6; obj.settings.posZ = -2;
  obj.realSize = { width: tex.image.width / 1000, height: tex.image.height / 1000 };
  addObj(obj);
}

async function load3D(url, name, type) {
  let m;
  if(type==='gltf') m=(await new GLTFLoader().loadAsync(url)).scene;
  else if(type==='fbx') m=await new FBXLoader().loadAsync(url);
  else m=await new OBJLoader().loadAsync(url);
  const box = new THREE.Box3().setFromObject(m);
  const sz = box.getSize(new THREE.Vector3());
  const sc = sz.length() > 0 ? 2/sz.length() : 1;
  m.scale.setScalar(sc); m.position.set(0, 1, -2);
  m.traverse(c=>{ if(c.isMesh) { if(!c.material.transparent) c.material.transparent = true; c.material.depthWrite = true; c.castShadow = true; } });
  const obj = { id:uid(), mesh:m, name, type:'model', settings:defSettings(), renderMode: 'standard' };
  obj.baseScale = sc; obj.settings.posX = 0; obj.settings.posY = 1; obj.settings.posZ = -2;
  obj.realSize = { width: sz.x, height: sz.y, depth: sz.z };
  addObj(obj);
}
function createMesh(proj, surface, tex, aspect) {
  let geo, side=THREE.DoubleSide;
  const makeInside = (g)=>{ g.computeVertexNormals(); return g; };
  if(proj === '360') { 
    side = THREE.BackSide; 
    if(surface === 'cube'){ geo = makeInside(new THREE.BoxGeometry(40, 40, 40, 1, 1, 1)); } 
    else { geo = makeInside(new THREE.SphereGeometry(20, 64, 64)); if(surface === 'ovoid') geo.scale(1.25, 1.0, 1.0); } 
  } else if(proj === '180') { 
    side = THREE.BackSide; 
    geo = makeInside(new THREE.SphereGeometry(20, 64, 64, 0, Math.PI)); 
    if(surface === 'ovoid') geo.scale(1.25, 1.0, 1.0); 
    geo.rotateY(-Math.PI/2); 
  } else { 
    geo = new THREE.PlaneGeometry(aspect, 1); 
  }
  const mat = new THREE.ShaderMaterial({ uniforms: { map: { value: tex }, chromaEnabled:{value:false}, chromaInvert:{value:false}, keyColor:{value:new THREE.Color(0,1,0)}, keyColor2:{value:new THREE.Color(0,0,0)}, chromaMix:{value:0}, similarity:{value:0.4}, smoothness:{value:0.08}, despill:{value:0.5}, offset:{value:new THREE.Vector2(0,0)}, opacity:{value:1.0}, brightness:{value:0.0}, contrast:{value:1.0}, saturation:{value:1.0}, gamma:{value:1.0}, deblue:{value:0.0}, degreen:{value:0.0}, shaderEffect:{value:0}, fxIntensity:{value:0.5}, time:{value:0} }, vertexShader: vertShader, fragmentShader: fragShader, transparent: true, side: side, depthWrite: (proj==='plane'), depthTest: true });
  const mesh = new THREE.Mesh(geo, mat);
  if(proj !== 'plane') { mesh.frustumCulled = false; mesh.renderOrder = -1; }
  return mesh;
}

function defSettings() {
  return { scale:1, posX:0, posY:1.6, posZ:-2, rotY:0, projection:'plane', surface:'sphere', followViewer:false, viewMode:'immersive', flipX:false, chromaEnabled:false, chromaInvert:false, keyR:0, keyG:1, keyB:0, keyR2:0, keyG2:0, keyB2:0, chromaMix:0, sim:0.4, smooth:0.08, despill:0.5, offsetX:0, offsetY:0, opac:1, brightness:0, contrast:1, saturation:1, gamma:1, deblue:0, degreen:0, shaderEffect:0, fxIntensity:0.5, audioType:'global', audioSpeed:1.0, audioRefDist:1.0, audioDoppler:1.0 };
}

function uid() { return Math.random().toString(36).substr(2,9); }

function addObj(obj) {
  scene.add(obj.mesh); objects.push(obj); updateRenderOrder(); updateList(); selectObj(obj.id);
}

function updateAudioType(obj) {
  if(!obj.audio) return;
  const type = obj.settings.audioType;
  if(type === 'spatial') { const spatial = new THREE.PositionalAudio(audioListener); spatial.setBuffer(obj.audio.buffer); spatial.setRefDistance(obj.settings.audioRefDist); spatial.setLoop(obj.audio.getLoop()); spatial.setVolume(obj.audio.getVolume()); spatial.setPlaybackRate(obj.settings.audioSpeed); obj.mesh.add(spatial); if(obj.audio.isPlaying) { const time = obj.audio.context.currentTime - obj.audio._startedAt; obj.audio.stop(); spatial.play(); spatial.source.currentTime = time; } obj.audio = spatial; } else { const global = new THREE.Audio(audioListener); global.setBuffer(obj.audio.buffer); global.setLoop(obj.audio.getLoop()); global.setVolume(obj.audio.getVolume()); global.setPlaybackRate(obj.settings.audioSpeed); if(obj.audio.isPlaying) { const time = obj.audio.context.currentTime - obj.audio._startedAt; obj.audio.stop(); global.play(); global.source.currentTime = time; } obj.audio = global; }
}

function updateObj(k, v) {
  const o = objects.find(x=>x.id===activeId); if(!o) return;
  o.settings[k]=v; const s = o.settings; const m = o.mesh;
  if(k==='projection' || k==='surface') { if(o.type==='model' || o.type==='audio') return; scene.remove(m); let ar=1.77; if(o.video) ar=o.video.videoWidth/o.video.videoHeight; else if(o.tex && o.tex.image) ar=o.tex.image.width/o.tex.image.height; const tex = o.tex || m.material.uniforms?.map.value; const nm = createMesh(s.projection, s.surface, tex, ar); nm.rotation.copy(m.rotation); nm.position.copy(m.position); nm.scale.copy(m.scale); o.mesh = nm; applyUniforms(o); if(s.projection !== 'plane') { nm.frustumCulled = false; applyViewMode(o); } scene.add(nm); selectObj(o.id); return; }
  if(k==='scale' || k==='flipX') { const bs = o.baseScale || 1; const dir = s.flipX ? -1 : 1; m.scale.set(s.scale * bs * dir, s.scale * bs, s.scale * bs); updateSizeInfo(); }
  if(k==='posX' || k==='posY' || k==='posZ') { m.position.set(s.posX, s.posY, s.posZ); }
  if(k==='rotY') { m.rotation.y = THREE.MathUtils.degToRad(s.rotY) + (s.projection==='180'?-Math.PI/2:0); }
  if(k==='audioSpeed' && o.audio) { o.audio.setPlaybackRate(v); }
  if(k==='audioRefDist' && o.audio && o.audio.panner) { o.audio.setRefDistance(v); }
  if(k==='audioDoppler' && o.audio && o.audio.panner) { o.audio.panner.dopplerFactor = v; }
  if(o.type !== 'model' && o.type !== 'audio' && m.material?.uniforms) { applyUniforms(o); }
}

function applyUniforms(o){ const s=o.settings; const m=o.mesh; if(o.type === 'model' || o.type === 'audio') return; if(!m.material?.uniforms) return; const u=m.material.uniforms; u.chromaEnabled.value=s.chromaEnabled; u.chromaInvert.value=s.chromaInvert; u.keyColor.value.setRGB(s.keyR, s.keyG, s.keyB); u.keyColor2.value.setRGB(s.keyR2, s.keyG2, s.keyB2); u.chromaMix.value=s.chromaMix; u.similarity.value=s.sim; u.smoothness.value=s.smooth; u.despill.value=s.despill; u.offset.value.set(s.offsetX, s.offsetY); u.opacity.value=s.opac; u.brightness.value=s.brightness; u.contrast.value=s.contrast; u.saturation.value=s.saturation; u.gamma.value=s.gamma; u.deblue.value=s.deblue; u.degreen.value=s.degreen; u.shaderEffect.value=s.shaderEffect||0; u.fxIntensity.value=s.fxIntensity||0.5; }

const bind = (id, k, type='float') => { const el = document.getElementById(id); if(!el) return; el.addEventListener('input', e=>{ let v=e.target.value; if(type==='float') v=parseFloat(v); else if(type==='bool') v=e.target.checked; updateObj(k,v); syncUI(); }); };

bind('projSelect','projection','str'); bind('surfaceSelect','surface','str'); bind('followViewer','followViewer','bool'); bind('scale','scale'); bind('posX','posX'); bind('posY','posY'); bind('posZ','posZ'); bind('rotY','rotY'); bind('chromaActive','chromaEnabled','bool'); bind('chromaInvert','chromaInvert','bool'); bind('keyR','keyR'); bind('keyG','keyG'); bind('keyB','keyB'); bind('keyR2','keyR2'); bind('keyG2','keyG2'); bind('keyB2','keyB2'); bind('chromaMix','chromaMix'); bind('sim','sim'); bind('smooth','smooth'); bind('despill','despill'); bind('offsetX','offsetX'); bind('offsetY','offsetY'); bind('opacity','opac'); bind('brightness','brightness'); bind('contrast','contrast'); bind('saturation','saturation'); bind('gamma','gamma'); bind('deblue','deblue'); bind('degreen','degreen'); bind('fxIntensity','fxIntensity'); bind('audioSpeed','audioSpeed'); bind('audioRefDist','audioRefDist'); bind('audioDoppler','audioDoppler'); bind('checkFlip', 'flipX', 'bool');

function updateSizeInfo() {
  const o = objects.find(x=>x.id===activeId);
  const badge = document.getElementById('sizeInfo');
  if(!o || !o.realSize) { badge.textContent = '--'; return; }
  if(realScaleMode) {
    if(o.type === 'model') {
      const s = o.settings.scale * o.baseScale;
      badge.textContent = `${(o.realSize.width * s).toFixed(2)}m × ${(o.realSize.height * s).toFixed(2)}m × ${(o.realSize.depth * s).toFixed(2)}m`;
    } else {
      const s = o.settings.scale;
      badge.textContent = `${(o.realSize.width * s).toFixed(2)}m × ${(o.realSize.height * s).toFixed(2)}m`;
    }
  } else {
    badge.textContent = `Escala: ${o.settings.scale.toFixed(3)}x`;
  }
}

function selectObj(id) {
  activeId = id; const o = objects.find(x=>x.id===id);
  if(o) { 
    if(o.settings.projection === 'plane' || o.type === 'model' || o.type === 'audio') { transformControl.attach(o.mesh); } 
    else { if(o.settings.viewMode === 'orb') { transformControl.attach(o.mesh); } else { transformControl.detach(); } }
    const isMedia = (o.type === 'image' || o.type === 'video' || o.type === 'gif'); const is3D = (o.type === 'model'); const isAudio = (o.type === 'audio');
    document.getElementById('mediaControls').style.display = isMedia ? 'block' : 'none'; document.getElementById('modelControls').style.display = is3D ? 'block' : 'none'; document.getElementById('generalControls').style.display = (isMedia || is3D || isAudio) ? 'block' : 'none';
    const is360 = (o.settings.projection === '360' || o.settings.projection === '180'); document.getElementById('viewModeSection').style.display = is360 ? 'block' : 'none';
    if(is360) { document.querySelectorAll('.view-mode-btn').forEach(btn => { if(btn.dataset.mode === (o.settings.viewMode || 'immersive')) { btn.classList.add('active'); } else { btn.classList.remove('active'); } }); }
    if(is3D) { populateModelComponents(o); document.getElementById('renderMode').value = o.renderMode || 'standard'; }
    syncUI(); updateSizeInfo(); window.dispatchEvent(new Event('activeObjChanged'));
  } else { transformControl.detach(); document.getElementById('mediaControls').style.display = 'none'; document.getElementById('modelControls').style.display = 'none'; }
  updateList();
}

function syncUI() {
  const o = objects.find(x=>x.id===activeId); if(!o) return; const s = o.settings;
  const set = (id, v) => { const el=document.getElementById(id); if(!el) return; if(el.type !== 'checkbox') el.value=v; const t=document.getElementById('v_'+id); if(t) { if(typeof v==='number') { if(id==='sim' || id==='smooth') t.innerText=v.toFixed(4); else if(id==='despill' || id==='fxIntensity' || id==='chromaMix') t.innerText=v.toFixed(2); else if(id==='audioSpeed') t.innerText=v.toFixed(2)+'x'; else t.innerText=v.toFixed(2); } else { t.innerText = v; } } };
  if(o.type!=='model' && o.type!=='audio') { document.getElementById('projSelect').value = s.projection; }
  const is360 = (s.projection === '360' || s.projection === '180'); document.getElementById('posControls').style.display = 'block'; document.getElementById('surfaceRow').style.display = is360 ? 'flex' : 'none'; document.getElementById('followRow').style.display = is360 ? 'flex' : 'none';
  if(is360){ document.getElementById('surfaceSelect').value = s.surface || 'sphere'; document.getElementById('followViewer').checked = !!s.followViewer; }
  set('scale',s.scale); set('posX',s.posX); set('posY',s.posY); set('posZ',s.posZ); set('rotY',s.rotY); document.getElementById('checkFlip').checked = s.flipX;
  if(o.type !== 'model' && o.type !== 'audio') { document.getElementById('chromaActive').checked = s.chromaEnabled; document.getElementById('chromaControls').style.display = s.chromaEnabled ? 'block' : 'none'; document.getElementById('chromaInvert').checked = s.chromaInvert; set('keyR',s.keyR); set('keyG',s.keyG); set('keyB',s.keyB); set('keyR2',s.keyR2||0); set('keyG2',s.keyG2||0); set('keyB2',s.keyB2||0); set('chromaMix',s.chromaMix||0); document.getElementById('colorPrev').style.background = `rgb(${s.keyR*255},${s.keyG*255},${s.keyB*255})`; set('sim',s.sim); set('smooth',s.smooth); set('despill',s.despill); set('offsetX',s.offsetX); set('offsetY',s.offsetY); set('opacity',s.opac); set('brightness',s.brightness); set('contrast',s.contrast); set('saturation',s.saturation); set('gamma',s.gamma); set('deblue', s.deblue); set('degreen', s.degreen); const fx = s.shaderEffect || 0; document.getElementById('shaderEffect').selectedIndex = fx; document.getElementById('fxIntensityRow').style.display = fx > 0 ? 'flex' : 'none'; set('fxIntensity', s.fxIntensity || 0.5); }
  if(o.type === 'audio') { set('audioSpeed', s.audioSpeed || 1.0); set('audioRefDist', s.audioRefDist || 1.0); set('audioDoppler', s.audioDoppler || 1.0); document.getElementById('audioType').value = s.audioType || 'global'; document.getElementById('spatialControls').style.display = s.audioType === 'spatial' ? 'block' : 'none'; }
}

window.centerActive = () => { const o=objects.find(x=>x.id===activeId); if(!o) return; o.mesh.position.set(0,1.6,-2); o.mesh.rotation.set(0,0,0); o.settings.posX=0; o.settings.posY=1.6; o.settings.posZ=-2; o.settings.rotY=0; syncUI(); };
window.reloadMedia = () => { const o=objects.find(x=>x.id===activeId); if(o && o.video) { o.video.pause(); o.video.currentTime=0; o.video.play().catch(e=>console.log(e)); } if(o && o.audio) { o.audio.stop(); o.audio.play(); } };
window.deleteActive = () => { const i = objects.findIndex(x=>x.id===activeId); if(i>-1) { const o=objects[i]; scene.remove(o.mesh); if(o.video){ o.video.pause(); o.video.remove(); } if(o.audio){ o.audio.stop(); if(o.audio.parent) o.audio.parent.remove(o.audio); } if(o.mesh.geometry) o.mesh.geometry.dispose(); objects.splice(i,1); activeId=null; selectObj(null); updateRenderOrder(); } };

function updateList() {
  const l=document.getElementById('layerList'); l.innerHTML='';
  objects.forEach(o=>{ const d=document.createElement('div'); d.className=`layer-item ${o.id===activeId?'active':''}`; d.dataset.id = o.id; let icon = '🎬'; if(o.type==='model') icon='📦'; else if(o.type==='audio') icon='🎵'; else if(o.settings.projection==='360'||o.settings.projection==='180') icon='🌐'; d.innerHTML=`<span>${icon}</span> <span style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${o.name}</span>`; d.onclick=()=>selectObj(o.id); l.appendChild(d); });
  window.dispatchEvent(new Event('layerListUpdated'));
}

window.toggleUI=()=>document.getElementById('ui').classList.toggle('hidden');
function toggleLoader(s){ document.getElementById('loader').style.display=s?'flex':'none'; }

function initMousePick() {
  raycaster = new THREE.Raycaster;
  renderer.domElement.addEventListener('pointerdown', e => { if(xrSession) return; if(transformControl.dragging) return; const rect = renderer.domElement.getBoundingClientRect(); mouse.x = 2 * (e.clientX - rect.left) / rect.width - 1; mouse.y = -2 * (e.clientY - rect.top) / rect.height + 1; const meshes = objects.map(o => o.mesh); raycaster.setFromCamera(mouse, camera); const hits = raycaster.intersectObjects(meshes, true); if(hits.length) { let hitObj = hits[0].object; const obj = objects.find(o => { let current = hitObj; while(current) { if(current === o.mesh) return true; current = current.parent; } return false; }); if(obj) selectObj(obj.id); } });
}

function initShortcuts() {
  window.addEventListener('keydown', e => { if(e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA')) return; if(e.key === 'Delete' || e.key === 'Backspace') deleteActive(); if(e.key.toLowerCase() === 'g') transformControl.setMode('translate'); if(e.key.toLowerCase() === 'r') transformControl.setMode('rotate'); if(e.key.toLowerCase() === 's') transformControl.setMode('scale'); if(e.key === 'Escape') transformControl.detach(); });
}

function tickGifs(dt) {
  for(const o of objects) { if(!o.gif) continue; const g = o.gif; g.t += dt; const frameTime = 1 / (g.fps || 10); if(g.t < frameTime) continue; g.t = 0; g.r.decodeAndBlitFrameRGBA(g.f, g.dat.data); g.ctx.putImageData(g.dat, 0, 0); g.tex.needsUpdate = true; g.f = (g.f + 1) % g.num; }
}

function setupVR() {
  if('xr' in navigator) { navigator.xr.isSessionSupported('immersive-ar').then(supported => { if(supported) { const btn = document.getElementById('vrBtn'); btn.style.display = 'block'; btn.onclick = startVR; } }); }
}

async function startVR() {
  occlusionEnabled = document.getElementById('checkOcclusion').checked;
  const sessionInit = { requiredFeatures: ['local-floor'], optionalFeatures: ['dom-overlay'], domOverlay: { root: document.body } };
  if(occlusionEnabled) { sessionInit.optionalFeatures.push('depth-sensing'); sessionInit.depthSensing = { usagePreference: ['gpu-optimized'], dataFormatPreference: ['luminance-alpha'] }; }
  try { 
    xrSession = await navigator.xr.requestSession('immersive-ar', sessionInit); 
    await renderer.xr.setSession(xrSession);
    xrRefSpace = renderer.xr.getReferenceSpace();
    setMode(true); 
    xrSession.addEventListener('end', () => { xrSession = null; xrRefSpace = null; setMode(false); }); 
  } catch(err) { console.error('Error XR:', err); alert('No se pudo iniciar MR: ' + err.message); }
}

function initRay() {
  rightRay = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,-5)]), new THREE.LineBasicMaterial({ color: 0x6c5ce7, linewidth: 4 }));
  scene.add(rightRay);
  rayCursor = new THREE.Mesh(new THREE.SphereGeometry(0.04), new THREE.MeshBasicMaterial({ color: 0xff9c65, emissive: 0xff9c65 }));
  scene.add(rayCursor);
}

function handleVR(frame, dt) {
  if(!xrSession || !xrRefSpace) return;
  let lSrc, rSrc;
  for(const s of xrSession.inputSources) { if(s.handedness==='left') lSrc=s; if(s.handedness==='right') rSrc=s; }

  if(rSrc && rSrc.gripSpace) {
    const p = frame.getPose(rSrc.gripSpace, xrRefSpace);
    if(p) {
      const pos = p.transform.position;
      rightRay.position.set(pos.x,pos.y,pos.z);
      rightRay.quaternion.set(p.transform.orientation.x, p.transform.orientation.y, p.transform.orientation.z, p.transform.orientation.w);
      rightRay.visible = true;
      const orig = new THREE.Vector3(pos.x, pos.y, pos.z);
      const dir = new THREE.Vector3(0,0,-1).applyQuaternion(rightRay.quaternion);
      const targets = objects.map(o=>o.mesh);
      const hits = new THREE.Raycaster(orig, dir, 0, 15).intersectObjects(targets, true);
      if(hits.length>0) { rayCursor.visible = true; rayCursor.position.copy(hits[0].point); let m = hits[0].object; const found = objects.find(o => { let x=m; while(x){ if(x===o.mesh)return true; x=x.parent; } return false; }); hoverId = found ? found.id : null; } else { rayCursor.visible=false; hoverId=null; }
      ctrl.right.currPos = orig; ctrl.right.currQuat = rightRay.quaternion.clone();
    }
  }

  if(rSrc && rSrc.gamepad) {
    const gp = rSrc.gamepad;
    const trig = gp.buttons[0].pressed;
    const grip = gp.buttons[1].pressed;
    const btnA = gp.buttons[4]?.pressed || gp.buttons[5]?.pressed;

    if(trig && !ctrl.right.lastTrig && hoverId) { selectObj(hoverId); }
    ctrl.right.lastTrig = trig;

    if(btnA && !ctrl.right.lastBtn && activeId) { const o = objects.find(x=>x.id===activeId); if(o && o.video) { if(o.video.paused) o.video.play(); else o.video.pause(); } if(o && o.audio) { if(o.audio.isPlaying) o.audio.pause(); else o.audio.play(); } }
    ctrl.right.lastBtn = btnA;

    const sx = gp.axes[2]||0; const sy = gp.axes[3]||0;

    const obj = objects.find(o=>o.id===activeId);
    if(obj && !grip) {
      if(Math.abs(sx)>0.1) { obj.mesh.position.x += sx*dt*2; obj.settings.posX = obj.mesh.position.x; }
      if(Math.abs(sy)>0.1) { obj.mesh.position.z += sy*dt*2; obj.settings.posZ = obj.mesh.position.z; }
    }

    if(grip && obj) {
      if(ctrl.right.gripped) { const dQ = ctrl.right.currQuat.clone().multiply(ctrl.right.lastQuat.clone().invert()); obj.mesh.quaternion.premultiply(dQ); syncUI(); }

      if(lSrc && lSrc.gamepad) {
        const lGrip = lSrc.gamepad.buttons[1].pressed;
        const lsy = lSrc.gamepad.axes[3]||0;
        if(Math.abs(lsy)>0.1) { obj.mesh.position.y -= lsy*dt; obj.settings.posY = obj.mesh.position.y; syncUI(); }

        if(lGrip) {
          const lp = frame.getPose(lSrc.gripSpace, xrRefSpace);
          if(lp) {
            const lPos = new THREE.Vector3(lp.transform.position.x, lp.transform.position.y, lp.transform.position.z);
            const d = lPos.distanceTo(ctrl.right.currPos);
            if(!ctrl.left.gripped) { ctrl.gesture.startDist=d; ctrl.gesture.startScale=obj.settings.scale; } 
            else { const ns = Math.max(0.001, ctrl.gesture.startScale * (d/ctrl.gesture.startDist)); updateObj('scale', ns); }
          }
          ctrl.left.gripped = true;
        } else { ctrl.left.gripped = false; }
      }
      ctrl.right.gripped = true; ctrl.right.lastQuat.copy(ctrl.right.currQuat);
    } else { ctrl.right.gripped = false; }
  }
}

let lastTime = performance.now();
function render(time, frame) {
  const dt = Math.min(0.05, (time - lastTime) / 1000); lastTime = time;
  if(!xrSession) orbit.update();
  tickGifs(dt);
  objects.forEach(o => { if(o.mesh && o.mesh.material && o.mesh.material.uniforms && o.mesh.material.uniforms.time) { o.mesh.material.uniforms.time.value = time / 1000; } });
  for(const o of objects){ if(o.type === 'model' || o.type === 'audio') continue; const s=o.settings; if((s.projection==='360' || s.projection==='180') && s.followViewer && s.viewMode === 'immersive'){ const cam = renderer.xr.isPresenting ? renderer.xr.getCamera(camera) : camera; o.mesh.position.copy(cam.position); } }
  if(frame) handleVR(frame, dt);
  renderer.render(scene, camera);
}

init();
</script>
</body>
</html>