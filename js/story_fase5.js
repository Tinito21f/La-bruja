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
 *   - Nora → decide: el porche con Álex, la buhardilla sola, o la buhardilla con Marcos.
 * Dos cartas (máximo dos rutas jugadas): el grupo de Nora y el grupo de la huésped.
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
  const noraCon = (api) => api.bandera("v_nora_con");     // "alex" | "marcos" | null
  const ireneCon = (api) => api.bandera("v_irene_con");   // "marcos" | null
  const camisa = (api) => api.bandera("juego") === "poker" ? "la camisa de cuadros de Marcos" : "la camisa de Marcos";

  Object.assign(HISTORIA.presupuestoAnomalias, { V: 4 });
  Object.assign(HISTORIA.deriva, { V: { estres: 0.4 } });

  const saltoPrevio = HISTORIA.prepararSalto;
  HISTORIA.prepararSalto = (api, id) => {
    if (typeof saltoPrevio === "function") saltoPrevio(api, id);
    if (!/^v[abmp]?\d/.test(id)) return;
    api.fase("V"); api.horror(2);
    if (!api.bandera("huesped")) { api.marcar("huesped", "marcos"); api.marcar("marcos_accion", "rescate"); api.marcar("contacto", true); }
    if (api.bandera("v_nora_con") === undefined) api.marcar("v_nora_con", /^vp/.test(id) ? "alex" : /^vb/.test(id) && id !== "vb1_trampilla" ? "marcos" : null);
    if (api.bandera("v_irene_con") === undefined) api.marcar("v_irene_con", /^va/.test(id) ? "marcos" : null);
    if (api.bandera("v_marcos_libre") === undefined) api.marcar("v_marcos_libre", !api.bandera("v_irene_con") && api.bandera("v_nora_con") !== "marcos");
    if (!api.bandera("v1_nora")) api.marcar("v1_nora", api.bandera("v_nora_con") || "sola");
    if (/^v9/.test(id)) ["porche", "arriba", "almacen", "buhardilla"].forEach((r) => resolverRuta(api, r, false));
  };

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
    const cargado = api.valor("irene", "estres") >= 50 || api.valor("irene", "miedo") >= 45
      || api.relv("irene", "marcos", "tension") >= 50 || api.relv("irene", "marcos", "resentimiento") >= 15;
    api.marcar("huesped_lapso", true);
    api.marcar("huesped_quemo", cargado);
    if (!cargado) return;
    api.evidencia("quemadura_marcos", "marcos", "mano de Marcos", "marca");
    api.saber("marcos", "irene_me_quemo");
    api.rel("marcos", "irene", "confianza", -14); api.est("marcos", "miedo", 8); api.est("marcos", "eje", -6);
    api.est("irene", "estres", 6);
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
      const v = api.anomalia("voz_fuera");
      api.marcar("alex_oyo_irene_fuera", v);
      if (v) { api.saber("alex", "oi_irene_fuera"); api.presenciar("alex", 1.5); }
      if (noraCon(api) === "alex") {
        const g = api.anomalia("gente_arboles");
        api.marcar("nora_vio_gente", g);
        if (g) { api.saber("nora", "gente_arboles"); api.presenciar("nora", 2); }
        api.rel("alex", "nora", "tension", 3);
      }
      if (!seguida) {
        api.marcar("alex_quiso_cruzar", api.valor("alex", "eje") >= 70);
        api.marcar("alex_llamo_marcos", noraCon(api) !== "alex" && api.valor("alex", "eje") >= 75);   // grita hacia la casa: lo oye quien esté dentro
        if (noraCon(api) === "alex") { api.marcar("nora_porro", api.valor("nora", "estres") < 60); if (api.bandera("nora_porro")) api.consumir("nora", "porro"); api.marcar("nora_cuenta_gente", false); }
        api.marcar("alex_cuenta", true);           // Álex lo cuenta todo. Siempre.
      }
    }

    if (ruta === "arriba") {
      api.marcar("armario_golpe", true); api.saber("irene", "golpe_armario");
      const v = api.anomalia("voz_alex_puerta");
      api.marcar("irene_oyo_alex_puerta", v);
      if (v) { api.saber("irene", "oi_alex_puerta"); api.presenciar("irene", 1.5); }
      if (ireneCon(api) === "marcos") {
        api.saber("marcos", "grifo_corria"); api.presenciar("marcos", 0.8);
        if (h === "marcos") danoMarcosA(api, "irene"); else danoIreneAMarcos(api);
      } else if (h === "irene") {
        api.marcar("irene_espejo", true); api.est("irene", "estres", 4);
      }
      if (!seguida) {
        api.marcar("irene_abre_armario", api.lucido("irene"));
        api.marcar("irene_cuenta", api.valor("irene", "miedo") >= 55);   // Irene no cuenta. Salvo que no pueda más.
        if (ireneCon(api) === "marcos") api.marcar("marcos_cuenta_grifo", true);
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
      } else if (t) {
        api.marcar("cuerda_desaparece", true); api.saber("nora", "cuerda_desaparecio");
      }
      if (!seguida) {
        api.marcar("nora_toma_muneca", api.valor("nora", "eje") >= 55);
        if (api.bandera("nora_toma_muneca")) api.evidencia("muneca_buhardilla", "nora", "buhardilla", "objeto");
        api.marcar("nora_cuenta_huellas", api.valor("nora", "eje") >= 60 || api.valor("nora", "miedo") >= 50);
      }
    }
  }

  // ---------- Reparto: quién va con quién. Esencia y estados. ----------
  function repartir(api) {
    const h = H(api);
    const e = api.bandera("v1_nora");
    let noraC = null, ireneC = null, libre = true;
    if (e === "alex") noraC = "alex";
    if (e === "marcos") {
      // Marcos sube con Nora salvo que ella le haya dejado helado con el beso y él lo lleve mal
      const rechaza = api.bandera("nora_reaccion_beso") === "marcos" && api.relv("marcos", "nora", "afecto") < 60;
      api.marcar("v_marcos_rechaza", rechaza);
      if (!rechaza) { noraC = "marcos"; libre = false; }
    }
    const pide = h !== "irene" && libre && (api.bandera("voz_desertor") || api.valor("irene", "miedo") >= 45 || api.relv("irene", "marcos", "tension") >= 50);
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
    api.marcar("v_nora_con", noraC);
    api.marcar("v_irene_con", ireneC);
    api.marcar("v_marcos_libre", libre);
    api.marcar("v_irene_callada", h === "irene");
  }

  // Segunda carta: el grupo de la huésped. Si la huésped va con Nora, el grupo de Irene.
  function carta2(api) {
    const h = H(api), nc = noraCon(api), ic = ireneCon(api);
    if (h === "marcos" && nc !== "marcos" && ic !== "marcos") return { id: "marcos", ruta: "almacen", a: "vm1_cocina", desc: "La cocina. El cuadro de luces. El almacén." };
    // La huésped sube con Nora: la otra carta es Irene si oyó su nombre; si no, Álex y el porche.
    if (h === "marcos" && nc === "marcos" && !api.bandera("voz_desertor")) return { id: "alex", ruta: "porche", a: "vp1_porche", desc: "El porche. El porro, el coche de Marcos, los árboles." };
    if (ic === "marcos") return { id: h === "marcos" ? "irene" : "marcos", ruta: "arriba", a: "va1_pasillo", desc: h === "marcos" ? "Arriba con Marcos. La sudadera, el baño. Y él, que no dice nada." : "Arriba con Irene. La sudadera, el baño. Y ella, que va delante sin girarse." };
    return { id: "irene", ruta: "arriba", a: "va1_pasillo", desc: "Arriba. La sudadera, el baño. Sola." };
  }
  function elegirRuta(api, r) {
    api.marcar("v_ruta", r);
    ["porche", "arriba", "almacen", "buhardilla"].filter((x) => x !== r).forEach((x) => resolverRuta(api, x, false));
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

La casa se está vaciando. Lo notas: cada uno tira hacia un sitio, como el agua cuando quitas el tapón. Arriba, la cocina, la puerta. Y tú en medio, con el cuaderno cerrado bajo la mano y dos palabras dentro.

Y la cuerda. La cuerda de la trampilla, que alguien vio balancearse esta noche. Que quieres mirar desde hace una hora.

${modo(api, "nora", {
  lucido: "~ Tres sitios. El porche con Álex, que es el más seguro y el más incómodo. Arriba sola, que es lo que quiero. Arriba con Marcos, que es donde mejor estoy. Cada uno cuesta algo.",
  asustado: "~ No quiero quedarme sola en esta mesa con la tabla abierta. Y no quiero subir sola. Y no quiero salir. Quiero que no se vayan.",
  tenso: `~ ${api.bandera("nora_reaccion_beso") === "marcos" || api.bandera("nora_reaccion_beso") === "silencio" ? "Marcos a la cocina. Sin mirarme. Después de lo de antes. Pues muy bien." : "Cada uno a su sitio. Como si no hubiera pasado nada. Como si Alda fuera un chiste."}`,
  ido: "~ El humo de Álex sube recto. No hay corriente. Y la cuerda de arriba se movía. Sin corriente. Tengo que verla.",
  perdido: "~ Se van. Se van todos y me dejan con ella. Ella se queda en la mesa. Ella no se levanta nunca.",
  normal: "~ Álex con un porro y una puerta abierta. Marcos con un cuadro de luces. Y arriba, una cuerda. Elige, Nora.",
})}`;
    },
    opciones: [
      { texto: "Salir con Álex. Al porche. Al frío. Al porro.", a: "v2_reparto",
        efecto: (api) => { api.marcar("v1_nora", "alex"); api.rel("alex", "nora", "tension", 3); if (api.bandera("nora_reaccion_beso") === "marcos") api.rel("marcos", "nora", "resentimiento", 3); } },
      { texto: "Subir. Sola. A mirar la cuerda de la trampilla.", a: "v2_reparto",
        efecto: (api) => { api.marcar("v1_nora", "sola"); api.est("nora", "eje", 3); } },
      { texto: "«Marcos. Ven conmigo arriba.»", a: "v2_reparto", si: (api) => api.relv("nora", "marcos", "confianza") >= 45 || api.valor("nora", "miedo") >= 50,
        efecto: (api) => { api.marcar("v1_nora", "marcos"); api.rel("marcos", "nora", "proteccion", 3); } },
    ],
  },

  v2_reparto: {
    pov: null,
    fondo: "assets/fondos/salon_vacio.jpg",
    musica: null,
    titulo: "La dispersión · Cada uno a su sitio",
    hora: "03:33",
    alEntrar: (api) => repartir(api),
    texto: (api) => {
      const h = H(api);
      const nc = noraCon(api), ic = ireneCon(api);
      const nora = nc === "alex" ? `
Nora coge el mechero de la mesa y sale detrás de Álex. La puerta se queda entreabierta. El frío entra hasta la tabla.` : nc === "marcos" ? `
Nora: Marcos. Ven conmigo arriba.

Marcos se para a medio camino de la cocina. La mira.

Marcos: ¿Arriba?

Nora: Quiero ver una cosa.

Marcos: Vale.

No pregunta qué cosa. Va con ella. El cuadro de luces se queda para luego.` : api.bandera("v_marcos_rechaza") ? `
Nora: Marcos. Ven conmigo arriba.

Marcos se para a medio camino de la cocina. No la mira.

Marcos: Sube tú. Yo voy a mirar la luz.

Lo dice sin maldad. Lo dice como se dice algo que no se quiere decir con maldad. Nora sube sola. El tercero. El séptimo.` : `
Nora se levanta con el cuaderno. Mira la escalera.

Nora: Voy a mirar una cosa arriba.

Nadie pregunta qué cosa. Sube. El tercero. El séptimo.`;
      const irene = api.bandera("v_irene_callada") ? (api.bandera("v_marcos_sigue_irene") ? `
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
      const alex = nc === "alex" ? "" : `
Álex ya está fuera. Se ve la brasa a través del cristal. Y el coche de Marcos, un bulto, veinte metros más allá.`;

      const grupoNora = nc === "alex" ? "El porche, con Álex y Nora." : nc === "marcos" ? "La buhardilla, con Nora y Marcos." : "La buhardilla, con Nora.";
      const c2 = carta2(api);
      const grupoOtro = c2.ruta === "almacen" ? "La cocina y el almacén, con Marcos." : c2.ruta === "porche" ? "El porche, con Álex." : ic === "marcos" ? "Arriba, con Irene y Marcos." : "Arriba, con Irene.";

      return `${alex}
${irene}
${nora}
${marcos}

Y la casa se reparte. Cuatro personas en cuatro sitios, o en tres, y ninguno ve a los demás. Hace veinte minutos sabíais dónde estaba cada uno. Ahora no.

${grupoNora} ${grupoOtro}

¿Qué quieres ver?`;
    },
    personajes: [
      {
        id: "nora",
        descripcion: (api) => noraCon(api) === "alex" ? "El porche. El porro, el frío, el coche de Marcos a veinte metros." : noraCon(api) === "marcos" ? "La cuerda. La trampilla. Marcos detrás." : "La cuerda. La trampilla. Sola.",
        a: (api) => noraCon(api) === "alex" ? "vp1_porche" : "vb1_trampilla",
        efecto: (api) => elegirRuta(api, noraCon(api) === "alex" ? "porche" : "buhardilla"),
      },
      // El grupo de la huésped. Si van dos, la cara de la carta es quien mira desde fuera.
      {
        id: "marcos", si: (api) => carta2(api).id === "marcos",
        descripcion: (api) => carta2(api).desc, a: (api) => carta2(api).a,
        efecto: (api) => elegirRuta(api, carta2(api).ruta),
      },
      {
        id: "irene", si: (api) => carta2(api).id === "irene",
        descripcion: (api) => carta2(api).desc, a: (api) => carta2(api).a,
        efecto: (api) => elegirRuta(api, carta2(api).ruta),
      },
      {
        id: "alex", si: (api) => carta2(api).id === "alex",
        descripcion: (api) => carta2(api).desc, a: (api) => carta2(api).a,
        efecto: (api) => elegirRuta(api, carta2(api).ruta),
      },
    ],
  },

  // =====================================================================
  // RUTA PORCHE — Álex, o Álex y Nora
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

Y dentro de la casa, arriba, un golpe seco. Madera contra madera. Como una puerta grande cerrándose en el techo. Nora, seguramente, con su cuerda. Le dijiste que ahí arriba estaban los cadáveres.`;

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

${modo(api, "nora", {
  lucido: "~ Está tanteando. Como siempre. Y lo hace justo ahora, con Marcos dentro y después de lo de Irene. Álex no improvisa tanto como parece.",
  asustado: "~ La madera. Ha dicho la madera. Se ha quedado mirando la mano como si no fuera suya.",
  tenso: "~ «Y tú no eres una lámpara.» Álex. Cómo le gusta meter el dedo donde no hay herida.",
  ido: "~ Las polillas dan vueltas siempre en el mismo sentido. Nunca al revés. Nunca.",
  perdido: "~ Ha salido con nosotros. Está aquí fuera. Detrás de la luz, donde no llega.",
  normal: "~ Un porro y un piropo. Es Álex. Hasta aquí fuera es Álex.",
})}

Y entonces, a veinte metros, dentro del coche de Marcos, se enciende la luz.`;

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
      // Nora
      { texto: "Fumar. Y no contestar a lo de la lámpara.", a: "vp2_coche", si: (api) => noraCon(api) === "alex",
        efecto: (api) => { api.marcar("nora_porro", true); api.consumir("nora", "porro"); api.est("nora", "estres", -3); } },
      { texto: "«No fumo.» Devolvérselo. Quedarte igual.", a: "vp2_coche", si: (api) => noraCon(api) === "alex",
        efecto: (api) => { api.marcar("nora_porro", false); api.est("nora", "lucidez", 1); } },
      { texto: "«Álex. Marcos es tu amigo.» Y fumar de todas formas.", a: "vp2_coche", si: (api) => noraCon(api) === "alex",
        efecto: (api) => { api.marcar("nora_porro", true); api.consumir("nora", "porro"); api.rel("alex", "nora", "tension", -3); api.rel("nora", "alex", "resentimiento", -2); api.est("nora", "eje", 1); } },
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
    pov: (api) => noraCon(api) === "alex" ? "nora" : "alex",
    titulo: "El porche · La luz del coche",
    texto: (api) => {
      const pareja = noraCon(api) === "alex";
      const voz = api.bandera("alex_oyo_irene_fuera");
      const gente = api.bandera("nora_vio_gente");

      if (pareja) return `
${api.bandera("nora_porro") ? "Das una calada. Baja. Se queda." : "Le devuelves el porro. Álex lo coge sin mirarlo."}

La luz de dentro del coche. Amarilla, débil, la de encima del retrovisor. Encendida. Se ve el volante, los asientos, nadie.

Álex: ¿Has visto?

Nora: Sí.

Álex: Se enciende cuando abres una puerta.

Nora: Nadie ha abierto una puerta.

Álex: Ya.

Las puertas cerradas. Lo cerró Marcos al llegar: le viste hacerlo, con el mando, dos veces, porque es Marcos.

Álex baja el primer escalón. El segundo.

Álex: Voy a mirar.

${modo(api, "nora", {
  lucido: "~ Batería. Un contacto. El frío. Un coche viejo hace eso. Y Álex va a bajar a mirarlo porque no bajar sería tener miedo, y Álex prefiere cualquier cosa a eso.",
  asustado: "~ No. No bajes. No salgas de la luz. Aquí hay luz y allí no hay luz y en medio hay veinte metros de nada.",
  tenso: "~ Que baje. Que baje y que mire y que vuelva y que se calle.",
  ido: "~ La luz del coche parpadea. No. Es fija. Soy yo, que parpadeo.",
  perdido: "~ Hay alguien sentado. Detrás. En el asiento de atrás. No se ve porque no quiere.",
  normal: "~ Álex. Álex, no.",
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
      // Nora: qué hace con Álex bajando
      { texto: "«Álex. No.»", a: "vp3_arboles", si: (api) => noraCon(api) === "alex",
        efecto: (api) => { api.marcar("nora_coche", "no"); api.rel("alex", "nora", "afecto", 2); } },
      { texto: "Bajar con él. Que no vaya solo.", a: "vp3_arboles", si: (api) => noraCon(api) === "alex",
        efecto: (api) => { api.marcar("nora_coche", "baja"); api.est("nora", "miedo", 3); api.rel("alex", "nora", "afecto", 4); } },
      { texto: "Quedarte en la luz. Mirar los árboles, no el coche.", a: "vp3_arboles", si: (api) => noraCon(api) === "alex",
        efecto: (api) => { api.marcar("nora_coche", "arboles"); api.est("nora", "lucidez", 1); } },
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
        const nc = api.bandera("nora_coche");
        const inicio = nc === "no" ? `
Nora: Álex. No.

Se para. Con un pie en el último escalón y el otro en el aire.

Álex: ¿No qué?

Nora: No.

No sabes decir no qué. Él tampoco lo pregunta dos veces.` : nc === "baja" ? `
Bajas detrás de él. El primer escalón cruje. El segundo no. La grava, a un paso, brilla mojada bajo la luz del porche y luego no brilla, porque la luz se acaba.

Álex se para en el último escalón. Tú detrás. Tan cerca que le hueles la camisa.` : `
Te quedas donde estás. En la luz. Álex baja el último escalón. Y tú no miras el coche. Miras los pinos. La línea negra donde se acaba la grava.`;
        return `${inicio}

${voz ? `Y Álex gira la cabeza. A la izquierda. Hacia los árboles.

Álex: ¿Irene?

Lo dice a los pinos. No a la casa. A los pinos, donde no hay nadie.

Nora: Irene está arriba.

Álex: Ya.

No se mueve. Sigue mirando los árboles. Como quien espera que le vuelvan a llamar.` : `Álex se queda en el último escalón. Mirando el coche. Sin bajar a la grava. Y no sabes por qué no baja, y él tampoco.`}

${gente ? `Y entre los troncos, a la izquierda, donde Álex mira, hay gente.

De pie. Quietos. Seis, siete, no sabes. Con la ropa oscura y las caras hacia la casa. No hacia vosotros. Hacia la casa. Como quien mira un fuego.

Y huele a humo. No al de Álex. A leña. A algo más: a pelo.

Un segundo.

Y son troncos. Pinos. Los de siempre. Y el humo es el porro, que Álex tiene en la mano.

~ Gente. Había gente. No. Había troncos y una luz mala y yo llevo ocho horas despierta.

~ Pero olía a pelo.` : `Los pinos. Solo pinos. Miras la línea negra tanto rato que empieza a moverse, como se mueve cualquier cosa que miras demasiado. Apartas la vista.`}

La luz del coche se apaga. Sin más. Como se encendió.

Álex sube los dos escalones de espaldas. Sin dejar de mirar los árboles.

Álex: Vamos dentro.

${modo(api, "nora", {
  lucido: `~ ${gente ? "Un segundo. Siete personas en un segundo, con la luz del porche y una calada. Lo sé. Lo sé y no me sirve." : "Ha oído algo. Álex no dice «Irene» a los árboles por hacer gracia. No con esa voz."}`,
  asustado: `~ ${gente ? "Estaban mirando la casa. Mirando la casa como se mira un fuego. Y olía a fuego." : "Ha dicho Irene. A los árboles. E Irene está dentro."}`,
  tenso: "~ Dentro. Con Marcos. Esto se lo cuento a él, no a Álex.",
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

Miras el coche. La luz sigue encendida. Nadie dentro. Ni delante ni detrás.`}

La luz del coche se apaga. Sin más. Como se encendió.

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
      // Nora: contarlo o no
      { texto: "«¿Has visto eso?» A Álex. Ya en la puerta.", a: "v9_regreso", si: (api) => noraCon(api) === "alex" && api.bandera("nora_vio_gente"),
        efecto: (api) => { api.marcar("nora_cuenta_gente", true); api.rel("alex", "nora", "confianza", 4); } },
      { texto: "No decir nada. Entrar.", a: "v9_regreso", si: (api) => noraCon(api) === "alex",
        efecto: (api) => { api.marcar("nora_cuenta_gente", false); api.est("nora", "estres", 3); } },
      { texto: "Sacar el móvil. Fotografiar los árboles. Antes de entrar.", a: "v9_regreso", lucida: true, si: (api) => noraCon(api) === "alex",
        efecto: (api) => { api.marcar("nora_cuenta_gente", false); api.evidencia("foto_arboles", "nora", "porche", "foto"); api.est("nora", "eje", 2); } },
      { texto: "Coger a Álex del brazo y tirar de él hacia dentro.", a: "v9_regreso", impulsiva: true, si: (api) => noraCon(api) === "alex",
        efecto: (api) => { api.marcar("nora_cuenta_gente", false); api.rel("alex", "nora", "afecto", 3); api.est("nora", "estres", 4); } },
      // Álex: siempre cuenta. La pregunta es cómo.
      { texto: "Entrar y contarlo. Todo. Con detalles. Con más detalles de los que hubo.", a: "v9_regreso", si: (api) => noraCon(api) !== "alex",
        efecto: (api) => { api.marcar("alex_cuenta", true); api.est("alex", "eje", 2); } },
      { texto: "Entrar y no decir nada. Por una vez.", a: "v9_regreso", si: (api) => noraCon(api) !== "alex",
        efecto: (api) => { api.marcar("alex_cuenta", false); api.est("alex", "eje", -3); api.est("alex", "estres", 4); } },
      { texto: "Entrar gritando «¡Irene!». A ver desde dónde contesta.", a: "v9_regreso", si: (api) => noraCon(api) !== "alex" && api.bandera("alex_oyo_irene_fuera"),
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

${noraCon(api) !== "alex" ? "Y desde el pasillo, un CLACK. Madera. La escalera plegable desplegándose con su traqueteo, el mismo de esta noche. La trampilla. Nora, que ha subido a mirar lo que quería mirar. No sales a verla. No quieres que te vea la cara.\n\n" : ""}El pasillo. La luz del baño, al fondo, encendida. La dejaste tú, antes, cuando subiste.

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

El pasillo. Vacío. La lámpara de llama falsa. La cuerda, quieta. Y por la ventana del pasillo, abajo, en el porche, la brasa. Álex. Fuera. A treinta metros. Fumando.

~ Estaba aquí. Pegado a la puerta. He oído hasta la respiración. Y está allí.

~ No. He oído el agua, que no era agua, y una voz, que no era una voz. Es lo que pasa en esta casa con las cosas: que no son.` : `Nada más. Ni voz ni agua. Solo tú y un baño seco y una vela gastada.

Y por la ventana del pasillo, cuando sales, abajo, en el porche, la brasa de Álex. Fumando. Lejos.`}

${modo(api, "irene", {
  lucido: "~ Un grifo que suena y no corre. Una voz que llama y no está. Dos cosas que no dejan huella. Es como si esta casa supiera exactamente qué es lo que no se puede demostrar.",
  asustado: "~ Ha dicho mi nombre. Otra vez. Es la tercera vez esta noche que alguien dice mi nombre y no es nadie.",
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

${noraCon(api) !== "alex" ? "A tu espalda, en mitad del pasillo, un CLACK. La trampilla. La escalera plegable bajando con su traqueteo. Nora. Ha subido a la buhardilla y no te has girado a mirarla. No te has girado.\n\n" : ""}

${api.bandera("irene_lee_marcos") ? "Te ha mirado en el dormitorio. Mucho rato. Como se mira a alguien que ha cambiado de peinado y no sabes qué. No te ha dicho nada." : "Dentro, el agua. Irene abre un grifo."}

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
      { texto: "Bajar. Y no contar nada. Nunca.", a: "v9_regreso", si: (api) => ireneCon(api) !== "marcos",
        efecto: (api) => { api.marcar("irene_cuenta", false); api.est("irene", "eje", 2); } },
      { texto: "Bajar y preguntarle a Álex si ha subido. Delante de todos.", a: "v9_regreso", si: (api) => ireneCon(api) !== "marcos",
        efecto: (api) => { api.marcar("irene_cuenta", true); api.est("irene", "estres", 3); } },
      { texto: "Grabar un audio. «Álex, si has sido tú, te mato.» Y mandárselo.", a: "v9_regreso", lucida: true, si: (api) => ireneCon(api) !== "marcos",
        efecto: (api) => { api.marcar("irene_cuenta", false); api.evidencia("audio_irene_bano", "irene", "baño de arriba", "audio"); api.est("irene", "lucidez", 1); } },
      // Marcos huésped
      { texto: "«Perdona.» Y bajar el primero. Rápido.", a: "v9_regreso", si: (api) => ireneCon(api) === "marcos" && H(api) === "marcos",
        efecto: (api) => { api.marcar("marcos_tras_lapso", "baja"); api.marcar("marcos_cuenta_grifo", false); api.est("marcos", "estres", 4); } },
      { texto: "«No he sido yo.» Decirlo. Y oírte decirlo.", a: "v9_regreso", si: (api) => ireneCon(api) === "marcos" && H(api) === "marcos",
        efecto: (api) => { api.marcar("marcos_tras_lapso", "niega"); api.marcar("marcos_cuenta_grifo", false); api.rel("irene", "marcos", "confianza", -4); api.est("irene", "miedo", 4); } },
      { texto: "Mirarte la mano. Un rato. Hasta que sea tuya.", a: "v9_regreso", lucida: true, si: (api) => ireneCon(api) === "marcos" && H(api) === "marcos",
        efecto: (api) => { api.marcar("marcos_tras_lapso", "mano"); api.marcar("marcos_cuenta_grifo", true); api.saber("marcos", "lapso"); api.est("marcos", "lucidez", 1); } },
      // Irene huésped
      { texto: "«Perdona.» Secarle la mano con la toalla. Con cuidado.", a: "v9_regreso", si: (api) => ireneCon(api) === "marcos" && H(api) === "irene",
        efecto: (api) => { api.marcar("irene_tras_lapso", "toalla"); api.marcar("irene_cuenta", false); api.rel("marcos", "irene", "afecto", 2); } },
      { texto: "«El agua sale rara.» Como si fuera lo único que ha pasado.", a: "v9_regreso", si: (api) => ireneCon(api) === "marcos" && H(api) === "irene",
        efecto: (api) => { api.marcar("irene_tras_lapso", "agua"); api.marcar("irene_cuenta", false); api.rel("marcos", "irene", "confianza", -4); api.est("irene", "eje", 2); } },
      { texto: "Mirarle. Ver si te ha reconocido.", a: "v9_regreso", lucida: true, si: (api) => ireneCon(api) === "marcos" && H(api) === "irene",
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
      const sarten = d11 === "foto" ? "La sartén de hierro sigue en el fuego. Le hiciste una foto hace tres horas, con el mando en cero y el reloj detrás, y te reíste de ti mismo mientras la hacías." : d11 === "comprobar" ? "La sartén de hierro sigue en el fuego. La tocaste hace tres horas. Estaba templada y decidiste que era el sol de la tarde en la ventana. A las doce de la noche." : "La sartén de hierro sigue en el fuego. Pasaste de ella hace tres horas. Ahora no pasas.";
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

Un cuarto de tres por tres. Suelo de piedra. Una estantería de madera al fondo, con tarros vacíos, una garrafa, cuerda, una caja de herramientas de alguien que ya no vive aquí. Y a la izquierda, la caja gris. El cuadro.

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
  ido: `~ ${arrastre ? "Se ha movido un palmo. Como yo. Como cuando me muevo en la cama para no despertar a Nora." : "El aire de la rendija huele a dulce y a tierra. Huele a lo que olía la buhardilla, dijo Irene. Yo no he subido nunca a la buhardilla."}`,
  perdido: `~ ${huesped ? "Abajo. Es donde hay que ir. Es donde está. Ajoba. Abajo. Lo dijo en la mesa y no lo entendí." : "Hay una habitación debajo. Con cunas. Lo contó Álex. Lo contó porque es verdad."}`,
  normal: "~ Una puerta tapada. Una rendija. Un ruido. Y ahora, la decisión de siempre: mirar o contarlo.",
})}`;
    },
    opciones: [
      { texto: "Mover la estantería. A ver qué hay.", a: "v9_regreso",
        efecto: (api) => { api.marcar("marcos_movio_estanteria", true); api.saber("marcos", "puerta_vista"); api.marcar("marcos_cuenta_puerta", true); api.marcar("marcos_cuenta_arrastre", false); api.presenciar("marcos", 1); } },
      { texto: "Foto al cuadro y a la rendija. Y fuera.", a: "v9_regreso", lucida: true,
        efecto: (api) => { api.marcar("marcos_movio_estanteria", false); api.evidencia("foto_cuadro", "marcos", "almacén", "foto"); api.marcar("marcos_cuenta_puerta", true); api.marcar("marcos_cuenta_arrastre", false); api.est("marcos", "lucidez", 1); } },
      { texto: "Cerrar. Salir. Contar lo del diferencial y nada más.", a: "v9_regreso",
        efecto: (api) => { api.marcar("marcos_movio_estanteria", false); api.marcar("marcos_cuenta_puerta", false); api.marcar("marcos_cuenta_arrastre", false); api.est("marcos", "eje", 2); api.est("marcos", "estres", 3); } },
      { texto: "Salir y contarlo todo. También lo que has oído. Aunque suene a Álex.", a: "v9_regreso", lucida: true, si: (api) => api.bandera("arrastre_almacen"),
        efecto: (api) => { api.marcar("marcos_movio_estanteria", false); api.marcar("marcos_cuenta_puerta", true); api.marcar("marcos_cuenta_arrastre", true); api.est("marcos", "eje", -2); } },
      { texto: "Quedarte. Un minuto. Con la mano en el estante. Sin saber por qué.", a: "v9_regreso", si: (api) => H(api) === "marcos",
        efecto: (api) => { api.marcar("marcos_movio_estanteria", true); api.marcar("marcos_se_quedo", true); api.saber("marcos", "puerta_vista"); api.marcar("marcos_cuenta_puerta", false); api.marcar("marcos_cuenta_arrastre", false); api.est("marcos", "estres", 6); api.est("marcos", "lucidez", -2); } },
    ],
  },

  // =====================================================================
  // RUTA BUHARDILLA — Nora, o Nora y Marcos
  // =====================================================================

  vb1_trampilla: {
    pov: "nora",
    fondo: "assets/fondos/pasillo_oscuro.jpg",
    ambiente: "arriba",
    musica: "terror_suave",
    lugar: "pasillo de arriba", hora: "03:35",
    titulo: "La buhardilla · La cuerda",
    alEntrar: (api) => resolverRuta(api, "buhardilla", true),
    texto: (api) => {
      const pareja = noraCon(api) === "marcos";
      const h = H(api);
      const ireneArriba = true; // Irene siempre ha subido
      const irene = api.bandera("v_irene_callada") ? "La luz del baño, al fondo, encendida. La puerta del dormitorio del fondo, cerrada. Irene está en algún sitio de este pasillo y no la oyes. Ni el agua, ni una puerta, ni los pies descalzos. Nada." : ireneCon(api) === "marcos" ? "La luz del baño, al fondo. Voces dentro: Irene, y Marcos, que ha subido con ella. Bajas la vista. No es asunto tuyo. Lo es." : "La luz del baño, al fondo, encendida. La puerta del dormitorio del fondo, entreabierta. Irene está en algún sitio de este pasillo. Se oye un cajón. Luego nada.";
      const marcos = pareja ? (h === "marcos" ? `
Marcos sube detrás de ti. Sin decir nada. Marcos siempre dice algo en una escalera: que cruje, que cuidado. Nada. Sus pasos exactos detrás de los tuyos, como si pisara donde tú pisas.` : `
Marcos sube detrás de ti.

Marcos: Cruje. Cuidado con el séptimo.

Marcos: Esta casa de los cojones.

Le oyes y te calma. Es lo que hace Marcos en una escalera.`) : "";
      return `
La escalera. El tercero. El séptimo.${marcos}

El pasillo. La lámpara de llama falsa haciendo su ciclo. La alfombra roja, larga, que se hunde. ${irene}

Y la cuerda.

${api.bandera("buhardilla_descubierta") === "irene" ? "Irene tiró de ella esta noche. Se abrió sola una escalera y ella la volvió a subir con las dos manos. Te lo contó Álex, riéndose. La cuerda sigue ahí. Quieta." : "Nadie la ha tocado esta noche. Que tú sepas. Alguien la vio balancearse desde abajo. Tú la viste. O viste balancearse la sombra."} El nudo a la altura de tu cara. Gastado por un lado.

${pareja ? "Marcos la mira. Marcos mira la trampilla como se mira una cosa que va a tener que arreglar." : "Estás sola con ella. Es lo que querías."}

Tiras.

[golpe]

CLACK.

La trampilla cede de golpe. Baja medio palmo. Y la escalera plegable se despliega sola, con un traqueteo de bisagras que retumba en todo el pasillo, hasta apoyarse en la alfombra a un paso de tus pies.

Arriba, un rectángulo negro.

Huele a polvo. A madera seca. Y a algo dulce, muy al fondo. Muy al fondo.

${pareja ? "Marcos: Subo yo primero.\n\nLo dice como se dice «yo conduzco»." : "Nadie te va a decir «subo yo primero». Sacas el móvil. La linterna."}

${modo(api, "nora", {
  lucido: "~ Una buhardilla. Trastos, polvo, ratones. Y una cuerda que se balanceó cuando no había nadie arriba. Voy a subir con una linterna a mirar trastos, polvo y ratones. Y a mirar la otra cosa.",
  asustado: "~ Un rectángulo negro encima de mi cabeza. Y yo con un móvil. Y abajo, todos en sitios distintos, y ninguno me oiría.",
  tenso: "~ Ocho horas queriendo subir aquí. Ocho horas. Y ahora que estoy debajo, quiero bajar.",
  ido: "~ El olor dulce. Lo conozco. Es de algo que se ha quedado mucho tiempo en un sitio cerrado. Como un caramelo. Como una persona.",
  perdido: "~ Está arriba. Me está esperando arriba. Ha bajado la escalera para mí.",
  normal: "~ Venga. Diez escalones de madera. Sube, mira, baja. Y luego, el cuaderno.",
})}`;
    },
    opciones: [
      { texto: "Subir tú primero. Es tu cuerda.", a: "vb2_desvan",
        efecto: (api) => { api.marcar("nora_sube", "primera"); api.est("nora", "eje", 2); } },
      { texto: "Que suba Marcos primero. Y tú detrás.", a: "vb2_desvan", si: (api) => noraCon(api) === "marcos",
        efecto: (api) => { api.marcar("nora_sube", "marcos"); api.rel("nora", "marcos", "confianza", 2); } },
      { texto: "Grabar la trampilla abierta antes de subir. La escalera, el negro.", a: "vb2_desvan", lucida: true,
        efecto: (api) => { api.marcar("nora_sube", "graba"); api.evidencia("video_trampilla", "nora", "pasillo de arriba", "video"); api.est("nora", "lucidez", 1); } },
      { texto: "«¿Irene?» Antes. Hacia el baño.", a: "vb2_desvan", si: (api) => noraCon(api) !== "marcos" && !api.bandera("v_irene_callada"),
        efecto: (api) => { api.marcar("nora_sube", "irene"); api.rel("irene", "nora", "resentimiento", -2); } },
    ],
  },

  vb2_desvan: {
    pov: "nora",
    fondo: "assets/fondos/buhardilla.jpg",
    lugar: "buhardilla", hora: "03:38",
    titulo: "La buhardilla · Las huellas",
    texto: (api) => {
      const pareja = noraCon(api) === "marcos";
      const h = H(api);
      const ns = api.bandera("nora_sube");
      const inicio = ns === "marcos" ? `
Marcos sube. La escalera cruje con su peso. Le ves desaparecer por el rectángulo: los pies, y luego nada.

Marcos: Trastos.

Su voz, desde arriba, suena a otra habitación. A otra casa.

Subes.` : ns === "irene" ? `
Nora: ¿Irene?

Desde el baño, tras un segundo:

Irene: ¿Qué?

Nora: Nada.

Está ahí. Bien. Subes.` : ns === "graba" ? `
Grabas. La escalera desplegada, el rectángulo negro, el pasillo. Diez segundos. En la pantalla el negro es más negro que a ojo. Siempre.

Guardas el móvil. Enciendes la linterna. Subes.` : `
Subes. La escalera cruje. El cuarto peldaño cede un poco. El quinto no.`;

      return `${inicio}

La cabeza por el hueco. La linterna.

Polvo. Una capa gris, gorda, sobre todo. Cajas de cartón hundidas. Una silla sin asiento. Una lámpara de pie sin pantalla. El techo a dos palmos de tu cabeza, con las vigas a la vista.

Y frío. Más que en el pasillo. Un frío quieto, de sitio cerrado, que se te pega a la cara.

Te subes del todo. ${pareja ? "Marcos, agachado, con la cabeza contra las vigas, mira alrededor con la cara de quien busca un enchufe." : "Sola. Con el rectángulo de luz del pasillo a tus pies como una ventana al revés."}

${api.bandera("v_marcos_libre") ? "Y la luz del pasillo, abajo, por el hueco, sube de tono. Un poco. Como si alguien hubiera subido un mando. Marcos, en el cuadro de luces. Sabes dónde está. Es lo último que vas a saber seguro en un rato.\n\n" : ""}

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

${pareja ? "Marcos: Ratas.\n\nLo dice antes de mirar. Cuando mira, no dice nada más." : ""}

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

${pareja ? "Marcos: Es una muñeca.\n\nLo dice como se dice «es una lámpara». Como si ponerle nombre bastara." : ""}`;
    },
    opciones: [
      { texto: "Llevártela. En la mochila. Mañana, con luz.", a: "vb3_cierre",
        efecto: (api) => { api.marcar("nora_toma_muneca", true); api.evidencia("muneca_buhardilla", "nora", "buhardilla", "objeto"); api.est("nora", "eje", 4); api.est("nora", "miedo", 3); } },
      { texto: "Fotografiarla. Con la viga. Con las huellas. Y dejarla donde estaba.", a: "vb3_cierre", lucida: true,
        efecto: (api) => { api.marcar("nora_toma_muneca", false); api.evidencia("foto_buhardilla", "nora", "buhardilla", "foto"); api.est("nora", "lucidez", 1); } },
      { texto: "Dejarla. Cerrar la caja. No tocar nada más.", a: "vb3_cierre",
        efecto: (api) => { api.marcar("nora_toma_muneca", false); api.est("nora", "estres", 3); api.est("nora", "eje", -2); } },
      { texto: "Abrirle el pecho. Ahora. Con las uñas.", a: "vb3_cierre", impulsiva: true,
        efecto: (api) => { api.marcar("nora_toma_muneca", true); api.marcar("nora_abre_muneca", true); api.evidencia("muneca_buhardilla", "nora", "buhardilla", "objeto"); api.est("nora", "miedo", 6); api.est("nora", "estres", 6); api.presenciar("nora", 1.5); } },
    ],
  },

  vb3_cierre: {
    pov: "nora",
    fondo: "assets/fondos/buhardilla_oscura.jpg",
    titulo: "La buhardilla · La trampilla",
    texto: (api) => {
      const pareja = noraCon(api) === "marcos";
      const h = H(api);
      const cerro = api.bandera("trampilla_cerro");
      const sujeto = api.bandera("huesped_sujeto") === "nora";
      const abre = api.bandera("nora_abre_muneca") ? `
Le abres el pecho. Con las uñas. La tela cede como cede la tela vieja: sin resistirse, con un ruido de polvo.

Dentro, envuelto en un trapo más viejo que la muñeca, algo de metal. Pequeño. Redondo. Con una ranura.

Una campanilla.

Sin badajo. Por eso no sonaba. Alguien se lo quitó.

La envuelves otra vez. La metes en la muñeca. La muñeca en la mochila. No piensas. No piensas.` : api.bandera("nora_toma_muneca") ? `
La muñeca en la mochila. Entre el cuaderno y las velas. Pesa. Notas lo de dentro moverse contra tu espalda cuando te mueves.` : `
La caja cerrada. La muñeca dentro. Te alejas de ella de espaldas, sin saber por qué de espaldas.`;

      if (!cerro) return `${abre}

Bajas. ${pareja ? "Marcos primero. Tú detrás, con la linterna en la boca." : "La escalera cruje. El cuarto peldaño cede un poco."}

El pasillo. La alfombra. La lámpara de llama falsa. Todo donde estaba.

${pareja ? "Empujáis la escalera entre los dos. La trampilla encaja con un golpe sordo." : "Empujas la escalera con las dos manos. Pesa más de lo que parece. La trampilla encaja con un golpe sordo."} La cuerda queda colgando. Quieta.

${modo(api, "nora", {
  lucido: "~ Huellas, siete marcas, una muñeca. Tres cosas que se pueden fotografiar. Por primera vez esta noche tengo algo que se puede fotografiar.",
  asustado: "~ No volvían. Las huellas. Iban y no volvían. Y yo he vuelto. Por ahora.",
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

Nada. Irene está en este piso. En este pasillo. A cinco metros.

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

      const escena = !pareja ? solo : h === "marcos" ? conMarcosHuesped : conMarcosNormal;

      return `${abre}
${escena}

${modo(api, "nora", {
  lucido: `~ ${!pareja ? "La cuerda. Una trampilla se cierra por una corriente. Una cuerda no desaparece por una corriente. Una cuerda la quita alguien." : h === "marcos" ? (sujeto ? "«Todavía no.» Dos palabras que Marcos no dice nunca. Marcos dice «espera» o «cuidado». Nunca «todavía no». Y me ha sujetado como no me ha sujetado nunca." : "Seis veces. He dicho su nombre seis veces y él estaba a dos metros con la mano en la escalera. Y dice que no he dicho nada. Y lo dice como se dice la verdad.") : "Una corriente. Las trampillas se cierran con corrientes. Marcos lo ha visto y no lo ha tocado. Eso es todo. Eso es todo y tengo el corazón en la boca."}`,
  asustado: `~ ${!pareja ? "Alguien la sujetaba. Desde abajo. Y luego la soltó. Y se llevó la cuerda." : h === "marcos" ? "No es él. Lleva sin ser él desde la mesa. Desde que le sopló a Irene." : "Se ha cerrado sola. Conmigo dentro. En el sitio de las huellas que no vuelven."}`,
  tenso: "~ Abajo. Al cuaderno. Y no hablar con nadie hasta que lo haya escrito todo.",
  ido: `~ ${!pareja ? "La cuerda se ha ido con las huellas. Iban al mismo sitio. Al sitio donde termina todo lo que no vuelve." : "La linterna parpadeaba al ritmo de mi nombre. Mar-cos. Mar-cos. Como el vaso."}`,
  perdido: `~ ${!pareja ? "Me ha encerrado y me ha soltado. Para que sepa que puede." : h === "marcos" ? "Le tiene. Le tiene y ha hablado por su boca. «Todavía no.» Todavía no qué." : "Nos ha dejado bajar a los dos. A él porque le da igual. A mí porque llevo lo que quería."}`,
  normal: `~ ${!pareja ? "Una trampilla. Una cuerda. Un cuaderno que va a tener dos páginas más." : "Marcos. Marcos, joder. Qué ha sido eso."}`,
})}`;
    },
    opciones: [
      { texto: "Bajar. Contarlo todo en la mesa: las huellas, la viga, la muñeca.", a: "v9_regreso",
        efecto: (api) => { api.marcar("nora_cuenta_huellas", true); api.est("nora", "eje", 2); } },
      { texto: "Bajar. Apuntarlo. Contar solo lo de la trampilla.", a: "v9_regreso",
        efecto: (api) => { api.marcar("nora_cuenta_huellas", false); api.evidencia("cuaderno_buhardilla", "nora", "cuaderno de Nora", "nota"); api.est("nora", "lucidez", 1); } },
      { texto: "«¿Qué me has dicho?» A Marcos. Ahí, en la escalera.", a: "v9_regreso", si: (api) => api.bandera("huesped_sujeto") === "nora",
        efecto: (api) => { api.marcar("nora_confronta_marcos", true); api.marcar("nora_cuenta_huellas", false); api.rel("nora", "marcos", "confianza", -4); api.est("marcos", "estres", 6); } },
      { texto: "«¿No me oías?» Y mirarle hasta que conteste de verdad.", a: "v9_regreso", si: (api) => noraCon(api) === "marcos" && H(api) === "marcos" && api.bandera("huesped_sujeto") !== "nora" && api.bandera("trampilla_cerro"),
        efecto: (api) => { api.marcar("nora_confronta_marcos", true); api.marcar("nora_cuenta_huellas", false); api.saber("nora", "marcos_raro"); api.est("nora", "lucidez", 1); } },
      { texto: "Buscar la cuerda. Por la alfombra. Por el suelo. Debajo de la mesita.", a: "v9_regreso", lucida: true, si: (api) => api.bandera("cuerda_desaparece"),
        efecto: (api) => { api.marcar("nora_cuenta_huellas", false); api.marcar("nora_busco_cuerda", true); api.est("nora", "estres", 4); } },
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
    lugar: "comedor", hora: "03:50",
    titulo: "La dispersión · Lo que cuenta cada uno",
    alEntrar: (api) => {
      ["porche", "arriba", "almacen", "buhardilla"].forEach((r) => resolverRuta(api, r, false));
      // Quién se cree a quién: credibilidad del que cuenta y confianza del que escucha
      if (api.bandera("alex_cuenta") && api.sabe("alex", "oi_irene_fuera")) {
        api.marcar("cree_alex_marcos", api.contar("alex", "marcos", "oi_irene_fuera"));
        api.marcar("cree_alex_nora", api.bandera("nora_vio_gente") ? true : api.contar("alex", "nora", "oi_irene_fuera"));
        api.marcar("cree_alex_irene", api.bandera("irene_oyo_alex_puerta") ? true : api.contar("alex", "irene", "oi_irene_fuera"));
      }
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
      const nc = noraCon(api), ic = ireneCon(api);
      const ruta = api.bandera("v_ruta");

      // 1. Cómo vuelve Nora
      const vuelta = nc === "alex" ? `
Entras con Álex. El calor de dentro te da en la cara como una mano. La mesa, la tabla, las velas a medio consumir. Todo donde estaba. Nadie.

${api.bandera("nora_cuenta_gente") ? "Nora: ¿Has visto eso?\n\nÁlex: ¿El qué?\n\nNora: En los árboles.\n\nÁlex: He oído. No he visto.\n\nY no pregunta más. Álex, que pregunta siempre." : ""}` : nc === "marcos" ? `
Bajáis. El séptimo. El tercero. Marcos ${api.bandera("huesped_sujeto") === "nora" ? "detrás, a dos escalones, sin tocarte" : "delante, mirando atrás cada tres escalones"}. ${api.bandera("nora_toma_muneca") ? "La mochila te pesa en un hombro con lo que lleva dentro." : ""}

La mesa. La tabla. Nadie todavía.` : `
Bajas. El séptimo. El tercero. ${api.bandera("nora_toma_muneca") ? "La mochila te pesa en un hombro con lo que lleva dentro." : "Con las manos vacías y el cuaderno en la cabeza."}

La mesa. La tabla. Las velas a medio consumir. Nadie todavía.`;

      // 2. Quién llega
      const llegan = [];
      if (nc !== "alex") llegan.push(api.bandera("alex_grita_irene") ? `
La puerta principal. Álex entra con el frío detrás.

Álex: ¡Irene!

A gritos. Hacia arriba.

Irene: ¿Qué?

Desde arriba. Desde el pasillo. Clara.

Álex se queda con la mano en la puerta. Cierra despacio.

Álex: Nada. Saber dónde estabas.` : `
La puerta principal. Álex entra con el frío detrás y la cara de quien trae algo.`);
      if (ic === "marcos") llegan.push(`
La escalera. Irene y Marcos. Ella delante. ${api.bandera("huesped_quemo") ? "Él con la mano derecha pegada al cuerpo, como se lleva una mano que duele." : api.bandera("huesped_sujeto") === "irene" ? "Ella con la manga de la sudadera bajada hasta los nudillos." : "Sin mirarse."}`);
      else if (nc !== "marcos") { if (api.bandera("v_marcos_libre")) llegan.push(`
El arco de la cocina. Marcos. Con polvo en las rodillas y la cara de haber resuelto algo, o de no haberlo resuelto.${nc === "alex" && h !== "marcos" && api.relv("marcos", "nora", "confianza") >= 55 ? " Te ve entrar con Álex y no hay nada en la mirada. Ni una pregunta. Confía. Es lo que hace, y es lo que más te gusta de él." : ""}`); }
      if (ic !== "marcos") llegan.push(api.bandera("v_irene_callada") ? `
Y la escalera. Irene. Con la sudadera. Baja despacio, con la mano en la barandilla y la otra en el cuello, y se sienta sin decir nada, y coge su vaso, y no bebe.` : `
Y la escalera. Irene. Con la sudadera. Se sienta. Coge su vaso.`);

      // 3. Álex
      const alex = api.bandera("alex_cuenta") ? (api.sabe("alex", "oi_irene_fuera") ? `
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
      const irene = api.bandera("irene_cuenta") && api.sabe("irene", "oi_alex_puerta") ? `
Irene: ¿Has subido tú?

A Álex. Sin la voz.

Álex: ¿A qué?

Irene: A nada. ¿Has subido?

Álex: He estado fuera. Fumando. Pregúntale a Nora.

Irene: Ya.

Y no dice más. Y Álex la mira, y por primera vez esta noche Álex no tiene nada que decir.

${api.sabe("alex", "oi_irene_fuera") ? "~ Él la ha oído fuera. Ella le ha oído arriba. Cada uno donde no estaba el otro. Al mismo tiempo." : ""}` : api.bandera("irene_oyo_alex_puerta") ? `
Irene no dice nada. Irene, que siempre dice algo cuando Álex cuenta cosas. Le mira contar. Traga.` : "";

      // 5. Marcos
      let marcos = "";
      if (api.bandera("v_marcos_libre")) {
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
      } else if (ic === "marcos") {
        marcos = api.bandera("marcos_cuenta_grifo") ? `
Marcos: ¿Has dejado el grifo abierto arriba?

Irene: No he tocado ningún grifo.

Marcos: Se oía. Desde el pasillo.

Irene: Estaba seco. El lavabo.

Se miran. Y en esa mirada hay algo que no sabes leer, y tú lees bien.` : "";
      }

      // 6. Nora y la muñeca
      const nora = api.bandera("nora_toma_muneca") ? `
Sacas la muñeca de la mochila. La pones en la mesa. Al lado de la tabla.

Álex: Hostia. ¿De dónde has sacado eso?

Nora: De la buhardilla.

Álex: ¿Has subido a la buhardilla?

Nora: Hay huellas. En el polvo. De pies descalzos. Pequeños. Van hasta la pared y no vuelven.

Irene no mira la muñeca. Mira la escalera.

Marcos la coge. Le da la vuelta. Le toca el pecho con el pulgar.

Marcos: Tiene algo dentro.

${api.bandera("nora_abre_muneca") ? "Nora: Una campanilla. Sin badajo.\n\nÁlex deja de sonreír. Nadie dice nada de la historia. No hace falta." : "Nadie la abre. Marcos la deja donde estaba. Con los ojos cosidos hacia arriba."}

${nc === "marcos" ? "Marcos: Las he visto.\n\nÁlex: ¿Y?\n\nMarcos: Y no sé qué son. No eran ratas.\n\nLo dice a la mesa. Para que conste. Marcos, que no cree en nada, acaba de decir «no sé» delante de Álex. Por ti. Le buscas la mano por debajo de la mesa. Está." : ""}` : api.bandera("nora_cuenta_huellas") ? `
Nora: Hay huellas en la buhardilla. En el polvo. De pies descalzos. Pequeños. Van hasta la pared y no vuelven. Y una viga quemada con siete marcas.

Álex: Siete.

Nora: Siete.

Álex no sonríe. Es la primera vez que le dices algo de su historia y no sonríe.

${nc === "marcos" ? "Marcos: Las he visto. No eran ratas.\n\nLo dice a la mesa. Para que conste. Marcos, que no cree en nada, diciendo «no eran ratas» delante de Álex. Por ti." : api.bandera("cree_nora_marcos") ? "Marcos te mira. Asiente. No dice ratas. Te pone la mano en la rodilla por debajo de la mesa, que es su manera de decir «te creo» sin que Álex lo oiga." : "Marcos: Ratas.\n\nLo dice suave. Sin reírse. Como quien ofrece una salida, no como quien la cierra.\n\nNora: Tenían dedos.\n\nMarcos: Vale.\n\nY te deja la palabra. No insiste. Marcos no insiste contigo."}` : `
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

03:50. Álex: Irene en los árboles. ${api.bandera("irene_oyo_alex_puerta") && api.bandera("irene_cuenta") ? "Irene: Álex en la puerta." : "Irene: nada."} ${api.bandera("v_marcos_libre") ? "Marcos: una puerta." : ic === "marcos" ? "Marcos: el grifo." : "Marcos: la trampilla."} Yo: ${api.bandera("nora_vio_gente") ? "gente entre los árboles." : api.bandera("huellas_vistas") ? "huellas. Siete marcas." : "nada."}

${modo(api, "nora", {
  lucido: "~ Cuatro versiones. Ninguna se toca con las otras. Cada uno ha visto lo suyo en su sitio y ninguno puede demostrar nada a nadie. Es como si esta casa supiera repartir.",
  asustado: "~ Nos ha separado. Veinte minutos. Y en veinte minutos a cada uno le ha pasado una cosa distinta y ninguno estaba con los demás para verla.",
  tenso: "~ Y ahora cada uno se va a creer lo suyo y a reírse de lo de los demás. Y yo apunto. Y nadie lee lo que apunto.",
  ido: "~ Cuatro cosas. Cuatro sitios. Como cuatro dedos en un vaso. Y el vaso se ha movido.",
  perdido: "~ Nos ha probado a cada uno por separado. Para ver por dónde entra cada uno. Ya lo sabe.",
  normal: "~ Hace veinte minutos sabía dónde estaba cada uno. Ahora sé dónde dice cada uno que estaba.",
})}

La tabla sigue en la mesa. Las velas, a medio consumir. ${api.bandera("nora_toma_muneca") ? "Y la muñeca, con los ojos cosidos hacia arriba." : ""} La música, baja, que nadie ha vuelto a quitar.

Y arriba, en el techo, justo encima de la mesa, en la buhardilla que acabas de cerrar, algo que todavía no ha empezado a andar.

...

Fin de la Fase V. La evidencia compartida se escribe en la siguiente entrega.`;
    },
    final: true,
  },

  });
})();
