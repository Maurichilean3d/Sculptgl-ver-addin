# 📦 Netlify Deploy v2 - Con Botón "Activar" Plugins

## ✨ Novedades en Esta Versión

### 🔧 Cambio Principal: Botón "Activar/Desactivar"

Ahora el panel de plugins tiene **3 botones** en lugar de 2:

**Antes (v1):**
```
[ON] TestSimple.js
[Deshabilitar] [Desinstalar]
```

**Ahora (v2):**
```
[ON] TestSimple.js
[Activar] [Deshabilitar] [Desinstalar]
   ↑
  NUEVO
```

### 🎯 Flujo Completo de Uso

1. **Instalar** → El plugin se guarda en localStorage
2. **Habilitar** → El plugin se carga al refrescar la página
3. **Activar** → El plugin ejecuta `onActivate()` y empieza a funcionar ⭐ NUEVO

---

## 📋 Qué Incluye el Zip

```
netlify-deploy-v2.zip (4.5 MB)
│
├── app/
    ├── index.html
    ├── sculptgl.js (571 KB) ← ACTUALIZADO con botón Activar
    ├── sculptgl.js.LICENSE.txt
    ├── authSuccess.html
    ├── css/
    │   └── yagui.css
    ├── resources/
    │   ├── matcaps/
    │   ├── environments/
    │   └── alpha/
    └── worker/
        ├── z-worker.js
        └── deflate.js
```

---

## 🚀 Cómo Hacer Deploy en Netlify

### Opción 1: Deploy Manual (Drag & Drop)

1. Ve a: https://app.netlify.com/
2. Login con tu cuenta
3. Click en **"Add new site"** → **"Deploy manually"**
4. **Descarga** `netlify-deploy-v2.zip` desde GitHub
5. **Descomprime** el zip en tu computadora
6. **Arrastra la carpeta `app`** (no el zip) al área de drop de Netlify
7. Espera a que termine el deploy
8. ¡Listo! Netlify te dará una URL como: `https://tu-sitio.netlify.app`

### Opción 2: Deploy Desde Git

1. En Netlify: **"Add new site"** → **"Import an existing project"**
2. Conecta tu repositorio de GitHub
3. En **"Build settings"**:
   - **Build command:** `npm run release`
   - **Publish directory:** `app`
4. Click en **"Deploy site"**

---

## 🧪 Cómo Probar que Funciona

Después del deploy, visita tu URL de Netlify:

### PASO 1: Abrir la App
```
https://tu-sitio.netlify.app
```

### PASO 2: Abrir Consola
Presiona `F12` para abrir DevTools

### PASO 3: Instalar Plugin
1. **Add-ons** → **Administrar plugins...**
2. **Instalar desde URL**
3. Pega esta URL de ejemplo (o la de tu plugin):
   ```
   https://gist.github.com/[tu-usuario]/[tu-plugin].js
   ```

### PASO 4: Habilitar el Plugin
- Click en **"Habilitar"**
- Debería cambiar a `[ON]`

### PASO 5: Refrescar
- Presiona `F5`

### PASO 6: Activar el Plugin (⭐ NUEVO)
1. **Add-ons** → **Administrar plugins...**
2. Verás:
   ```
   [ON] TestSimple.js
   [Activar] [Deshabilitar] [Desinstalar]
   ```
3. **Click en "Activar"**
4. Deberías ver:
   - Alert: "🎉 PLUGIN ACTIVADO!"
   - Panel rojo grande por 3 segundos
   - Panel pequeño en esquina superior derecha
   - El texto cambia a: `[ON] TestSimple.js [ACTIVO]`

### PASO 7: Probar Funcionalidad
- Haz click en la esfera
- El fondo cambia de color
- El contador aumenta
- Los colores de la mesh cambian

---

## 🔄 Diferencias con v1

| Característica | v1 | v2 |
|----------------|----|----|
| Instalar plugin | ✅ | ✅ |
| Habilitar plugin | ✅ | ✅ |
| **Activar plugin** | ❌ | ✅ ⭐ NUEVO |
| Estado [ACTIVO] visible | ❌ | ✅ ⭐ NUEVO |
| onActivate() se ejecuta | Solo al refrescar | Con botón Activar |
| Panel rojo visible | ❌ | ✅ |

---

## 📝 Changelog

### v2 (2026-01-14)
- ✅ Agregar botón "Activar/Desactivar" al panel de plugins
- ✅ Mostrar estado `[ACTIVO]` cuando plugin está activado
- ✅ Permitir activar/desactivar plugins sin refrescar
- ✅ PluginPanel.js actualizado con método `_activate()`
- ✅ Build completo con webpack

### v1 (2026-01-14)
- Versión inicial con sistema de plugins
- Solo botones: Habilitar/Deshabilitar/Desinstalar
- onActivate solo se ejecutaba al refrescar

---

## 🐛 Solución de Problemas

### El botón "Activar" no aparece

**Causa:** El plugin está deshabilitado.

**Solución:**
- El botón "Activar" solo aparece si el plugin está `[ON]`
- Primero click en "Habilitar", luego aparecerá "Activar"

---

### El plugin no hace nada al activar

**Causa:** El plugin no implementa `onActivate()` correctamente.

**Solución:**
- Verificar que el plugin tenga el método `onActivate()`
- Revisar consola (F12) por errores

---

### El panel rojo no aparece

**Causa:** Estás probando con un plugin diferente a TestSimple.js

**Solución:**
- El panel rojo es específico de `TestSimple.js`
- Otros plugins pueden tener UI diferente o ninguna UI
- Revisar la documentación del plugin específico

---

## 📦 Archivos Relacionados

En el repositorio:
- `netlify-deploy-v2.zip` ← Este archivo
- `src/gui/PluginPanel.js` ← Código fuente del cambio
- `app/sculptgl.js` ← Build compilado
- `PRUEBA-AQUI-AHORA.md` ← Guía de prueba detallada
- `docs/COMO-PROBAR-PLUGINS.md` ← Documentación de plugins

---

## 🎯 Resumen

**Este zip incluye:**
✅ Todo el código original de SculptGL
✅ Sistema de plugins funcionando
✅ **Botón "Activar" para plugins** ⭐ NUEVO
✅ Estado visual `[ACTIVO]`
✅ Build completo listo para Netlify

**Listo para deploy sin configuración adicional.** 🚀
