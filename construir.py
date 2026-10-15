#!/usr/bin/env python3
"""
construir.py — Arma la plataforma «De Bloques a Python» en un solo archivo HTML.

Uso:
    python construir.py              valida, prueba las soluciones en Python y construye
    python construir.py --rapido     construye sin probar las soluciones

Genera:
    dist/plataforma.html                 versión ligera (Blockly y Skulpt desde CDN).
                                         Es la que se pega en Google Sites.
    dist/plataforma-sin-conexion.html    todo incrustado: funciona sin internet una vez
                                         abierta (para alojarla en un servidor o carpeta).
    soluciones/*.py                      soluciones de referencia de cada reto
    docs/planes-de-clase.md              planes de clase de las 17 sesiones
    docs/instrumentos-de-evaluacion.md   prueba de lectura, lista de cotejo, rúbrica y tickets

Para agregar o corregir retos solo hay que editar los archivos de contenido/ y volver
a ejecutar este script: no hace falta tocar el código de la plataforma.
"""
from __future__ import annotations

import base64
import contextlib
import io
import json
import random
import re
import sys
import unicodedata
import urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent
SRC = RAIZ / "src"
CONTENIDO = RAIZ / "contenido"
DIST = RAIZ / "dist"
CACHE = RAIZ / "herramientas" / "vendor" / "cache"

BLOCKLY = "11.2.2"
SKULPT_COMMIT = "96ae75d5e99e29f07a8f819869db87167e233628"   # compilación de skulpt.org, 5-mar-2026
URLS = {
    "blockly": f"https://cdn.jsdelivr.net/npm/blockly@{BLOCKLY}/blockly_compressed.js",
    "blockly_es": f"https://cdn.jsdelivr.net/npm/blockly@{BLOCKLY}/msg/es.js",
    "blockly_sprites": f"https://cdn.jsdelivr.net/npm/blockly@{BLOCKLY}/media/sprites.png",
    "skulpt": f"https://cdn.jsdelivr.net/gh/skulpt/skulpt@{SKULPT_COMMIT}/js/skulpt.min.js",
    "skulpt_stdlib": f"https://cdn.jsdelivr.net/gh/skulpt/skulpt@{SKULPT_COMMIT}/js/skulpt-stdlib.js",
}
MEDIA_BLOCKLY = f"https://cdn.jsdelivr.net/npm/blockly@{BLOCKLY}/media/"

TIPOS_BLOQUE = {
    "py_print", "py_input", "py_convert", "py_comment", "py_assign", "py_augassign", "py_var", "py_number",
    "py_arith", "py_round", "py_compare", "py_logic", "py_not", "py_in", "py_bool", "py_string", "py_fstring",
    "py_len", "py_str_method", "py_if", "py_elif", "py_else", "py_for", "py_while", "py_break", "py_continue",
    "py_pass", "py_range", "py_list", "py_index", "py_index_set", "py_append", "py_func1", "py_import",
    "py_randint", "py_choice", "py_def", "py_return", "py_call", "py_call_stmt", "py_kwarg", "py_method_call",
    "py_expr_stmt", "py_raw_stmt", "py_raw_expr", "py_raw_block", "py_hueco",
}
MODULOS_BASE = ["random", "math", "time"]


# ---------------------------------------------------------------------------
# Utilidades
# ---------------------------------------------------------------------------
def leer_json(ruta: Path):
    try:
        return json.loads(ruta.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        sys.exit(f"✗ Error de formato en {ruta.relative_to(RAIZ)}: línea {e.lineno}, columna {e.colno}: {e.msg}")


ARCHIVOS_CACHE = {
    "blockly": f"blockly-{BLOCKLY}.js",
    "blockly_es": f"blockly-{BLOCKLY}-es.js",
    "blockly_sprites": f"blockly-{BLOCKLY}-sprites.png",
    "skulpt": f"skulpt-{SKULPT_COMMIT[:7]}.min.js",
    "skulpt_stdlib": f"skulpt-{SKULPT_COMMIT[:7]}-stdlib.js",
}


def descargar(nombre: str, binario: bool = False):
    """Descarga (una sola vez) las librerías de versión fija y las guarda en caché."""
    CACHE.mkdir(parents=True, exist_ok=True)
    destino = CACHE / ARCHIVOS_CACHE[nombre]
    if not destino.exists():
        print(f"  descargando {URLS[nombre]}")
        with urllib.request.urlopen(URLS[nombre], timeout=60) as r:
            destino.write_bytes(r.read())
    return destino.read_bytes() if binario else destino.read_text(encoding="utf-8")


def normalizar(s: str) -> str:
    """Igual que PB.util.normalizar (JS): sin acentos, minúsculas, espacios compactos."""
    s = unicodedata.normalize("NFD", str(s))
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = s.replace("¡", "").replace("¿", "").lower()
    s = re.sub(r"[ \t]+", " ", s)
    s = "\n".join(l.strip() for l in s.split("\n"))
    s = re.sub(r"\n{2,}", "\n", s)
    return s.strip()


def sin_huecos(codigo: str) -> str:
    return re.sub(r"«([^»]*)»", lambda m: m.group(1) or "___", codigo)


# ---------------------------------------------------------------------------
# Contenido
# ---------------------------------------------------------------------------
def cargar_contenido():
    config = leer_json(RAIZ / "configuracion.json")
    unidades = leer_json(CONTENIDO / "unidades.json")
    prueba = leer_json(CONTENIDO / "prueba-lectura.json")
    sesiones = [leer_json(p) for p in sorted(CONTENIDO.glob("sesion-*.json"))]
    sesiones.sort(key=lambda s: s.get("numero", 0))
    return {"config": config, "unidades": unidades, "prueba": prueba, "sesiones": sesiones}


def retos_de(sesion):
    """Todos los retos verificables de una sesión: (tipo, reto, nivel)."""
    for m in sesion.get("microretos", []):
        yield "micro", m, None
    r = sesion.get("reto")
    if r:
        if r.get("tipo") == "proyecto":
            yield "proyecto", r, None
        else:
            for n in ("explorador", "programador", "maestro"):
                if n in r.get("niveles", {}):
                    yield "reto", r, n
    if sesion.get("extra"):
        yield "extra", sesion["extra"], None


def config_reto(reto, nivel):
    n = (reto.get("niveles") or {}).get(nivel) or {}
    return {
        "pruebas": n.get("pruebas") or reto.get("pruebas") or [],
        "requiere": list(reto.get("requiere", [])) + list(n.get("requiere", [])),
        "prohibe": list(reto.get("prohibe", [])) + list(n.get("prohibe", [])),
        "solucion": n.get("solucion") or reto.get("solucion"),
        "inicio": n["inicio"] if "inicio" in n else reto.get("inicio", ""),
    }


def validar(c):
    errores, avisos = [], []
    ids = set()
    numeros = set()
    for s in c["sesiones"]:
        num = s.get("numero")
        donde = f"sesión {num}"
        for campo in ("numero", "titulo", "unidad", "modo"):
            if campo not in s:
                errores.append(f"{donde}: falta el campo «{campo}»")
        if num in numeros:
            errores.append(f"{donde}: número de sesión repetido")
        numeros.add(num)
        if not any(u["numero"] == s.get("unidad") for u in c["unidades"]):
            errores.append(f"{donde}: la unidad {s.get('unidad')} no existe en unidades.json")
        for tipo, reto, nivel in retos_de(s):
            rid = reto.get("id")
            if not rid:
                errores.append(f"{donde}: un {tipo} no tiene «id»")
                continue
            if nivel in (None, "explorador"):
                if rid in ids:
                    errores.append(f"{donde}: id de reto repetido «{rid}»")
                ids.add(rid)
            for b in reto.get("bloques") or []:
                if b not in TIPOS_BLOQUE:
                    errores.append(f"{donde} · {rid}: tipo de bloque desconocido «{b}»")
            cfg = config_reto(reto, nivel)
            if tipo in ("micro", "reto") and not cfg["pruebas"] and not reto.get("sinPruebas") and not cfg["requiere"]:
                avisos.append(f"{donde} · {rid}{' · ' + nivel if nivel else ''}: no tiene pruebas ni requisitos")
            for i, p in enumerate(cfg["pruebas"]):
                if not any(k in p for k in ("contiene", "exacto", "no_contiene", "lineasMin")):
                    errores.append(f"{donde} · {rid}: la prueba {i + 1} no dice qué debe aparecer")
            if tipo != "proyecto" and not cfg["solucion"] and (cfg["pruebas"] or cfg["requiere"]):
                avisos.append(f"{donde} · {rid}{' · ' + nivel if nivel else ''}: no tiene solución de referencia")
        for k in ("ticket",):
            t = s.get(k)
            if t and not (0 <= t.get("correcta", -1) < len(t.get("opciones", []))):
                errores.append(f"{donde}: el {k} tiene una respuesta correcta fuera de rango")
        for i, p in enumerate(s.get("puente", [])):
            if not (0 <= p.get("correcta", -1) < len(p.get("opciones", []))):
                errores.append(f"{donde}: la pregunta puente {i + 1} tiene una respuesta correcta fuera de rango")
        pred = (s.get("ejemplo") or {}).get("prediccion")
        if pred and not (0 <= pred.get("correcta", -1) < len(pred.get("opciones", []))):
            errores.append(f"{donde}: la predicción del ejemplo tiene una respuesta correcta fuera de rango")
    for i, it in enumerate(c["prueba"].get("items", [])):
        if not (0 <= it.get("correcta", -1) < len(it.get("opciones", []))):
            errores.append(f"prueba de lectura, reactivo {i + 1}: respuesta correcta fuera de rango")
    return errores, avisos


# ---------------------------------------------------------------------------
# Prueba de las soluciones con Python (CPython)
# ---------------------------------------------------------------------------
class SinEntradas(Exception):
    pass


def ejecutar_cpython(codigo: str, entradas, azar):
    """Ejecuta el código con entradas y valores al azar fijos. Devuelve (salida, error)."""
    salida = io.StringIO()
    pendientes = [str(e) for e in entradas]
    cola = list(azar or [])

    def falso_input(prompt=""):
        # Como en la plataforma: las pruebas revisan solo lo que se imprime con print
        if not pendientes:
            raise SinEntradas()
        return pendientes.pop(0)

    originales = (random.randint, random.choice, random.shuffle)
    random.randint = lambda a, b: cola.pop(0) if cola else a
    random.choice = lambda s: cola.pop(0) if cola else s[0]
    random.shuffle = lambda s: None
    entorno = {"__name__": "__main__", "input": falso_input}
    error = None
    try:
        with contextlib.redirect_stdout(salida):
            exec(compile(codigo, "<solucion>", "exec"), entorno)
    except SinEntradas:
        error = "pidió más datos de los que trae la prueba"
    except Exception as e:  # noqa: BLE001
        error = f"{type(e).__name__}: {e}"
    finally:
        random.randint, random.choice, random.shuffle = originales
    return salida.getvalue(), error


def comparar(salida: str, prueba) -> list[str]:
    obtenida = normalizar(salida)
    fallos = []
    if prueba.get("exacto") is not None and obtenida != normalizar(prueba["exacto"]):
        fallos.append("la salida no es exactamente la esperada")
    desde = 0
    for frag in prueba.get("contiene", []):
        f = normalizar(frag)
        pos = obtenida.find(f, desde)
        if pos < 0:
            fallos.append(f"falta «{frag}»")
            break
        desde = pos + len(f)
    for frag in prueba.get("no_contiene", []):
        if normalizar(frag) in obtenida:
            fallos.append(f"sobra «{frag}»")
    if prueba.get("lineasMin"):
        n = len([l for l in obtenida.split("\n") if l.strip()]) if obtenida else 0
        if n < prueba["lineasMin"]:
            fallos.append(f"muestra {n} renglones y se piden al menos {prueba['lineasMin']}")
    return fallos


def probar_soluciones(c):
    problemas = []
    total = 0
    for s in c["sesiones"]:
        ejemplo = s.get("ejemplo")
        if ejemplo and ejemplo.get("codigo"):
            try:
                compile(ejemplo["codigo"], "<ejemplo>", "exec")
            except SyntaxError as e:
                problemas.append(f"sesión {s['numero']} · ejemplo: SyntaxError línea {e.lineno}")
        for tipo, reto, nivel in retos_de(s):
            cfg = config_reto(reto, nivel)
            etiqueta = f"sesión {s['numero']} · {reto['id']}{' · ' + nivel if nivel else ''}"
            sol = cfg["solucion"]
            if tipo == "proyecto":
                for op in reto.get("opciones", []):
                    if op.get("solucion"):
                        try:
                            compile(op["solucion"], "<proyecto>", "exec")
                        except SyntaxError as e:
                            problemas.append(f"{etiqueta} · {op['id']}: SyntaxError línea {e.lineno}")
                continue
            if not sol:
                continue
            try:
                compile(sol, "<solucion>", "exec")
            except SyntaxError as e:
                problemas.append(f"{etiqueta}: la solución tiene SyntaxError en la línea {e.lineno}: {e.msg}")
                continue
            for i, p in enumerate(cfg["pruebas"]):
                total += 1
                salida, error = ejecutar_cpython(sol, p.get("entradas", []), p.get("azar", []))
                if error:
                    problemas.append(f"{etiqueta} · prueba {i + 1}: {error}")
                    continue
                fallos = comparar(salida, p)
                if fallos:
                    problemas.append(f"{etiqueta} · prueba {i + 1}: {', '.join(fallos)}\n      salida: {salida[:300]!r}")
            # El código inicial no debería pasar ya las pruebas (si las tiene)
            inicio = sin_huecos(cfg["inicio"] or "")
            if cfg["pruebas"] and inicio.strip() and "___" not in inicio:
                pasa = True
                for p in cfg["pruebas"]:
                    salida, error = ejecutar_cpython(inicio, p.get("entradas", []), p.get("azar", []))
                    if error or comparar(salida, p):
                        pasa = False
                        break
                if pasa and not cfg["requiere"]:
                    problemas.append(f"{etiqueta}: ¡el código inicial ya pasa todas las pruebas!")
    return problemas, total


# ---------------------------------------------------------------------------
# Construcción
# ---------------------------------------------------------------------------
def mini_stdlib() -> str:
    """Solo los módulos de Skulpt que usa el curso (random y sus dependencias)."""
    texto = descargar("skulpt_stdlib")
    datos = json.loads(texto[texto.index("{"): texto.rindex("}") + 1])
    archivos = datos["files"]
    elegidos = {"src/builtin/sys.js": archivos["src/builtin/sys.js"]}   # Skulpt siempre lo carga
    pendientes = list(MODULOS_BASE)
    vistos = set()
    while pendientes:
        m = pendientes.pop()
        if m in vistos:
            continue
        vistos.add(m)
        for clave in (f"src/builtin/{m}.js", f"src/lib/{m}.py", f"src/lib/{m}.js", f"src/lib/{m}/__init__.py", f"src/lib/{m}/__init__.js"):
            if clave in archivos and clave not in elegidos:
                elegidos[clave] = archivos[clave]
                if clave.endswith(".py"):
                    for a, b in re.findall(r"^\s*(?:from\s+([\w.]+)\s+import|import\s+([\w.]+))", archivos[clave], re.M):
                        pendientes.append((a or b).split(".")[0])
    return "window.PB_STDLIB = " + json.dumps({"files": elegidos}, ensure_ascii=False) + ";"


def seguro_en_script(js: str) -> str:
    return js.replace("</script", "<\\/script").replace("<!--", "<\\!--")


def json_para_html(obj) -> str:
    return json.dumps(obj, ensure_ascii=False, separators=(",", ":")).replace("<", "\\u003c").replace(">", "\\u003e").replace("&", "\\u0026")


def construir(c, sin_conexion: bool) -> str:
    plantilla = (SRC / "plantilla.html").read_text(encoding="utf-8")
    css = (SRC / "estilos.css").read_text(encoding="utf-8")
    app = "\n;\n".join(p.read_text(encoding="utf-8") for p in sorted((SRC / "js").glob("*.js")))
    config = dict(c["config"])
    config.setdefault("rutaMediaBlockly", MEDIA_BLOCKLY)
    datos = {"config": config, "unidades": c["unidades"], "prueba": c["prueba"], "sesiones": c["sesiones"]}
    scripts_datos = [f"window.PB_DATOS = {json_para_html(datos)};", mini_stdlib()]
    if sin_conexion:
        sprites = base64.b64encode(descargar("blockly_sprites", binario=True)).decode()
        scripts_datos.append(f'window.PB_SPRITES_BLOCKLY = "data:image/png;base64,{sprites}";')
        librerias = "\n".join(f"<script>\n{seguro_en_script(descargar(n))}\n</script>" for n in ("blockly", "blockly_es", "skulpt"))
    else:
        librerias = "\n".join(f'<script src="{URLS[n]}"></script>' for n in ("blockly", "blockly_es", "skulpt"))
    html = plantilla
    html = html.replace("/*@@TITULO@@*/", config.get("nombreCurso", "De Bloques a Python"))
    html = html.replace("/*@@CSS@@*/", css)
    html = html.replace("<!--@@LIBRERIAS@@-->", librerias)
    html = html.replace("<!--@@DATOS@@-->", "\n".join(f"<script>{seguro_en_script(s)}</script>" for s in scripts_datos))
    html = html.replace("/*@@APP@@*/", seguro_en_script(app))
    return html


def generar_soluciones(c):
    carpeta = RAIZ / "soluciones"
    carpeta.mkdir(exist_ok=True)
    for viejo in carpeta.glob("*.py"):
        viejo.unlink()
    n = 0
    for s in c["sesiones"]:
        for tipo, reto, nivel in retos_de(s):
            if tipo == "proyecto":
                for op in reto.get("opciones", []):
                    if op.get("solucion"):
                        nombre = f"sesion-{s['numero']:02d}-{reto['id']}-{op['id']}.py"
                        (carpeta / nombre).write_text(f"# Sesión {s['numero']} · {reto['titulo']} · {op['titulo']}\n# Ejemplo de proyecto que cumple los requisitos mínimos.\n\n{op['solucion'].rstrip()}\n", encoding="utf-8")
                        n += 1
                continue
            cfg = config_reto(reto, nivel)
            if not cfg["solucion"]:
                continue
            sufijo = f"-{nivel}" if nivel else ""
            nombre = f"sesion-{s['numero']:02d}-{reto['id']}{sufijo}.py"
            encabezado = f"# Sesión {s['numero']} · {reto.get('titulo', '')}{' · nivel ' + nivel if nivel else ''}\n# Solución de referencia (hay muchas soluciones correctas).\n\n"
            (carpeta / nombre).write_text(encabezado + cfg["solucion"].rstrip() + "\n", encoding="utf-8")
            n += 1
    return n


def html_a_texto(h: str) -> str:
    t = re.sub(r"<br\s*/?>", "\n", h or "")
    t = re.sub(r"</?(b|strong)>", "**", t)
    t = re.sub(r"</?(i|em)>", "*", t)
    t = re.sub(r"</?code>", "`", t)
    t = re.sub(r"<[^>]+>", "", t)
    return t.replace("&lt;", "<").replace("&gt;", ">").replace("&amp;", "&").strip()


def generar_planes(c):
    L = ["# Planes de clase", "",
         "Cada sesión dura 60 minutos y sigue cinco momentos: activación (5 min), ejemplo resuelto en vivo (10 min),",
         "práctica guiada en parejas (10 min), reto principal (25 min) y cierre (10 min).", "",
         "> Este archivo se genera automáticamente con `python construir.py` a partir de `contenido/`.", ""]
    nombres = {"activacion": "Activación", "ejemplo": "Ejemplo resuelto en vivo", "practica": "Práctica guiada", "reto": "Reto principal", "cierre": "Cierre"}
    minutos = {"activacion": 5, "ejemplo": 10, "practica": 10, "reto": 25, "cierre": 10}
    for s in c["sesiones"]:
        u = next((u for u in c["unidades"] if u["numero"] == s["unidad"]), {"nombre": ""})
        L.append(f"## Sesión {s['numero']}. {s['titulo']}")
        L.append("")
        L.append(f"**Unidad:** {u['nombre']} · **Modo de trabajo:** {s['modo']} · **Python:** {', '.join('`' + x + '`' for x in s.get('python', [])) or '—'}")
        L.append("")
        if s.get("objetivos"):
            L.append("**Objetivos:**")
            L.extend(f"- {html_a_texto(o)}" for o in s["objetivos"])
            L.append("")
        plan = s.get("plan") or {}
        for k in ("activacion", "ejemplo", "practica", "reto", "cierre"):
            if plan.get(k):
                m = (plan.get("minutos") or {}).get(k, minutos[k])
                L.append(f"1. **{nombres[k]} ({m} min):** {html_a_texto(plan[k])}")
        if plan.get("notas"):
            L.append("")
            L.append(f"*Notas:* {html_a_texto(plan['notas'])}")
        if s.get("reto"):
            L.append("")
            L.append(f"**Reto principal:** {s['reto']['titulo']}")
        if s.get("ticket"):
            t = s["ticket"]
            L.append("")
            L.append(f"**Ticket de salida:** {html_a_texto(t['pregunta'])} (respuesta: {chr(65 + t['correcta'])})")
        L.append("")
    destino = RAIZ / "docs" / "planes-de-clase.md"
    destino.parent.mkdir(exist_ok=True)
    destino.write_text("\n".join(L) + "\n", encoding="utf-8")


def generar_instrumentos(c):
    """Instrumentos de evaluación (se generan del contenido para que siempre coincidan)."""
    cfg = c["config"].get("evaluacion", {})
    pesos = cfg.get("pesos", {"retos": 40, "miniProyecto": 20, "proyectoFinal": 30, "tickets": 10})
    L = ["# Instrumentos de evaluación", "",
         "> Este archivo se genera automáticamente con `python construir.py` a partir de `contenido/` y `configuracion.json`.", "",
         "## 1. Ponderación", "",
         "| Componente | Peso | Evidencia |", "|---|---|---|",
         f"| Retos de la plataforma | {pesos['retos']} % | Retos principales superados en nivel Programador o Maestro (Explorador cuenta {cfg.get('creditoExplorador', 0.5)} de crédito; se cambia en `configuracion.json`) |",
         f"| Mini-proyecto (Sesión {cfg.get('sesionMiniProyecto', 7)}) | {pesos['miniProyecto']} % | Quiz funcional, revisado con la lista de cotejo |",
         f"| Proyecto final (Sesiones {cfg.get('sesionProyectoFinal', 15)} y 16) | {pesos['proyectoFinal']} % | Programa en Python y presentación, evaluados con la rúbrica |",
         f"| Tickets de salida | {pesos['tickets']} % | Respuesta de cierre de cada sesión |", "",
         "La plataforma calcula una **calificación estimada** (Mi progreso) y el Panel docente consolida los archivos de progreso del grupo en una tabla descargable como CSV. La calificación definitiva la asigna el docente.", ""]
    # Insignias
    L += ["## 2. Insignias por unidad (motivan, no califican)", "", "| Unidad | Insignia | Se gana al superar los retos principales de las sesiones |", "|---|---|---|"]
    for u in c["unidades"]:
        if u.get("insignia"):
            ses = [str(s["numero"]) for s in c["sesiones"] if s["unidad"] == u["numero"] and s.get("reto")]
            L.append(f"| {u['numero']}. {u['nombre']} | {u.get('icono', '')} {u['insignia']} | {', '.join(ses)} |")
    L.append("")
    # Prueba de lectura
    L += ["## 3. Prueba diagnóstica (Sesión 0) y final (Sesión 16)", "",
          "Los mismos 10 reactivos de lectura y predicción de código. La plataforma guarda ambos puntajes y muestra la comparación al alumno; el Panel docente calcula los promedios del grupo.", ""]
    for i, it in enumerate(c["prueba"]["items"], 1):
        L.append(f"### Reactivo {i}. {it.get('tema', '')}")
        L.append("")
        L.append(html_a_texto(it["pregunta"]))
        L.append("")
        L.append("```python")
        L.append(it["codigo"])
        L.append("```")
        L.append("")
        for j, op in enumerate(it["opciones"]):
            marca = " ✔" if j == it["correcta"] else ""
            L.append(f"- **{chr(65 + j)})** {op.replace(chr(10), ' ⏎ ')}{marca}")
        if it.get("explicacion"):
            L.append("")
            L.append(f"*Explicación:* {html_a_texto(it['explicacion'])}")
        L.append("")
    # Lista de cotejo
    mini = next((s for s in c["sesiones"] if s.get("reto", {}).get("listaCotejo")), None)
    if mini:
        L += [f"## 4. Lista de cotejo del mini-proyecto (Sesión {mini['numero']}: {mini['reto']['titulo']})", "",
              "| Criterio | Sí | No |", "|---|:---:|:---:|"]
        L += [f"| {x} | ☐ | ☐ |" for x in mini["reto"]["listaCotejo"]]
        L += ["", "La plataforma revisa automáticamente los criterios estructurales (5 input, 5 if, contador, elif) y que el programa se haya ejecutado completo sin errores.", ""]
    # Rúbrica
    final = next((s for s in c["sesiones"] if s.get("reto", {}).get("rubrica")), None)
    if final:
        r = final["reto"]["rubrica"]
        req = ", ".join(final["reto"].get("requiere", []))
        L += [f"## 5. Rúbrica del proyecto final (Sesión {final['numero']})", "",
              f"**Requisitos mínimos:** input(), una decisión con elif, un bucle, una lista y dos funciones propias (restricciones en la plataforma: `{req}`).", "",
              "| Criterio | " + " | ".join(r["niveles"]) + " |", "|---|" + "---|" * len(r["niveles"])]
        for cr in r["criterios"]:
            L.append(f"| **{cr['nombre']}** | " + " | ".join(cr["descriptores"]) + " |")
        L += ["", "Puntaje: suma de los 4 criterios (4 a 16 puntos). Sugerencia de conversión: (puntos / 16) × 100.", "",
              "Opciones de proyecto: " + ", ".join(op["titulo"] for op in final["reto"].get("opciones", [])) + ".", ""]
    # Tickets
    L += ["## 6. Tickets de salida", "", "| Sesión | Pregunta | Respuesta correcta |", "|---|---|---|"]
    for s in c["sesiones"]:
        t = s.get("ticket")
        if t:
            codigo = (" `" + t["codigo"].replace("\n", " ⏎ ") + "`") if t.get("codigo") else ""
            L.append(f"| {s['numero']} | {html_a_texto(t['pregunta'])}{codigo} | {chr(65 + t['correcta'])}) {t['opciones'][t['correcta']].replace(chr(10), ' ⏎ ')} |")
    L.append("")
    destino = RAIZ / "docs" / "instrumentos-de-evaluacion.md"
    destino.parent.mkdir(exist_ok=True)
    destino.write_text("\n".join(L) + "\n", encoding="utf-8")


def main():
    # La consola de Windows no siempre usa UTF-8: evitamos errores con ✓, á, ñ…
    for flujo in (sys.stdout, sys.stderr):
        try:
            flujo.reconfigure(encoding="utf-8", errors="replace")
        except (AttributeError, ValueError):
            pass
    rapido = "--rapido" in sys.argv
    print("De Bloques a Python · construcción")
    c = cargar_contenido()
    print(f"  {len(c['sesiones'])} sesiones, {len(c['prueba'].get('items', []))} reactivos de la prueba de lectura")
    errores, avisos = validar(c)
    for a in avisos:
        print("  · aviso:", a)
    if errores:
        for e in errores:
            print("  ✗", e)
        sys.exit("✗ Corrige los errores del contenido antes de construir.")
    if not rapido:
        problemas, total = probar_soluciones(c)
        if problemas:
            for p in problemas:
                print("  ✗", p)
            sys.exit(f"✗ {len(problemas)} problema(s) al probar las soluciones con Python.")
        print(f"  ✓ {total} casos de prueba superados por las soluciones de referencia (CPython {sys.version.split()[0]})")
    DIST.mkdir(exist_ok=True)
    for sin_conexion, nombre in ((False, "plataforma.html"), (True, "plataforma-sin-conexion.html")):
        html = construir(c, sin_conexion)
        (DIST / nombre).write_text(html, encoding="utf-8")
        print(f"  ✓ dist/{nombre} ({len(html.encode('utf-8')) / 1024:.0f} KB)")
    print(f"  ✓ soluciones/: {generar_soluciones(c)} archivos .py")
    generar_planes(c)
    print("  ✓ docs/planes-de-clase.md")
    generar_instrumentos(c)
    print("  ✓ docs/instrumentos-de-evaluacion.md")


if __name__ == "__main__":
    main()
