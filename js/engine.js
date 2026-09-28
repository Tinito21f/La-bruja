/*
 * LA BRUJA — motor narrativo v4
 *
 * Lee window.HISTORIA (js/story*.js). No contiene historia.
 *
 * Escena:
 *   {
 *     pov:      "nora" | "marcos" | "alex" | "irene" | null | (api) => …,
 *     titulo:   "…" | (api) => "…",
 *     texto:    "…" | (api) => "…",   párrafos separados por línea en blanco
 *                                      "Nombre: …" diálogo · "~ …" pensamiento · "..." silencio
 *                                      "[directiva]" línea invisible que dispara un efecto al llegar a ella:
 *                                        [negro] [luz] [parpadeo] [temblor] [golpe] [toc] [clic] [campanilla]
 *                                        [arrastre] [corte] (la música se corta en seco) [silencio] (se funde)
 *                                        [musica:clave]
 *     fondo:    ruta de imagen,
 *     musica:   clave de HISTORIA.musica | null | undefined (no cambia),
 *     ambiente: "interior" | "exterior" | "arriba" | "bano" | "cocina" | "almacen" | "silencio" | undefined,
 *     lugar, hora: texto que se muestra bajo el título,
 *     alEntrar: (api) => {},          sólo la primera vez
 *     personajes: [ { id, descripcion, a, si, efecto, auto } ],   cartas (elección de POV)
 *     opciones:   [ { texto, a, si, efecto, pov, lucida, impulsiva } ],
 *     final:    true | (api) => bool
 *   }
 *
 * HISTORIA.musica: { clave: "ruta" | { src, vol, aleatorio } }
 *
 * Lectura: un clic revela un golpe (narración agrupada hasta un diálogo, un pensamiento, un silencio o
 * una frase corta). Mantener pulsado avanza rápido. Flecha abajo lo muestra todo. Modo automático en el menú.
 */
(function () {
  "use strict";

  const CLAVE = "labruja-" + (HISTORIA.id || "partida") + "-v" + (HISTORIA.version || 1);
  const CLAVE_PREFS = "labruja-prefs";
  const PJS = HISTORIA.personajes || {};
  const MUSICA = HISTORIA.musica || {};
  const PRESUPUESTO = HISTORIA.presupuestoAnomalias || {};
  const DEBUG = /[?#&]debug/.test(location.href);

  const $ = (id) => document.getElementById(id);
  const ui = {
    tituloJuego: $("titulo-juego"), fondo: $("fondo"), negro: $("negro"), app: $("app"),
    povCartel: $("pov-cartel"), povNombre: $("pov-nombre"), povSubtitulo: $("pov-subtitulo"), povFicha: $("pov-ficha"),
    povAvatar: $("pov-avatar"), btnDetalles: $("btn-detalles"), detalles: $("detalles"),
    detallesNombre: $("detalles-nombre"), detallesSubtitulo: $("detalles-subtitulo"), social: $("social"),
    barras: $("barras"), estado: $("estado"),
    titulo: $("escena-titulo"), meta: $("escena-meta"), texto: $("escena-texto"), pista: $("pista"),
    personajes: $("personajes"), opciones: $("opciones"),
    musica: $("btn-musica"), saltar: $("btn-saltar"),
    aviso: $("aviso-guardado"), escena: $("escena"),
    audioA: $("audio-a"), audioB: $("audio-b"),
    inicio: $("inicio"), btnContinuar: $("btn-continuar"), btnNueva: $("btn-nueva"), btnInicioSonido: $("btn-inicio-sonido"),
    inicioDonde: $("inicio-donde"),
    btnMenu: $("btn-menu"), menu: $("menu"), menuAuto: $("menu-auto"), menuHistorial: $("menu-historial"),
    menuInicio: $("menu-inicio"), menuSonido: $("menu-sonido"), menuReiniciar: $("menu-reiniciar"),
    reinicioConfirmar: $("reinicio-confirmar"), reiniciarSi: $("btn-reiniciar-si"), reiniciarNo: $("btn-reiniciar-no"),
    historial: $("historial"), historialLista: $("historial-lista"), btnHistorialCerrar: $("btn-historial-cerrar"),
    irA: $("ir-a"),
  };

  let estado = null;
  let fondoActual = null;
  let povAnterior = null;
  let golpes = [];          // párrafos pendientes de revelar
  let lineasEscena = [];    // texto en bruto de la escena actual (para el historial)
  let escenaActual = null;
  let relPrev = null;       // relaciones del POV al empezar la escena, para el pulso del retrato
  let prefs = { auto: false, sonido: true };

  if (HISTORIA.titulo) { ui.tituloJuego.textContent = HISTORIA.titulo; document.title = HISTORIA.titulo; }

  // ---------- Preferencias ----------

  try { prefs = Object.assign(prefs, JSON.parse(localStorage.getItem(CLAVE_PREFS) || "{}")); } catch (e) { /* nada */ }
  function guardarPrefs() { try { localStorage.setItem(CLAVE_PREFS, JSON.stringify(prefs)); } catch (e) { /* nada */ } }

  // ---------- Estado ----------

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function estadoInicial() {
    const personajes = {};
    for (const id in PJS) {
      personajes[id] = Object.assign({ miedo: 10, estres: 10, lucidez: 70, intox: 20, eje: 50 }, PJS[id].inicial || {});
    }
    return {
      escena: HISTORIA.inicio, pov: null, fase: HISTORIA.faseInicial || "I", horror: 0,
      anomaliasFase: [], personajes,
      relaciones: JSON.parse(JSON.stringify(HISTORIA.relacionesIniciales || {})),
      conocimiento: {}, banderas: {}, evidencias: {}, visitadas: {},
      lugar: null, hora: null, historial: [],
    };
  }
  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(estado)); ui.aviso.textContent = "guardado"; }
    catch (e) { ui.aviso.textContent = ""; }
  }
  function cargar() {
    try {
      let o = JSON.parse(localStorage.getItem(CLAVE));
      if (!o) {
        const prefijo = "labruja-" + (HISTORIA.id || "partida") + "-v";
        for (let v = (HISTORIA.version || 1) - 1; v >= 1 && !o; v--) {
          const viejo = localStorage.getItem(prefijo + v);
          if (viejo) { o = JSON.parse(viejo); localStorage.removeItem(prefijo + v); }
        }
      }
      if (!o) return null;
      const base = estadoInicial();
      const m = Object.assign(base, o);
      for (const id in PJS) m.personajes[id] = Object.assign({}, base.personajes[id], (o.personajes || {})[id] || {});
      for (const id in m.conocimiento) for (const h in m.conocimiento[id]) {
        if (m.conocimiento[id][h] === true) m.conocimiento[id][h] = { como: "visto", de: null, cree: true, escena: null };
      }
      for (const e in m.evidencias) {
        const v = m.evidencias[e];
        if (typeof v !== "object" || v === null) m.evidencias[e] = { quien: typeof v === "string" ? v : null, lugar: null, tipo: "objeto", escena: null, hora: null };
      }
      if (!Array.isArray(m.historial)) m.historial = [];
      if (!HISTORIA.escenas[m.escena]) m.escena = HISTORIA.inicio;
      return m;
    } catch (e) { return null; }
  }
  function borrarGuardado() { try { localStorage.removeItem(CLAVE); } catch (e) { /* nada */ } }

  // ---------- API ----------

  const rk = (a, b) => a + ">" + b;
  const api = {
    pj: (id) => estado.personajes[id],
    est: (id, k, d) => {
      const p = estado.personajes[id]; if (!p) return;
      if ((k === "miedo" || k === "estres") && d > 0 && (p.lucidez || 0) < 50) d *= 1.5;
      p[k] = clamp((p[k] || 0) + d, 0, 100);
    },
    modo: (id) => {
      const p = estado.personajes[id] || {};
      if ((p.lucidez || 0) < 20) return "perdido";
      if ((p.miedo || 0) >= 60) return "asustado";
      if ((p.estres || 0) >= 60) return "tenso";
      if ((p.intox || 0) >= 65) return "ido";
      if ((p.lucidez || 0) >= 70) return "lucido";
      return "normal";
    },
    lucido: (id) => {
      const p = estado.personajes[id] || {};
      return (p.lucidez || 0) >= 45 && (p.miedo || 0) < 70 && (p.estres || 0) < 70 && (p.intox || 0) < 70;
    },
    presenciar: (id, intensidad = 1) => {
      const p = estado.personajes[id]; if (!p) return;
      const registro = 0.5 + (p.lucidez || 0) / 200;
      let miedo = intensidad * 4 * registro;
      if (id === "nora" && !estado.banderas.fascinacion_rota) { api.est("nora", "eje", intensidad * 3 * registro); miedo *= 0.5; }
      else if (id === "alex") { if ((p.eje || 0) < 90) { api.est("alex", "eje", intensidad * 2); miedo *= 0.6; } }
      else if (id === "marcos") { api.est("marcos", "eje", -intensidad * 3); miedo *= 0.7; }
      else if (id === "irene") { api.est("irene", "estres", intensidad * 2); }
      api.est(id, "miedo", miedo);
      api.est(id, "estres", intensidad * 1.5);
    },
    rel: (a, b, k, d) => { const key = rk(a, b); estado.relaciones[key] = estado.relaciones[key] || {}; estado.relaciones[key][k] = clamp((estado.relaciones[key][k] || 0) + d, -100, 100); },
    relv: (a, b, k) => ((estado.relaciones[rk(a, b)] || {})[k] || 0),
    sabe: (id, h) => Boolean((estado.conocimiento[id] || {})[h]),
    saber: (id, h, como = "visto", de = null) => {
      estado.conocimiento[id] = estado.conocimiento[id] || {};
      if (!estado.conocimiento[id][h]) estado.conocimiento[id][h] = { como, de, cree: como !== "contado" ? true : null, escena: estado.escena };
    },
    contar: (de, a, h) => {
      if (!api.sabe(de, h)) return false;
      const cred = api.credibilidad(de);
      const conf = api.relv(a, de, "confianza");
      const cree = cred === "alta" ? conf > 10 : cred === "media" ? conf > 40 : conf > 70;
      estado.conocimiento[a] = estado.conocimiento[a] || {};
      estado.conocimiento[a][h] = { como: "contado", de, cree, escena: estado.escena };
      if (!cree) api.rel(a, de, "confianza", -3);
      return cree;
    },
    cree: (id, h) => { const k = (estado.conocimiento[id] || {})[h]; return Boolean(k && k.cree); },
    bandera: (n) => estado.banderas[n],
    marcar: (n, v = true) => { estado.banderas[n] = v; },
    evidencia: (id, quien = null, lugar = null, tipo = "objeto") => {
      estado.evidencias[id] = { quien, lugar: lugar || estado.lugar || null, tipo, escena: estado.escena, hora: estado.hora || null };
    },
    hayEvidencia: (id) => Boolean(estado.evidencias[id]),
    lugar: (l) => { if (l !== undefined) estado.lugar = l; return estado.lugar; },
    hora: (h) => { if (h !== undefined) estado.hora = h; return estado.hora; },
    horror: (n) => { if (n > estado.horror) estado.horror = n; },
    horrorActual: () => estado.horror,
    anomalia: (id) => {
      const max = PRESUPUESTO[estado.fase];
      if (estado.anomaliasFase.includes(id)) return true;
      if (max !== undefined && estado.anomaliasFase.length >= max) return false;
      estado.anomaliasFase.push(id); return true;
    },
    anomalias: () => estado.anomaliasFase.length,
    fase: (n) => { if (estado.fase !== n) { estado.fase = n; estado.anomaliasFase = []; } },
    visitada: (id) => Boolean(estado.visitadas[id]),
    pov: () => estado.pov,
    setas: () => Boolean(estado.banderas.marcos_setas),
    consumir: (id, tipo) => {
      estado.consumo = estado.consumo || {};
      estado.consumo[id] = estado.consumo[id] || [];
      const perfiles = {
        seta:    { intox: 1.0, lucidez: -0.35, estres: 0,  escenas: Infinity },
        porro:   { intox: 5,   lucidez: -1,   estres: -2, escenas: 3 },
        chupito: { intox: 1.5, lucidez: 0,    estres: -1, escenas: 2 },
        cerveza: { intox: 1.5, lucidez: 0,    estres: -0.5, escenas: 1 },
      };
      const p = perfiles[tipo]; if (!p) return;
      estado.consumo[id].push({ tipo, intox: p.intox, lucidez: p.lucidez, estres: p.estres, restante: p.escenas });
      if (tipo === "seta") estado.banderas[id + "_setas"] = true;
    },
    haConsumido: (id, tipo) => ((estado.consumo || {})[id] || []).some((c) => c.tipo === tipo),
    credibilidad: (id) => {
      const p = estado.personajes[id] || {};
      const puntos = (p.lucidez || 0) - (p.miedo || 0) * 0.6 - (p.estres || 0) * 0.5 - (p.intox || 0) * 0.7;
      return puntos >= 25 ? "alta" : puntos >= -10 ? "media" : "baja";
    },
    nivel: (id, k) => { const v = (estado.personajes[id] || {})[k] || 0; return v < 35 ? "bajo" : v < 65 ? "medio" : "alto"; },
    valor: (id, k) => (estado.personajes[id] || {})[k] || 0,
  };
  const resolver = (v) => (typeof v === "function" ? v(api) : v);

  // ---------- Música (archivos, con volumen por clave) ----------

  const musica = {
    activa: ui.audioA, inactiva: ui.audioB, claveActual: null, silenciada: false, desbloqueada: false, volumen: 0.5, fundidos: new Map(),
    def(clave) {
      const d = clave ? MUSICA[clave] : null;
      if (!d) return null;
      return typeof d === "string" ? { src: d, vol: 0.5 } : Object.assign({ vol: 0.5 }, d);
    },
    poner(clave) {
      if (clave === undefined || clave === this.claveActual) return;
      const def = this.def(clave);
      this.claveActual = clave;
      const vol = def ? def.vol : this.volumen;
      // Misma pista con otro volumen: no se reinicia, se funde
      if (def && this.activa.src && this.activa.src === new URL(def.src, location.href).href) {
        this.volumen = vol;
        if (!this.silenciada) this.fundir(this.activa, vol);
        return;
      }
      const sal = this.activa, ent = this.inactiva;
      this.activa = ent; this.inactiva = sal;
      this.fundir(sal, 0, () => { sal.pause(); sal.removeAttribute("src"); sal.load(); });
      if (!def) return;
      this.volumen = vol;
      ent.src = def.src; ent.volume = 0;
      if (def.aleatorio) ent.addEventListener("loadedmetadata", () => { if (ent.duration && isFinite(ent.duration)) ent.currentTime = Math.random() * ent.duration * 0.8; }, { once: true });
      if (this.desbloqueada && !this.silenciada) { ent.play().catch(() => {}); this.fundir(ent, vol); }
    },
    // Corte en seco: la música se va de golpe. La escena siguiente puede volver a ponerla.
    cortar() {
      const a = this.activa;
      this.detenerFundido(a);
      a.pause(); a.removeAttribute("src"); a.load();
      this.claveActual = null;
    },
    detenerFundido(el) { const t = this.fundidos.get(el); if (t) { clearInterval(t); this.fundidos.delete(el); } },
    fundir(el, destino, fin) {
      this.detenerFundido(el);
      const paso = 0.04;
      const t = setInterval(() => {
        const v = el.volume;
        if (Math.abs(v - destino) <= paso) { el.volume = destino; this.detenerFundido(el); if (fin) fin(); }
        else el.volume = clamp(v < destino ? v + paso : v - paso, 0, 1);
      }, 90);
      this.fundidos.set(el, t);
    },
    desbloquear() {
      if (this.desbloqueada) return;
      this.desbloqueada = true;
      if (!this.silenciada && this.activa.src) { this.activa.play().catch(() => {}); this.fundir(this.activa, this.volumen); }
    },
    silenciar(si) {
      this.silenciada = si;
      if (si) this.activa.pause();
      else if (this.activa.src && this.desbloqueada) { this.activa.play().catch(() => {}); this.fundir(this.activa, this.volumen); }
    },
  };

  // ---------- Ambiente (WebAudio sintetizado): viento, chimenea, zumbido, goteo ----------

  const ambiente = {
    ctx: null, master: null, nodos: [], actual: null, silenciado: false, nivel: 0.6,
    init() {
      if (this.ctx) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0;
      this.master.connect(this.ctx.destination);
    },
    ruido(seg = 4) {
      const n = this.ctx.sampleRate * seg;
      const buf = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < n; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.99765 * b0 + w * 0.099; b1 = 0.963 * b1 + w * 0.2965; b2 = 0.57 * b2 + w * 1.0526;
        d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.11;
      }
      const src = this.ctx.createBufferSource(); src.buffer = buf; src.loop = true; return src;
    },
    viento(fuerza) {
      const src = this.ruido(6);
      const f = this.ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 380; f.Q.value = 0.7;
      const g = this.ctx.createGain(); g.gain.value = fuerza;
      const lfo = this.ctx.createOscillator(); lfo.frequency.value = 0.07;
      const lg = this.ctx.createGain(); lg.gain.value = fuerza * 0.6;
      lfo.connect(lg); lg.connect(g.gain);
      src.connect(f); f.connect(g); g.connect(this.master);
      src.start(); lfo.start();
      return [src, lfo];
    },
    fuego(fuerza) {
      const src = this.ruido(3);
      const f = this.ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 2200; f.Q.value = 0.5;
      const g = this.ctx.createGain(); g.gain.value = fuerza;
      src.connect(f); f.connect(g); g.connect(this.master); src.start();
      const chispas = setInterval(() => {
        if (!this.ctx || Math.random() > 0.35) return;
        const o = this.ctx.createOscillator(); o.type = "square"; o.frequency.value = 1500 + Math.random() * 2500;
        const eg = this.ctx.createGain(); eg.gain.setValueAtTime(fuerza * 0.9, this.ctx.currentTime);
        eg.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.03);
        o.connect(eg); eg.connect(this.master); o.start(); o.stop(this.ctx.currentTime + 0.04);
      }, 180);
      return [src, { stop: () => clearInterval(chispas) }];
    },
    zumbido(fuerza, hz = 52) {
      const o = this.ctx.createOscillator(); o.type = "sine"; o.frequency.value = hz;
      const g = this.ctx.createGain(); g.gain.value = fuerza;
      o.connect(g); g.connect(this.master); o.start();
      return [o];
    },
    // Goteo: una gota cada pocos segundos, con su pequeño eco
    goteo(fuerza, cada = 2600) {
      const gota = () => {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const o = this.ctx.createOscillator(); o.type = "sine";
        o.frequency.setValueAtTime(1900 + Math.random() * 500, t); o.frequency.exponentialRampToValueAtTime(700, t + 0.07);
        const g = this.ctx.createGain(); g.gain.setValueAtTime(fuerza, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
        o.connect(g); g.connect(this.master); o.start(t); o.stop(t + 0.1);
        const e = this.ctx.createOscillator(); e.type = "sine"; e.frequency.value = 900;
        const eg = this.ctx.createGain(); eg.gain.setValueAtTime(0.0001, t); eg.gain.exponentialRampToValueAtTime(fuerza * 0.25, t + 0.12); eg.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
        e.connect(eg); eg.connect(this.master); e.start(t + 0.1); e.stop(t + 0.36);
      };
      let vivo = true;
      const programar = () => { if (!vivo) return; setTimeout(() => { if (!vivo) return; gota(); programar(); }, cada * (0.6 + Math.random() * 0.9)); };
      programar();
      return [{ stop: () => { vivo = false; } }];
    },
    poner(clave) {
      if (clave === undefined || clave === this.actual) return;
      this.actual = clave;
      if (!this.ctx) return;
      this.nodos.forEach((n) => { try { n.stop(); } catch (e) { /* nada */ } });
      this.nodos = [];
      if (clave === "silencio" || !clave) { this.fundir(0); return; }
      if (clave === "interior") this.nodos = [...this.viento(0.35), ...this.fuego(0.12), ...this.zumbido(0.05)];
      if (clave === "exterior") this.nodos = [...this.viento(0.9), ...this.zumbido(0.02)];
      if (clave === "arriba") this.nodos = [...this.viento(0.5), ...this.zumbido(0.06)];
      if (clave === "bano") this.nodos = [...this.viento(0.3), ...this.zumbido(0.05), ...this.goteo(0.5, 2800)];
      if (clave === "cocina") this.nodos = [...this.viento(0.2), ...this.zumbido(0.11, 100), ...this.goteo(0.25, 5200)];
      if (clave === "almacen") this.nodos = [...this.viento(0.15), ...this.zumbido(0.14, 44), ...this.goteo(0.3, 7000)];
      this.fundir(this.silenciado ? 0 : this.nivel);
    },
    fundir(v) {
      if (!this.ctx) return;
      this.master.gain.cancelScheduledValues(this.ctx.currentTime);
      this.master.gain.linearRampToValueAtTime(v, this.ctx.currentTime + 2.5);
    },
    desbloquear() {
      this.init();
      if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
      const a = this.actual; this.actual = null; this.poner(a);
    },
    silenciar(si) { this.silenciado = si; this.fundir(si ? 0 : this.nivel); },
  };

  // ---------- Efectos de sonido (sintetizados) ----------

  const sfx = {
    listo() { return ambiente.ctx && !ambiente.silenciado; },
    salida(g) { g.connect(ambiente.ctx.destination); },
    golpe() {   // golpe seco y grave: madera grande
      if (!this.listo()) return;
      const c = ambiente.ctx, t = c.currentTime;
      const o = c.createOscillator(); o.type = "sine"; o.frequency.setValueAtTime(90, t); o.frequency.exponentialRampToValueAtTime(38, t + 0.25);
      const g = c.createGain(); g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
      o.connect(g); this.salida(g); o.start(t); o.stop(t + 0.5);
      const n = ambiente.ruido(1); const f = c.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 500;
      const ng = c.createGain(); ng.gain.setValueAtTime(0.5, t); ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      n.connect(f); f.connect(ng); this.salida(ng); n.start(t); n.stop(t + 0.2);
    },
    toc() {     // nudillo o talón contra madera
      if (!this.listo()) return;
      const c = ambiente.ctx, t = c.currentTime;
      const n = ambiente.ruido(1); const f = c.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 900; f.Q.value = 1.4;
      const g = c.createGain(); g.gain.setValueAtTime(0.7, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
      n.connect(f); f.connect(g); this.salida(g); n.start(t); n.stop(t + 0.1);
      const o = c.createOscillator(); o.type = "triangle"; o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(120, t + 0.08);
      const og = c.createGain(); og.gain.setValueAtTime(0.35, t); og.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      o.connect(og); this.salida(og); o.start(t); o.stop(t + 0.13);
    },
    clic() {    // interruptor, rosca de bombilla
      if (!this.listo()) return;
      const c = ambiente.ctx, t = c.currentTime;
      const n = ambiente.ruido(1); const f = c.createBiquadFilter(); f.type = "highpass"; f.frequency.value = 2500;
      const g = c.createGain(); g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
      n.connect(f); f.connect(g); this.salida(g); n.start(t); n.stop(t + 0.04);
    },
    campanilla() {  // muy pequeña, muy lejos
      if (!this.listo()) return;
      const c = ambiente.ctx, t = c.currentTime;
      [2650, 5300].forEach((hz, i) => {
        const o = c.createOscillator(); o.type = "sine"; o.frequency.value = hz;
        const g = c.createGain(); g.gain.setValueAtTime(i ? 0.05 : 0.14, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
        o.connect(g); this.salida(g); o.start(t); o.stop(t + 1.2);
      });
    },
    arrastre() {   // algo pesado que se mueve un palmo sobre piedra
      if (!this.listo()) return;
      const c = ambiente.ctx, t = c.currentTime;
      const n = ambiente.ruido(2); const f = c.createBiquadFilter(); f.type = "lowpass"; f.frequency.setValueAtTime(140, t); f.frequency.linearRampToValueAtTime(420, t + 0.9); f.frequency.linearRampToValueAtTime(120, t + 1.5);
      const g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.8, t + 0.25); g.gain.linearRampToValueAtTime(0.6, t + 1.1); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
      n.connect(f); f.connect(g); this.salida(g); n.start(t); n.stop(t + 1.7);
    },
  };

  function ajustarSonido(activo) {
    prefs.sonido = activo; guardarPrefs();
    musica.silenciar(!activo); ambiente.silenciar(!activo);
    ui.musica.classList.toggle("silenciado", !activo);
    ui.musica.setAttribute("aria-pressed", String(activo));
    if (ui.menuSonido) ui.menuSonido.textContent = activo ? "Sonido: activado" : "Sonido: silenciado";
    if (ui.btnInicioSonido) ui.btnInicioSonido.textContent = activo ? "Sonido activado" : "Sonido silenciado";
  }
  function desbloquearAudio() { musica.desbloquear(); ambiente.desbloquear(); }
  document.addEventListener("click", desbloquearAudio, { once: true });
  ui.musica.addEventListener("click", (e) => { e.stopPropagation(); desbloquearAudio(); ajustarSonido(!prefs.sonido); });

  // ---------- Fondo, negro y POV ----------

  function ponerFondo(ruta) {
    if (!ruta || ruta === fondoActual) return;
    fondoActual = ruta;
    ui.fondo.classList.add("cambiando");
    setTimeout(() => { ui.fondo.style.backgroundImage = `url("${ruta}")`; ui.fondo.classList.remove("cambiando"); }, 700);
  }
  const DURACION_CARTEL = 2600;
  let cartelTimer = null;
  let cartelPendiente = null;   // qué hacer cuando se cierre el cartel

  function mostrarCartelPov(id, alCerrar) {
    const pj = PJS[id]; if (!pj) { if (alCerrar) alCerrar(); return; }
    ui.povNombre.textContent = pj.nombre;
    ui.povNombre.style.color = pj.color || "";
    ui.povSubtitulo.textContent = pj.subtitulo || "";
    if (pj.imagen) { ui.povFicha.src = pj.imagen; ui.povFicha.style.display = ""; ui.povCartel.classList.add("con-ficha"); }
    else { ui.povFicha.style.display = "none"; ui.povCartel.classList.remove("con-ficha"); }
    ui.povCartel.classList.add("visible");
    cartelPendiente = alCerrar || null;
    clearTimeout(cartelTimer);
    cartelTimer = setTimeout(cerrarCartel, alCerrar ? DURACION_CARTEL : 4200);
  }
  function cerrarCartel() {
    clearTimeout(cartelTimer);
    if (!ui.povCartel.classList.contains("visible")) return;
    ui.povCartel.classList.remove("visible");
    const f = cartelPendiente; cartelPendiente = null;
    if (f) f();
  }
  ui.povCartel.addEventListener("click", (e) => { e.stopPropagation(); cerrarCartel(); });

  function pintarCara(el, pj) {
    el.style.backgroundImage = pj.imagen ? `url("${pj.imagen}")` : "";
    if (pj.cara) el.style.backgroundPosition = pj.cara;
    if (pj.caraZoom) el.style.backgroundSize = pj.caraZoom;
  }

  function renderEstado() {
    const pj = PJS[estado.pov];
    // Viñeta según el miedo del POV: se cierra un poco cuando tiene miedo
    const miedo = pj ? (estado.personajes[estado.pov].miedo || 0) / 100 : 0;
    document.documentElement.style.setProperty("--miedo", miedo.toFixed(2));
    if (!pj) {
      ui.povAvatar.classList.add("vacio"); ui.btnDetalles.classList.add("vacio");
      ui.detalles.classList.add("oculto");
      return;
    }
    ui.povAvatar.classList.remove("vacio"); ui.btnDetalles.classList.remove("vacio");
    pintarCara(ui.povAvatar, pj);
    ui.povAvatar.style.borderColor = pj.color || "";
    ui.povAvatar.title = pj.nombre + " · ver ficha";
    if (!ui.detalles.classList.contains("oculto")) renderDetalles();
  }

  function relacionesDe(pov) {
    if (!pov) return "";
    const o = {}; for (const q in PJS) if (q !== pov) o[q] = estado.relaciones[pov + ">" + q] || {};
    return JSON.stringify(o);
  }
  function pulsoRetrato() {
    ui.povAvatar.classList.remove("pulso"); void ui.povAvatar.offsetWidth; ui.povAvatar.classList.add("pulso");
    setTimeout(() => ui.povAvatar.classList.remove("pulso"), 2600);
  }

  // ---------- Detalles: indicadores y situación social ----------

  const BARRAS = [["miedo", "Miedo"], ["estres", "Estrés"], ["lucidez", "Lucidez"], ["intox", "Intox."]];

  function fraseSocial(p, q) {
    const r = (k) => api.relv(p, q, k);
    const fem = (PJS[q].genero || "f") === "f";
    const le = fem ? "la" : "le";
    const frases = [];
    const afecto = r("afecto"), conf = r("confianza"), res = r("resentimiento"), ten = r("tension"), cel = r("celos"), prot = r("proteccion");
    if (afecto >= 70) frases.push(fem ? "La quieres." : "Le quieres.");
    else if (afecto >= 35) frases.push(`${le.charAt(0).toUpperCase() + le.slice(1)} tienes cariño.`);
    else if (afecto <= 15 && res < 30) frases.push("Te cae bien. Sin más.");
    if (conf >= 65) frases.push(fem ? "Confías en ella." : "Confías en él.");
    else if (conf >= 35) frases.push("Te fías. Más o menos.");
    else if (conf > 0) frases.push("No te fías del todo.");
    if (prot >= 55) frases.push(fem ? "Quieres protegerla." : "Quieres protegerle.");
    if (ten >= 70) frases.push("Hay algo entre vosotros que nadie ha dicho en voz alta.");
    else if (ten >= 45) frases.push("Hay tensión. De la buena o de la otra.");
    else if (ten >= 20) frases.push("Hay historia.");
    if (cel >= 45) frases.push("Te quema verle con otra persona.");
    else if (cel >= 25) frases.push("Te molesta más de lo que admitirías.");
    if (res >= 60) frases.push(((PJS[p].genero || "f") === "f" ? "Estás dolida." : "Estás dolido.") + " Esta noche se ha pasado.");
    else if (res >= 30) frases.push("Te ha molestado algo esta noche.");
    else if (res >= 15) frases.push("Hay una espina pequeña.");
    if (!frases.length) frases.push("Nada que decir. Todavía.");
    return frases.slice(0, 3).join(" ");
  }

  function renderDetalles() {
    const id = estado.pov; const pj = PJS[id]; if (!pj) return;
    ui.detallesNombre.textContent = pj.nombre;
    ui.detallesNombre.style.color = pj.color || "";
    const FRASES_MODO = {
      perdido: "Ya no distingue lo que ve de lo que teme.",
      asustado: "Tiene miedo. Lo ambiguo le parece una amenaza.",
      tenso: "Tenso. Le cuesta pensar antes de hablar.",
      ido: "Va muy cargado. Todo llega un poco tarde.",
      lucido: "Con la cabeza despejada. Lo registra todo.",
      normal: "Como siempre. Por ahora.",
    };
    ui.detallesSubtitulo.textContent = (pj.subtitulo || "") + " · " + FRASES_MODO[api.modo(id)];
    const p = estado.personajes[id];
    ui.barras.innerHTML = "";
    BARRAS.forEach(([k, et]) => {
      const b = document.createElement("div");
      b.className = "barra " + (k === "intox" ? "intoxicacion" : k);
      b.innerHTML = `<span class="etiqueta">${et}</span><div class="pista-barra"><div class="relleno" style="width:${p[k]}%"></div></div>`;
      ui.barras.appendChild(b);
    });
    ui.social.innerHTML = "";
    const visto = estado.socialVisto || {};
    for (const q in PJS) {
      if (q === id) continue;
      const linea = document.createElement("div"); linea.className = "social-linea";
      const cara = document.createElement("div"); cara.className = "social-cara"; pintarCara(cara, PJS[q]);
      const texto = document.createElement("div"); texto.className = "social-texto";
      const nombre = document.createElement("span"); nombre.className = "social-nombre"; nombre.textContent = PJS[q].nombre;
      nombre.style.color = PJS[q].color || "";
      const clave = id + ">" + q;
      const actual = JSON.stringify(estado.relaciones[clave] || {});
      if (visto[clave] !== undefined && visto[clave] !== actual) {
        const c = document.createElement("span"); c.className = "cambio"; c.textContent = "● ha cambiado"; nombre.appendChild(c);
      }
      texto.appendChild(nombre);
      texto.appendChild(document.createTextNode(fraseSocial(id, q)));
      linea.appendChild(cara); linea.appendChild(texto);
      ui.social.appendChild(linea);
    }
  }

  function alternarDetalles(e) {
    if (e) e.stopPropagation();
    const abrir = ui.detalles.classList.contains("oculto");
    if (abrir) {
      cerrarMenu(); cerrarHistorial();
      renderDetalles();
      ui.detalles.classList.remove("oculto");
      ui.btnDetalles.textContent = "Cerrar";
    } else {
      const id = estado.pov; estado.socialVisto = estado.socialVisto || {};
      for (const q in PJS) { if (q !== id) { const k = id + ">" + q; estado.socialVisto[k] = JSON.stringify(estado.relaciones[k] || {}); } }
      ui.detalles.classList.add("oculto");
      ui.btnDetalles.textContent = "Ver detalles";
      guardar();
    }
  }
  ui.btnDetalles.addEventListener("click", alternarDetalles);
  ui.povAvatar.addEventListener("click", (e) => { e.stopPropagation(); if (estado.pov) mostrarCartelPov(estado.pov); });
  ui.detalles.addEventListener("click", (e) => e.stopPropagation());

  // ---------- Menú ----------

  function abrirMenu() { cerrarHistorial(); if (!ui.detalles.classList.contains("oculto")) alternarDetalles(); ui.menu.classList.remove("oculto"); ui.btnMenu.setAttribute("aria-expanded", "true"); }
  function cerrarMenu() { ui.menu.classList.add("oculto"); ui.btnMenu.setAttribute("aria-expanded", "false"); ui.reinicioConfirmar.classList.add("oculto"); ui.menuReiniciar.classList.remove("oculto"); }
  ui.btnMenu.addEventListener("click", (e) => { e.stopPropagation(); if (ui.menu.classList.contains("oculto")) abrirMenu(); else cerrarMenu(); });
  ui.menu.addEventListener("click", (e) => e.stopPropagation());
  ui.menuSonido.addEventListener("click", () => { desbloquearAudio(); ajustarSonido(!prefs.sonido); });
  ui.menuAuto.addEventListener("click", () => { ajustarAuto(!prefs.auto); });
  ui.menuHistorial.addEventListener("click", () => { cerrarMenu(); abrirHistorial(); });
  ui.menuInicio.addEventListener("click", () => { cerrarMenu(); mostrarInicio(true); });
  ui.menuReiniciar.addEventListener("click", () => { ui.menuReiniciar.classList.add("oculto"); ui.reinicioConfirmar.classList.remove("oculto"); });
  ui.reiniciarSi.addEventListener("click", () => { cerrarMenu(); reiniciar(); });
  ui.reiniciarNo.addEventListener("click", () => { ui.reinicioConfirmar.classList.add("oculto"); ui.menuReiniciar.classList.remove("oculto"); });
  document.addEventListener("click", () => { cerrarMenu(); });

  function ajustarAuto(activo) {
    prefs.auto = activo; guardarPrefs();
    ui.menuAuto.textContent = activo ? "Lectura automática: activada" : "Lectura automática: desactivada";
    if (activo) programarAuto(); else clearTimeout(autoTimer);
  }

  // ---------- Historial ----------

  function abrirHistorial() {
    ui.historialLista.innerHTML = "";
    const h = estado.historial || [];
    if (!h.length) { const p = document.createElement("p"); p.className = "historial-vacio"; p.textContent = "Todavía no hay nada que releer."; ui.historialLista.appendChild(p); }
    h.forEach((entrada) => {
      const bloque = document.createElement("section"); bloque.className = "historial-bloque";
      const cab = document.createElement("h3");
      const pj = PJS[entrada.pov];
      cab.textContent = [entrada.titulo, [entrada.hora, capitalizar(entrada.lugar)].filter(Boolean).join(" · "), pj ? pj.nombre : ""].filter(Boolean).join("  ·  ");
      if (pj && pj.color) cab.style.color = pj.color;
      bloque.appendChild(cab);
      (entrada.lineas || []).forEach((l) => { const p = crearParrafo(l); if (p && !p.classList.contains("directiva")) { p.classList.remove("oculto"); bloque.appendChild(p); } });
      if (entrada.eleccion) { const e = document.createElement("p"); e.className = "historial-eleccion"; e.textContent = "→ " + entrada.eleccion; bloque.appendChild(e); }
      ui.historialLista.appendChild(bloque);
    });
    ui.historial.classList.remove("oculto");
    ui.historialLista.scrollTop = ui.historialLista.scrollHeight;
  }
  function cerrarHistorial() { ui.historial.classList.add("oculto"); }
  ui.btnHistorialCerrar.addEventListener("click", (e) => { e.stopPropagation(); cerrarHistorial(); });
  ui.historial.addEventListener("click", (e) => e.stopPropagation());

  function registrarEnHistorial(op) {
    if (!escenaActual) return;
    const reveladas = lineasEscena.filter((l, i) => i < lineasEscena.length - golpes.length);
    const entrada = {
      id: estado.escena, titulo: ui.titulo.textContent, hora: estado.hora, lugar: estado.lugar, pov: estado.pov,
      lineas: reveladas.slice(0, 120), eleccion: op ? String(resolver(op.texto) || (PJS[op.id] ? PJS[op.id].nombre : "")) : null,
    };
    estado.historial = estado.historial || [];
    estado.historial.push(entrada);
    if (estado.historial.length > 40) estado.historial.shift();
  }

  // ---------- Texto por golpes ----------

  const normaliza = (s) => s.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const capitalizar = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

  function crearParrafo(linea) {
    const p = document.createElement("p");
    p.className = "oculto";
    const dir = linea.match(/^\[([a-z_]+)(?::([a-z0-9_]+))?\]$/i);
    const pens = linea.match(/^~\s*(.*)$/s);
    const dial = linea.match(/^([^:\n]{1,40}):\s+(.*)$/s);
    if (dir) {
      p.classList.add("directiva"); p.dataset.directiva = dir[1].toLowerCase(); if (dir[2]) p.dataset.arg = dir[2];
    } else if (linea === "..." || linea === "…") {
      p.classList.add("silencio"); p.textContent = "· · ·";
    } else if (pens) {
      p.classList.add("pensamiento"); p.textContent = pens[1];
    } else if (dial && PJS[normaliza(dial[1])]) {
      const pj = PJS[normaliza(dial[1])];
      p.classList.add("dialogo");
      const q = document.createElement("span"); q.className = "hablante"; q.textContent = pj.nombre;
      if (pj.color) { q.style.color = pj.color; p.style.borderLeftColor = pj.color; }
      p.appendChild(q); p.appendChild(document.createTextNode(dial[2]));
    } else {
      p.textContent = linea;
      if (linea.length <= 42) p.classList.add("corto");
    }
    return p;
  }

  function prepararTexto(texto) {
    ui.texto.innerHTML = "";
    lineasEscena = String(texto || "").trim().split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
    golpes = lineasEscena.map(crearParrafo);
    golpes.forEach((p) => ui.texto.appendChild(p));
  }

  const EFECTOS_VISUALES = ["negro", "luz", "parpadeo", "temblor", "corte"];
  function ejecutarDirectiva(d, arg, rapido) {
    switch (d) {
      case "negro": ui.negro.classList.add("visible"); break;
      case "luz": ui.negro.classList.remove("visible"); break;
      case "parpadeo": if (!rapido) { ui.fondo.classList.remove("parpadeo"); void ui.fondo.offsetWidth; ui.fondo.classList.add("parpadeo"); sfx.clic(); setTimeout(() => ui.fondo.classList.remove("parpadeo"), 1700); } break;
      case "temblor": if (!rapido) { ui.app.classList.remove("temblor"); void ui.app.offsetWidth; ui.app.classList.add("temblor"); setTimeout(() => ui.app.classList.remove("temblor"), 700); } break;
      case "golpe": case "toc": case "clic": case "campanilla": case "arrastre": if (!rapido) sfx[d](); break;
      case "corte": musica.cortar(); break;
      case "silencio": musica.poner(null); break;
      case "musica": musica.poner(arg || null); break;
      default: break;
    }
  }

  const esParada = (p) => p.classList.contains("dialogo") || p.classList.contains("pensamiento") || p.classList.contains("silencio") || p.classList.contains("corto");

  // Un golpe de lectura: narración agrupada hasta una parada (diálogo, pensamiento, silencio, frase corta)
  function revelarGolpe() {
    let mostrados = 0, narracion = 0, ultimo = null;
    while (golpes.length) {
      const p = golpes[0];
      if (p.classList.contains("directiva")) {
        if (EFECTOS_VISUALES.includes(p.dataset.directiva) && mostrados) break;   // el efecto abre el golpe siguiente
        golpes.shift(); ejecutarDirectiva(p.dataset.directiva, p.dataset.arg, false); continue;
      }
      golpes.shift(); p.classList.remove("oculto"); mostrados++; ultimo = p;
      if (esParada(p)) break;
      narracion++;
      if (narracion >= 3) break;
    }
    ui.escena.scrollTo({ top: ui.escena.scrollHeight, behavior: "smooth" });
    actualizarPista();
    if (!golpes.length) terminarTexto();
    else if (prefs.auto) programarAuto(ultimo);
  }

  function revelarTodo() {
    while (golpes.length) {
      const p = golpes.shift();
      if (p.classList.contains("directiva")) { ejecutarDirectiva(p.dataset.directiva, p.dataset.arg, true); continue; }
      p.classList.remove("oculto");
    }
    ui.escena.scrollTo({ top: ui.escena.scrollHeight, behavior: "smooth" });
    actualizarPista();
    terminarTexto();
  }

  function actualizarPista() {
    const restan = golpes.filter((p) => !p.classList.contains("directiva")).length;
    ui.pista.textContent = restan ? `▾ ${restan}` : "";
  }

  let autoTimer = null;
  function programarAuto(ultimo) {
    clearTimeout(autoTimer);
    if (!prefs.auto || !golpes.length || ui.povCartel.classList.contains("visible")) return;
    const len = ultimo ? (ultimo.textContent || "").length : 60;
    let espera = 900 + Math.min(len, 320) * 38;
    if (ultimo && ultimo.classList.contains("silencio")) espera += 1400;
    if (ultimo && ultimo.classList.contains("corto")) espera += 500;
    autoTimer = setTimeout(() => { if (prefs.auto && golpes.length) revelarGolpe(); }, espera);
  }

  function terminarTexto() {
    clearTimeout(autoTimer);
    ui.pista.classList.add("oculto");
    ui.escena.classList.add("sin-mas");
    if (!escenaActual) return;
    let r = renderPersonajes(escenaActual, 0.2);
    renderOpciones(escenaActual, r);
    setTimeout(() => {
      ui.escena.scrollTo({ top: ui.escena.scrollHeight, behavior: "smooth" });
      const primero = ui.personajes.querySelector("button") || ui.opciones.querySelector("button");
      if (primero) primero.focus({ preventScroll: true });
    }, 250);
  }

  // Clic: un golpe. Mantener pulsado: avanza rápido. Con una sola opción y todo leído, clic = continuar.
  let pulsando = null, mantenido = false;
  ui.escena.addEventListener("mousedown", (e) => {
    if (e.button !== 0 || e.target.closest("button")) return;
    mantenido = false;
    pulsando = setTimeout(() => { mantenido = true; pulsando = setInterval(() => { if (golpes.length) revelarGolpe(); }, 170); }, 420);
  });
  const soltar = () => { clearTimeout(pulsando); clearInterval(pulsando); pulsando = null; };
  document.addEventListener("mouseup", soltar);
  document.addEventListener("mouseleave", soltar);
  ui.escena.addEventListener("click", (e) => {
    if (e.target.closest("button")) return;
    if (!ui.detalles.classList.contains("oculto")) { alternarDetalles(); return; }
    if (mantenido) { mantenido = false; return; }
    if (ui.povCartel.classList.contains("visible")) { cerrarCartel(); return; }
    if (golpes.length) { revelarGolpe(); return; }
    const opciones = ui.opciones.querySelectorAll("button.opcion");
    if (opciones.length === 1 && !ui.personajes.children.length && escenaActual && !resolver(escenaActual.final)) opciones[0].click();
  });
  ui.saltar.addEventListener("click", (e) => { e.stopPropagation(); cerrarCartel(); revelarTodo(); });
  document.addEventListener("keydown", (e) => {
    if (e.target && /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)) return;
    if (!ui.inicio.classList.contains("oculto")) return;
    if (e.key === "Escape") { cerrarMenu(); cerrarHistorial(); cerrarCartel(); if (!ui.detalles.classList.contains("oculto")) alternarDetalles(); return; }
    if (e.key === " " || e.key === "Enter" || e.key === "ArrowRight") {
      if (e.target && e.target.tagName === "BUTTON" && e.key !== "ArrowRight") return;   // activar el botón enfocado
      if (ui.povCartel.classList.contains("visible")) { e.preventDefault(); cerrarCartel(); return; }
      if (golpes.length) { e.preventDefault(); revelarGolpe(); }
    }
    if (e.key === "ArrowDown") { e.preventDefault(); cerrarCartel(); revelarTodo(); }
    if (e.key === "a" || e.key === "A") ajustarAuto(!prefs.auto);
    if (e.key === "h" || e.key === "H") { if (ui.historial.classList.contains("oculto")) abrirHistorial(); else cerrarHistorial(); }
  });

  // ---------- Cartas y opciones ----------

  function renderPersonajes(escena, retraso) {
    ui.personajes.innerHTML = "";
    const lista = (escena.personajes || []).filter((c) => !c.si || c.si(api));
    lista.forEach((c, i) => {
      const base = PJS[c.id] || {};
      const btn = document.createElement("button");
      btn.className = "carta"; btn.type = "button";
      btn.style.animationDelay = (retraso + i * 0.15) + "s";
      const imagen = c.imagen || base.imagen;
      if (imagen) {
        const img = document.createElement("img"); img.src = imagen; img.alt = base.nombre || c.id;
        img.addEventListener("error", () => { const ph = document.createElement("div"); ph.className = "sin-imagen"; ph.textContent = "?"; img.replaceWith(ph); });
        btn.appendChild(img);
      }
      const n = document.createElement("span"); n.className = "carta-nombre"; n.textContent = base.nombre || c.id;
      if (base.color) n.style.color = base.color; btn.appendChild(n);
      const desc = resolver(c.descripcion);
      if (desc) { const d = document.createElement("span"); d.className = "carta-desc"; d.textContent = desc; btn.appendChild(d); }
      btn.addEventListener("click", (e) => { e.stopPropagation(); elegir(c, btn); });
      ui.personajes.appendChild(btn);
    });
    return retraso + lista.length * 0.15;
  }

  function renderOpciones(escena, retraso) {
    ui.opciones.innerHTML = "";
    if (resolver(escena.final)) {
      const btn = document.createElement("button");
      btn.className = "opcion"; btn.type = "button"; btn.textContent = "Volver al principio";
      btn.style.animationDelay = retraso + "s";
      btn.addEventListener("click", (e) => { e.stopPropagation(); reiniciar(); });
      ui.opciones.appendChild(btn); return;
    }
    const povId = estado.pov;
    const visibles = (escena.opciones || []).filter((op) => {
      if (op.si && !op.si(api)) return false;
      if (op.lucida && povId && !api.lucido(povId)) return false;
      if (op.impulsiva && povId) { const p = estado.personajes[povId]; if (p.estres < 55 && p.miedo < 55) return false; }
      return true;
    });
    visibles.forEach((op, i) => {
      const btn = document.createElement("button");
      btn.className = "opcion" + (op.pov ? " pov-" + op.pov : ""); btn.type = "button";
      if (op.pov && PJS[op.pov]) { const q = document.createElement("span"); q.className = "quien"; q.textContent = PJS[op.pov].nombre; btn.appendChild(q); }
      btn.appendChild(document.createTextNode(resolver(op.texto)));
      btn.style.animationDelay = (retraso + i * 0.12) + "s";
      btn.addEventListener("click", (e) => { e.stopPropagation(); elegir(op, btn); });
      ui.opciones.appendChild(btn);
    });
  }

  // ---------- Escena ----------

  function avanzarConsumo() {
    const c = estado.consumo || {};
    for (const id in c) {
      c[id] = c[id].filter((x) => {
        api.est(id, "intox", x.intox);
        if (x.lucidez && api.valor(id, "lucidez") > 20) api.est(id, "lucidez", x.lucidez);
        if (x.estres) api.est(id, "estres", x.estres);
        if (x.restante !== Infinity && x.restante !== null) x.restante -= 1;
        return x.restante === null || x.restante > 0;
      });
      c[id].forEach((x) => { if (x.restante === Infinity) x.restante = null; });
    }
  }
  function aplicarDeriva() {
    const d = (HISTORIA.deriva || {})[estado.fase];
    if (!d) return;
    for (const id in PJS) for (const k in d) {
      const p = estado.personajes[id];
      p[k] = clamp((p[k] || 0) + d[k], 0, 100);
    }
  }
  function dinamica() {
    for (const id in PJS) {
      const p = estado.personajes[id];
      if (p.estres >= 65) p.lucidez = clamp(p.lucidez - 1, 0, 100);
      if (p.miedo >= 65) p.lucidez = clamp(p.lucidez - 0.5, 0, 100);
      if (p.intox >= 65) p.lucidez = clamp(p.lucidez - 0.5, 0, 100);
      if (p.estres < 40 && p.miedo < 40 && p.intox < 50) p.lucidez = clamp(p.lucidez + 0.5, 0, 100);
      if (p.lucidez < 20 && !estado.banderas[id + "_perdido"]) estado.banderas[id + "_perdido"] = true;
      if (p.lucidez > 35 && estado.banderas[id + "_perdido"]) estado.banderas[id + "_perdido"] = false;
    }
    for (const a in PJS) for (const b in PJS) {
      if (a === b) continue;
      const afecto = api.relv(a, b, "afecto");
      if (afecto < 55) continue;
      const diff = estado.personajes[b].miedo - estado.personajes[a].miedo;
      if (diff > 10) estado.personajes[a].miedo = clamp(estado.personajes[a].miedo + diff * 0.05, 0, 100);
    }
  }
  function trazar(id) {
    estado.traza = estado.traza || [];
    const fila = { escena: id };
    for (const pj in PJS) { const p = estado.personajes[pj]; fila[pj] = [p.miedo, p.estres, p.lucidez, p.intox].map((v) => Math.round(v)); }
    estado.traza.push(fila);
    if (estado.traza.length > 400) estado.traza.shift();
  }

  function renderMeta() {
    const partes = [estado.hora, capitalizar(estado.lugar)].filter(Boolean);
    ui.meta.textContent = partes.join("  ·  ");
    ui.meta.classList.toggle("oculto", !partes.length);
  }

  function mostrarEscena(id, yaLeida = false) {
    const escena = HISTORIA.escenas[id];
    if (!escena) { console.error("Escena no encontrada:", id); return; }
    const esNueva = estado.escena !== id && !estado.visitadas[id];
    escenaActual = escena;
    clearTimeout(autoTimer);
    if (esNueva) {
      avanzarConsumo();
      aplicarDeriva();
      dinamica();
      const c = resolver(escena.consumo);
      if (Array.isArray(c)) c.forEach(([quien, tipo]) => api.consumir(quien, tipo));
      trazar(id);
    }
    estado.escena = id;

    if (escena.pov !== undefined) estado.pov = resolver(escena.pov);
    const cambioPov = estado.pov && estado.pov !== povAnterior;
    const relAntes = cambioPov ? null : relPrev;
    if (!estado.visitadas[id] && typeof escena.alEntrar === "function") escena.alEntrar(api);
    estado.visitadas[id] = true;

    // Pulso en el retrato si las relaciones del POV han cambiado desde la escena anterior
    const relAhora = relacionesDe(estado.pov);
    if (!yaLeida && relAntes !== null && relAntes !== relAhora) pulsoRetrato();
    relPrev = relAhora;

    ponerFondo(resolver(escena.fondo));
    musica.poner(resolver(escena.musica));
    ambiente.poner(resolver(escena.ambiente));
    if (escena.lugar !== undefined) estado.lugar = resolver(escena.lugar);
    if (escena.hora !== undefined) estado.hora = resolver(escena.hora);
    ui.negro.classList.remove("visible");

    povAnterior = estado.pov;

    ui.escena.classList.toggle("final", Boolean(resolver(escena.final)));
    ui.escena.classList.remove("sin-mas");
    ui.titulo.textContent = resolver(escena.titulo) || "";
    renderMeta();
    ui.personajes.innerHTML = ""; ui.opciones.innerHTML = "";
    ui.pista.classList.remove("oculto");
    prepararTexto(resolver(escena.texto));
    actualizarPista();
    ui.escena.scrollTop = 0;
    renderEstado();
    guardar();

    if (yaLeida) { revelarTodo(); return; }
    const arrancar = () => { revelarGolpe(); };
    if (cambioPov) mostrarCartelPov(estado.pov, arrancar);
    else setTimeout(arrancar, 250);
  }

  function elegir(op, btn) {
    if (btn) { btn.classList.add("elegida"); }
    registrarEnHistorial(op);
    ui.escena.classList.add("saliendo");
    setTimeout(() => {
      if (typeof op.efecto === "function") op.efecto(api);
      if (escenaActual && Array.isArray(escenaActual.personajes)) {
        escenaActual.personajes
          .filter((c) => c !== op && (!c.si || c.si(api)) && typeof c.auto === "function")
          .forEach((c) => c.auto(api));
      }
      mostrarEscena(resolver(op.a));
      ui.escena.classList.remove("saliendo");
    }, 280);
  }

  function reiniciar() {
    borrarGuardado();
    estado = estadoInicial(); fondoActual = null; povAnterior = null; relPrev = null;
    ocultarInicio();
    mostrarEscena(estado.escena);
  }

  // ---------- Pantalla de inicio ----------

  function hayPartida() { return Boolean(estado && estado.visitadas && Object.keys(estado.visitadas).length >= 1 && estado.escena !== HISTORIA.inicio); }
  function mostrarInicio(desdeMenu) {
    const continuar = hayPartida();
    ui.btnContinuar.classList.toggle("oculto", !continuar);
    if (continuar) {
      const e = HISTORIA.escenas[estado.escena] || {};
      const t = typeof e.titulo === "string" ? e.titulo : "";
      ui.inicioDonde.textContent = [estado.hora, capitalizar(estado.lugar), t].filter(Boolean).join("  ·  ");
    } else ui.inicioDonde.textContent = "";
    ui.btnNueva.textContent = continuar ? "Nueva partida" : "Empezar";
    ui.btnNueva.dataset.confirmar = "";
    ui.inicio.classList.remove("oculto");
    ui.app.classList.add("velado"); ui.estado.classList.add("oculto");
    if (!desdeMenu) ponerFondo((HISTORIA.portada && HISTORIA.portada.fondo) || null);
    document.documentElement.style.setProperty("--miedo", "0");
  }
  function ocultarInicio() {
    ui.inicio.classList.add("oculto");
    ui.app.classList.remove("velado"); ui.estado.classList.remove("oculto");
  }
  ui.btnContinuar.addEventListener("click", (e) => {
    e.stopPropagation(); desbloquearAudio(); ocultarInicio();
    fondoActual = null;
    mostrarEscena(estado.escena, true);
  });
  ui.btnNueva.addEventListener("click", (e) => {
    e.stopPropagation(); desbloquearAudio();
    if (hayPartida() && !ui.btnNueva.dataset.confirmar) { ui.btnNueva.dataset.confirmar = "1"; ui.btnNueva.textContent = "¿Seguro? Se perderá la partida guardada"; return; }
    reiniciar();
  });
  ui.btnInicioSonido.addEventListener("click", (e) => { e.stopPropagation(); desbloquearAudio(); ajustarSonido(!prefs.sonido); });
  ui.inicio.addEventListener("click", (e) => e.stopPropagation());

  // ---------- Saltos de prueba: selector "Ir a…" y #id en la URL ----------

  if (ui.irA) {
    if (!DEBUG) ui.irA.classList.add("oculto");
    for (const id in HISTORIA.escenas) {
      const e = HISTORIA.escenas[id];
      const op = document.createElement("option");
      op.value = id;
      const t = typeof e.titulo === "string" ? e.titulo : "";
      op.textContent = id + (t ? " · " + t : "");
      ui.irA.appendChild(op);
    }
    ui.irA.addEventListener("click", (e) => e.stopPropagation());
    ui.irA.addEventListener("change", (e) => {
      e.stopPropagation();
      const id = ui.irA.value; if (!id) return;
      ui.irA.value = "";
      saltarA(id);
    });
  }

  function saltarA(id) {
    if (!HISTORIA.escenas[id]) return;
    estado = estadoInicial(); fondoActual = null; povAnterior = null; relPrev = null;
    if (typeof HISTORIA.prepararSalto === "function") HISTORIA.prepararSalto(api, id);
    let f, a, m;
    for (const k in HISTORIA.escenas) {
      if (k === id) break;
      const e = HISTORIA.escenas[k];
      if (typeof e.fondo === "string") f = e.fondo;
      if (typeof e.ambiente === "string") a = e.ambiente;
      if (e.musica !== undefined && typeof e.musica !== "function") m = e.musica;
    }
    const destino = HISTORIA.escenas[id];
    if (destino.fondo === undefined && f) ponerFondo(f);
    if (destino.ambiente === undefined && a) ambiente.poner(a);
    if (destino.musica === undefined && m !== undefined) musica.poner(m);
    ocultarInicio();
    mostrarEscena(id);
  }

  // ---------- Arranque ----------

  ajustarSonido(prefs.sonido);
  ajustarAuto(prefs.auto);
  const cargado = cargar();
  estado = cargado || estadoInicial();
  const hash = decodeURIComponent(location.hash.replace(/^#/, "")).replace(/[?&]?debug$/, "");
  if (hash && HISTORIA.escenas[hash]) saltarA(hash);
  else mostrarInicio(false);
  window.addEventListener("hashchange", () => {
    const h = decodeURIComponent(location.hash.replace(/^#/, "")).replace(/[?&]?debug$/, "");
    if (h && HISTORIA.escenas[h]) saltarA(h);
  });

  window.BRUJA = {
    estado: () => estado, api, ir: (id) => { ocultarInicio(); mostrarEscena(id, true); },
    nueva: () => { borrarGuardado(); estado = estadoInicial(); fondoActual = null; povAnterior = null; relPrev = null; ocultarInicio(); mostrarEscena(estado.escena, true); },
    traza: () => (estado.traza || []).map((f) => f.escena + "  N" + f.nora.join("/") + "  M" + f.marcos.join("/") + "  A" + f.alex.join("/") + "  I" + f.irene.join("/")).join("\n"),
    sfx, musica, ambiente,
  };
})();
