/*
 * LA BRUJA — PRÓLOGO
 * Fase V: Primera dispersión (HORROR_STAGE 2: percepciones privadas que se contradicen)
 *
 * Nadie explora. Se dispersan por necesidades a las tres y media: fumar, una sudadera,
 * el cuadro de luces, la cuerda de la trampilla. La configuración sale del estado:
 *   - Álex → porche, siempre. Le ofrece un porro a Nora (Nora no fuma tabaco).
 *   - Irene → arriba. Si oyó su nombre pide a Marcos que suba con ella. Si es la huésped,
 *     sube sin decir nada y se nota desde fuera.
 *   - Marcos → el cuadro de luces en el almacén, salvo que Nora o Irene se lo lleven.
 *   - Nora → decide con quién sube, no si sube (retoque 29-09-2026, Biblia §5): sola, con Marcos,
 *     con Irene, o el porche con Álex si acepta el porro (por información, no por el porro).
 *   - Los dos que quedan siembran, nunca esperan: si Nora sube con Marcos, Irene y Álex se van a su
 *     dormitorio (vq1); si sube con Irene, Álex sigue a Marcos al almacén y al porche (vq2, vq3, vq4),
 *     donde cabe el primer cruce real del límite.
 * Dos cartas (máximo dos rutas jugadas): el grupo de Nora y el grupo de la huésped (o de los que quedan).
 * Las rutas no seguidas se resuelven con las mismas banderas.
 *
 * Una percepción privada por ruta, nunca compartida, y las de dos rutas se contradicen:
 *   porche      → Álex oye a Irene desde los árboles (Irene está arriba). Nora ve gente entre los troncos.
 *   arriba      → Irene oye a Álex detrás de la puerta del baño (Álex está fuera). Marcos oye el grifo correr.
 *   almacén     → un arrastre detrás de la estantería, y la puerta antigua que no debía existir.
 *   buhardilla  → huellas pequeñas y descalzas que van y no vuelven; la viga con siete marcas; la muñeca.
 *
 * El huésped sube a nivel 1: un pensamiento que no es suyo («Abajo.», «Aliento.»), un lapso,
 * y si va acompañado y su estado o la relación lo cargan, sujeta a quien tiene al lado.
 * Marcos sujeta (brazo, tobillo). Irene sostiene una mano bajo el agua hirviendo. Ninguno se acuerda.
 *
 * Semillas para después (lore ≤ 1): huellas pequeñas y muñeca con los párpados cosidos (niña),
 * arrastre bajo el suelo y olor a tierra (lo de abajo), puerta antigua tras la estantería (sótano),
 * gente entre los árboles y olor a quemado (la condena de Nora), Irene desde el bosque (la de Álex).
 *
 * Presupuesto de anomalías Fase V: 4 → voz_fuera · gente_arboles · voz_alex_puerta · arrastre_almacen · trampilla_cierra
 */
(() => {
  const modo = (api, id, m) => m[api.modo(id)] || m.normal;
  const H = (api) => api.bandera("huesped");
  const noraCon = (api) => api.bandera("v_nora_con");     // tramo 1: "alex" | null · tramo 2: "marcos" | "irene" | null (con quién sube)
  const noraPorche = (api) => Boolean(api.bandera("v_nora_porche"));   // tramo 1: Nora salió al porche con Álex
  const ireneCon = (api) => api.bandera("v_irene_con");   // tramo 1: "marcos" | null
  const quedan = (api) => api.bandera("v_quedan") || null; // tramo 2: "irene_alex" | "alex_marcos" | null: los dos que quedan cuando Nora sube acompañada
  const R = () => HISTORIA.R;                              // reglas de las fases VI en adelante (js/story_reglas.js); existen al ejecutar
  // Dos tramos (30-09-2026). Tramo 1 (03:30): cada uno a su necesidad; Nora al porche con Álex o en la mesa con la tabla.
  // Tramo 2 (03:42): todos de vuelta, la cuerda se mueve y Nora sube: sola, con Marcos o con Irene. Los que quedan siembran.
  // Las rutas no seguidas se resuelven con las mismas banderas.
  const T1 = ["porche", "arriba", "almacen"];
  const T2 = (api) => ["buhardilla"].concat(quedan(api) === "irene_alex" ? ["dormitorio"] : quedan(api) === "alex_marcos" ? ["almacen_dos"] : []);
  const rutasDeConfig = (api) => T1.concat(T2(api));
  const camisa = (api) => api.bandera("juego") === "poker" ? "la camisa de cuadros de Marcos" : "la camisa de Marcos";

  Object.assign(HISTORIA.presupuestoAnomalias, { V: 4 });
  Object.assign(HISTORIA.deriva, { V: { estres: 0.4 } });

  const saltoPrevio = HISTORIA.prepararSalto;
  HISTORIA.prepararSalto = (api, id) => {
    if (typeof saltoPrevio === "function") saltoPrevio(api, id);
    if (!/^v[abmnpq]?\d/.test(id)) return;
    api.fase("V"); api.horror(2);
    if (!api.bandera("huesped")) { api.marcar("huesped", "marcos"); api.marcar("marcos_accion", "rescate"); api.marcar("contacto", true); api.marcar("contacto_inicial", "irene"); }
    if (!api.bandera("huesped_nivel")) api.marcar("huesped_nivel", 1);
    if (/^vq1/.test(id)) { api.marcar("v_nora_con", "marcos"); api.marcar("v_quedan", "irene_alex"); }
    if (/^vq[234]/.test(id) || /^vb4/.test(id)) { api.marcar("v_nora_con", "irene"); api.marcar("v_quedan", "alex_marcos"); }
    if (api.bandera("v_nora_porche") === undefined) api.marcar("v_nora_porche", /^vp/.test(id));
    if (api.bandera("v_nora_con") === undefined) api.marcar("v_nora_con", /^vp/.test(id) ? "alex" : /^vb/.test(id) && id !== "vb1_trampilla" ? "marcos" : null);
    if (api.bandera("v_irene_con") === undefined) api.marcar("v_irene_con", /^va/.test(id) ? "marcos" : null);
    if (api.bandera("v_quedan") === undefined) api.marcar("v_quedan", null);
    if (api.bandera("v_marcos_libre") === undefined) api.marcar("v_marcos_libre", api.bandera("v_irene_con") !== "marcos");
    if (api.bandera("v_irene_callada") === undefined) api.marcar("v_irene_callada", H(api) === "irene");
    if (!api.bandera("v1_nora")) api.marcar("v1_nora", api.bandera("v_nora_porche") ? "alex" : "mesa");
    if (!api.bandera("v2_nora") && /^v[6-9]|^v[bq]/.test(id)) api.marcar("v2_nora", api.bandera("v_nora_con") || "sola");
    if (api.bandera("v_nora_con") === "irene" && !api.bandera("irene_nora")) api.marcar("irene_nora", versionIreneNora(api));
    if (/^v[5-9]|^v[bq]/.test(id)) { api.marcar("v_resuelta_mesa", true); T1.forEach((r) => resolverRuta(api, r, false)); }
    if (/^v9/.test(id)) T2(api).forEach((r) => resolverRuta(api, r, false));
  };

  // Irene y Nora a solas en la buhardilla: la conversación pendiente, la alianza, o el peligro (Biblia §5, V retoque)
  function cargadaIrene(api, quien) {
    return api.valor("irene", "estres") >= 50 || api.valor("irene", "miedo") >= 45
      || api.relv("irene", quien, "tension") >= 50 || api.relv("irene", quien, "resentimiento") >= (quien === "nora" ? 30 : 15);
  }
  function versionIreneNora(api) {
    if (H(api) === "irene" && cargadaIrene(api, "nora")) return "peligro";
    const vieron = (api.bandera("irene_verdad") || api.bandera("nora_cree_irene") || api.bandera("nora_dijo_irene")) && api.relv("irene", "nora", "resentimiento") < 40;
    return vieron ? "alianza" : "conversacion";
  }

  // ---------- Daño del huésped: solo si va acompañado y el estado o la relación lo cargan ----------
  function danoMarcosA(api, quien) {
    const cargado = api.valor("marcos", "estres") >= 45 || api.valor("marcos", "miedo") >= 40
      || api.relv("marcos", quien, "tension") >= 40 || api.relv("marcos", quien, "resentimiento") >= 10
      || (quien === "nora" && api.relv("nora", "marcos", "confianza") < 50);
    api.marcar("huesped_lapso", true);
    api.marcar("huesped_sujeto", cargado ? quien : false);
    if (!cargado) return;
    if (quien === "irene") { api.evidencia("marca_brazo_irene", "irene", "brazo de Irene", "marca"); api.saber("irene", "marcos_me_sujeto"); }
    else { api.evidencia("marca_tobillo_nora", "nora", "tobillo de Nora", "marca"); api.saber("nora", "marcos_me_sujeto"); }
    api.rel(quien, "marcos", "confianza", -14); api.est(quien, "miedo", 10); api.est(quien, "estres", 8);
    api.est("marcos", "estres", 6);
  }
  function danoIreneAMarcos(api) {
    const cargado = cargadaIrene(api, "marcos");
    api.marcar("huesped_lapso", true);
    api.marcar("huesped_quemo", cargado);
    if (!cargado) return;
    api.evidencia("quemadura_marcos", "marcos", "mano de Marcos", "marca");
    api.saber("marcos", "irene_me_quemo");
    api.rel("marcos", "irene", "confianza", -14); api.est("marcos", "miedo", 8); api.est("marcos", "eje", -6);
    api.est("irene", "estres", 6);
  }
  // Irene huésped, a solas con Nora en la buhardilla: la mano en la muñeca, «Todavía no», y no se acuerda.
  function danoIreneANora(api) {
    api.marcar("huesped_lapso", true);
    api.marcar("huesped_sujeto", "nora");
    api.evidencia("marca_muneca_nora", "nora", "muñeca de Nora", "marca");
    api.saber("nora", "irene_me_sujeto");
    api.rel("nora", "irene", "confianza", -14); api.est("nora", "miedo", 10); api.est("nora", "estres", 8);
    api.est("irene", "estres", 6);
  }
  // Lo que deja la conversación de Irene y Nora, se vea o no
  function aplicarIreneNora(api, v) {
    if (v === "alianza") { api.rel("nora", "irene", "confianza", 12); api.rel("irene", "nora", "confianza", 10); api.rel("irene", "nora", "resentimiento", -10); api.saber("nora", "irene_ahogo_verdad"); api.saber("irene", "nora_alda"); }
    else if (v === "peligro") { danoIreneANora(api); }
    else { api.rel("irene", "nora", "resentimiento", -4); api.rel("nora", "irene", "confianza", 4); api.saber("nora", "irene_camisa"); }
  }

  // ---------- Resolución de rutas. seguida=false: además toma las decisiones que tomaría el personaje ----------
  function resolverRuta(api, ruta, seguida) {
    const clave = "v_resuelta_" + ruta;
    if (api.bandera(clave)) return;
    api.marcar(clave, true);
    const h = H(api);

    if (ruta === "porche") {
      // Álex sale siempre. La luz interior del coche se enciende sola: la ve él.
      api.marcar("luz_coche", true); api.saber("alex", "luz_coche");
      api.consumir("alex", "porro");
      api.marcar("alex_cuenta", true);           // Álex lo cuenta todo. Siempre. (Sus opciones, si se juegan, pueden callarle.)
      const v = api.anomalia("voz_fuera");
      api.marcar("alex_oyo_irene_fuera", v);
      if (v) { api.saber("alex", "oi_irene_fuera"); api.presenciar("alex", 1.5); }
      if (noraPorche(api)) {
        const g = api.anomalia("gente_arboles");
        api.marcar("nora_vio_gente", g);
        if (g) { api.saber("nora", "gente_arboles"); api.presenciar("nora", 2); }
        api.rel("alex", "nora", "tension", 3);
      }
      if (!seguida) {
        api.marcar("alex_quiso_cruzar", api.valor("alex", "eje") >= 70);
        api.marcar("alex_llamo_marcos", !noraPorche(api) && api.valor("alex", "eje") >= 75);   // grita hacia la casa: lo oye quien esté dentro
        if (noraPorche(api)) {
          // La conversación del porche ocurre igual aunque no se vea: Nora pregunta con paciencia y se lleva a Rubén
          api.marcar("nora_porro", api.valor("nora", "estres") < 60); if (api.bandera("nora_porro")) api.consumir("nora", "porro");
          api.marcar("nora_cuenta_gente", false);
          api.marcar("nora_pregunta", "paciencia"); api.saber("nora", "marcos_pasado_ruben"); api.marcar("alex_tanteo", "deja");
          api.marcar("salida_porche", api.relv("nora", "alex", "resentimiento") >= 30 ? "conflicto" : "comprension");
        }
      }
    }

    if (ruta === "arriba") {
      api.marcar("armario_golpe", true); api.saber("irene", "golpe_armario");
      const v = api.anomalia("voz_alex_puerta");
      api.marcar("irene_oyo_alex_puerta", v);
      if (v) { api.saber("irene", "oi_alex_puerta"); api.presenciar("irene", 1.5); }
      if (ireneCon(api) === "marcos") {
        api.presenciar("marcos", 0.8);
        // El grifo que suena y no corre lo oye Marcos desde el pasillo (huésped Marcos). Con Irene huésped el agua corre de verdad: es la mano.
        if (h === "marcos") { api.saber("marcos", "grifo_corria"); danoMarcosA(api, "irene"); } else danoIreneAMarcos(api);
      } else if (h === "irene") {
        api.marcar("irene_espejo", true); api.est("irene", "estres", 4);
      }
      if (!seguida) {
        api.marcar("irene_abre_armario", api.lucido("irene"));
        api.marcar("irene_cuenta", api.valor("irene", "miedo") >= 55);   // Irene no cuenta. Salvo que no pueda más.
        if (ireneCon(api) === "marcos" && h === "marcos") api.marcar("marcos_cuenta_grifo", true);
      }
    }

    if (ruta === "almacen") {
      if (!api.bandera("v_marcos_libre")) return;   // nadie ha ido al cuadro
      api.marcar("cuadro_visto", true); api.saber("marcos", "diferencial"); api.saber("marcos", "puerta_almacen"); api.saber("marcos", "placa_piloto");
      const a = api.anomalia("arrastre_almacen");
      api.marcar("arrastre_almacen", a);
      if (a) { api.saber("marcos", "arrastre"); api.presenciar("marcos", 1.5); }
      if (h === "marcos") { api.marcar("marcos_penso_abajo", true); api.marcar("huesped_lapso", true); }
      if (!seguida) {
        if (api.lucido("marcos")) api.evidencia("foto_cuadro", "marcos", "almacén", "foto");
        api.marcar("marcos_movio_estanteria", h === "marcos" || api.valor("marcos", "eje") >= 80);
        api.marcar("marcos_cuenta_puerta", true);      // los hechos los cuenta. Lo que oyó, no.
        api.marcar("marcos_cuenta_arrastre", false);
      }
    }

    if (ruta === "buhardilla") {
      api.marcar("huellas_vistas", true); api.saber("nora", "huellas_pequenas"); api.saber("nora", "marcas_viga"); api.saber("nora", "muneca");
      api.presenciar("nora", 1.5);
      const t = api.anomalia("trampilla_cierra");
      api.marcar("trampilla_cerro", t);
      if (t) api.presenciar("nora", 2);
      if (noraCon(api) === "marcos") {
        api.saber("marcos", "huellas_pequenas");
        if (h === "marcos") danoMarcosA(api, "nora");
      } else if (noraCon(api) === "irene") {
        // Irene y Nora, a solas por primera vez en toda la noche
        api.saber("irene", "huellas_pequenas"); api.saber("irene", "muneca"); api.presenciar("irene", 1.2);
        if (!api.bandera("irene_nora")) api.marcar("irene_nora", versionIreneNora(api));
        // Álex, desde debajo de la trampilla, mientras Álex está en el almacén: la voz que Irene oye donde él no está
        const v = api.anomalia("voz_alex_puerta");
        api.marcar("irene_oyo_alex_puerta", v);
        if (v) { api.saber("irene", "oi_alex_puerta"); api.presenciar("irene", 1.5); }
        if (t) { api.marcar("cuerda_desaparece", true); api.saber("nora", "cuerda_desaparecio"); api.saber("irene", "cuerda_desaparecio"); }
        if (!seguida) {
          aplicarIreneNora(api, api.bandera("irene_nora"));
          api.marcar("nora_irene_dijo", api.bandera("irene_nora") === "alianza" ? "escucha" : api.bandera("irene_nora") === "peligro" ? "suelta" : "calla");
          api.marcar("irene_cuenta", api.valor("irene", "miedo") >= 55);
        }
      } else if (t) {
        api.marcar("cuerda_desaparece", true); api.saber("nora", "cuerda_desaparecio");
      }
      if (!seguida) {
        api.marcar("nora_toma_muneca", api.valor("nora", "eje") >= 55);
        if (api.bandera("nora_toma_muneca")) api.evidencia("muneca_buhardilla", "nora", "buhardilla", "objeto");
        api.marcar("nora_cuenta_huellas", api.valor("nora", "eje") >= 60 || api.valor("nora", "miedo") >= 50);
      }
    }

    // Irene y Álex, a lo suyo, en su dormitorio (tramo 2, si Nora sube con Marcos). Con Irene huésped: las uñas, la sangre,
    // el mordisco, y Álex decide si le gusta. Sin el huésped: lo que Irene ve en el armario por encima del hombro de Álex.
    if (ruta === "dormitorio") {
      api.marcar("armario_golpe", true); api.saber("irene", "golpe_armario"); api.saber("alex", "golpe_armario");
      api.rel("alex", "irene", "afecto", 3); api.rel("irene", "alex", "afecto", 2);
      if (h === "irene") {
        api.marcar("irene_paro_alex", true); api.marcar("huesped_lapso", true);
        api.evidencia("aranazos_alex", "alex", "espalda de Álex", "marca"); api.evidencia("mordisco_alex", "alex", "cuello de Álex", "marca");
        api.saber("alex", "irene_me_mordio"); api.saber("alex", "irene_rara");
        api.est("alex", "miedo", 4); api.est("alex", "estres", 4);
        R().alimentar(api, 1);
        api.marcar("irene_vio_sombra", false);
        if (!seguida) {
          const gusto = api.valor("alex", "eje") >= 70 && api.valor("alex", "miedo") < 50;
          api.marcar("alex_gusto", gusto);
          if (gusto) { R().alimentar(api, 1); R().ofrenda(api, "sangre"); api.rel("alex", "irene", "afecto", 4); }
          else { api.marcar("alex_paro_irene", true); api.rel("alex", "irene", "tension", 6); }
        }
      } else {
        const s = api.anomalia("voz_alex_puerta");   // el mismo hueco del presupuesto: aquí es lo que Irene ve en el armario
        api.marcar("irene_vio_sombra", s);
        if (s) { api.saber("irene", "sombra_armario"); api.presenciar("irene", 1.5); }
        if (!seguida) {
          const abre = api.lucido("irene");
          api.marcar("irene_tras_sombra", abre ? "abre" : "para");
          api.marcar("irene_abre_armario", abre);
          if (abre) api.saber("irene", "marca_armario");
        }
      }
      if (!seguida) {
        api.marcar("alex_cuenta", true);           // Álex lo cuenta todo. También esto. Sobre todo esto.
        api.marcar("irene_cuenta", false);
      }
    }

    // Álex y Marcos en el almacén y en el porche: el candado, el arrastre a dos, el reto del coche
    if (ruta === "almacen_dos") {
      api.marcar("cuadro_visto", true); api.saber("marcos", "diferencial"); api.saber("marcos", "puerta_almacen"); api.saber("marcos", "placa_piloto");
      api.saber("alex", "puerta_almacen"); api.marcar("candado_intentado", true);
      const a = api.anomalia("arrastre_almacen");
      api.marcar("arrastre_almacen", a);
      if (a) { api.saber("marcos", "arrastre"); api.saber("alex", "arrastre"); api.marcar("alex_oyo_arrastre", true); api.presenciar("marcos", 1.5); api.presenciar("alex", 1.5); }
      if (h === "marcos") { api.marcar("marcos_penso_abajo", true); api.marcar("huesped_lapso", true); api.saber("alex", "marcos_raro"); }
      api.marcar("luz_coche", true); api.saber("alex", "luz_coche"); api.saber("marcos", "luz_coche");
      api.consumir("alex", "porro");
      const v = api.anomalia("voz_fuera");
      api.marcar("alex_oyo_irene_fuera", v);
      if (v) { api.saber("alex", "oi_irene_fuera"); api.presenciar("alex", 1.5); }
      api.marcar("marcos_ultimo_escalon", true);
      if (!seguida) {
        api.marcar("marcos_movio_estanteria", h === "marcos" || api.valor("marcos", "eje") >= 80);
        api.marcar("marcos_cuenta_puerta", true);
        api.marcar("marcos_cuenta_arrastre", false);
        api.marcar("alex_quiso_cruzar", api.valor("alex", "eje") >= 70);
        api.marcar("alex_cuenta", true);
        if (api.valor("alex", "eje") >= 75) { api.marcar("llave_inglesa", "alex"); R().coger(api, "alex", "llave"); }
      }
    }
  }

  // ---------- Reparto del tramo 1: quién va con quién a las tres y media. Esencia y estados. ----------
  function repartir1(api) {
    const h = H(api);
    const porche = api.bandera("v1_nora") === "alex";
    let ireneC = null, libre = true;
    api.marcar("v_irene_callada", h === "irene");
    api.marcar("v_nora_porche", porche);
    api.marcar("v_nora_con", porche ? "alex" : null);
    // Irene pide a Marcos que suba con ella si oyó su nombre, si tiene miedo o si quiere apartarle de Nora
    const pide = h !== "irene" && (api.bandera("voz_desertor") || api.valor("irene", "miedo") >= 45 || api.relv("irene", "marcos", "tension") >= 50);
    api.marcar("v_irene_pide", pide);
    if (pide) {
      const acepta = api.relv("marcos", "irene", "afecto") + api.relv("marcos", "irene", "proteccion") >= 45 || api.bandera("marcos_accion") === "rescate";
      api.marcar("v_marcos_acepta_irene", acepta);
      if (acepta) { ireneC = "marcos"; libre = false; }
    }
    // Si Irene es la huésped no pide nada. Pero Marcos puede seguirla por su cuenta: la ha visto rara.
    const sigue = h === "irene" && libre && (api.relv("marcos", "irene", "proteccion") >= 5 || api.relv("marcos", "irene", "afecto") >= 45 || api.bandera("marcos_fraude") === "irene" || api.bandera("marcos_tras") === "irene");
    api.marcar("v_marcos_sigue_irene", sigue);
    if (sigue) { ireneC = "marcos"; libre = false; }
    api.marcar("v_irene_con", ireneC);
    api.marcar("v_marcos_libre", libre);
    api.marcar("v_quedan", null);
  }

  // ---------- Reparto del tramo 2: con quién sube Nora, y los dos que quedan ----------
  function repartir2(api) {
    const e = api.bandera("v2_nora");
    let noraC = null, q = null;
    if (e === "irene") {
      // Nora sube con Irene. Quedan Álex y Marcos, y Álex no se queda quieto: sigue a Marcos al almacén.
      noraC = "irene"; q = "alex_marcos";
    }
    if (e === "marcos") {
      // Marcos sube con Nora salvo que ella le haya dejado helado con el beso y él lo lleve mal
      const rechaza = api.bandera("nora_reaccion_beso") === "marcos" && api.relv("marcos", "nora", "afecto") < 60;
      api.marcar("v_marcos_rechaza", rechaza);
      // Quedan Irene y Álex. Se van a su dormitorio a lo suyo, y ahí entra la casa.
      if (!rechaza) { noraC = "marcos"; q = "irene_alex"; }
    }
    api.marcar("v_nora_con", noraC);
    api.marcar("v_quedan", q);
    if (noraC === "irene") api.marcar("irene_nora", versionIreneNora(api));
  }

  // Segunda carta del tramo 1: el grupo de la huésped. Si van dos, la cara de la carta es quien mira desde fuera.
  function carta2Tramo1(api) {
    const h = H(api), ic = ireneCon(api);
    if (h === "marcos" && ic !== "marcos") return { id: "marcos", ruta: "almacen", a: "vm1_cocina", desc: "La cocina. El cuadro de luces. El almacén." };
    if (ic === "marcos") return { id: h === "marcos" ? "irene" : "marcos", ruta: "arriba", a: "va1_pasillo", desc: h === "marcos" ? "Arriba con Marcos. La sudadera, el baño. Y él, que no dice nada." : "Arriba con Irene. La sudadera, el baño. Y ella, que va delante sin girarse." };
    return { id: "irene", ruta: "arriba", a: "va1_pasillo", desc: "Arriba. La sudadera, el baño. Sola." };
  }
  // Segunda carta del tramo 2: los que quedan. Si Nora sube sola, nadie: los tres se quedan en la mesa.
  function carta2Tramo2(api) {
    const h = H(api), q = quedan(api);
    if (q === "irene_alex") return h === "irene"
      ? { id: "alex", ruta: "dormitorio", a: "vq1_dormitorio", desc: "El dormitorio, con Irene. La cama. Y ella, que esta noche no es la de siempre." }
      : { id: "irene", ruta: "dormitorio", a: "vq1_dormitorio", desc: "El dormitorio, con Álex. La cama, el armario. Y algo que llega a mitad." };
    if (q === "alex_marcos") return h === "marcos"
      ? { id: "marcos", ruta: "almacen_dos", a: "vq2_almacen_dos", desc: "El almacén, con Álex detrás. El cuadro, la estantería, el candado. Y una palabra." }
      : { id: "alex", ruta: "almacen_dos", a: "vq2_almacen_dos", desc: "El almacén, con Marcos. El candado, la caja de herramientas. Y después, el coche." };
    return null;
  }
  function elegirRuta(api, r) {
    api.marcar("v_ruta", r);
    const tramo = r === "mesa" || T1.includes(r) ? T1 : T2(api);
    tramo.filter((x) => x !== r).forEach((x) => resolverRuta(api, x, false));
  }

  Object.assign(HISTORIA.escenas, {

  // =====================================================================
  // FASE V — PRIMERA DISPERSIÓN
  // =====================================================================

  v1_necesidades: {
    pov: "nora",
    fondo: "assets/fondos/salon_noche.jpg",
    ambiente: "interior",
    musica: "fiesta_baja",
    lugar: "comedor", hora: "03:30",
    titulo: "La dispersión · Necesidades",
    alEntrar: (api) => { api.fase("V"); api.horror(2); api.marcar("huesped_nivel", 1); },
    texto: (api) => {
      const h = H(api);
      const irene = h === "irene" ? `
Irene se levanta.

No dice «tengo frío». No dice «voy a por una sudadera». Se levanta y va hacia la escalera como quien va a un sitio al que ya ha ido, sin mirar a nadie, con la mano todavía en el cuello.

Álex: ¿Dónde vas?

Irene: Arriba.

Y sube. El tercero. El séptimo.` : `
Irene se frota los brazos.

Irene: Tengo frío.

Álex: Tienes el top abierto.

Irene: Tengo frío por dentro. Voy a por una sudadera.

${api.bandera("voz_desertor") ? "Mira la escalera. La mira como se mira una escalera por la que ya has subido una vez esta noche y has oído algo que no debía estar. No se mueve todavía." : "Se levanta. Se estira. Mira la escalera."}`;
      const marcos = h === "marcos" ? `
Marcos se frota el pecho. Por encima de la camiseta, con la palma abierta, como quien se frota una marca. No hay marca.

Marcos: Voy a mirar el cuadro de luces. Esa lámpara no me fío.

Lo dice mirando la lámpara. Sin dejar de frotarse.` : `
Marcos: Voy a mirar el cuadro de luces. Esa lámpara no me fío.

Marcos, que ya ha resuelto una cosa esta noche y quiere resolver dos.`;
      return `
Álex lía. Encima de la tabla. Ha puesto el papel sobre las letras y desmenuza con el pulgar entre la L y la M, y no se da cuenta, y tú sí.

Nora: Álex.

Álex: ¿Qué?

Nora: Nada.

Lo cierra. Lo enciende. Se levanta.

Álex: Salgo a fumar. Aquí dentro huele a velatorio.
${irene}
${marcos}

Álex te mira a ti. Con el porro en la boca y la puerta a medio abrir.

Álex: ¿Vienes? Lío otro.

Nora: No fumo.

Álex: Tabaco. Esto no es tabaco. Y tú eres la única que no estaba en el velatorio.

~ No me apetece. Pero es la única vez en toda la noche que voy a tener a Álex sin Marcos y sin Irene delante. Y Álex es el que lleva cinco años con Marcos. El que sabe cómo era antes.

La casa se está vaciando. Lo notas: cada uno tira hacia un sitio, como el agua cuando quitas el tapón. Arriba, la cocina, la puerta. Y tú en medio, con el cuaderno cerrado bajo la mano y dos palabras dentro.

Y la cuerda. La cuerda de la trampilla: ${api.bandera("buhardilla_descubierta") === "irene" ? "la que Irene encontró esta noche, y la escalera que bajó sola y ella volvió a subir con las dos manos" : "la que viste al subir las mochilas, colgando del techo del pasillo como una pregunta"}. Que quieres mirar desde hace una hora. Puede esperar diez minutos. Álex sin Marcos y sin Irene delante, no.

${modo(api, "nora", {
  lucido: "~ Dos cosas y un orden. Álex a solas, que es una vez por noche. Y la cuerda, que va a seguir ahí cuando vuelva. O la mesa: quedarme con la tabla y oír la casa entera moverse alrededor. Cada una cuesta algo.",
  asustado: "~ No quiero quedarme sola en esta mesa con la tabla abierta. Y no quiero salir al frío con Álex. Y no quiero que se vayan. Quiero que no se vayan.",
  tenso: `~ ${api.bandera("nora_reaccion_beso") === "marcos" || api.bandera("nora_reaccion_beso") === "silencio" ? "Marcos a la cocina. Sin mirarme. Después de lo de antes. Pues muy bien. Salgo con Álex." : "Cada uno a su sitio. Como si no hubiera pasado nada. Como si Alda fuera un chiste. Y Álex, que lo sabe, con un porro en la boca."}`,
  ido: "~ El humo de Álex sube recto. No hay corriente. Y la cuerda de arriba se movía. Sin corriente. Luego. Primero Álex, que sabe cosas cuando fuma.",
  perdido: "~ Se van. Se van todos y me dejan con ella. Ella se queda en la mesa. Ella no se levanta nunca. Sal. Sal con quien sea.",
  normal: "~ Álex con un porro y una puerta abierta. Marcos con un cuadro de luces. Irene en la escalera. Y tú con una tabla. Elige, Nora.",
})}`;
    },
    opciones: [
      { texto: "Salir con Álex. Al porche. Al frío. Al porro. A preguntar.", a: "v2_reparto",
        efecto: (api) => { api.marcar("v1_nora", "alex"); api.rel("alex", "nora", "tension", 3); if (api.bandera("nora_reaccion_beso") === "marcos") api.rel("marcos", "nora", "resentimiento", 3); } },
      { texto: "Quedarte. Con la tabla y el cuaderno. Alguien tiene que quedarse con la tabla.", a: "v2_reparto",
        efecto: (api) => { api.marcar("v1_nora", "mesa"); api.est("nora", "eje", 2); } },
    ],
  },

  v2_reparto: {
    pov: null,
    fondo: "assets/fondos/salon_vacio.jpg",
    musica: null,
    titulo: "La dispersión · Cada uno a su sitio",
    hora: "03:33",
    alEntrar: (api) => repartir1(api),
    texto: (api) => {
      const ic = ireneCon(api);
      const porche = noraPorche(api);
      const nora = porche ? `
Nora coge el mechero de la mesa y sale detrás de Álex. La puerta se queda entreabierta. El frío entra hasta la tabla.` : `
Nora se queda. Con el cuaderno cerrado bajo la mano y la tabla delante.

Nora: Alguien tiene que quedarse con la tabla.

Nadie le ha preguntado. Nadie contesta.`;
      const irene = api.bandera("v_irene_callada") ? (ic === "marcos" ? `
Irene ya está arriba. Nadie la ha oído entrar en ningún sitio. Ni una puerta.

Marcos mira la escalera. Deja el cuadro de luces para luego.

Marcos: Voy a ver qué le pasa.

Sube. Nadie se lo ha pedido. Marcos, que solo sube escaleras cuando alguien se lo pide.` : `
Irene ya está arriba. Nadie la ha oído entrar en ningún sitio. Ni una puerta.`) : api.bandera("v_irene_pide") ? (ic === "marcos" ? `
Irene: Marcos.

Marcos: ¿Qué?

Irene: ¿Subes conmigo? Un momento.

Marcos: ¿A qué?

Irene: A nada. A que no quiero subir sola.

Lo ha dicho bajo. Sin la voz. Marcos deja el cuadro de luces para luego y sube detrás de ella. Ella va delante, descalza, y no se gira.` : `
Irene: Marcos. ¿Subes conmigo? Un momento.

Marcos: Ahora subo. Déjame mirar la luz primero.

Irene se queda un segundo en el primer escalón. Luego sube. Sola. Sin mirar atrás, que es como sube Irene cuando alguien le ha dicho que no.`) : `
Irene sube a por la sudadera. Descalza. El tercero. El séptimo.`;
      const marcos = api.bandera("v_marcos_libre") ? `
Marcos cruza el arco de la cocina. Se enciende la luz blanca. Se oye abrir una puerta que no es la de la nevera.` : "";
      const alex = porche ? "" : `
Álex ya está fuera. Se ve la brasa a través del cristal. Y el coche de Marcos, un bulto, veinte metros más allá.`;
      const grupoNora = porche ? "El porche, con Álex y Nora." : "La mesa, con Nora y la tabla.";
      const c2 = carta2Tramo1(api);
      const grupoOtro = c2.ruta === "almacen" ? "La cocina y el almacén, con Marcos." : ic === "marcos" ? "Arriba, con Irene y Marcos." : "Arriba, con Irene.";
      return `${alex}
${irene}
${nora}
${marcos}

Y la casa se reparte. Cuatro personas en tres sitios, y ninguno ve a los demás. Hace veinte minutos sabíais dónde estaba cada uno. Ahora no.

${grupoNora} ${grupoOtro}

¿Qué quieres ver?`;
    },
    personajes: [
      { id: "nora",
        descripcion: (api) => noraPorche(api) ? "El porche. El porro, el frío, el coche de Marcos a veinte metros. Y Álex sin nadie delante." : "La mesa. La tabla, el cuaderno, y la casa entera sonando alrededor.",
        a: (api) => noraPorche(api) ? "vp1_porche" : "vn1_mesa",
        efecto: (api) => elegirRuta(api, noraPorche(api) ? "porche" : "mesa") },
      // El grupo de la huésped. Si van dos, la cara de la carta es quien mira desde fuera.
      { id: "marcos", si: (api) => carta2Tramo1(api).id === "marcos", descripcion: (api) => carta2Tramo1(api).desc, a: (api) => carta2Tramo1(api).a, efecto: (api) => elegirRuta(api, carta2Tramo1(api).ruta) },
      { id: "irene", si: (api) => carta2Tramo1(api).id === "irene", descripcion: (api) => carta2Tramo1(api).desc, a: (api) => carta2Tramo1(api).a, efecto: (api) => elegirRuta(api, carta2Tramo1(api).ruta) },
    ],
  },

  // =====================================================================
  // RUTA PORCHE — Álex, o Álex y Nora
  // =====================================================================
  // RUTA MESA — Nora sola con la tabla mientras los demás van a lo suyo (tramo 1)
  // =====================================================================

  vn1_mesa: {
    pov: "nora",
    fondo: "assets/fondos/salon_noche.jpg",
    ambiente: "interior",
    musica: "fiesta_baja",
    lugar: "comedor", hora: "03:35",
    titulo: "La mesa · Sola con la tabla",
    alEntrar: (api) => { api.marcar("v_resuelta_mesa", true); api.est("nora", "estres", 2); },
    texto: (api) => {
      const ic = ireneCon(api);
      const libre = api.bandera("v_marcos_libre");
      return `
Sola.

La mesa redonda. La tabla con las letras hacia ti. El vaso boca abajo en el centro, donde lo dejó Álex. Las velas, a medio consumir. La música, baja. Y tú, con el cuaderno cerrado bajo la mano.

Alguien tiene que quedarse con la tabla. Lo has dicho en voz alta y nadie te ha preguntado por qué.

La casa suena. Es lo que hace una casa cuando la gente se reparte por ella: cada uno hace su ruido en su sitio y tú, en medio, los oyes todos.

${libre ? "La cocina. La luz blanca. Marcos abriendo una puerta que no es la de la nevera. El escalón. Y luego nada, que es el ruido que hace Marcos cuando mira algo. Y la lámpara, encima de ti, sube de tono. De golpe. Marcos ha encontrado algo que arreglar." : ic === "marcos" ? "Arriba. Dos pares de pasos. Los de Irene, descalzos, que casi no se oyen. Los de Marcos, que sí. Una puerta. El grifo del baño, un momento. Otra vez nada." : "Arriba. Los pasos de Irene, descalzos, que casi no se oyen. Una puerta. Nada."}

Fuera, el porche. La puerta a medio abrir, como la ha dejado Álex, y el frío que entra por la rendija hasta la tabla. Y Álex, que no se oye. Álex siempre se oye. ${api.bandera("alex_llamo_marcos") ? "Y de pronto sí: su voz, desde fuera, hacia la casa, diciendo el nombre de Marcos. Una vez. Marcos no contesta. Álex no repite." : ""}

Abres el cuaderno. ALDA. AJOBA. Con jota. Tu letra, la de apuntar. Y debajo, nada, porque no ha pasado nada más.

~ No ha pasado nada más. Se han levantado los cuatro y se han ido a lo suyo como si no hubiera pasado nada, porque para ellos no ha pasado nada: un vaso, una broma, un ahogo que fue ansiedad. Y yo con dos palabras que nadie podía saber.

Miras la escalera. Desde tu silla se ve el hueco, el pasamanos, la sombra del pasillo de arriba. Y en la sombra, si te inclinas, la cuerda. La de la trampilla. Quieta.

Quieta.

${modo(api, "nora", {
  lucido: "~ Tres ruidos, tres sitios, y ninguno raro. Una casa vieja con cuatro personas dentro suena exactamente así. Lo apunto igual: la hora, quién dónde. Si luego alguien dice que estaba en otro sitio, quiero tenerlo.",
  asustado: "~ Sola con la tabla. Lo he elegido yo. Y ahora las letras me miran y el vaso no se mueve y eso es peor que si se moviera.",
  tenso: "~ Podía haber salido con Álex. Podía haber subido detrás de Irene. Y estoy aquí guardando una tabla que no se va a mover. Muy bien, Nora.",
  ido: "~ Las velas se inclinan hacia la escalera. Las tres. No hay corriente. Hay algo arriba que tira del aire como se tira de una sábana.",
  perdido: "~ Me ha dejado con ella. La tabla. Quería que me quedara con ella. Por eso se han ido todos a la vez.",
  normal: "~ Sola con la tabla y el cuaderno. Es lo que sé hacer: quedarme y apuntar. Que se vayan. Que vuelvan. Y entonces, arriba.",
})}`;
    },
    opciones: [
      { texto: "Apuntar. La hora. Quién ha ido a dónde. Por si acaso.", a: "v5_cuerda", lucida: true,
        efecto: (api) => { api.marcar("vn1_nora", "apunta"); api.evidencia("cuaderno_reparto", "nora", "cuaderno de Nora", "nota"); api.est("nora", "lucidez", 2); } },
      { texto: "Poner el vaso boca arriba. Lejos de las letras. Y no mirarlo.", a: "v5_cuerda",
        efecto: (api) => { api.marcar("vn1_nora", "vaso"); api.est("nora", "estres", -2); api.est("nora", "eje", -1); } },
      { texto: "Ir hasta el pie de la escalera. Mirar la cuerda desde abajo. Solo mirar.", a: "v5_cuerda",
        efecto: (api) => { api.marcar("vn1_nora", "escalera"); api.est("nora", "eje", 3); api.est("nora", "miedo", 2); } },
      { texto: "Asomarte a la cocina. Ver qué hace Marcos con la puerta que ha abierto.", a: "v5_cuerda", si: (api) => api.bandera("v_marcos_libre"),
        efecto: (api) => { api.marcar("vn1_nora", "cocina"); api.saber("nora", "marcos_en_almacen"); api.rel("nora", "marcos", "confianza", 2); } },
    ],
  },

  // =====================================================================

  vp1_porche: {
    pov: (api) => noraCon(api) === "alex" ? "nora" : "alex",
    fondo: "assets/fondos/porche.jpg",
    ambiente: "exterior",
    musica: "terror_suave",
    lugar: "porche", hora: "03:35",
    titulo: "El porche · El frío",
    alEntrar: (api) => resolverRuta(api, "porche", true),
    texto: (api) => {
      const pareja = noraCon(api) === "alex";
      const golpes = pareja ? `
Álex golpea la barandilla con los nudillos. Dos veces. Toc, toc. Es un tic suyo: lo hace con las mesas, con los vasos, con la gente.

Y la madera contesta.

[toc]

Toc.

Debajo del porche. Antes de que él levante la mano para el tercero.

Álex se queda mirando su mano.

Nora: ¿Qué?

Álex: Nada. La madera.

Vuelve a mirar la mano. La cierra.` : `
Golpeas la barandilla con los nudillos. Dos veces. Toc, toc. Es un tic tuyo: lo haces con las mesas, con los vasos, con la gente.

Y la madera contesta.

[toc]

Toc.

Debajo del porche. Antes de que levantes la mano para el tercero. Lo ibas a dar. Lo sabes porque la mano ya iba.

Te quedas mirando la mano.

~ Un tablón suelto. Un tablón que cede con el peso y devuelve el golpe. Un tablón con reflejos. Un tablón muy listo.

La cierras.

Y dentro de la casa, arriba, un golpe seco. Madera contra madera. Como una puerta grande cerrándose en el techo. Irene, seguramente. ${api.bandera("buhardilla_descubierta") === "irene" ? "Que ya ha abierto una trampilla esta noche sin querer." : "Que cierra las puertas como si le debieran dinero."}`;

      if (pareja) return `
La puerta se cierra detrás de ti y el frío te entra por ${camisa(api)}, por las mangas, por el cuello. Fuera no huele a velatorio. Huele a pino y a tierra mojada y a la brasa de Álex.

El porche. Dos escalones de madera hasta la grava. La bombilla de fuera, amarilla, con tres polillas dando vueltas. La barandilla, húmeda. Y más allá de la luz, nada: el coche de Marcos, un bulto a veinte metros, y detrás los pinos, negros, hasta arriba.

Álex se apoya en la barandilla. Da una calada larga. Te pasa el porro sin mirarte.

Álex: Tabaco cero. Lo prometo.

Lo coges. No lo fumas todavía. Lo tienes entre los dedos como tienes el mechero toda la noche: para tener algo.

Álex: ¿Sabes por qué te he sacado?

Nora: Porque dentro huele a velatorio.

Álex: Porque Marcos se ha ido a mirar una lámpara.

Lo dice sin mirarte. Mirando el coche.

Álex: Y tú no eres una lámpara.
${golpes}

Álex: Antes no miraba lámparas.

Lo suelta así. Sin venir a cuento. Con la brasa en la boca.

Álex: Marcos. Antes. Se subía a las lámparas. En el piso de Rubén había una de esas de tres brazos, y una noche...

Se calla. Se ríe solo. Como quien cierra un cajón con la rodilla.

Álex: Nada. Cosas de antes.

Y ahí está. La puerta. La que llevas cinco meses viendo cerrada: «los de antes». Marcos no cuenta nada de antes. Irene lo usa como se usa una llave. Y Álex, que lo cuenta todo, acaba de abrirla un dedo y se ha quedado mirando a ver si entras.

${modo(api, "nora", {
  lucido: "~ Es su sitio. «Los de antes» es donde Álex se siente dueño de Marcos. Si le dejo hablar, habla. Si me pongo a la defensiva, se cierra y provoca. Es Álex: no improvisa tanto como parece.",
  asustado: "~ La madera. Ha dicho la madera. Se ha quedado mirando la mano como si no fuera suya. Y ahora habla de Marcos como si Marcos fuera suyo.",
  tenso: "~ «Y tú no eres una lámpara.» Álex. Cómo le gusta meter el dedo donde no hay herida. Y ahora el Marcos de antes. Como si yo no supiera que hubo un antes.",
  ido: "~ Las polillas dan vueltas siempre en el mismo sentido. Nunca al revés. Nunca. Y Álex habla de lámparas.",
  perdido: "~ Ha salido con nosotros. Está aquí fuera. Detrás de la luz, donde no llega. Y Álex habla para que no lo oiga yo.",
  normal: "~ Un porro, un piropo y una puerta abierta. Es Álex. Y por una vez me interesa lo que hay detrás de Álex.",
})}

Cómo preguntes es lo que decide cuánto te cuenta. Lo sabes. Él también.`;

      return `
El frío te entra por la camisa abierta y te gusta. Fuera no huele a velatorio. Huele a pino, a tierra mojada, a lo que estás fumando.

El porche. Dos escalones hasta la grava. La bombilla de fuera con sus polillas. La barandilla, húmeda. El coche de Marcos, un bulto a veinte metros. Los pinos detrás, negros hasta arriba.

Sacas el móvil. Te grabas. La cara iluminada desde abajo por la pantalla, que es como mejor sales.

Álex: Documental número tres. Los demás se han ido a hacer cosas de gente que tiene miedo. Yo estoy fumando.

Calada. A cámara.

Álex: Irene ha subido a por una sudadera. En julio. Marcos ha ido a mirar una lámpara. Y Nora...

Miras hacia la casa.

Álex: Nora está haciendo cosas de Nora.

Guardas el móvil.
${golpes}

${modo(api, "alex", {
  lucido: "~ Un tablón. Los porches de madera hacen eso. Pero lo ha hecho antes. Antes de mi mano. Eso no lo hacen los tablones.",
  asustado: "~ Antes. Ha sonado antes. Como si supiera que iba a dar el tercero. Como si me conociera.",
  tenso: "~ Vale. Vale. Un golpe. Un golpe de mierda debajo de un porche de mierda.",
  ido: "~ Lo he dado yo. El tercero. Con el pie. No. Tengo los pies quietos. Los miro. Quietos.",
  perdido: "~ Me está contestando. Le he llamado dos veces y ha contestado. Sabe que soy yo.",
  normal: "~ Muy bueno. Me ha ganado la madera. Tres a dos.",
})}

Y entonces, a veinte metros, dentro del coche de Marcos, se enciende la luz.`;
    },
    opciones: [
      // Nora: no qué pregunta, sino cómo. Paciencia, asertividad o manipulación.
      { texto: "Fumar. Dejarle hablar. Preguntar poco y escuchar mucho.", a: "vp2_coche", si: (api) => noraCon(api) === "alex",
        efecto: (api) => { api.marcar("nora_porro", true); api.consumir("nora", "porro"); api.marcar("nora_pregunta", "paciencia"); api.est("nora", "estres", -3); } },
      { texto: "«No fumo. Y no soy una lámpara. ¿Cómo era Marcos antes?»", a: "vp2_coche", si: (api) => noraCon(api) === "alex",
        efecto: (api) => { api.marcar("nora_porro", false); api.marcar("nora_pregunta", "asertiva"); api.est("nora", "lucidez", 1); api.est("nora", "eje", 1); } },
      { texto: "Fumar. Reírle el piropo. Y tirar del hilo de Rubén como quien no quiere la cosa.", a: "vp2_coche", si: (api) => noraCon(api) === "alex",
        efecto: (api) => { api.marcar("nora_porro", true); api.consumir("nora", "porro"); api.marcar("nora_pregunta", "manipula"); api.est("nora", "eje", 2); api.rel("alex", "nora", "tension", 4); } },
      // Álex
      { texto: "«Documental número tres.» Sacar el móvil. Grabar el coche.", a: "vp2_coche", si: (api) => noraCon(api) !== "alex",
        efecto: (api) => { api.evidencia("video_coche_luz", "alex", "porche", "video"); api.est("alex", "lucidez", 1); } },
      { texto: "Golpear otra vez. Tres veces. A ver.", a: "vp2_coche", si: (api) => noraCon(api) !== "alex",
        efecto: (api) => { api.marcar("alex_golpea_porche", true); api.est("alex", "eje", 3); api.presenciar("alex", 1); } },
      { texto: "«¡Marcos! ¡Tu coche!» Hacia la casa.", a: "vp2_coche", si: (api) => noraCon(api) !== "alex",
        efecto: (api) => { api.marcar("alex_llamo_marcos", true); } },
    ],
  },

  vp2_coche: {
    pov: "alex",
    titulo: "El porche · La luz del coche",
    // Lo que Nora se lleva del Marcos de antes depende de cómo ha preguntado. Ocurre igual se vea o no.
    alEntrar: (api) => {
      if (noraCon(api) !== "alex") return;
      const np = api.bandera("nora_pregunta") || "paciencia";
      api.saber("nora", "marcos_pasado_ruben");
      if (np !== "asertiva") api.saber("nora", "marcos_pasado_sofa");
      if (np === "manipula") { api.saber("nora", "marcos_pasado_siete"); api.marcar("alex_noto_manipula", true); api.rel("alex", "nora", "resentimiento", 3); }
      if (np === "paciencia") { api.saber("nora", "marcos_pasado_antes"); api.rel("alex", "nora", "confianza", 4); api.rel("alex", "nora", "afecto", 2); }
      if (np === "asertiva") { api.rel("alex", "nora", "afecto", 3); api.rel("nora", "alex", "resentimiento", -2); }
    },
    texto: (api) => {
      const pareja = noraCon(api) === "alex";
      const voz = api.bandera("alex_oyo_irene_fuera");
      const np = api.bandera("nora_pregunta") || "paciencia";

      if (pareja) return `
${np === "paciencia" ? `Nora fuma. Una calada corta. Te lo devuelve y no dice nada. No te contesta lo de la lámpara. Se apoya en la barandilla a tu lado y espera.

Y a ti te sale. Te sale porque nadie te ha pedido nada, que es la única manera en que a ti te salen las cosas.` : np === "asertiva" ? `Nora: No fumo. Y no soy una lámpara. ¿Cómo era Marcos antes?

Te lo devuelve sin haberle dado. Directa. Con la barbilla. Te ríes por la nariz.

Álex: Joder, profesora.

Pero te ha caído bien. Eso es lo raro: que te ha caído bien que no entre al trapo. Le cuentas lo justo. Lo justo con Nora resulta ser más de lo que le has contado a nadie.` : `Nora fuma. Se ríe de lo de la lámpara con la cabeza hacia atrás, enseñando el cuello, y te devuelve el porro rozándote los dedos.

Nora: ¿Rubén? ¿Quién es Rubén?

Lo pregunta como quien pregunta la hora. Y tú, que eres Álex, le das la hora, y el día, y el año.`}

Álex: Rubén era el del piso. El de la lámpara. Marcos se subió a la mesa a arreglarla, a las cinco, con un pedo que no se tenía, y se cayó con lámpara y todo, y se quedó en el suelo riéndose media hora. Media hora. Marcos.

${np !== "asertiva" ? `Álex: Y el sofá. El sofá de Rubén era donde acababa todo. Donde acababa Marcos, quiero decir. Con la cabeza de quien fuera en las piernas.

Lo dices mirando el coche. Sin mirar a Nora. Sabes exactamente lo que has dicho.

${np === "manipula" ? `Nora: ¿De quién?

Álex: De quien fuera.

Nora: Álex.

${api.bandera("d15") === "borde" ? "Álex: Lo de las siete y media ya te lo soltó Marcos. A su manera. Irene se fue sola, una noche, y volvió." : "Álex: Irene se fue a las siete y media. Sola. Una noche. Eso lo sabe Marcos y lo sabe Irene y ahora lo sabes tú."} Yo estaba dormido en el baño.

Se lo has dado. Entero. Y mientras se lo das, algo te dice que te lo ha sacado ella. Que lo de reírse del piropo era eso. Lo notas tarde. Pero lo notas.` : `Nora no pregunta de quién. Espera. Y como espera, sigue saliendo.

Álex: Marcos no era el racional. Eso vino después. Antes era el que se subía a las mesas. Lo del racional se lo inventó cuando empezó a tener algo que perder.

Te callas. Eso no se lo has dicho a nadie. Ni a Irene.`}` : `Álex: Y ya está. Eso es lo que hay. Un tío que se caía de las mesas.

Nora: Eso no es lo que hay.

Álex: Es lo que te toca.

Y ella asiente. Sin insistir. Nora no insiste. Eso también te cae bien, y te jode que te caiga bien.`}

Y entonces, a veinte metros, dentro del coche de Marcos, se enciende la luz.

La de dentro. Amarilla, débil, la de encima del retrovisor. Se ve el volante, los asientos, nadie.

Nora: ¿Has visto?

Álex: Se enciende cuando abres una puerta.

Nora: Nadie ha abierto una puerta.

Álex: Ya.

~ No tienes huevos.

Lo dice una voz. Es la tuya. Siempre es la tuya.

Y a tu lado, Nora. Con la cara de quien ha oído algo que no esperaba oír y lo está guardando. Va en serio. Se le nota que va en serio. Y tú tienes dos cosas delante: el coche, y ella.

${modo(api, "alex", {
  lucido: "~ Le he dado más de lo que le doy a nadie. No sé si porque pregunta bien o porque no pregunta. Y el coche se ha encendido justo cuando iba a callarme. Justo.",
  asustado: "~ La luz. Otra vez. Y yo aquí contando batallitas de Marcos como si la luz no estuviera encendida. Como si no fuera para mí.",
  tenso: "~ Le he contado lo del sofá. A la novia. Marcos me mata. Marcos me mata y tiene razón.",
  ido: "~ La grava brilla. Está mojada y brilla. Es un camino. Y Nora me mira como si el camino fuera yo.",
  perdido: "~ Hay alguien en el asiento de atrás. Ha encendido la luz para que la vea. Para que baje. Nora no lo ve porque no es para ella.",
  normal: "~ Vale. Vale. Una luz. Y Nora esperando. Dos cosas y solo puedo hacer una.",
})}`;

      return `
${api.bandera("alex_golpea_porche") ? "Has golpeado tres veces. Toc, toc, toc. Y la madera ha contestado tres veces. Antes. Las tres antes.\n\nVale. Vale." : api.bandera("alex_llamo_marcos") ? "Has gritado hacia la casa. «¡Marcos! ¡Tu coche!» Nadie ha contestado. La casa tiene las luces encendidas y no contesta nadie, y eso es peor que si estuviera a oscuras." : "Lo has grabado. La luz del coche, la grava, el negro. En la pantalla se ve menos que a ojo. Siempre se ve menos."}

La luz de dentro. Amarilla, débil, la de encima del retrovisor. Se ve el volante, los asientos. Nadie.

~ Se enciende cuando abres una puerta. Nadie ha abierto una puerta.

~ No tienes huevos.

Lo dice una voz. Es la tuya. Siempre es la tuya. Es la que te ha metido en todo lo bueno y en todo lo malo de tu vida, y esta noche no va a ser distinta.

Bajas el primer escalón. El segundo.

${modo(api, "alex", {
  lucido: "~ Veinte metros. Grava. Un coche. Miro dentro, no hay nadie, vuelvo. Es lo que haría cualquiera. Cualquiera que no tuviera miedo.",
  asustado: "~ No salgas de la luz. Aquí hay luz. Allí no. Y en medio hay veinte metros en los que no eres nada.",
  tenso: "~ Miro y vuelvo. Miro y vuelvo. Miro y vuelvo.",
  ido: "~ La grava brilla. Está mojada y brilla. Es un camino. Es el camino más claro que he visto en mi vida.",
  perdido: "~ Hay alguien en el asiento de atrás. Quiere que baje. Me ha encendido la luz para que la vea.",
  normal: "~ Venga. Veinte metros. Que no se diga.",
})}`;
    },
    opciones: [
      // Álex, con Nora delante: decide una vez, desde su punto de vista
      { texto: "Seguir. Tantearla. «¿Y tú? ¿Qué eras antes de Marcos?»", a: "vp3_arboles", si: (api) => noraCon(api) === "alex",
        efecto: (api) => { api.marcar("alex_tanteo", "sigue"); api.rel("alex", "nora", "tension", 4); api.est("alex", "eje", 2); } },
      { texto: "Dejarla en paz. Va en serio. Mirar el coche y callarte.", a: "vp3_arboles", si: (api) => noraCon(api) === "alex",
        efecto: (api) => { api.marcar("alex_tanteo", "deja"); api.rel("alex", "nora", "afecto", 3); api.est("alex", "eje", -1); } },
      { texto: "Bajar a mirar el coche. Cambiar de tema con los pies.", a: "vp3_arboles", si: (api) => noraCon(api) === "alex",
        efecto: (api) => { api.marcar("alex_tanteo", "coche"); api.marcar("alex_quiso_cruzar", true); if (api.valor("alex", "eje") >= 75) api.marcar("alex_piso_grava", true); api.est("alex", "eje", 3); } },
      // Álex: hasta dónde
      { texto: "Bajar hasta el último escalón. Y parar ahí.", a: "vp3_arboles", si: (api) => noraCon(api) !== "alex",
        efecto: (api) => { api.marcar("alex_quiso_cruzar", true); } },
      { texto: "Bajar. Y seguir. La grava.", a: "vp3_arboles", si: (api) => noraCon(api) !== "alex",
        efecto: (api) => { api.marcar("alex_quiso_cruzar", true); api.marcar("alex_piso_grava", true); api.est("alex", "eje", 4); } },
      { texto: "Volver arriba. Ya. Sin mirar los árboles.", a: "vp3_arboles", si: (api) => noraCon(api) !== "alex",
        efecto: (api) => { api.marcar("alex_quiso_cruzar", false); api.est("alex", "eje", -4); api.est("alex", "miedo", 4); } },
    ],
  },

  vp3_arboles: {
    fondo: "assets/fondos/bosque.jpg",
    pov: (api) => noraCon(api) === "alex" ? "nora" : "alex",
    titulo: "El porche · Entre los árboles",
    texto: (api) => {
      const pareja = noraCon(api) === "alex";
      const voz = api.bandera("alex_oyo_irene_fuera");
      const gente = api.bandera("nora_vio_gente");

      if (pareja) {
        const at = api.bandera("alex_tanteo");
        const inicio = at === "sigue" ? `
Álex: ¿Y tú? ¿Qué eras antes de Marcos?

Lo dice con la calada. Con la sonrisa de las malas ideas. Ha vuelto: el de siempre. Lo de Rubén lo ha cerrado como se cierra un cajón con la rodilla.

Nora: Lo mismo que ahora.

Álex: Eso no es una respuesta.

Nora: Es la que te toca.

Se ríe. Te ha gustado decirlo. Más de lo que debería.` : at === "deja" ? `
Álex no dice nada más. Mira el coche. Da una calada. Te pasa el porro sin mirarte y no hace ningún chiste, que en Álex es una manera de decir «vale».

Vale. Te lo quedas.` : `
Álex baja el primer escalón. El segundo.

Álex: Voy a mirar.

Nora: Álex.

${api.bandera("alex_piso_grava") ? "Y baja. El último escalón. Y el pie en la grava. Cruje. Y la luz del porche se apaga detrás de vosotros, y la del coche, las dos, a la vez.\n\nSaca el pie. Lo pone en el escalón. La luz del porche vuelve. La del coche no.\n\nSe queda ahí. Con un pie en cada mundo." : "Se para en el último escalón. Con la mano en la barandilla. No baja a la grava. No sabes por qué no baja, y él tampoco."}`;
        return `${inicio}

${voz ? `Y Álex gira la cabeza. A la izquierda. Hacia los árboles.

Álex: ¿Irene?

Lo dice a los pinos. No a la casa. A los pinos, donde no hay nadie.

Nora: Irene está arriba.

Álex: Ya.

No se mueve. Sigue mirando los árboles. Como quien espera que le vuelvan a llamar.` : `Álex mira los pinos. La línea negra donde se acaba la grava. Y no sabe por qué la mira, y tú tampoco.`}

${gente ? `Y entre los troncos, a la izquierda, donde Álex mira, hay gente.

De pie. Quietos. Seis, siete, no sabes. Con la ropa oscura y las caras hacia la casa. No hacia vosotros. Hacia la casa. Como quien mira un fuego.

Y huele a humo. No al de Álex. A leña. A algo más: a pelo.

Un segundo.

Y son troncos. Pinos. Los de siempre. Y el humo es el porro, que Álex tiene en la mano.

~ Gente. Había gente. No. Había troncos y una luz mala y yo llevo ocho horas despierta.

~ Pero olía a pelo.` : `Los pinos. Solo pinos. Miras la línea negra tanto rato que empieza a moverse, como se mueve cualquier cosa que miras demasiado. Apartas la vista.`}

${api.bandera("alex_piso_grava") ? "La luz del coche no vuelve. Se quedó apagada con su pie en la grava." : "La luz del coche se apaga. Sin más. Como se encendió."}

${at === "coche" ? "Álex sube los dos escalones de espaldas. Sin dejar de mirar los árboles." : "Álex se aparta de la barandilla. Sin dejar de mirar los árboles."}

Álex: Vamos dentro.

Y ya no hay tiempo para hablar. Lo notas: lo que fuera esta conversación se ha acabado con la luz. Lo que queda es la puerta, y lo que hagas con Álex antes de cruzarla.

${modo(api, "nora", {
  lucido: `~ ${gente ? "Un segundo. Siete personas en un segundo, con la luz del porche y una calada. Lo sé. Lo sé y no me sirve." : "Ha oído algo. Álex no dice «Irene» a los árboles por hacer gracia. No con esa voz."} Y me llevo dentro a un Marcos que no conocía.`,
  asustado: `~ ${gente ? "Estaban mirando la casa. Mirando la casa como se mira un fuego. Y olía a fuego." : "Ha dicho Irene. A los árboles. E Irene está dentro."}`,
  tenso: "~ Dentro. Con Marcos. Esto se lo cuento a él, no a Álex. Lo del sofá también. O no.",
  ido: `~ ${gente ? "Siete. Los he contado. Siete y uno más pequeño delante. No. Seis. No sé." : "La luz del coche se ha apagado cuando Álex ha dicho Irene. Justo cuando."}`,
  perdido: `~ ${gente ? "Nos conocen. Han venido a vernos. Han venido a ver cómo arde." : "Le ha llamado. A él. Con la voz de ella. Ya sabe las voces."}`,
  normal: `~ ${gente ? "Troncos. Troncos y una luz mala. Y me lo voy a repetir hasta que me lo crea." : "Dentro. Y no volver a salir sin luz."}`,
})}`;
      }

      // Álex solo
      const cruza = api.bandera("alex_piso_grava");
      const paso = api.bandera("alex_quiso_cruzar") === false ? `
Te das la vuelta. Subes. Sin mirar los árboles.

Y aun así lo oyes.` : cruza ? `
Bajas. El último escalón. Y el pie en la grava. Cruje. Está mojada y cruje y está fría a través de la zapatilla.

Y la luz del porche se apaga.

Detrás de ti. Y la del coche. Las dos. A la vez.

Sacas el pie. Lo pones en el escalón. La luz del porche vuelve. La del coche no.

Te quedas ahí. Con un pie en cada mundo.` : `
Bajas. El último escalón. Y ahí te paras. No en la grava. En el escalón. Con la mano en la barandilla.

No sabes por qué te paras. Sí lo sabes.`;
      return `${paso}

${voz ? `Álex.

A la izquierda. Desde los árboles.

La voz de Irene. No la de las bromas. No la de la mesa. La de cuando pide ayuda de verdad, que solo le has oído una vez, hace tres años, en un coche, y no fue una broma.

Álex: ¿Irene?

Lo dices a los pinos. Donde no hay nadie. Donde no hay luz.

Nada.

Álex: ¿Irene?

Nada. Y arriba, en la casa, en la ventana del pasillo, una sombra que pasa. Irene. Arriba. Donde está.

~ Está arriba. La he visto subir. La estoy viendo. Y me ha llamado desde ahí. Desde los árboles. Con la voz de cuando.

~ No. He oído el viento y he puesto su nombre encima. Es lo que hacen los porros. Ponen nombres.` : `Nada. Los pinos. El viento arriba, en las copas, que suena a mar. Y abajo, nada.

Miras el coche. ${cruza ? "A oscuras. Nadie dentro, que se vea." : "La luz sigue encendida. Nadie dentro. Ni delante ni detrás."}`}

${cruza ? "La luz del coche no vuelve. Se quedó apagada con tu pie en la grava." : "La luz del coche se apaga. Sin más. Como se encendió."}

Subes los escalones de espaldas. Sin dejar de mirar los árboles.

${modo(api, "alex", {
  lucido: `~ ${voz ? "Su voz. Su nombre en mi boca. Y ella arriba. Dos cosas verdad que no pueden ser verdad a la vez." : "Una luz que se enciende y se apaga. Un coche viejo. Y yo aquí con el corazón a mil por un coche viejo."}`,
  asustado: `~ ${voz ? "Me ha llamado. Con su voz. Sabe su voz." : "No he bajado. No he bajado y no sé por qué y eso es lo que más miedo me da."}`,
  tenso: "~ Dentro. Ya. Y que Marcos me explique lo de su puto coche.",
  ido: `~ ${voz ? "Ha dicho Álex y ha sonado a Alda. Álex. Alda. Se parecen. Se parecen si estás fumando." : "La grava brillaba como un camino. Y he estado a punto. A punto de qué."}`,
  perdido: `~ ${voz ? "Ya sabe las voces. Ha aprendido la de Irene esta noche. Y me ha llamado con ella para que baje." : "Me quería fuera. La luz era para mí. Y no he ido."}`,
  normal: `~ ${voz ? "El viento. El viento y un nombre. Y ahora dentro, y que se ría alguien." : "Un coche. Una luz. Nada. Y a dentro."}`,
})}`;
    },
    opciones: [
      // Nora: con qué entra. Conflicto, acercamiento o comprensión sin cariño. Y si cuenta lo de los árboles.
      { texto: "«¿Y a Irene qué le pasa conmigo?» En la puerta. Antes de entrar.", a: "v5_cuerda", si: (api) => noraCon(api) === "alex",
        efecto: (api) => { api.marcar("salida_porche", "comprension"); api.marcar("nora_cuenta_gente", false); api.saber("nora", "irene_quiere_a_marcos"); api.rel("nora", "alex", "resentimiento", -2); } },
      { texto: "Entrar sola. Dejarle fuera con el coche. Que se lo mire él.", a: "v5_cuerda", si: (api) => noraCon(api) === "alex",
        efecto: (api) => { api.marcar("salida_porche", "conflicto"); api.marcar("nora_cuenta_gente", false); api.rel("nora", "alex", "resentimiento", 4); api.rel("alex", "nora", "tension", -3); api.est("nora", "estres", 3); } },
      { texto: "Cogerle del brazo. «Vamos.» Y entrar juntos.", a: "v5_cuerda", si: (api) => noraCon(api) === "alex",
        efecto: (api) => { api.marcar("salida_porche", "acercamiento"); api.marcar("nora_cuenta_gente", false); api.rel("alex", "nora", "afecto", 5); api.rel("nora", "alex", "resentimiento", -4); api.rel("alex", "nora", "confianza", 4); } },
      { texto: "«¿Has visto eso?» A Álex. Ya en la puerta.", a: "v5_cuerda", si: (api) => noraCon(api) === "alex" && api.bandera("nora_vio_gente"),
        efecto: (api) => { api.marcar("salida_porche", "comprension"); api.marcar("nora_cuenta_gente", true); api.rel("alex", "nora", "confianza", 4); } },
      { texto: "Sacar el móvil. Fotografiar los árboles. Antes de entrar.", a: "v5_cuerda", lucida: true, si: (api) => noraCon(api) === "alex",
        efecto: (api) => { api.marcar("salida_porche", "comprension"); api.marcar("nora_cuenta_gente", false); api.evidencia("foto_arboles", "nora", "porche", "foto"); api.est("nora", "eje", 2); } },
      // Álex: siempre cuenta. La pregunta es cómo.
      { texto: "Entrar y contarlo. Todo. Con detalles. Con más detalles de los que hubo.", a: "v5_cuerda", si: (api) => noraCon(api) !== "alex",
        efecto: (api) => { api.marcar("alex_cuenta", true); api.est("alex", "eje", 2); } },
      { texto: "Entrar y no decir nada. Por una vez.", a: "v5_cuerda", si: (api) => noraCon(api) !== "alex",
        efecto: (api) => { api.marcar("alex_cuenta", false); api.est("alex", "eje", -3); api.est("alex", "estres", 4); } },
      { texto: "Entrar gritando «¡Irene!». A ver desde dónde contesta.", a: "v5_cuerda", si: (api) => noraCon(api) !== "alex" && api.bandera("alex_oyo_irene_fuera"),
        efecto: (api) => { api.marcar("alex_cuenta", true); api.marcar("alex_grita_irene", true); api.presenciar("alex", 1); } },
    ],
  },

  // =====================================================================
  // RUTA ARRIBA — Irene, o Irene y Marcos
  // =====================================================================

  va1_pasillo: {
    pov: (api) => ireneCon(api) === "marcos" ? (H(api) === "marcos" ? "irene" : "marcos") : "irene",
    fondo: "assets/fondos/dormitorio_alex.jpg",
    ambiente: "arriba",
    musica: "terror_suave",
    lugar: "pasillo de arriba", hora: "03:35",
    titulo: "Arriba · La sudadera",
    alEntrar: (api) => resolverRuta(api, "arriba", true),
    texto: (api) => {
      const pareja = ireneCon(api) === "marcos";
      const h = H(api);
      const cuerda = api.bandera("buhardilla_descubierta") === "irene" ? "La cuerda de la trampilla, quieta, a la altura de la cara. Tú la tiraste esta noche. Tú subiste la escalera con las dos manos. Sigue ahí." : "La cuerda de la trampilla, quieta, a la altura de la cara.";
      const olor = api.bandera("buhardilla_descubierta") === "irene" ? "Como lo que olía la buhardilla esta noche, cuando se abrió." : "Como a fruta pasada. Como a algo que fue dulce.";

      if (!pareja) return `
La escalera. El tercero. El séptimo. Los conoces ya como se conoce una casa en la que has vivido, y llevas aquí ocho horas.

El pasillo. La lámpara de llama falsa haciendo su ciclo: sube, baja, sube. La alfombra roja bajo los pies descalzos, fría. ${cuerda}

Pasas por debajo sin mirarla. La miras.

El dormitorio del fondo. El tuyo y de Álex. La puerta cerrada. La abres.

Oscuro. La cama grande, deshecha desde la siesta de Álex. Las mochilas en el suelo. La ventana con la luna entre los pinos. Enciendes la luz del techo: una bombilla desnuda, amarilla, poca.

La sudadera está en tu mochila, abajo del todo, porque siempre está abajo del todo. Te agachas. Buscas a tientas. Tela, cargador, la bolsa de aseo, tela.

Y el armario hace un ruido.

[toc]

Toc.

Uno. Desde dentro. Como un nudillo contra madera. Como los de la mesa. Pero tú no tienes el talón en ningún sitio.

Te quedas agachada. Con la mano dentro de la mochila.

El armario es de esos antiguos, de dos puertas, con una llave que no gira. Está a un metro de la cama. Está cerrado.

Y huele a algo. Dulce. Muy al fondo. ${olor}

${modo(api, "irene", {
  lucido: "~ La madera. Las casas viejas hacen ruidos cuando cambia la temperatura. Ha bajado la temperatura. Es eso. Es eso y es un armario.",
  asustado: "~ Uno. Como los míos. Como los que he hecho yo. Alguien me está devolviendo los golpes.",
  tenso: "~ Álex. Si esto es Álex otra vez, le mato. No puede ser Álex. Álex está fuera. Le mato igual.",
  ido: "~ El armario ha respirado. No ha sido un golpe. Ha sido una respiración con la madera.",
  perdido: "~ Está dentro. Está dentro del armario y sabe que estoy sola y ha llamado para que abra.",
  normal: "~ Un ruido. Un armario viejo. Y yo agachada con la mano en una mochila como si eso me protegiera de algo.",
})}

La sudadera. La tienes. Y el armario, a un metro, cerrado.`;

      if (h === "marcos") return `
La escalera. El tercero. El séptimo. Marcos detrás.

Marcos no ha dicho nada en toda la escalera. Marcos siempre dice algo en una escalera: que cruje, que cuidado, que la casa de los cojones. Nada. Sus pasos detrás de los tuyos, exactos, como si pisara donde tú pisas.

El pasillo. La lámpara de llama falsa haciendo su ciclo. La alfombra roja, fría bajo los pies descalzos. ${cuerda}

El dormitorio del fondo. El tuyo y de Álex. Abres. Enciendes: una bombilla desnuda, amarilla, poca. La cama deshecha. Las mochilas.

Marcos se queda en la puerta. No entra. Se apoya en el marco con el hombro y te mira buscar.

Te agachas. La sudadera, abajo del todo. Tela, cargador, la bolsa de aseo.

Y el armario hace un ruido.

[toc]

Toc.

Uno. Desde dentro. Como un nudillo contra madera.

Irene: ¿Has oído eso?

Marcos: ¿El qué?

Irene: El armario.

Marcos: No he oído nada.

Lo dice mirando el armario. Como si lo hubiera oído. Como si lo estuviera oyendo todavía.

Y huele a algo. Dulce. ${olor}

${modo(api, "irene", {
  lucido: "~ Lo ha oído. Ha mirado el armario antes de que yo lo dijera. Y ha dicho que no. Marcos no miente: Marcos explica. Y no ha explicado nada.",
  asustado: "~ Me ha seguido pisando donde yo piso. Y ahora no ha oído lo que he oído. Uno de los dos no está bien y no sé cuál.",
  tenso: "~ «No he oído nada.» Con esa cara. Con la cara de la lámpara. Pues muy bien, Marcos.",
  ido: "~ Marcos está en la puerta y su sombra está un poco más adentro que él. Es la bombilla. La bombilla hace eso.",
  perdido: "~ No es él. Es él y no es él. Lo sé porque llevo cinco años leyéndole y ahora no hay nada que leer.",
  normal: "~ Un golpe. Un armario. Y Marcos raro. De todo eso, lo que menos me gusta es Marcos raro.",
})}

La sudadera. La tienes. El armario, a un metro. Y Marcos en la puerta, que no parpadea.`;

      // Irene huésped, Marcos mira desde fuera
      return `
La escalera. Irene delante, descalza. No se gira. No dice nada. Sube como quien sube a su casa.

El pasillo. La lámpara de llama falsa. La alfombra roja. ${cuerda.replace("Tú la tiraste esta noche. Tú subiste la escalera con las dos manos. Sigue ahí.", "Irene la tiró esta noche. Sigue ahí.")}

Irene abre la puerta del fondo. Su dormitorio y de Álex. Enciende. Una bombilla desnuda, amarilla.

Se agacha a la mochila. Saca la sudadera. Y no se la pone.

Se queda de pie. Delante del armario. Con la sudadera en la mano, colgando. Mirando las dos puertas cerradas como se mira a alguien que va a decir algo.

Y el armario hace un ruido.

[toc]

Toc.

Uno. Desde dentro.

Irene no se mueve. No da un paso atrás. No dice «¿qué ha sido eso?», que es lo que dice todo el mundo, que es lo que diría Irene.

Irene: Ya.

Lo dice al armario. Bajo. Como se contesta a alguien.

Marcos: ¿Ya qué?

Se gira. Tarda en girarse. Te mira como si tuviera que acordarse de quién eres.

Irene: Nada. La sudadera.

Se la pone. Del revés. Se la quita. Se la pone bien.

Y huele a algo. Dulce. Muy al fondo. ${olor}

${modo(api, "marcos", {
  lucido: "~ Ha contestado al armario. Ha oído un golpe y ha dicho «ya» como quien dice «ya voy». Eso no es un susto. Eso es otra cosa.",
  asustado: "~ Le ha contestado. Al armario. Y luego me ha mirado como si yo fuera el raro.",
  tenso: "~ Irene haciendo el numerito otra vez. No. No es un numerito. Los numeritos de Irene tienen público y aquí solo estoy yo.",
  ido: "~ Se ha puesto la sudadera del revés. Irene no se pone nada del revés. Irene se viste como quien firma.",
  perdido: "~ Ya no es ella. Se fue en la mesa, cuando no respiraba, y ha vuelto otra cosa con su cara.",
  normal: "~ Un armario viejo. Irene rara. Una sudadera del revés. Vale. Vale. Cada cosa tiene explicación por separado.",
})}

Irene sale del dormitorio. Hacia el baño. Sin apagar la luz. Sin mirarte.`;
    },
    opciones: [
      // Irene (sola o con Marcos huésped)
      { texto: "Abrir el armario. Ahora. Con las dos manos.", a: "va2_bano", si: (api) => !(ireneCon(api) === "marcos" && H(api) === "irene"),
        efecto: (api) => { api.marcar("irene_abre_armario", true); api.saber("irene", "marca_armario"); api.presenciar("irene", 1); } },
      { texto: "No abrirlo. La sudadera y fuera.", a: "va2_bano", si: (api) => !(ireneCon(api) === "marcos" && H(api) === "irene"),
        efecto: (api) => { api.marcar("irene_abre_armario", false); api.est("irene", "estres", 3); } },
      { texto: "«Álex, no tiene puta gracia.» Al armario. En voz alta.", a: "va2_bano", si: (api) => ireneCon(api) !== "marcos",
        efecto: (api) => { api.marcar("irene_abre_armario", false); api.est("irene", "eje", 2); api.est("irene", "miedo", 2); } },
      { texto: "Mirar a Marcos en vez de al armario.", a: "va2_bano", lucida: true, si: (api) => ireneCon(api) === "marcos" && H(api) === "marcos",
        efecto: (api) => { api.marcar("irene_abre_armario", false); api.marcar("irene_lee_marcos", true); api.saber("irene", "marcos_raro"); api.est("irene", "lucidez", 1); } },
      // Marcos (con Irene huésped)
      { texto: "«¿Irene?» Desde la puerta. Y seguirla.", a: "va2_bano", si: (api) => ireneCon(api) === "marcos" && H(api) === "irene",
        efecto: (api) => { api.marcar("marcos_armario", "sigue"); } },
      { texto: "Entrar. Ponerle la mano en el hombro antes de que salga.", a: "va2_bano", si: (api) => ireneCon(api) === "marcos" && H(api) === "irene",
        efecto: (api) => { api.marcar("marcos_armario", "toca"); api.saber("marcos", "irene_fria"); api.est("marcos", "miedo", 3); } },
      { texto: "Abrir el armario tú. A ver qué coño hay.", a: "va2_bano", si: (api) => ireneCon(api) === "marcos" && H(api) === "irene",
        efecto: (api) => { api.marcar("marcos_armario", "abre"); api.saber("marcos", "marca_armario"); api.est("marcos", "eje", 2); api.presenciar("marcos", 1); } },
    ],
  },

  va2_bano: {
    pov: (api) => ireneCon(api) === "marcos" ? H(api) : "irene",
    fondo: "assets/fondos/bano.jpg",
    ambiente: "bano",
    lugar: "baño de arriba", hora: "03:40",
    titulo: "Arriba · El agua",
    texto: (api) => {
      const pareja = ireneCon(api) === "marcos";
      const h = H(api);
      const voz = api.bandera("irene_oyo_alex_puerta");
      const armario = api.bandera("irene_abre_armario") ? `
Lo abriste. Con las dos manos, de golpe, como se abre una cosa para que no dé tiempo a pensar.

Abrigos. De otra gente. De gente que ya no vive aquí. El olor dulce, más fuerte, como si viniera de la lana. Y en el fondo, en la madera, a la altura de tu cadera, una marca. Redonda. Gastada. Oscura. Como si alguien pequeño hubiera estado apoyado ahí mucho tiempo, con la espalda, mirando hacia fuera.

Lo cerraste. La llave no gira. Lo cerraste igual.` : `
No lo abriste. La sudadera, y fuera, y la luz apagada, y la puerta cerrada. No has mirado el armario. Lo has mirado.`;

      if (!pareja) return `${armario}

El pasillo. La luz del baño, al fondo, encendida. ${api.bandera("irene_fuera") === "bano" ? "La dejaste tú, en mitad de la ouija, cuando subiste a mirarte el cuello." : "Nadie se acuerda de haberla encendido."}

Y el agua.

Se oye el agua. Un grifo abierto. Desde el pasillo, claro, con el chorro golpeando la porcelana, con ese ruido que hace el agua cuando lleva rato cayendo.

~ Nora. Nora ha subido. No. Nora está abajo, o fuera, o donde esté Nora. Y no ha pasado por delante de mí.

Abres la puerta del baño.

El grifo cerrado. El lavabo seco. La bañera seca. La vela del alféizar, consumida hasta el plato. Y el ruido del agua, que se ha parado en el momento exacto en que has tocado el pomo. No antes. No después.

${api.bandera("irene_espejo") ? `Te miras en el espejo.

Y el espejo tarda. No como antes, cuando ibas cargada: tarda de otra manera. Como si la que hay dentro tuviera que acordarse de cómo eres. Y durante un segundo, uno, no sabes de quién es esa cara.

Luego sí. Luego es la tuya. Tragas.

~ Nora lleva la camisa de Marcos. La camisa que yo le regalé. Habría que quitársela.

Eso no lo has pensado tú. Eso ha llegado. Y se ha quedado, como se queda un sabor.` : `Te miras en el espejo. La versión borrada. Te abrochas un botón por debajo de la sudadera. Te lo desabrochas. Da igual: no se ve.`}

${voz ? `Y entonces, detrás de la puerta, en el pasillo:

Álex: Irene.

La voz de Álex. Pegada a la puerta. Con la voz de cuando quiere algo y no lo va a pedir bien.

Irene: ¿Qué?

Nada.

Irene: Álex, no tiene puta gracia.

Abres.

El pasillo. Vacío. La lámpara de llama falsa. La cuerda, quieta. Y por la ventana del pasillo, abajo, en el porche, la brasa. Álex. Fuera. A treinta metros. Fumando.${noraPorche(api) ? " Y Nora a su lado, con la camisa de Marcos, escuchándole." : ""}

~ Estaba aquí. Pegado a la puerta. He oído hasta la respiración. Y está allí.

~ No. He oído el agua, que no era agua, y una voz, que no era una voz. Es lo que pasa en esta casa con las cosas: que no son.` : `Nada más. Ni voz ni agua. Solo tú y un baño seco y una vela gastada.

Y por la ventana del pasillo, cuando sales, abajo, en el porche, la brasa de Álex. Fumando. Lejos.${noraPorche(api) ? " Y Nora a su lado, con la camisa de Marcos." : ""}`}

${modo(api, "irene", {
  lucido: "~ Un grifo que suena y no corre. Una voz que llama y no está. Dos cosas que no dejan huella. Es como si esta casa supiera exactamente qué es lo que no se puede demostrar.",
  asustado: `~ Ha dicho mi nombre. ${api.bandera("voz_desertor") ? "Otra vez. Ya van dos esta noche, y ninguna era nadie." : "Y no era nadie."}`,
  tenso: "~ No lo voy a contar. No voy a bajar y decir «he oído a Álex» con Álex delante. No me van a mirar así otra vez.",
  ido: "~ El agua sonaba a mi nombre. Con el chorro. I-re-ne. Como el vaso.",
  perdido: "~ Sabe mi voz y sabe la de Álex. Las está probando. Está viendo cuál me hace abrir la puerta.",
  normal: "~ Bajar. Con la sudadera. Con la cara puesta. Y no contar nada.",
})}`;

      if (h === "marcos") {
        // Marcos huésped, dentro
        const sujeto = api.bandera("huesped_sujeto") === "irene";
        return `
El pasillo. Irene ha entrado en el baño y ha cerrado. Te has quedado fuera, apoyado en la pared, al lado de la lámpara de llama falsa, que hace su ciclo. Sube. Baja. Sube.

${api.bandera("irene_lee_marcos") ? "Te ha mirado en el dormitorio. Mucho rato. Como se mira a alguien que ha cambiado de peinado y no sabes qué. No te ha dicho nada." : "Dentro, Irene. La puerta cerrada. Ni un ruido."}

Y se oye el agua. El grifo. El chorro contra la porcelana.

~ Aliento.

Eso ha llegado. Así, sin más. Una palabra sola, en tu cabeza, con tu voz. No estabas pensando en nada. Estabas mirando la lámpara.

~ Aliento.

Irene: ¿Marcos?

Desde dentro. Por encima del agua.

No contestas. Te oyes no contestar. Sabes que estás oyendo tu nombre y sabes que hay que decir «qué» y no lo dices. Como cuando sueñas que hablas y no sale.

Irene: ¿Marcos? ¿Estás ahí?

La lámpara sube. Baja. Sube. Baja. Tres veces. Cuatro. Has contado cuatro y no te acuerdas de las de en medio.

El agua se para.

La puerta se abre.

Y estás ahí. Justo ahí. A un palmo. Más cerca de lo que estabas. Con la mano en el marco de la puerta, a la altura de su cara.

Irene: ¿Qué haces?

${sujeto ? `Y tu mano la coge del brazo. Por encima del codo. Fuerte. Más fuerte de lo que se coge a nadie.

Marcos: Todavía no.

Lo has dicho tú. Con tu voz. No sabes qué es «todavía no». No sabes por qué la sujetas. Sabes que la sujetas.

Irene: Marcos.

Miras tu mano. Y tarda un segundo en ser tu mano.

La sueltas.

Le has dejado la marca. Cuatro dedos, rojos, en el brazo, encima del codo. Se los mira. Te mira.

Irene: ¿Qué coño haces?

Marcos: Nada. Perdona. Me he... nada.` : `Marcos: Nada. Esperarte.

Irene: Te he llamado tres veces.

Marcos: No te he oído.

Irene: Tenías la cara pegada a la puerta.

No te acuerdas de tener la cara pegada a la puerta. Te acuerdas de la pared. De la lámpara. Y de la puerta abriéndose.`}

Marcos: ¿Has dejado el grifo abierto?

Irene: ¿Qué grifo?

Marcos: El del lavabo. Se oía.

Irene: No he abierto ningún grifo.

Miras por encima de su hombro. El lavabo, seco. El grifo, cerrado. La vela del alféizar, consumida.

${modo(api, "marcos", {
  lucido: "~ Un lapso. Un vacío de veinte segundos con mi nombre dentro. Y una palabra que no era mía. Hay nombres para esto. Hay nombres médicos. Ninguno me sirve porque ninguno explica el agua.",
  asustado: `~ ${sujeto ? "La he sujetado. Le he dicho «todavía no». Yo. Y no sé qué era todavía no. Y lo sabía mientras lo decía." : "No he contestado. He oído mi nombre tres veces y algo ha decidido que no contestara. Algo que no era yo."}`,
  tenso: "~ Vale. Vale. Cansancio. Cuatro horas de mierda y un sueño de pie. Los sueños de pie existen. Existen.",
  ido: "~ Aliento. Es una palabra bonita. Suena a lo que es. Entra y sale. Entra y sale.",
  perdido: `~ ${sujeto ? "Le he dicho que todavía no. Porque todavía no. Porque primero tiene que pasar lo otro." : "Me ha dicho que la esperara. Lo que tengo dentro. Y he esperado."}`,
  normal: "~ Aliento. Por qué aliento. De dónde ha salido aliento.",
})}`;
      }

      // Irene huésped, dentro
      const quemo = api.bandera("huesped_quemo");
      const ma = api.bandera("marcos_armario");
      return `
${ma === "toca" ? "Te ha puesto la mano en el hombro antes de salir del dormitorio. Y la ha quitado rápido. Como quien toca algo que no está a la temperatura que esperaba." : ma === "abre" ? "Ha abierto el armario. Marcos. Con las dos manos. Ha mirado dentro un rato y ha cerrado sin decir nada. No le has preguntado qué había. Ya lo sabes." : "Te ha seguido. Sin decir nada. A un paso."}

El baño. Abres el grifo del agua caliente. Sale fría. Y luego, de repente, caliente. Como siempre en esta casa.

Metes la mano. Está bien. Está como tiene que estar.

Irene: Marcos. Ven. El agua sale rara.

Marcos: ¿Rara cómo?

Irene: Ven.

Viene. Se pone a tu lado. Mete la mano bajo el chorro.

Marcos: Sale normal.

Le coges la muñeca.

${quemo ? `Y el agua deja de estar caliente y pasa a estar hirviendo. Se ve: el vapor. Se oye: el chorro cambia de voz.

Y no le sueltas.

Marcos: Irene.

Un segundo. Dos.

Marcos: Irene, joder.

Tres.

Le sueltas. Cierra el grifo él, con la otra mano. Se mira la mano. Roja. Roja de verdad, con la piel tirante, con el dorso brillante.

Marcos: ¿Qué coño...?

Irene: Perdona.

No te acuerdas de haberle cogido la muñeca. Te acuerdas de antes: «ven». Y de después: la mano roja. En medio no hay nada. En medio hay un hueco con la forma de tres segundos.

~ Aliento. Se lo llevó él.

Eso no lo has pensado tú. Eso ha llegado.` : `Le sostienes la mano bajo el agua. Un segundo más de lo normal. Dos. Marcos la saca. Te mira.

Marcos: ¿Qué?

Irene: Nada. Que sale rara.

No te acuerdas de haberle cogido la muñeca. Te acuerdas de «ven» y de su cara. En medio hay un hueco pequeño. Con la forma de dos segundos.

~ Aliento. Se lo llevó él.

Eso no lo has pensado tú. Eso ha llegado.`}

Cierras el grifo. O ya está cerrado. El lavabo se vacía con el ruido de siempre.

${modo(api, "irene", {
  lucido: `~ ${quemo ? "Le he quemado. Yo. Con las manos. Y hay tres segundos que no existen. Nunca me ha faltado un segundo en la vida. Sé exactamente lo que hago siempre. Siempre." : "Dos segundos que no están. Y una palabra que no es mía. Y Marcos mirándome como si yo fuera la lámpara."}`,
  asustado: "~ Se lo llevó él. Aliento. Yo no sé qué significa eso y lo sé.",
  tenso: "~ Que no me mire así. Que no me mire como en la mesa. Que diga «sale rara» y ya.",
  ido: "~ El vapor tenía forma. Subía y hacía una forma. Como una cara. Como la del espejo.",
  perdido: `~ ${quemo ? "Le he marcado. Primero el aire y ahora la mano. Le estoy dejando señales para saber cuál es." : "Le he tocado para ver si seguía ahí. Lo que le di. Sigue."}`,
  normal: "~ Perdona. Perdona. Y bajar. Y que no lo cuente.",
})}`;
    },
    opciones: [
      // Irene sola
      { texto: "Bajar. Y no contar nada. Nunca.", a: "v5_cuerda", si: (api) => ireneCon(api) !== "marcos",
        efecto: (api) => { api.marcar("irene_cuenta", false); api.est("irene", "eje", 2); } },
      { texto: "Bajar y preguntarle a Álex si ha subido. Delante de todos.", a: "v5_cuerda", si: (api) => ireneCon(api) !== "marcos",
        efecto: (api) => { api.marcar("irene_cuenta", true); api.est("irene", "estres", 3); } },
      { texto: "Grabar un audio. «Álex, si has sido tú, te mato.» Y mandárselo.", a: "v5_cuerda", lucida: true, si: (api) => ireneCon(api) !== "marcos",
        efecto: (api) => { api.marcar("irene_cuenta", false); api.evidencia("audio_irene_bano", "irene", "baño de arriba", "audio"); api.est("irene", "lucidez", 1); } },
      // Marcos huésped
      { texto: "«Perdona.» Y bajar el primero. Rápido.", a: "v5_cuerda", si: (api) => ireneCon(api) === "marcos" && H(api) === "marcos",
        efecto: (api) => { api.marcar("marcos_tras_lapso", "baja"); api.marcar("marcos_cuenta_grifo", false); api.est("marcos", "estres", 4); } },
      { texto: "«No he sido yo.» Decirlo. Y oírte decirlo.", a: "v5_cuerda", si: (api) => ireneCon(api) === "marcos" && H(api) === "marcos",
        efecto: (api) => { api.marcar("marcos_tras_lapso", "niega"); api.marcar("marcos_cuenta_grifo", false); api.rel("irene", "marcos", "confianza", -4); api.est("irene", "miedo", 4); } },
      { texto: "Mirarte la mano. Un rato. Hasta que sea tuya.", a: "v5_cuerda", lucida: true, si: (api) => ireneCon(api) === "marcos" && H(api) === "marcos",
        efecto: (api) => { api.marcar("marcos_tras_lapso", "mano"); api.marcar("marcos_cuenta_grifo", true); api.saber("marcos", "lapso"); api.est("marcos", "lucidez", 1); } },
      // Irene huésped
      { texto: "«Perdona.» Secarle la mano con la toalla. Con cuidado.", a: "v5_cuerda", si: (api) => ireneCon(api) === "marcos" && H(api) === "irene",
        efecto: (api) => { api.marcar("irene_tras_lapso", "toalla"); api.marcar("irene_cuenta", false); api.rel("marcos", "irene", "afecto", 2); } },
      { texto: "«El agua sale rara.» Como si fuera lo único que ha pasado.", a: "v5_cuerda", si: (api) => ireneCon(api) === "marcos" && H(api) === "irene",
        efecto: (api) => { api.marcar("irene_tras_lapso", "agua"); api.marcar("irene_cuenta", false); api.rel("marcos", "irene", "confianza", -4); api.est("irene", "eje", 2); } },
      { texto: "Mirarle. Ver si te ha reconocido.", a: "v5_cuerda", lucida: true, si: (api) => ireneCon(api) === "marcos" && H(api) === "irene",
        efecto: (api) => { api.marcar("irene_tras_lapso", "mira"); api.marcar("irene_cuenta", false); api.saber("irene", "lapso"); api.est("irene", "lucidez", 1); } },
    ],
  },

  // =====================================================================
  // RUTA ALMACÉN — Marcos solo
  // =====================================================================

  vm1_cocina: {
    pov: "marcos",
    fondo: "assets/fondos/cocina_noche.jpg",
    ambiente: "cocina",
    musica: "terror_suave",
    lugar: "cocina", hora: "03:35",
    titulo: "La cocina · El piloto",
    alEntrar: (api) => resolverRuta(api, "almacen", true),
    texto: (api) => {
      const d11 = api.bandera("d11b");
      const sarten = d11 === "foto" ? "La sartén de hierro sigue en el fuego. Le hiciste una foto hace hora y media, con el mando en cero y el reloj detrás, y te reíste de ti mismo mientras la hacías." : d11 === "comprobar" ? "La sartén de hierro sigue en el fuego. La tocaste hace hora y media. Estaba templada y decidiste que el hierro guarda el calor en la ventana. A las doce de la noche." : "La sartén de hierro sigue en el fuego. Pasaste de ella hace hora y media. Ahora no pasas.";
      const grifo = api.bandera("grifo") === "goteando" ? "El grifo gotea. Lo cerraste tú. Gotea." : "";
      return `
La luz blanca de la cocina. De tubo. Parpadea una vez al encenderse, como siempre, y luego se queda.

${sarten}

El mando del fuego está en cero. Lo miras dos veces. Cero.

Y el piloto está encendido.

El punto rojo. El de «placa caliente», el que se enciende cuando has cocinado y se apaga cuando se enfría. Encendido. Rojo. Fijo.

${grifo}

Pones la mano encima del fuego sin tocar. A un palmo. Calor. Poco. El que hace una placa que se ha usado hace media hora, no hace tres.

${modo(api, "marcos", {
  lucido: "~ Un piloto con un sensor jodido. Una placa vieja con un relé que se queda pegado. Hay tres cosas que explican esto y las tres son eléctricas. Por eso he venido: por lo eléctrico.",
  asustado: "~ Nadie ha cocinado. Nadie ha entrado aquí desde que salí yo con el hielo. Y está caliente.",
  tenso: "~ Otro puto piloto. Otra puta lámpara. Esta casa tiene la instalación de un barco hundido.",
  ido: "~ El punto rojo late. No late. Es la vista. Es que lo miro fijo y todo lo que se mira fijo late.",
  perdido: "~ Alguien ha cocinado. Mientras estábamos en la mesa. Ha venido, ha cocinado y se ha ido. Y no ha comido.",
  normal: "~ Templada. Otra vez. Vale. Vale. Apunta y sigue.",
})}

La puerta del almacén está al lado de la nevera. Es la que buscas. El cuadro de luces está dentro, lo viste al llegar: una caja gris con la tapa medio suelta.`;
    },
    opciones: [
      { texto: "Foto. La sartén, el piloto rojo, el reloj de pared. Por si acaso.", a: "vm2_almacen", lucida: true,
        efecto: (api) => { api.evidencia("foto_sarten_2", "marcos", "cocina", "foto"); api.marcar("marcos_piloto", "foto"); api.est("marcos", "lucidez", 1); } },
      { texto: "Girar el mando. Del cero al cero. Y no pensarlo.", a: "vm2_almacen",
        efecto: (api) => { api.marcar("marcos_piloto", "apaga"); api.est("marcos", "eje", 2); api.est("marcos", "estres", 2); } },
      { texto: "Tocar la sartén. Con dos dedos. Saberlo.", a: "vm2_almacen",
        efecto: (api) => { api.marcar("marcos_piloto", "toca"); api.saber("marcos", "sarten_templada_2"); api.est("marcos", "miedo", 3); api.est("marcos", "eje", -3); } },
    ],
  },

  vm2_almacen: {
    pov: "marcos",
    fondo: "assets/fondos/almacen.jpg",
    ambiente: "almacen",
    lugar: "almacén", hora: "03:40",
    titulo: "El almacén · La estantería",
    texto: (api) => {
      const h = H(api);
      const huesped = h === "marcos";
      const arrastre = api.bandera("arrastre_almacen");
      const piloto = api.bandera("marcos_piloto") === "toca" ? "Templada. Como una mano. Lo sabes. Ahora lo sabes." : api.bandera("marcos_piloto") === "apaga" ? "Has girado el mando del cero al cero. El piloto sigue rojo. Claro que sigue." : "La foto ha salido. La sartén, el punto rojo, las cuatro menos veinticinco. Que conste.";
      return `
${piloto}

La puerta del almacén. Madera. Sin cerradura. La abres.

Un escalón de piedra hacia abajo. Uno. Y el frío.

No es el frío de la casa. Es otro: el que sale de un sitio que no se calienta nunca. Te entra por los tobillos. Y el olor. Tierra mojada. Y debajo de la tierra, algo dulce. ${api.sabe("marcos", "marca_armario") ? "Lo mismo que olía el armario de arriba." : "Como fruta que lleva demasiado tiempo en una bolsa."}

Buscas el interruptor. Una bombilla de cuarenta vatios, colgando de un cable. Suficiente.

Un cuarto de tres por tres. Suelo de piedra. Una estantería de madera al fondo, con tarros vacíos, una garrafa, cuerda, una linterna grande de pilas, una caja de herramientas de alguien que ya no vive aquí. Y a la izquierda, la caja gris. El cuadro.

La tapa, medio suelta. La levantas.

Un diferencial. Bajado.

Lo subes. Clac. Y detrás de ti, en el salón, a través de la puerta, la luz sube de tono. Se oye subir. Una lámpara que estaba a medias y ahora está entera.

~ Un diferencial. Un cuarto de vuelta en una bombilla y un diferencial que salta. Dos cosas. Dos cosas explicables que pasan la misma noche en la misma casa.

Cierras la tapa. ${api.bandera("alex_llamo_marcos") ? "Y desde fuera, lejos, a través de toda la casa, Álex grita algo. Tu nombre. Y «coche». No sales. Lo que sea que le pase al coche puede esperar a lo que tienes delante.\n\n" : ""}Y miras la estantería.

No está contra la pared.

Hay un hueco. Dos dedos. Y detrás de la estantería la pared no es de madera. Es de piedra. Piedra vieja, gris, con las juntas de tierra. La única pared de piedra que has visto en toda la casa.

Te agachas. Por el hueco, a la altura del tobillo, sale aire. Frío. Constante. Como de una rendija que da a algún sitio.

${arrastre ? `Y entonces, detrás. Detrás de la piedra.

[arrastre]

Un arrastre.

Bajo. Una vez. Como algo pesado que se mueve un palmo sobre piedra y se para. No un animal: un animal hace ruido de patas. Esto no tenía patas. Esto tenía peso.

Te quedas agachado. Con la mano en el estante. Sin respirar.

Nada más.` : `Nada más. El aire por la rendija. La bombilla. Tu respiración, que se oye demasiado aquí dentro.`}

${huesped ? `~ Abajo.

Eso ha llegado. Una palabra. Con tu voz. Sin que la pensaras.

~ Abajo.

Y tu mano, en el estante, tira. La ves tirar. La madera chirría contra la piedra. Diez centímetros. Y te miras la mano y la sueltas y la estantería está diez centímetros más adelante y no te acuerdas de haber decidido moverla.

Te acuerdas de «abajo». De eso te acuerdas.` : ""}

${modo(api, "marcos", {
  lucido: `~ ${arrastre ? "Un arrastre detrás de una pared de piedra que da a algún sitio con corriente de aire. Un sótano. Un animal grande en un sótano. Un tejón. Los tejones pesan." : "Una pared de piedra. Una rendija con aire. Debajo de esta casa hay un hueco y alguien ha puesto una estantería delante para que no se sepa."}`,
  asustado: `~ ${arrastre ? "Tenía peso. Lo he oído tener peso. Y está a dos dedos de mi mano." : "Aire. De abajo. Hay un abajo. Álex dijo que había un abajo y hay un abajo."}`,
  tenso: "~ Un sótano tapiado. Cojonudo. Una casa de alquiler con un sótano tapiado y una estantería de mierda delante. Se lo voy a decir al de la inmobiliaria.",
  ido: `~ ${arrastre ? "Se ha movido un palmo. Como yo. Como cuando me muevo en la cama para no despertar a Nora." : "El aire de la rendija huele a dulce y a tierra. Huele a fruta pasada. A algo que lleva mucho tiempo en un sitio cerrado. Yo no he subido nunca a la buhardilla."}`,
  perdido: `~ ${huesped ? "Abajo. Es donde hay que ir. Es donde está. Ajoba. Abajo. Lo dijo en la mesa y no lo entendí." : "Hay una habitación debajo. Con cunas. Lo contó Álex. Lo contó porque es verdad."}`,
  normal: "~ Una puerta tapada. Una rendija. Un ruido. Y ahora, la decisión de siempre: mirar o contarlo.",
})}`;
    },
    opciones: [
      { texto: "Mover la estantería. A ver qué hay.", a: "v5_cuerda",
        efecto: (api) => { api.marcar("marcos_movio_estanteria", true); api.saber("marcos", "puerta_vista"); api.marcar("marcos_cuenta_puerta", true); api.marcar("marcos_cuenta_arrastre", false); api.presenciar("marcos", 1); } },
      { texto: "Foto al cuadro y a la rendija. Y fuera.", a: "v5_cuerda", lucida: true,
        efecto: (api) => { api.marcar("marcos_movio_estanteria", false); api.evidencia("foto_cuadro", "marcos", "almacén", "foto"); api.marcar("marcos_cuenta_puerta", true); api.marcar("marcos_cuenta_arrastre", false); api.est("marcos", "lucidez", 1); } },
      { texto: "Cerrar. Salir. Contar lo del diferencial y nada más.", a: "v5_cuerda",
        efecto: (api) => { api.marcar("marcos_movio_estanteria", false); api.marcar("marcos_cuenta_puerta", false); api.marcar("marcos_cuenta_arrastre", false); api.est("marcos", "eje", 2); api.est("marcos", "estres", 3); } },
      { texto: "Salir y contarlo todo. También lo que has oído. Aunque suene a Álex.", a: "v5_cuerda", lucida: true, si: (api) => api.bandera("arrastre_almacen"),
        efecto: (api) => { api.marcar("marcos_movio_estanteria", false); api.marcar("marcos_cuenta_puerta", true); api.marcar("marcos_cuenta_arrastre", true); api.est("marcos", "eje", -2); } },
      { texto: "Quedarte. Un minuto. Con la mano en el estante. Sin saber por qué.", a: "v5_cuerda", si: (api) => H(api) === "marcos",
        efecto: (api) => { api.marcar("marcos_movio_estanteria", true); api.marcar("marcos_se_quedo", true); api.saber("marcos", "puerta_vista"); api.marcar("marcos_cuenta_puerta", false); api.marcar("marcos_cuenta_arrastre", false); api.est("marcos", "estres", 6); api.est("marcos", "lucidez", -2); } },
    ],
  },

  // =====================================================================
  // RUTA BUHARDILLA — Nora, o Nora y Marcos
  // =====================================================================
  // TRAMO 2 — LA CUERDA: todos de vuelta, y Nora decide con quién sube
  // =====================================================================

  v5_cuerda: {
    pov: "nora",
    fondo: "assets/fondos/salon_noche.jpg",
    ambiente: "interior",
    musica: "terror_suave",
    lugar: "comedor", hora: "03:42",
    titulo: "La dispersión · La cuerda",
    alEntrar: (api) => {
      T1.forEach((r) => resolverRuta(api, r, false));
      api.marcar("v_tramo", 2);
      api.est("nora", "estres", 2);
    },
    texto: (api) => {
      const h = H(api);
      const porche = noraPorche(api);
      const ic = ireneCon(api);
      const sp = api.bandera("salida_porche");
      const vn = api.bandera("vn1_nora");
      const vuelta = porche ? (sp === "conflicto" ? `
Entras sola. Dejas la puerta abierta a tu espalda y el frío entra contigo hasta la tabla. Álex tarda un minuto. Cuando entra, el coche está apagado y él tiene la cara de quien ha perdido una discusión que no ha tenido.` : sp === "acercamiento" ? `
Entras con Álex del brazo. En la puerta, antes de soltarte, te dice bajo, sin mirarte:

Álex: Marcos no me dejó verle llorar en cinco años. A ti te ha dejado en cinco meses. Cuídalo.

Y entra como si no lo hubiera dicho. Como si fuera del frío.` : `
Entráis juntos. Sin tocaros. Os entendéis y no os gustáis, y caben las dos cosas en una puerta.

${api.bandera("nora_cuenta_gente") ? "Nora: ¿Has visto eso?\n\nÁlex: ¿El qué?\n\nNora: Nada.\n\nÁlex mira los pinos. No ha visto nada. Se le ve. Y no hace el chiste, que es lo raro." : api.sabe("nora", "irene_quiere_a_marcos") ? "Nora: ¿Y a Irene qué le pasa conmigo?\n\nÁlex: Que le has quitado la camisa.\n\nSe ríe. No es una broma del todo. Y no dice más, porque ya está dentro." : ""}`) : vn === "escalera" ? `
Sigues al pie de la escalera, con la mano en el pasamanos, cuando empiezan a volver.` : vn === "cocina" ? `
Vuelves del arco de la cocina, donde has visto a Marcos agachado delante de la estantería del fondo, con la mano en un estante y sin moverse, cuando empiezan a volver.` : `
Sigues en tu silla, con el cuaderno, cuando empiezan a volver.`;
      const llegan = [];
      if (!porche) llegan.push(api.bandera("alex_grita_irene") ? `
La puerta principal. Álex entra con el frío detrás.

Álex: ¡Irene!

A gritos. Hacia arriba.

Irene: ¿Qué?

Desde arriba. Desde el pasillo. Clara.

Álex se queda con la mano en la puerta. Cierra despacio.

Álex: Nada. Saber dónde estabas.` : `
La puerta principal. Álex entra con el frío detrás y la cara de quien trae algo. Se sienta. No lo suelta. Todavía.`);
      if (ic === "marcos") llegan.push(`
La escalera. Irene y Marcos. Ella delante, con la sudadera puesta${api.bandera("huesped_sujeto") === "irene" ? " y la manga bajada hasta los nudillos" : ""}. Él detrás${api.bandera("huesped_quemo") ? ", con la mano derecha pegada al cuerpo, como se lleva una mano que duele" : ", mirando la puerta del baño por encima del hombro"}.`);
      else {
        if (api.bandera("v_marcos_libre")) llegan.push(`
El arco de la cocina. Marcos. Con polvo en las rodillas y la cara de haber resuelto algo, o de no haberlo resuelto.${porche && h === "marcos" ? " Te ve entrar con Álex y no hay nada en la mirada. Nada. Ni un chiste. Marcos no hace eso." : porche && api.relv("marcos", "nora", "confianza") >= 55 ? " Te ve entrar con Álex y te sonríe. Sin preguntar. Marcos hace eso." : ""}`);
        llegan.push(api.bandera("v_irene_callada") ? `
Y la escalera. Irene. Con la sudadera. Baja despacio, con la mano en la barandilla y la otra en el cuello, y se sienta sin decir nada, y coge su vaso, y no bebe.` : `
Y la escalera. Irene. Con la sudadera. Se sienta. Coge su vaso.`);
      }
      return `${vuelta}
${llegan.join("\n")}

Cuatro otra vez. En la mesa, o alrededor de la mesa. Nadie cuenta nada todavía. Es lo que pasa cuando cada uno vuelve de un sitio distinto: primero se mira a los otros, para ver si traen la misma cara. No la traen.

Y la cuerda.

${vn === "escalera" ? "La tienes delante, arriba, en el hueco del pasillo: la cuerda de la trampilla." : "Miras la escalera. Desde tu silla se ve el hueco, el pasamanos, la sombra del pasillo de arriba. Y en la sombra, la cuerda de la trampilla."} Y se mueve.

Poco. Como un péndulo al que le queda poco. Ida y vuelta, ida y vuelta, y para.

~ Corriente. La puerta ha estado abierta diez minutos. Claro que hay corriente.

${h === "irene" ? "Irene también la mira. Es la única que la mira contigo. Con la mano en el cuello. Y no dice nada, y tú no sabes si es que no la ha visto moverse o es que sí." : "Nadie más la mira. Marcos está con la cerveza. Álex con el mechero. Irene con el vaso."}

~ Quiero ver esa cuerda. Ahora. Con la casa llena y todos abajo, antes de que a alguien se le ocurra otra necesidad.

${modo(api, "nora", {
  lucido: "~ Con Marcos, porque si hay algo arriba quiero su mano en la escalera. Con Irene, porque llevo toda la noche sin hablar con ella a solas y arriba no hay nadie que nos oiga. Sola, que es como se miran las cosas de verdad. Cada uno cuesta algo.",
  asustado: "~ No quiero subir sola. Y no quiero no subir. Quiero que suba alguien conmigo y que no me pregunte por qué.",
  tenso: `~ ${api.bandera("nora_reaccion_beso") === "marcos" || api.bandera("nora_reaccion_beso") === "silencio" ? "Marcos con la cerveza. Sin mirarme. Después de lo de antes. Pues muy bien. Subo con quien sea." : "Como si no hubiera pasado nada. Como si Alda fuera un chiste. Y yo con ganas de decírselo a Irene a la cara, arriba, donde no nos oigan."}`,
  ido: "~ Se ha movido con la puerta cerrada. Sin corriente. Tengo que verla. Con alguien o sin nadie.",
  perdido: "~ Me llama. Con la cuerda. Como se llama a un perro con la mano. Y voy a ir. Súbete con alguien. Con quien sea.",
  normal: "~ Álex con el mechero. Marcos con la cerveza. Irene con el vaso. Y arriba, una cuerda. Elige, Nora. Elige con quién.",
})}`;
    },
    opciones: [
      { texto: "Subir. Sola. A mirar la cuerda de la trampilla.", a: "v6_reparto2",
        efecto: (api) => { api.marcar("v2_nora", "sola"); api.est("nora", "eje", 3); } },
      { texto: "«Marcos. Ven conmigo arriba.»", a: "v6_reparto2", si: (api) => api.relv("nora", "marcos", "confianza") >= 45 || api.valor("nora", "miedo") >= 50,
        efecto: (api) => { api.marcar("v2_nora", "marcos"); api.rel("marcos", "nora", "proteccion", 3); } },
      { texto: "«Irene. Ven. Quiero enseñarte una cosa arriba.»", a: "v6_reparto2",
        efecto: (api) => { api.marcar("v2_nora", "irene"); api.est("nora", "eje", 2); api.rel("irene", "nora", "tension", 3); api.rel("nora", "irene", "confianza", 2); } },
      { texto: "Preguntar primero. «¿Alguien ha subido a la buhardilla esta noche?» A los tres.", a: "v6_reparto2", lucida: true,
        efecto: (api) => { api.marcar("v2_nora", "sola"); api.marcar("nora_pregunto_buhardilla", true); api.est("nora", "lucidez", 1); } },
    ],
  },

  v6_reparto2: {
    pov: null,
    fondo: "assets/fondos/salon_vacio.jpg",
    musica: null,
    titulo: "La dispersión · Arriba, y los que se quedan",
    hora: "03:44",
    alEntrar: (api) => repartir2(api),
    texto: (api) => {
      const nc = noraCon(api), q = quedan(api);
      const pregunto = api.bandera("nora_pregunto_buhardilla") ? `
Nora: ¿Alguien ha subido a la buhardilla esta noche?

Álex: Yo no.

Marcos: No.

${api.bandera("buhardilla_descubierta") === "irene" ? "Irene: Yo no. Yo solo la cerré.\n\nY mira la escalera." : "Irene no contesta. Irene mira la escalera."}
` : "";
      const nora = nc === "irene" ? (api.bandera("v_irene_callada") ? `
Nora: Irene. Ven. Quiero enseñarte una cosa arriba.

Irene se levanta. No pregunta qué cosa. Va hacia la escalera como quien va a un sitio al que ya ha ido, con la mano en el cuello, y sube. Nora detrás. Dos escalones por debajo. El tercero. El séptimo. Irene no la mira ni una vez.` : `
Nora: Irene. Ven. Quiero enseñarte una cosa arriba.

Irene la mira desde su silla. Con esa cara: la de calcular.

Irene: ¿A qué?

Nora: A ver una cosa. Y a que no suba sola.

Irene: Tú no subes sola. Subes.

Pero se levanta. Suben las dos. Irene delante, descalza; Nora detrás, con el cuaderno. Es la primera vez en toda la noche que están a solas, y las dos lo saben, y ninguna lo dice.`) : nc === "marcos" ? `
Nora: Marcos. Ven conmigo arriba.

Marcos deja la cerveza. La mira.

Marcos: ¿Arriba?

Nora: Quiero ver una cosa.

Marcos: Vale.

No pregunta qué cosa. Va con ella.` : api.bandera("v_marcos_rechaza") ? `
Nora: Marcos. Ven conmigo arriba.

Marcos no deja la cerveza. No la mira.

Marcos: Sube tú. Yo me quedo con estos.

Lo dice sin maldad. Lo dice como se dice algo que no se quiere decir con maldad. Nora sube sola. El tercero. El séptimo.` : `
Nora se levanta con el cuaderno. Mira la escalera.

Nora: Voy a mirar una cosa arriba.

Nadie pregunta qué cosa. Sube. El tercero. El séptimo.`;
      const otros = q === "irene_alex" ? (api.bandera("v_irene_callada") ? `
Irene se levanta en cuanto Nora y Marcos desaparecen por el hueco. Sin decir nada. Álex apaga el mechero y la mira subir.

Álex: Te ayudo con la sudadera.

Irene no contesta. Álex va detrás, riéndose solo, con la mano donde la tiene siempre. Ella no se aparta y no se acerca. Sube.` : `
Álex mira la escalera vacía. Mira a Irene.

Álex: Nosotros también subimos.

Irene: ¿A qué?

Álex: A la sudadera.

Irene: Ya la llevo puesta.

Álex: Pues a quitártela.

Irene se ríe con la nariz, que es como se ríe cuando va a decir que sí. Suben. Ella delante, descalza; él detrás, con la mano donde la tiene siempre. La casa, con dos parejas arriba y nadie abajo.`) : q === "alex_marcos" ? (api.bandera("v_marcos_libre") ? `
Marcos mira a Álex. Mira el arco de la cocina.

Marcos: Ven. Te enseño una cosa.

Álex: ¿Ahora?

Marcos: Ahora que no está Nora.

Álex se guarda el mechero y va detrás. Se enciende la luz blanca. Se oye abrir la puerta del almacén. Y a Álex, dentro, decir «hostia» de una manera nueva.` : `
Marcos cruza el arco de la cocina. Álex se guarda el mechero y va detrás.

Álex: Voy contigo. Al sótano de los cadáveres.

Marcos: Es un cuadro de luces.

Álex: Todo es un cuadro de luces hasta que no lo es.

Se enciende la luz blanca. Se oye abrir una puerta que no es la de la nevera. Y a Álex, riéndose de algo, dentro.`) : `
Los tres se quedan. Álex con el mechero, dándole vueltas. Marcos con la cerveza. Irene con el vaso que no bebe. Levantan la cabeza los tres a la vez cuando Nora llega al séptimo escalón, y la bajan los tres a la vez cuando deja de crujir.`;
      const grupoNora = nc === "marcos" ? "La buhardilla, con Nora y Marcos." : nc === "irene" ? "La buhardilla, con Nora e Irene." : "La buhardilla, con Nora.";
      const c2 = carta2Tramo2(api);
      const grupoOtro = !c2 ? "Y la mesa, con los tres." : c2.ruta === "dormitorio" ? "El dormitorio del fondo, con Irene y Álex." : "El almacén, con Marcos y Álex.";
      return `${pregunto}${nora}
${otros}

${q ? "Y la casa se reparte otra vez. Cuatro personas en dos sitios, y ninguno ve a los otros dos." : "Y la casa se queda como estaba, menos una."}

${grupoNora} ${grupoOtro}

¿Qué quieres ver?`;
    },
    personajes: [
      { id: "nora",
        descripcion: (api) => noraCon(api) === "marcos" ? "La cuerda. La trampilla. Marcos detrás." : noraCon(api) === "irene" ? "La cuerda. La trampilla. Irene delante, descalza, y las dos solas por primera vez." : "La cuerda. La trampilla. Sola.",
        a: "vb1_trampilla",
        efecto: (api) => elegirRuta(api, "buhardilla") },
      { id: "marcos", si: (api) => (carta2Tramo2(api) || {}).id === "marcos", descripcion: (api) => carta2Tramo2(api).desc, a: (api) => carta2Tramo2(api).a, efecto: (api) => elegirRuta(api, carta2Tramo2(api).ruta) },
      { id: "irene", si: (api) => (carta2Tramo2(api) || {}).id === "irene", descripcion: (api) => carta2Tramo2(api).desc, a: (api) => carta2Tramo2(api).a, efecto: (api) => elegirRuta(api, carta2Tramo2(api).ruta) },
      { id: "alex", si: (api) => (carta2Tramo2(api) || {}).id === "alex", descripcion: (api) => carta2Tramo2(api).desc, a: (api) => carta2Tramo2(api).a, efecto: (api) => elegirRuta(api, carta2Tramo2(api).ruta) },
    ],
  },

  // =====================================================================

  vb1_trampilla: {
    pov: "nora",
    fondo: "assets/fondos/pasillo_oscuro.jpg",
    ambiente: "arriba",
    musica: "terror_suave",
    lugar: "pasillo de arriba", hora: "03:45",
    titulo: "La buhardilla · La cuerda",
    alEntrar: (api) => resolverRuta(api, "buhardilla", true),
    texto: (api) => {
      const pareja = noraCon(api) === "marcos";
      const conIrene = noraCon(api) === "irene";
      const h = H(api);
      const callada = api.bandera("v_irene_callada");
      const irene = conIrene ? "" : quedan(api) === "irene_alex" ? "La puerta del dormitorio del fondo, cerrada. Detrás, Irene y Álex. Se oye la cama. Se oye a Álex reírse bajo. Bajas la vista. No es asunto tuyo." : "La luz del baño, al fondo, encendida: la dejó Irene. La puerta del dormitorio del fondo, cerrada. En este piso, nadie. Abajo, los tres, y desde aquí no se les oye.";
      const marcos = pareja ? (h === "marcos" ? `
Marcos sube detrás de ti. Callado. Marcos no sube callado una escalera: dice que cruje, dice cuidado. Hoy nada. Solo sus pasos, en los mismos escalones que los tuyos, ni uno más.` : `
Marcos sube detrás de ti.

Marcos: Cruje. Cuidado con el séptimo.

Marcos: Esta casa de los cojones.

Le oyes y te calma. Es lo que hace Marcos en una escalera.`) : conIrene ? (callada ? `
Irene delante. Descalza. Sin girarse. Sube como quien sube a su casa, con la mano en el cuello, y no ha dicho una palabra desde la mesa. Tú detrás, a dos escalones, mirándole la nuca.` : `
Irene delante. Descalza. Se gira en el séptimo.

Irene: Cruje.

Nora: Ya.

Irene: Lo digo por si te caes. Que luego dicen que fui yo.

Es lo primero que te dice a solas en toda la noche. Es exactamente lo que esperabas y aun así te pilla.`) : "";
      return `
La escalera. El tercero. El séptimo.${marcos}

El pasillo. La lámpara de llama falsa haciendo su ciclo. La alfombra roja, larga, que se hunde. ${irene}

Y la cuerda.

${api.bandera("buhardilla_descubierta") === "irene" ? (conIrene ? "Irene tiró de ella esta noche. Se abrió sola una escalera y ella la volvió a subir con las dos manos. Pasa por debajo sin mirarla. La mira." : "Irene tiró de ella esta noche. Se abrió sola una escalera y ella la volvió a subir con las dos manos. Lo contó ella en la mesa, con la voz de quien cuenta un chiste que no lo es. La cuerda sigue ahí. Quieta.") : "Nadie la ha tocado esta noche. Que tú sepas. La has visto balancearse desde abajo hace cinco minutos. O has visto balancearse su sombra."} El nudo a la altura de tu cara. Gastado por un lado.

${pareja ? "Marcos la mira. Marcos mira la trampilla como se mira una cosa que va a tener que arreglar." : conIrene ? (callada ? "Irene se para debajo. Levanta la cara hacia la trampilla. Y se queda así, con la boca un poco abierta, como quien escucha una conversación al otro lado de una pared." : "Irene: Yo ahí no subo. Ni descalza ni con botas. Es tu cuerda.\n\nLo dice cruzándose de brazos bajo la sudadera. Pero no se va. Se queda. Irene, que nunca se queda donde no manda.") : "Estás sola con ella. Es lo que querías."}

Tiras.

[golpe]

CLACK.

La trampilla cede de golpe. Baja medio palmo. Y la escalera plegable se despliega sola, con un traqueteo de bisagras que retumba en todo el pasillo, hasta apoyarse en la alfombra a un paso de tus pies.

Arriba, un rectángulo negro.

Huele a polvo. A madera seca. Y a algo dulce, muy al fondo. Muy al fondo.

${pareja ? "Marcos: Subo yo primero.\n\nLo dice como se dice «yo conduzco»." : conIrene ? (callada ? "Irene pone el pie en el primer peldaño. Descalza. Sin linterna. Sin mirarte.\n\nNora: Irene.\n\nSube." : "Nadie te va a decir «subo yo primero». Menos Irene. Sacas el móvil. La linterna.") : "Nadie te va a decir «subo yo primero». Sacas el móvil. La linterna."}

${modo(api, "nora", {
  lucido: `~ Una buhardilla. Trastos, polvo, ratones. Y una cuerda que se balanceó cuando no había nadie arriba. Voy a subir con una linterna a mirar trastos, polvo y ratones. Y a mirar la otra cosa.${conIrene ? " Con Irene detrás. O delante. Con Irene, en cualquier caso." : ""}`,
  asustado: `~ Un rectángulo negro encima de mi cabeza. Y yo con un móvil. ${conIrene ? "Y a mi lado la única persona de esta casa a la que no le pediría ayuda." : "Y abajo, todos en sitios distintos, y ninguno me oiría."}`,
  tenso: "~ Ocho horas queriendo subir aquí. Ocho horas. Y ahora que estoy debajo, quiero bajar.",
  ido: "~ El olor dulce. Lo conozco. Es de algo que se ha quedado mucho tiempo en un sitio cerrado. Como un caramelo. Como una persona.",
  perdido: `~ Está arriba. Me está esperando arriba. Ha bajado la escalera para mí.${conIrene && callada ? " Y a Irene también la espera. A Irene la conoce." : ""}`,
  normal: "~ Venga. Diez escalones de madera. Sube, mira, baja. Y luego, el cuaderno.",
})}`;
    },
    opciones: [
      { texto: "Subir tú primero. Es tu cuerda.", a: "vb2_desvan", si: (api) => !(noraCon(api) === "irene" && api.bandera("v_irene_callada")),
        efecto: (api) => { api.marcar("nora_sube", "primera"); api.est("nora", "eje", 2); } },
      { texto: "Que suba Marcos primero. Y tú detrás.", a: "vb2_desvan", si: (api) => noraCon(api) === "marcos",
        efecto: (api) => { api.marcar("nora_sube", "marcos"); api.rel("nora", "marcos", "confianza", 2); } },
      { texto: "Grabar la trampilla abierta antes de subir. La escalera, el negro.", a: "vb2_desvan", lucida: true,
        efecto: (api) => { api.marcar("nora_sube", "graba"); api.evidencia("video_trampilla", "nora", "pasillo de arriba", "video"); api.est("nora", "lucidez", 1); } },
      { texto: "«¿Marcos?» Hacia el hueco de la escalera. Por oír una voz antes de subir.", a: "vb2_desvan", si: (api) => noraCon(api) !== "marcos" && noraCon(api) !== "irene",
        efecto: (api) => { api.marcar("nora_sube", "voz"); api.rel("nora", "marcos", "confianza", 1); api.est("nora", "estres", -1); } },
      { texto: "«¿Vienes o te quedas?» A Irene. Y esperar la respuesta con el pie en el peldaño.", a: "vb2_desvan", si: (api) => noraCon(api) === "irene" && !api.bandera("v_irene_callada"),
        efecto: (api) => { api.marcar("nora_sube", "reto"); api.rel("irene", "nora", "tension", 3); api.est("nora", "eje", 2); } },
      { texto: "Subir detrás de ella. Sin decir nada. Con la linterna en la mano.", a: "vb2_desvan", si: (api) => noraCon(api) === "irene" && api.bandera("v_irene_callada"),
        efecto: (api) => { api.marcar("nora_sube", "detras"); api.est("nora", "miedo", 3); api.est("nora", "eje", 2); } },
    ],
  },

  vb2_desvan: {
    pov: "nora",
    fondo: "assets/fondos/buhardilla.jpg",
    lugar: "buhardilla", hora: "03:48",
    titulo: "La buhardilla · Las huellas",
    texto: (api) => {
      const pareja = noraCon(api) === "marcos";
      const conIrene = noraCon(api) === "irene";
      const callada = api.bandera("v_irene_callada");
      const h = H(api);
      const ns = api.bandera("nora_sube");
      const inicio = ns === "marcos" ? `
Marcos sube. La escalera cruje con su peso. Le ves desaparecer por el rectángulo: los pies, y luego nada.

Marcos: Trastos.

Su voz, desde arriba, suena a otra habitación. A otra casa.

Subes.` : ns === "reto" ? `
Nora: ¿Vienes o te quedas?

Irene te mira. Mira el rectángulo negro. Te mira.

Irene: Joder. Vale. Voy. Pero subes tú.

Subes. La escalera cruje. Y detrás, los pies descalzos de Irene en la madera, más ligeros que los tuyos, y su mano en tu tobillo un segundo, para no caerse, o para que no te caigas tú.` : ns === "detras" ? `
Irene ya está arriba cuando asomas la cabeza. De pie. Sin linterna. Mirando la pared del fondo. No se ha movido de ahí: lo sabes porque el polvo, alrededor de sus pies, está intacto.

Subes del todo. Enciendes la linterna. Irene no parpadea con la luz.` : ns === "voz" ? `
Nora: ¿Marcos?

Desde abajo, tras un segundo:

Marcos: ¿Qué?

Nora: Nada.

Están ahí. Los tres. Bien. Subes.` : ns === "graba" ? `
Grabas. La escalera desplegada, el rectángulo negro, el pasillo. Diez segundos. En la pantalla el negro es más negro que a ojo. Siempre.

Guardas el móvil. Enciendes la linterna. Subes.${pareja ? " Marcos detrás." : conIrene ? " Y detrás, los pies descalzos de Irene en la madera. Ha dicho que no subía. Sube." : ""}` : `
Subes. La escalera cruje. El cuarto peldaño cede un poco. El quinto no.${pareja ? " Marcos detrás, con su peso, y el cuarto vuelve a ceder." : conIrene ? " Y detrás, los pies descalzos de Irene en la madera. Ha dicho que no subía. Sube." : ""}`;

      return `${inicio}

La cabeza por el hueco. La linterna.

Polvo. Una capa gris, gorda, sobre todo. Cajas de cartón hundidas. Una silla sin asiento. Una lámpara de pie sin pantalla. El techo a dos palmos de tu cabeza, con las vigas a la vista.

Y frío. Más que en el pasillo. Un frío quieto, de sitio cerrado, que se te pega a la cara.

Te subes del todo. ${pareja ? "Marcos, agachado, con la cabeza contra las vigas, mira alrededor con la cara de quien busca un enchufe." : conIrene ? (callada ? "Irene, de pie, quieta, con los pies descalzos en el polvo, mirando la pared del fondo. No mira las cajas. No mira nada de lo que hay." : "Irene, agachada bajo las vigas, con la sudadera y los pies descalzos en el polvo, mirando alrededor como quien busca un espejo. No lo hay. Se abraza los codos.") : "Sola. Con el rectángulo de luz del pasillo a tus pies como una ventana al revés."}

${quedan(api) === "alex_marcos" && !api.bandera("v_marcos_libre") ? "Y la luz del pasillo, abajo, por el hueco, sube de tono. Un poco. Como si alguien hubiera subido un mando. Marcos, en el cuadro de luces, con Álex. Sabes dónde están. Es lo último que vas a saber seguro en un rato.\n\n" : ""}

La viga grande. La del centro. Es más vieja que el resto: la madera es otra, más oscura, más gruesa. Y está quemada. Por un lado. Negra, con la superficie hecha escamas, como se queda la madera después de un fuego que no la terminó.

Y tiene marcas.

Rayas. Cortas. Hechas con algo afilado, hace mucho. Las cuentas con la linterna: seis iguales. Y una séptima, más honda. Más nueva. La madera dentro de la séptima no es negra: es clara.

${modo(api, "nora", {
  lucido: "~ Una viga de otra casa. De la casa de antes, la que ardió. La reutilizaron. Es lo que se hacía. Y las rayas las hizo alguien que contaba algo. Siete. Álex dijo siete. Álex no ha subido aquí.",
  asustado: "~ Siete. Carne, hueso, sangre, aliento, nombre, recuerdo, alma. La séptima es nueva.",
  tenso: "~ Una viga quemada y siete rayas. Es un cuento. Es el cuento de Álex con madera. Pues muy bien.",
  ido: "~ Las rayas se mueven cuando muevo la linterna. Como pestañas. Como si la viga parpadeara.",
  perdido: "~ Las hizo ella. Cuando estaba encerrada aquí. Contaba. Contaba a los que iban muriendo.",
  normal: "~ Siete. Lo apunto. Lo apunto y no le digo a Álex cuántas eran.",
})}

Bajas la linterna al suelo. Para ver dónde pisas.

Y hay huellas.

En el polvo. Desde la trampilla hacia la pared del fondo. Pies. Descalzos. Pequeños.

De niño.

Pones la mano al lado de una. Cabe dentro de tu palma. Con dedos. Con talón. Con el arco marcado, como los pies mojados en una piscina.

Van hacia la pared. Una detrás de otra. Doce, trece.

Y no vuelven.

${pareja ? "Marcos: Ratas.\n\nLo dice antes de mirar. Cuando mira, no dice nada más." : conIrene ? (callada ? "Irene las mira. Y sonríe. Un milímetro. Como se sonríe a alguien que conoces de antes." : "Irene no dice ratas. Irene, que tiene una palabra para todo, no dice nada. Se ha quedado mirando la más pequeña, con la mano en la boca.") : ""}

Las sigues con la linterna hasta la pared. Terminan ahí. Contra la madera. Donde no hay nada: ni puerta, ni hueco, ni ventana. Pones la mano en la pared donde terminan.

Está caliente.

~ La chimenea. La chimenea pasa por aquí. Claro.

Y a la izquierda, junto a la pared caliente, una caja. Pequeña. De madera, no de cartón. Sin polvo encima. O con menos.

La abres.

Una muñeca.

De trapo. Vieja, de las de antes, con la cara pintada y el pelo de lana. Y los ojos.

Le han cosido los ojos. Con hilo negro. Puntadas cortas, apretadas, de arriba abajo, sobre los párpados pintados.

La coges. Pesa más de lo que debería. Y dentro, en el pecho, algo duro. Pequeño. Que se mueve cuando la inclinas.

Y no suena.

${modo(api, "nora", {
  lucido: "~ Una muñeca antigua con los ojos cosidos. Es lo que hacían: coser los ojos de las muñecas de los niños muertos. Lo he leído. Y dentro tiene algo. Y no voy a abrirla aquí.",
  asustado: "~ Los párpados. Le cosieron los párpados. Como a la niña. Y dentro, en la boca... no. En el pecho. Es el pecho.",
  tenso: "~ Una muñeca. Una puta muñeca. Álex la ha subido. Álex ha subido aquí antes y ha dejado esto. Álex no sube a ningún sitio.",
  ido: "~ Pesa como un pájaro. Como un pájaro dormido. Y lo de dentro se mueve como un pájaro.",
  perdido: "~ Es ella. Es la niña. La construyeron así y la escondieron aquí y lleva esperando a que alguien la coja.",
  normal: "~ Cabe en la mochila. Cabe en la mochila y mañana la miro con luz.",
})}

${pareja ? "Marcos: Es una muñeca.\n\nLo dice como se dice «es una lámpara». Como si ponerle nombre bastara." : conIrene ? (callada ? "Irene: No la abras aquí.\n\nLo dice bajo. Sin mirarte. Como quien sabe lo que hay dentro." : "Irene: Es de niña muerta. Les cosían los ojos. Mi abuela tenía una en un armario y no nos dejaba abrirlo.\n\nLo dice sin mirar la muñeca. Mirándote a ti cogerla. Y por primera vez esta noche no hay nada en la voz de Irene que no sea Irene.") : ""}`;
    },
    opciones: [
      { texto: "Llevártela. En la mochila. Mañana, con luz.", a: (api) => noraCon(api) === "irene" ? "vb4_irene_nora" : "vb3_cierre",
        efecto: (api) => { api.marcar("nora_toma_muneca", true); api.evidencia("muneca_buhardilla", "nora", "buhardilla", "objeto"); api.est("nora", "eje", 4); api.est("nora", "miedo", 3); } },
      { texto: "Fotografiarla. Con la viga. Con las huellas. Y dejarla donde estaba.", a: (api) => noraCon(api) === "irene" ? "vb4_irene_nora" : "vb3_cierre", lucida: true,
        efecto: (api) => { api.marcar("nora_toma_muneca", false); api.evidencia("foto_buhardilla", "nora", "buhardilla", "foto"); api.est("nora", "lucidez", 1); } },
      { texto: "Dejarla. Cerrar la caja. No tocar nada más.", a: (api) => noraCon(api) === "irene" ? "vb4_irene_nora" : "vb3_cierre",
        efecto: (api) => { api.marcar("nora_toma_muneca", false); api.est("nora", "estres", 3); api.est("nora", "eje", -2); } },
      { texto: "Abrirle el pecho. Ahora. Con las uñas.", a: (api) => noraCon(api) === "irene" ? "vb4_irene_nora" : "vb3_cierre", impulsiva: true,
        efecto: (api) => { api.marcar("nora_toma_muneca", true); api.marcar("nora_abre_muneca", true); api.evidencia("muneca_buhardilla", "nora", "buhardilla", "objeto"); api.est("nora", "miedo", 6); api.est("nora", "estres", 6); api.presenciar("nora", 1.5); } },
    ],
  },

  // Irene y Nora, a solas por primera vez en toda la noche. Tres conversaciones posibles; una de ellas no es una conversación.
  vb4_irene_nora: {
    pov: "nora",
    titulo: "La buhardilla · Irene",
    hora: "03:52",
    alEntrar: (api) => {
      if (!api.bandera("irene_nora")) api.marcar("irene_nora", versionIreneNora(api));
      aplicarIreneNora(api, api.bandera("irene_nora"));
    },
    texto: (api) => {
      const v = api.bandera("irene_nora");
      const voz = api.bandera("irene_oyo_alex_puerta");
      const muneca = api.bandera("nora_abre_muneca") ? "Le has abierto el pecho con las uñas, delante de Irene. Dentro, en un trapo más viejo que la muñeca, una campanilla. Sin badajo. Por eso no sonaba. La has envuelto otra vez y la has metido en la mochila, con la muñeca, sin pensar. Irene te ha visto hacerlo. No ha dicho nada. Eso, en Irene, es decir mucho." : api.bandera("nora_toma_muneca") ? "La muñeca en la mochila. Notas lo de dentro contra la espalda cuando te mueves." : "La caja cerrada. La muñeca dentro. Las dos de espaldas a ella.";
      const alexVoz = voz ? `

Y debajo de la trampilla, en el pasillo, la voz de Álex.

Álex: Irene.

Irene se gira hacia el hueco. Rápido.

Irene: ¿Qué?

Nada.

Irene: ¿Qué quieres?

Nada. La luz del pasillo. La escalera. Nadie.

Nora: ¿Qué?

Irene: Álex. Me ha llamado.

Nora: Álex está en el almacén. Con Marcos.

Irene: Ya.

Y no se mueve. Y tú no has oído nada. Nada. Y la cara de Irene no es la de una broma.` : "";

      if (v === "peligro") return `${muneca}

Irene no se ha sentado. No ha mirado la muñeca. No ha mirado la viga. Está de pie, con la espalda contra la pared caliente, donde terminan las huellas, y te mira.

Irene: Ven.

Nora: ¿Qué?

Irene: Ven. Mira esto.

No hay nada que mirar donde señala. Madera. Vas igual. Vas porque es Irene y porque no ir sería tener miedo de Irene, y eso no.

Te coge la muñeca.

Con la mano fría. Con los dedos alrededor del hueso, apretando, como se sujeta algo que se puede escapar.

Irene: Todavía no.

Nora: ¿Qué?

Irene: Todavía no.

Y te sujeta. Un segundo. Dos. Con la cara tranquila y los ojos en otro sitio. En la pared. En lo que hay detrás de la pared.

~ Aliento.

No. Eso no lo has pensado tú. Eso ha venido de ella. De su mano. Ha subido por el brazo como sube el frío.

Y te suelta. Se mira la mano. Tarda en mirarla.

Irene: ¿Qué?

Nora: Me has cogido.

Irene: No.

Lo dice como se dice la verdad. Se mira la mano otra vez. Se la mete en la manga de la sudadera, hasta los nudillos.${alexVoz}

${modo(api, "nora", {
  lucido: "~ «Todavía no.» Con los dedos en mi muñeca. Y no se acuerda. No está mintiendo: Irene miente mejor que eso. No se acuerda.",
  asustado: "~ Fría. La mano estaba fría como el aire de la rendija. Y me ha sujetado como se sujeta a alguien que va a irse.",
  tenso: "~ Irene. Irene con las manos encima. Otra vez. Primero Marcos y ahora yo. Pues no.",
  ido: "~ Me ha dicho todavía no y he entendido «todavía no te vayas». Como si supiera que quiero irme. De aquí. De esta casa.",
  perdido: "~ No es Irene. Irene se fue en la mesa, cuando no respiraba. Esto ha subido conmigo con su cara.",
  normal: "~ Bajar. Ya. Con la muñeca roja y sin decir por qué.",
})}`;

      if (v === "alianza") return `${muneca}

Irene no se sienta. Se queda de pie al lado de la viga, con los brazos cruzados bajo la sudadera, mirando las siete rayas.

Irene: No fue teatro.

Lo dice a la viga. No a ti.

Irene: Lo de la mesa. Lo del aire. No fue teatro y tú lo sabes. ${api.bandera("nora_dijo_irene") ? "Dijiste mi nombre. Con los labios, sin voz. Antes que Marcos. Lo vi." : "Me miraste antes que nadie. Con la cara de saberlo."}

Nora: Lo sé.

Irene: ¿Y qué más sabes?

Y aquí está. A solas, en el sitio de las huellas que no vuelven, la persona que peor te cae de esta casa preguntándote lo único que no le has dicho a nadie.

~ Alda. La palabra que no está en ningún sitio. Se lo puedo decir a ella, que no me cree en nada, o guardármela para Marcos, que me cree en todo y no me sirve.

Irene: Nora. Aquí arriba no nos oye nadie. Abajo nos van a reír a las dos. A ti por la bruja y a mí por el numerito. Así que dilo aquí o no lo digas.${alexVoz}

${modo(api, "nora", {
  lucido: "~ Tiene razón. Es la única de la mesa que sabe que algo fue real, porque le pasó a ella. Y me lo está ofreciendo. Irene no ofrece nada gratis. Pero esto no es gratis: esto le cuesta.",
  asustado: "~ Las dos. Le ha pasado a ella y me ha pasado a mí, y las dos solas en el sitio de las huellas. Si se lo digo, es verdad. Si no, sigue siendo verdad.",
  tenso: "~ Ahora quiere hablar. Ahora que no hay nadie delante. Cómo no.",
  ido: "~ Su voz suena distinta aquí arriba. Más de cerca. Como si el polvo se comiera lo que le sobra.",
  perdido: "~ Nos ha traído a las dos aquí para que lo digamos. Está escuchando. Detrás de la pared caliente.",
  normal: "~ Alda. Decirlo en voz alta. A Irene. Ver qué pasa cuando se dice.",
})}`;

      return `${muneca}

Irene se sienta en la caja de cartón más entera. Con la sudadera hasta los nudillos. Con los pies descalzos en el polvo, cruzados, como si estuviera en una terraza.

Irene: Bueno.

Nora: Bueno.

Irene: Ya estamos a solas. Toda la noche mirándome y ahora que me tienes no sabes qué decir.

No es verdad. Es exactamente verdad.

Irene: La camisa.

Nora: ¿Qué camisa?

Irene: La que llevas. Se la regalé yo. Hace tres años. Él no se acuerda. Tú no lo sabías. Ahora lo sabes.

Lo dice sin maldad. Eso es lo peor: lo dice como se dice la hora. Como se le cuenta a la nueva cómo funciona la casa.

~ ${camisa(api).includes("cuadros") ? "La de cuadros no. La negra. La que cogí esta mañana de su armario sin preguntar." : "Esta camisa. La que cogí esta mañana de su armario sin preguntar. La que huele a él."}

Irene: No te la pido. Te lo digo.

Nora: ¿Para qué?

Irene: Para que sepas que hay cosas de antes. Que él no te cuenta. Y que yo sí.${alexVoz}

${modo(api, "nora", {
  lucido: "~ Está marcando el sitio. Como se marca. Con la camisa, con «los de antes», con la mesa. Y lo hace aquí, a solas, porque delante de Marcos no le sale tan bien.",
  asustado: "~ Habla de camisas. En el sitio de las huellas que no vuelven, con una muñeca con los ojos cosidos a un metro, Irene habla de camisas. Y yo se lo agradezco.",
  tenso: "~ La camisa. Tres años. Pues te la devuelvo lavada. O no te la devuelvo. O me la quito aquí y se la doy a él.",
  ido: "~ Irene sentada en una caja como en una terraza. Con los pies en el polvo. Con las huellas al lado de sus pies, y las suyas son más grandes, y no lo ha mirado.",
  perdido: "~ Me está distrayendo. Habla de la camisa para que no mire la pared. Alguien le ha dicho que hable.",
  normal: "~ Vale. Vale. La conversación pendiente. Aquí arriba, con esto. Pues sea.",
})}`;
    },
    opciones: [
      // Conversación pendiente
      { texto: "«No sabía que era tuya. Me la puso él.»", a: "vb3_cierre", si: (api) => api.bandera("irene_nora") === "conversacion",
        efecto: (api) => { api.marcar("nora_irene_dijo", "camisa"); api.rel("irene", "nora", "resentimiento", -6); api.rel("irene", "nora", "tension", 3); api.est("nora", "estres", -2); } },
      { texto: "«¿Qué te pasa conmigo, Irene? Dilo aquí, que no nos oye nadie.»", a: "vb3_cierre", si: (api) => api.bandera("irene_nora") === "conversacion",
        efecto: (api) => { api.marcar("nora_irene_dijo", "directa"); api.rel("nora", "irene", "confianza", 3); api.rel("irene", "nora", "resentimiento", -3); api.saber("nora", "irene_quiere_a_marcos"); api.est("nora", "eje", 1); } },
      { texto: "No contestar. Mirar las huellas. Que hable ella, que le gusta.", a: "vb3_cierre", lucida: true, si: (api) => api.bandera("irene_nora") === "conversacion",
        efecto: (api) => { api.marcar("nora_irene_dijo", "calla"); api.saber("nora", "irene_quiere_a_marcos"); api.est("nora", "lucidez", 1); api.rel("irene", "nora", "resentimiento", 2); } },
      // Alianza
      { texto: "«Alda. Es un nombre que no puede saber nadie. Y el vaso lo escribió.»", a: "vb3_cierre", si: (api) => api.bandera("irene_nora") === "alianza",
        efecto: (api) => { api.marcar("nora_irene_dijo", "alda"); api.saber("irene", "nora_alda"); api.rel("nora", "irene", "confianza", 8); api.rel("irene", "nora", "confianza", 8); api.est("irene", "miedo", 4); api.est("nora", "estres", -3); } },
      { texto: "Escucharla. Todo. Y no decirle lo tuyo.", a: "vb3_cierre", si: (api) => api.bandera("irene_nora") === "alianza",
        efecto: (api) => { api.marcar("nora_irene_dijo", "escucha"); api.rel("nora", "irene", "confianza", 4); api.saber("nora", "irene_ahogo_verdad"); api.est("nora", "lucidez", 1); } },
      { texto: "«Nos creen a las dos o no nos creen a ninguna. Abajo lo contamos juntas.»", a: "vb3_cierre", si: (api) => api.bandera("irene_nora") === "alianza",
        efecto: (api) => { api.marcar("nora_irene_dijo", "juntas"); api.rel("nora", "irene", "confianza", 10); api.rel("irene", "nora", "confianza", 10); api.marcar("irene_cuenta", true); api.marcar("nora_cuenta_huellas", true); api.saber("irene", "nora_alda"); } },
      // Peligro
      { texto: "Soltarte. Bajar la primera. Sin correr.", a: "vb3_cierre", si: (api) => api.bandera("irene_nora") === "peligro",
        efecto: (api) => { api.marcar("nora_irene_dijo", "suelta"); api.est("nora", "miedo", 4); api.est("nora", "eje", -2); } },
      { texto: "«Irene. La mano.» Sin moverte. Mirándola.", a: "vb3_cierre", lucida: true, si: (api) => api.bandera("irene_nora") === "peligro",
        efecto: (api) => { api.marcar("nora_irene_dijo", "mano"); api.saber("nora", "irene_raro"); api.est("nora", "lucidez", 1); api.est("irene", "estres", 4); } },
      { texto: "Quedarte quieta hasta que te suelte. No respirar.", a: "vb3_cierre", impulsiva: true, si: (api) => api.bandera("irene_nora") === "peligro",
        efecto: (api) => { api.marcar("nora_irene_dijo", "quieta"); api.est("nora", "estres", 6); api.est("nora", "miedo", 2); } },
    ],
  },

  vb3_cierre: {
    pov: "nora",
    fondo: "assets/fondos/buhardilla_oscura.jpg",
    titulo: "La buhardilla · La trampilla",
    texto: (api) => {
      const pareja = noraCon(api) === "marcos";
      const conIrene = noraCon(api) === "irene";
      const h = H(api);
      const cerro = api.bandera("trampilla_cerro");
      const sujeto = api.bandera("huesped_sujeto") === "nora" && h === "marcos";
      const abre = conIrene ? (api.bandera("irene_nora") === "peligro" ? `
Irene baja la mano. La tuya te quema donde tenía los dedos. Ninguna de las dos dice nada más. No hay nada que decir que no suene a lo que sonaría.` : api.bandera("nora_irene_dijo") === "alda" || api.bandera("nora_irene_dijo") === "juntas" ? `
Irene se ha quedado con la palabra. Alda. La ha repetido una vez, bajo, como se prueba una llave. No ha dicho «no me lo creo». No ha dicho nada. Se ha abrazado los codos.` : api.bandera("nora_irene_dijo") === "directa" ? `
Irene: ¿Que qué me pasa contigo? Que llegaste tarde. Y que él no se ha dado cuenta.

Lo ha dicho sin subir la voz. Y luego ha mirado las huellas, por fin, y se ha callado.` : api.bandera("nora_irene_dijo") === "camisa" ? `
Irene: Ya lo sé que te la puso él. Por eso te lo digo a ti y no a él.

Y se ha reído. Corto. De verdad. Puede que la primera de verdad hacia ti en toda la noche.` : api.bandera("nora_irene_dijo") === "escucha" ? `
Irene ha hablado. Del aire que no entraba. De la mano de Marcos en la boca. De lo que se ve desde dentro cuando no se respira. Tú has escuchado. Y no has dicho Alda. Te la has guardado, y ella ha notado que te guardabas algo, y no ha preguntado qué.` : `
Irene ha hablado un rato. De la camisa, de los de antes, de una noche en un sofá. Tú has mirado las huellas. Ella ha acabado mirándolas también. Y se ha callado.`) : api.bandera("nora_abre_muneca") ? `
Le abres el pecho. Con las uñas. La tela cede como cede la tela vieja: sin resistirse, con un ruido de polvo.

Dentro, envuelto en un trapo más viejo que la muñeca, algo de metal. Pequeño. Redondo. Con una ranura.

Una campanilla.

Sin badajo. Por eso no sonaba. Alguien se lo quitó.

La envuelves otra vez. La metes en la muñeca. La muñeca en la mochila. No piensas. No piensas.` : api.bandera("nora_toma_muneca") ? `
La muñeca en la mochila. Entre el cuaderno y el péndulo. Pesa. Notas lo de dentro moverse contra tu espalda cuando te mueves.` : `
La caja cerrada. La muñeca dentro. Te alejas de ella de espaldas, sin saber por qué de espaldas.`;

      if (!cerro) return `${abre}

Bajas. ${pareja ? "Marcos primero. Tú detrás, con la linterna en la boca." : conIrene ? "Irene primero, deprisa, descalza. Tú detrás, con la linterna en la boca." : "La escalera cruje. El cuarto peldaño cede un poco."}
${sujeto ? `
Y en el tercer peldaño desde abajo, su mano te coge el tobillo.

Fuerte. Los dedos alrededor del hueso, apretando, sujetándote a la madera.

Marcos: Todavía no.

Nora: ¿Qué?

Marcos: Todavía no.

Un segundo. Dos. Con la cara levantada hacia ti, tranquila, y los ojos en otro sitio.

Y te suelta. Se mira la mano. Tarda en mirarla.

Marcos: Perdona. No sé... perdona.

Bajas los dos peldaños que quedan sin que te toque. El tobillo te quema donde tenía los dedos.
` : ""}
El pasillo. La alfombra. La lámpara de llama falsa. Todo donde estaba.

${pareja || conIrene ? "Empujáis la escalera entre los dos. La trampilla encaja con un golpe sordo." : "Empujas la escalera con las dos manos. Pesa más de lo que parece. La trampilla encaja con un golpe sordo."} La cuerda queda colgando. Quieta.

${modo(api, "nora", {
  lucido: `~ ${sujeto ? "«Todavía no.» Con los dedos en mi tobillo. Marcos dice «espera» o «cuidado». Nunca «todavía no». Y no se acuerda. No miente: no se acuerda." : "Huellas, siete marcas, una muñeca. Tres cosas que se pueden fotografiar. Por primera vez esta noche tengo algo que se puede fotografiar."}`,
  asustado: `~ ${sujeto ? "Me ha sujetado como se sujeta a alguien que va a irse. Marcos. Con esa cara tranquila. Con los ojos en otro sitio." : "No volvían. Las huellas. Iban y no volvían. Y yo he vuelto. Por ahora."}`,
  tenso: "~ Abajo. Al cuaderno. Y que nadie me pregunte nada hasta que lo haya escrito.",
  ido: "~ Las huellas eran de ir. Nunca hay huellas de volver en ningún sitio. Nadie las mira.",
  perdido: "~ Me ha dejado bajar. Me ha dejado bajar porque me llevo lo que quería que me llevara.",
  normal: "~ Bien. Ya está. Ya lo he visto. Ahora, a ver qué hago con ello.",
})}`;

      const solo = `
[golpe]

CLACK.

La trampilla. Debajo de ti. Se ha cerrado.

No la has tocado. Estabas a dos metros, con la linterna en la caja. Se ha cerrado sola, con la escalera plegándose dentro, con el mismo traqueteo de bisagras pero al revés.

[negro]

Oscuro. Solo la linterna del móvil. Un círculo blanco en el polvo, y fuera del círculo, nada.

Y la linterna parpadea.

Una vez.

Te arrodillas encima de la trampilla. Empujas. No cede. Empujas con las dos manos, con el peso. No cede. Como si alguien estuviera encima. Debajo. Como si alguien estuviera debajo, sujetándola.

Nora: ¡Marcos!

Nada. La casa entera debajo de ti y nadie.

Nora: ¡Irene!

Nada. Tres personas en una mesa, debajo de ti, a un techo de distancia. Y nadie.

Empujas otra vez.

[luz]

Y cede. Sin más. Como si nadie hubiera estado nunca sujetándola. La escalera se despliega con su traqueteo, la luz del pasillo sube por el hueco, y bajas, y el cuarto peldaño cede, y estás en la alfombra.

Y miras arriba.

La cuerda no está.

El nudo a la altura de la cara. Gastado por un lado. No está. La trampilla, abierta; la escalera, desplegada; y la cuerda que las abre, que ha estado ahí toda la noche, que Irene tiró y que tú has tirado, no está.

Empujas la escalera hacia arriba. La trampilla encaja. Y se queda ahí, cerrada, sin nada de lo que tirar.`;

      const conMarcosNormal = `
[golpe]

CLACK.

La trampilla. Debajo de ti. Se ha cerrado.

[negro]

Oscuro. La linterna. El polvo.

Marcos: ¡Nora!

[luz]

Desde abajo. Al instante. Y la trampilla se abre antes de que te dé tiempo a arrodillarte: Marcos, con la cabeza por el hueco, con la cara que no le has visto nunca.

Marcos: ¿Estás bien? ¿Estás bien?

Nora: Se ha cerrado sola.

Marcos: La he visto. No la he tocado. Estaba ahí y se ha cerrado.

Bajas. Te coge por la cintura en los dos últimos peldaños, como si fueras a caerte, y no ibas a caerte, y dejas que lo haga.`;

      const conMarcosHuesped = `
[golpe]

CLACK.

La trampilla. Debajo de ti. Se ha cerrado.

[negro]

Oscuro. La linterna. El polvo.

Nora: ¿Marcos?

Nada.

Nora: Marcos.

Nada. Está ahí abajo. Estaba ahí abajo hace tres segundos, con la mano en la escalera.

Nora: ¡Marcos!

La linterna parpadea. Una vez. Dos.

Nora: Marcos. Marcos. Marcos.

Seis veces. Las cuentas después. En el momento no cuentas nada.

[luz]

Y la trampilla se abre. Despacio. La escalera baja con su traqueteo. Marcos, abajo, con la mano en el último peldaño, mirando hacia arriba.

Marcos: ¿Qué?

Nora: ¿Que qué?

Marcos: ¿Qué pasa?

Nora: ¿No me oías?

Marcos: No has dicho nada.

Lo dice tranquilo. Como se dice una cosa que es verdad.

Bajas. Un peldaño. Otro.

${sujeto ? `Y su mano te coge el tobillo.

Fuerte. Los dedos alrededor del hueso, apretando, sujetándote al peldaño.

Marcos: Todavía no.

Nora: ¿Qué?

Marcos: Todavía no.

Y te sujeta. Un segundo. Dos. Con la cara levantada hacia ti, tranquila, y los ojos en otro sitio.

Y te suelta. Se mira la mano. Tarda en mirarla.

Marcos: Perdona. No sé... perdona.

Bajas los peldaños que quedan sin que te toque. El tobillo te quema donde tenía los dedos.` : `Y llegas abajo. Y Marcos te mira como si acabaras de aparecer. Como si hubiera estado esperando a otra persona.

Marcos: ¿Ya?

Nora: ¿Ya qué?

Marcos: Nada. ¿Ya has visto lo que querías?

No te acuerdas de haberle dicho que quería ver algo. Se lo dijiste. Se lo dijiste abajo.`}`;

      const conIreneCierre = `
[golpe]

CLACK.

La trampilla. Debajo de vosotras. Se ha cerrado.

[negro]

Oscuro. La linterna. El polvo. Y la respiración de Irene, rápida, a un metro.

${h === "irene" ? `Irene no grita. No empuja. La oyes moverse en la oscuridad, despacio, hacia la trampilla, y arrodillarse encima.

Irene: Ya.

Lo dice a la madera. Bajo. Como se contesta a alguien.

[luz]

Y la trampilla se abre. Sola. Con su traqueteo, al revés. La luz del pasillo sube por el hueco y le da a Irene en la cara, y la cara es la suya, y no lo es.` : `Irene: ¡Álex!

Nada.

Irene: ¡ÁLEX! ¡MARCOS!

Nada. La casa entera debajo y nadie. Álex y Marcos en el almacén, a dos paredes y un suelo.

Te arrodillas encima de la trampilla. Irene a tu lado. Empujáis. No cede. Empujáis las dos, con el peso, con las palmas. No cede. Como si alguien estuviera debajo, sujetándola.

Irene: Nora.

Nora: Empuja.

Irene: Nora, hay alguien debajo.

Empujáis otra vez.

[luz]

Y cede. Sin más. Como si nadie hubiera estado nunca sujetándola.`}

Bajáis. Irene primero, deprisa, descalza, y el cuarto peldaño cede y no le importa. Tú detrás.

Y miráis arriba.

La cuerda no está.

El nudo a la altura de la cara. Gastado por un lado. No está. ${api.bandera("buhardilla_descubierta") === "irene" ? "Irene tiró de esa cuerda esta noche. Tú has tirado de ella." : "Tú has tirado de esa cuerda hace diez minutos."} Y no está.

Irene: Estaba ahí.

Nora: Sí.

Irene: Estaba ahí, Nora.

Es la primera cosa que veis las dos. La primera que no puede explicar ninguna. ${h === "irene" ? "Y lo dice con la voz de siempre. Como si hace un minuto no hubiera hablado con una trampilla." : "Y os miráis, y en esa mirada, por primera vez esta noche, no hay nada de lo de antes."}

Empujáis la escalera hacia arriba. La trampilla encaja. Y se queda ahí, cerrada, sin nada de lo que tirar.`;

      const escena = conIrene ? conIreneCierre : !pareja ? solo : h === "marcos" ? conMarcosHuesped : conMarcosNormal;

      return `${abre}
${escena}

${modo(api, "nora", {
  lucido: `~ ${conIrene ? "La cuerda. Las dos la hemos visto no estar. Por primera vez esta noche hay algo que no es solo mío. Y me ha tocado compartirlo con Irene." : !pareja ? "La cuerda. Una trampilla se cierra por una corriente. Una cuerda no desaparece por una corriente. Una cuerda la quita alguien." : h === "marcos" ? (sujeto ? "«Todavía no.» Dos palabras que Marcos no dice nunca. Marcos dice «espera» o «cuidado». Nunca «todavía no». Y me ha sujetado como no me ha sujetado nunca." : "Seis veces. He dicho su nombre seis veces y él estaba a dos metros con la mano en la escalera. Y dice que no he dicho nada. Y lo dice como se dice la verdad.") : "Una corriente. Las trampillas se cierran con corrientes. Marcos lo ha visto y no lo ha tocado. Eso es todo. Eso es todo y tengo el corazón en la boca."}`,
  asustado: `~ ${conIrene ? (h === "irene" ? "Ha dicho «ya» a la trampilla. Y la trampilla ha obedecido. Y luego ha dicho «estaba ahí» con la voz de Irene." : "Alguien la sujetaba. Desde abajo. Irene lo ha notado. Yo lo he notado. Y se ha llevado la cuerda.") : !pareja ? "Alguien la sujetaba. Desde abajo. Y luego la soltó. Y se llevó la cuerda." : h === "marcos" ? "No es él. Lleva sin ser él desde la mesa. Desde que le sopló a Irene." : "Se ha cerrado sola. Conmigo dentro. En el sitio de las huellas que no vuelven."}`,
  tenso: "~ Abajo. Al cuaderno. Y no hablar con nadie hasta que lo haya escrito todo.",
  ido: `~ ${!pareja ? "La cuerda se ha ido con las huellas. Iban al mismo sitio. Al sitio donde termina todo lo que no vuelve." : "La linterna parpadeaba al ritmo de mi nombre. Mar-cos. Mar-cos. Como el vaso."}`,
  perdido: `~ ${conIrene ? "Nos ha encerrado a las dos y nos ha soltado. Para que sepamos que puede. Para que lo sepamos las dos." : !pareja ? "Me ha encerrado y me ha soltado. Para que sepa que puede." : h === "marcos" ? "Le tiene. Le tiene y ha hablado por su boca. «Todavía no.» Todavía no qué." : "Nos ha dejado bajar a los dos. A él porque le da igual. A mí porque llevo lo que quería."}`,
  normal: `~ ${conIrene ? "Una trampilla. Una cuerda. E Irene, que por una vez no tiene una frase." : !pareja ? "Una trampilla. Una cuerda. Un cuaderno que va a tener dos páginas más." : "Marcos. Marcos, joder. Qué ha sido eso."}`,
})}`;
    },
    opciones: [
      { texto: "Bajar. Contarlo todo en la mesa: las huellas, la viga, la muñeca.", a: "v9_regreso",
        efecto: (api) => { api.marcar("nora_cuenta_huellas", true); api.est("nora", "eje", 2); } },
      { texto: "Bajar. Apuntarlo. Contar solo lo de la trampilla.", a: "v9_regreso",
        efecto: (api) => { api.marcar("nora_cuenta_huellas", false); api.evidencia("cuaderno_buhardilla", "nora", "cuaderno de Nora", "nota"); api.est("nora", "lucidez", 1); } },
      { texto: "«¿Qué me has dicho?» A Marcos. Ahí, en la escalera.", a: "v9_regreso", si: (api) => noraCon(api) === "marcos" && api.bandera("huesped_sujeto") === "nora",
        efecto: (api) => { api.marcar("nora_confronta_marcos", true); api.marcar("nora_cuenta_huellas", false); api.rel("nora", "marcos", "confianza", -4); api.est("marcos", "estres", 6); } },
      { texto: "«¿No me oías?» Y mirarle hasta que conteste de verdad.", a: "v9_regreso", si: (api) => noraCon(api) === "marcos" && H(api) === "marcos" && api.bandera("huesped_sujeto") !== "nora" && api.bandera("trampilla_cerro"),
        efecto: (api) => { api.marcar("nora_confronta_marcos", true); api.marcar("nora_cuenta_huellas", false); api.saber("nora", "marcos_raro"); api.est("nora", "lucidez", 1); } },
      { texto: "Buscar la cuerda. Por la alfombra. Por el suelo. Debajo de la mesita.", a: "v9_regreso", lucida: true, si: (api) => api.bandera("cuerda_desaparece"),
        efecto: (api) => { api.marcar("nora_cuenta_huellas", false); api.marcar("nora_busco_cuerda", true); api.est("nora", "estres", 4); } },
      { texto: "«Tú la has visto. Dímelo.» A Irene. Sobre la cuerda. Antes de bajar.", a: "v9_regreso", si: (api) => noraCon(api) === "irene" && api.bandera("cuerda_desaparece"),
        efecto: (api) => { api.marcar("nora_cuenta_huellas", true); api.marcar("nora_pregunta_cuerda", true); api.rel("nora", "irene", "confianza", 4); api.rel("irene", "nora", "confianza", 4); api.marcar("irene_cuenta", true); } },
    ],
  },

  // =====================================================================
  // LOS QUE SE QUEDAN — Irene y Álex en el dormitorio (si Nora sube con Marcos)
  // =====================================================================

  vq1_dormitorio: {
    pov: (api) => H(api) === "irene" ? "alex" : "irene",
    fondo: "assets/fondos/dormitorio_alex.jpg",
    ambiente: "arriba",
    musica: "terror_suave",
    lugar: "dormitorio del fondo", hora: "03:46",
    titulo: "El dormitorio · La cama",
    alEntrar: (api) => resolverRuta(api, "dormitorio", true),
    texto: (api) => {
      const h = H(api);
      const sombra = api.bandera("irene_vio_sombra");
      const clack = "Y desde el pasillo, un CLACK. Madera. La escalera plegable desplegándose con su traqueteo, el mismo de esta noche. La trampilla. Nora y Marcos, que han subido a mirar lo que Nora quería mirar.";

      // Irene, sin el huésped: lo que ve por encima del hombro de Álex
      if (h !== "irene") return `
El dormitorio del fondo. La cama grande, deshecha desde la siesta. La bombilla desnuda, amarilla, poca. Álex cierra la puerta con el pie y se apoya en ella a mirarte, con esa cara: la de quien ya ha ganado y viene a cobrar.

Álex: ¿Otra vez la sudadera?

Irene: Quítamela.

Y viene. Te la saca por la cabeza y la tira donde caiga, y el top detrás, y te pone las manos donde las pone siempre, sobre las costillas, calientes, y te lleva a la cama con el peso, sin prisa, como se empuja una puerta que ya está abierta.

El short. El suyo. Su boca en el cuello, en el pecho, bajando. Y abres las piernas porque es lo que hay que hacer, porque es Álex, porque durante un minuto entero no va a haber tabla ni vaso ni nombre.

Y entra.

Despacio, la primera vez, mirándote, como entra Álex siempre: mirándote para vértelo en la cara. Y luego no despacio. El peso de él encima. Sus manos en el colchón, a los lados de tu cabeza. El somier que suena. Tus talones en su espalda, tus uñas donde caben, tu boca abierta contra su hombro para no hacer el ruido que haces y hacerlo igual.

Está bien. Está muy bien. Está...

${clack}

Álex se ríe contra tu cuello. Sin parar.

Álex: Van a por los cadáveres.

Irene: Calla.

Y sigue. Más. Con la bombilla encima, con el techo bajo, con el sudor de él cayéndote en la boca. Cierras los ojos. Los abres.

Y por encima de su hombro, el armario.

Estaba cerrado. Lo has visto cerrado al entrar, con la llave puesta, porque siempre miras el armario de una habitación que no es tuya. Ahora está abierto. Un palmo. Lo justo para el negro de dentro.

${sombra ? `Y dentro, en el negro, entre los abrigos de otra gente, a la altura de una niña, algo blanco.

Una cara. O una camisa doblada. O una cara.

No se mueve. Y luego se mueve un poco, como se mueve alguien que lleva mucho rato quieto y ya no aguanta más.

[toc]

Toc.

Desde dentro. A un metro de la cama. Una vez.

Y te paras. Entera. Con Álex dentro y las piernas donde estaban y las manos en su espalda, como se para un animal que ha visto al otro animal.

Álex: ¿Qué?

No lo dice parando. Álex no se para por un armario.` : `[toc]

Toc.

Desde dentro. A un metro de la cama. Una vez. Y la puerta del armario, que se abre otro dedo, sola, con el ruido de una bisagra que nadie ha engrasado en cien años.

Y te paras. Entera. Con Álex dentro y las piernas donde estaban.

Álex: ¿Qué?

No lo dice parando. Álex no se para por un armario.`}

Álex: Aplausos.

Se ríe. Sigue. Y tú tienes los ojos en el palmo negro y la respiración de él en la oreja y el cuerpo en dos sitios a la vez.

${modo(api, "irene", {
  lucido: `~ Cerrado al entrar. Abierto ahora. Nadie se ha levantado de esta cama. ${sombra ? "Y lo de dentro es blanco y pequeño y no es una camisa, porque las camisas no esperan." : "Una bisagra vieja y una casa que se mueve con el frío. Y yo con el corazón en la garganta por una puerta."}`,
  asustado: `~ ${sombra ? "Hay alguien dentro. Pequeño. Mirándonos. Mirándome a mí, porque él está de espaldas." : "Toc. Como los de la mesa. Como los que hacía yo con el talón. Y yo tengo los pies en su espalda."}`,
  tenso: "~ Que se calle. Que se calle con lo de los aplausos. Que pare. Que no pare. Que se calle.",
  ido: "~ El armario respira con nosotros. Con el ritmo de él. No. Con el mío.",
  perdido: `~ ${sombra ? "Ha venido a ver. Se ha metido en el armario para vernos. Como se meten los niños para ver lo que no deben." : "Ha llamado. Desde dentro. Para que abra. Como se llama a una puerta cuando eres educado."}`,
  normal: "~ Un armario. Un golpe. Una puerta que se abre sola. Y Álex, que sigue, que no ha visto nada, que no ve nunca nada.",
})}`;

      // Álex, con Irene huésped: las uñas, la sangre, el mordisco. Y él decide si le gusta.
      return `
El dormitorio del fondo. La cama grande, deshecha desde la siesta. La bombilla desnuda. Cierras la puerta con el pie y te apoyas en ella a mirarla.

Irene no busca nada. La sudadera la lleva puesta y se la quita ella, por la cabeza, de un tirón, y el top detrás, y se queda de pie en mitad del cuarto mirándote con una cara que le has visto pocas veces y que te gusta mucho.

Álex: ¿Frío?

Irene: Ven.

Y vas. Te coge de la camisa y te lleva a la cama, y se tumba debajo, y te trae encima con las piernas. Su boca sabe a cerveza y a ese licor de mierda y a otra cosa, fría, como si hubiera bebido agua de un grifo. El short. El tuyo. Su mano, que sabe el camino, y lo toma.

Y entras.

Despacio la primera vez, mirándola, para vérselo en la cara. Y se lo ves: los ojos se le van hacia arriba, hacia el techo, hacia más arriba del techo. Y luego no despacio. Sus talones en tu espalda. Sus uñas en tus hombros. El somier. Su boca abierta contra tu cuello para no hacer el ruido que hace y hacerlo igual.

Está bien. Está muy bien. Está...

${clack}

Te ríes contra su cuello.

Álex: Van a por los cadáveres.

Irene no dice «calla». Irene no dice nada. Y las uñas bajan.

De los hombros a la espalda. Despacio. Y aprietan. Primero es lo de siempre, lo que te gusta, lo que le has pedido otras veces. Y luego no: entran. Las diez. Y tiran hacia abajo, como se rastrilla, y notas la piel abrirse y el calor bajar por los costados, y hueles tu propia sangre antes de entender que es tuya.

Álex: Irene.

Y las caderas no paran. Ella no para. Va más fuerte. Con los ojos abiertos, fijos en el techo, sin verte, y la boca cerrada, y las uñas dentro. Y entonces la boca se abre y te muerde.

En el cuello. Donde la tenía apoyada. Cierra y no suelta. Como muerde un animal que no va a soltar. Notas los dientes juntarse a través de ti y el ruido que hace eso dentro de tu cabeza, y su cuerpo debajo, que se mueve como si esto fuera lo que había venido a hacer.

[toc]

Toc.

El armario. Desde dentro. A un metro de la cama. Una vez.

Irene suelta. Con la boca roja. Te mira. No a ti: al armario, por encima de tu hombro. Y dice, bajo, con su voz, a nadie:

Irene: Todavía no.

Y las caderas siguen. Y las uñas siguen dentro. Y tú tienes la sangre bajando por la espalda hasta las sábanas y a Irene debajo con la cara de otra y el cuerpo de siempre, y llevas cinco años con ella y no la conoces.

~ Cinco años. Nunca. Ni borracha, ni cabreada, ni la noche de Rubén. Nunca ha mordido.

${modo(api, "alex", {
  lucido: "~ No es un juego. Los juegos se miran a la cara. Ella mira el armario. Me está haciendo esto mirando un armario, y lo de «todavía no» no iba conmigo.",
  asustado: "~ Me ha mordido de verdad. Hasta el hueso. Y sigue. Y yo también sigo, y no sé por qué sigo.",
  tenso: "~ Suéltame. Suéltame o te suelto yo. Y no lo digo. Y no lo hago.",
  ido: "~ Su cuerpo va a un ritmo y el armario a otro y el mío al de ella. Toc. Toc. Como el talón en la mesa. Como el vaso.",
  perdido: "~ No es Irene. Es lo que subió por la escalera esta noche y se metió en ella cuando dejó de respirar, y ahora quiere sangre y se la estoy dando.",
  normal: "~ Vale. Vale. Irene se ha vuelto loca y me está gustando y me está dando miedo, y las dos cosas a la vez, y no sé cuál gana.",
})}`;
    },
    opciones: [
      // Irene, sin el huésped: lo que hace con lo que ha visto
      { texto: "«Álex. Para.» Sin quitar los ojos del armario.", a: "v9_regreso", si: (api) => H(api) !== "irene",
        efecto: (api) => { api.marcar("irene_tras_sombra", "para"); api.marcar("irene_cuenta", false); api.saber("alex", "irene_asustada"); api.rel("alex", "irene", "tension", 3); api.est("irene", "lucidez", 1); } },
      { texto: "Cerrar los ojos. Seguir. Que acabe. Que acabe ya.", a: "v9_regreso", si: (api) => H(api) !== "irene",
        efecto: (api) => { api.marcar("irene_tras_sombra", "sigue"); api.marcar("irene_cuenta", false); api.rel("alex", "irene", "afecto", 4); api.est("irene", "estres", 5); api.est("irene", "eje", -2); } },
      { texto: "Empujarle. Encender la luz grande. Abrir el armario tú misma.", a: "v9_regreso", lucida: true, si: (api) => H(api) !== "irene",
        efecto: (api) => { api.marcar("irene_tras_sombra", "abre"); api.marcar("irene_abre_armario", true); api.marcar("irene_cuenta", false); api.saber("irene", "marca_armario"); api.presenciar("irene", 1); api.rel("alex", "irene", "tension", 3); api.est("irene", "lucidez", 1); } },
      { texto: "«Mira.» Girarle la cara hacia el armario. Que lo vea él.", a: "v9_regreso", si: (api) => H(api) !== "irene" && api.bandera("irene_vio_sombra"),
        efecto: (api) => { api.marcar("irene_tras_sombra", "mira"); api.marcar("irene_cuenta", true); api.saber("alex", "irene_vio_algo"); api.rel("alex", "irene", "confianza", -3); api.est("irene", "miedo", 4); } },
      // Álex, con Irene huésped: si le gusta o no
      { texto: "Te gusta. Reírte contra su boca roja y seguir. Más fuerte.", a: "v9_regreso", si: (api) => H(api) === "irene",
        efecto: (api) => { api.marcar("alex_gusto", true); R().alimentar(api, 1); R().ofrenda(api, "sangre"); api.rel("alex", "irene", "afecto", 4); api.est("alex", "eje", 2); api.est("alex", "estres", 4); } },
      { texto: "«Para. Irene. Para.» Sujetarle las muñecas contra el colchón.", a: "v9_regreso", si: (api) => H(api) === "irene",
        efecto: (api) => { api.marcar("alex_gusto", false); api.marcar("alex_paro_irene", true); api.rel("alex", "irene", "tension", 6); api.est("alex", "miedo", 6); api.est("alex", "eje", -2); } },
      { texto: "Salir de ella. Levantarte. Encender la luz grande y mirarle la cara.", a: "v9_regreso", lucida: true, si: (api) => H(api) === "irene",
        efecto: (api) => { api.marcar("alex_gusto", false); api.marcar("alex_vio_lapso", true); api.saber("alex", "irene_lapso_visto"); api.est("alex", "lucidez", 1); api.est("alex", "miedo", 4); api.rel("alex", "irene", "tension", 4); } },
      { texto: "Dejarla. Que muerda. Que haga lo que haga. Y mirar el armario mientras.", a: "v9_regreso", si: (api) => H(api) === "irene",
        efecto: (api) => { api.marcar("alex_gusto", "deja"); R().alimentar(api, 1); R().ofrenda(api, "sangre"); api.est("alex", "eje", -3); api.est("alex", "miedo", 5); api.presenciar("alex", 1); } },
    ],
  },


  // =====================================================================
  // LOS QUE SE QUEDAN — Álex y Marcos en el almacén y en el porche (si Nora sube con Irene)
  // =====================================================================

  vq2_almacen_dos: {
    pov: (api) => H(api) === "marcos" ? "marcos" : "alex",
    fondo: "assets/fondos/almacen.jpg",
    ambiente: "almacen",
    musica: "terror_suave",
    lugar: "almacén", hora: "03:46",
    titulo: "El almacén · El candado",
    alEntrar: (api) => resolverRuta(api, "almacen_dos", true),
    texto: (api) => {
      const h = H(api);
      const arrastre = api.bandera("arrastre_almacen");
      const segunda = api.bandera("v_resuelta_almacen") && api.bandera("v_marcos_libre");   // Marcos ya estuvo aquí a las tres y media
      const movida = segunda && api.bandera("marcos_movio_estanteria");                     // y ya apartó la estantería: la puerta está a la vista
      if (h === "marcos") return `
La cocina. La luz de tubo. La sartén de hierro en el fuego, con el piloto rojo encendido y el mando en cero. Lo miras. Lo mira Álex.

Álex: ¿Eso es normal?

Marcos: No.

Álex: Guay.

La puerta del almacén, al lado de la nevera. Un escalón de piedra hacia abajo. Y el frío. No el de la casa: otro. El que sale de un sitio que no se calienta nunca. Te entra por los tobillos. Álex lo nota y no dice nada, que en Álex es raro.

La bombilla de cuarenta vatios. Tres por tres, suelo de piedra. La estantería al fondo con tarros, una garrafa, cuerda, una linterna grande de pilas, una caja de herramientas de alguien que ya no vive aquí. Y a la izquierda, la caja gris. El cuadro.

${segunda ? "El diferencial ya está arriba. Lo subiste hace un cuarto de hora, sin nadie para verlo. Vas derecho a la estantería." : "Un diferencial bajado. Lo subes. Clac. Y detrás, en el salón, la luz sube de tono."}

${segunda ? "Marcos: Ahí." : "Marcos: Ya está."}

${segunda ? "Álex: ¿Ahí qué?" : "Álex: ¿Ya está qué?"}

${segunda ? "Marcos: Mira la pared." : "Marcos: La lámpara. Era esto."}

${movida ? `La estantería sigue donde la dejaste: un palmo separada de la piedra. Y detrás, en el hueco, la puerta. Álex la ve antes de que se la enseñes.

Álex: Marcos.

Álex: Hay una puta puerta. Con hierro. Ayúdame.

Y empujáis lo que falta. Chirría contra la piedra. Y ahí está entera: baja, de madera vieja con clavos, con un candado que no es viejo. Un candado de ferretería. De hace un año, dos.` : `Álex no está mirando el cuadro. Está mirando la estantería. El hueco de dos dedos entre la madera y la pared. Y la pared, que no es de madera.

Álex: Marcos.

Lo ha visto antes que tú. Álex ve las cosas que no debería ver antes que nadie: es su único talento.

Álex: Hay una puerta.

Se mete por el hueco hasta el hombro. Saca la mano llena de polvo y frío.

Álex: Hay una puta puerta. Con hierro. Ayúdame.

Y empujáis la estantería entre los dos. Chirría contra la piedra. Diez centímetros. Veinte. Y ahí está: baja, de madera vieja con clavos, con un candado que no es viejo. Un candado de ferretería. De hace un año, dos.`}

Álex: La caja de herramientas. Dame la llave inglesa.

Marcos: Álex.

Álex: Dame la llave.

Se la das. Y mientras él la mete por el arco del candado y hace palanca con la cara roja, tú miras la puerta. Y la puerta te mira.

~ Abajo.

Eso ha llegado. Una palabra. Con tu voz. Sin que la pensaras.

~ Abajo.

${arrastre ? `Y entonces, detrás. Detrás de la puerta.

[arrastre]

Un arrastre.

Bajo. Una vez. Como algo pesado que se mueve un palmo sobre piedra y se para.

Álex suelta la llave. Se queda con las manos en el aire. Te mira.

Álex: Dime que has oído eso.

No contestas. No porque no lo hayas oído. Porque tu boca estaba diciendo otra cosa por dentro.

Álex: Marcos. Dime que lo has oído.

Marcos: Lo he oído.

Lo dices tarde. Lo dices como quien vuelve de otra habitación.` : `El candado no cede. Álex suelta la llave con un ruido de metal contra piedra.

Álex: Está soldado o algo.

No está soldado. Es un candado. Álex no sabe hacer palanca. Tú sí, y no te has movido, y tienes la mano en el estante, y la estantería está diez centímetros más adelante de donde la dejasteis, y no te acuerdas de haberla empujado tú solo.${movida ? " Otra vez." : ""}`}

${modo(api, "marcos", {
  lucido: `~ ${arrastre ? "Lo hemos oído los dos. Es la primera cosa de esta noche con dos testigos. Y el otro testigo es Álex. La casa sabe elegir." : "Un candado nuevo en una puerta vieja. Alguien ha cerrado esto hace poco. Alguien que sabía lo que cerraba."} Y «abajo». Otra vez «abajo». Con mi voz.`,
  asustado: "~ Abajo. Me lo ha dicho la puerta. No. Me lo he dicho yo. No. Lo he oído dentro y no era mi manera de decirlo.",
  tenso: "~ Álex con una llave inglesa haciendo palanca en un candado que no es suyo en una casa que no es suya. Y yo mirando. Y yo pensando abajo.",
  ido: "~ Abajo suena a ajoba si lo dices despacio. A-ba-jo. A-jo-ba. Lo dijo el vaso. Lo dijo Álex con el vaso. Y ahora lo digo yo sin vaso.",
  perdido: "~ Abajo. Es donde hay que ir. Es donde está. Lo dijo en la mesa y no lo entendí. Álex tiene la llave. Álex puede abrir.",
  normal: "~ Una puerta, un candado, Álex. Y una palabra que no es mía. Sacarle de aquí. Sacarnos.",
})}`;

      // Álex, con Marcos normal o sin llevar al huésped: él es el testigo que nadie va a creer
      return `
La cocina. La luz de tubo. La sartén de hierro en el fuego con un punto rojo encendido debajo y el mando en cero. Marcos se queda mirándolo dos segundos más de la cuenta.

Álex: ¿Eso es normal?

Marcos: No.

Álex: Guay.

El almacén. Un escalón de piedra hacia abajo y un frío que no es el de la casa. ${segunda ? "Marcos no va al cuadro de luces: va derecho a la estantería del fondo, como quien vuelve a un sitio." : "Marcos va al cuadro de luces como quien va a lo suyo."} Tú vas a lo tuyo, que es todo lo demás.

Tres por tres. Suelo de piedra. Una estantería con tarros, una garrafa, una linterna grande y una caja de herramientas. Y detrás de la estantería, ${movida ? "un palmo de hueco, como si alguien la hubiera empezado a mover y lo hubiera dejado a medias, y por el hueco, piedra" : "un hueco de dos dedos, y por el hueco, piedra"}. Piedra vieja. La única pared de piedra que has visto en esta casa.

Y aire. Frío. Saliendo por abajo, constante, como de una rendija que da a algún sitio.

Álex: Marcos.

${segunda ? "Marcos: Ya lo sé. Por eso te he traído." : "Marcos: Un diferencial. Estaba bajado. Ya está."}

Álex: Marcos, hay una puerta.

${movida ? "Se gira. No mira: ya lo sabe." : "Se gira. Mira."} Y se le pone la cara de cuando algo tiene solución y de cuando no la tiene, las dos a la vez.

Empujáis ${movida ? "lo que falta" : "la estantería entre los dos"}. Chirría contra la piedra. ${movida ? "" : "Diez centímetros. Veinte. "}Y ahí está: baja, de madera vieja con clavos, y un candado que no es viejo. Un candado de ferretería. De hace un año, dos.

Álex: La caja de herramientas. Dame la llave inglesa.

Marcos: Álex.

Álex: Dame la llave, joder.

Te la da. Metes el mango por el arco del candado. Haces palanca. Te pones rojo. El candado hace un ruido pequeño, de metal que se ríe, y no cede.

${arrastre ? `Y entonces, detrás. Detrás de la puerta.

[arrastre]

Un arrastre.

Bajo. Una vez. Como algo pesado que se mueve un palmo sobre piedra y se para. No un animal: un animal hace ruido de patas. Esto no tenía patas. Esto tenía peso.

Sueltas la llave. Te quedas con las manos en el aire. Miras a Marcos.

Álex: Dime que has oído eso.

Marcos no contesta enseguida. ${h === "marcos" ? "Tiene la mano en el estante y la cara en otro sitio. Como si le hubieran hablado desde dentro y estuviera contestando." : "Tiene la cara de quien está buscando el nombre de una cosa y no lo encuentra."}

Álex: Marcos. Dime que lo has oído.

Marcos: Lo he oído.

Lo dice bajo. Sin «un tejón». Sin nada. Marcos, que tiene un nombre para todo, no tiene nombre para esto.

~ Lo hemos oído los dos. Los dos. Por una vez en mi vida hay un testigo, y el testigo es Marcos, y Marcos no va a decirlo delante de Nora ni muerto.` : `Nada cede. Sueltas la llave con un ruido de metal contra piedra.

Álex: Está soldado o algo.

Marcos: Es un candado. No sabes hacer palanca.

Álex: Hazla tú.

No la hace. Se queda mirando la puerta. ${h === "marcos" ? "Con la mano en el estante. Y la estantería, cuando te fijas, está más adelante de donde la dejasteis. Un palmo. Y Marcos no la ha empujado. O sí." : "Con la cara de quien preferiría que la puerta no existiera, porque una puerta con candado es un problema con una solución que no le gusta."}`}

${modo(api, "alex", {
  lucido: `~ ${arrastre ? "Un ruido con peso detrás de una puerta con candado nuevo. Y Marcos que lo ha oído y no ha dicho tejón. Esto es lo mejor que me ha pasado en toda la noche y no se lo va a creer nadie." : "Un candado nuevo en una puerta vieja. Alguien cierra esto. Alguien viene a cerrarlo. Me encanta y me da igual que me dé miedo."}`,
  asustado: `~ ${arrastre ? "Tenía peso. Lo he oído tener peso. A dos dedos de mi mano. Y la llave inglesa no sirve para nada." : "Aire. De abajo. Hay un abajo. Yo dije que había un abajo y hay un abajo y no me hace ninguna gracia haber acertado."}`,
  tenso: "~ Marcos con su cuadro de luces. Marcos con su «ya está». Y una puerta. Y yo con una llave inglesa como un gilipollas.",
  ido: `~ ${arrastre ? "Se ha movido un palmo. Como se mueve alguien en una cama. Como se mueve alguien que ha oído su nombre." : "El aire de la rendija huele a dulce. Como la bolsa de las setas. Como algo que fue fruta."}`,
  perdido: `~ ${h === "marcos" ? "Marcos ha empujado la estantería solo. Sin mirarla. Como si la puerta le hubiera pedido que la ayudara." : "Hay una habitación debajo. Con cunas. Lo conté yo. Lo conté porque alguien me lo contó y ese alguien lo sabía."}`,
  normal: "~ Documental número cuatro: una puerta. Y ahora, el coche de Marcos, que lleva toda la noche encendiéndose solo y nadie lo ha mirado.",
})}`;
    },
    opciones: [
      // Marcos huésped
      { texto: "Cerrar la tapa del cuadro. Sacar a Álex de aquí. Ya.", a: "vq3_porche_reto", si: (api) => H(api) === "marcos",
        efecto: (api) => { api.marcar("marcos_movio_estanteria", true); api.marcar("marcos_cuenta_puerta", true); api.marcar("marcos_cuenta_arrastre", false); api.est("marcos", "estres", 4); api.est("marcos", "eje", 2); } },
      { texto: "Dejar que Álex lo intente otra vez. Mirar la puerta. Solo mirarla.", a: "vq3_porche_reto", si: (api) => H(api) === "marcos",
        efecto: (api) => { api.marcar("marcos_movio_estanteria", true); api.marcar("marcos_se_quedo", true); api.marcar("marcos_cuenta_puerta", false); api.marcar("marcos_cuenta_arrastre", false); api.est("marcos", "estres", 6); api.est("marcos", "lucidez", -2); } },
      { texto: "Coger la llave inglesa. Tú. Y quedártela en el bolsillo de atrás.", a: "vq3_porche_reto", lucida: true, si: (api) => H(api) === "marcos",
        efecto: (api) => { api.marcar("marcos_movio_estanteria", true); api.marcar("llave_inglesa", "marcos"); R().coger(api, "marcos", "llave"); api.marcar("marcos_cuenta_puerta", true); api.marcar("marcos_cuenta_arrastre", api.bandera("arrastre_almacen") ? true : false); api.saber("marcos", "puerta_vista"); api.est("marcos", "lucidez", 1); } },
      // Álex
      { texto: "«Documental número cuatro.» Grabar la puerta. El candado. La cara de Marcos.", a: "vq3_porche_reto", si: (api) => H(api) !== "marcos",
        efecto: (api) => { api.evidencia("video_puerta_almacen", "alex", "almacén", "video"); api.marcar("marcos_movio_estanteria", true); api.marcar("marcos_cuenta_puerta", true); api.marcar("marcos_cuenta_arrastre", false); api.est("alex", "lucidez", 1); } },
      { texto: "«¿Lo has oído? Dime que lo has oído.» Otra vez. Hasta que lo diga delante de Nora.", a: "vq3_porche_reto", si: (api) => H(api) !== "marcos" && api.bandera("arrastre_almacen"),
        efecto: (api) => { api.marcar("marcos_movio_estanteria", true); api.marcar("marcos_cuenta_puerta", true); api.marcar("marcos_cuenta_arrastre", api.lucido("marcos")); api.rel("alex", "marcos", "confianza", 4); api.rel("marcos", "alex", "resentimiento", 2); } },
      { texto: "Coger la llave inglesa. Por si acaso. Y salir del almacén el primero.", a: "vq3_porche_reto", si: (api) => H(api) !== "marcos",
        efecto: (api) => { api.marcar("llave_inglesa", "alex"); R().coger(api, "alex", "llave"); api.marcar("marcos_movio_estanteria", true); api.marcar("marcos_cuenta_puerta", true); api.marcar("marcos_cuenta_arrastre", false); api.est("alex", "eje", 2); } },
    ],
  },

  vq3_porche_reto: {
    pov: (api) => H(api) === "marcos" ? "marcos" : "alex",
    fondo: "assets/fondos/porche.jpg",
    ambiente: "exterior",
    lugar: "porche", hora: "03:50",
    titulo: "El porche · El reto",
    texto: (api) => {
      const h = H(api);
      const voz = api.bandera("alex_oyo_irene_fuera");
      const llave = api.bandera("llave_inglesa");
      const comun = `
Álex se guarda el porro en la boca, lo enciende, y abre la puerta principal con el hombro.

Álex: Ven. Tu coche.

Marcos: ¿Qué le pasa a mi coche?

Álex: Que lleva toda la noche encendiéndose solo y nadie lo mira.

El porche. Dos escalones de madera hasta la grava. La bombilla amarilla con sus polillas. La barandilla, húmeda. Y a veinte metros, el coche de Marcos, un bulto. Con la luz de dentro encendida.

Amarilla, débil, la de encima del retrovisor. Se ve el volante, los asientos, nadie.`;

      if (h === "marcos") return `${comun}

Marcos: La batería.

Álex: La batería no se enciende sola.

Marcos: Un contacto. El frío.

Álex: Tres cosas. Muy bien. Ve a mirarlo.

No te mueves. Álex baja el primer escalón. El segundo. Se para en el último, con la mano en la barandilla, y mira los pinos.

Álex: ¿Irene?

${voz ? `Lo dice a los árboles. A la izquierda. Donde no hay nadie.

Marcos: Irene está arriba. Con Nora.

Álex: Ya. Ya lo sé.

No se mueve. Sigue mirando los pinos. Como quien espera que le vuelvan a llamar. Tú no has oído nada. Nada. Y la cara de Álex no es la de una broma.` : `Lo dice bajo. Y se ríe de sí mismo.

Álex: Nada. Me ha parecido.`}

Álex: Venga. Baja. Es tu coche.

Marcos: No.

Álex: No tienes huevos.

Marcos: No tengo ganas.

Álex: Es lo mismo con menos huevos.

Y bajas. Porque es Álex y porque cinco años son cinco años. El primer escalón. El segundo. El último. La grava a un paso, mojada, brillando bajo la luz del porche y luego no, porque la luz se acaba.

Y ahí te paras.

No sabes por qué te paras. Sí lo sabes.

~ Todavía no.

Eso ha llegado. Con tu voz. Y te has parado como se para un coche cuando alguien pisa el freno. Alguien.

${modo(api, "marcos", {
  lucido: "~ La luz se enciende sola y se apaga sola. Un relé. Y yo en el último escalón sin bajar porque algo me ha dicho «todavía no» y he obedecido. Yo. He obedecido.",
  asustado: "~ Todavía no. Todavía no qué. Todavía no salgas. Todavía no es el momento. De qué.",
  tenso: "~ Álex y sus huevos. Álex y su coche que no es suyo. Y yo aquí, en un escalón, sin poder dar un paso, por una palabra.",
  ido: "~ La grava brilla. Es un camino. Y el camino me dice que todavía no. Que espere aquí. Que espere a los demás.",
  perdido: "~ No puedo bajar porque lo que llevo no quiere salir de la luz. Se queda dentro. Me quedo dentro. Con ellos.",
  normal: "~ Un pie. Un pie en la grava y se acabó el reto. Un pie. Y no.",
})}`;

      return `${comun}

Álex: ¿Ves?

Marcos: La batería.

Álex: La batería no se enciende sola.

Marcos: Un contacto. El frío.

Álex: Tres cosas. Muy bien. Ve a mirarlo.

Bajas tú el primer escalón. El segundo. Te paras en el último, con la mano en la barandilla, y miras los pinos.

${voz ? `Álex.

A la izquierda. Desde los árboles.

La voz de Irene. No la de las bromas. La de cuando pide ayuda de verdad, que solo le has oído una vez, hace tres años, en un coche.

Álex: ¿Irene?

Lo dices a los pinos. Donde no hay nadie. Donde no hay luz.

Marcos: Irene está arriba. Con Nora.

Álex: Ya. Ya lo sé.

Y no te mueves. Y Marcos no ha oído nada, se le ve, y tú lo has oído con el cuerpo entero.

~ Está arriba. Con Nora. Y me ha llamado desde ahí. Desde los árboles. Con la voz de cuando.` : `Los pinos. La línea negra donde se acaba la grava. El viento arriba, en las copas, que suena a mar.

Nada. Y sin embargo te has quedado mirando, como quien espera que le llamen.`}

Álex: Venga, Marcos. Baja. Es tu coche.

Marcos: No.

Álex: No tienes huevos.

Marcos: No tengo ganas.

Álex: Es lo mismo con menos huevos.

Y baja. Porque cinco años son cinco años. El primer escalón. El segundo. El último. Se para a tu lado. Con la grava a un paso, mojada, brillando bajo la luz del porche y luego no.

${h === "marcos" ? "Y ahí se queda. Con la cara levantada hacia el coche y los ojos en otro sitio. Como si alguien le hubiera dicho algo al oído y estuviera contestando.\n\nMarcos: Todavía no.\n\nÁlex: ¿Todavía no qué?\n\nMarcos: Nada.\n\nNo te mira. Mira la grava." : "Y ahí se queda. Marcos, que resuelve todo, con un pie en el aire y sin bajarlo. Y tú al lado, con el tuyo igual. Dos tíos de treinta años delante de un coche con la luz encendida, sin bajar dos escalones."}

${llave === "alex" ? "La llave inglesa te pesa en el bolsillo de atrás. Como una razón." : ""}

~ No tienes huevos.

Lo dice una voz. Es la tuya. Siempre es la tuya.

${modo(api, "alex", {
  lucido: `~ ${voz ? "Su voz. Su nombre en mi boca. Y ella arriba, con Nora. Dos cosas verdad que no pueden ser verdad a la vez. Y Marcos que no ha oído nada." : "Veinte metros. Grava. Un coche. Miro dentro, no hay nadie, vuelvo. Es lo que haría cualquiera. Cualquiera que no tuviera miedo."}`,
  asustado: `~ ${voz ? "Me ha llamado. Con su voz. Sabe su voz. Y quiere que baje." : "No he bajado. No he bajado y no sé por qué y eso es lo que más miedo me da."}`,
  tenso: "~ Miro y vuelvo. Miro y vuelvo. Marcos con su «no tengo ganas». Miro y vuelvo.",
  ido: "~ La grava brilla. Está mojada y brilla. Es un camino. Es el camino más claro que he visto en mi vida.",
  perdido: `~ ${voz ? "Ya sabe las voces. Ha aprendido la de Irene esta noche. Y me llama con ella para que baje." : "Hay alguien en el asiento de atrás. Quiere que baje. Me ha encendido la luz para que la vea."}`,
  normal: "~ Venga. Veinte metros. Que no se diga. Que no se diga delante de Marcos.",
})}`;
    },
    opciones: [
      // Marcos huésped: no cruza mientras lo lleva. Pero puede empujar a Álex, o sacarlo de ahí.
      { texto: "«Vamos dentro.» Cogerle del hombro. Sin bajar.", a: "v9_regreso", si: (api) => H(api) === "marcos",
        efecto: (api) => { api.marcar("reto_fin", "dentro"); api.marcar("alex_quiso_cruzar", false); api.rel("alex", "marcos", "afecto", 3); api.est("marcos", "estres", -2); } },
      { texto: "«Baja tú. Que es lo que quieres.» Y mirarle bajar.", a: "vq4_cruce", si: (api) => H(api) === "marcos",
        efecto: (api) => { api.marcar("reto_fin", "alex_baja"); api.marcar("reto_quien", "alex"); api.marcar("alex_quiso_cruzar", true); api.est("marcos", "eje", -3); api.rel("alex", "marcos", "tension", 4); } },
      { texto: "Quedarte en el escalón. Mirar el coche. Hasta que la luz se apague sola.", a: "v9_regreso", si: (api) => H(api) === "marcos",
        efecto: (api) => { api.marcar("reto_fin", "espera"); api.marcar("marcos_se_quedo", true); api.marcar("alex_quiso_cruzar", api.valor("alex", "eje") >= 70); api.est("marcos", "estres", 4); api.est("marcos", "lucidez", -1); } },
      // Álex
      { texto: "Bajar. Un pie en la grava. A ver qué pasa.", a: "vq4_cruce", si: (api) => H(api) !== "marcos",
        efecto: (api) => { api.marcar("reto_quien", "alex"); api.marcar("alex_quiso_cruzar", true); api.marcar("alex_piso_grava", true); api.est("alex", "eje", 3); } },
      { texto: "«Marcos. Baja tú. Yo grabo.» Sacar el móvil.", a: "vq4_cruce", si: (api) => H(api) !== "marcos" && H(api) !== "marcos",
        efecto: (api) => { api.marcar("reto_quien", "marcos"); api.marcar("alex_quiso_cruzar", false); api.evidencia("video_coche_luz", "alex", "porche", "video"); api.rel("marcos", "alex", "resentimiento", 3); } },
      { texto: "Subir los dos escalones de espaldas. «Vamos dentro. Que se joda tu coche.»", a: "v9_regreso", si: (api) => H(api) !== "marcos",
        efecto: (api) => { api.marcar("reto_fin", "dentro"); api.marcar("alex_quiso_cruzar", false); api.est("alex", "eje", -4); api.est("alex", "miedo", 4); api.rel("marcos", "alex", "afecto", 2); } },
    ],
  },

  // El cruce real. Un pie en la grava, la luz que se apaga, y la segunda decisión: la que marca.
  vq4_cruce: {
    pov: (api) => api.bandera("reto_quien") === "marcos" ? "marcos" : "alex",
    fondo: "assets/fondos/bosque.jpg",
    titulo: "El porche · La grava",
    texto: (api) => {
      const q = api.bandera("reto_quien") || "alex";
      const yo = q === "alex" ? "alex" : "marcos";
      const otro = yo === "alex" ? "Marcos" : "Álex";
      return `
${yo === "alex" ? "Bajas. El último escalón. Y el pie en la grava." : "Bajas. Porque te lo ha dicho Álex y porque llevas toda la noche resolviendo cosas y esto se resuelve con veinte metros. El último escalón. Y el pie en la grava."}

Cruje. Está mojada y cruje y está fría a través de la zapatilla.

Y la luz del porche se apaga.

[negro]

Detrás de ti. Y la del coche. Las dos. A la vez.

Negro. El negro de verdad, el de un bosque sin luna, el que no tiene forma. Oyes a ${otro} decir tu nombre en el porche, a dos metros, y suena a diez.

${yo === "alex" ? "~ Un relé. Un contacto. La casa entera con la instalación de un barco hundido. Y tú con un pie fuera." : "~ Un relé. Las dos luces en el mismo circuito. Es lo primero que piensas, y es lo primero que no te sirve."}

${yo === "alex" ? `Y en el negro, delante, un golpe.

[toc]

Toc.

En la chapa del coche. Uno. Como un nudillo. Antes de que tu mano haga nada, porque tu mano no llega a nada.` : `Y en el negro, delante, un motor.

Lejos. Sin faros. Un motor que viene por la pista de tierra por la que no viene nadie a las cuatro de la mañana. Y se para. No se apaga: se para.`}

${otro}: Sube. Sube ya.

Sacas el pie. Lo pones en el escalón.

[luz]

La luz del porche vuelve. La del coche no.

Y te quedas ahí. Con un pie en cada mundo. Y la grava, delante, brillando otra vez como un camino.

${modo(api, yo, {
  lucido: "~ Un pie. Se han apagado dos luces con un pie. Y han vuelto al sacarlo. Un relé no sabe dónde tengo el pie. Nada eléctrico sabe dónde tengo el pie.",
  asustado: `~ ${yo === "alex" ? "Ha llamado. En el coche. Antes de mi mano, como en la barandilla. Me contesta antes de que pregunte." : "Un motor. Sin faros. Por esa pista no viene nadie a las cuatro. Y se ha parado a la altura de mi coche."}`,
  tenso: "~ Dos luces. Un pie. Y yo con el corazón en la boca por una grava mojada. Vuelve arriba. Vuelve arriba, imbécil.",
  ido: "~ El camino brilla. Me esperaba. Se ha apagado para que lo viera sin luz, que es como se ven los caminos de verdad.",
  perdido: "~ Me ha probado. Ha apagado la luz para ver si sigo. Y ahora la ha vuelto a encender para ver si vuelvo. Está eligiendo.",
  normal: "~ Un pie. Y las luces. Vale. Vale. Ahora la decisión de verdad: el segundo pie.",
})}`;
    },
    opciones: [
      { texto: "Seguir. Hasta el coche. Que se joda la luz.", a: "v9_regreso",
        efecto: (api) => {
          const yo = api.bandera("reto_quien") === "marcos" ? "marcos" : "alex";
          if (yo === "alex") api.marcar("alex_cruzo", true); else api.marcar("marcos_cruzo", true);
          R().cruzar(api, yo);
          api.marcar("reto_fin", "cruza"); api.est(yo, "eje", 4); api.est(yo, "miedo", 6); api.presenciar(yo, 2);
          api.saber(yo, "cruce_luz"); api.marcar("luz_coche_apagada", true);
        } },
      { texto: "Volver al escalón. Ya. Sin mirar los árboles.", a: "v9_regreso",
        efecto: (api) => {
          const yo = api.bandera("reto_quien") === "marcos" ? "marcos" : "alex";
          api.marcar("reto_fin", "vuelve"); api.est(yo, "eje", -4); api.est(yo, "miedo", 4); api.est(yo, "lucidez", 1);
        } },
    ],
  },

  // =====================================================================
  // REAGRUPAMIENTO — información individual y credibilidad
  // =====================================================================

  v9_regreso: {
    pov: "nora",
    fondo: "assets/fondos/salon_noche.jpg",
    ambiente: "interior",
    musica: "terror_suave",
    lugar: "comedor", hora: "04:00",
    titulo: "La dispersión · Lo que cuenta cada uno",
    alEntrar: (api) => {
      T2(api).forEach((r) => resolverRuta(api, r, false));
      if (noraCon(api) === "marcos" && (api.bandera("nora_toma_muneca") || api.bandera("nora_cuenta_huellas"))) api.marcar("marcos_dijo_no_ratas", true);
      const q = quedan(api);
      // Quien cruzó de verdad vuelve marcado: miente sobre lo que vio, no cuenta la grava (Biblia §21)
      if (api.bandera("alex_cruzo")) { api.marcar("alex_cuenta_grava", false); api.est("alex", "estres", 4); }
      if (api.bandera("marcos_cruzo")) { api.marcar("marcos_cuenta_grava", false); api.est("marcos", "estres", 4); }
      // Quién se cree a quién: credibilidad del que cuenta y confianza del que escucha
      if (api.bandera("alex_cuenta") && api.sabe("alex", "oi_irene_fuera")) {
        api.marcar("cree_alex_marcos", q === "alex_marcos" ? false : api.contar("alex", "marcos", "oi_irene_fuera"));   // Marcos estaba al lado y no oyó nada
        api.marcar("cree_alex_nora", api.bandera("nora_vio_gente") ? true : api.contar("alex", "nora", "oi_irene_fuera"));
        api.marcar("cree_alex_irene", api.bandera("irene_oyo_alex_puerta") ? true : api.contar("alex", "irene", "oi_irene_fuera"));
      }
      if (q === "alex_marcos" && api.bandera("alex_cuenta") && api.bandera("alex_oyo_arrastre")) {
        api.marcar("cree_alex_nora", api.contar("alex", "nora", "arrastre") || api.bandera("marcos_cuenta_arrastre"));
        api.marcar("cree_alex_irene", api.contar("alex", "irene", "arrastre"));
      }
      if (q === "irene_alex" && api.bandera("alex_cuenta")) { api.contar("alex", "nora", "golpe_armario"); api.contar("alex", "marcos", "golpe_armario"); }
      if (api.bandera("irene_cuenta") && api.sabe("irene", "oi_alex_puerta")) {
        api.marcar("cree_irene_marcos", api.contar("irene", "marcos", "oi_alex_puerta"));
        api.marcar("cree_irene_nora", api.contar("irene", "nora", "oi_alex_puerta"));
      }
      if (api.bandera("marcos_cuenta_arrastre") && api.sabe("marcos", "arrastre")) {
        api.marcar("cree_marcos_nora", api.contar("marcos", "nora", "arrastre"));
        api.marcar("cree_marcos_alex", api.contar("marcos", "alex", "arrastre"));
      }
      if (api.bandera("marcos_cuenta_puerta") && api.sabe("marcos", "puerta_almacen")) { api.contar("marcos", "nora", "puerta_almacen"); api.contar("marcos", "alex", "puerta_almacen"); api.contar("marcos", "irene", "puerta_almacen"); }
      if (api.bandera("nora_cuenta_huellas")) { api.marcar("cree_nora_marcos", api.contar("nora", "marcos", "huellas_pequenas")); api.marcar("cree_nora_alex", api.contar("nora", "alex", "huellas_pequenas")); api.contar("nora", "irene", "huellas_pequenas"); }
      api.evidencia("cuaderno_dispersion", "nora", "cuaderno de Nora", "nota");
      api.marcar("fase5_completa", true);
      api.est("nora", "estres", 3);
    },
    texto: (api) => {
      const h = H(api);
      const nc = noraCon(api), ic = ireneCon(api), q = quedan(api);
      const ruta = api.bandera("v_ruta");
      const sp = api.bandera("salida_porche");
      const inv = api.bandera("irene_nora");

      // 1. Cómo vuelve Nora
      const vuelta = nc === "irene" ? `
Bajáis. El séptimo. El tercero. Irene delante, ${inv === "peligro" ? "descalza, con la mano metida en la manga hasta los nudillos, sin mirar atrás" : inv === "alianza" ? "descalza, y en el tercer escalón se gira a ver si sigues ahí" : "descalza, con el paso de siempre, como si vinierais del baño"}. ${api.bandera("nora_toma_muneca") ? "La mochila te pesa en un hombro con lo que lleva dentro." : ""}

La mesa. La tabla. Nadie todavía. ${inv === "alianza" ? "Irene se sienta a tu lado. No en su silla: a tu lado. Álex lo va a ver cuando entre." : inv === "peligro" ? "Irene se sienta en su silla y se mira la mano. Tú te miras la muñeca. Rojo. Cuatro dedos." : "Irene se sienta en su silla. Tú en la tuya. Como siempre. Y no como siempre."}` : nc === "marcos" ? `
Bajáis. El séptimo. El tercero. Marcos ${api.bandera("huesped_sujeto") === "nora" && h === "marcos" ? "detrás, a dos escalones, sin tocarte" : "delante, mirando atrás cada tres escalones"}. ${api.bandera("nora_toma_muneca") ? "La mochila te pesa en un hombro con lo que lleva dentro." : ""}

${q === "irene_alex" ? (api.bandera("irene_paro_alex") ? "La puerta del dormitorio del fondo, cerrada. Se oye a Álex decir «joder». Bajo. Dos veces. No de la manera buena. Pasáis por delante sin mirar." : api.bandera("irene_tras_sombra") === "abre" ? "La puerta del dormitorio del fondo, entreabierta, con la luz grande encendida. Irene de pie delante del armario abierto, con la sudadera puesta. Álex sentado en la cama, buscando la camisa con la mano. Ninguno os mira pasar." : api.bandera("irene_tras_sombra") === "para" || api.bandera("irene_tras_sombra") === "mira" ? "La puerta del dormitorio del fondo, cerrada. Nadie habla dentro. Ese silencio. Pasáis por delante sin mirar." : "La puerta del dormitorio del fondo, cerrada. Se oye a Irene decir algo bajo. Se oye a Álex reírse. Pasáis por delante sin mirar.") : ""}

La mesa. La tabla. Nadie todavía.` : `
Bajas. El séptimo. El tercero. ${api.bandera("nora_toma_muneca") ? "La mochila te pesa en un hombro con lo que lleva dentro." : "Con las manos vacías y el cuaderno en la cabeza."}

La mesa. La tabla. Las velas a medio consumir.`;

      // 2. Quién llega, o quién sigue en la mesa
      const llegan = [];
      if (q === "irene_alex") llegan.push(`
La escalera. Irene y Álex. Ella con la sudadera ${api.bandera("irene_paro_alex") ? "del revés, y no se ha dado cuenta" : "puesta otra vez, y el pelo de haber estado tumbada"}; él abrochándose la camisa que no abrocha nunca.${api.hayEvidencia("mordisco_alex") ? " Y en el cuello, cuando se gira hacia la nevera, una marca. De dientes. Roja. Que a las tres no estaba. Se sube el cuello de la camisa como quien sabe que le miran. Irene le mira el cuello y no sabe qué está mirando. Se le ve no saberlo." : ""}${api.bandera("irene_tras_sombra") === "para" || api.bandera("irene_tras_sombra") === "mira" ? " Irene no se sienta en su silla: se sienta en la que está de espaldas a la escalera." : ""}`);
      else if (q === "alex_marcos") llegan.push(api.bandera("reto_fin") === "cruza" ? `
La puerta principal. ${api.bandera("alex_cruzo") ? "Álex entra con el frío detrás y la cara blanca. Marcos detrás de él, con la mano en su espalda, empujándole dentro como se empuja a alguien que se ha caído al agua." : "Marcos entra con el frío detrás y la cara blanca. Álex detrás de él, callado, que es lo más raro que ha hecho Álex en toda la noche."}` : `
La puerta principal. Marcos y Álex. Marcos con polvo en las rodillas y Álex con la cara de quien trae algo. ${api.bandera("reto_fin") === "espera" ? "Álex mira a Marcos como se mira a alguien que ha hecho algo raro en un sitio donde no había nadie más para verlo." : ""}`);
      else llegan.push(`
Los tres en la mesa. Donde los dejaste. Álex con el mechero, Marcos con la cerveza, Irene con el vaso que no bebe. Levantan la cabeza los tres a la vez cuando llegas al séptimo escalón.`);

      // 3. Álex. La voz de Irene en los árboles la cuenta siempre que la oyó (tramo 1, y otra vez en el porche si volvió con Marcos)
      const vozAlex = api.bandera("alex_oyo_irene_fuera") && api.bandera("alex_cuenta") ? `

Álex: Y fuera, antes, he oído a Irene. En los árboles. Diciendo mi nombre.

Irene: Yo estaba arriba.

Álex: Ya lo sé. Por eso lo cuento.${noraPorche(api) ? "\n\nTú estabas a su lado. Le oíste decir «¿Irene?» a los pinos. No oíste nada más. Lo apuntas: las dos cosas." : ""}` : "";
      const alex = q === "irene_alex" ? (api.bandera("irene_paro_alex") ? (api.bandera("alex_gusto") === true ? `
Álex: El armario de nuestro cuarto nos ha aplaudido. Y a esta le ha dado por morder.

Lo dice riéndose, con la mano en el cuello. Marcos no se ríe. Irene tampoco: se mira las uñas, y hay algo oscuro debajo, y se las limpia con el pulgar como quien no sabe qué es.${vozAlex}` : `
Álex no cuenta nada. Álex, que lo cuenta todo. Se sienta con el cuello de la camisa subido y coge una cerveza, y mira a Irene como se mira a alguien que te ha hecho daño y no lo sabe.

Irene: ¿Qué?

Álex: Nada.`) : api.bandera("alex_cuenta") ? `
Álex: El armario de nuestro cuarto nos ha aplaudido.

Marcos: ¿Qué?

Álex: Un golpe. Dentro. En el mejor momento. ${api.bandera("irene_tras_sombra") === "abre" ? "Irene lo ha abierto. Con la luz grande y yo con el pantalón a medias. Abrigos de otra gente. Y una marca en el fondo, a esta altura, como si alguien pequeño hubiera estado apoyado ahí un siglo." : "No lo he abierto. Irene no me ha dejado."}

Lo cuenta riéndose. Irene no se ríe. Irene mira el techo. Hacia el dormitorio. Hacia el baño de al lado del dormitorio.

${api.bandera("irene_tras_sombra") === "mira" ? "Irene: Había alguien dentro.\n\nÁlex: No había nadie.\n\nIrene: Lo he visto.\n\nÁlex: Yo he mirado.\n\nY se miran, y en esa mirada Álex pierde algo que no sabe que ha perdido." : ""}${vozAlex}` : `
Álex no cuenta nada. Se sienta con la camisa mal abrochada y coge una cerveza. Irene tampoco. Lo que haya pasado en ese dormitorio se ha quedado en ese dormitorio, y a ti te da igual, y no te da igual.`) : q === "alex_marcos" ? (api.bandera("alex_cuenta") ? `
Álex: Vale. Escuchad. Hay una puerta.

Marcos: Álex.

Álex: Detrás de la estantería del almacén. De piedra. Con un candado nuevo. Y detrás de la puerta...

Mira a Marcos.

Álex: Díselo.

${api.bandera("marcos_cuenta_arrastre") ? "Marcos: Hemos oído algo. Detrás. Un arrastre. Una vez.\n\nSilencio.\n\nMarcos, que tiene un nombre para todo, acaba de decir «algo». Y Álex se echa hacia atrás en la silla como quien ha ganado un juicio." : api.bandera("alex_oyo_arrastre") ? "Marcos: Un candado. Es un sótano. Todas estas casas tienen sótano.\n\nÁlex: Y lo del ruido.\n\nMarcos: Una rata.\n\nÁlex: Tenía peso, Marcos. Lo has oído. Lo has oído a mi lado.\n\nMarcos: He oído un ruido.\n\nY Álex mira alrededor de la mesa buscando a alguien que le crea, y por primera vez en la noche le importa que le crean, y eso se le nota, y no ayuda." : "Marcos: Un candado. Es un sótano. Todas estas casas tienen sótano.\n\nÁlex: Todas estas casas tienen sótano tapiado con una estantería, sí."}

${api.bandera("alex_oyo_irene_fuera") ? `Álex: Y he oído a Irene. Fuera. En los árboles. Diciendo mi nombre.

Irene: Yo estaba en la buhardilla.

Nora: Conmigo.

Álex: Ya lo sé. Por eso lo cuento.

Marcos: Yo estaba al lado y no he oído nada.

Álex: Ya lo sé. Por eso lo cuento.` : ""}${api.bandera("alex_cruzo") ? "\n\nY no cuenta lo de la grava. Álex, que lo cuenta todo, que no ha vuelto nunca de ningún sitio sin contarlo, no cuenta que ha bajado hasta el coche a oscuras. Marcos le mira. Álex mira la cerveza." : api.bandera("marcos_cruzo") ? "\n\nY no cuenta que Marcos ha bajado hasta el coche. Mira a Marcos. Marcos mira la cerveza. Y Marcos, que lo explica todo, no explica por qué tiene la cara de ese color." : ""}` : `
Álex no dice nada. Se sienta. Coge una cerveza. Álex, que lo cuenta todo, que no ha vuelto nunca de ningún sitio sin contarlo.

Nora: ¿Qué?

Álex: Nada. Una puerta. Que te lo cuente Marcos.`) : api.bandera("alex_cuenta") ? (api.sabe("alex", "oi_irene_fuera") ? `
Álex: Vale. Escuchad.

Se sienta. Se levanta. No sabe dónde ponerse.

Álex: He oído a Irene. Fuera. En los árboles. Diciendo mi nombre.

Irene: Yo estaba arriba.

Álex: Ya.

Irene: Yo no he dicho tu nombre.

Álex: Ya lo sé. Por eso lo cuento.

${api.bandera("cree_alex_marcos") ? "Marcos no dice nada. Marcos, que tiene un chiste para esto y no lo usa." : "Marcos: Fumado oyes cosas.\n\nÁlex: Fumado oigo mejor.\n\nMarcos: Ya."}

${api.bandera("alex_piso_grava") ? "Álex: Y he pisado la grava. Un pie. Y se ha apagado la luz del porche. Y la del coche. A la vez.\n\nMarcos: ¿Qué luz del coche?\n\nÁlex: La de dentro. Estaba encendida. Sola." : "Álex: Y la luz de dentro de tu coche estaba encendida. Sola. Y luego se ha apagado. Sola.\n\nMarcos: La batería.\n\nÁlex: La batería no habla."}` : `
Álex: La luz de dentro de tu coche. Se ha encendido sola. Y se ha apagado sola.

Marcos: La batería. Un contacto. El frío.

Álex: Tres cosas. Muy bien. Tres cosas.`) : `
Álex no dice nada. Se sienta. Coge una cerveza. Álex, que lo cuenta todo, que no ha vuelto nunca de ningún sitio sin contarlo.

Nora: ¿Qué?

Álex: Nada. Frío.`;

      // 4. Irene
      const alexHablo = api.bandera("alex_cuenta") && !(q === "irene_alex" && api.bandera("irene_paro_alex") && api.bandera("alex_gusto") !== true);
      const irene = api.bandera("irene_cuenta") && api.sabe("irene", "oi_alex_puerta") ? `
Irene: ¿Has subido tú?

A Álex. Sin la voz.

Álex: ¿A qué?

Irene: A nada. ¿Has subido?

Álex: ${q === "alex_marcos" ? "He estado en el almacén. Con Marcos. Pregúntale a Marcos." : q === "irene_alex" ? "Fuera. Fumando. Y luego contigo. ¿Dónde iba a estar?" : noraPorche(api) ? "He estado fuera. Fumando. Pregúntale a Nora." : "He estado fuera. Fumando. Solo."}

Irene: Ya.

Y no dice más. Y Álex la mira, y por primera vez esta noche Álex no tiene nada que decir.

${api.sabe("alex", "oi_irene_fuera") && (api.bandera("alex_cuenta") || noraPorche(api)) ? (nc === "irene" ? "~ Él la ha oído fuera. Ella le ha oído debajo de la trampilla. Yo estaba con ella y no oí nada. Cada uno donde no estaba el otro. Al mismo tiempo." : "~ Él la ha oído fuera. Ella le ha oído arriba. Cada uno donde no estaba el otro. Al mismo tiempo.") : ""}` : api.bandera("irene_oyo_alex_puerta") ? `
${alexHablo ? "Irene no dice nada. Irene, que siempre dice algo cuando Álex cuenta cosas. Le mira contar. Traga." : "Irene no dice nada. Traga, con la mano en el cuello, como se traga algo que no baja."}${nc === "irene" ? " Tú la viste girarse hacia el hueco de la trampilla y decir «¿qué?» a nadie. Y no vas a decirlo tú. Es suyo." : ""}` : nc === "irene" && inv === "peligro" ? `
Irene mira a Álex contar. Y de vez en cuando se mira la mano derecha, la que tiene metida en la manga. Como quien busca algo que se le ha caído.` : "";

      // 5. Marcos. El almacén (tramo 1 solo, o tramo 2 con Álex: si Álex ya lo ha contado, Marcos no repite) y el grifo (arriba con Irene)
      let marcos = "";
      const marcosAlmacen = api.bandera("v_marcos_libre") || q === "alex_marcos";
      if (marcosAlmacen && !(q === "alex_marcos" && api.bandera("alex_cuenta"))) {
        marcos = api.bandera("marcos_cuenta_puerta") ? `
Marcos: Había un diferencial saltado. Lo he subido. Por eso la luz.

Nora: ¿Y?

Marcos: Y hay una puerta detrás de la estantería del almacén.

Silencio.

Marcos: La pared es de piedra. La única de toda la casa. ${api.bandera("marcos_movio_estanteria") ? "La he apartado. Es una puerta baja, de madera, con hierro. Con un candado que no abre nadie." : "Sale aire por debajo. Frío."}

Álex: ¡Lo dije! ¡Debajo de la casa!

Marcos: Es un sótano. Todas estas casas tienen sótano.

Álex: Todas estas casas tienen sótano tapiado con una estantería, sí.

${api.bandera("marcos_cuenta_arrastre") ? `Marcos: Y he oído algo. Detrás.

Álex: ¿Qué?

Marcos: Un arrastre. Una vez.

Álex abre la boca para el chiste. La cierra. Marcos no cuenta cosas. Marcos las explica. Y no está explicando.

${api.bandera("cree_marcos_nora") ? "Le crees. Le crees porque es Marcos y porque no ha dicho «un tejón»." : "Nora: Un animal.\n\nMarcos: Sí. Un animal.\n\nLo dice para ti. No para él."}` : ""}` : `
Marcos: Un diferencial saltado. Lo he subido. Ya está.

Nora: ¿Ya está?

Marcos: Ya está.

Y coge una cerveza. Y tú sabes, porque le conoces desde marzo, que cuando Marcos dice «ya está» dos veces es que no.`;
      }
      if (ic === "marcos" && api.bandera("marcos_cuenta_grifo")) {
        marcos += `
Marcos: ¿Has dejado el grifo abierto arriba?

Irene: No he tocado ningún grifo.

Marcos: Se oía. Desde el pasillo.

Irene: Estaba seco. El lavabo.

Se miran. Y en esa mirada hay algo que no sabes leer, y tú lees bien.`;
      }

      // 6. Nora y la muñeca
      const nora = api.bandera("nora_toma_muneca") ? `
Sacas la muñeca de la mochila. La pones en la mesa. Al lado de la tabla.

Álex: Hostia. ¿De dónde has sacado eso?

Nora: De la buhardilla.

Álex: ¿Y la has bajado?

Nora: Hay huellas. En el polvo. De pies descalzos. Pequeños. Van hasta la pared y no vuelven.

Irene no mira la muñeca. Mira la escalera.

Marcos la coge. Le da la vuelta. Le toca el pecho con el pulgar.

Marcos: Tiene algo dentro.

${api.bandera("nora_abre_muneca") ? "Nora: Una campanilla. Sin badajo.\n\nÁlex deja de sonreír. Nadie dice nada de la historia. No hace falta." : "Nadie la abre. Marcos la deja donde estaba. Con los ojos cosidos hacia arriba."}

${nc === "marcos" ? "Marcos: Las he visto.\n\nÁlex: ¿Y?\n\nMarcos: Y no sé qué son. No eran ratas.\n\nLo dice a la mesa. Para que conste. Marcos, que no cree en nada, acaba de decir «no sé» delante de Álex. Por ti. Le buscas la mano por debajo de la mesa. Está." : nc === "irene" ? (api.bandera("nora_irene_dijo") === "juntas" || api.bandera("irene_cuenta") ? "Irene: Yo también las he visto.\n\nÁlex: ¿Tú?\n\nIrene: Yo. Tenían dedos." + (api.bandera("cuerda_desaparece") ? " Y la cuerda de la trampilla ha desaparecido con las dos delante." : "") + "\n\nÁlex se calla. Marcos mira a Irene como se mira a un testigo que no esperabas. Dos. Sois dos. Por primera vez esta noche, dos." : inv === "peligro" ? "Irene no dice nada. Mira la muñeca con los ojos cosidos hacia arriba, y por un momento la cara de Irene es la cara de alguien que ya la había visto antes. Antes de esta noche." : "Irene no dice nada. Irene estaba allí y no dice nada. Se mira las uñas. Tú la miras a ella, y ella lo sabe, y no levanta la vista.") : ""}` : api.bandera("nora_cuenta_huellas") ? `
Nora: Hay huellas en la buhardilla. En el polvo. De pies descalzos. Pequeños. Van hasta la pared y no vuelven. Y una viga quemada con siete marcas.

Álex: Siete.

Nora: Siete.

Álex no sonríe. Es la primera vez que le dices algo de su historia y no sonríe.

${nc === "marcos" ? "Marcos: Las he visto. No eran ratas.\n\nLo dice a la mesa. Para que conste. Marcos, que no cree en nada, diciendo «no eran ratas» delante de Álex. Por ti." : nc === "irene" && (api.bandera("nora_irene_dijo") === "juntas" || api.bandera("irene_cuenta")) ? "Irene: Yo las he visto. Con ella." + (api.bandera("cuerda_desaparece") ? " Y la cuerda ha desaparecido con las dos delante." : "") + "\n\nÁlex la mira como se mira a alguien que ha cambiado de bando. Marcos no dice ratas. Marcos, con dos testigos, no dice nada." : api.bandera("cree_nora_marcos") ? "Marcos te mira. Asiente. No dice ratas. Te pone la mano en la rodilla por debajo de la mesa, que es su manera de decir «te creo» sin que Álex lo oiga." : "Marcos: Ratas.\n\nLo dice suave. Sin reírse. Como quien ofrece una salida, no como quien la cierra.\n\nNora: Tenían dedos.\n\nMarcos: Vale.\n\nY te deja la palabra. No insiste. Marcos no insiste contigo." + (nc === "irene" ? "\n\nIrene no dice nada. Irene estaba allí. Se mira las uñas." : "")}` : `
No cuentas nada. Abres el cuaderno. Escribes.

Álex: ¿Qué apuntas?

Nora: La hora.

No es la hora.`;

      // 7. Las marcas
      const marcas = [];
      if (api.hayEvidencia("marca_brazo_irene")) marcas.push(`
Irene se sube la manga para coger el vaso. Cuatro marcas rojas. En el brazo, encima del codo. Como cuatro dedos.

Nora: ¿Qué te ha pasado en el brazo?

Irene: Nada.

Se baja la manga. Mira a Marcos. Marcos mira la mesa.`);
      if (api.hayEvidencia("quemadura_marcos")) marcas.push(`
Marcos tiene el dorso de la mano derecha rojo. Brillante. Con la piel tirante.

Nora: ¿Y la mano?

Marcos: El agua.

Irene: ¿Qué agua?

Marcos la mira.

Irene: ¿Qué agua, Marcos?

Y no lo está haciendo. No es la voz de nada. Irene no se acuerda del agua. Se le ve no acordarse.`);
      if (api.hayEvidencia("marca_tobillo_nora")) marcas.push(`
Te miras el tobillo por debajo de la mesa. Cuatro marcas. Rojas. Donde estaban sus dedos. Te bajas el pantalón hasta el zapato.

${api.bandera("nora_confronta_marcos") ? "Se lo has preguntado en la escalera. «¿Qué me has dicho?» Y te ha mirado como si le hablaras en otro idioma. «Nada. ¿Qué te iba a decir?» Y era verdad. Se le veía que era verdad." : "No se lo has preguntado. No sabes cómo se pregunta eso."}`);
      if (api.hayEvidencia("marca_muneca_nora")) marcas.push(`
Te miras la muñeca por debajo de la mesa. Cuatro marcas. Rojas. Donde estaban los dedos de Irene. Te bajas la manga de la camisa hasta los nudillos, como lleva ella la suya.

${api.bandera("nora_irene_dijo") === "mano" ? "Se lo has dicho arriba. «Irene. La mano.» Y se ha mirado la mano como si fuera de otra. Y era verdad. Se le veía que era verdad." : "No se lo has dicho. No sabes cómo se dice eso. Y menos a Irene."}`);
      if (api.bandera("alex_cruzo") || api.bandera("marcos_cruzo")) marcas.push(api.bandera("alex_cruzo") ? `
Álex tiene las zapatillas mojadas. Las dos. Hasta el cordón. Nadie le pregunta por qué. Él tampoco lo cuenta. Y cada poco mira la puerta, como se mira una puerta por la que va a entrar alguien.` : `
Marcos tiene las zapatillas mojadas. Hasta el cordón. Y no lo explica. Marcos, que lo explica todo. Y cada poco mira la puerta.`);

      // 8. La huésped desde fuera
      const huesped = h === "marcos" ? `
Marcos se ha sentado y no ha hecho ningún chiste. Ni uno. Ni de la puerta, ni de Álex, ni de lo que hay en la mesa. Marcos hace chistes cuando tiene miedo. Si no hace chistes, es otra cosa.` : `
Irene mira a Álex contar y no le lee. Se le nota: Irene siempre va un segundo por delante de lo que dice Álex, con la cara ya puesta. Ahora va un segundo por detrás. Como si tuviera que traducir.`;

      return `${vuelta}
${llegan.join("\n")}
${alex}
${irene}
${marcos}
${nora}
${marcas.join("\n")}
${huesped}

Escribes. Debajo de ALDA y de AJOBA:

04:00. ${q === "irene_alex" && api.bandera("irene_paro_alex") && api.bandera("alex_gusto") !== true ? "Álex: nada. Y el cuello." : api.bandera("alex_oyo_irene_fuera") && api.bandera("alex_cuenta") ? "Álex: Irene en los árboles." + (q === "irene_alex" ? " El armario." : q === "alex_marcos" ? " Una puerta con candado." : "") : q === "irene_alex" && api.bandera("alex_cuenta") ? "Álex: el armario." : q === "alex_marcos" && api.bandera("alex_cuenta") ? "Álex: una puerta con candado." : "Álex: nada."} ${api.bandera("irene_cuenta") && api.sabe("irene", "oi_alex_puerta") ? "Irene: Álex en la puerta." : api.bandera("irene_cuenta") && api.bandera("irene_vio_sombra") ? "Irene: alguien en el armario." : api.bandera("irene_cuenta") && nc === "irene" ? "Irene: lo mismo que yo." : "Irene: nada."} ${marcosAlmacen ? (api.bandera("marcos_cuenta_puerta") ? "Marcos: una puerta." : "Marcos: el diferencial. Y algo que no cuenta.") : ic === "marcos" && api.bandera("marcos_cuenta_grifo") ? "Marcos: el grifo." : "Marcos: nada."} Yo: ${[api.bandera("nora_vio_gente") ? "gente entre los árboles" : null, "huellas", "siete marcas", api.bandera("cuerda_desaparece") ? "la cuerda" : null, nc === "irene" ? "Irene lo vio" : null].filter(Boolean).map((s, i) => i ? s.charAt(0).toUpperCase() + s.slice(1) : s).join(". ")}.

${modo(api, "nora", {
  lucido: "~ Cuatro versiones. Ninguna se toca con las otras. Cada uno ha visto lo suyo en su sitio y ninguno puede demostrar nada a nadie. Es como si esta casa supiera repartir.",
  asustado: "~ Nos ha separado. Veinte minutos. Y en veinte minutos a cada uno le ha pasado una cosa distinta y ninguno estaba con los demás para verla.",
  tenso: "~ Y ahora cada uno se va a creer lo suyo y a reírse de lo de los demás. Y yo apunto. Y nadie lee lo que apunto.",
  ido: "~ Cuatro cosas. Cuatro sitios. Como cuatro dedos en un vaso. Y el vaso se ha movido.",
  perdido: "~ Nos ha probado a cada uno por separado. Para ver por dónde entra cada uno. Ya lo sabe.",
  normal: "~ Hace veinte minutos sabía dónde estaba cada uno. Ahora sé dónde dice cada uno que estaba.",
})}

La tabla sigue en la mesa. Las velas, a medio consumir. ${api.bandera("nora_toma_muneca") ? "Y la muñeca, con los ojos cosidos hacia arriba. " : ""}La música, baja, que nadie ha vuelto a quitar.

Y arriba, en el techo, justo encima de la mesa, en la buhardilla que acabas de cerrar, algo que todavía no ha empezado a andar.

...`;
    },
    opciones: [{ texto: "Continuar", a: "vi1_pasos" }],
  },

  });
})();
