# 🧪 Guía de Prueba del Plugin HelloWorld

Este documento explica cómo probar el sistema de plugins usando el plugin de ejemplo **HelloWorld**.

## 📋 Descripción del Plugin

El plugin **HelloWorld** es un plugin simple que:

- ✅ Muestra mensajes en la consola al activarse/desactivarse
- 🖱️ Cuenta y registra cada click del usuario
- 📊 Muestra estadísticas de interacción
- 🎬 Se integra con el ciclo de renderizado
- 🔧 Reacciona a cambios de herramienta

## 🚀 Cómo Probar el Plugin

### Opción 1: Cargar desde URL (Desarrollo Local)

1. **Construir el proyecto:**
   ```bash
   npm run dev
   ```

2. **Servir la aplicación:**
   ```bash
   npm run server
   ```

3. **Abrir en el navegador:**
   - Ir a `http://localhost:8080`

4. **Abrir la consola del navegador:**
   - Chrome/Edge: `F12` o `Ctrl+Shift+I`
   - Safari: `Cmd+Option+I`

5. **Cargar el plugin:**
   - Buscar el menú de Add-ons/Plugins
   - Usar "Install from URL"
   - Ingresar: `http://localhost:8080/src/Add-on/helloworld.js`

### Opción 2: Cargar desde Archivo

1. **Ubicar el archivo:**
   - Ir a `src/Add-on/helloworld.js`

2. **En la aplicación:**
   - Abrir el panel de Plugins
   - Seleccionar "Install from File"
   - Cargar `helloworld.js`

### Opción 3: Importar directamente en código (para testing)

Agregar temporalmente en `src/SculptGL.js`:

```javascript
import HelloWorldPlugin from './Add-on/helloworld';

// En el método start() o después de cargar plugins:
const hwPlugin = new HelloWorldPlugin(this);
this._pluginManager.registerPlugin('helloworld', hwPlugin);
this._pluginManager.activatePlugin('helloworld');
```

## 🔍 Qué Verificar

### 1. Carga del Plugin
- [ ] El plugin se carga sin errores
- [ ] Aparece en la lista de plugins
- [ ] Se puede activar/desactivar

### 2. Mensajes en Consola

Al **activar** el plugin deberías ver:
```
🎨 HelloWorld Plugin: Constructor ejecutado
✅ HelloWorld Plugin: ACTIVADO
👆 Haz click en el canvas para ver eventos...
```

Al **desactivar** el plugin:
```
❌ HelloWorld Plugin: DESACTIVADO
📊 Estadísticas: X clicks, Y movimientos
```

### 3. Eventos de Input

Al **hacer click** en el canvas:
```
🖱️ CLICK #1
   Posición: (0.523, 0.678)
   Presión: 1
   Mesh: Sphere
   Punto 3D: (1.23, 0.45, -0.67)
```

Al **mover el mouse/dedo**:
```
🖱️ MOVIMIENTO #50 en (0.456, 0.789)
🖱️ MOVIMIENTO #100 en (0.234, 0.567)
```

### 4. Cambios de Herramienta

Al cambiar de herramienta:
```
🔧 Herramienta cambiada a: brush
```

## 🐛 Solución de Problemas

### El plugin no se carga

**Error de módulo:**
```javascript
// Verificar que la ruta de importación sea correcta
import Plugin from '../plugins/Plugin';
```

**Error de CORS (Cross-Origin):**
- Asegurarse de usar `http://localhost:8080` no `file://`
- Verificar que el servidor esté corriendo

### No aparecen mensajes en consola

1. Verificar que la consola del navegador esté abierta
2. Comprobar que el plugin está activado
3. Revisar que no hay filtros activos en la consola

### El plugin no captura eventos

**Verificar:**
- Que el plugin esté activado (`enabled = true`)
- Que no haya otro plugin o herramienta capturando los eventos primero
- Revisar `onInput()` retorna `true` para consumir el evento

## 📊 API del Plugin HelloWorld

### Métodos Públicos

```javascript
// Obtener estadísticas
const stats = plugin.getStats();
// Retorna: { clicks: 10, moves: 250, enabled: true }

// Resetear contadores
plugin.resetStats();
```

### Hooks Implementados

- `onActivate()` - Cuando se activa el plugin
- `onDeactivate()` - Cuando se desactiva
- `onInput(type, input, picking)` - Para eventos de mouse/touch
- `onRender()` - Cada frame de renderizado
- `onToolChange(toolId)` - Cuando cambia la herramienta activa
- `dispose()` - Limpieza al desinstalar

## ✅ Checklist de Verificación

Usar esta lista para confirmar que el sistema de plugins funciona:

- [ ] El plugin se puede instalar desde URL
- [ ] El plugin se puede instalar desde archivo
- [ ] El plugin aparece en la lista de plugins
- [ ] Se puede activar el plugin
- [ ] Se puede desactivar el plugin
- [ ] Los eventos de input llegan al plugin
- [ ] Los hooks de renderizado se ejecutan
- [ ] Los cambios de herramienta se notifican
- [ ] El plugin persiste después de recargar la página
- [ ] Se puede desinstalar el plugin
- [ ] La consola muestra todos los mensajes esperados

## 🎯 Próximos Pasos

Una vez verificado que el sistema funciona:

1. **Crear plugins más complejos** basados en este ejemplo
2. **Agregar UI personalizada** para configurar el plugin
3. **Experimentar con renderizado custom** en `onRender()`
4. **Integrar con la API de SculptGL** (meshes, cámara, etc.)

## 📝 Notas

- Este es un plugin de **prueba**, no está diseñado para uso en producción
- Los logs en consola pueden afectar el performance si hay muchos eventos
- Para plugins en producción, reducir o eliminar los `console.log()`
