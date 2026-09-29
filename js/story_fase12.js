/*
 * LA BRUJA — PRÓLOGO
 * Fase XII: Nora (HORROR 6) · Biblia §5 (XII), §7, §9, §18, §22, §23.2, §23.8
 *
 * Nora sola, y no sola: el huésped está en ella y sus pensamientos ya no son todos suyos. El cuaderno,
 * releído en su orden. La ouija que escribe ABAJO: son sus manos, y nadie lo dirá nunca. El almacén, el
 * candado, la escalera de piedra, el sótano: piedra, madera quemada, la inscripción. Final A (NORA_DEAD,
 * desde dentro) o Final B (NORA_UNKNOWN, la segunda cámara), según las ofrendas entregadas y si bajó con luz.
 * La mesa vacía, la batería, negro. DIEZ AÑOS DESPUÉS: el epílogo ensamblado con lo que quedó.
 *
 * Se consume: muerte_*, cuerpo_*, huesped_anterior, xi_final, las evidencias (cuaderno_*, video_*, foto_*),
 * ofrenda_*, mano_nora, alda_visto, dichos, conocimiento. Sin presupuesto de anomalías.
 * Se deja: final (A|B), nora_final (NORA_DEAD|NORA_UNKNOWN), nora_bajo_con_luz, prologo_completo.
 */
(() => {
  const R = () => HISTORIA.R;
  const modo = (api, id, m) => m[api.modo(id)] || m.normal;
  const N = { nora: "Nora", marcos: "Marcos", alex: "Álex", irene: "Irene" };
  const fem = (id) => id === "nora" || id === "irene";
  const M = (api, p) => R().muerte(api, p) || {};
  // Los muertos en el orden en que murieron
  const porOrden = (api) => R().muertos(api).filter((p) => p !== "nora").slice().sort((a, b) => (M(api, a).orden || 0) - (M(api, b).orden || 0));
  // El último: el tercero, el que llevaba el huésped hasta la puerta del almacén
  const U = (api) => { const a = api.bandera("huesped_anterior"); if (a && a !== "nora" && api.bandera("muerto_" + a)) return a; const o = porOrden(api); return o[o.length - 1] || "marcos"; };
  const cam = (api) => api.bandera("video_final_movil") || "irene";
  const enLetra = (n) => ["cero", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte"][n] || String(n);
  const hayLuz = (api) => ["linterna", "vela"].includes(api.bandera("xii3_luz")) && api.bandera("xii5_nora") !== "apaga";
  const linternaDisponible = (api) => { const q = R().quienLleva(api, "linterna"); return !q || q === "nora"; };
  const lugarCuerpo = (api, p) => {
    const m = M(api, p);
    if (m.como === "bosque") return "en el bosque, en " + (m.donde || "el terraplén bajo los pinos");
    if (m.como === "coche") return "en el coche, en " + (m.donde || "el camino, contra el pino grande");
    if (m.como === "banera") return "en la bañera de arriba, sin agua";
    if (m.como === "huesped") return "en " + (m.donde || "la bañera del baño de arriba") + ", con las cuatro marcas";
    if (m.como === "amigo") return "en " + (m.donde || "el baño de arriba") + ", con la cabeza abierta";
    if (m.como === "nina") return "en el almacén, con la cabeza en el escalón";
    return "en " + (m.donde || "la casa");
  };

  Object.assign(HISTORIA.deriva, { XII: { estres: 1, miedo: 1 } });

  const saltoPrevio = HISTORIA.prepararSalto;
  HISTORIA.prepararSalto = (api, id) => {
    if (typeof saltoPrevio === "function") saltoPrevio(api, id);
    if (!/^xii\d/.test(id)) return;
    R().saltoBase(api);
    if (!api.bandera("fase11_completa")) {
      const h = api.bandera("huesped");
      const d = h === "marcos" ? "alex" : "marcos";
      const s = h === "marcos" ? "irene" : (d === "alex" ? "marcos" : "alex");
      ["fase6_completa", "fase7_completa", "fase8_completa", "fase9_completa", "fase10_completa", "fase11_completa", "evento_imposible", "luz_vuelta", "apagon", "video_mesa_visto", "las_siete", "puerta_no_abre", "anomalia_espacial", "nina_vista", "nora_sola"].forEach((f) => api.marcar(f, true));
      api.marcar("generador_quien", d); api.marcar("primer_cruce", d); api.marcar("desaparecido", d);
      api.marcar("fase_actual", "VIII");
      R().cruzar(api, d); R().matar(api, d, d === "alex" ? "bosque" : "coche", d === "alex" ? "el terraplén bajo los pinos" : "el camino, contra el pino grande", "nora"); api.marcar("cuerpo_" + d, d === "alex" ? "terraplen" : "coche");
      api.marcar("fase_actual", "X");
      R().matar(api, s, s === "irene" ? "banera" : s === "alex" ? "bosque" : "coche", s === "irene" ? "la bañera del baño de arriba" : s === "alex" ? "el borde de los pinos" : "el camino, contra el pino grande", "nora"); api.marcar("segundo_muerte", s); api.marcar("cuerpo_" + s, s === "irene" ? "banera" : s === "alex" ? "bosque" : "coche");
      api.marcar("fase_actual", "XI"); api.marcar("xi_final", "nina");
      R().matar(api, h, "nina", "la puerta del almacén", "nora"); api.marcar("cuerpo_" + h, "almacen");
      if (api.bandera("huesped") !== "nora") { api.marcar("huesped_anterior", h); api.marcar("huesped", "nora"); }
      api.marcar("huesped_nivel", 3);
      if (!api.hayEvidencia("video_mesa")) api.evidencia("video_mesa", "irene", "mesa", "video");
      if (!api.hayEvidencia("cuaderno_alda")) api.evidencia("cuaderno_alda", "nora", "cuaderno de Nora", "nota");
    }
    R().fase(api, "XII", 6, 3);
    if (/^xii[2-8]/.test(id) && !api.bandera("xii1_nora")) api.marcar("xii1_nora", "ultima");
    if (/^xii[3-8]/.test(id) && !api.bandera("xii2_pregunta")) { api.marcar("xii2_pregunta", "donde"); api.marcar("ouija_abajo", true); api.marcar("video_final_movil", "irene"); }
    if (/^xii[4-8]/.test(id) && !api.bandera("xii3_luz")) { api.marcar("xii3_luz", "linterna"); api.marcar("nora_luz", true); api.marcar("candado_abierto", "llave"); }
    if (/^xii[5-8]/.test(id) && !api.bandera("xii4_voz")) api.marcar("xii4_voz", "ninguna");
    if (/^xii[6-8]/.test(id) && !api.bandera("xii5_nora")) api.marcar("xii5_nora", "toca");
    if (/^xii[6-8]/.test(id)) decidirFinal(api);
  };

  // El final: A si la casa está alimentada (cinco ofrendas o más) o si bajó sin luz; B si bajó con luz y con menos.
  function decidirFinal(api) {
    if (api.bandera("final")) return;
    const luz = hayLuz(api);
    const A = R().ofrendas(api) >= 5 || !luz;
    api.marcar("final", A ? "A" : "B");
    api.marcar("nora_final", A ? "NORA_DEAD" : "NORA_UNKNOWN");
    api.marcar("nora_bajo_con_luz", luz);
    if (A) {
      R().ofrenda(api, "alma");
      api.marcar("muerto_nora", true);
      api.marcar("muerte_nora", { como: "sotano", donde: "el sótano, al pie del poste", fase: "XII", visto_por: null, orden: 4 });
    } else api.marcar("desaparecida_nora", true);
    api.marcar("prologo_completo", true);
  }

  // Lo que Nora escribió esta noche, en su orden, con su hora
  function lineasCuaderno(api) {
    const E = api.evidencias();
    const hora = (id, def) => (E[id] && E[id].hora) || def;
    const orden = porOrden(api);
    const p1 = orden[0] || "alex";
    const p2 = api.bandera("segundo_muerte") || orden[1] || "irene";
    const u = U(api);
    const hIX = orden.find((p) => M(api, p).como === "amigo" && M(api, p).fase === "IX") || u;
    const L = [];
    if (E.cuaderno_triada) L.push(`${hora("cuaderno_triada", "00:58")}. Espino, pelo negro, diente de leche.`);
    if (E.cuaderno_alda) L.push(`${hora("cuaderno_alda", "01:41")}. ALDA.`);
    if (E.cuaderno_ajoba) L.push(`${hora("cuaderno_ajoba", "01:49")}. AJOBA. Con jota.`);
    if (E.cuaderno_buhardilla) L.push(`${hora("cuaderno_buhardilla", "02:40")}. Buhardilla. Huellas pequeñas. Descalzas. Cuatro marcas en la viga. Una muñeca con los ojos cosidos. He contado solo lo de la trampilla.`);
    if (E.cuaderno_dispersion) L.push(`${hora("cuaderno_dispersion", "03:05")}. Nos hemos separado. He apuntado quién con quién. No sirve de nada.`);
    if (E.cuaderno_pasos) L.push(`${hora("cuaderno_pasos", "03:40")}. Pasos arriba. Los he contado. Van hacia la trampilla.`);
    if (E.cuaderno_imposible) L.push(`${hora("cuaderno_imposible", "04:10")}. Alguien ha subido. Le hemos visto los cuatro.`);
    if (E.cuaderno_generador) L.push("04:53. Han salido. Han vuelto. Sangre en la chapa.");
    if (E.cuaderno_muerte1) L.push(`${hora("cuaderno_muerte1", "05:50")}. ${N[p1]}. ${(M(api, p1).donde || "Fuera").charAt(0).toUpperCase() + (M(api, p1).donde || "Fuera").slice(1)}. Cuatro marcas en el cuello. En el vídeo el vaso se mueve sin nadie.`);
    if (E.cuaderno_ataque) L.push(`${hora("cuaderno_ataque", "06:20")}. ${N[hIX]}. Las manos. «Todavía no.»`);
    const enIX = orden.filter((p) => M(api, p).fase === "IX");
    L.push(`06:38. ${enIX.length ? "Dos. " + N[enIX[0]] + ". Arriba." : "Uno."}${api.bandera("sarten_humo") ? " La sartén humea sola." : ""}${api.bandera("arrastre_mesa") ? " Lo de abajo está debajo de la mesa." : ""} Quedamos ${enIX.length ? "dos" : "tres"}.`);
    if (E.cuaderno_puerta) L.push("06:45. La puerta no abre. Nadie la sujeta.");
    L.push(`07:08. No amanece. La puerta no abre. ${N[p2]}. Quedamos dos.`);
    if (E.cuaderno_puerta_arriba) L.push("07:12. La puerta da arriba.");
    return L;
  }

  // ---------- El epílogo ensamblado (§23.8) ----------
  function epilogo(api) {
    const E = api.evidencias();
    const orden = porOrden(api);
    const u = U(api);
    const A = (api.bandera("final") || "A") === "A";
    const c = cam(api);
    const luz = api.bandera("nora_bajo_con_luz");
    const ordinal = ["Primero", "Después", "El tercero"];
    const cuerpos = orden.map((p, i) => {
      const m = M(api, p);
      let d = `${ordinal[i] || "Luego"}, a ${N[p]}, ${lugarCuerpo(api, p)}.`;
      if (m.como === "bosque") d += " Con la cara hacia la casa. A doscientos metros de la puerta, que es como se muere en un bosque de verdad: cerca.";
      if (m.como === "coche") d += " El motor en marcha hasta que se acabó la gasolina. Las luces de dentro encendidas.";
      if (m.como === "banera") d += " Con el pelo mojado. Sin una gota en el suelo.";
      if (m.como === "huesped") d += ` El informe dice que fue ${N[u]}. ${N[u]} no está para decir que no.`;
      if (m.como === "amigo" && m.fase !== "XI") d += ` El informe dice que fue ${N[api.bandera("mato_" + Object.keys(N).find((k) => api.bandera("mato_" + k) === p)) || "otro"]}. Defensa propia, dice.`;
      if (m.como === "amigo" && m.fase === "XI") d += " Con una llave inglesa al lado que tenía las huellas de Nora. Eso el informe sí lo dice.";
      if (m.como === "nina") d += " Lo que le faltaba no lo encontraron.";
      return d;
    });
    const nora = A
      ? "Y a Nora, abajo. Al pie de una escalera de piedra que no estaba en ningún plano de la casa. Con una cadena en el tobillo que nadie supo de dónde había salido, porque el hierro tenía trescientos años y el cierre estaba nuevo."
      : `Y a Nora no la encontraron. Ni abajo, ni en el bosque, ni en la carretera. La puerta del sótano abierta, ${luz ? (api.bandera("xii3_luz") === "vela" ? "una vela consumida hasta la piedra en el último escalón" : "una linterna encendida en el último escalón, todavía con pila") : "la llave inglesa en el último escalón"}, y nada. Diez años. Nada.`;

    const q = [];
    const nCuaderno = lineasCuaderno(api).length + (E.cuaderno_final ? 1 : 0) + (E.cuaderno_otra_letra ? 1 : 0);
    q.push(`El cuaderno de Nora. ${enLetra(nCuaderno).charAt(0).toUpperCase() + enLetra(nCuaderno).slice(1)} líneas con hora, de una noche.${E.cuaderno_alda && !api.bandera("pagina_alda_arrancada") ? " Y una palabra que nadie ha sabido explicar." : ""}${E.cuaderno_ajoba ? " Y otra, con jota." : ""}`);
    q.push(`El vídeo de la mesa. El móvil de Irene: la broma, el ahogo, el apagón, el rescate. Nunca el frío. Y al final, ${c === "irene" ? "en el mismo móvil" : "en el de Marcos"}, veintidós minutos de una mesa vacía, con una voz que sube desde abajo y un ruido de vidrio fuera de plano.`);
    if (E.video_marcos_ouija) q.push("El móvil de Marcos: la ouija desde el otro lado. Se ve a Álex empujar. En la palabra que Nora apuntó, no empuja.");
    if (E.video_cobertizo) q.push("El vídeo del cobertizo. El generador. Los golpes en la chapa desde fuera.");
    if (E.video_coche_luz) q.push("El coche con la luz de dentro encendida, grabado desde el porche, con nadie dentro.");
    if (E.movil_alex_bosque || api.bandera("alex_graba_bosque")) q.push(api.bandera("movil_alex_hallado") ? "El móvil de Álex, en el bosque. Su voz: «Venga. Si estás ahí, sal.» Y detrás, la de Irene, que estaba dentro de la casa." : "El móvil de Álex no apareció.");
    if (E.video_irene_bano || E.audio_irene_bano) q.push("Diez segundos de Irene en el baño de arriba. El grifo. Y una voz de hombre diciendo su nombre desde el otro lado de una puerta que da a un pasillo.");
    if (E.video_techo) q.push("Un vídeo del techo del salón. Cuatro segundos. Nadie se pone de acuerdo en qué se ve.");
    if (E.video_trampilla || E.video_escalera) q.push("Un vídeo de la escalera, con la trampilla abierta al fondo, y un ruido de cuerda.");
    if (E.foto_marcas_cuello || E.foto_marcas_2) q.push("Las fotos de las marcas. Cuatro. En el cuello. Hechas con un móvil, con la mano temblando, por alguien que quería que quedaran.");
    if (E.foto_huellas_vuelven) q.push("La foto de las huellas. Pequeñas. Descalzas. Que suben y vuelven.");
    if (E.muneca_buhardilla || api.bandera("nora_toma_muneca")) q.push("La muñeca con los ojos cosidos.");
    if (E.simbolo_mesa) q.push("La foto del símbolo de la mesa, con la mano de Nora al lado para dar la escala.");
    if (E.boton_irene) q.push("Un botón de la camisa de Irene, entre dos páginas.");
    if (E.foto_sarten || E.foto_sarten_2) q.push("La sartén. Humeando. Con el mando en el cero.");
    if (E.escalon_roto) q.push("El escalón roto de la escalera plegable.");
    if (E.coche_volcado) q.push("El coche.");
    q.push("El tablero. El vaso en la O. El péndulo. Las velas consumidas hasta el plato.");
    q.push(`Y abajo. La escalera de piedra que no estaba en los planos. El poste quemado. La argolla. La palabra en la piedra, cortada con algo pequeño.${A ? " Y debajo, una letra nueva." : ""}`);

    const s = [];
    if (api.sabe("irene", "ahogo_real")) s.push(`Irene lo sabía desde la una: que el ahogo fue de verdad. ${api.cree("marcos", "ahogo_real") || api.bandera("marcos_cree_irene") ? "Marcos la creyó." : "Nadie la creyó."}`);
    if (api.sabe("marcos", "aliento_frio")) s.push("Marcos notó el frío al hacerle la respiración. No lo dijo. Se lo achacó a las setas, o al susto, o a nada.");
    if (api.sabe("alex", "no_elegi_alda")) s.push("Álex fue el único que supo con certeza que no eligió las palabras. Nadie le creyó. Ni él, al final.");
    if (api.bandera("alda_visto") || api.sabe("nora", "alda")) s.push("Y Nora sabía lo de la palabra. Que nadie podía conocerla. Lo apuntó. No se lo dijo a nadie.");
    if (!s.length) s.push("Ninguno de los cuatro dijo lo que sabía. Cada uno se lo llevó. Es lo que hace esa casa: repartir y que nadie junte.");

    let alda;
    if (api.bandera("pagina_alda_arrancada") && A) alda = "Y en el bolsillo de Nora, doblada en cuatro, una página del cuaderno. Danna la desdobla. Una hora. Y una palabra.\n\nALDA.";
    else if (api.bandera("pagina_alda_arrancada")) alda = "Al cuaderno le falta una página. Se ve el borde. Danna pasa el dedo por la siguiente, marcada de apretar el boli, y la pone contra la luz de la ventana.\n\nALDA.";
    else if (E.cuaderno_alda) alda = `Danna se para en una línea. ${(E.cuaderno_alda && E.cuaderno_alda.hora) || "01:41"}. Cuatro letras. Subrayadas una vez, con la regla del cuaderno.\n\nALDA.`;
    else if (api.bandera("cuaderno_letra_otra")) alda = "Y en la última página, con una letra que no es la de Nora. Más redonda. Como de alguien que aprende a escribir.\n\nALDA.";
    else alda = `Y en la foto del sótano, la número treinta y uno, detrás del poste, a la altura de una niña. Danna la acerca a la cara.\n\nALDA.${A ? "\n\nY debajo, más clara, cortada hace menos: una N." : ""}`;

    return `
DIEZ AÑOS DESPUÉS

[luz]

Un bar de carretera. La misma carretera. Fuera, la lluvia de marzo. Agus tiene la caja en la silla de al lado: las copias, las fotos, el cuaderno en una bolsa de plástico con cremallera.

Danna no ha tocado el café.

Agus: Los encontraron el martes. Por el coche. Un tipo del pueblo lo vio desde la carretera y llamó, y tardaron dos horas en subir porque nadie del pueblo quiso subir con ellos.

Agus: Cuatro. Dos parejas. Una noche.

${cuerpos.join("\n\n")}

${nora}

Agus: El informe dice hipotermia. Dice caída. Dice un coche a cuarenta por hora contra un pino. Y en los tres, cuatro marcas en el cuello. Eso el informe no lo dice. Eso lo dicen las fotos.

Danna: ¿Y qué quedó?

Agus abre la caja.

${q.join("\n\n")}

Danna: ¿Y ellos? ¿Qué sabían?

Agus: Lo que se puede saber de lo que apuntaron y de lo que grabaron. Poco. Y todo.

${s.join("\n\n")}

Danna coge la bolsa. La abre. El cuaderno huele a casa cerrada. Pasa páginas. Las horas. La letra que se va haciendo pequeña. La que se va haciendo otra.

${alda}

Danna: ¿Qué es Alda?

Agus: No lo sé. Nadie lo sabe. Nora lo sabía. Lo apuntó y no se lo dijo a nadie.

Danna cierra el cuaderno. Lo mete en la bolsa. Cierra la cremallera hasta el final, como se cierra una cosa que va a volver a abrirse.

Danna: Voy a ir igual.

Agus: Lo sé.

[silencio]

FIN DEL PRÓLOGO`;
  }

  Object.assign(HISTORIA.escenas, {

  // =====================================================================
  // FASE XII — NORA
  // =====================================================================

  xii1_cuaderno: {
    pov: "nora",
    fondo: "assets/fondos/salon_gris.jpg",
    ambiente: "interior",
    musica: "terror_suave",
    lugar: "comedor", hora: "07:35",
    titulo: "Nora · El cuaderno",
    alEntrar: (api) => {
      R().fase(api, "XII", 6, 3);
      R().tick(api);
      api.marcar("fase12_empezada", true);
      api.presenciar("nora", 1);
    },
    texto: (api) => {
      const orden = porOrden(api);
      const L = lineasCuaderno(api);
      return `
Las siete y treinta y cinco. El gris.

El cuaderno. Abierto por el principio. La primera página, con la fecha de ayer y la letra de las doce: la de apuntar, la de «quería pruebas», la de antes.

Lees. En orden. Lo que has escrito esta noche.

${L.join("\n\n")}

Y debajo, con la letra que no es tu letra de apuntar. Más redonda. Como de alguien que aprende:

Empieza fuera.

Y debajo, que no recuerdas haber escrito:

Los tres salieron.

~ Los tres salieron. ${orden.map((p) => N[p]).join(". ")}. Cada uno de una manera. Yo no. Yo llevo toda la noche dentro, con esto en la mano. Y por eso sigo. Y por eso me ha guardado.

~ Abajo.

Con tu voz. Y ya no preguntas quién.

${modo(api, "nora", {
  lucido: "~ Todo apuntado. Con hora. Una noche entera en una lista, y la lista tiene un orden, y el orden lleva a un sitio. No lo he escrito yo entero. Pero lo he leído yo. Y es verdad.",
  asustado: "~ Cada línea es alguien que ya no está. Y la última soy yo, y no la he escrito todavía.",
  tenso: "~ Abajo. Que se calle. Que se calle mi voz. Se apunta y se sigue. Se apunta y se sigue.",
  ido: "~ La letra cambia página a página. Se hace pequeña. Se hace otra. Al final no es mía. Al final es de la que escribió «empieza fuera».",
  perdido: "~ Me lo ha dictado todo. Desde la una. Yo solo he puesto la hora.",
  normal: "~ Está todo. Con hora. Si alguien lo lee, lo entenderá. Es lo único que sé hacer: que se entienda.",
})}

El boli. Lo tienes en la mano. No recuerdas haberlo cogido.`;
    },
    opciones: [
      { texto: "Escribir la última línea. Con tu letra. «07:35. Sola. Voy abajo. Que quede.»", a: "xii2_ouija", lucida: true,
        efecto: (api) => { api.marcar("xii1_nora", "ultima"); api.evidencia("cuaderno_final", "nora", "cuaderno de Nora", "nota"); api.est("nora", "lucidez", 2); } },
      { texto: "Dejar que escriba la mano. Sin mirar. Lo que quiera.", a: "xii2_ouija",
        efecto: (api) => { api.marcar("xii1_nora", "mano"); api.marcar("cuaderno_letra_otra", true); api.evidencia("cuaderno_otra_letra", "nora", "cuaderno de Nora", "nota"); R().alimentar(api, 1); api.est("nora", "lucidez", -3); } },
      { texto: "Arrancar la página de ALDA. Doblarla. Al bolsillo.", a: "xii2_ouija", si: (api) => api.hayEvidencia("cuaderno_alda"),
        efecto: (api) => { api.marcar("xii1_nora", "arranca"); api.marcar("pagina_alda_arrancada", true); api.est("nora", "eje", 2); } },
      { texto: "Cerrar el cuaderno. En el centro de la mesa. Que lo vean.", a: "xii2_ouija",
        efecto: (api) => { api.marcar("xii1_nora", "cierra"); api.marcar("cuaderno_cerrado", true); api.est("nora", "estres", -2); } },
    ],
  },

  xii2_ouija: {
    pov: "nora",
    fondo: "assets/fondos/ouija_negro.jpg",
    musica: "terror_suave",
    hora: "07:41",
    titulo: "Nora · La tabla",
    alEntrar: (api) => {
      R().tick(api);
      R().lapso(api);
      api.marcar("video_final_movil", api.hayEvidencia("video_mesa") || !api.bandera("marcos_graba_ouija") ? "irene" : "marcos");
      api.presenciar("nora", 2);
    },
    texto: (api) => {
      const x1 = api.bandera("xii1_nora");
      const c = cam(api);
      const inicio = x1 === "ultima" ? "07:35. Sola. Voy abajo. Que quede.\n\nTu letra. La de apuntar. Te ha costado la S de «sola» y no sabes por qué." : x1 === "mano" ? "Has dejado la mano. Sin mirar. Y cuando miras hay una palabra, redonda, grande, de alguien que aprende:\n\nABAJO.\n\nY debajo, más pequeña, tuya:\n\nvale." : x1 === "arranca" ? "La página de ALDA. Arrancada por el borde, con cuidado, como se arranca una cosa que se quiere guardar. Doblada en cuatro. En el bolsillo del pantalón, con el mechero." : "El cuaderno cerrado. En el centro de la mesa. Con las tapas hacia arriba. Que lo vean.";
      return `
${inicio}

La tabla. La sacas de la caja. Pesa lo que pesaba a la una. La pones en la mesa, donde estuvo, con las letras hacia ti. El vaso. Boca abajo. En el centro.

Y el móvil de ${N[c]}. En la mesa, donde lleva toda la noche, boca abajo. ${c === "irene" ? "El que grabó la broma, el ahogo, el apagón, el rescate. El que nunca grabó el frío." : "El que grabó la ouija desde el otro lado. Las manos de Álex empujando. Las manos de Álex sin empujar."} Lo coges. Batería: nueve por ciento. Grabar. Lo apoyas contra la caja de la tabla, con la cámara hacia la mesa.

~ Que quede. Es lo que sé hacer.

Te sientas. En tu silla. Sola en una mesa de cuatro, con tres sillas vacías mirándote.

Las manos en el vaso. Los dos dedos, como enseñó Álex. Sin peso.

~ Aliento.

Eso ha llegado. Y no te ha dado miedo. Eso es lo que te da miedo.

${modo(api, "nora", {
  lucido: "~ Una ouija a solas. Con las manos que llevan lo que llevaban las de Marcos y las de Irene. Sé lo que va a pasar y voy a mirarlo igual, porque si no lo miro yo no lo mira nadie.",
  asustado: "~ Tres sillas vacías. Y noto los tres pesos. Y noto el cuarto, debajo, que no es de nadie de la mesa.",
  tenso: "~ Pregunta. Pregunta y acaba. Pregunta y baja.",
  ido: "~ El vaso está frío por dentro. Se nota por los dedos. Como si alguien lo hubiera tenido en la boca.",
  perdido: "~ Me ha sentado aquí. Como me sentó a la una. Y ahora sé para qué.",
  normal: "~ Vale. Como a la una. Dos dedos. Sin peso. Y que conteste.",
})}

Y el vaso está frío. Como el vidrio a la una. Como todo lo de esta noche: frío como lo que lleva mucho tiempo en un sitio cerrado.`;
    },
    opciones: [
      { texto: "«¿Dónde están?»", a: "xii3_almacen",
        efecto: (api) => { api.marcar("xii2_pregunta", "donde"); api.marcar("ouija_abajo", true); } },
      { texto: "«¿Quién eres?»", a: "xii3_almacen",
        efecto: (api) => { api.marcar("xii2_pregunta", "quien"); api.marcar("ouija_abajo", true); R().ofrenda(api, "nombre"); } },
      { texto: "«¿Puedo irme?»", a: "xii3_almacen",
        efecto: (api) => { api.marcar("xii2_pregunta", "irme"); api.marcar("ouija_abajo", true); api.est("nora", "miedo", 4); } },
      { texto: "No preguntar. Las manos en el vaso. Esperar.", a: "xii3_almacen", lucida: true,
        efecto: (api) => { api.marcar("xii2_pregunta", "nada"); api.marcar("ouija_abajo", true); api.est("nora", "lucidez", 1); } },
    ],
  },

  xii3_almacen: {
    pov: "nora",
    fondo: "assets/fondos/almacen.jpg",
    ambiente: "almacen",
    musica: "terror",
    lugar: "almacén", hora: "07:48",
    titulo: "Nora · El candado",
    alEntrar: (api) => {
      R().tick(api);
      api.marcar("candado_abierto", "llave");
      api.presenciar("nora", 2);
      api.est("nora", "estres", 4);
    },
    texto: (api) => {
      const p = api.bandera("xii2_pregunta");
      const u = U(api);
      const obj = R().mano(api, "nora");
      const respuesta = p === "quien" ? "Nora: ¿Quién eres?\n\nY el vaso va.\n\nSin que lo empujes. Miras tus manos: quietas, encima, sin peso. Y el vaso va.\n\nA.\n\nL.\n\nD.\n\nA.\n\nLo sabías. Lo has leído antes de que llegara a la D.\n\nY sin preguntar, sin soltar, el vaso sigue:\n\nA. B. A. J. O."
        : p === "irme" ? "Nora: ¿Puedo irme?\n\nY el vaso va. A la esquina. Rápido, como se contesta a una tontería.\n\nNO.\n\nY vuelve al centro. Y sigue. Despacio. Como quien escribe con la mano de otro.\n\nA. B. A. J. O."
        : p === "nada" ? "No preguntas.\n\nY el vaso va igual. Como quien contesta a una pregunta que se hizo a la una.\n\nSin que lo empujes. Miras tus manos: quietas, encima, sin peso. Y el vaso va.\n\nA. B. A. J. O."
        : "Nora: ¿Dónde están?\n\nY el vaso va.\n\nSin que lo empujes. Miras tus manos: quietas, encima, sin peso. Y el vaso va.\n\nA.\n\nB.\n\nA.\n\nJ.\n\nO.";
      return `
${respuesta}

ABAJO.

~ No lo he empujado.

Miras las manos. Las uñas blancas de apretar.

Nora: Abajo.

Lo dices en voz alta. Con tu voz. Para el móvil. Para que quede.

Te levantas. Dejas el vaso donde está: en la O. Dejas el móvil grabando. Dejas el cuaderno ${api.bandera("cuaderno_cerrado") ? "cerrado en el centro de la mesa" : "abierto por la última página"}.

El arco de la cocina. La sartén ${api.bandera("sarten_tirada") ? "en el fregadero, humeando bajo el agua" : "en el fuego apagado, humeando"}. La puerta del almacén.

Y ${N[u]}.

En el suelo. Con la cabeza en el escalón de piedra. ${api.bandera("xi_final") === "mata" ? "Con la cara que le dejaste." : "Con lo que le dejó."} Pasas por encima. Como se pasa por encima de un charco. Y no te perdonas y no te paras.

La estantería. La puerta antigua. Baja. Con clavos.

Y el candado.

Cerrado.

Cuelga del arco, cerrado, como si nadie hubiera bajado por aquí en cien años. Como si tuvieras que abrirlo tú.

~ Abajo.

La llave inglesa. ${obj === "llave" ? "La tienes en la mano desde antes. Pesa lo que pesa." : "En la caja de herramientas, en el estante, donde la vio Marcos a las tres y media." + (obj ? " Sueltas " + R().OBJETOS[obj] + "." : "")}

Un golpe. Dos. El arco salta al cuarto, con un ruido que se oye en toda la casa y que no le importa a nadie.

La puerta antigua. Tiras. Viene. Y el frío que sube no es el del almacén. Es otro. Más viejo. Con olor a piedra mojada y a madera quemada hace mucho.

La escalera. De piedra. Bajando. Negra a partir del tercer escalón.

${modo(api, "nora", {
  lucido: "~ Un sótano que no está en los planos, debajo de una casa levantada donde quemaron a alguien. Todo lo de esta noche ha subido de aquí. Y yo voy a bajar a verlo, porque he venido a eso, porque a las doce y cuarenta dije «quería pruebas» y esto es la prueba.",
  asustado: "~ Negro a partir del tercero. Y abajo, la campanilla. Y yo con una llave inglesa.",
  tenso: "~ Luz. Lo primero, luz. Lo que sea. Y bajar.",
  ido: "~ El frío que sube huele a lo que hay en el armario, en la buhardilla, en la boca de la niña. Es el mismo. Todo viene de aquí.",
  perdido: "~ Abajo. Ya casi. Ya casi estoy donde me quieren.",
  normal: "~ Vale. Luz. Y bajar. Y apuntarlo después, si hay después.",
})}`;
    },
    opciones: [
      { texto: "La linterna grande. Del estante. Bajar con ella por delante.", a: "xii4_escalera", si: (api) => linternaDisponible(api),
        efecto: (api) => { api.marcar("xii3_luz", "linterna"); api.marcar("nora_luz", true); R().coger(api, "nora", "linterna"); api.est("nora", "lucidez", 2); } },
      { texto: "Una vela. De la mesa. Encenderla con el mechero y bajar con la mano delante de la llama.", a: "xii4_escalera",
        efecto: (api) => { api.marcar("xii3_luz", "vela"); api.marcar("nora_luz", true); R().soltar(api, "nora"); api.est("nora", "eje", 1); } },
      { texto: "El mechero. Solo el mechero. Y la llave inglesa en la otra mano.", a: "xii4_escalera",
        efecto: (api) => { api.marcar("xii3_luz", "mechero"); api.marcar("nora_luz", false); R().coger(api, "nora", "llave"); api.est("nora", "estres", 2); } },
      { texto: "A oscuras. Con las manos en la piedra. Como bajó ella.", a: "xii4_escalera", impulsiva: true,
        efecto: (api) => { api.marcar("xii3_luz", "nada"); api.marcar("nora_luz", false); R().coger(api, "nora", "llave"); R().alimentar(api, 1); api.est("nora", "miedo", 6); } },
    ],
  },

  xii4_escalera: {
    pov: "nora",
    fondo: "assets/fondos/sotano_escalera.jpg",
    ambiente: "almacen",
    musica: "terror",
    lugar: "la escalera", hora: "07:52",
    titulo: "Nora · La escalera",
    alEntrar: (api) => { R().tick(api); api.presenciar("nora", 3); api.est("nora", "estres", 5); },
    texto: (api) => {
      const luz = api.bandera("xii3_luz");
      const orden = porOrden(api);
      const [o1, o2, o3] = [orden[0] || "alex", orden[1] || "irene", orden[2] || "marcos"];
      const inicio = luz === "linterna" ? "La linterna grande. El haz por delante. Piedra. Piedra. Un escalón, y otro, cortados a mano, gastados en el centro por pies que no eran de nadie de esta noche."
        : luz === "vela" ? "La vela. La mano delante de la llama. Y la llama se inclina hacia abajo, hacia donde vas, como si tirara de ella el aire de allí."
        : luz === "mechero" ? "El mechero. La llama pequeña. Se apaga en el tercer escalón. Lo enciendes. Se apaga en el séptimo. No lo enciendes más. La llave inglesa en la otra mano, pesando lo que pesa."
        : "A oscuras. Las manos en la piedra de las paredes, que suda. El pie buscando el borde de cada escalón antes de fiarse. La llave inglesa contra la pierna.";
      return `
${inicio}

Cuentas. El primero. El segundo. El tercero.

El séptimo.

Y desde abajo, con el frío, las voces.

${N[o1]}: ${R().voz(api, o1, 0)}

Con su voz. Con su ritmo. Lo que dijo ${fem(o1) ? "ella" : "él"} esta noche, porque tú lo oíste.

${N[o2]}: ${R().voz(api, o2, 1)}

${N[o3]}: ${R().voz(api, o3, 2)}

Y luego la cuarta.

Nora: ${R().voz(api, "nora", 0)}

Tu voz. Desde abajo. Diciendo lo que dijiste tú.

~ Lo que la casa ha aprendido. Los llamó así. A todos. Con la voz que más pesaba. Y a mí me llama con la mía.

${modo(api, "nora", {
  lucido: "~ Mi voz desde abajo, diciendo lo que dije a las dos. No me está imitando: me está esperando. Ya estoy allí para ella. Lo que baja por la escalera es lo que sobra.",
  asustado: "~ Mi voz. Con mi ritmo. Desde abajo. Y suena a alguien que ya no tiene prisa.",
  tenso: "~ No contestes. No contestes. Cuenta. El octavo. El noveno.",
  ido: "~ Las voces salen de la piedra. La piedra las ha guardado como guarda el frío. Y las suelta a quien baja.",
  perdido: "~ Me llaman con mi voz porque ya soy de ellos. Es lo que hace la lista: al final te lees tú.",
  normal: `~ ${N[o1]}. ${N[o2]}. ${N[o3]}. No son ellos. Lo sé. Y bajo igual.`,
})}

[campanilla]

Tin. Abajo. Cerca.`;
    },
    opciones: [
      { texto: (api) => "Contestar a " + N[porOrden(api)[0] || "alex"] + ". Con lo que le dirías si estuviera.", a: "xii5_sotano",
        efecto: (api) => { api.marcar("xii4_voz", porOrden(api)[0] || "alex"); R().alimentar(api, 1); api.est("nora", "miedo", -3); } },
      { texto: (api) => "Contestar a " + N[porOrden(api)[1] || "irene"] + ". Lo que no le dijiste.", a: "xii5_sotano",
        efecto: (api) => { api.marcar("xii4_voz", porOrden(api)[1] || "irene"); R().alimentar(api, 1); api.est("nora", "miedo", -3); } },
      { texto: (api) => "Contestar a " + N[porOrden(api)[2] || "marcos"] + ". Su nombre. Solo su nombre.", a: "xii5_sotano",
        efecto: (api) => { api.marcar("xii4_voz", porOrden(api)[2] || "marcos"); R().alimentar(api, 1); api.est("nora", "miedo", -3); api.est("nora", "eje", -2); } },
      { texto: "No contestar. Contar. El tercero. El séptimo. Los que hagan falta.", a: "xii5_sotano", lucida: true,
        efecto: (api) => { api.marcar("xii4_voz", "ninguna"); api.est("nora", "lucidez", 2); api.est("nora", "estres", 3); } },
    ],
  },

  xii5_sotano: {
    pov: "nora",
    fondo: "assets/fondos/sotano.webp",
    ambiente: "almacen",
    musica: "terror",
    lugar: "sótano", hora: "07:57",
    titulo: "Nora · La piedra",
    alEntrar: (api) => {
      R().tick(api);
      api.marcar("sotano_visto", true);
      api.saber("nora", "inscripcion");
      api.evidencia("inscripcion_sotano", "nora", "sótano", "marca");
      api.presenciar("nora", 3);
      api.est("nora", "lucidez", -3);
    },
    texto: (api) => {
      const luz = hayLuz(api);
      const c = cam(api);
      const v = api.bandera("xii4_voz");
      const contesto = v && v !== "ninguna" ? `Has contestado a ${N[v]}. Y ${N[v]} no ha contestado más. Es lo que hacen las voces cuando consiguen lo que querían: callarse.` : "No has contestado. Has contado. Diecinueve.";
      return `
${contesto}

El último escalón.

Piedra.

Suelo de piedra, paredes de piedra, el techo a un palmo de la cabeza, con las vigas de la casa encima. Estás debajo del salón. Debajo de la mesa. Arriba, el móvil de ${N[c]} graba una mesa vacía sin hacer ruido.

${luz ? "La luz da en el centro." : "No ves. Y ves. Como se ve en un sueño: porque sabes lo que hay."}

La madera.

Un poste. En el centro. Quemado. Negro hasta arriba, brillante donde ${luz ? "la luz toca" : "no llega la luz"}, como el carbón. Con una argolla de hierro a media altura y una cadena corta en el suelo, con el último eslabón abierto. Y alrededor, en la piedra, el círculo donde no crece ni el polvo.

~ La encerraron. Le prendieron fuego. Lo dijo Álex a las doce y media con la boca llena de cerveza, y se rieron todos.

Y en la piedra. Detrás del poste. A la altura de una niña. Letras. Cortadas con algo pequeño, durante mucho tiempo.

A L D A

~ Alda. La palabra que nadie podía saber. Y estaba aquí abajo toda la noche. Debajo de la mesa. A cuatro metros del vaso.

Y ella.

Sentada en el suelo, con la espalda en el poste, con las rodillas de dos colores juntas. Con la campanilla en la mano grande. Con los párpados cosidos hacia ti.

Y no sonríe.

Por primera vez en toda la noche no sonríe.

Y detrás de ella, donde no llega ${luz ? "la luz" : "nada"}, lo otro. Lo de abajo. No lo ves. Lo oyes respirar. Como respira algo muy grande cuando duerme y no del todo.

~ Aquí.

Con tu voz. Ya no dice abajo. Ya no hace falta.

${modo(api, "nora", {
  lucido: "~ Un poste quemado, una argolla, una palabra. Nivel uno de una historia que no voy a leer entera. Y una niña que no sonríe porque ya no tiene que convencer a nadie. He venido a ver y he visto. Lo que pasa ahora no es una decisión: es el precio de la entrada.",
  asustado: "~ No sonríe. Sonreía cuando faltaba alguien. Ya no falta nadie.",
  tenso: "~ La piedra. La palabra. Tocarla. Apuntarla. Algo. Hacer algo con las manos que no sea temblar.",
  ido: "~ Respira. Detrás de ella. Y respira al ritmo que respiro yo. Lo he traído yo el ritmo. Lo llevo dentro desde las siete y veinticinco.",
  perdido: "~ Aquí. Ya. He llegado. Es lo que dice la lista al final: aquí.",
  normal: "~ Alda. Es un nombre. Es su nombre. Lo sé como se sabe una hora.",
})}`;
    },
    opciones: [
      { texto: "Tocar la piedra. Las letras. Leerlas con los dedos.", a: "xii6_final",
        efecto: (api) => { api.marcar("xii5_nora", "toca"); api.saber("nora", "toque_inscripcion"); api.est("nora", "lucidez", 1); } },
      { texto: "Decir su nombre. El que sabes. «Alda.»", a: "xii6_final",
        efecto: (api) => { api.marcar("xii5_nora", "nombre"); api.marcar("dijo_alda_abajo", true); R().ofrenda(api, "nombre"); R().alimentar(api, 1); api.est("nora", "miedo", 4); } },
      { texto: "Apagar la luz. Ella no la necesita. Tú ya tampoco.", a: "xii6_final", si: (api) => hayLuz(api),
        efecto: (api) => { api.marcar("xii5_nora", "apaga"); api.marcar("nora_luz", false); R().alimentar(api, 2); api.est("nora", "lucidez", -4); } },
      { texto: "Coger la campanilla. De su mano. Es lo que ha estado pidiendo toda la noche.", a: "xii6_final",
        efecto: (api) => { api.marcar("xii5_nora", "campanilla"); api.evidencia("campanilla", "nora", "sótano", "objeto"); api.est("nora", "miedo", 6); } },
      { texto: "Volver. Subir. Con la luz por delante y sin mirar atrás.", a: "xii6_final", si: (api) => hayLuz(api), lucida: true,
        efecto: (api) => { api.marcar("xii5_nora", "sube"); api.est("nora", "estres", 6); api.est("nora", "eje", 2); } },
    ],
  },

  xii6_final: {
    pov: "nora",
    fondo: "assets/fondos/sotano.webp",
    ambiente: "almacen",
    musica: "terror",
    hora: "07:59",
    titulo: (api) => (api.bandera("final") === "B" ? "Nora · La otra cámara" : "Nora · Abajo"),
    alEntrar: (api) => { R().tick(api); decidirFinal(api); api.presenciar("nora", 3); },
    texto: (api) => {
      const x5 = api.bandera("xii5_nora");
      const u = U(api);
      const c = cam(api);
      const luzTipo = api.bandera("xii3_luz");
      const inicio = x5 === "toca" ? "Tocas las letras. Frías. Hondas. La A, la L, la D, la A. Y debajo, con los dedos, notas otra. Que no se ve. Que está empezada."
        : x5 === "nombre" ? "Nora: Alda.\n\nLo dices. Y la niña levanta la cara. Y los ojos, debajo del hilo, se paran."
        : x5 === "apaga" ? "Apagas la luz. Y es verdad: no la necesitas. Se ve igual. Se ve más. Se ve como se ve con los ojos cerrados: lo que hay."
        : x5 === "campanilla" ? "Le coges la campanilla. De la mano grande. Y la deja. Sin badajo, ligera, fría. La levantas.\n\n[campanilla]\n\nY suena igual. Sin badajo. Sin que la muevas."
        : "Te giras. La luz por delante. El primer escalón. El segundo.\n\nY el tercero no está.\n\nHay pared. Piedra. Lisa. Donde estaba la escalera hay pared, y la escalera está detrás de ti, bajando, con la niña en el último escalón.";

      if (api.bandera("final") === "A") return `
${inicio}

[campanilla]

Tin.

Se levanta. Sin prisa. Viene. Un paso, dos, y las manos, la grande y la pequeña, te cogen la cara. Como se coge la cara a alguien para soplarle dentro.

Y no sopla.

Aspira.

Y sale. Lo que entró a las siete y veinticinco por la boca abierta de ${N[u]}. Sube. Garganta. Y sale por la tuya, y lo ves por fin, a un palmo: no es aire. Es como el vaho de enero. Al revés. Hacia ella.

~ Aliento.

Y te quedas vacía. Y eso es lo peor: el frío se va, y en el sitio del frío te quedas tú, sola, con lo que viene.

Te suelta. Caes. ${luzTipo === "linterna" && x5 !== "apaga" ? "La linterna rueda por la piedra y se para contra el poste, alumbrando hacia arriba, hacia las vigas, hacia la mesa." : luzTipo === "vela" && x5 !== "apaga" ? "La vela cae y no se apaga. Se queda de lado, en la piedra, con la llama tumbada, quemando cera." : "A oscuras. Se ve igual."}

Y lo de abajo.

No lo ves entero. Nadie lo ha visto entero. Ves una mano en tu tobillo. Donde estaban las cuatro marcas de las cinco de la mañana. Y tira.

La piedra en la espalda. El poste. La cadena, que alguien cierra en tu tobillo con un ruido de hierro viejo que has oído antes esta noche, en la puerta principal.

Y la niña, que se sienta a mirar. Con la campanilla en el regazo. Como se mira un fuego.

Lo que hace lo de abajo no se cuenta entero. Se cuenta así: duele. Y luego duele menos. Y luego lo que duele es de otra, y tú lo miras desde un poco más lejos, como se mira un fuego.

Y en la piedra, a un palmo de tu cara, con la última luz: A L D A. Y debajo, otra letra. Nueva. Cortada esta noche. Una N.

~ Todavía no.

Con tu voz.

~ Ya.

[negro]`;

      return `
${inicio}

[corte]

Y esto no lo ves tú.

Lo ve el móvil de ${N[c]}. Apoyado contra la caja de la ouija, con la cámara hacia la mesa. Batería: cinco por ciento. Grabando.

En el encuadre: la mitad de la mesa. La tabla, con las letras hacia una silla vacía. Tu silla. El cuaderno${api.bandera("cuaderno_cerrado") ? ", cerrado" : ", abierto"}. El arco de la cocina, al fondo, sin foco. El vaso, no. El vaso queda fuera, a la izquierda.

07:58. Por el arco, de lejos, desde abajo, tu voz. Dice «${R().voz(api, "nora", 0)}». Y luego dice «Alda». Y luego, más bajo, algo que la cámara no coge.

07:59. La campanilla. Sube.

[campanilla]

Tin. Cada cuatro segundos. Más cerca. Luego pasos. Pequeños. Mojados. Cruzan el salón por fuera del encuadre, de derecha a izquierda. Se paran junto a la mesa.

Y el ruido. A la izquierda. Fuera de cámara. Vidrio sobre madera. Despacio. Cinco veces. Con pausas. Como quien deletrea.

Y ya.

Nadie sube. La luz gris de la ventana no cambia. Tu silla, vacía. La tabla. El cuaderno.

Y la cámara sigue grabando porque nadie le ha dicho que pare.

[silencio]`;
    },
    opciones: [{ texto: "...", a: "xii7_mesa" }],
  },

  xii7_mesa: {
    pov: "nora",
    fondo: "assets/fondos/salon_vacio.jpg",
    ambiente: "silencio",
    musica: "silencio",
    lugar: "comedor", hora: "08:00",
    titulo: "La mesa",
    alEntrar: (api) => { api.marcar("fase12_completa", true); api.marcar("prologo_completo", true); },
    texto: (api) => {
      const c = cam(api);
      const A = api.bandera("final") === "A";
      return `
08:00.

La mesa vacía.

El móvil de ${N[c]} graba. Batería: tres por ciento. La tabla. La silla. El cuaderno. La luz gris de la ventana, que no es de ningún amanecer.

Nada.

${A ? "Ni un ruido desde abajo. Lo último que cogió el micrófono fue una voz de mujer diciendo «ya», bajo, como se dice al colgar." : "Ni pasos. Ni campanilla. Ni el vaso, que sigue fuera de plano."} Ni la sartén. La casa quieta, como se queda una habitación cuando ya ha pasado lo que tenía que pasar en ella.

Dos por ciento.

Y en el segundo veinte del último minuto, sin que nada lo justifique, en la esquina del encuadre, en la silla vacía, se hunde el asiento. Un dedo. Como cuando se sienta alguien que no pesa.

Uno por ciento.

Nada.

[negro]

...`;
    },
    opciones: [{ texto: "Continuar", a: "xii8_epilogo" }],
  },

  xii8_epilogo: {
    pov: null,
    fondo: "assets/fondos/portada.jpg",
    ambiente: "silencio",
    musica: "silencio",
    lugar: "un bar de carretera", hora: "diez años después",
    titulo: "Diez años después",
    alEntrar: (api) => { api.marcar("epilogo_visto", true); },
    texto: (api) => epilogo(api),
    final: true,
  },

  });
})();
