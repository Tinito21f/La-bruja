/*
 * LA BRUJA — PRÓLOGO
 * Reglas fijas de las fases VI a XII (docs/BIBLIA_PROLOGO.md, secciones 14 a 26).
 *
 * No contiene escenas. Expone HISTORIA.R con las piezas que comparten las fases finales:
 *   - el huésped: nivel, alimento, lapsos, aliento (cambio de cuerpo), intrusiones desde dentro
 *   - heridas (cojera · mano · sangra · sentido), objetos a mano, necesidades
 *   - las siete ofrendas (contador oculto)
 *   - el límite: cruzar, el reloj de la condena, percepción no fiable
 *   - contacto que consuela y propaga
 *   - las voces: lo dicho por cada uno (api.dichos) o un catálogo mínimo
 *   - muertes: registro, vivos, «los que quedan»
 * Todo son banderas. Nada de esto se lee nunca en pantalla.
 */
(() => {
  const PJ = ["nora", "marcos", "alex", "irene"];
  const R = {
    PJ,
    nombre: { nora: "Nora", marcos: "Marcos", alex: "Álex", irene: "Irene" },
    modo: (api, id, m) => m[api.modo(id)] || m.normal,

    // ---------- El huésped ----------
    huesped: (api) => api.bandera("huesped"),
    nivel: (api) => api.bandera("huesped_nivel") || 0,
    subirNivel: (api, n) => { if (n > (api.bandera("huesped_nivel") || 0)) api.marcar("huesped_nivel", n); },
    // Alimentarlo acelera: a solas repetidas veces, un beso o un boca a boca más, no defenderse, consolarle con las manos.
    alimentar: (api, cuanto = 1) => api.marcar("huesped_comida", (api.bandera("huesped_comida") || 0) + cuanto),
    comida: (api) => api.bandera("huesped_comida") || 0,
    acelerado: (api) => (api.bandera("huesped_comida") || 0) >= 3,
    aSolas: (api, otro) => { api.marcar("huesped_solas", (api.bandera("huesped_solas") || 0) + 1); api.marcar("huesped_ultimo_solas", otro); R.alimentar(api, 1); },
    lapso: (api) => {
      const n = (api.bandera("lapsos") || 0) + 1;
      api.marcar("lapsos", n); api.marcar("huesped_lapso", true);
      if (n >= 3) R.ofrenda(api, "recuerdo");       // el recuerdo, en el tercer lapso
    },
    // Regla oculta del aliento: entró por el aliento y solo sale por el aliento. No se destruye: se mueve.
    aliento: (api, de, a) => {
      if (api.bandera("huesped") !== de || !a || de === a) return false;
      api.marcar("huesped", a);
      api.marcar("huesped_anterior", de);
      api.marcar("huesped_pasos", (api.bandera("huesped_pasos") || 0) + 1);
      return true;
    },
    esHuesped: (api, id) => api.bandera("huesped") === id,
    // Pensamientos que no son suyos. Se incrustan en las líneas ~ del POV portador (nivel 1: extrañeza; 2: hostilidad; 3: impulso).
    intrusion: (api, id, n) => {
      const nivel = n || R.nivel(api);
      const L = {
        marcos: { 1: ["Abajo.", "Aliento."], 2: ["Todavía no.", "Que no salga nadie.", "Ella se queda."], 3: ["Sujétala.", "Que se calle.", "Abajo. Con todos."] },
        irene:  { 1: ["Aliento.", "La camisa. Habría que quitársela."], 2: ["Todavía no.", "Que no se vaya él.", "Que se quede conmigo."], 3: ["Ciérrale la boca.", "El agua. Llévale al agua.", "Abajo."] },
        alex:   { 1: ["Sal.", "Abajo."], 2: ["Todavía no.", "Que no se vayan."], 3: ["Sal. Si estás ahí, sal.", "Abajo."] },
        nora:   { 1: ["Abajo.", "Aliento."], 2: ["Todavía no.", "Empieza fuera."], 3: ["Abajo.", "Los tres salieron."] },
      };
      const lista = (L[id] || L.nora)[Math.max(1, Math.min(3, nivel))];
      const k = (api.bandera("lapsos") || 0) + (api.bandera("huesped_solas") || 0);
      return lista[k % lista.length];
    },

    // ---------- Heridas: cuatro estados físicos, sin curación ----------
    HERIDAS: ["cojera", "mano", "sangra", "sentido"],
    herir: (api, id, tipo, como) => {
      const h = Object.assign({}, api.bandera("herida_" + id) || {});
      if (h[tipo]) return false;
      h[tipo] = como || true;
      api.marcar("herida_" + id, h);
      api.est(id, "miedo", 6); api.est(id, "estres", 8);
      if (tipo === "sangra") R.ofrenda(api, "sangre");
      if (tipo === "cojera" && como === "fractura") R.ofrenda(api, "hueso");
      if (tipo === "mano" && como === "mordisco") R.ofrenda(api, "carne");
      if (tipo === "mano") api.marcar("mano_" + id, null);   // la cojera cierra correr y cargar, no sujetar (§19)
      return true;
    },
    herido: (api, id, tipo) => Boolean((api.bandera("herida_" + id) || {})[tipo]),
    heridas: (api, id) => Object.keys(api.bandera("herida_" + id) || {}),
    tullido: (api, id) => R.heridas(api, id).length > 0,
    puedeCorrer: (api, id) => !R.herido(api, id, "cojera"),
    dosManos: (api, id) => !R.herido(api, id, "mano") && !api.bandera("mano_" + id),
    // Cómo se lee la herida desde fuera, en una frase
    heridaTexto: (api, id) => {
      const h = api.bandera("herida_" + id) || {};
      const t = [];
      if (h.cojera) t.push("cojea");
      if (h.mano) t.push("lleva la mano pegada al cuerpo");
      if (h.sangra) t.push("va dejando gotas");
      if (h.sentido) t.push("gira la cabeza para oír");
      return t.join(", ");
    },

    // ---------- Objetos a mano, sin inventario: uno, y el texto lo dice ----------
    OBJETOS: {
      sarten: "la sartén de hierro", atizador: "el atizador", linterna: "la linterna grande",
      cuerda: "la cuerda de la trampilla", botella: "la botella", llave: "la llave inglesa", martillo: "el martillo",
    },
    mano: (api, id) => api.bandera("mano_" + id) || null,
    coger: (api, id, obj) => { const antes = api.bandera("mano_" + id) || null; api.marcar("mano_" + id, obj); return antes; },
    soltar: (api, id) => api.marcar("mano_" + id, null),
    lleva: (api, id, obj) => api.bandera("mano_" + id) === obj,
    quienLleva: (api, obj) => PJ.find((p) => api.bandera("mano_" + p) === obj) || null,

    // ---------- Necesidades: la dominante, fijada por las escenas ----------
    NECESIDADES: ["frio", "sed", "herida", "mear", "fumar", "sueno"],
    necesidad: (api, id, n) => { if (n !== undefined) api.marcar("nec_" + id, n); return api.bandera("nec_" + id) || null; },
    // A dónde va cada necesidad cuando no se lleva al personaje
    destino: (nec) => ({ frio: "arriba", sed: "cocina", herida: "bano", mear: "bano", fumar: "porche", sueno: "salon" })[nec] || "salon",

    // ---------- Las siete ofrendas ----------
    OFRENDAS: ["nombre", "aliento", "sangre", "hueso", "carne", "recuerdo", "alma"],
    ofrenda: (api, cual) => { if (!api.bandera("ofrenda_" + cual)) { api.marcar("ofrenda_" + cual, true); return true; } return false; },
    ofrendas: (api) => R.OFRENDAS.filter((o) => api.bandera("ofrenda_" + o)).length,
    // Lo ya dado antes de la VI: el nombre (la ouija) y el aliento (el rescate, o el ahogo mismo)
    ofrendasPrevias: (api) => {
      if (api.bandera("voz_desertor") || api.bandera("alda_visto")) R.ofrenda(api, "nombre");
      if (api.bandera("contacto")) R.ofrenda(api, "aliento");
    },

    // ---------- El límite y el reloj de la condena ----------
    cruzar: (api, id) => {
      if (api.bandera("condena_" + id) !== undefined) return false;
      api.marcar("condena_" + id, 0);
      api.marcar("cruzo_" + id, true);
      if (!api.bandera("primer_cruce")) api.marcar("primer_cruce", id);
      api.marcar("cruces", (api.bandera("cruces") || 0) + 1);
      return true;
    },
    marcado: (api, id) => api.bandera("condena_" + id) !== undefined && R.vivo(api, id),
    marcados: (api) => PJ.filter((p) => R.marcado(api, p)),
    reloj: (api, id) => api.bandera("condena_" + id),
    // Cada escena nueva de la VI en adelante avanza los relojes. La muerte cae cuando el reloj está maduro y el personaje está solo.
    tick: (api) => {
      PJ.forEach((p) => { const c = api.bandera("condena_" + p); if (c !== undefined && R.vivo(api, p)) api.marcar("condena_" + p, c + 1); });
    },
    maduro: (api, id, min = 4) => R.marcado(api, id) && (api.bandera("condena_" + id) || 0) >= min,
    fuera: (api, id, v) => { if (v !== undefined) api.marcar("fuera_" + id, v); return Boolean(api.bandera("fuera_" + id)); },
    // Percepción no fiable: fuera de la luz, perdido o ido, un sentido dañado, o el huésped desde dentro a nivel 2 o más.
    fiable: (api, id) => !R.fuera(api, id) && !["perdido", "ido"].includes(api.modo(id)) && !R.herido(api, id, "sentido") && !(R.esHuesped(api, id) && R.nivel(api) >= 2),

    // ---------- Contacto: consuela y propaga ----------
    contacto: (api, a, b, intensidad = 1) => {
      api.est(a, "miedo", -3 * intensidad); api.est(b, "miedo", -3 * intensidad);
      api.rel(a, b, "afecto", 2 * intensidad); api.rel(b, a, "afecto", 2 * intensidad);
      const h = api.bandera("huesped");
      if (h === a || h === b) { api.marcar("huesped_contacto", (api.bandera("huesped_contacto") || 0) + 1); R.alimentar(api, 1); }
    },

    // ---------- Las voces ----------
    // Lo que la casa ha aprendido: primero lo que el jugador eligió que dijeran; si no hay nada, un catálogo mínimo de la fiesta.
    CATALOGO: {
      nora:   ["Para la luz.", "No fumo.", "Nada.", "¿Qué?"],
      marcos: ["Efecto ideomotor. Lo digo para que conste.", "Todo el mundo se queda aquí.", "Ratas.", "Voy a mirar el cuadro de luces."],
      alex:   ["Confía en mí.", "Venga. Si estás ahí, sal.", "Salgo a fumar. Aquí dentro huele a velatorio.", "¿Vienes? Lío otro."],
      irene:  ["Estoy bien. Seguid.", "Ya.", "Nada.", "Tengo frío."],
    },
    voz: (api, id, n) => {
      const d = typeof api.dicho === "function" ? api.dicho(id, n) : null;
      if (d) return d;
      const c = R.CATALOGO[id] || R.CATALOGO.nora;
      return c[n === undefined ? 0 : ((n % c.length) + c.length) % c.length];
    },
    // Nivel de las voces por fase: 1 nombres (V), 2 frases (VII), 3 intercambio corto (IX), 4 la propia voz (solo en condena)
    vozNivel: (api) => ({ V: 1, VI: 1, VII: 2, VIII: 2, IX: 3, X: 3, XI: 3, XII: 4 })[api.bandera("fase_actual") || "VI"] || 1,

    // ---------- Muertes y los que quedan ----------
    vivo: (api, id) => !api.bandera("muerto_" + id),
    vivos: (api) => PJ.filter((p) => !api.bandera("muerto_" + p)),
    muertos: (api) => PJ.filter((p) => api.bandera("muerto_" + p)),
    matar: (api, id, como, donde, vistoPor) => {
      if (api.bandera("muerto_" + id)) return;
      api.marcar("muerto_" + id, true);
      api.marcar("muerte_" + id, { como, donde, fase: api.bandera("fase_actual") || null, visto_por: vistoPor || null, orden: R.muertos(api).length });
      api.marcar("muertes", R.muertos(api).length);
      // El último aliento va al más cercano, o a quien primero toca el cuerpo (regla oculta, §18)
      if (api.bandera("huesped") === id && vistoPor && R.vivo(api, vistoPor)) R.aliento(api, id, vistoPor);
      R.vivos(api).forEach((p) => { api.est(p, "miedo", 15); api.est(p, "estres", 12); if (p !== "nora") api.est(p, "lucidez", -4); });
    },
    muerte: (api, id) => api.bandera("muerte_" + id) || null,
    // Enumera a los vivos en texto: «Marcos y Álex», «Irene»
    lista: (api, ids, salvo) => {
      const l = (ids || R.vivos(api)).filter((p) => p !== salvo).map((p) => R.nombre[p]);
      if (!l.length) return "nadie";
      if (l.length === 1) return l[0];
      const ult = l[l.length - 1];
      return l.slice(0, -1).join(", ") + (/^I/.test(ult) ? " e " : " y ") + ult;   // «Marcos e Irene», no «y Irene»
    },
    // Con quién está Nora cuando quedan dos
    ultimo: (api) => R.vivos(api).find((p) => p !== "nora") || null,

    // ---------- Fase: cabecera de cada fase nueva ----------
    fase: (api, nombre, horror, nivelHuesped) => {
      api.fase(nombre); api.marcar("fase_actual", nombre);
      if (horror !== undefined) api.horror(horror);
      if (nivelHuesped !== undefined) R.subirNivel(api, R.acelerado(api) ? Math.min(3, nivelHuesped + 1) : nivelHuesped);
      R.ofrendasPrevias(api);
    },

    // ---------- Saltos de prueba: lo mínimo coherente para abrir cualquier escena de la VI en adelante ----------
    saltoBase: (api) => {
      if (!api.bandera("huesped")) { api.marcar("huesped", "marcos"); api.marcar("marcos_accion", "rescate"); api.marcar("contacto", true); api.marcar("contacto_inicial", "irene"); }
      if (!api.bandera("huesped_nivel")) api.marcar("huesped_nivel", 1);
      if (api.bandera("v1_nora") === undefined) api.marcar("v1_nora", "marcos");
      if (api.bandera("v_nora_con") === undefined) api.marcar("v_nora_con", "marcos");
      if (api.bandera("v_irene_con") === undefined) api.marcar("v_irene_con", null);
      if (api.bandera("v_quedan") === undefined) api.marcar("v_quedan", null);
      if (api.bandera("v_marcos_libre") === undefined) api.marcar("v_marcos_libre", true);
      if (api.bandera("v_nora_porche") === undefined) api.marcar("v_nora_porche", false);
      if (api.bandera("v2_nora") === undefined) api.marcar("v2_nora", "marcos");
      if (api.bandera("huellas_vistas") === undefined) api.marcar("huellas_vistas", true);
      if (api.bandera("nora_toma_muneca") === undefined) api.marcar("nora_toma_muneca", true);
      if (api.bandera("alex_oyo_irene_fuera") === undefined) api.marcar("alex_oyo_irene_fuera", true);
      if (api.bandera("irene_oyo_alex_puerta") === undefined) api.marcar("irene_oyo_alex_puerta", true);
      if (api.bandera("alex_cuenta") === undefined) api.marcar("alex_cuenta", true);
      if (api.bandera("fase5_completa") === undefined) api.marcar("fase5_completa", true);
      if (!api.sabe("nora", "huellas_pequenas")) { api.saber("nora", "huellas_pequenas"); api.saber("nora", "marcas_viga"); api.saber("nora", "muneca"); }
      if (!api.sabe("marcos", "puerta_almacen")) { api.saber("marcos", "diferencial"); api.saber("marcos", "puerta_almacen"); }
      if (!api.sabe("alex", "oi_irene_fuera")) api.saber("alex", "oi_irene_fuera");
      if (!api.sabe("irene", "ahogo_real")) api.saber("irene", "ahogo_real");
      R.ofrendasPrevias(api);
    },
  };

  HISTORIA.R = R;
})();
