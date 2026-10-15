# Publicar la plataforma en Google Sites

La plataforma es **un solo archivo HTML**: `dist/plataforma.html`. No necesita servidor ni instalación; los alumnos solo abren la página en Safari (iPad) o en cualquier navegador moderno.

Hay dos formas de ponerla en Google Sites. La **opción A** es la más rápida; la **opción B** es la más estable para guardar el progreso durante todo el curso.

| | A. Pegar el código | B. Alojar el archivo y enlazarlo |
|---|---|---|
| Dificultad | Muy fácil | Fácil (una cuenta gratuita en GitHub, Netlify o similar) |
| Dónde vive el archivo | Dentro de Google Sites | En un alojamiento web gratuito |
| Progreso guardado en el iPad | Se puede perder si vuelves a publicar el sitio (ver abajo) | Estable durante todo el curso |
| Abrir en pantalla completa / pestaña nueva | No | Sí (botón ↗ de la plataforma) |
| Actualizar retos | Volver a pegar el código | Volver a subir el archivo |

En los dos casos, la plataforma necesita internet para cargar Blockly y el intérprete de Python (Skulpt) desde un CDN la primera vez.

---

## Opción A: pegar el código en Google Sites

1. Abre `dist/plataforma.html` con un editor de texto (Bloc de notas en Windows, TextEdit en Mac en modo texto sin formato, o Visual Studio Code).
2. Selecciona todo (Ctrl + A / Cmd + A) y copia (Ctrl + C / Cmd + C).
3. En Google Sites, abre la página donde irá la plataforma.
4. En el panel derecho elige **Insertar → Insertar** (o «Incorporar», según el idioma) y luego la pestaña **Insertar código**.
5. Pega el código y presiona **Siguiente → Insertar**.
6. Agranda el recuadro: arrástralo para que ocupe **todo el ancho** de la página y hazlo lo más alto posible (al menos unos 900 px). La plataforma se adapta al tamaño del recuadro.
7. Presiona **Publicar** y abre el sitio publicado en un iPad para probarlo (arrastrar bloques, escribir en la consola, comprobar un reto).

> Si Google Sites rechaza el código por su tamaño o el editor se vuelve muy lento, usa la opción B.

### Importante sobre el progreso con la opción A

Google Sites muestra el código insertado en un marco con una dirección propia (`…googleusercontent.com`). Esa dirección **puede cambiar cuando vuelves a publicar el sitio**, y el navegador guarda el progreso de cada alumno ligado a esa dirección. Además, Safari limita el almacenamiento dentro de los marcos.

Para no perder avances:

- Evita volver a publicar la página de la plataforma a mitad del curso. Si necesitas corregir un reto, avisa al grupo para que antes exporte su progreso.
- Pide a los alumnos que, al final de las sesiones importantes, vayan a **Mi progreso → Descargar archivo de progreso** (o **Copiar código de progreso** y lo peguen en Classroom). Con **Cargar archivo** o **Pegar código** recuperan todo en cualquier dispositivo.
- La plataforma avisa en la portada si el navegador no permite guardar.

---

## Opción B: alojar el archivo y enlazarlo desde Google Sites (recomendada para el curso completo)

### B1. Alojar el archivo (elige un servicio)

**GitHub Pages** (gratuito):

1. Crea una cuenta en <https://github.com> y un repositorio **público** nuevo, por ejemplo `python-bloques`.
2. Sube `dist/plataforma.html` con el nombre **`index.html`** (botón *Add file → Upload files*).
3. Ve a *Settings → Pages*. En *Build and deployment* elige *Deploy from a branch*, rama `main` y carpeta `/ (root)`. Guarda.
4. En uno o dos minutos tu plataforma estará en `https://TU-USUARIO.github.io/python-bloques/`.

**Netlify Drop** (gratuito, sin repositorio):

1. Crea una carpeta con el archivo renombrado a `index.html`.
2. Entra a <https://app.netlify.com/drop> y arrastra la carpeta. Netlify te da una dirección pública.

> Google Drive ya no sirve para publicar páginas HTML.

### B2. Insertarla en Google Sites

1. En Google Sites: **Insertar → Insertar → Por URL** y pega la dirección del paso anterior.
2. Elige **Página completa** y presiona **Insertar**.
3. Agranda el recuadro a todo el ancho y alto, y publica.

### B3. Activar el botón «Abrir en pestaña nueva»

1. Escribe la dirección pública en `configuracion.json`, en `"urlPublica"`:

   ```json
   "urlPublica": "https://TU-USUARIO.github.io/python-bloques/"
   ```

2. Vuelve a construir con `python construir.py` y sube otra vez el archivo.

Desde Google Sites aparecerá el botón **↗** en la cabecera para abrir la plataforma en su propia pestaña. En iPad conviene abrirla así y usar **Compartir → Agregar a inicio**: funciona como una app a pantalla completa y el progreso queda guardado de forma más estable.

---

## Versión sin conexión

`dist/plataforma-sin-conexion.html` (unos 2 MB) trae Blockly y Skulpt incrustados: una vez abierta funciona **sin internet**. Úsala si la conexión de la escuela es inestable: súbela con la opción B (por ejemplo, como `index.html`) o cópiala a las computadoras y ábrela con doble clic. No está pensada para pegarse en Google Sites (opción A) por su tamaño.

---

## Lista de verificación antes de la primera clase

- [ ] La plataforma abre en el sitio publicado (no solo en la vista previa del editor).
- [ ] En un iPad: se pueden arrastrar bloques, el teclado aparece al tocar un hueco o la consola, y **▶ Ejecutar** muestra resultados.
- [ ] Un reto se puede **Comprobar** y aparece la felicitación.
- [ ] Al recargar la página, el nombre del alumno y el reto superado siguen ahí (si no, el navegador bloquea el almacenamiento: pide exportar el progreso).
- [ ] Cambiaste el PIN docente en `configuracion.json` (por defecto `2468`).
- [ ] (Opcional) Pusiste en `enlaceTicket` la dirección de un formulario de Google si quieres recibir los tickets de salida en una hoja de cálculo.
