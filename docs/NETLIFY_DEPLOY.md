# Netlify deploy artifacts

El paquete `netlify-deploy.zip` es un binario generado para desplegar en Netlify. Los visores de diffs (GitHub/GitLab) suelen mostrar una advertencia de “binary files not supported” porque no pueden mostrar diferencias línea a línea en un ZIP, por eso no lo mantenemos versionado.

Si necesitas generar el ZIP localmente desde `app/`, usá el comando:

```bash
cd app && zip -r ../netlify-deploy.zip .
```
