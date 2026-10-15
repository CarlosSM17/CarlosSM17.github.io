/* =========================================================================
 * 64-vistas.js — Pantallas: inicio, sesión (con sus pasos), glosario,
 * mi progreso y panel docente.
 * ========================================================================= */
'use strict';

(() => {
  const { el, vaciar, esc } = PB.util;
  const V = PB.vistas;
  const NOMBRES_MODO = { 1: 'Bloques', 2: 'Completar', 3: 'Con apoyo', 4: 'Libre' };
  const ir = (ruta) => PB.app.ir(ruta);

  const unidadDe = (s) => PB.curso.unidades.find(u => u.numero === s.unidad) || { nombre: '', color: '#888' };

  function pasosDe(s) {
    const p = [{ id: 'teoria', nombre: 'Historia y teoría', icono: '📖' }];
    if (s.ejemplo) p.push({ id: 'ejemplo', nombre: s.ejemplo.nombrePaso || 'Ejemplo resuelto', icono: '🔍' });
    if (s.microretos && s.microretos.length) p.push({ id: 'micro', nombre: 'Micro-retos', icono: '🧩' });
    if (s.reto) p.push({ id: 'reto', nombre: s.reto.tipo === 'proyecto' ? (s.reto.nombrePaso || 'Proyecto') : 'Reto principal', icono: s.reto.tipo === 'proyecto' ? '🚀' : '🏆' });
    if (s.extra) p.push({ id: 'extra', nombre: 'Reto extra', icono: '⭐' });
    if (s.coevaluacion) p.push({ id: 'coevaluacion', nombre: 'Coevaluación', icono: '🤝' });
    if (s.prueba) p.push({ id: 'prueba', nombre: s.prueba === 'diagnostica' ? 'Prueba diagnóstica' : 'Prueba final', icono: '📝' });
    p.push({ id: 'cierre', nombre: 'Cierre', icono: '🎯' });
    return p;
  }

  function estrellas(n, total = 3) {
    return el('span', { class: 'estrellas', 'aria-label': `${n} de ${total} estrellas` }, ...Array.from({ length: total }, (_, i) => el('span', { class: i < n ? 'llena' : '' }, '★')));
  }

  function chipModo(m) {
    return el('span', { class: 'chip chip-modo modo-' + m, title: 'Modo de trabajo' }, `Modo ${m} · ${NOMBRES_MODO[m]}`);
  }

  /* ================================================================ *
   * INICIO
   * ================================================================ */
  V.inicio = function (main) {
    const a = PB.progreso.alumno();
    const cal = PB.progreso.calificacion();
    const conReto = PB.curso.sesiones.filter(s => s.reto);
    const hechos = conReto.filter(s => PB.progreso.superado(s.reto.id)).length;

    const cab = el('section', { class: 'inicio-cabeza' },
      el('div', {},
        el('h1', {}, a.nombre ? `¡Hola, ${a.nombre}!` : '¡Bienvenida, bienvenido!'),
        el('p', { class: 'lema' }, PB.config.lema),
        el('div', { class: 'barra-progreso', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(conReto.length), 'aria-valuenow': String(hechos) },
          el('div', { class: 'barra-relleno', style: { width: (conReto.length ? (hechos / conReto.length) * 100 : 0) + '%' } })),
        el('p', { class: 'nota' }, `${hechos} de ${conReto.length} retos principales superados`)),
      el('div', { class: 'insignias-fila' }, ...PB.curso.unidades.filter(u => u.insignia).map(u => {
        const c = el('div', { class: 'insignia-item' }, PB.comp.insigniaSVG(u, PB.progreso.tieneInsignia(u.numero), 54), el('span', {}, u.insignia));
        return c;
      })));
    main.appendChild(cab);

    const ultima = PB.almacen.leer('pb:ultima:' + PB.config.idCurso, null);
    if (ultima && PB.curso.sesiones.find(s => s.numero === ultima.sesion)) {
      const s = PB.curso.sesiones.find(x => x.numero === ultima.sesion);
      main.appendChild(el('a', { class: 'continuar', href: '#/s/' + s.numero + (ultima.paso ? '/' + ultima.paso : '') },
        el('span', { class: 'continuar-icono' }, '▶'), el('span', {}, el('small', {}, 'Continuar donde te quedaste'), el('strong', {}, `Sesión ${s.numero}: ${s.titulo}`))));
    }
    if (!PB.almacen.disponible) {
      main.appendChild(el('div', { class: 'aviso-almacen' }, '⚠ Este navegador no permite guardar tu progreso aquí. Antes de cerrar, ve a «Mi progreso» y exporta tu avance.'));
    }

    for (const u of PB.curso.unidades) {
      const sesiones = PB.curso.sesiones.filter(s => s.unidad === u.numero);
      if (!sesiones.length) continue;
      const sec = el('section', { class: 'unidad', style: { '--color-unidad': u.color } },
        el('div', { class: 'unidad-cabeza' },
          el('span', { class: 'unidad-icono' }, u.icono || '•'),
          el('div', {}, el('div', { class: 'unidad-num' }, u.numero > 0 && u.numero < 7 ? `Unidad ${u.numero}` : ''), el('h2', {}, u.nombre)),
          u.modos ? el('span', { class: 'nota' }, u.modos) : null));
      const rejilla = el('div', { class: 'rejilla-sesiones' });
      for (const s of sesiones) {
        const pasos = pasosDe(s);
        const vistos = pasos.filter(p => PB.progreso.pasoVisto(s.numero, p.id)).length;
        const n = PB.progreso.estrellasSesion(s);
        rejilla.appendChild(el('a', { class: 'tarjeta-sesion', href: '#/s/' + s.numero },
          el('div', { class: 'ts-num' }, String(s.numero)),
          el('div', { class: 'ts-cuerpo' },
            el('div', { class: 'ts-titulo' }, s.titulo),
            el('div', { class: 'ts-reto' }, s.reto ? (s.reto.tipo === 'proyecto' ? '🚀 ' : '🏆 ') + s.reto.titulo : (s.subtitulo || '')),
            el('div', { class: 'ts-pie' }, chipModo(s.modo), s.reto ? estrellas(n) : null,
              el('span', { class: 'ts-pasos', title: 'Pasos vistos' }, ...pasos.map(p => el('i', { class: PB.progreso.pasoVisto(s.numero, p.id) ? 'visto' : '' }))))),
          vistos === pasos.length ? el('span', { class: 'ts-hecho', title: 'Sesión completa' }, '✓') : null));
      }
      sec.appendChild(rejilla);
      main.appendChild(sec);
    }
    main.appendChild(el('p', { class: 'nota centro pie-inicio' }, `Calificación estimada hasta ahora: ${cal.total}/100 · Detalles en «Mi progreso».`));
  };

  /* ================================================================ *
   * SESIÓN
   * ================================================================ */
  V.sesion = function (main, num, paso, sub, sub2) {
    const s = PB.curso.sesiones.find(x => x.numero === num);
    if (!s) { main.appendChild(el('p', {}, 'No existe esa sesión.')); return; }
    const pasos = pasosDe(s);
    // Talleres: ocupan toda la pantalla
    if (sub !== undefined && ['micro', 'reto', 'extra', 'proyecto', 'ejemplo'].includes(paso)) {
      PB.almacen.escribir('pb:ultima:' + PB.config.idCurso, { sesion: num, paso: paso === 'proyecto' ? 'reto' : paso });
      abrirTaller(main, s, paso, sub, sub2, pasos);
      return;
    }
    if (!paso || !pasos.find(p => p.id === paso)) paso = pasos[0].id;
    PB.almacen.escribir('pb:ultima:' + PB.config.idCurso, { sesion: num, paso });

    PB.progreso.marcarPaso(num, paso);
    const u = unidadDe(s);
    const cab = el('section', { class: 'sesion-cabeza', style: { '--color-unidad': u.color } },
      el('a', { class: 'btn-icono volver', href: '#/', title: 'Volver al inicio', 'aria-label': 'Volver al inicio' }, '←'),
      el('div', { class: 'sesion-titulos' },
        el('div', { class: 'sesion-unidad' }, u.numero > 0 && u.numero < 7 ? `Unidad ${u.numero} · ${u.nombre}` : u.nombre),
        el('h1', {}, `Sesión ${s.numero}: ${s.titulo}`),
        el('div', { class: 'sesion-chips' }, chipModo(s.modo), ...(s.python || []).map(c => el('code', { class: 'chip chip-codigo' }, c)))),
      el('div', { class: 'sesion-navegacion' },
        num > 0 ? el('a', { class: 'btn btn-chico btn-suave', href: '#/s/' + (num - 1) }, '‹ Anterior') : null,
        num < PB.curso.sesiones.length - 1 ? el('a', { class: 'btn btn-chico btn-suave', href: '#/s/' + (num + 1) }, 'Siguiente ›') : null));
    main.appendChild(cab);

    const nav = el('nav', { class: 'pasos', 'aria-label': 'Pasos de la sesión' });
    pasos.forEach((p, i) => {
      nav.appendChild(el('a', {
        class: 'paso' + (p.id === paso ? ' activo' : '') + (PB.progreso.pasoVisto(num, p.id) ? ' visto' : ''),
        href: `#/s/${num}/${p.id}`, 'aria-current': p.id === paso ? 'step' : null
      }, el('span', { class: 'paso-num' }, String(i + 1)), el('span', { class: 'paso-icono' }, p.icono), el('span', { class: 'paso-nombre' }, p.nombre)));
    });
    main.appendChild(nav);

    const cont = el('section', { class: 'sesion-contenido paso-' + paso });
    main.appendChild(cont);
    const indice = pasos.findIndex(p => p.id === paso);
    const siguiente = pasos[indice + 1];
    const botonSiguiente = () => siguiente
      ? el('div', { class: 'siguiente-paso' }, el('a', { class: 'btn btn-primario', href: `#/s/${num}/${siguiente.id}` }, `Siguiente: ${siguiente.nombre} →`))
      : null;

    const renderers = { teoria: pasoTeoria, ejemplo: pasoEjemplo, micro: pasoMicro, reto: pasoReto, extra: pasoExtra, coevaluacion: pasoCoevaluacion, prueba: pasoPrueba, cierre: pasoCierre };
    renderers[paso](cont, s, botonSiguiente);
    if (PB.estado.docente && s.plan && paso === 'teoria') pintarPlan(cont, s);
  };

  function abrirTaller(main, s, paso, sub, sub2, pasos) {
    main.classList.add('con-taller');
    const volver = () => ir(`#/s/${s.numero}/${paso === 'proyecto' ? 'reto' : paso}`);
    let opciones = null;
    if (paso === 'micro') {
      const i = parseInt(sub, 10) - 1;
      const m = (s.microretos || [])[i];
      if (!m) { volver(); return; }
      const sig = s.microretos[i + 1];
      opciones = {
        sesion: s, reto: m, tipo: 'micro', etiqueta: `Micro-reto ${i + 1} de ${s.microretos.length}`,
        modo: m.modo, alVolver: volver,
        alSiguiente: () => ir(sig ? `#/s/${s.numero}/micro/${i + 2}` : `#/s/${s.numero}/${pasos.find(p => p.id === 'reto') ? 'reto' : 'cierre'}`)
      };
    } else if (paso === 'reto') {
      const nivel = ['explorador', 'programador', 'maestro'].includes(sub) ? sub : 'programador';
      opciones = {
        sesion: s, reto: s.reto, nivel, tipo: 'reto', alVolver: volver,
        alSiguiente: () => ir(`#/s/${s.numero}/${s.extra ? 'extra' : 'cierre'}`)
      };
    } else if (paso === 'proyecto') {
      const op = (s.reto.opciones || []).find(o => o.id === sub) || (s.reto.opciones || [])[0];
      opciones = {
        sesion: s, reto: s.reto, tipo: 'proyecto', claveExtra: op ? op.id : null, alVolver: volver,
        titulo: op ? op.titulo : s.reto.titulo, enunciado: op ? op.descripcion : null,
        codigoInicial: op ? op.inicio : (s.reto.inicio || ''), modo: s.modo
      };
    } else if (paso === 'extra') {
      opciones = { sesion: s, reto: s.extra, tipo: 'extra', alVolver: volver, alSiguiente: () => ir(`#/s/${s.numero}/cierre`) };
    } else if (paso === 'ejemplo') {
      opciones = {
        sesion: s, reto: { id: 'ejemplo-' + s.numero, titulo: 'Modifica el ejemplo: ' + s.ejemplo.titulo, enunciado: s.ejemplo.modificar || 'Cambia el programa y ejecútalo para ver qué pasa. Aquí no hay pruebas: ¡experimenta!' },
        tipo: 'libre', codigoInicial: s.ejemplo.codigo, alVolver: volver, etiqueta: 'Modificar (PRIMM)'
      };
    }
    const taller = new PB.Taller(main, opciones);
    PB.app.alSalir(() => taller.destruir());
  }

  /* ---------- Paso: teoría ---------- */
  function pasoTeoria(c, s, sig) {
    if (s.historia) c.appendChild(el('div', { class: 'historia-grande' }, el('span', { class: 'historia-icono' }, s.historiaIcono || '📜'), el('p', { html: s.historia })));
    if (s.objetivos && s.objetivos.length) {
      c.appendChild(el('div', { class: 'objetivos' }, el('h3', {}, 'Hoy vas a…'), el('ul', {}, ...s.objetivos.map(o => el('li', { html: o })))));
    }
    for (const t of s.teoria || []) {
      if (t.tipo === 'texto') c.appendChild(el('div', { class: 'teoria-texto', html: t.html }));
      else if (t.tipo === 'titulo') c.appendChild(el('h3', { class: 'teoria-titulo' }, t.texto));
      else if (t.tipo === 'analogia') c.appendChild(el('div', { class: 'analogia' }, el('div', { class: 'analogia-icono' }, t.icono || '💡'), el('div', {}, el('strong', {}, t.titulo || 'Imagina…'), el('div', { html: t.html }))));
      else if (t.tipo === 'codigo') PB.comp.codigoProbable(c, t.codigo, t.nota);
      else if (t.tipo === 'animacion') {
        const caja = el('div', { class: 'teoria-animacion' }, t.titulo ? el('h4', {}, t.titulo) : null);
        c.appendChild(caja);
        PB.comp.animacion(caja, t.animacion);
      } else if (t.tipo === 'comparacion') {
        const tabla = el('table', { class: 'tabla-comparacion' },
          el('thead', {}, el('tr', {}, el('th', {}, t.col1 || 'En Scratch'), el('th', {}, t.col2 || 'En Python'), t.filas.some(f => f.nota) ? el('th', {}, 'Nota') : null)));
        const tb = el('tbody');
        for (const f of t.filas) {
          tb.appendChild(el('tr', {}, el('td', { html: f.scratch }), el('td', {}, PB.bloqueCodigo(f.python)), t.filas.some(x => x.nota) ? el('td', { html: f.nota || '' }) : null));
        }
        tabla.appendChild(tb);
        c.appendChild(el('div', { class: 'tabla-scroll' }, t.titulo ? el('h4', {}, t.titulo) : null, tabla));
      } else if (t.tipo === 'bloques') {
        const caja = el('div', { class: 'teoria-bloques' }, t.titulo ? el('h4', {}, t.titulo) : null);
        const fila = el('div', { class: 'bloques-y-python' });
        caja.appendChild(fila);
        c.appendChild(caja);
        PB.comp.bloquesLectura(fila, t.codigo, { alto: t.alto || 170 });
        fila.appendChild(PB.bloqueCodigo(t.codigo, { numeros: true }));
        if (t.nota) caja.appendChild(el('p', { class: 'nota', html: t.nota }));
      }
    }
    if (s.fichas && s.fichas.length) {
      c.appendChild(el('h3', { class: 'teoria-titulo' }, '📑 Fichas de sintaxis'));
      c.appendChild(el('div', { class: 'fichas' }, ...s.fichas.map(f => el('div', { class: 'ficha' },
        el('div', { class: 'ficha-titulo' }, f.titulo), PB.bloqueCodigo(f.codigo), f.nota ? el('p', { class: 'nota', html: f.nota }) : null))));
    }
    if (s.glosario && s.glosario.length) {
      c.appendChild(el('h3', { class: 'teoria-titulo' }, '🔤 Glosario de la sesión'));
      c.appendChild(tablaGlosario(s.glosario));
    }
    c.appendChild(sig());
  }

  function tablaGlosario(items, conSesion) {
    const t = el('table', { class: 'tabla-glosario' },
      el('thead', {}, el('tr', {}, el('th', {}, 'Python / inglés'), el('th', {}, 'Español'), el('th', {}, '¿Qué es?'), conSesion ? el('th', {}, 'Sesión') : null)));
    const tb = el('tbody');
    for (const g of items) tb.appendChild(el('tr', {}, el('td', {}, el('code', {}, g.en)), el('td', {}, g.es), el('td', { html: g.def || '' }), conSesion ? el('td', {}, el('a', { href: '#/s/' + g.sesion }, String(g.sesion))) : null));
    t.appendChild(tb);
    return el('div', { class: 'tabla-scroll' }, t);
  }

  /* ---------- Paso: ejemplo resuelto (PRIMM: predecir, ejecutar, investigar) ---------- */
  function pasoEjemplo(c, s, sig) {
    const e = s.ejemplo;
    c.appendChild(el('h2', {}, e.titulo));
    if (e.descripcion) c.appendChild(el('p', { html: e.descripcion }));
    const primm = el('ol', { class: 'primm' },
      el('li', { class: 'activo' }, el('b', {}, 'Predice'), ' qué hará'),
      el('li', {}, el('b', {}, 'Ejecuta'), ' y compara'),
      el('li', {}, el('b', {}, 'Investiga'), ' cómo funciona'),
      el('li', {}, el('b', {}, 'Modifica'), ' el programa'),
      el('li', {}, el('b', {}, 'Crea'), ' el tuyo (retos)'));
    c.appendChild(primm);
    const visor = new PB.comp.Visor(c, { codigo: e.codigo, modo: s.modo, sesion: s });
    if (e.entradasSugeridas) c.insertBefore(el('p', { class: 'nota' }, '⌨ Cuando el programa te pida datos, prueba con: ' + e.entradasSugeridas), visor.raiz);
    const clave = 'prediccion:' + s.numero;
    if (e.prediccion) {
      const ya = PB.progreso.respuesta(clave);
      if (!ya && !PB.estado.docente) visor.bloquear(true, 'Primero predice qué va a pasar');
      const caja = el('div', { class: 'caja-prediccion' }, el('h3', {}, '🤔 Antes de ejecutar: ¿qué crees que pasará?'));
      c.insertBefore(caja, visor.raiz);
      PB.comp.pregunta(caja, e.prediccion, clave, {
        unaVez: false,
        alResponder: () => {
          visor.bloquear(false);
          primm.children[1].classList.add('activo');
        }
      });
      if (ya) primm.children[1].classList.add('activo');
    }
    if (e.investigar && e.investigar.length) {
      c.appendChild(el('div', { class: 'investigar' }, el('h3', {}, '🔎 Investiga'),
        el('ul', {}, ...e.investigar.map(q => el('li', { html: q })))));
    }
    c.appendChild(el('div', { class: 'modificar' },
      el('div', {}, el('h3', {}, '✏️ Modifica'), el('p', { html: e.modificar || 'Abre el ejemplo en el taller, cámbialo y observa qué pasa.' })),
      el('a', { class: 'btn btn-suave', href: `#/s/${s.numero}/ejemplo/taller` }, 'Abrir en el taller')));
    c.appendChild(sig());
  }

  /* ---------- Paso: micro-retos ---------- */
  function pasoMicro(c, s, sig) {
    c.appendChild(el('p', { class: 'intro-paso' }, 'Retos cortos de una sola idea. Practica antes del reto principal.'));
    const lista = el('div', { class: 'lista-micro' });
    s.microretos.forEach((m, i) => {
      const ok = PB.progreso.superado(m.id);
      lista.appendChild(el('a', { class: 'tarjeta-micro' + (ok ? ' hecho' : ''), href: `#/s/${s.numero}/micro/${i + 1}` },
        el('span', { class: 'tm-num' }, ok ? '✓' : String(i + 1)),
        el('span', { class: 'tm-cuerpo' }, el('strong', {}, m.titulo), el('span', { class: 'nota', html: m.resumen || '' })),
        el('span', { class: 'tm-ir' }, ok ? 'Repasar' : 'Empezar →')));
    });
    c.appendChild(lista);
    c.appendChild(sig());
  }

  /* ---------- Paso: reto principal (tres niveles) o proyecto ---------- */
  function pasoReto(c, s, sig) {
    const r = s.reto;
    c.appendChild(el('h2', {}, r.titulo));
    if (r.historia) c.appendChild(el('p', { class: 'historia' }, r.historia));
    if (r.enunciado && r.tipo === 'proyecto') c.appendChild(el('div', { class: 'tarea', html: r.enunciado }));
    if (r.tipo === 'proyecto') {
      const req = PB.verificador.revisarRestricciones('', r.requiere || []).map(x => x.texto);
      if (req.length) c.appendChild(el('div', { class: 'requisitos-caja' }, el('strong', {}, 'Requisitos mínimos:'), el('ul', { class: 'requisitos' }, ...req.map(t => el('li', {}, t)))));
      const ops = el('div', { class: 'opciones-proyecto' });
      for (const op of r.opciones || []) {
        ops.appendChild(el('a', { class: 'tarjeta-proyecto', href: `#/s/${s.numero}/proyecto/${op.id}` },
          el('div', { class: 'tp-icono' }, op.icono || '🚀'), el('strong', {}, op.titulo), el('p', { html: op.resumen || '' }), el('span', { class: 'btn btn-chico btn-primario' }, 'Elegir')));
      }
      c.appendChild(ops);
      const est = PB.progreso.estadoReto(r.id);
      if (est.requisitosCumplidos) c.appendChild(el('p', { class: 'nota' }, `Tu avance: ${est.requisitosCumplidos} de ${est.requisitosTotal} puntos de la lista de cotejo${est.superado ? ' · ¡entregado!' : ''}.`));
      if (PB.estado.docente && r.rubrica) c.appendChild(pintarRubrica(r.rubrica));
      c.appendChild(sig());
      return;
    }
    if (r.enunciado) c.appendChild(el('div', { class: 'tarea', html: r.enunciado }));
    const est = PB.progreso.estadoReto(r.id);
    const niveles = [
      { id: 'explorador', nombre: 'Explorador', estrellas: 1, desc: r.niveles?.explorador?.descripcion || 'Recibes parte del programa ya armado; completa las piezas que faltan.', para: 'Si todavía no dominas el tema.' },
      { id: 'programador', nombre: 'Programador', estrellas: 2, desc: r.niveles?.programador?.descripcion || 'Recibes el enunciado y la caja de herramientas; armas la solución completa.', para: 'Para la mayoría del grupo.' },
      { id: 'maestro', nombre: 'Maestro', estrellas: 3, desc: r.niveles?.maestro?.enunciado ? 'Todo lo del Programador y además: ' + r.niveles.maestro.enunciado : 'Un requisito adicional.', para: 'Si ya dominas el tema.' }
    ].filter(n => r.niveles && r.niveles[n.id]);
    const fila = el('div', { class: 'niveles' });
    for (const n of niveles) {
      const ok = est.niveles && est.niveles[n.id];
      fila.appendChild(el('a', { class: 'tarjeta-nivel nivel-' + n.id + (ok ? ' hecho' : ''), href: `#/s/${s.numero}/reto/${n.id}` },
        el('div', { class: 'tn-cabeza' }, estrellas(n.estrellas), el('strong', {}, n.nombre), ok ? el('span', { class: 'tn-ok' }, '✓ Superado') : null),
        el('p', { html: n.desc }), el('p', { class: 'nota' }, n.para),
        el('span', { class: 'btn btn-chico ' + (n.id === 'programador' ? 'btn-primario' : 'btn-suave') }, ok ? 'Repetir' : 'Empezar')));
    }
    c.appendChild(fila);
    c.appendChild(sig());
  }

  function pintarRubrica(rubrica) {
    const t = el('table', { class: 'tabla-rubrica' },
      el('thead', {}, el('tr', {}, el('th', {}, 'Criterio'), ...rubrica.niveles.map(n => el('th', {}, n)))));
    const tb = el('tbody');
    for (const cr of rubrica.criterios) tb.appendChild(el('tr', {}, el('td', {}, el('strong', {}, cr.nombre)), ...cr.descriptores.map(d => el('td', {}, d))));
    t.appendChild(tb);
    return el('details', { class: 'rubrica', open: true }, el('summary', {}, '🔑 Rúbrica (docente)'), el('div', { class: 'tabla-scroll' }, t));
  }

  /* ---------- Paso: reto extra ---------- */
  function pasoExtra(c, s, sig) {
    const x = s.extra;
    const ok = PB.progreso.superado(x.id);
    c.appendChild(el('div', { class: 'tarjeta-extra' + (ok ? ' hecho' : '') },
      el('div', { class: 'te-icono' }, '⭐'),
      el('div', {}, el('h2', {}, x.titulo), x.historia ? el('p', { class: 'historia' }, x.historia) : null, el('div', { html: x.enunciado || '' }),
        el('a', { class: 'btn btn-primario', href: `#/s/${s.numero}/extra/taller` }, ok ? 'Repasar' : 'Aceptar el reto'))));
    c.appendChild(el('p', { class: 'nota' }, 'El reto extra es opcional: es para quien terminó antes y quiere ir más lejos.'));
    c.appendChild(sig());
  }

  /* ---------- Paso: coevaluación ---------- */
  function pasoCoevaluacion(c, s, sig) {
    const co = s.coevaluacion;
    c.appendChild(el('h2', {}, co.titulo || 'Coevaluación'));
    c.appendChild(el('p', { html: co.instrucciones || '' }));
    const rub = co.rubrica || (PB.curso.sesiones.find(x => x.reto && x.reto.rubrica) || {}).reto?.rubrica;
    const form = el('div', { class: 'coeval' });
    const nombre = el('input', { class: 'campo', type: 'text', placeholder: 'Nombre de tu compañera o compañero' });
    const proyecto = el('input', { class: 'campo', type: 'text', placeholder: '¿Qué proyecto presentó?' });
    form.append(el('label', { class: 'campo-etiqueta' }, 'Evalúo a:'), nombre, el('label', { class: 'campo-etiqueta' }, 'Proyecto:'), proyecto);
    const elecciones = {};
    if (rub) {
      for (const cr of rub.criterios) {
        const fila = el('div', { class: 'coeval-criterio' }, el('strong', {}, cr.nombre));
        const ops = el('div', { class: 'coeval-opciones' });
        cr.descriptores.forEach((d, i) => {
          const b = el('button', { type: 'button', class: 'coeval-op', onclick: () => {
            elecciones[cr.nombre] = i + 1;
            for (const x of ops.children) x.classList.remove('elegida');
            b.classList.add('elegida');
          } }, el('b', {}, rub.niveles[i]), el('span', {}, d));
          ops.appendChild(b);
        });
        fila.appendChild(ops);
        form.appendChild(fila);
      }
    }
    const gusto = el('textarea', { class: 'campo', rows: '2', placeholder: 'Lo que más me gustó…' });
    const sugerencia = el('textarea', { class: 'campo', rows: '2', placeholder: 'Una sugerencia para mejorar…' });
    form.append(el('label', { class: 'campo-etiqueta' }, 'Lo que más me gustó'), gusto, el('label', { class: 'campo-etiqueta' }, 'Una sugerencia'), sugerencia);
    form.appendChild(el('button', { class: 'btn btn-primario', onclick: () => {
      if (!nombre.value.trim()) { PB.ui.aviso('Escribe el nombre de quien evalúas.', 'error'); return; }
      if (rub && Object.keys(elecciones).length < rub.criterios.length) { PB.ui.aviso('Elige un nivel en cada criterio.', 'error'); return; }
      PB.progreso.agregarCoevaluacion({ companero: nombre.value.trim(), proyecto: proyecto.value.trim(), criterios: Object.assign({}, elecciones), gusto: gusto.value.trim(), sugerencia: sugerencia.value.trim() });
      PB.ui.aviso('Coevaluación guardada. ¡Gracias!', 'exito');
      PB.app.render();
    } }, 'Guardar coevaluación'));
    c.appendChild(form);
    const hechas = PB.progreso.datos.coevaluaciones;
    if (hechas.length) {
      c.appendChild(el('h3', {}, 'Coevaluaciones que has hecho'));
      c.appendChild(el('ul', {}, ...hechas.map(h => el('li', {}, `${h.companero}${h.proyecto ? ' («' + h.proyecto + '»)' : ''}: ${Object.entries(h.criterios).map(([k, v]) => k + ' ' + v).join(' · ')}`))));
    }
    c.appendChild(sig());
  }

  /* ---------- Paso: prueba diagnóstica / final ---------- */
  function pasoPrueba(c, s, sig) {
    const tipo = s.prueba;              // 'diagnostica' | 'final'
    const items = PB.curso.prueba.items;
    const hecha = PB.progreso.prueba(tipo);
    c.appendChild(el('h2', {}, tipo === 'diagnostica' ? 'Prueba diagnóstica' : 'Prueba final'));
    c.appendChild(el('p', { html: tipo === 'diagnostica'
      ? 'Son 10 preguntas de <b>leer código y predecir qué hace</b>. Todavía no has aprendido Python: es normal no saber muchas respuestas. ¡Responde lo que creas! Al final del curso harás las mismas preguntas para ver cuánto avanzaste.'
      : 'Son las mismas 10 preguntas de la prueba diagnóstica. Lee cada programa con calma y predice qué hace.' }));
    if (hecha && !PB.estado.docente) {
      mostrarResultadoPrueba(c, tipo, hecha, items);
      c.appendChild(sig());
      return;
    }
    let i = 0;
    const respuestas = [];
    const zona = el('div', { class: 'prueba-zona' });
    c.appendChild(zona);
    const pintar = () => {
      vaciar(zona);
      const it = items[i];
      zona.appendChild(el('div', { class: 'prueba-progreso' }, `Pregunta ${i + 1} de ${items.length}`,
        el('div', { class: 'barra-progreso' }, el('div', { class: 'barra-relleno', style: { width: ((i) / items.length * 100) + '%' } }))));
      const caja = el('div', { class: 'pregunta' });
      caja.appendChild(el('div', { class: 'pregunta-texto', html: it.pregunta }));
      if (it.codigo) caja.appendChild(PB.bloqueCodigo(it.codigo, { numeros: true }));
      const ops = el('div', { class: 'opciones' + (it.codigoOpciones ? ' opciones-codigo' : '') });
      it.opciones.forEach((op, j) => {
        const b = el('button', { class: 'opcion', type: 'button', onclick: () => {
          respuestas[i] = j;
          i++;
          if (i < items.length) pintar(); else terminar();
        } }, el('span', { class: 'opcion-letra' }, String.fromCharCode(65 + j)));
        if (it.codigoOpciones) b.appendChild(PB.bloqueCodigo(op, { clase: 'en-opcion' })); else b.appendChild(el('span', { class: 'opcion-texto', html: op }));
        ops.appendChild(b);
      });
      caja.appendChild(ops);
      caja.appendChild(el('button', { class: 'btn btn-chico btn-suave', onclick: () => { respuestas[i] = -1; i++; if (i < items.length) pintar(); else terminar(); } }, 'No sé'));
      zona.appendChild(caja);
    };
    const terminar = () => {
      const puntaje = respuestas.filter((r, j) => r === items[j].correcta).length;
      const datos = { respuestas, puntaje, total: items.length };
      if (!PB.progreso.prueba(tipo) || PB.estado.docente) PB.progreso.guardarPrueba(tipo, datos);
      vaciar(zona);
      mostrarResultadoPrueba(zona, tipo, datos, items);
    };
    pintar();
    c.appendChild(sig());
  }

  function mostrarResultadoPrueba(c, tipo, datos, items) {
    c.appendChild(el('div', { class: 'resultado-prueba' },
      el('div', { class: 'puntaje-grande' }, `${datos.puntaje}`, el('small', {}, `/${datos.total}`)),
      el('p', {}, tipo === 'diagnostica' ? '¡Gracias! Este es tu punto de partida.' : 'Este es tu resultado final.')));
    if (tipo === 'final') {
      const d = PB.progreso.prueba('diagnostica');
      if (d) {
        const dif = datos.puntaje - d.puntaje;
        c.appendChild(el('div', { class: 'comparacion-pruebas' },
          el('div', {}, el('small', {}, 'Diagnóstica'), el('strong', {}, `${d.puntaje}/${d.total}`)),
          el('div', { class: 'flecha' }, '→'),
          el('div', {}, el('small', {}, 'Final'), el('strong', {}, `${datos.puntaje}/${datos.total}`)),
          el('div', { class: dif > 0 ? 'avance' : '' }, dif > 0 ? `+${dif} 🎉` : dif === 0 ? 'igual' : String(dif))));
      }
    }
    const det = el('details', { class: 'repaso-prueba' }, el('summary', {}, 'Repasar las respuestas'));
    items.forEach((it, j) => {
      const r = datos.respuestas[j];
      det.appendChild(el('div', { class: 'repaso-item ' + (r === it.correcta ? 'ok' : 'no') },
        el('strong', {}, `${j + 1}. `, el('span', { html: it.pregunta })),
        it.codigo ? PB.bloqueCodigo(it.codigo) : null,
        el('p', {}, `Tu respuesta: ${r >= 0 && r !== undefined ? String.fromCharCode(65 + r) : 'No sé'} · Correcta: ${String.fromCharCode(65 + it.correcta)}`),
        it.explicacion ? el('p', { class: 'nota', html: it.explicacion }) : null));
    });
    c.appendChild(det);
  }

  /* ---------- Paso: cierre (puente, autoevaluación, ticket) ---------- */
  function pasoCierre(c, s) {
    if (s.puente && s.puente.length) {
      c.appendChild(el('h2', {}, '🌉 Puente bloque ↔ Python'));
      s.puente.forEach((p, i) => PB.comp.pregunta(c, p, `puente:${s.numero}:${i}`, {}));
    }
    if (s.autoevaluacion && s.autoevaluacion.length) {
      c.appendChild(el('h2', {}, '🪞 Autoevaluación'));
      c.appendChild(el('p', { class: 'nota' }, 'Responde en tu mente o en tu cuaderno y después abre la respuesta.'));
      for (const a of s.autoevaluacion) {
        c.appendChild(el('details', { class: 'autoeval' }, el('summary', { html: a.pregunta }), el('div', { class: 'autoeval-resp', html: a.respuesta }), a.codigo ? PB.bloqueCodigo(a.codigo) : null));
      }
    }
    if (s.ticket) {
      c.appendChild(el('h2', {}, '🎟 Ticket de salida'));
      const clave = 'ticket:' + s.numero;
      const caja = el('div', { class: 'ticket' });
      c.appendChild(caja);
      PB.comp.pregunta(caja, s.ticket, clave, { unaVez: true, alResponder: () => pintarComentario() });
      const zonaComentario = el('div', { class: 'ticket-comentario' });
      caja.appendChild(zonaComentario);
      const pintarComentario = () => {
        vaciar(zonaComentario);
        const r = PB.progreso.respuesta(clave);
        if (!r) return;
        const ta = el('input', { class: 'campo', type: 'text', placeholder: 'Opcional: ¿qué fue lo más difícil hoy?', value: r.comentario || '' });
        zonaComentario.append(el('label', { class: 'campo-etiqueta' }, 'Un comentario para tu docente (opcional)'), ta,
          el('button', { class: 'btn btn-chico btn-suave', onclick: () => { PB.progreso.responder(clave, Object.assign({}, r, { comentario: ta.value.trim() })); PB.ui.aviso('Comentario guardado', 'exito'); } }, 'Guardar comentario'));
      };
      pintarComentario();
      if (PB.config.enlaceTicket) {
        caja.appendChild(el('p', { class: 'nota' }, 'Tu docente también te pide contestar aquí: ', el('a', { href: PB.config.enlaceTicket, target: '_blank', rel: 'noopener' }, 'formulario del ticket ↗')));
      }
    }
    // Resumen de la sesión
    const n = PB.progreso.estrellasSesion(s);
    const resumen = el('div', { class: 'resumen-sesion' }, el('h2', {}, 'Tu sesión'));
    if (s.reto) resumen.appendChild(el('p', {}, s.reto.tipo === 'proyecto' ? (PB.progreso.superado(s.reto.id) ? '🚀 Proyecto entregado' : '🚀 Proyecto pendiente') : '🏆 Reto principal: ', s.reto.tipo === 'proyecto' ? null : estrellas(n)));
    if (s.microretos) resumen.appendChild(el('p', {}, `🧩 Micro-retos: ${s.microretos.filter(m => PB.progreso.superado(m.id)).length} de ${s.microretos.length}`));
    if (s.extra) resumen.appendChild(el('p', {}, '⭐ Reto extra: ' + (PB.progreso.superado(s.extra.id) ? 'superado' : 'pendiente')));
    const u = PB.curso.unidades.find(x => x.numero === s.unidad);
    if (u && u.insignia) resumen.appendChild(el('div', { class: 'insignia-item' }, PB.comp.insigniaSVG(u, PB.progreso.tieneInsignia(u.numero), 48), el('span', {}, PB.progreso.tieneInsignia(u.numero) ? `Insignia «${u.insignia}» ganada` : `Insignia de la unidad: «${u.insignia}» (supera todos los retos principales de la unidad)`)));
    const sigSesion = PB.curso.sesiones.find(x => x.numero === s.numero + 1);
    resumen.appendChild(el('div', { class: 'acciones' },
      el('a', { class: 'btn btn-suave', href: '#/' }, 'Volver al inicio'),
      sigSesion ? el('a', { class: 'btn btn-primario', href: '#/s/' + sigSesion.numero }, `Sesión ${sigSesion.numero} →`) : null));
    c.appendChild(resumen);
  }

  function pintarPlan(c, s) {
    const p = s.plan;
    const det = el('details', { class: 'plan-clase' }, el('summary', {}, '🔑 Plan de clase (docente)'));
    const momentos = [['activacion', 'Activación', 5], ['ejemplo', 'Ejemplo resuelto en vivo', 10], ['practica', 'Práctica guiada', 10], ['reto', 'Reto principal', 25], ['cierre', 'Cierre', 10]];
    const ol = el('ol', { class: 'momentos' });
    for (const [k, t, min] of momentos) {
      if (!p[k]) continue;
      ol.appendChild(el('li', {}, el('strong', {}, `${t} (${(p.minutos && p.minutos[k]) || min} min): `), el('span', { html: p[k] })));
    }
    det.appendChild(ol);
    if (p.notas) det.appendChild(el('p', { class: 'nota', html: p.notas }));
    c.appendChild(det);
  }

  /* ================================================================ *
   * GLOSARIO
   * ================================================================ */
  V.glosario = function (main) {
    main.appendChild(el('h1', {}, '🔤 Glosario bilingüe'));
    const buscador = el('input', { class: 'campo', type: 'search', placeholder: 'Buscar (por ejemplo: lista, while, variable)…', autocapitalize: 'off' });
    main.appendChild(buscador);
    const todos = [];
    const vistos = new Set();
    for (const s of PB.curso.sesiones) for (const g of s.glosario || []) {
      const k = g.en.toLowerCase();
      if (vistos.has(k)) continue;
      vistos.add(k);
      todos.push(Object.assign({ sesion: s.numero }, g));
    }
    const zona = el('div');
    main.appendChild(zona);
    const pintar = () => {
      const q = PB.util.normalizar(buscador.value);
      const lista = todos.filter(g => !q || PB.util.normalizar(g.en + ' ' + g.es + ' ' + (g.def || '')).includes(q));
      vaciar(zona).appendChild(tablaGlosario(lista, true));
    };
    buscador.addEventListener('input', pintar);
    pintar();
  };

  /* ================================================================ *
   * MI PROGRESO
   * ================================================================ */
  V.progreso = function (main) {
    const a = PB.progreso.alumno();
    main.appendChild(el('h1', {}, '📈 Mi progreso'));
    const nombre = el('input', { class: 'campo', type: 'text', value: a.nombre, placeholder: 'Tu nombre' });
    const grupo = el('input', { class: 'campo', type: 'text', value: a.grupo, placeholder: 'Grupo (por ejemplo 1° A)' });
    main.appendChild(el('div', { class: 'tarjeta fila-campos' },
      el('div', {}, el('label', { class: 'campo-etiqueta' }, 'Nombre'), nombre),
      el('div', {}, el('label', { class: 'campo-etiqueta' }, 'Grupo'), grupo),
      el('button', { class: 'btn btn-primario', onclick: () => { PB.progreso.fijarAlumno(nombre.value, grupo.value); PB.ui.aviso('Datos guardados', 'exito'); PB.app.pintarCabecera(); } }, 'Guardar')));

    // Guardar / llevar el progreso
    main.appendChild(el('div', { class: 'tarjeta' },
      el('h2', {}, '💾 Guarda o lleva tu progreso a otro dispositivo'),
      el('p', { class: 'nota' }, PB.almacen.disponible
        ? 'Tu progreso se guarda en este dispositivo y navegador. Si cambias de iPad o el navegador borra los datos, puedes recuperarlo con un archivo o un código.'
        : '⚠ Este navegador no permite guardar datos aquí: exporta tu progreso antes de cerrar la página.'),
      el('div', { class: 'acciones' },
        el('button', { class: 'btn btn-suave', onclick: () => PB.archivos.descargar(`progreso-${PB.util.slug(a.nombre)}-${new Date().toISOString().slice(0, 10)}.json`, PB.progreso.exportar(true), 'application/json') }, '⬇ Descargar archivo de progreso'),
        el('button', { class: 'btn btn-suave', onclick: () => PB.archivos.copiar(PB.progreso.codigoProgreso(), 'Código de progreso') }, '📋 Copiar código de progreso'),
        el('button', { class: 'btn btn-suave', onclick: importarArchivo }, '⬆ Cargar archivo'),
        el('button', { class: 'btn btn-suave', onclick: importarCodigo }, '⌨ Pegar código'))));

    // Para entregar
    main.appendChild(el('div', { class: 'tarjeta' },
      el('h2', {}, '📤 Entregar a tu docente'),
      el('p', { class: 'nota' }, 'Copia tu resumen y pégalo donde te indique tu docente (por ejemplo, en Google Classroom), o entrega el archivo de progreso.'),
      el('div', { class: 'acciones' },
        el('button', { class: 'btn btn-primario', onclick: () => PB.archivos.copiar(PB.progreso.resumenTexto(), 'Resumen') }, '📋 Copiar resumen'),
        el('button', { class: 'btn btn-suave', onclick: () => PB.archivos.descargar(`resumen-${PB.util.slug(a.nombre)}.txt`, PB.progreso.resumenTexto()) }, '⬇ Descargar resumen'),
        el('button', { class: 'btn btn-suave', onclick: () => PB.archivos.mostrarParaCopiar(PB.progreso.resumenTexto(), 'Tu resumen') }, '👁 Ver resumen'))));

    // Insignias y estrellas
    const ins = el('div', { class: 'insignias-fila' });
    for (const u of PB.curso.unidades.filter(x => x.insignia)) ins.appendChild(el('div', { class: 'insignia-item' }, PB.comp.insigniaSVG(u, PB.progreso.tieneInsignia(u.numero), 60), el('span', {}, u.insignia)));
    main.appendChild(el('div', { class: 'tarjeta' }, el('h2', {}, '🏅 Insignias'), ins));

    const t = el('table', { class: 'tabla-progreso' }, el('thead', {}, el('tr', {}, el('th', {}, 'Sesión'), el('th', {}, 'Reto principal'), el('th', {}, 'Nivel'), el('th', {}, 'Micro-retos'), el('th', {}, 'Ticket'))));
    const tb = el('tbody');
    for (const s of PB.curso.sesiones) {
      const tk = PB.progreso.respuesta('ticket:' + s.numero);
      tb.appendChild(el('tr', {},
        el('td', {}, el('a', { href: '#/s/' + s.numero }, `${s.numero}. ${s.titulo}`)),
        el('td', {}, s.reto ? s.reto.titulo : '—'),
        el('td', {}, s.reto ? (s.reto.tipo === 'proyecto' ? (PB.progreso.superado(s.reto.id) ? '✓ entregado' : '—') : estrellas(PB.progreso.estrellasSesion(s))) : '—'),
        el('td', {}, s.microretos ? `${s.microretos.filter(m => PB.progreso.superado(m.id)).length}/${s.microretos.length}` : '—'),
        el('td', {}, s.ticket ? (tk ? (tk.correcta ? '✓' : '✗') : '·') : '—')));
    }
    t.appendChild(tb);
    main.appendChild(el('div', { class: 'tarjeta' }, el('h2', {}, '⭐ Retos por sesión'), el('div', { class: 'tabla-scroll' }, t)));

    // Calificación estimada
    const cal = PB.progreso.calificacion();
    main.appendChild(el('div', { class: 'tarjeta' }, el('h2', {}, '🧮 Calificación estimada'),
      el('p', { class: 'nota' }, 'Es solo una estimación con lo que registra la plataforma. Tu docente asigna la calificación final (el proyecto se evalúa con rúbrica).'),
      el('table', { class: 'tabla-cal' }, el('tbody', {},
        el('tr', {}, el('td', {}, `Retos de la plataforma (${cal.pesos.retos} %)`), el('td', {}, `${cal.retos}`)),
        el('tr', {}, el('td', {}, `Mini-proyecto (${cal.pesos.miniProyecto} %)`), el('td', {}, `${cal.mini.cumplidos}/${cal.mini.total} requisitos`)),
        el('tr', {}, el('td', {}, `Proyecto final (${cal.pesos.proyectoFinal} %)`), el('td', {}, `${cal.final.cumplidos}/${cal.final.total} requisitos`)),
        el('tr', {}, el('td', {}, `Tickets de salida (${cal.pesos.tickets} %)`), el('td', {}, `${cal.tickets} (${cal.ticketsContestados}/${cal.ticketsTotal} contestados)`)),
        el('tr', { class: 'total' }, el('td', {}, 'Estimado'), el('td', {}, `${cal.total}/100`))))));

    main.appendChild(el('div', { class: 'tarjeta peligro' }, el('h2', {}, 'Empezar de cero'),
      el('button', { class: 'btn btn-peligro', onclick: async () => {
        if (await PB.ui.confirmar('Se borrará todo tu progreso de este dispositivo. Te recomendamos descargar antes tu archivo de progreso. ¿Borrar todo?', 'Borrar progreso', 'Sí, borrar', 'Cancelar', true)) {
          PB.progreso.reiniciar(); PB.app.ir('#/');
        }
      } }, 'Borrar mi progreso de este dispositivo')));
  };

  async function importarArchivo() {
    const f = await PB.archivos.leerArchivo('.json,application/json,text/plain');
    if (!f) return;
    try { PB.progreso.importar(f.texto); PB.ui.aviso('Progreso cargado y combinado', 'exito'); PB.app.render(); }
    catch (e) { PB.ui.alerta('Ese archivo no es un archivo de progreso válido.'); }
  }
  async function importarCodigo() {
    const t = await PB.ui.pedirTexto('Pega aquí tu código de progreso (empieza con PB1:)', '', { titulo: 'Cargar progreso' });
    if (!t) return;
    try { PB.progreso.importar(t); PB.ui.aviso('Progreso cargado y combinado', 'exito'); PB.app.render(); }
    catch (e) { PB.ui.alerta('El código no es válido. Cópialo completo, desde PB1: hasta el final.'); }
  }

  /* ================================================================ *
   * PANEL DOCENTE
   * ================================================================ */
  V.docente = function (main) {
    main.appendChild(el('h1', {}, '🔑 Panel docente'));
    if (!PB.estado.docente) {
      const pin = el('input', { class: 'campo', type: 'password', inputmode: 'numeric', placeholder: 'PIN docente', autocomplete: 'off' });
      const entrar = () => {
        if (pin.value === String(PB.config.pinDocente)) {
          PB.estado.docente = true;
          PB.almacen.escribirSesion('pb:docente', '1');
          PB.app.pintarCabecera();
          PB.app.render();
        } else PB.ui.aviso('PIN incorrecto', 'error');
      };
      pin.addEventListener('keydown', ev => { if (ev.key === 'Enter') entrar(); });
      main.appendChild(el('div', { class: 'tarjeta' }, el('p', {}, 'Escribe el PIN para ver soluciones, planes de clase y herramientas para el grupo.'), pin, el('button', { class: 'btn btn-primario', onclick: entrar }, 'Entrar')));
      main.appendChild(el('p', { class: 'nota' }, 'El PIN se cambia en configuracion.json. Es una protección ligera: evita que los alumnos vean las soluciones por accidente, pero no es una contraseña segura.'));
      return;
    }
    main.appendChild(el('div', { class: 'tarjeta' },
      el('p', {}, '✅ Modo docente activo en esta pestaña. En cada reto aparece «⋯ → Ver solución»; las preguntas muestran la respuesta correcta; puedes usar cualquier modo de trabajo y ver el plan de clase en el paso de teoría.'),
      el('button', { class: 'btn btn-suave', onclick: () => { PB.estado.docente = false; PB.almacen.escribirSesion('pb:docente', ''); PB.app.pintarCabecera(); PB.app.render(); } }, 'Salir del modo docente')));

    // Consolidar progreso del grupo
    const zona = el('div');
    main.appendChild(el('div', { class: 'tarjeta' },
      el('h2', {}, '👥 Consolidar el progreso del grupo'),
      el('p', { class: 'nota' }, 'Pide a cada alumno su archivo de progreso (Mi progreso → Descargar archivo) o su código. Selecciona todos los archivos a la vez para ver la tabla del grupo y descargarla como CSV para Google Sheets o Excel.'),
      el('div', { class: 'acciones' },
        el('button', { class: 'btn btn-primario', onclick: async () => {
          const archivos = await PB.archivos.leerArchivo('.json,application/json,text/plain', true);
          if (!archivos || !archivos.length) return;
          consolidar(zona, archivos.map(a => a.texto));
        } }, '⬆ Seleccionar archivos de progreso'),
        el('button', { class: 'btn btn-suave', onclick: async () => {
          const t = await PB.ui.pedirTexto('Pega uno o varios códigos PB1: (uno por renglón o separados por espacios)', '', { titulo: 'Códigos de progreso' });
          if (t) consolidar(zona, t.split(/\s+/).filter(x => x.startsWith('PB1:')));
        } }, '⌨ Pegar códigos')),
      zona));

    // Planes de clase
    const planes = el('div', { class: 'tarjeta' }, el('h2', {}, '🗓 Planes de clase'));
    for (const s of PB.curso.sesiones) {
      if (!s.plan) continue;
      const cont = el('div');
      pintarPlan(cont, s);
      const d = cont.firstChild;
      d.querySelector('summary').textContent = `Sesión ${s.numero}: ${s.titulo}`;
      planes.appendChild(d);
    }
    main.appendChild(planes);

    const proyecto = PB.curso.sesiones.find(s => s.reto && s.reto.rubrica);
    if (proyecto) main.appendChild(el('div', { class: 'tarjeta' }, el('h2', {}, '📋 Rúbrica del proyecto final'), pintarRubrica(proyecto.reto.rubrica)));
    const mini = PB.curso.sesiones.find(s => s.reto && s.reto.listaCotejo);
    if (mini) main.appendChild(el('div', { class: 'tarjeta' }, el('h2', {}, '✅ Lista de cotejo del mini-proyecto'), el('ul', {}, ...mini.reto.listaCotejo.map(x => el('li', {}, x)))));
  };

  function consolidar(zona, textos) {
    const filas = [];
    const errores = [];
    for (const t of textos) {
      try { filas.push(PB.progreso.leerExterno(t)); } catch (e) { errores.push(e.message); }
    }
    vaciar(zona);
    if (errores.length) zona.appendChild(el('p', { class: 'campo-error' }, `${errores.length} archivo(s) no se pudieron leer.`));
    if (!filas.length) return;
    const sesionesReto = PB.curso.sesiones.filter(s => s.reto && s.reto.tipo !== 'proyecto');
    const cfg = PB.config.evaluacion;
    const encabezado = ['Alumno', 'Grupo', ...sesionesReto.map(s => 'S' + s.numero), 'Retos %', 'Mini-proy. req.', 'Proyecto req.', 'Tickets %', 'Diagnóstica', 'Final', 'Estimado'];
    const datos = filas.map(d => {
      const nivel = (id) => {
        const e = d.retos[id];
        if (!e || !e.niveles) return '';
        return e.niveles.maestro ? 'M' : e.niveles.programador ? 'P' : e.niveles.explorador ? 'E' : '';
      };
      let pts = 0;
      const celdas = sesionesReto.map(s => {
        const n = nivel(s.reto.id);
        pts += n === 'M' || n === 'P' ? 1 : n === 'E' ? cfg.creditoExplorador : 0;
        return n;
      });
      const retos = Math.round(pts / sesionesReto.length * 100);
      const req = (num) => {
        const s = PB.curso.sesiones.find(x => x.numero === num);
        const e = s && s.reto ? d.retos[s.reto.id] : null;
        return e && e.requisitosTotal ? { txt: `${e.requisitosCumplidos}/${e.requisitosTotal}`, pct: e.requisitosCumplidos / e.requisitosTotal * 100 } : { txt: '', pct: 0 };
      };
      const mini = req(cfg.sesionMiniProyecto), fin = req(cfg.sesionProyectoFinal);
      const conTicket = PB.curso.sesiones.filter(s => s.ticket);
      const tickets = Math.round(conTicket.filter(s => (d.respuestas['ticket:' + s.numero] || {}).correcta).length / (conTicket.length || 1) * 100);
      const total = Math.round((retos * cfg.pesos.retos + mini.pct * cfg.pesos.miniProyecto + fin.pct * cfg.pesos.proyectoFinal + tickets * cfg.pesos.tickets) / 100);
      const p = (k) => d.pruebas && d.pruebas[k] ? `${d.pruebas[k].puntaje}/${d.pruebas[k].total}` : '';
      return [d.alumno?.nombre || '(sin nombre)', d.alumno?.grupo || '', ...celdas, retos, mini.txt, fin.txt, tickets, p('diagnostica'), p('final'), total];
    }).sort((a, b) => String(a[0]).localeCompare(String(b[0])));
    const tabla = el('table', { class: 'tabla-grupo' }, el('thead', {}, el('tr', {}, ...encabezado.map(h => el('th', {}, h)))));
    const tb = el('tbody');
    for (const f of datos) tb.appendChild(el('tr', {}, ...f.map(c => el('td', {}, String(c)))));
    tabla.appendChild(tb);
    // Promedios de pruebas para reportar el avance del grupo
    const prom = (k) => {
      const v = filas.filter(d => d.pruebas && d.pruebas[k]).map(d => d.pruebas[k].puntaje);
      return v.length ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) + ` (n=${v.length})` : '—';
    };
    zona.append(
      el('p', {}, `Alumnos: ${datos.length} · Promedio diagnóstica: ${prom('diagnostica')} · Promedio final: ${prom('final')} · E = Explorador, P = Programador, M = Maestro`),
      el('div', { class: 'tabla-scroll' }, tabla),
      el('button', { class: 'btn btn-primario', onclick: () => {
        const csv = [encabezado, ...datos].map(f => f.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n');
        PB.archivos.descargar('progreso-grupo.csv', '﻿' + csv, 'text/csv');
      } }, '⬇ Descargar CSV'));
  }

  V.pasosDe = pasosDe;
})();
