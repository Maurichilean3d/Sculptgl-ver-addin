# 🚨 INSTRUCCIONES PASO A PASO - PRUEBA ESTO AHORA

## ✅ Build Completado

Acabo de hacer el build de la aplicación. Los archivos están listos en:
- `app/index.html` ← Abrí este archivo
- `app/sculptgl.js` ← JavaScript compilado

---

## 📍 PASO 1: Abrir la Aplicación

### Opción A: Abrir directamente el archivo HTML

1. Navegá a la carpeta del proyecto
2. Abrí la carpeta `app/`
3. **Doble click en `index.html`**
4. Se abrirá en tu navegador predeterminado

### Opción B: Desde el navegador

1. Abrí tu navegador (Chrome, Firefox, Edge)
2. Presioná `Ctrl+O` (o `Cmd+O` en Mac)
3. Navegá hasta: `[ruta-del-proyecto]/app/index.html`
4. Click en "Abrir"

**✅ VERIFICAR:** Deberías ver SculptGL funcionando con una esfera en el centro.

---

## 📍 PASO 2: Abrir la Consola del Navegador

**IMPORTANTE:** Hacé esto ANTES de instalar el plugin para ver todos los mensajes.

### En Chrome/Edge:
- Presioná `F12`
- O click derecho → "Inspeccionar"
- O menú (⋮) → "Más herramientas" → "Herramientas para desarrolladores"

### En Firefox:
- Presioná `F12`
- O menú (≡) → "Herramientas del navegador" → "Consola web"

**✅ VERIFICAR:** Deberías ver una ventana en la parte inferior o lateral con pestañas: "Console", "Elements", "Network", etc.

---

## 📍 PASO 3: Instalar el Plugin TestSimple

1. En SculptGL, buscá el menú **"Add-ons"** en la barra superior
   - Está entre "Files" y "Scene"

2. Click en **"Add-ons"**

3. Click en **"Administrar plugins…"** (último botón del menú)

4. Se abrirá un panel oscuro con el título "Plugins (Add-ons)"

5. Click en el botón **"Instalar desde archivo"**

6. En el diálogo de selección de archivos:
   - Navegá hasta la carpeta del proyecto
   - Entrá en `src/Add-on/`
   - Seleccioná el archivo **`TestSimple.js`**
   - Click en "Abrir"

**✅ VERIFICAR EN CONSOLA:** Deberías ver:
```
✅ TestSimple: Constructor ejecutado
```

**✅ VERIFICAR ALERT:** Debería aparecer un alert que dice:
```
✅ PLUGIN CARGADO! Si ves este mensaje, el sistema de plugins funciona.
```

7. Click en "OK" para cerrar el alert

---

## 📍 PASO 4: Habilitar el Plugin

1. En el panel de plugins, deberías ver una fila con:
   ```
   [OFF] TestSimple
   Instalado desde archivo
   ```

2. Click en el botón **"Habilitar"**

3. La fila debería cambiar a:
   ```
   [ON] TestSimple
   ```

4. **IMPORTANTE:** Click en la X o fuera del panel para cerrarlo

5. **CRÍTICO:** Presioná `F5` para **REFRESCAR LA PÁGINA**

---

## 📍 PASO 5: Verificar que el Plugin Está Activo

Después de refrescar la página deberías ver:

### ✅ VERIFICACIÓN 1: Alert de Activación
```
🎉 PLUGIN ACTIVADO!

El sistema de plugins está funcionando.

Ahora hacé click en la mesh y revisá la consola.
```

### ✅ VERIFICACIÓN 2: Panel Rojo Grande (3 segundos)

Un panel **ROJO CON BORDE AMARILLO** debería aparecer en el centro de la pantalla con:
```
🎉 PLUGIN ACTIVO 🎉

Haz click en la mesh
```

Este panel desaparece después de 3 segundos.

### ✅ VERIFICACIÓN 3: Panel Pequeño Persistente

En la **esquina superior derecha** deberías ver un panel rojo pequeño con:
```
🔥 Test Simple
ACTIVO
Clicks: 0
```

### ✅ VERIFICACIÓN 4: Consola

En la consola del navegador deberías ver:
```
✅ TestSimple: Constructor ejecutado
🟢 TestSimple: ACTIVADO
```

---

## 📍 PASO 6: Probar el Plugin

1. **Hacé click en la esfera** (mesh) en el centro

**Deberías ver:**

✅ El **fondo de la página cambia de color** (aleatorio)
✅ El **contador en el panel pequeño aumenta** ("Clicks: 1", "Clicks: 2", etc.)
✅ Los **colores de la esfera cambian** (aleatorios)

**En la consola deberías ver:**
```
🖱️ CLICK detectado por TestSimple!
Input: {...}
Picking: {...}
🎨 Modificando mesh: sphere_3
🎨 Cambiando color de X vértices
✅ Color de mesh cambiado exitosamente
```

2. **Hacé más clicks** y observá:
   - Cada click cambia el fondo
   - El contador aumenta
   - Los colores de la mesh cambian

---

## 🐛 Si NO Funciona - Debugging

### Problema 1: No aparece el menú "Add-ons"

**Causa:** La build no se completó o hay un error de JavaScript.

**Solución:**
1. Verificá en la consola si hay errores en ROJO
2. Desde la terminal, ejecutá: `npm run release`
3. Refrescá la página (`F5`)

---

### Problema 2: El plugin no se puede instalar

**Causa:** El archivo no es un ES module válido.

**Solución:**
1. Verificá que el archivo termina con `export default TestSimple;`
2. Verificá que no haya errores de sintaxis en la consola

---

### Problema 3: El plugin dice [ON] pero no pasa nada

**Causa:** NO REFRESCASTE LA PÁGINA después de habilitar.

**Solución:**
1. Los plugins se cargan al INICIO de la app
2. Después de hacer click en "Habilitar", **SIEMPRE presioná F5**
3. Verificá la consola después de refrescar

---

### Problema 4: No aparece el panel rojo

**Causa:** El plugin no se está activando.

**Solución:**
1. Abrí la consola ANTES de refrescar
2. Buscá mensajes de error en ROJO
3. Verificá que el plugin esté [ON] en "Administrar plugins"
4. Refrescá con `Ctrl+F5` (limpia caché)

---

### Problema 5: Error "mesh is undefined" o similar

**Causa:** La API de la mesh cambió o no está disponible.

**Solución:**
1. Copiá el error completo de la consola
2. El plugin debería al menos mostrar el panel rojo y el alert
3. El cambio de color de mesh es secundario

---

## 🎯 ¿Qué Significa Si Funciona?

Si ves:
- ✅ El alert de "PLUGIN ACTIVADO"
- ✅ El panel rojo grande (aunque sea por 3 segundos)
- ✅ El panel pequeño en la esquina superior derecha

**→ EL SISTEMA DE PLUGINS ESTÁ FUNCIONANDO AL 100%**

Significa que:
- ✅ El código original de SculptGL está intacto
- ✅ El sistema de plugins está integrado correctamente
- ✅ Podés crear tus propios plugins
- ✅ Los plugins pueden agregar UI
- ✅ Los plugins pueden modificar la mesh

---

## 📋 Checklist Rápido

Marcá cada paso que completaste:

- [ ] 1. Abrí `app/index.html` en el navegador
- [ ] 2. Abrí la consola del navegador (`F12`)
- [ ] 3. Click en "Add-ons" → "Administrar plugins"
- [ ] 4. Instalé `TestSimple.js` desde archivo
- [ ] 5. Vi el alert "PLUGIN CARGADO"
- [ ] 6. Click en "Habilitar" (cambió a [ON])
- [ ] 7. Cerré el panel
- [ ] 8. **Refresqué la página (F5)**
- [ ] 9. Vi el alert "PLUGIN ACTIVADO"
- [ ] 10. Vi el panel rojo grande por 3 segundos
- [ ] 11. Vi el panel pequeño en esquina superior derecha
- [ ] 12. Hice click en la mesh y el contador aumentó

---

## 📞 Si Todavía No Funciona

Enviame:

1. **Captura de pantalla** de la consola (F12)
2. **Captura de pantalla** del panel de plugins mostrando el plugin [ON]
3. **Descripción** de qué paso no funcionó

---

## 🚀 Próximos Pasos Después de que Funcione

Una vez que veas el plugin funcionando:

1. **Probá el DemoUIPlugin:**
   - Instalá `src/Add-on/DemoUIPlugin.js`
   - Tiene más botones y mejor UI

2. **Creá tu propio plugin:**
   - Copiá `TestSimple.js`
   - Modificalo según tus necesidades
   - Seguí la guía en `docs/PLUGIN-DEVELOPMENT-GUIDE.md`

---

**¡IMPORTANTE!** Si llegaste hasta acá y NO funcionó, enviame los detalles y lo resolvemos juntos. 💪
