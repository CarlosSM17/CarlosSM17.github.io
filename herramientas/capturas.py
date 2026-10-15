#!/usr/bin/env python3
"""
capturas.py — Toma capturas de pantalla de la plataforma (para revisar el diseño).

Uso:  python herramientas/capturas.py RUTA ANCHOxALTO [archivo.png] [js-a-ejecutar]
Ej.:  python herramientas/capturas.py "#/s/9/reto/programador" 1280x800
"""
import os
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
NAVEGADOR = next(p for p in [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
] if os.path.exists(p))

PREPARAR = """<script>
try {
  localStorage.setItem('pb:progreso:python-blockly-1sec', JSON.stringify({version:1, curso:'python-blockly-1sec',
    alumno:{nombre:'Ana', grupo:'1° A'}, retos:{'s01-reto':{niveles:{explorador:'2026-10-01', programador:'2026-10-02'}, superado:true}},
    borradores:{}, respuestas:{}, pruebas:{}, coevaluaciones:[], insignias:{}, pasos:{1:{teoria:1,ejemplo:1,micro:1}}, ejecuciones:{}}));
} catch (e) {}
</script>"""


def capturar(ruta, tam, archivo=None, js=""):
    ancho, alto = tam.split("x")
    base = (RAIZ / "dist" / os.environ.get("PB_DIST", "plataforma-sin-conexion.html")).read_text(encoding="utf-8")
    fijar_ruta = f"<script>try {{ location.hash = {ruta!r}; }} catch (e) {{ document.title = 'ERR ' + e; }}</script>"
    if js.startswith("DOCENTE;"):            # modo docente activado desde el inicio
        js = js[len("DOCENTE;"):]
        fijar_ruta += "<script>try { sessionStorage.setItem('pb:docente', '1'); } catch (e) {}</script>"
    html = base.replace("<head>", "<head>\n" + PREPARAR + fijar_ruta, 1)
    if js:
        html = html.replace("</body>", f"<script>setTimeout(function(){{ {js} }}, 1500);</script></body>")
    salida = RAIZ / "herramientas" / "salida"
    salida.mkdir(exist_ok=True)
    pagina = salida / "captura.html"
    pagina.write_text(html, encoding="utf-8")
    archivo = Path(archivo) if archivo else salida / f"captura-{ancho}x{alto}.png"
    if not archivo.is_absolute():
        archivo = salida / archivo
    cmd = [NAVEGADOR, "--headless=new", "--disable-gpu", "--hide-scrollbars", f"--user-data-dir={salida / 'perfil-capturas'}",
           "--allow-file-access-from-files", f"--window-size={ancho},{alto}", "--virtual-time-budget=8000",
           f"--screenshot={archivo}", pagina.as_uri()]
    subprocess.run(cmd, capture_output=True, timeout=120)
    print(archivo)


if __name__ == "__main__":
    capturar(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None, sys.argv[4] if len(sys.argv) > 4 else "")
