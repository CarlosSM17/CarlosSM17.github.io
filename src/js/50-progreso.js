/* =========================================================================
 * 50-progreso.js — Progreso del alumno guardado en el dispositivo.
 * Incluye exportar/importar (archivo o código para copiar), resumen para
 * entregar y el cálculo de la calificación propuesta.
 * ========================================================================= */
'use strict';

PB.progreso = (() => {
  const VERSION = 1;
  const NIVELES = ['explorador', 'programador', 'maestro'];
  const ESTRELLAS = { explorador: 1, programador: 2, maestro: 3 };
  let clave = 'pb:progreso';
  let datos = null;
  let alCambiar = [];

  function vacio() {
    return {
      version: VERSION, curso: PB.config.idCurso, alumno: { nombre: '', grupo: '' },
      creado: PB.util.hoyISO(), actualizado: PB.util.hoyISO(),
      retos: {}, borradores: {}, respuestas: {}, pruebas: {}, coevaluaciones: [], insignias: {}, pasos: {}, ejecuciones: {}
    };
  }

  function cargar() {
    clave = 'pb:progreso:' + PB.config.idCurso;
    datos = PB.almacen.leer(clave, null);
    if (!datos || datos.version !== VERSION) datos = Object.assign(vacio(), datos || {});
    for (const k of ['retos', 'borradores', 'respuestas', 'pruebas', 'insignias', 'pasos', 'ejecuciones']) datos[k] = datos[k] || {};
    datos.coevaluaciones = datos.coevaluaciones || [];
    return datos;
  }

  const guardarYa = () => {
    datos.actualizado = PB.util.hoyISO();
    PB.almacen.escribir(clave, datos);
  };
  const guardarPronto = PB.util.debounce(guardarYa, 400);

  function guardar(inmediato) {
    if (inmediato) guardarYa(); else guardarPronto();
    for (const fn of alCambiar) { try { fn(); } catch (e) { /* nada */ } }
  }

  /* ---------- Alumno ---------- */
  const alumno = () => datos.alumno;
  function fijarAlumno(nombre, grupo) {
    datos.alumno = { nombre: nombre.trim(), grupo: (grupo || '').trim() };
    guardar(true);
  }

  /* ---------- Retos ---------- */
  function estadoReto(id) {
    return datos.retos[id] || { niveles: {}, intentos: 0 };
  }
  function sumarIntento(id) {
    const e = datos.retos[id] = estadoReto(id);
    e.intentos = (e.intentos || 0) + 1;
    guardar();
  }
  /** Marca un reto como superado. Devuelve {nuevo: bool, mejora: bool}. */
  function marcarReto(id, nivel = 'programador', modo = null) {
    const e = datos.retos[id] = estadoReto(id);
    e.niveles = e.niveles || {};
    const antes = mejorNivel(id);
    const nuevo = !e.niveles[nivel];
    if (nuevo) e.niveles[nivel] = PB.util.hoyISO();
    if (modo) e.modo = Math.max(e.modo || 0, modo);
    e.superado = true;
    guardar(true);
    const despues = mejorNivel(id);
    return { nuevo, mejora: (ESTRELLAS[despues] || 0) > (ESTRELLAS[antes] || 0) };
  }
  function mejorNivel(id) {
    const e = datos.retos[id];
    if (!e || !e.niveles) return null;
    let mejor = null;
    for (const n of NIVELES) if (e.niveles[n]) mejor = n;
    return mejor;
  }
  const superado = (id) => !!(datos.retos[id] && datos.retos[id].superado);

  /* ---------- Borradores de código ---------- */
  const borrador = (k) => datos.borradores[k];
  function guardarBorrador(k, valor) {
    if (valor === null) delete datos.borradores[k]; else datos.borradores[k] = valor;
    guardar();
  }

  /* ---------- Respuestas (predicción, puente, ticket, autoevaluación) ---------- */
  const respuesta = (k) => datos.respuestas[k];
  function responder(k, valor) {
    datos.respuestas[k] = Object.assign({ fecha: PB.util.hoyISO() }, valor);
    guardar(true);
  }

  /* ---------- Pruebas diagnóstica y final ---------- */
  const prueba = (tipo) => datos.pruebas[tipo];
  function guardarPrueba(tipo, valor) {
    datos.pruebas[tipo] = Object.assign({ fecha: PB.util.hoyISO() }, valor);
    guardar(true);
  }

  /* ---------- Coevaluaciones ---------- */
  function agregarCoevaluacion(c) {
    datos.coevaluaciones.push(Object.assign({ fecha: PB.util.hoyISO() }, c));
    guardar(true);
  }

  /* ---------- Pasos vistos de cada sesión ---------- */
  function marcarPaso(sesion, paso) {
    const p = datos.pasos[sesion] = datos.pasos[sesion] || {};
    if (!p[paso]) { p[paso] = PB.util.hoyISO(); guardar(); }
  }
  const pasoVisto = (sesion, paso) => !!(datos.pasos[sesion] && datos.pasos[sesion][paso]);

  /** Recuerda que un código se ejecutó completo sin errores (para proyectos). */
  function registrarEjecucion(id, codigo, ok) {
    datos.ejecuciones[id] = { huella: huella(codigo), ok, fecha: PB.util.hoyISO() };
    guardar();
  }
  function ejecucionOk(id, codigo) {
    const e = datos.ejecuciones[id];
    return !!(e && e.ok && e.huella === huella(codigo));
  }
  function huella(s) {
    let h = 0;
    const t = String(s).replace(/\s+/g, ' ').trim();
    for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) | 0;
    return h;
  }

  /* ---------- Estrellas e insignias ---------- */
  function estrellasSesion(sesion) {
    if (!sesion.reto) return 0;
    if (sesion.reto.tipo === 'proyecto') return superado(sesion.reto.id) ? 3 : 0;
    return ESTRELLAS[mejorNivel(sesion.reto.id)] || 0;
  }

  /** Revisa las insignias de unidad; devuelve las recién ganadas. */
  function revisarInsignias() {
    const nuevas = [];
    for (const u of PB.curso.unidades) {
      if (!u.insignia) continue;
      const sesiones = PB.curso.sesiones.filter(s => s.unidad === u.numero && s.reto);
      if (!sesiones.length) continue;
      const completa = sesiones.every(s => superado(s.reto.id));
      if (completa && !datos.insignias[u.numero]) {
        datos.insignias[u.numero] = PB.util.hoyISO();
        nuevas.push(u);
      }
    }
    if (nuevas.length) guardar(true);
    return nuevas;
  }
  const tieneInsignia = (unidad) => !!datos.insignias[unidad];

  /* ---------- Calificación propuesta ---------- */
  function calificacion() {
    const cfg = PB.config.evaluacion;
    const sesiones = PB.curso.sesiones;
    // Retos principales (sin proyectos)
    const conReto = sesiones.filter(s => s.reto && s.reto.tipo !== 'proyecto');
    let puntos = 0;
    for (const s of conReto) {
      const n = mejorNivel(s.reto.id);
      if (n === 'programador' || n === 'maestro') puntos += 1;
      else if (n === 'explorador') puntos += cfg.creditoExplorador;
    }
    const retos = conReto.length ? (puntos / conReto.length) * 100 : 0;
    const mini = requisitosProyecto(cfg.sesionMiniProyecto);
    const final = requisitosProyecto(cfg.sesionProyectoFinal);
    // Tickets de salida correctos
    const conTicket = sesiones.filter(s => s.ticket);
    const correctos = conTicket.filter(s => (respuesta('ticket:' + s.numero) || {}).correcta).length;
    const contestados = conTicket.filter(s => respuesta('ticket:' + s.numero)).length;
    const tickets = conTicket.length ? (correctos / conTicket.length) * 100 : 0;
    const total = (retos * cfg.pesos.retos + mini.porcentaje * cfg.pesos.miniProyecto + final.porcentaje * cfg.pesos.proyectoFinal + tickets * cfg.pesos.tickets) / 100;
    return {
      retos: Math.round(retos), mini, final, tickets: Math.round(tickets), ticketsContestados: contestados, ticketsTotal: conTicket.length,
      total: Math.round(total), pesos: cfg.pesos
    };
  }

  function requisitosProyecto(numSesion) {
    const s = PB.curso.sesiones.find(x => x.numero === numSesion);
    if (!s || !s.reto) return { cumplidos: 0, total: 0, porcentaje: 0, entregado: false };
    const e = estadoReto(s.reto.id);
    const cumplidos = e.requisitosCumplidos || 0;
    const total = e.requisitosTotal || ((s.reto.requiere || []).length + 1);
    return { cumplidos, total, porcentaje: total ? Math.round((cumplidos / total) * 100) : 0, entregado: !!e.superado };
  }
  function guardarRequisitos(id, cumplidos, total) {
    const e = datos.retos[id] = estadoReto(id);
    e.requisitosCumplidos = Math.max(e.requisitosCumplidos || 0, cumplidos);
    e.requisitosTotal = total;
    guardar();
  }

  /* ---------- Exportar / importar ---------- */
  function exportar(conBorradores = true) {
    const copia = PB.util.clonar(datos);
    if (!conBorradores) delete copia.borradores;
    return JSON.stringify(copia, null, 1);
  }

  function codigoProgreso() {
    const json = exportar(false);
    const b64 = btoa(unescape(encodeURIComponent(json)));
    return 'PB1:' + b64;
  }

  function leerExterno(texto) {
    let t = String(texto).trim();
    if (t.startsWith('PB1:')) t = decodeURIComponent(escape(atob(t.slice(4))));
    const d = JSON.parse(t);
    if (!d || typeof d !== 'object' || !d.retos) throw new Error('No es un archivo de progreso.');
    return d;
  }

  /** Combina un progreso externo con el actual (se queda con lo mejor). */
  function importar(texto) {
    const ext = leerExterno(texto);
    if (!datos.alumno.nombre && ext.alumno) datos.alumno = ext.alumno;
    for (const [id, e] of Object.entries(ext.retos || {})) {
      const mio = datos.retos[id] = estadoReto(id);
      mio.niveles = Object.assign({}, e.niveles || {}, mio.niveles || {});
      mio.superado = mio.superado || e.superado;
      mio.intentos = Math.max(mio.intentos || 0, e.intentos || 0);
      mio.modo = Math.max(mio.modo || 0, e.modo || 0);
      if (e.requisitosCumplidos) {
        mio.requisitosCumplidos = Math.max(mio.requisitosCumplidos || 0, e.requisitosCumplidos);
        mio.requisitosTotal = e.requisitosTotal;
      }
    }
    for (const k of ['respuestas', 'pruebas', 'insignias', 'borradores', 'ejecuciones']) {
      datos[k] = Object.assign({}, ext[k] || {}, datos[k] || {});
    }
    for (const [s, p] of Object.entries(ext.pasos || {})) datos.pasos[s] = Object.assign({}, p, datos.pasos[s] || {});
    const vistas = new Set(datos.coevaluaciones.map(c => c.fecha));
    for (const c of ext.coevaluaciones || []) if (!vistas.has(c.fecha)) datos.coevaluaciones.push(c);
    guardar(true);
    return ext;
  }

  function reiniciar() {
    datos = vacio();
    guardar(true);
  }

  /* ---------- Resumen para entregar ---------- */
  function resumenTexto() {
    const a = datos.alumno;
    const cal = calificacion();
    const L = [];
    L.push(`${PB.config.nombreCurso}`);
    L.push(`Alumno: ${a.nombre || '(sin nombre)'}${a.grupo ? ' · Grupo: ' + a.grupo : ''}`);
    L.push(`Fecha: ${PB.util.fechaCorta(PB.util.hoyISO())}`);
    L.push('');
    L.push('RETOS PRINCIPALES');
    for (const s of PB.curso.sesiones) {
      if (!s.reto) continue;
      let estado;
      if (s.reto.tipo === 'proyecto') {
        const e = estadoReto(s.reto.id);
        estado = e.superado ? `entregado (requisitos ${e.requisitosCumplidos || 0}/${e.requisitosTotal || '?'})` : (e.requisitosCumplidos ? `en proceso (${e.requisitosCumplidos}/${e.requisitosTotal})` : 'pendiente');
      } else {
        const n = mejorNivel(s.reto.id);
        estado = n ? `superado · nivel ${n} ${'★'.repeat(ESTRELLAS[n])}` : 'pendiente';
      }
      L.push(`  Sesión ${s.numero}. ${s.reto.titulo}: ${estado}`);
    }
    L.push('');
    L.push('TICKETS DE SALIDA');
    for (const s of PB.curso.sesiones) {
      if (!s.ticket) continue;
      const r = respuesta('ticket:' + s.numero);
      L.push(`  Sesión ${s.numero}: ${r ? (r.correcta ? 'correcto' : 'incorrecto') + (r.comentario ? ' · «' + r.comentario + '»' : '') : 'sin contestar'}`);
    }
    const diag = prueba('diagnostica'), fin = prueba('final');
    L.push('');
    L.push('PRUEBAS DE LECTURA DE CÓDIGO');
    L.push(`  Diagnóstica: ${diag ? diag.puntaje + '/' + diag.total : 'sin presentar'}`);
    L.push(`  Final: ${fin ? fin.puntaje + '/' + fin.total : 'sin presentar'}`);
    if (datos.coevaluaciones.length) {
      L.push('');
      L.push('COEVALUACIONES REALIZADAS');
      for (const c of datos.coevaluaciones) L.push(`  A ${c.companero}: ${Object.entries(c.criterios || {}).map(([k, v]) => k + ' ' + v).join(', ')}`);
    }
    L.push('');
    L.push('INSIGNIAS: ' + (PB.curso.unidades.filter(u => tieneInsignia(u.numero)).map(u => u.insignia).join(', ') || 'ninguna todavía'));
    L.push('');
    L.push('CALIFICACIÓN ESTIMADA (la definitiva la asigna el docente)');
    L.push(`  Retos de la plataforma (${cal.pesos.retos} %): ${cal.retos}`);
    L.push(`  Mini-proyecto (${cal.pesos.miniProyecto} %): requisitos ${cal.mini.cumplidos}/${cal.mini.total}`);
    L.push(`  Proyecto final (${cal.pesos.proyectoFinal} %): requisitos ${cal.final.cumplidos}/${cal.final.total} (se evalúa con rúbrica)`);
    L.push(`  Tickets de salida (${cal.pesos.tickets} %): ${cal.tickets}`);
    L.push(`  Estimado: ${cal.total}/100`);
    return L.join('\n');
  }

  return {
    cargar, guardar, alumno, fijarAlumno,
    estadoReto, sumarIntento, marcarReto, mejorNivel, superado,
    borrador, guardarBorrador, respuesta, responder, prueba, guardarPrueba, agregarCoevaluacion,
    marcarPaso, pasoVisto, registrarEjecucion, ejecucionOk,
    estrellasSesion, revisarInsignias, tieneInsignia, calificacion, guardarRequisitos,
    exportar, codigoProgreso, leerExterno, importar, reiniciar, resumenTexto,
    alCambiar: (fn) => alCambiar.push(fn),
    get datos() { return datos; },
    NIVELES, ESTRELLAS
  };
})();
