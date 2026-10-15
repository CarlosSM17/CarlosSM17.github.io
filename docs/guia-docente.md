# Guía docente

Esta guía explica cómo usar la plataforma en clase, cómo evaluar y cómo agregar o modificar retos sin tocar el código de la plataforma.

- Publicación en Google Sites: [publicar-en-google-sites.md](publicar-en-google-sites.md)
- Planes de clase de las 17 sesiones: [planes-de-clase.md](planes-de-clase.md)
- Prueba de lectura, lista de cotejo, rúbrica y tickets: [instrumentos-de-evaluacion.md](instrumentos-de-evaluacion.md)

---

## 1. Cómo está organizado el curso

17 sesiones de 60 minutos: la Sesión 0, seis unidades y el proyecto final.

| Sesiones | Unidad | Modo de trabajo |
|---|---|---|
| 0 | Bienvenida: de Scratch a Blockly | 1 · Bloques |
| 1–2 | 1. Primeros pasos | 1 · Bloques |
| 3–4 | 2. Datos y texto | 1 · Bloques |
| 5–7 | 3. Decisiones (7 = mini-proyecto) | 2 · Completar |
| 8–10 | 4. Repetición | 2 · Completar |
| 11–12 | 5. Listas | 3 · Con apoyo |
| 13–14 | 6. Funciones | 3 · Con apoyo |
| 15–16 | Proyecto final | 4 · Libre |

**Modos de trabajo** (los bloques se retiran por etapas, modelo CLT4BP):

1. **Bloques**: se arma con bloques; el Python aparece a un lado, solo para leer.
2. **Completar**: se arma con bloques, y las condiciones y valores se escriben en Python dentro de los **huecos amarillos ✎**, en el bloque o en el panel de Python.
3. **Con apoyo**: se escribe Python en un editor de texto. El panel «🧩 Bloques» muestra el código como bloques, una pista con la estructura de la solución y un borrador para armar con bloques y pasar al editor.
4. **Libre**: se escribe Python; los bloques solo como borrador.

Quien domina un tema puede adelantarse a un modo superior (reversión por pericia). Los modos inferiores al de la sesión solo se habilitan en modo docente.

**Cada sesión** tiene los mismos pasos: Historia y teoría → Ejemplo resuelto (Predecir y Ejecutar de PRIMM) → Micro-retos → Reto principal → Reto extra → Cierre (puente bloque ↔ Python, autoevaluación y ticket de salida). La Sesión 0 incluye la prueba diagnóstica; la 7 y la 15 son proyectos; la 16 tiene coevaluación y prueba final.

**Cada reto principal** tiene tres niveles: **Explorador** ★ (parte del programa ya armada), **Programador** ★★ (lo arma completo) y **Maestro** ★★★ (un requisito adicional).

**Ejecución y verificación**: ▶ Ejecutar corre el programa con una consola para `input()`. 👣 Paso a paso resalta cada línea y su bloque y muestra la tabla de variables. ✔ Comprobar revisa los casos de prueba y las restricciones y explica qué falló. Los errores de Python se explican en español y se muestra también el nombre original (`SyntaxError`, `NameError`…).

---

## 2. En el salón

**Primera clase (Sesión 0).** Cada alumno escribe su nombre al entrar. Juegan «Piedra, papel o tijera» (el tipo de proyecto que harán al final), resuelven tres micro-retos para conocer la plataforma y presentan la prueba diagnóstica.

**Secuencia de 60 minutos** (detallada en cada plan de clase):

1. Activación, 5 min: «¿Qué imprime?».
2. Ejemplo resuelto en vivo, 10 min: arma los bloques frente al grupo y usa 👣 Paso a paso.
3. Práctica guiada, 10 min: micro-retos en parejas, conductor y navegante, con cambio de roles a la mitad.
4. Reto principal, 25 min: cada quien en su nivel; atiende primero a quien lleva más tiempo atorado.
5. Cierre, 10 min: alguien explica su solución mostrando bloques y Python, y todos contestan el ticket de salida.

**Recomendaciones para iPad**

- Usa Safari actualizado. Si hay teclado físico, mejor para los modos 3 y 4.
- La barra de símbolos debajo del editor escribe `: ( ) " [ ]` con un toque.
- Las comillas «tipográficas» del teclado del iPad se cambian solas por comillas rectas.
- Con el botón **A+** se agrandan letras y bloques (útil para proyectar).

**Guardar el progreso.** Se guarda en el navegador de cada dispositivo. Si los iPads se comparten o el navegador borra datos, cada alumno puede descargar su archivo de progreso o copiar su código en **Mi progreso**, y recuperarlo con **Cargar archivo** o **Pegar código**. Al importar, se combina con lo que ya hay y se conserva lo mejor de los dos.

---

## 3. Modo docente

En **Docente** escribe el PIN (por defecto `2468`; cámbialo en `configuracion.json`). El modo dura mientras la pestaña esté abierta y permite:

- **Ver la solución** de cada reto (menú ⋯ del taller) y cargarla en el taller para mostrarla.
- Ver la **respuesta correcta** de las preguntas y repetir los tickets.
- Usar **cualquier modo de trabajo**.
- Ver el **plan de clase** al final del paso «Historia y teoría» de cada sesión.
- **Consolidar el progreso del grupo**: selecciona varios archivos de progreso a la vez, o pega varios códigos, para ver una tabla con niveles por sesión, requisitos de los proyectos, tickets, pruebas diagnóstica y final y la calificación estimada. Se descarga como CSV para Google Sheets o Excel.

> El PIN es una protección ligera para que los alumnos no vean soluciones por accidente; las soluciones viajan dentro del archivo HTML.

---

## 4. Evaluación

| Componente | Peso | Cómo lo registra la plataforma |
|---|---|---|
| Retos de la plataforma | 40 % | Retos principales superados. Programador o Maestro valen 1; Explorador vale 0.5 (`creditoExplorador`). |
| Mini-proyecto (S7) | 20 % | Lista de cotejo automática (5 input, 5 if, contador, elif y ejecución sin errores). Revísala con la lista de cotejo. |
| Proyecto final (S15–16) | 30 % | Requisitos mínimos automáticos. La calificación se asigna con la **rúbrica**. |
| Tickets de salida | 10 % | Porcentaje de tickets correctos. Se contestan una sola vez. |

Los pesos se cambian en `configuracion.json`. **Mi progreso** muestra al alumno su calificación estimada. La definitiva la asignas tú.

**Medición del aprendizaje.** La prueba diagnóstica (S0) y la final (S16) usan los mismos 10 reactivos de lectura de código. El Panel docente calcula los promedios del grupo, lo que permite reportar el avance o usar el curso como estudio piloto.

**Insignias** (motivan, no califican): se ganan al superar todos los retos principales de una unidad.

---

## 5. Agregar o modificar retos

Todo el contenido está en la carpeta `contenido/`. La plataforma no se toca.

```
contenido/
  unidades.json          unidades, colores e insignias
  prueba-lectura.json    los 10 reactivos de la prueba diagnóstica y final
  sesion-00.json … sesion-16.json   una sesión por archivo
configuracion.json       nombre del curso, PIN, pesos de evaluación, enlaces
```

Después de editar, ejecuta en una terminal, desde la carpeta del proyecto:

```
python construir.py                      valida, prueba las soluciones y construye dist/
python herramientas/probar_plataforma.py prueba todo en un navegador real (Edge o Chrome)
```

`construir.py` revisa el formato y ejecuta cada solución de referencia contra sus casos de prueba con Python. Si algo falla, dice exactamente qué y no construye. `probar_plataforma.py` repite las pruebas con Skulpt, el intérprete del navegador. También convierte cada solución a bloques y de vuelta a Python, y confirma que el código inicial no pasa solo.

### 5.1 Estructura de una sesión

```json
{
  "numero": 9,
  "unidad": 4,
  "titulo": "Repetir mientras se cumpla algo",
  "python": ["while", "contadores", "random.randint()"],
  "modo": 2,
  "historia": "Texto (se permite HTML sencillo: <b>, <code>, <ul>…)",
  "objetivos": ["…", "…"],
  "teoria": [ … ],
  "fichas": [{ "titulo": "while", "codigo": "while condicion:\n    ...", "nota": "…" }],
  "glosario": [{ "en": "while", "es": "mientras", "def": "…" }],
  "ejemplo": { … },
  "microretos": [ … ],
  "reto": { … },
  "extra": { … },
  "puente": [ … ],
  "autoevaluacion": [{ "pregunta": "…", "respuesta": "…" }],
  "ticket": { … },
  "plan": { "activacion": "…", "ejemplo": "…", "practica": "…", "reto": "…", "cierre": "…", "notas": "…" }
}
```

Opcionales: `prueba` (`"diagnostica"` o `"final"`), `coevaluacion`, `subtitulo`, `historiaIcono` y `plan.minutos` para cambiar la duración de cada momento.

**Elementos de `teoria`** (se muestran en orden):

| `tipo` | Campos | Qué muestra |
|---|---|---|
| `texto` | `html` | Párrafos, listas o tablas |
| `titulo` | `texto` | Un subtítulo |
| `analogia` | `icono`, `titulo`, `html` | Recuadro con una analogía |
| `codigo` | `codigo`, `nota` | Código con botón ▶ Probar |
| `bloques` | `codigo`, `titulo`, `nota`, `alto` | El mismo programa en bloques y en Python |
| `comparacion` | `titulo`, `filas: [{scratch, python, nota}]` | Tabla «En Scratch / En Python» |
| `animacion` | `animacion`: `variables`, `decision`, `bucle`, `mientras`, `lista` o `funcion` | Animación paso a paso |

**Ejemplo resuelto**:

```json
"ejemplo": {
  "titulo": "Cuenta regresiva",
  "descripcion": "…",
  "codigo": "n = 3\nwhile n > 0:\n    print(n)\n    n = n - 1",
  "prediccion": { "pregunta": "¿Qué se mostrará?", "opciones": ["…", "…"], "correcta": 0, "explicacion": "…", "codigoOpciones": true },
  "investigar": ["Pregunta 1", "Pregunta 2"],
  "modificar": "Qué cambiar en el taller",
  "entradasPrueba": ["…"]
}
```

`entradasPrueba` y `azarPrueba` solo sirven para que el banco de pruebas pueda ejecutar ejemplos que piden datos.

**Preguntas** (`prediccion`, `puente`, `ticket`, reactivos de la prueba): `pregunta`, `opciones`, `correcta` (índice desde 0), `explicacion`. Opcionales: `codigo` (programa que se muestra), `bloques` (código Python que se muestra como bloques), `codigoOpciones: true` (opciones con formato de código).

### 5.2 Estructura de un reto

Micro-retos, reto extra y reto principal comparten los mismos campos:

```json
{
  "id": "s09-m1",
  "titulo": "Cuenta hasta 5",
  "resumen": "Texto corto para la tarjeta",
  "enunciado": "Lo que hay que hacer (HTML)",
  "inicio": "contador = 1\nwhile «»:\n    print(contador)\n    contador = «»",
  "solucion": "contador = 1\nwhile contador <= 5:\n    print(contador)\n    contador = contador + 1",
  "bloques": ["py_assign", "py_var", "py_while", "py_print", "py_number", "py_arith", "py_compare", "py_hueco"],
  "requiere": ["while"],
  "prohibe": [],
  "pruebas": [{ "exacto": "1\n2\n3\n4\n5" }],
  "pistas": ["Qué concepto usar", "Cómo se organiza el programa", "La pieza que falta"]
}
```

- **`id`**: único en todo el curso. El progreso de los alumnos se guarda con este id, así que **no lo cambies** una vez iniciado el curso.
- **`inicio`** se escribe en Python y la plataforma lo convierte en bloques:
  - `___` (tres guiones bajos) es una pieza vacía. En bloques queda un espacio para encajar un bloque; en texto queda escrito `___`.
  - `«»` es un **hueco para escribir Python**: el bloque amarillo ✎ del modo 2. Puede traer texto: `«contador + 1»`.
  - Los comentarios `# …` se vuelven bloques de comentario. Úsalos para indicar dónde falta algo.
- **`bloques`** (opcional) limita la caja de herramientas a esos tipos. Si se omite, aparecen todos los bloques vistos hasta esa sesión. Tipos disponibles: `py_print, py_input, py_convert, py_comment, py_assign, py_augassign, py_var, py_number, py_arith, py_round, py_compare, py_logic, py_not, py_in, py_bool, py_string, py_fstring, py_len, py_str_method, py_if, py_elif, py_else, py_for, py_while, py_break, py_continue, py_pass, py_range, py_list, py_index, py_index_set, py_append, py_func1, py_import, py_randint, py_choice, py_def, py_return, py_call, py_call_stmt, py_kwarg, py_method_call, py_expr_stmt, py_raw_stmt, py_raw_expr, py_raw_block, py_hueco`.
- **`modo`** (opcional en el reto) usa otro modo distinto al de la sesión.

**Reto principal con niveles**: los campos comunes van en el reto y lo propio de cada nivel en `niveles`:

```json
"reto": {
  "id": "s09-reto", "titulo": "…", "historia": "…", "enunciado": "…",
  "requiere": ["while", "randint"],
  "pruebas": [ … ],
  "pistas": [ … ],
  "niveles": {
    "explorador":  { "descripcion": "…", "inicio": "…", "solucion": "…" },
    "programador": { "inicio": "", "solucion": "…" },
    "maestro":     { "enunciado": "requisito adicional…", "inicio": "", "requiere": ["and"], "pruebas": [ … ], "solucion": "…" }
  }
}
```

En un nivel, `pruebas` **reemplaza** a las del reto y `requiere` se **suma**.

**Proyectos** (`"tipo": "proyecto"`): en lugar de niveles tienen `opciones`, cada una con `id`, `icono`, `titulo`, `resumen`, `descripcion`, `inicio` y, opcionalmente, `solucion` y `entradasPrueba`. Se evalúan con `requiere`, que funciona como lista de cotejo automática, más la ejecución completa sin errores. Opcionales: `rubrica` (`niveles` y `criterios` con `descriptores`) y `listaCotejo` (lista de textos).

### 5.3 Casos de prueba

```json
{ "nombre": "Secreto 7", "entradas": ["10", "5", "7"], "azar": [7],
  "contiene": ["Más bajo", "Más alto", "Lo lograste en 3 intentos"],
  "no_contiene": ["Perdiste"] }
```

| Campo | Significa |
|---|---|
| `entradas` | Lo que «escribe» el usuario en cada `input()`, en orden. Si el programa pide más datos, la prueba falla con un mensaje claro. |
| `azar` | Valores que devolverán `random.randint` y `random.choice`, en orden. Así las pruebas con azar se pueden repetir. |
| `contiene` | Textos que deben aparecer **en ese orden** en lo que imprime el programa. |
| `no_contiene` | Textos que no deben aparecer. |
| `exacto` | La salida completa exacta. |
| `lineasMin` | Mínimo de renglones impresos (para retos personales como una tarjeta de presentación). |
| `nombre` | Cómo se llama la prueba en los resultados. |

La comparación ignora mayúsculas, acentos, `¡ ¿` y espacios repetidos, y solo revisa lo que imprime `print`: los mensajes de `input()` no cuentan.

> Evita resultados con decimales «raros» como `0.1 + 0.2`: Skulpt (navegador) y Python muestran distinto número de decimales. Usa valores que den resultados exactos, como `8.5` o `75.0`.

### 5.4 Restricciones (`requiere` y `prohibe`)

| Escritura | Significa |
|---|---|
| `"while"` | Usar `while` al menos una vez. |
| `"def*2"` | Al menos 2 veces (aquí, 2 funciones). |
| `"print<=2"` | A lo más 2 veces, para obligar a usar un bucle. |
| `"for\|while"` | Al menos uno de los dos. |

Palabras disponibles: cualquier palabra clave de Python (`if`, `elif`, `else`, `for`, `while`, `def`, `return`, `break`, `and`, `or`, `not`, `in`…); funciones como `print`, `input`, `int`, `float`, `str`, `len`, `range`, `max`, `min`, `sum`, `round`; métodos como `append`, `upper`, `lower`, `title`, `randint`, `choice`; operadores como `+=`, `%`, `//`, `==`; y estas claves especiales:

| Clave | Cuenta |
|---|---|
| `lista` | Listas escritas con corchetes `[ ]` |
| `indice` | Uso de posiciones: `lista[0]` |
| `fstring` | f-strings `f"…"` |
| `comentario` | Comentarios `#` |
| `variable` | Asignaciones con `=` |
| `acumula` | Contadores y acumuladores: `x = x + …` o `x += …` |
| `import random` | Que se importe `random` |

### 5.5 Agregar una sesión nueva

1. Copia un archivo `sesion-XX.json` parecido y cámbiale `numero`, `titulo`, `unidad` y `modo`.
2. Usa ids nuevos para todos los retos.
3. Ejecuta `python construir.py` y corrige lo que indique.
4. Ejecuta `python herramientas/probar_plataforma.py`.
5. Publica el nuevo `dist/plataforma.html` (ver [publicar-en-google-sites.md](publicar-en-google-sites.md)).

---

## 6. Configuración (`configuracion.json`)

| Campo | Para qué sirve |
|---|---|
| `nombreCurso`, `lema` | Nombre y frase de la portada. |
| `idCurso` | Identificador del progreso guardado. Cámbialo solo si quieres que todos empiecen de cero (por ejemplo, otro ciclo escolar en los mismos iPads). |
| `pinDocente` | PIN del modo docente. |
| `enlaceTicket` | (Opcional) Dirección de un formulario de Google que aparece junto al ticket de salida. |
| `urlPublica` | (Opcional) Dirección donde está alojada la plataforma; activa el botón ↗ «abrir en pestaña nueva» cuando se ve dentro de Google Sites. |
| `evaluacion.pesos` | Pesos de la calificación: `retos`, `miniProyecto`, `proyectoFinal`, `tickets`. |
| `evaluacion.creditoExplorador` | Cuánto vale un reto superado solo en nivel Explorador (0 a 1). |

---

## 7. Solución de problemas

| Problema | Qué hacer |
|---|---|
| «No se pudo cargar la plataforma» | La primera carga necesita internet (Blockly y Skulpt vienen de un CDN). Revisa la conexión o usa `plataforma-sin-conexion.html`. |
| El progreso desaparece | El navegador bloqueó o borró el almacenamiento (Safari dentro de marcos, modo privado). Recupéralo con el archivo o código de progreso. Para el curso completo, publica con la opción B. |
| «El programa tardó demasiado» | Hay un bucle infinito: casi siempre falta aumentar el contador o la condición nunca cambia. La plataforma lo detiene sola; también existe el botón ⏹ Detener. |
| Un alumno ve `NameError: name '___'` | Quedó un hueco `___` sin completar. |
| La descarga del `.py` no funciona dentro de Google Sites | Usa ⋯ → Copiar el código; si el portapapeles también está bloqueado, aparece el texto para copiarlo a mano. |
| Una solución correcta no pasa | Revisa que los textos de `contiene` coincidan con lo que pide el enunciado. Si la solución usa algo poco común, prueba con `python herramientas/probar_plataforma.py`. |

**Diferencias entre Skulpt y Python 3.** Skulpt cubre todo lo que usa el curso. Las diferencias aparecen con algunos decimales (`0.1 + 0.2` muestra `0.3`) y en módulos que no son `random`, `math` o `time`. Cada solución de referencia se prueba en los dos intérpretes.

---

## 8. Componentes y licencias

- [Blockly](https://www.npmjs.com/package/blockly) 11.2.2 (Apache 2.0), mantenido por la Raspberry Pi Foundation.
- [Skulpt](https://skulpt.org) (MIT), compilación de marzo de 2026, fijada por commit.
- Fuentes Nunito y JetBrains Mono (SIL Open Font License), desde Google Fonts.
