# 🚀 SculptGL - Guía de Deploy en Netlify

## 📦 Archivo ZIP Generado

**Archivo**: `sculptgl-netlify-deploy.zip`

Este ZIP contiene la estructura completa optimizada para deploy en Netlify.

---

## ✅ Cambios Implementados

### 1. **FIX CRÍTICO - src/files/Import.js**
   - ❌ **Antes**: Contenía HTML completo (1352 líneas de código HTML)
   - ✅ **Ahora**: Código JavaScript correcto (13 líneas)
   - Restaurado desde el repositorio original de SculptGL

### 2. **netlify.toml** (Nuevo)
```toml
[build]
  command = "npm run website"
  publish = "app"

[build.environment]
  NODE_VERSION = "18"
  NODE_OPTIONS = "--openssl-legacy-provider"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. **tools/index.website.html**
   - ✅ Agregado: `<meta name='viewport'...>` para responsive
   - ✅ Removido: Google Analytics (gtag)
   - ✅ Fix: `redirect_uri` dinámico (`window.location.origin + '/authSuccess.html'`)

### 4. **package.json**
   - ✅ Removido: `electron` y `electron-packager` (innecesarios para web)
   - ✅ Removido: Scripts `buildElectron` y `standalone`
   - ✅ Limpiado: Scripts optimizados para webpack

---

## 🎯 Instrucciones de Deploy en Netlify

### Opción 1: Deploy Manual (ZIP)
1. Ve a https://app.netlify.com/drop
2. Arrastra y suelta `sculptgl-netlify-deploy.zip`
3. Netlify automáticamente:
   - Instalará dependencias con npm
   - Ejecutará `npm run website`
   - Publicará la carpeta `app/`

### Opción 2: Deploy desde Git (Recomendado)
1. Haz push de los cambios al repositorio
2. Conecta Netlify a tu repositorio GitHub
3. Configura build settings:
   - **Build command**: `npm run website`
   - **Publish directory**: `app`
   - **Node version**: 18

---

## 🔧 Variables de Entorno (Configuradas)

- `NODE_VERSION`: 18
- `NODE_OPTIONS`: `--openssl-legacy-provider` (fix para OpenSSL en Node 18)

---

## 📁 Estructura Final

```
.
├── netlify.toml              # Configuración de Netlify
├── package.json              # Sin electron, scripts optimizados
├── webpack.config.js         # Sin cambios
├── tools/
│   └── index.website.html    # Viewport + sin gtag + redirect dinámico
├── src/
│   └── files/
│       └── Import.js         # ✅ RESTAURADO (JS, no HTML)
└── app/                      # Carpeta de salida (generada por webpack)
```

---

## 🐛 Problemas Solucionados

1. ✅ **Import.js contenía HTML**: Restaurado a JavaScript correcto
2. ✅ **Falta viewport responsive**: Agregado en index.website.html
3. ✅ **Google Analytics**: Removido
4. ✅ **redirect_uri hardcodeado**: Ahora dinámico
5. ✅ **Configuración Netlify**: netlify.toml creado
6. ✅ **package.json con electron**: Limpiado

---

## 🧪 Prueba Local

```bash
# Instalar dependencias
npm install

# Build para website
npm run website

# Servir localmente
npm run server
# Abre: http://localhost:8080
```

---

## 📊 Tamaño del ZIP

- **Tamaño**: ~6.1 MB
- **Excluye**: `node_modules/`, `.git/`, `yarn.lock`, `pnpm-lock.yaml`, `standalone/`

---

## ⚠️ Notas Importantes

1. **NO usar** `npm run build` en Netlify (no existe en package.json)
2. **NO usar** carpeta `/docs` (se usa `/app`)
3. **Node 18** requerido para `--openssl-legacy-provider`
4. El build genera automáticamente `app/index.html` y `app/sculptgl.js`

---

## 🎉 ¡Listo para Deploy!

Tu proyecto está ahora completamente configurado para Netlify. Solo sube el ZIP o conecta tu repositorio.
