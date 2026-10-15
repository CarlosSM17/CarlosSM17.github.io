/* Banco de pruebas que corre dentro del navegador (lo usa probar_plataforma.py).
 * Para cada reto comprueba, con Skulpt:
 *   1. que la solución de referencia pasa sus casos de prueba;
 *   2. que la solución convertida a bloques y regenerada en Python también pasa;
 *   3. que el código inicial se puede convertir a bloques y NO pasa por sí solo.
 * También ejecuta los ejemplos y revisa la prueba de lectura. */
(async function () {
  const salida = { pruebas: 0, retos: 0, fallos: [], avisos: [], tiempo: 0 };
  const t0 = Date.now();
  const fallo = (m) => salida.fallos.push(m);
  const aviso = (m) => salida.avisos.push(m);
  const sinHuecos = (c) => c.replace(/«([^»]*)»/g, (_, t) => t || '___');
  try {
    PB.blockly.configurar();
    PB.progreso.cargar();
    const ws = new Blockly.Workspace();
    const regenerar = (codigo) => { PB.conv.cargar(ws, codigo); return PB.gen.generar(ws); };

    for (const s of PB.curso.sesiones) {
      const donde = 'S' + s.numero;
      for (const t of s.teoria || []) {
        if (t.tipo === 'bloques' || t.tipo === 'codigo') {
          const d = PB.py.revisarSintaxis(t.codigo);
          if (d) fallo(`${donde} teoría: ${d.mensaje} (línea ${d.linea})`);
          else if (t.tipo === 'bloques') { try { regenerar(t.codigo); } catch (e) { fallo(`${donde} teoría bloques: ${e.message}`); } }
        }
      }
      for (const p of s.puente || []) if (p.bloques) { try { regenerar(p.bloques); } catch (e) { fallo(`${donde} puente: ${e.message}`); } }
      if (s.ejemplo) {
        try {
          const g = regenerar(s.ejemplo.codigo);
          const r = await PB.ejecutor.ejecutar(g.codigo, { entradas: s.ejemplo.entradasPrueba || [], azar: s.ejemplo.azarPrueba || [] });
          if (r.error) fallo(`${donde} ejemplo: ${r.error.tipo} ${r.error.mensaje}`);
        } catch (e) { fallo(`${donde} ejemplo: ${e.message}`); }
      }
      const retos = [];
      for (const m of s.microretos || []) retos.push(['micro', m, null]);
      if (s.reto && s.reto.tipo !== 'proyecto') for (const n of ['explorador', 'programador', 'maestro']) if (s.reto.niveles && s.reto.niveles[n]) retos.push(['reto', s.reto, n]);
      if (s.reto && s.reto.tipo === 'proyecto') {
        for (const op of s.reto.opciones || []) {
          if (op.inicio) { const d = PB.py.revisarSintaxis(sinHuecos(op.inicio)); if (d) fallo(`${donde} proyecto ${op.id} inicio: ${d.mensaje}`); }
          if (op.solucion) {
            const rq = PB.verificador.revisarRestricciones(op.solucion, s.reto.requiere || []);
            const malos = rq.filter(x => !x.ok);
            if (malos.length) fallo(`${donde} proyecto ${op.id}: la solución no cumple ${malos.map(x => x.texto).join(', ')}`);
            if (op.entradasPrueba) {
              const r = await PB.ejecutor.ejecutar(op.solucion, { entradas: op.entradasPrueba, azar: op.azarPrueba || [] });
              if (r.error) fallo(`${donde} proyecto ${op.id}: ${r.error.tipo} ${r.error.mensaje} línea ${r.error.linea}`);
            }
          }
        }
      }
      if (s.extra) retos.push(['extra', s.extra, null]);

      for (const [tipo, reto, nivel] of retos) {
        salida.retos++;
        const etiqueta = `${donde} ${reto.id}${nivel ? ' ' + nivel : ''}`;
        const n = (reto.niveles && nivel && reto.niveles[nivel]) || {};
        const sol = n.solucion || reto.solucion;
        const inicio = n.inicio !== undefined ? n.inicio : (reto.inicio || '');
        const cfg = PB.verificador.configuracion(reto, nivel);
        salida.pruebas += cfg.pruebas.length;
        const modoBloques = (reto.modo || s.modo) <= 2;
        if (sol) {
          const r = await PB.verificador.verificar(sol, reto, nivel);
          if (!r.ok) fallo(`${etiqueta}: la solución NO pasa en Skulpt → ${resumen(r)}`);
          let g;
          try {
            const conv = PB.conv.aBloques(sol);
            if (conv.libres && modoBloques) aviso(`${etiqueta}: la solución usa ${conv.libres} pieza(s) de Python libre en bloques`);
            g = regenerar(sol);
          } catch (e) { fallo(`${etiqueta}: la solución no se convierte a bloques: ${e.message}`); }
          if (g) {
            const r2 = await PB.verificador.verificar(g.codigo, reto, nivel);
            if (!r2.ok) fallo(`${etiqueta}: la solución regenerada desde bloques NO pasa → ${resumen(r2)}\n${g.codigo}`);
          }
        }
        if (inicio && inicio.trim()) {
          try { regenerar(inicio); } catch (e) { fallo(`${etiqueta}: el código inicial no se convierte a bloques: ${e.message}`); }
          const texto = sinHuecos(inicio);
          const d = PB.py.revisarSintaxis(texto);
          if (d) fallo(`${etiqueta}: el código inicial tiene error de sintaxis: ${d.mensaje} (línea ${d.linea})`);
          else if (cfg.pruebas.length) {
            const r = await PB.verificador.verificar(texto, reto, nivel);
            if (r.ok) aviso(`${etiqueta}: el código inicial ya pasa el reto`);
          }
        }
      }
    }

    // Prueba de lectura: la opción correcta debe coincidir con lo que muestra el código
    for (const [i, it] of PB.curso.prueba.items.entries()) {
      const r = await PB.ejecutor.ejecutar(it.codigo, { entradas: it.entradasPrueba || [] });
      if (r.error) { fallo(`Prueba de lectura ${i + 1}: ${r.error.tipo}`); continue; }
      if (it.verificarSalida === false) continue;
      const esperado = PB.util.normalizar(it.opciones[it.correcta]);
      const obtenido = PB.util.normalizar(r.salida.replace(it.quitarDeSalida || '', ''));
      if (!obtenido.endsWith(esperado)) fallo(`Prueba de lectura ${i + 1}: la opción correcta «${it.opciones[it.correcta]}» no coincide con la salida «${r.salida}»`);
    }
  } catch (e) {
    fallo('EXCEPCIÓN: ' + (e && e.stack || e));
  }
  salida.tiempo = Date.now() - t0;
  const pre = document.createElement('pre');
  pre.id = 'resultado-pruebas';
  pre.textContent = JSON.stringify(salida);
  document.body.appendChild(pre);

  function resumen(r) {
    if (r.sintaxis) return r.sintaxis.titulo + ': ' + r.sintaxis.texto;
    const partes = [];
    if (r.huecos) partes.push(r.huecos + ' huecos');
    for (const x of r.restricciones) if (!x.ok) partes.push('restricción: ' + x.texto);
    for (const p of r.pruebas) if (!p.ok) partes.push(p.nombre + ': ' + p.detalle + ' | salida: ' + JSON.stringify(p.salida));
    return partes.join(' · ');
  }
})();
