# 🔌 Guía de Desarrollo de Plugins para SculptGL

## 📋 Índice

1. [Anatomía de un Plugin](#anatomía-de-un-plugin)
2. [Tipos de Plugins](#tipos-de-plugins)
3. [Integración con UI](#integración-con-ui)
4. [Modificación de Mesh](#modificación-de-mesh)
5. [Ejemplos Prácticos](#ejemplos-prácticos)

---

## 🧬 Anatomía de un Plugin

Todo plugin de SculptGL debe implementar esta estructura básica:

```javascript
class MiPlugin {
  constructor(scene) {
    this.scene = scene;      // Referencia a la escena de SculptGL
    this.enabled = false;    // Estado del plugin
    this.name = 'Mi Plugin'; // Nombre visible
  }

  onActivate() {
    this.enabled = true;
    // Tu código de inicialización aquí
  }

  onDeactivate() {
    this.enabled = false;
    // Limpieza aquí
  }

  onInput(type, input, picking) {
    if (!this.enabled) return false;

    // type: 'start', 'move', 'end'
    // input: { x, y, buttons, pressure, pointerType }
    // picking: Objeto con información de la mesh clickeada

    return true; // true = bloquea herramientas de SculptGL
  }

  dispose() {
    // Limpieza final
  }
}

export default MiPlugin;
```

---

## 🎨 Tipos de Plugins

### 1. **Plugin con UI Flotante** (Recomendado para visibilidad)

Crea un panel visible que confirma que el plugin está activo:

```javascript
_createUI() {
  this.panel = document.createElement('div');
  this.panel.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: #2a313d;
    color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.5);
    z-index: 9999;
  `;
  this.panel.innerHTML = '<h3>🎨 Mi Plugin Activo!</h3>';
  document.body.appendChild(this.panel);
}

_removeUI() {
  if (this.panel?.parentNode) {
    this.panel.parentNode.removeChild(this.panel);
  }
}
```

### 2. **Plugin que Modifica la Mesh**

Cambia colores, geometría, o propiedades de la mesh:

```javascript
_modifyMeshColor(mesh, color) {
  const colors = mesh.getColors();
  const nbVertices = mesh.getNbVertices();

  for (let i = 0; i < nbVertices; i++) {
    const idx = i * 3;
    colors[idx] = color[0];
    colors[idx + 1] = color[1];
    colors[idx + 2] = color[2];
  }

  mesh.updateColors();
  this.scene.render();
}
```

### 3. **Plugin que Agrega Controles Personalizados**

Integración con el sistema de menús de SculptGL (AVANZADO):

```javascript
// Requiere acceso al GuiManager
_addCustomControls(guiMenu) {
  guiMenu.addButton('Mi Acción', this, 'miAccion');
  guiMenu.addSlider('Intensidad', this, '_intensity', 0, 1, 0.01);
  guiMenu.addCheckbox('Activar', this, '_enabled');
}
```

---

## 🎯 Integración con UI

### ✅ **MÉTODO 1: Panel Flotante Independiente** (MÁS FÁCIL)

**Ventajas:**
- ✅ Totalmente visible y obvio cuando está activo
- ✅ No requiere modificar código core de SculptGL
- ✅ Fácil de implementar y depurar

**Ejemplo:**
```javascript
onActivate() {
  this.enabled = true;

  // Crear panel
  this.panel = document.createElement('div');
  this.panel.id = 'mi-plugin-ui';
  this.panel.innerHTML = `
    <div style="position: fixed; top: 80px; right: 20px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white; padding: 20px; border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.4); z-index: 9999;">
      <h3>🔥 Mi Plugin Activo</h3>
      <p>Haz click en la mesh para modificarla</p>
      <button id="btn-accion">Acción Cool</button>
    </div>
  `;
  document.body.appendChild(this.panel);

  // Event listeners
  document.getElementById('btn-accion').onclick = () => {
    this.hacerAlgoCool();
  };
}
```

### ⚙️ **MÉTODO 2: Integración con GuiAddons** (AVANZADO)

Requiere modificar `src/gui/GuiAddons.js` para exponer métodos:

```javascript
// En GuiAddons.js - agregar método público
getPluginMenu() {
  return this._menu;
}

// En tu plugin
onActivate() {
  const gui = this.scene.getGUI?.();
  if (gui && gui._ctrlAddons) {
    const menu = gui._ctrlAddons.getPluginMenu();
    menu.addButton('Mi Acción', this, 'miAccion');
  }
}
```

---

## 🎨 Modificación de Mesh

### API de Mesh Disponible

```javascript
const mesh = this.scene.getMesh(); // Mesh actual

// GEOMETRÍA
const vertices = mesh.getVerticesProxy();  // Float32Array [x,y,z, x,y,z, ...]
const faces = mesh.getFacesProxy();        // Uint32Array [v1,v2,v3, ...]
const nbVertices = mesh.getNbVertices();
const nbFaces = mesh.getNbFaces();

// COLORES
const colors = mesh.getColors();           // Float32Array [r,g,b, r,g,b, ...]
mesh.updateColors();                       // Aplicar cambios de color

// NORMALES
const normals = mesh.getNormals();
mesh.updateNormals();

// RENDER
this.scene.render();                       // Forzar re-renderizado
```

### Ejemplo: Pintar Región Cercana a un Punto

```javascript
_paintNearPoint(mesh, point, color, radius = 0.05) {
  const vertices = mesh.getVerticesProxy();
  const colors = mesh.getColors();
  const nbVertices = mesh.getNbVertices();
  const radiusSquared = radius * radius;

  for (let i = 0; i < nbVertices; i++) {
    const idx = i * 3;
    const dx = vertices[idx] - point[0];
    const dy = vertices[idx + 1] - point[1];
    const dz = vertices[idx + 2] - point[2];
    const distSquared = dx * dx + dy * dy + dz * dz;

    if (distSquared < radiusSquared) {
      const factor = 1 - Math.sqrt(distSquared) / radius; // Gradiente
      colors[idx] += (color[0] - colors[idx]) * factor;
      colors[idx + 1] += (color[1] - colors[idx + 1]) * factor;
      colors[idx + 2] += (color[2] - colors[idx + 2]) * factor;
    }
  }

  mesh.updateColors();
  this.scene.render();
}
```

---

## 📦 Ejemplos Prácticos

### Ejemplo 1: Plugin Simple con Feedback Visual

```javascript
class SimplePlugin {
  constructor(scene) {
    this.scene = scene;
    this.name = 'Simple Demo';
    this.clicks = 0;
  }

  onActivate() {
    this.enabled = true;
    alert('✅ Plugin Activado! Haz click en la mesh.');
  }

  onDeactivate() {
    this.enabled = false;
    alert(`❌ Plugin Desactivado. Total clicks: ${this.clicks}`);
  }

  onInput(type, input, picking) {
    if (!this.enabled || type !== 'start') return false;

    this.clicks++;
    console.log(`Click #${this.clicks} en:`, picking.getIntersectionPoint());

    // Cambiar color de la mesh
    const mesh = picking.getMesh();
    if (mesh) {
      const colors = mesh.getColors();
      for (let i = 0; i < colors.length; i += 3) {
        colors[i] = Math.random();
        colors[i + 1] = Math.random();
        colors[i + 2] = Math.random();
      }
      mesh.updateColors();
      this.scene.render();
    }

    return true;
  }
}

export default SimplePlugin;
```

### Ejemplo 2: Plugin con Panel de Control Completo

Ver: `src/Add-on/DemoUIPlugin.js` (incluido en el repo)

---

## 🚀 Instalación de Plugins

### Desde Archivo Local

1. Ir a **Add-ons → Administrar plugins**
2. Click en **"Instalar desde archivo"**
3. Seleccionar tu archivo `.js`
4. El plugin quedará guardado en localStorage

### Desde URL

1. Ir a **Add-ons → Administrar plugins**
2. Click en **"Instalar desde URL"**
3. Pegar URL del plugin (debe tener CORS habilitado)
4. Ejemplo: `https://mi-servidor.com/mi-plugin.js`

### Activar/Desactivar

1. Abrir **Add-ons → Administrar plugins**
2. En el panel, hacer click en **"Activar"** junto al plugin deseado
3. Solo UN plugin puede estar activo a la vez

---

## ✅ Checklist de Verificación

Para confirmar que tu plugin funciona:

- [ ] ✅ El plugin aparece en la lista de "Administrar plugins"
- [ ] ✅ Al activarlo, se muestra algún feedback visual (panel, alert, console.log)
- [ ] ✅ Al hacer click en la mesh, se ejecuta `onInput()`
- [ ] ✅ Se pueden ver cambios en la mesh (color, geometría)
- [ ] ✅ Al desactivarlo, se limpia la UI correctamente

---

## 🐛 Debugging

```javascript
// En tu plugin, agregar logs
onActivate() {
  console.log('🟢 PLUGIN ACTIVADO');
  console.log('Scene:', this.scene);
  console.log('Mesh actual:', this.scene.getMesh());
}

onInput(type, input, picking) {
  console.log('INPUT:', type, input, picking);
  return true;
}
```

**Abrir consola del navegador:** `F12` → pestaña "Console"

---

## 📚 Recursos

- **Ejemplo completo con UI:** `src/Add-on/DemoUIPlugin.js`
- **Ejemplo simple:** `src/Add-on/helloworld.js`
- **Ejemplo de pintura:** `src/Add-on/vertextint.js`
- **Sistema de plugins:** `src/PluginManager.js`

---

## 💡 Consejos Finales

1. **Siempre crear UI visible** - Aunque sea un simple `alert()` o `console.log()` para confirmar que el plugin está activo.

2. **Retornar `true` en onInput()** - Para bloquear las herramientas de esculpido de SculptGL cuando tu plugin está manejando el input.

3. **Limpiar en onDeactivate()** - Remover todos los elementos del DOM y event listeners.

4. **Usar this.scene.render()** - Para forzar un re-renderizado después de modificar la mesh.

5. **Probar con mesh simple** - Cargar una esfera o cubo para testear antes de usar modelos complejos.

---

¡Listo! Ahora podés crear plugins completamente funcionales y visibles para SculptGL. 🚀
