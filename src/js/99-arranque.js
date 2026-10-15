/* =========================================================================
 * 99-arranque.js — Configuración, cabecera, rutas (#/…) y arranque.
 * ========================================================================= */
'use strict';

(() => {
  const { el, vaciar } = PB.util;

  const DATOS = window.PB_DATOS || { config: {}, unidades: [], sesiones: [], prueba: { items: [] } };

  PB.config = Object.assign({
    idCurso: 'python-blockly',
    nombreCurso: 'De Bloques a Python',
    nombreCorto: 'Bloques → Python',
    lema: 'Del bloque al código, paso a paso.',
    pinDocente: '2468',
    rutaMediaBlockly: 'https://cdn.jsdelivr.net/npm/blockly@11.2.2/media/',
    enlaceTicket: '',
    urlPublica: '',
    evaluacion: {
      pesos: { retos: 40, miniProyecto: 20, proyectoFinal: 30, tickets: 10 },
      creditoExplorador: 0.5, sesionMiniProyecto: 7, sesionProyectoFinal: 15
    }
  }, DATOS.config || {});
  if (window.PB_SPRITES_BLOCKLY) PB.config.spritesBlockly = window.PB_SPRITES_BLOCKLY;

  PB.curso = {
    unidades: DATOS.unidades || [],
    sesiones: (DATOS.sesiones || []).slice().sort((a, b) => a.numero - b.numero),
    prueba: DATOS.prueba || { items: [] }
  };

  PB.estado = {
    docente: PB.almacen.leerSesion('pb:docente') === '1',
    escalaBloques: 0.85,
    textoGrande: !!PB.almacen.leer('pb:textoGrande', false)
  };

  /* ---------------- Aplicación ---------------- */
  let salidas = [];
  let cabecera, vista;

  PB.app = {
    alSalir(fn) { salidas.push(fn); },
    ir(ruta) {
      if (location.hash === ruta) PB.app.render();
      else location.hash = ruta;
    },
    render,
    pintarCabecera
  };

  function limpiarVista() {
    for (const fn of salidas) { try { fn(); } catch (e) { console.warn(e); } }
    salidas = [];
    document.querySelectorAll('.menu-emergente').forEach(m => m.remove());
    vaciar(vista);
    vista.className = 'vista';
  }

  function render() {
    limpiarVista();
    const partes = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
    const [a, b, c, d, e] = partes;
    marcarNav(a || 'inicio');
    try {
      if (!a) PB.vistas.inicio(vista);
      else if (a === 's') PB.vistas.sesion(vista, parseInt(b, 10), c, d, e);
      else if (a === 'glosario') PB.vistas.glosario(vista);
      else if (a === 'progreso') PB.vistas.progreso(vista);
      else if (a === 'docente') PB.vistas.docente(vista);
      else PB.vistas.inicio(vista);
    } catch (err) {
      console.error(err);
      vista.appendChild(el('div', { class: 'tarjeta peligro' }, el('h2', {}, 'Algo salió mal'), el('p', {}, String(err && err.message || err)), el('a', { class: 'btn btn-primario', href: '#/' }, 'Volver al inicio')));
    }
    if (!vista.classList.contains('con-taller')) window.scrollTo(0, 0);
  }

  function marcarNav(seccion) {
    for (const a of cabecera.querySelectorAll('.app-nav a')) {
      a.classList.toggle('activo', a.dataset.seccion === (seccion === 's' ? 'inicio' : seccion));
    }
  }

  function pintarCabecera() {
    vaciar(cabecera);
    const a = PB.progreso.alumno();
    const enIframe = window.self !== window.top;
    const pantallaCompleta = document.fullscreenEnabled || document.webkitFullscreenEnabled;
    cabecera.append(
      el('a', { class: 'marca', href: '#/', title: PB.config.nombreCurso },
        el('span', { class: 'logo', 'aria-hidden': 'true' }, el('span', { class: 'logo-bloque' }), el('span', { class: 'logo-texto' }, 'py')),
        el('span', { class: 'marca-texto' }, PB.config.nombreCurso)),
      el('nav', { class: 'app-nav', 'aria-label': 'Secciones' },
        el('a', { href: '#/', 'data-seccion': 'inicio' }, el('span', { class: 'nav-icono' }, '🏠'), el('span', { class: 'nav-texto' }, 'Inicio')),
        el('a', { href: '#/glosario', 'data-seccion': 'glosario' }, el('span', { class: 'nav-icono' }, '🔤'), el('span', { class: 'nav-texto' }, 'Glosario')),
        el('a', { href: '#/progreso', 'data-seccion': 'progreso' }, el('span', { class: 'nav-icono' }, '📈'), el('span', { class: 'nav-texto' }, 'Mi progreso')),
        el('a', { href: '#/docente', 'data-seccion': 'docente', class: PB.estado.docente ? 'nav-docente-activo' : '' }, el('span', { class: 'nav-icono' }, '🔑'), el('span', { class: 'nav-texto' }, PB.estado.docente ? 'Docente ✓' : 'Docente'))),
      el('div', { class: 'app-herramientas' },
        el('button', { class: 'btn-icono', title: PB.estado.textoGrande ? 'Letra normal' : 'Letra más grande', 'aria-label': 'Cambiar tamaño de letra', onclick: alternarTexto }, PB.estado.textoGrande ? 'A−' : 'A+'),
        pantallaCompleta ? el('button', { class: 'btn-icono', title: 'Pantalla completa', 'aria-label': 'Pantalla completa', onclick: alternarPantalla }, '⛶') : null,
        enIframe && PB.config.urlPublica ? el('a', { class: 'btn-icono', href: PB.config.urlPublica, target: '_blank', rel: 'noopener', title: 'Abrir en una pestaña nueva', 'aria-label': 'Abrir en una pestaña nueva' }, '↗') : null,
        el('button', { class: 'alumno-chip', onclick: () => pedirNombre(), title: 'Cambiar nombre' }, a.nombre ? '👤 ' + a.nombre : '👤 ¿Cómo te llamas?')));
    marcarNav((location.hash.replace(/^#\/?/, '').split('/')[0]) || 'inicio');
  }

  function alternarTexto() {
    PB.estado.textoGrande = !PB.estado.textoGrande;
    PB.almacen.escribir('pb:textoGrande', PB.estado.textoGrande);
    aplicarTexto();
    pintarCabecera();
    render();
  }
  function aplicarTexto() {
    document.documentElement.classList.toggle('texto-grande', PB.estado.textoGrande);
    PB.estado.escalaBloques = PB.estado.textoGrande ? 1.05 : 0.85;
  }

  function alternarPantalla() {
    const d = document;
    const activo = d.fullscreenElement || d.webkitFullscreenElement;
    try {
      if (activo) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
      else (d.documentElement.requestFullscreen || d.documentElement.webkitRequestFullscreen).call(d.documentElement);
    } catch (e) { PB.ui.aviso('Tu navegador no permite la pantalla completa aquí.', 'info'); }
  }

  async function pedirNombre(primeraVez) {
    const a = PB.progreso.alumno();
    let nombre, grupo;
    const r = await PB.ui.modal({
      titulo: primeraVez ? '¡Bienvenida, bienvenido!' : 'Tus datos',
      contenido: (c) => {
        if (primeraVez) c.appendChild(el('p', {}, 'Aquí vas a pasar de los bloques de Scratch a escribir tus propios programas en Python. Primero, ¿cómo te llamas?'));
        c.appendChild(el('label', { class: 'campo-etiqueta' }, 'Nombre'));
        nombre = el('input', { class: 'campo', type: 'text', value: a.nombre, placeholder: 'Tu nombre', autocomplete: 'off' });
        c.appendChild(nombre);
        c.appendChild(el('label', { class: 'campo-etiqueta' }, 'Grupo (opcional)'));
        grupo = el('input', { class: 'campo', type: 'text', value: a.grupo, placeholder: 'Por ejemplo: 1° A', autocomplete: 'off' });
        c.appendChild(grupo);
        if (!PB.almacen.disponible) c.appendChild(el('p', { class: 'aviso-almacen' }, '⚠ Este navegador no permite guardar tu progreso. Usa «Mi progreso → Descargar archivo» antes de salir.'));
      },
      botones: [{ texto: primeraVez ? 'Después' : 'Cancelar', valor: null }, { texto: primeraVez ? '¡Empezar!' : 'Guardar', tipo: 'primario', valor: 'ok' }]
    });
    if (r === 'ok' && nombre.value.trim()) {
      PB.progreso.fijarAlumno(nombre.value, grupo.value);
      pintarCabecera();
      render();
    }
  }

  function errorDeCarga(mensaje) {
    document.body.appendChild(el('div', { class: 'error-carga' },
      el('div', { class: 'tarjeta' }, el('h1', {}, '😕 No se pudo cargar la plataforma'), el('p', {}, mensaje),
        el('button', { class: 'btn btn-primario', onclick: () => location.reload() }, 'Volver a intentar'))));
  }

  function arrancar() {
    if (window.PB_MODO_PRUEBA) return;       // el banco de pruebas usa el motor sin la interfaz
    document.title = PB.config.nombreCurso;
    if (typeof window.Blockly === 'undefined') {
      errorDeCarga('No se pudo descargar el editor de bloques (Blockly). Revisa la conexión a internet y vuelve a intentar.');
      return;
    }
    aplicarTexto();
    PB.progreso.cargar();
    cabecera = el('header', { class: 'app-cabeza' });
    vista = el('main', { class: 'vista', id: 'vista' });
    const raiz = document.getElementById('app') || document.body;
    vaciar(raiz);
    raiz.append(cabecera, vista);
    pintarCabecera();
    window.addEventListener('hashchange', render);
    // Blockly mide el texto al dibujar: esperamos a que carguen las fuentes (máximo 2 s)
    const fuentes = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    Promise.race([fuentes, new Promise(r => setTimeout(r, 2000))]).then(render);
    if (document.fonts && document.fonts.addEventListener) {
      document.fonts.addEventListener('loadingdone', PB.util.debounce(() => {
        for (const ws of Blockly.Workspace.getAll ? Blockly.Workspace.getAll() : []) {
          try { if (ws.rendered) ws.render(); } catch (e) { /* nada */ }
        }
      }, 200));
    }
    if (!PB.ejecutor.disponible()) {
      PB.ui.aviso('No se pudo cargar el intérprete de Python (Skulpt). Podrás armar bloques, pero no ejecutar. Revisa la conexión.', 'error', 8000);
    }
    if (!PB.progreso.alumno().nombre) setTimeout(() => pedirNombre(true), 300);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
