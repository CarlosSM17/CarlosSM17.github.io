# Instrumentos de evaluación

> Este archivo se genera automáticamente con `python construir.py` a partir de `contenido/` y `configuracion.json`.

## 1. Ponderación

| Componente | Peso | Evidencia |
|---|---|---|
| Retos de la plataforma | 40 % | Retos principales superados en nivel Programador o Maestro (Explorador cuenta 0.5 de crédito; se cambia en `configuracion.json`) |
| Mini-proyecto (Sesión 7) | 20 % | Quiz funcional, revisado con la lista de cotejo |
| Proyecto final (Sesiones 15 y 16) | 30 % | Programa en Python y presentación, evaluados con la rúbrica |
| Tickets de salida | 10 % | Respuesta de cierre de cada sesión |

La plataforma calcula una **calificación estimada** (Mi progreso) y el Panel docente consolida los archivos de progreso del grupo en una tabla descargable como CSV. La calificación definitiva la asigna el docente.

## 2. Insignias por unidad (motivan, no califican)

| Unidad | Insignia | Se gana al superar los retos principales de las sesiones |
|---|---|---|
| 1. Primeros pasos | 👣 Primeros pasos | 1, 2 |
| 2. Datos y texto | 🧰 Domador de datos | 3, 4 |
| 3. Decisiones | 🔀 Tomador de decisiones | 5, 6, 7 |
| 4. Repetición | 🔁 Maestro de bucles | 8, 9, 10 |
| 5. Listas | 🎒 Coleccionista de listas | 11, 12 |
| 6. Funciones | 🏗️ Arquitecto de funciones | 13, 14 |

## 3. Prueba diagnóstica (Sesión 0) y final (Sesión 16)

Los mismos 10 reactivos de lectura y predicción de código. La plataforma guarda ambos puntajes y muestra la comparación al alumno; el Panel docente calcula los promedios del grupo.

### Reactivo 1. Secuencia y salida

¿Qué aparece en la pantalla?

```python
print("Hola")
print("¿Cómo estás?")
print("Adiós")
```

- **A)** Hola ⏎ ¿Cómo estás? ⏎ Adiós ✔
- **B)** Hola
- **C)** Hola ¿Cómo estás? Adiós
- **D)** Adiós ⏎ ¿Cómo estás? ⏎ Hola

*Explicación:* Python ejecuta las instrucciones en orden, de arriba hacia abajo, y cada print escribe en un renglón nuevo.

### Reactivo 2. Variables

¿Qué número se muestra?

```python
x = 5
x = x + 3
print(x)
```

- **A)** 5
- **B)** 8 ✔
- **C)** x + 3
- **D)** 53

*Explicación:* Primero x vale 5; luego se calcula x + 3 = 8 y ese resultado se guarda de nuevo en x.

### Reactivo 3. Operaciones

¿Qué se muestra?

```python
a = 17
print(a // 5, a % 5)
```

- **A)** 3 2 ✔
- **B)** 3.4 2
- **C)** 3 3
- **D)** 2 3

*Explicación:* // es la división entera (17 entre 5 cabe 3 veces) y % es el residuo (sobran 2).

### Reactivo 4. Leer datos y tipos

Al ejecutar el programa escribes **12** y presionas Enter. ¿Qué se muestra después?

```python
edad = input("Edad: ")
print(edad + edad)
```

- **A)** 24
- **B)** 1212 ✔
- **C)** edadedad
- **D)** Error

*Explicación:* input() siempre devuelve texto. "12" + "12" une los textos: "1212". Para sumar habría que convertir con int().

### Reactivo 5. Decisiones

¿Qué se muestra?

```python
puntos = 7
if puntos >= 6:
    print("Aprobado")
else:
    print("Reprobado")
```

- **A)** Aprobado ✔
- **B)** Reprobado
- **C)** Aprobado y luego Reprobado
- **D)** Nada

*Explicación:* 7 >= 6 es True, así que se ejecuta solo el bloque del if.

### Reactivo 6. Varias opciones

¿Qué se muestra?

```python
t = 25
if t > 30:
    print("Calor")
elif t > 20 and t <= 30:
    print("Templado")
else:
    print("Frío")
```

- **A)** Calor
- **B)** Templado ✔
- **C)** Frío
- **D)** Templado y Frío

*Explicación:* 25 > 30 es False; luego 25 > 20 and 25 <= 30 es True, así que se muestra «Templado» y ya no se revisa el else.

### Reactivo 7. Repetir un número fijo de veces

¿Qué se muestra?

```python
for i in range(1, 4):
    print(i * 2)
```

- **A)** 2 ⏎ 4 ⏎ 6 ✔
- **B)** 1 ⏎ 2 ⏎ 3
- **C)** 2 ⏎ 4 ⏎ 6 ⏎ 8
- **D)** 0 ⏎ 2 ⏎ 4

*Explicación:* range(1, 4) da 1, 2 y 3 (el 4 no se incluye). Cada valor se multiplica por 2.

### Reactivo 8. Repetir mientras

¿Qué número se muestra al final?

```python
n = 1
while n < 20:
    n = n * 3
print(n)
```

- **A)** 9
- **B)** 27 ✔
- **C)** 20
- **D)** 18

*Explicación:* n pasa por 1, 3, 9 y 27. Cuando vale 27, la condición n < 20 es False y el bucle termina.

### Reactivo 9. Listas

¿Qué se muestra?

```python
colores = ["rojo", "verde", "azul"]
colores.append("negro")
print(colores[1], len(colores))
```

- **A)** rojo 4
- **B)** verde 3
- **C)** verde 4 ✔
- **D)** rojo 3

*Explicación:* Las posiciones empiezan en 0: colores[1] es "verde". Después de append la lista tiene 4 elementos.

### Reactivo 10. Funciones

¿Qué número se muestra?

```python
def doble(n):
    return n * 2

r = doble(3) + doble(1)
print(r)
```

- **A)** 6
- **B)** 8 ✔
- **C)** 4
- **D)** Error

*Explicación:* doble(3) devuelve 6 y doble(1) devuelve 2; 6 + 2 = 8.

## 4. Lista de cotejo del mini-proyecto (Sesión 7: Quiz de 5 preguntas con puntaje)

| Criterio | Sí | No |
|---|:---:|:---:|
| Tiene 5 preguntas con input(). | ☐ | ☐ |
| Cada pregunta revisa la respuesta con if / else. | ☐ | ☐ |
| Suma puntos con un contador (puntaje = puntaje + 1). | ☐ | ☐ |
| Muestra el puntaje final. | ☐ | ☐ |
| Muestra un mensaje final distinto según el puntaje (if / elif / else). | ☐ | ☐ |
| Funciona sin errores. | ☐ | ☐ |
| Usa nombres de variables claros. | ☐ | ☐ |

La plataforma revisa automáticamente los criterios estructurales (5 input, 5 if, contador, elif) y que el programa se haya ejecutado completo sin errores.

## 5. Rúbrica del proyecto final (Sesión 15)

**Requisitos mínimos:** input(), una decisión con elif, un bucle, una lista y dos funciones propias (restricciones en la plataforma: `input, elif, for|while, lista, def*2`).

| Criterio | Inicial (1) | En desarrollo (2) | Logrado (3) | Destacado (4) |
|---|---|---|---|---|
| **Funcionamiento** | No se ejecuta | Se ejecuta, con errores frecuentes | Funciona en los casos normales | Funciona y maneja entradas inesperadas |
| **Uso de conceptos** | Cumple 1 o 2 requisitos | Cumple 3 o 4 | Cumple los 5 | Cumple los 5 y combina conceptos de forma original |
| **Legibilidad** | Nombres sin significado, sin comentarios | Algunos nombres claros | Nombres claros y comentarios útiles | Organizado en funciones bien nombradas |
| **Explicación** | No logra explicar su código | Explica partes con ayuda | Explica cómo funciona su programa | Explica sus decisiones y cómo lo mejoraría |

Puntaje: suma de los 4 criterios (4 a 16 puntos). Sugerencia de conversión: (puntos / 16) × 100.

Opciones de proyecto: Piedra, papel o tijera, Aventura de texto, Quiz temático, Mascota virtual.

## 6. Tickets de salida

| Sesión | Pregunta | Respuesta correcta |
|---|---|---|
| 0 | En esta plataforma, cada bloque que armas… | A) se convierte en una línea de Python |
| 1 | ¿Qué aparece en la pantalla? `# print("A") ⏎ print("B") ⏎ print("C")` | B) B ⏎ C |
| 2 | ¿Qué se muestra? `a = 7 ⏎ b = 2 ⏎ print(a // b, a % b)` | A) 3 1 |
| 3 | Al ejecutar escribes **5**. ¿Qué se muestra? `x = input("Número: ") ⏎ print(x * 3)` | B) 555 |
| 4 | ¿Qué número se muestra? `s = "Hola" ⏎ print(len(s + "!"))` | A) 5 |
| 5 | ¿Qué se muestra? `x = 5 ⏎ print(x == 5, x > 7)` | A) True False |
| 6 | ¿Qué se muestra? `n = 15 ⏎ if n > 10 and n < 12: ⏎     print("A") ⏎ elif n > 10 or n < 0: ⏎     print("B") ⏎ else: ⏎     print("C")` | B) B |
| 7 | ¿Qué número se muestra? `puntos = 3 ⏎ respuesta = "b" ⏎ if respuesta == "a": ⏎     puntos = puntos + 1 ⏎ else: ⏎     puntos = puntos - 1 ⏎ print(puntos)` | A) 2 |
| 8 | ¿Cuántas veces aparece «Hola»? `for i in range(3): ⏎     print("Hola") ⏎ print("Adiós")` | A) 3 |
| 9 | ¿Qué número se muestra? `x = 10 ⏎ while x > 4: ⏎     x = x - 3 ⏎ print(x)` | B) 4 |
| 10 | ¿Qué número se muestra? `s = 0 ⏎ for i in range(1, 4): ⏎     s += i ⏎ print(s)` | A) 6 |
| 11 | ¿Qué número se muestra? `l = [10, 20, 30] ⏎ l.append(40) ⏎ print(l[1] + l[3])` | A) 60 |
| 12 | ¿Qué número se muestra? `n = [3, 8, 1] ⏎ t = 0 ⏎ for x in n: ⏎     if x > 2: ⏎         t = t + x ⏎ print(t)` | A) 11 |
| 13 | ¿Qué se muestra? `def mensaje(t): ⏎     print(t + "!") ⏎  ⏎ mensaje("Hola") ⏎ mensaje("Adiós")` | A) Hola! ⏎ Adiós! |
| 14 | ¿Qué número se muestra? `def f(n): ⏎     return n + 1 ⏎  ⏎ print(f(f(2)))` | A) 4 |
| 15 | ¿Cuál de estos **no** es uno de los 5 requisitos mínimos del proyecto? | A) Usar random |

