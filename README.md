# Fox 3D landing

Landing estática de Fox 3D. Usa HTML y CSS sin dependencias ni proceso de compilación.

## Vista local

Desde la raíz del repositorio:

```powershell
python -m http.server 4173 --directory dist
```

Abre <http://127.0.0.1:4173/>.

## Estructura

- `dist/index.html`: contenido y estructura de la página.
- `dist/styles.css`: diseño adaptable y presentación del panel con profundidad.
- `dist/panel-interaction.js`: movimiento suave del panel, ampliación de cada zona y explicaciones de sus controles.
- `dist/assets/`: captura del panel, logo y tipografía local. La licencia de la fuente está en `dist/assets/OFL.txt`.

El botón de compra usa un enlace provisional. La vista guiada utiliza una captura del panel real: al pasar el cursor por un control se amplía esa zona y aparece su explicación. En pantallas táctiles se activa al tocarla. No ejecuta el plugin en el navegador.
