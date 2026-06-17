# DaniNutrición

Panel web para nutricionistas: ficha del asesorado, plan nutricional con reparto
automático de macros por g/kg de peso, revisiones semanales con gráficas, y
generación de PDF del plan. Modo claro y oscuro.

App estática de una sola página (React + Babel en el navegador). **No requiere
build ni instalación** — son archivos estáticos que se sirven tal cual.

## Estructura

```
index.html              ← punto de entrada (abre esto)
ui_kits/web/*.jsx        ← componentes de la app (React/JSX)
colors_and_type.css      ← tokens de color y tipografía (referencia del sistema de diseño)
```

React, ReactDOM, Babel y las fuentes (Fraunces + Inter) se cargan desde CDN, por
lo que se necesita conexión a internet para que la app arranque.

## Probar en local

No abras `index.html` con doble clic (el navegador bloquea la carga de los `.jsx`
por `file://`). Sírvelo con un servidor estático:

```bash
# Python 3
python3 -m http.server 8000
# luego abre http://localhost:8000
```

```bash
# o con Node
npx serve .
```

## Publicar como web en GitHub Pages

1. Crea un repositorio en GitHub y sube todos estos archivos a la raíz
   (incluido el archivo `.nojekyll`, que evita que GitHub procese las carpetas).
2. En el repo: **Settings → Pages**.
3. En **Build and deployment → Source**, elige **Deploy from a branch**.
4. Selecciona la rama `main` y la carpeta `/ (root)`. Guarda.
5. En 1–2 minutos tu web estará en:
   `https://<tu-usuario>.github.io/<nombre-del-repo>/`

Cualquier cambio que subas a `main` se publica automáticamente.

## Notas

- Los datos son de demostración y viven en memoria: al recargar la página se
  reinician (no hay backend ni base de datos).
- El botón **Descargar PDF** usa el diálogo de impresión del navegador
  (Guardar como PDF).
