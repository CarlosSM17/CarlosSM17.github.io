# Planes de clase

Cada sesión dura 60 minutos y sigue cinco momentos: activación (5 min), ejemplo resuelto en vivo (10 min),
práctica guiada en parejas (10 min), reto principal (25 min) y cierre (10 min).

> Este archivo se genera automáticamente con `python construir.py` a partir de `contenido/`.

## Sesión 0. De Scratch a Blockly

**Unidad:** Bienvenida · **Modo de trabajo:** 1 · **Python:** —

**Objetivos:**
- Conocer la plataforma: bloques, panel de Python, consola y botones.
- Descubrir que cada bloque es una línea de Python.
- Jugar el proyecto que podrás programar al final del curso.
- Responder la prueba diagnóstica (es tu punto de partida, no tiene calificación).

1. **Activación (5 min):** Pregunta al grupo qué hicieron en Scratch. Muestra un proyecto de Scratch y el mismo en Python: ¿qué palabras reconocen?
1. **Ejemplo resuelto en vivo (10 min):** Proyecta «Piedra, papel o tijera» y juega frente al grupo. Señala palabras que se entienden aunque no sepan Python (input, print, random).
1. **Práctica guiada (15 min):** Micro-retos 1 a 3 en parejas para conocer la plataforma: arrastrar, editar texto, agregar bloques, ejecutar y comprobar.
1. **Reto principal (20 min):** Prueba diagnóstica individual (10 preguntas de leer código). Aclara que no tiene calificación: es el punto de partida y se repetirá en la Sesión 16.
1. **Cierre (10 min):** Ticket de salida. Explica cómo se guarda el progreso en el iPad y cómo exportarlo desde «Mi progreso».

*Notas:* Antes de la clase prueba la plataforma en un iPad del grupo (arrastre táctil, teclado e input en la consola). Si el navegador bloquea el almacenamiento, pide a los alumnos que exporten su progreso al final de cada sesión.

**Ticket de salida:** En esta plataforma, cada bloque que armas… (respuesta: A)

## Sesión 1. Secuencia y salida

**Unidad:** Primeros pasos · **Modo de trabajo:** 1 · **Python:** `print()`, `comentarios #`

**Objetivos:**
- Mostrar mensajes en la pantalla con `print()`.
- Comprobar que Python ejecuta las instrucciones en orden, de arriba hacia abajo.
- Escribir comentarios con `#` para explicar tu programa.
- Distinguir entre un texto (entre comillas) y un número.

1. **Activación (5 min):** Proyecta «¿Qué imprime?»: `print("5 + 3")` y `print(5 + 3)`. El grupo vota la salida antes de ejecutar.
1. **Ejemplo resuelto en vivo (10 min):** Arma en vivo la tarjeta de Robi con bloques. Después de cada bloque, señala la línea de Python que apareció. Pide predecir cuántos renglones saldrán (el comentario no cuenta).
1. **Práctica guiada (10 min):** Micro-retos 1 a 3 en parejas: conductor (maneja el iPad) y navegante (lee el enunciado). Cambian de rol a la mitad.
1. **Reto principal (25 min):** Tarjeta de presentación. Explorador completa la plantilla; Programador arma desde cero; Maestro agrega un dibujo. Atiende primero a quien lleve más tiempo atorado.
1. **Cierre (10 min):** Una persona proyecta su tarjeta y señala qué bloque produce cada renglón. Ticket de salida (el comentario que no se ejecuta).

*Notas:* Es la primera sesión con la plataforma: dedica un minuto a mostrar cómo arrastrar, borrar (al bote de basura) y usar el botón ⊕ del bloque print.

**Reto principal:** Tarjeta de presentación

**Ticket de salida:** ¿Qué aparece en la pantalla? (respuesta: B)

## Sesión 2. Variables y operaciones

**Unidad:** Primeros pasos · **Modo de trabajo:** 1 · **Python:** `=`, `+ - * / // %`, `int`, `float`

**Objetivos:**
- Guardar datos en **variables** con `=`.
- Hacer cuentas con `+ - * / // %`.
- Distinguir números enteros (`int`) de números con decimales (`float`).
- Elegir nombres de variables claros y válidos.

1. **Activación (5 min):** «¿Qué imprime?»: `x = 5`, `x = x + 3`, `print(x)`. Discute por qué no es 5.
1. **Ejemplo resuelto en vivo (10 min):** Arma «Pizza para el grupo» en vivo. Usa 👣 Paso a paso para mostrar la tabla de variables y la animación de cajas de la teoría.
1. **Práctica guiada (10 min):** Micro-retos (dulces, canicas, promedio) en parejas. Pide que el navegante prediga el resultado antes de ejecutar.
1. **Reto principal (25 min):** Calculadora de la tiendita en tres niveles. Revisa que usen variables y no escriban 92 directamente.
1. **Cierre (10 min):** Una pareja explica cómo calculó el cambio señalando el bloque y su línea de Python. Ticket de salida (// y %).

**Reto principal:** Calculadora de la tiendita

**Ticket de salida:** ¿Qué se muestra? (respuesta: A)

## Sesión 3. Leer datos del usuario

**Unidad:** Datos y texto · **Modo de trabajo:** 1 · **Python:** `input()`, `int()`, `float()`, `str()`

**Objetivos:**
- Pedir datos con `input()`.
- Recordar que `input()` siempre devuelve texto.
- Convertir texto en números con `int()` y `float()`.
- Convertir números en texto con `str()`.

1. **Activación (5 min):** «¿Qué imprime?»: `print("12" + "12")` y `print(12 + 12)`. Votación.
1. **Ejemplo resuelto en vivo (10 min):** Arma «¿Cuántos años tendrás?» frente al grupo. Ejecuta con datos reales del grupo; luego quita el `int()` y muestra el error para explicar los tipos.
1. **Práctica guiada (10 min):** Micro-retos (saludo, doble, dividir la cuenta) en parejas.
1. **Reto principal (25 min):** Conversor de unidades. Explorador completa fórmulas; Programador lo arma todo; Maestro agrega la estatura con round().
1. **Cierre (10 min):** Una persona explica por qué se usa float() y no int() en el conversor. Ticket de salida ("5" * 3).

**Reto principal:** Conversor de unidades

**Ticket de salida:** Al ejecutar escribes **5**. ¿Qué se muestra? (respuesta: B)

## Sesión 4. Trabajar con texto

**Unidad:** Datos y texto · **Modo de trabajo:** 1 · **Python:** `concatenación +`, `len()`, `.upper()`, `f-strings`

**Objetivos:**
- Unir textos con `+` (concatenación).
- Contar caracteres con `len()`.
- Transformar texto con `.upper()`, `.lower()` y `.title()`.
- Armar mensajes con **f-strings**: `f"Hola {nombre}"`.

1. **Activación (5 min):** «¿Qué imprime?»: `print("ja" * 3)` y `print(len("ja ja"))`.
1. **Ejemplo resuelto en vivo (10 min):** Arma el ejemplo de Valentina. Pregunta qué hace cada método antes de ejecutar. Compara las tres formas de mostrar texto (comas, + y f-string).
1. **Práctica guiada (10 min):** Micro-retos (gritar, contar letras, f-string) en parejas.
1. **Reto principal (25 min):** Generador de apodos. Al terminar, cada quien comparte su apodo en voz alta.
1. **Cierre (10 min):** Explica en el pizarrón cómo se armó el apodo: bloque por bloque y línea por línea. Ticket de salida. Insignia «Domador de datos» para quien superó los retos de las sesiones 3 y 4.

**Reto principal:** Generador de apodos

**Ticket de salida:** ¿Qué número se muestra? (respuesta: A)

## Sesión 5. Comparar y decidir

**Unidad:** Decisiones · **Modo de trabajo:** 2 · **Python:** `bool`, `==`, `<`, `>=`, `if / else`

**Objetivos:**
- Comparar valores con `== != < <= > >=`.
- Reconocer los valores lógicos `True` y `False` (tipo `bool`).
- Tomar decisiones con `if` y `else`.
- Usar la sangría para indicar qué instrucciones van dentro del if.

1. **Activación (5 min):** «¿Qué imprime?»: `print(3 > 2, 3 == 2)`. Presenta True y False.
1. **Ejemplo resuelto en vivo (10 min):** Arma «La montaña rusa» en bloques y señala la sangría en el panel de Python. Muestra la animación de decisiones. Explica el nuevo modo 2: escribe una condición en el hueco ✎ frente al grupo.
1. **Práctica guiada (10 min):** Micro-retos (positivo, contraseña, par o impar) en parejas.
1. **Reto principal (25 min):** ¿Aprobado o reprobado? Revisa el caso límite 6: muchos escriben > en lugar de >=.
1. **Cierre (10 min):** Una persona explica por qué la prueba «6» fallaba con >. Ticket de salida.

**Reto principal:** ¿Aprobado o reprobado?

**Ticket de salida:** ¿Qué se muestra? (respuesta: A)

## Sesión 6. Varias opciones

**Unidad:** Decisiones · **Modo de trabajo:** 2 · **Python:** `elif`, `and`, `or`, `not`

**Objetivos:**
- Elegir entre varias opciones con `if`, `elif` y `else`.
- Combinar condiciones con `and`, `or` y `not`.
- Ordenar las condiciones para que cada caso caiga en el lugar correcto.

1. **Activación (5 min):** «¿Qué imprime?»: `print(True and False, True or False, not True)`.
1. **Ejemplo resuelto en vivo (10 min):** Arma «¿Qué tiempo hace?» y ejecútalo paso a paso con 18, 35 y 5. Pregunta por qué el orden de las condiciones importa.
1. **Práctica guiada (10 min):** Micro-retos (semáforo, adolescente, fin de semana) en parejas.
1. **Reto principal (25 min):** Clasificador del clima. Revisa los casos límite (20 y 10). Maestro combina frío y lluvia con and.
1. **Cierre (10 min):** Discusión: ¿qué pasa si el if de la lluvia se convierte en elif? Ticket de salida.

**Reto principal:** Clasificador del clima

**Ticket de salida:** ¿Qué se muestra? (respuesta: B)

## Sesión 7. Mini-proyecto: tu propio quiz

**Unidad:** Decisiones · **Modo de trabajo:** 2 · **Python:** `integra unidades 1 a 3`

**Objetivos:**
- Integrar lo aprendido: `input()`, variables, comparaciones, `if`/`elif`/`else`.
- Usar un **contador** de puntos que aumenta con cada respuesta correcta.
- Planear un programa por partes antes de programarlo (descomposición).

1. **Activación (5 min):** Juega frente al grupo el quiz de dos preguntas del ejemplo. Pregunta: ¿qué partes tiene este programa?
1. **Ejemplo resuelto en vivo (5 min):** Descompón el quiz en el pizarrón: crear el puntaje, preguntar, comparar, sumar, mostrar. Señala el patrón que se repite.
1. **Práctica guiada (10 min):** Micro-reto de calentamiento (una pregunta con puntaje). Luego cada pareja elige tema y escribe en su cuaderno las 5 preguntas y respuestas.
1. **Reto principal (30 min):** Desarrollo del mini-proyecto. La lista de cotejo se marca sola mientras programan; recuerda que deben ejecutarlo completo al menos una vez sin errores.
1. **Cierre (10 min):** Intercambio: cada pareja juega el quiz de otra. Ticket de salida. Recuerda descargar el .py como evidencia.

*Notas:* El mini-proyecto vale 20 % de la calificación y se revisa con la lista de cotejo (Panel docente).

**Reto principal:** Quiz de 5 preguntas con puntaje

**Ticket de salida:** ¿Qué número se muestra? (respuesta: A)

## Sesión 8. Repetir un número fijo de veces

**Unidad:** Repetición · **Modo de trabajo:** 2 · **Python:** `for`, `range()`

**Objetivos:**
- Repetir instrucciones un número fijo de veces con `for` y `range()`.
- Usar la variable del bucle dentro de las instrucciones.
- Controlar dónde empieza, dónde termina y de cuánto en cuánto avanza `range()`.
- Dibujar figuras repitiendo texto con `*`.

1. **Activación (5 min):** «¿Qué imprime?»: `for i in range(3): print(i)`. Muchos esperan 1, 2, 3.
1. **Ejemplo resuelto en vivo (10 min):** Arma «La tabla del 2» en bloques y ejecútala paso a paso; muestra la animación del for. Compara con «repetir» de Scratch.
1. **Práctica guiada (10 min):** Micro-retos (cinco veces, de 2 en 2, escalera) en parejas.
1. **Reto principal (25 min):** Tablas de multiplicar. La restricción «print como máximo 2 veces» obliga a usar el for.
1. **Cierre (10 min):** Una persona explica el range que eligió. Ticket de salida.

**Reto principal:** Tablas de multiplicar

**Ticket de salida:** ¿Cuántas veces aparece «Hola»? (respuesta: A)

## Sesión 9. Repetir mientras se cumpla algo

**Unidad:** Repetición · **Modo de trabajo:** 2 · **Python:** `while`, `contadores`, `random.randint()`

**Objetivos:**
- Repetir instrucciones con `while` mientras una condición sea `True`.
- Usar un **contador** para saber cuántas veces se repitió algo.
- Generar números al azar con `random.randint()`.
- Evitar los bucles infinitos.

1. **Activación (5 min):** «¿Qué imprime?»: la cuenta regresiva (`n = 3 … while n > 0`). Votación a mano alzada antes de ejecutar.
1. **Ejemplo resuelto en vivo (10 min):** Arma la cuenta regresiva en bloques frente al grupo y ejecútala con 👣 Paso a paso: señala la tabla de variables y cuántas veces se revisa la condición. Luego quita el `n = n - 1` para mostrar un bucle infinito.
1. **Práctica guiada (10 min):** Micro-retos (contador, dado, ahorro) en parejas, con cambio de conductor y navegante a la mitad.
1. **Reto principal (25 min):** Adivina el número. Explorador completa tres piezas; Programador arma todo (en modo 2 escribe la condición y el contador en los huecos); Maestro limita a 5 intentos.
1. **Cierre (10 min):** Una persona explica su solución mostrando bloques y Python. Ticket de salida. Insignia de la unidad cuando se completen las sesiones 8 a 10.

*Notas:* El verificador fija el número secreto para que cada prueba sea reproducible. Si alguien pregunta por qué sus pruebas «siempre aciertan», explica que al probar se usa un número fijo.

**Reto principal:** Adivina el número

**Ticket de salida:** ¿Qué número se muestra? (respuesta: B)

## Sesión 10. Acumular y validar

**Unidad:** Repetición · **Modo de trabajo:** 2 · **Python:** `acumuladores`, `+=`, `break`

**Objetivos:**
- Usar **acumuladores** para sumar valores dentro de un bucle.
- Usar el atajo `+=`.
- Salir de un bucle antes de tiempo con `break`.
- Validar datos: volver a pedirlos mientras no sean correctos.

1. **Activación (5 min):** «¿Qué imprime?»: un for que acumula 1 + 2 + 3. Pide que expliquen el valor de s en cada vuelta.
1. **Ejemplo resuelto en vivo (10 min):** Arma «La cuenta de la tiendita» y ejecútala paso a paso con precios que diga el grupo. Mueve `total = 0` dentro del for para mostrar el error.
1. **Práctica guiada (10 min):** Micro-retos (suma 1 a 10, detente en el cero, edad válida) en parejas.
1. **Reto principal (25 min):** Contraseña con 3 intentos. Discute por qué hace falta la variable `acceso`.
1. **Cierre (10 min):** Ticket de salida. Insignia «Maestro de bucles» para quien superó los retos de las sesiones 8, 9 y 10.

**Reto principal:** Contraseña con 3 intentos

**Ticket de salida:** ¿Qué número se muestra? (respuesta: A)

## Sesión 11. Guardar varios datos

**Unidad:** Listas · **Modo de trabajo:** 3 · **Python:** `[ ]`, `índices desde 0`, `.append()`, `len()`

**Objetivos:**
- Crear listas con corchetes `[ ]`.
- Leer y cambiar elementos por su posición (¡que empieza en 0!).
- Agregar elementos con `.append()`.
- Saber cuántos elementos hay con `len()`.

1. **Activación (5 min):** «¿Qué imprime?»: `print(["a", "b", "c"][1])`. Muchos responden «a».
1. **Ejemplo resuelto en vivo (10 min):** Presenta el modo 3: escribe «La mochila de Robi» en el editor frente al grupo usando la barra de símbolos. Abre el panel 🧩 para mostrar los bloques. Usa la animación de posiciones.
1. **Práctica guiada (10 min):** Micro-retos (días, compras, cambio de jugador) en parejas. Insiste en que la posición empieza en 0.
1. **Reto principal (25 min):** Inventario de la mochila. Quien se atore puede abrir 🧩 → «Pista» para ver la estructura en bloques.
1. **Cierre (10 min):** Ticket de salida. Pregunta: ¿qué fue más fácil, bloques o texto? (sin calificación).

**Reto principal:** Inventario de la mochila

**Ticket de salida:** ¿Qué número se muestra? (respuesta: A)

## Sesión 12. Recorrer listas

**Unidad:** Listas · **Modo de trabajo:** 3 · **Python:** `for x in lista`, `in`, `max()`, `sum()`, `random.choice()`

**Objetivos:**
- Recorrer una lista elemento por elemento con `for x in lista`.
- Preguntar si un valor está en una lista con `in`.
- Usar `sum()`, `max()`, `min()` y `len()` con listas.
- Elegir un elemento al azar con `random.choice()`.

1. **Activación (5 min):** «¿Qué imprime?»: `for letra in "hola": print(letra)`.
1. **Ejemplo resuelto en vivo (10 min):** Escribe «Frutas favoritas» en el editor y ejecútalo paso a paso; observa la variable `fruta`. Compara con recorrer usando posiciones.
1. **Práctica guiada (10 min):** Micro-retos (saludar, invitados, suma y máximo) en parejas.
1. **Reto principal (25 min):** Promedio y sorteo. Explica que el verificador fija el resultado del sorteo para poder revisarlo.
1. **Cierre (10 min):** Ticket de salida. Insignia «Coleccionista de listas» para quien superó los retos de las sesiones 11 y 12.

**Reto principal:** Promedio de calificaciones y sorteo

**Ticket de salida:** ¿Qué número se muestra? (respuesta: A)

## Sesión 13. Crear instrucciones propias

**Unidad:** Funciones · **Modo de trabajo:** 3 · **Python:** `def`, `parámetros`

**Objetivos:**
- Definir funciones propias con `def`.
- Usar **parámetros** para que una función trabaje con distintos datos.
- Llamar una función las veces que haga falta.
- Organizar un programa en partes con nombre.

1. **Activación (5 min):** Recuerda «Mis bloques» de Scratch. Pregunta: ¿qué bloque inventarían si pudieran?
1. **Ejemplo resuelto en vivo (10 min):** Escribe «Bienvenida al club» y ejecútalo paso a paso: señala cuándo entra a la función y la tabla «Dentro de la función».
1. **Práctica guiada (10 min):** Micro-retos (línea, cuadrado, presentaciones) en parejas.
1. **Reto principal (25 min):** Fábrica de saludos y marcos. Pide que prueben la función marco con distintos textos.
1. **Cierre (10 min):** Una persona explica la diferencia entre definir y llamar. Ticket de salida.

**Reto principal:** Fábrica de saludos y marcos

**Ticket de salida:** ¿Qué se muestra? (respuesta: A)

## Sesión 14. Funciones que responden

**Unidad:** Funciones · **Modo de trabajo:** 3 · **Python:** `return`, `descomposición`

**Objetivos:**
- Devolver un resultado con `return`.
- Distinguir entre mostrar (`print`) y devolver (`return`).
- Usar el valor que devuelve una función en cuentas, variables y condiciones.
- Descomponer un programa en funciones pequeñas.

1. **Activación (5 min):** «¿Qué imprime?»: una función con print y otra con return usadas en una suma. Discute por qué una da None.
1. **Ejemplo resuelto en vivo (10 min):** Escribe «Áreas de rectángulos» y ejecútalo paso a paso. Muestra la animación de la máquina (función).
1. **Práctica guiada (10 min):** Micro-retos (doble, es par, mayor de dos) en parejas.
1. **Reto principal (25 min):** Rehacer el quiz con funciones. Compara en voz alta cuántas líneas tenía el quiz de la Sesión 7 y cuántas tiene ahora.
1. **Cierre (10 min):** Ticket de salida. Insignia «Arquitecto de funciones» para quien superó los retos de las sesiones 13 y 14. Anuncia el proyecto final.

**Reto principal:** Rehacer el quiz con funciones

**Ticket de salida:** ¿Qué número se muestra? (respuesta: A)

## Sesión 15. Proyecto final: diseño y programación

**Unidad:** Proyecto final · **Modo de trabajo:** 4 · **Python:** `integra todo el curso`

**Objetivos:**
- Diseñar un programa propio: elegir la idea, planear sus partes y escribirlo en Python.
- Integrar `input()`, decisiones con `elif`, bucles, listas y funciones.
- Probar el programa con distintos datos y corregir errores.
- Preparar la presentación del proyecto.

1. **Activación (5 min):** Recuerda la Sesión 0: juega otra vez «Piedra, papel o tijera» y pregunta qué conceptos del curso reconocen ahora en el código.
1. **Ejemplo resuelto en vivo (5 min):** Muestra cómo planear: idea en una frase, descomposición en funciones y pseudocódigo, usando una de las opciones como ejemplo.
1. **Práctica guiada (10 min):** Cada alumno elige opción y escribe en su cuaderno la idea, las partes y el pseudocódigo. Validación rápida del docente.
1. **Reto principal (35 min):** Programación del proyecto en modo 4 (el borrador en bloques está disponible). La lista de cotejo se marca sola.
1. **Cierre (5 min):** Cada alumno descarga su .py y anota qué le falta. Ticket de salida.

*Notas:* Si el proyecto requiere más tiempo, puede continuarse en casa o en una sesión adicional. La rúbrica está en el Panel docente.

**Reto principal:** Proyecto final

**Ticket de salida:** ¿Cuál de estos **no** es uno de los 5 requisitos mínimos del proyecto? (respuesta: A)

## Sesión 16. Presentación de proyectos

**Unidad:** Proyecto final · **Modo de trabajo:** 4 · **Python:** —

**Objetivos:**
- Presentar tu proyecto y explicar cómo funciona tu código.
- Evaluar con la rúbrica el proyecto de un compañero o compañera, con respeto y con sugerencias útiles.
- Responder la prueba final y comparar con tu prueba diagnóstica.

1. **Activación (5 min):** Organiza el orden de presentaciones y explica los 4 pasos para presentar.
1. **Ejemplo resuelto en vivo (5 min):** Presenta tú primero un proyecto de ejemplo en 3 minutos, siguiendo los 4 pasos, para modelar.
1. **Práctica guiada (30 min):** Presentaciones (3 minutos cada una). El grupo coevalúa en la plataforma con la rúbrica.
1. **Reto principal (15 min):** Prueba final individual (las mismas 10 preguntas de la Sesión 0). Al terminar, cada quien ve su comparación.
1. **Cierre (5 min):** Cada alumno descarga su archivo de progreso y lo entrega. Desde el Panel docente consolidas los archivos para el reporte del grupo (avance diagnóstica → final).

*Notas:* Si el grupo es grande, divide las presentaciones en dos sesiones o en mesas simultáneas.

