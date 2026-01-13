# 🔌 Plugins de Ejemplo para SculptGL

Esta carpeta contiene plugins de ejemplo que demuestran cómo extender SculptGL con nuevas herramientas y funcionalidades.

## 📦 Plugins Incluidos

### 1. Rainbow Paint (`rainbow-paint.js`)
Pinta la malla con colores del arcoíris mientras arrastras el cursor/dedo.

**Características:**
- Demuestra manipulación de colores de vértices
- Manejo de eventos de entrada (mouse/touch)
- Efecto visual dinámico

### 2. Vertex Jitter (`vertex-jitter.js`)
Desplaza aleatoriamente los vértices para crear texturas rugosas.

**Características:**
- Demuestra modificación de geometría
- Desplazamiento basado en normales
- Actualización de geometría en tiempo real

## 🚀 Cómo Usar los Plugins

1. **Cargar el Plugin:**
   - Abre SculptGL en tu navegador
   - Ve a menú **Add-ons** → **Desde archivo (.js)**
   - Selecciona el archivo `.js` del plugin

2. **Activar el Plugin:**
   - Ve a **Add-ons** → **Administrar plugins...**
   - Habilita el plugin en la lista
   - Haz clic en "Activar" para usarlo

3. **Usar la Herramienta:**
   - Haz clic/toca sobre la malla para aplicar el efecto
   - Arrastra para aplicar continuamente
   - Desactiva el plugin cuando termines

## 🛠️ Crear tu Propio Plugin

### Estructura Básica

```javascript
/**
 * Mi Plugin Personalizado
 */
class MiPlugin {
  constructor(scene, meta) {
    this.scene = scene;  // Acceso a la escena de SculptGL
    this.meta = meta;    // Metadata del plugin
    this.name = 'Mi Plugin';
    this.description = 'Descripción del plugin';
  }

  // Llamado cuando el plugin se activa
  onActivate() {
    console.log('Plugin activado');
  }

  // Llamado cuando el plugin se desactiva
  onDeactivate() {
    console.log('Plugin desactivado');
  }

  // Maneja eventos de entrada (mouse/touch)
  onInput(type, input, picking) {
    // type: 'start', 'move', 'end', 'hover'
    // input: { x, y, buttons, pressure, ... }
    // picking: sistema de intersección con la malla

    const mesh = this.scene.getMesh();
    if (!mesh) return false;

    const intersected = picking.intersectionMouseMeshes();

    if (type === 'start' && intersected) {
      // Hacer algo cuando se toca la malla
      return true; // true = evento manejado
    }

    return false;
  }

  // Llamado en cada frame (opcional)
  onRender() {
    // Dibujar overlays o efectos visuales
  }

  // Limpieza cuando se descarga el plugin
  dispose() {
    console.log('Plugin descargado');
  }
}

// IMPORTANTE: Exportar el plugin
export default MiPlugin;
```

### API Disponible

#### `scene` - La escena de SculptGL
- `scene.getMesh()` - Obtener malla activa
- `scene.getMeshes()` - Obtener todas las mallas
- `scene.render()` - Forzar renderizado
- `scene.getCamera()` - Obtener cámara
- `scene.getPicking()` - Sistema de picking

#### `mesh` - Malla 3D
- `mesh.getVertices()` - Array de vértices (x,y,z,x,y,z,...)
- `mesh.getNormals()` - Array de normales
- `mesh.getColors()` - Array de colores RGB (0-1)
- `mesh.getFaces()` - Array de índices de caras
- `mesh.updateGeometry(iFaces, iVerts)` - Actualizar geometría
- `mesh.updateDuplicateGeometry(iVerts)` - Sincronizar vértices duplicados
- `mesh.updateDuplicateColorsAndMaterials(iVerts)` - Sincronizar colores

#### `picking` - Sistema de intersección
- `picking.intersectionMouseMeshes()` - Detectar intersección
- `picking.getMesh()` - Obtener malla intersectada
- `picking.getPickedVertices()` - Vértices en el área de influencia
- `picking.getIntersectionPoint()` - Punto de intersección 3D
- `picking.getPickedFace()` - Cara intersectada
- `picking.getPickedNormal()` - Normal en el punto de intersección

### Métodos del Plugin

#### Requeridos:
- `constructor(scene, meta)` - Inicialización

#### Opcionales:
- `onActivate()` - Cuando se activa el plugin
- `onDeactivate()` - Cuando se desactiva
- `onInput(type, input, picking)` - Eventos de entrada
- `onRender()` - Cada frame
- `onToolChange(toolId)` - Cuando cambia la herramienta
- `dispose()` - Limpieza final

### Tips de Desarrollo

1. **Usar `console.log()`** para debug
2. **Siempre verificar** que `mesh` existe antes de usarlo
3. **Capturar errores** con try/catch
4. **Llamar `scene.render()`** después de modificar la malla
5. **Exportar con `export default`** para que funcione el sistema

### Ejemplo: Plugin Simple

```javascript
class HelloWorldPlugin {
  constructor(scene) {
    this.scene = scene;
    this.name = 'Hello World';
  }

  onActivate() {
    alert('¡Plugin activado!');
  }

  onInput(type, input, picking) {
    if (type === 'start' && picking.intersectionMouseMeshes()) {
      console.log('¡Tocaste la malla!');
      return true;
    }
    return false;
  }
}

export default HelloWorldPlugin;
```

## 📝 Notas Importantes

- Los plugins son ES Modules (usa `export default`)
- Deben funcionar en el navegador (no usar Node.js APIs)
- Se guardan en localStorage para persistencia
- Pueden activarse/desactivarse sin recargar la página

## 🎨 Ideas para Plugins

- Herramientas de esculpido personalizadas
- Efectos de pintura especiales
- Generadores de patrones
- Herramientas de medición
- Exportadores personalizados
- Efectos de iluminación
- Herramientas de análisis de malla

## 🐛 Debug

Para ver logs del sistema de plugins:
```javascript
// Abre la consola del navegador (F12)
// Verás mensajes como:
// [PluginManager] Registered plugin: Mi Plugin
// [PluginManager] Activated plugin: file:xxx
```

## 📚 Referencias

- [SculptGL Original](https://github.com/stephomi/sculptgl)
- Código fuente: `src/PluginManager.js`
- Panel de gestión: `src/gui/PluginPanel.js`

---

**¡Feliz desarrollo de plugins!** 🎉
