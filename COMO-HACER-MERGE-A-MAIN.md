# 🔀 Cómo Hacer Merge a Main

## 📋 Situación Actual

**Rama `main` (en GitHub):**
- ✅ Código original de SculptGL
- ❌ NO tiene los plugins nuevos (TestSimple, DemoUIPlugin)
- ❌ NO tiene la documentación nueva

**Rama `claude/review-restore-repo-3mC8t` (en GitHub):**
- ✅ Código original de SculptGL
- ✅ Sistema de plugins funcionando
- ✅ Plugins con UI visible (TestSimple.js, DemoUIPlugin.js)
- ✅ Documentación completa

---

## 🎯 Objetivo

Hacer que **`main`** tenga TODO: código original + plugins + documentación.

---

## ✅ OPCIÓN 1: Merge Desde GitHub (MÁS FÁCIL)

### Paso 1: Crear Pull Request

1. Ve a tu repositorio en GitHub:
   ```
   https://github.com/Maurichilean3d/Sculptgl-ver-addin
   ```

2. Deberías ver un banner amarillo que dice:
   ```
   "claude/review-restore-repo-3mC8t had recent pushes"
   [Compare & pull request]
   ```

3. Si NO ves el banner:
   - Click en "Pull requests"
   - Click en "New pull request"
   - **Base:** `main`
   - **Compare:** `claude/review-restore-repo-3mC8t`
   - Click en "Create pull request"

4. Título sugerido:
   ```
   Agregar sistema de plugins con UI visible y documentación completa
   ```

5. Click en **"Create pull request"**

### Paso 2: Hacer el Merge

1. Revisa los cambios (archivos nuevos):
   - ✅ `src/Add-on/TestSimple.js`
   - ✅ `src/Add-on/DemoUIPlugin.js`
   - ✅ `PRUEBA-AQUI-AHORA.md`
   - ✅ `docs/COMO-PROBAR-PLUGINS.md`
   - ✅ `docs/PLUGIN-DEVELOPMENT-GUIDE.md`

2. Click en **"Merge pull request"**

3. Click en **"Confirm merge"**

4. **¡LISTO!** Main ahora tiene todo el código.

---

## ✅ OPCIÓN 2: Merge Desde Terminal (Local)

Si preferís hacerlo desde tu máquina:

```bash
# 1. Ir a tu carpeta del proyecto
cd /ruta/a/Sculptgl-ver-addin

# 2. Asegurarte de estar en main
git checkout main

# 3. Traer los últimos cambios
git pull origin main

# 4. Hacer merge de la rama con plugins
git merge origin/claude/review-restore-repo-3mC8t

# 5. Pushear a main
git push origin main
```

---

## 📦 ¿Qué Incluye el Merge?

### Archivos Nuevos:

```
src/Add-on/
├── TestSimple.js          ← Plugin ultra-visible con alerts y paneles
├── DemoUIPlugin.js        ← Plugin con UI completa y botones
├── helloworld.js          ← Ya existía, mejorado
└── vertextint.js          ← Ya existía

docs/
├── COMO-PROBAR-PLUGINS.md         ← Guía rápida
└── PLUGIN-DEVELOPMENT-GUIDE.md    ← Guía completa desarrollo

/
├── PRUEBA-AQUI-AHORA.md           ← Instrucciones paso a paso
└── ARCHIVOS-NUEVOS.txt            ← Índice de archivos
```

### NO Modifica:

```
✅ src/Core/              ← Intacto
✅ src/Scene.js           ← Intacto
✅ src/SculptGL.js        ← Intacto
✅ src/mesh/              ← Intacto
✅ src/render/            ← Intacto
✅ src/editing/           ← Intacto
✅ (Todo el código original está intacto)
```

### Sí Incluye:

```
✅ src/PluginManager.js           ← Sistema de plugins
✅ src/gui/GuiAddons.js           ← UI para plugins
✅ src/plugins/PluginStore.js     ← Almacenamiento
```

---

## 🧪 Después del Merge

Una vez que `main` tenga todo, probar:

```bash
# 1. Pull de main
git checkout main
git pull origin main

# 2. Build
npm run release

# 3. Abrir
# Abrir app/index.html en navegador

# 4. Probar plugin
# Add-ons → Administrar plugins → Instalar desde archivo
# Seleccionar: src/Add-on/TestSimple.js
# Habilitar → Refrescar (F5)
# Deberías ver: alerts y panel rojo
```

---

## ✅ Verificación Final

Después del merge, `main` debería tener:

```bash
# Verificar plugins
ls src/Add-on/TestSimple.js          # Debería existir
ls src/Add-on/DemoUIPlugin.js        # Debería existir

# Verificar docs
ls PRUEBA-AQUI-AHORA.md              # Debería existir
ls docs/COMO-PROBAR-PLUGINS.md       # Debería existir

# Verificar código original
ls src/Core/                          # Debería existir
ls src/Scene.js                       # Debería existir
ls src/PluginManager.js               # Debería existir
```

---

## 🆘 Si Algo Sale Mal

### Conflictos de Merge

Si hay conflictos:
1. GitHub te lo dirá en el PR
2. Resolvé los conflictos manualmente
3. O contactame para ayudarte

### Archivos No Aparecen

Si después del merge no ves los archivos:
1. Asegurate de estar en `main`: `git branch`
2. Hacer pull: `git pull origin main`
3. Verificar: `ls src/Add-on/`

---

## 📞 Resumen

**Para tener main con TODO:**

1. Ir a GitHub
2. Crear PR de `claude/review-restore-repo-3mC8t` → `main`
3. Hacer merge
4. Pull local de main
5. ¡Listo!

**Resultado:**
```
main = Código Original SculptGL + Sistema de Plugins + Plugins Visibles + Documentación
```

---

¡Avisame cuando hagas el merge para verificar que todo funcione! 🚀
