/*
 * LA BRUJA — PRÓLOGO
 * Fase VI: Evidencia compartida (HORROR_STAGE 2 → 3) · Biblia §5 (VI), §14–26
 *
 * La primera vez que los cuatro perciben lo mismo a la vez: pasos en el techo, encima de la mesa,
 * en la buhardilla que Nora acaba de cerrar. El clic de la trampilla. La segunda subida, corta,
 * con el huésped ya a nivel 2 (a solas con él puede haber herida, nunca muerte). Las primeras
 * heridas del prólogo: la escalera plegable que cede, la trampilla que se cierra sobre una mano.
 * Una falsa alarma real (una rama contra el tejado) que relaja justo antes de lo gordo. La primera
 * mención de irse. Y el evento imposible: todos ven a alguien subir la escalera, y ese alguien entra
 * por la puerta del porche un momento después. HORROR 3. «Todo el mundo se queda aquí.»
 *
 * Se consume de la V: huesped, huesped_nivel, cree_*, huellas_vistas, nora_toma_muneca, irene_nora,
 * v_quedan, alex_cruzo / marcos_cruzo, las marcas. Se deja para la VII: las heridas, la decisión de
 * irse, quién es el «alguien» del porche, las necesidades, el atizador en la mano de quien lo cogió.
 *
 * Presupuesto de anomalías Fase VI: 4 → voz_nina · sombra_escalera · luz_parpadeo · (los pasos y el
 * clic no cuentan: son el hito de la fase; el evento imposible tampoco)
 */
(() => {
  const R = () => HISTORIA.R;
  const modo = (api, id, m) => m[api.modo(id)] || m.normal;
  const H = (api) => api.bandera("huesped");
  const N = { nora: "Nora", marcos: "Marcos", alex: "Álex", irene: "Irene" };
  const vivosSalvo = (api, id) => R().lista(api, null, id);
  const cargado = (api, id) => api.valor(id, "estres") >= 45 || api.valor(id, "miedo") >= 40 || R().comida(api) >= 1;

  Object.assign(HISTORIA.presupuestoAnomalias, { VI: 4 });
  Object.assign(HISTORIA.deriva, { VI: { estres: 0.5, miedo: 0.3 } });

  const saltoPrevio = HISTORIA.prepararSalto;
  HISTORIA.prepararSalto = (api, id) => {
    if (typeof saltoPrevio === "function") saltoPrevio(api, id);
    if (!/^vi\d/.test(id)) return;
    R().saltoBase(api);
    R().fase(api, "VI", 2, 2);
    if (/^vi[4-8]/.test(id) && !api.bandera("vi_sube")) { api.marcar("vi_sube", "nora_marcos"); api.marcar("vi_pov", "nora"); }
    if (/^vi[5-8]/.test(id) && !api.bandera("vi_herido")) { api.marcar("vi_herido", "marcos"); api.marcar("vi_herida_tipo", "cojera"); R().herir(api, "marcos", "cojera", "escalera"); }
    if (/^vi[5-8]/.test(id) && api.bandera("vi_subida_hecha") === undefined) api.marcar("vi_subida_hecha", true);
    if (/^vi[7-8]/.test(id) && !api.bandera("decision_irse")) api.marcar("decision_irse", "amanecer");
    if (/^vi8/.test(id) && !api.bandera("evento_imposible")) { api.marcar("evento_imposible", true); api.marcar("imposible_quien", "alex"); api.horror(3); }
  };

  // Quién sube a mirar. Esencia antes que estados. Devuelve las cartas posibles (máximo tres).
  function cartasSubida(api) {
    const h = H(api);
    const cartas = [];
    const marcosPuede = R().vivo(api, "marcos");
    const noraQuiere = api.valor("nora", "eje") >= 45 && !api.bandera("fascinacion_rota");
    const ireneConNora = api.bandera("irene_nora") === "alianza" || api.bandera("cree_irene_nora") || (h === "irene" && api.bandera("v_nora_con") !== "irene");
    const alexQuiere = api.valor("alex", "eje") >= 70 && !api.bandera("alex_cruzo");
    if (marcosPuede && noraQuiere) cartas.push({ id: "nora", config: "nora_marcos", desc: "Subir con Marcos. La linterna, la escalera. Y él delante, que es donde quieres que esté." });
    if (marcosPuede) cartas.push({ id: "marcos", config: "marcos", desc: h === "marcos" ? "Subir solo. Con el atizador. Sin que nadie te vea la cara mientras subes." : "Subir solo. Con el atizador. Que se queden los tres juntos abajo." });
    if (ireneConNora) cartas.push({ id: "irene", config: "irene_nora", desc: api.bandera("v_nora_con") === "irene" ? (h === "irene" ? "Subir con Nora. Otra vez. Donde no os oye nadie." : "Subir con Nora. Las dos. Como antes, pero ahora sabiendo lo que hay.") : (h === "irene" ? "Subir con Nora. Las dos. Donde no os oye nadie." : "Subir con Nora. Las dos. Que los hombres se queden abajo.") });
    if (alexQuiere && cartas.length < 3) cartas.push({ id: "alex", config: "alex", desc: "Subir tú. Con el móvil. Que los cadáveres son tuyos desde la leyenda." });
    if (!cartas.length) cartas.push({ id: "marcos", config: "marcos", desc: "Subir solo. Que se queden los tres juntos abajo." });
    return cartas.slice(0, 3);
  }
  function fijarSubida(api, config) {
    api.marcar("vi_sube", config);
    api.marcar("vi_pov", config === "nora_marcos" ? "nora" : config === "irene_nora" ? "nora" : config === "alex" ? "alex" : "marcos");
    if (config === "marcos") R().coger(api, "marcos", "atizador");   // sube con el atizador; Álex sube con lo que lleve
  }

  Object.assign(HISTORIA.escenas, {

  // =====================================================================
  // FASE VI — EVIDENCIA COMPARTIDA
  // =====================================================================

  vi1_pasos: {
    pov: "nora",
    fondo: "assets/fondos/salon_noche.jpg",
    ambiente: "interior",
    musica: "terror_suave",
    lugar: "comedor", hora: "04:05",
    titulo: "La evidencia · Los pasos",
    alEntrar: (api) => {
      R().fase(api, "VI", 2, 2);
      R().tick(api);
      api.marcar("fase6_empezada", true);
      ["nora", "marcos", "alex", "irene"].forEach((p) => api.presenciar(p, 2));
      api.presenciar("nora", 0.5);
    },
    texto: (api) => {
      const h = H(api);
      const huellas = api.bandera("huellas_vistas");
      const marcosSabe = api.sabe("marcos", "huellas_pequenas");
      const ireneSabe = api.sabe("irene", "huellas_pequenas");
      const q = api.bandera("v_quedan");
      return `
Cuatro de la mañana y cinco minutos. Lo sabes porque acabas de escribirlo.

La mesa. La tabla, que nadie ha guardado. Las velas, a dos dedos del plato. ${api.bandera("nora_toma_muneca") ? "La muñeca con los ojos cosidos hacia arriba, al lado de la tabla, donde la dejó Marcos. " : ""}La música, baja, que nadie ha vuelto a quitar. Álex con una cerveza. Irene con su vaso. Marcos con la mano en tu nuca.

Y es entonces.

[toc]

Un paso.

Arriba. En el techo. Justo encima de la mesa.

Nadie dice nada. Álex tiene la cerveza a medio camino. Irene ha dejado de mirar a Álex.

[toc]

Otro.

Un poco más a la izquierda. Hacia la ventana. Como se anda por una habitación que no conoces: despacio, tanteando.

[toc]

Otro.

Y otro. Y otro. Cinco. Seis. Pequeños. No como pisa una persona. Como pisa alguien que pesa la mitad.

Se paran.

Encima de la lámpara. Exactamente encima. Y la lámpara no se mueve, y todos la miráis como si fuera a moverse.

Marcos: Ratas.

Lo dice sin quitar la mano de tu nuca. Con la voz de las explicaciones. ${h === "marcos" ? "Pero la mano está fría y no se mueve." : "Y la mano, caliente, se mueve un poco, como quien acaricia sin darse cuenta."}${api.bandera("marcos_dijo_no_ratas") ? " Lo dice él. El que ha dicho «no eran ratas» hace cinco minutos, a esta mesa, para que constara. Se le ve saberlo, y decirlo igual." : ""}

Nora: No.

Se te ha escapado. Con la voz que no usas.

Álex: Son las de la buhardilla. Las ha despertado Nora.

Nadie se ríe. Ni él.

${api.bandera("v_irene_callada") || h === "irene" ? "Irene mira el techo. Y dice, bajo, sin mover la boca casi:\n\nIrene: Ya.\n\nÁlex: ¿Ya qué?\n\nIrene: Nada." : "Irene se ha pegado a Álex. Con las dos manos en su brazo. Sin darse cuenta de que lo hacía."}

...

Y otra vez.

[toc]

[toc]

Dos pasos. Hacia la trampilla. Hacia el sitio del pasillo donde está la trampilla, ${api.bandera("cuerda_desaparece") ? "que ya no tiene cuerda" : "que cerraste tú con las dos manos"}.

Y nada.

Cuatro personas mirando un techo de madera. Y por primera vez esta noche, los cuatro habéis oído lo mismo. Lo mismo, a la vez, en el mismo sitio. Nadie fumaba. Nadie estaba arriba. Nadie tiene el talón en ningún travesaño.

${huellas ? "~ Las huellas. Iban hacia la pared y no volvían. Y esto ha andado desde la pared hacia la trampilla. Vuelve. Lo que fuera, vuelve." : "~ Pequeño. Lo que sea, es pequeño. Y anda como si tanteara. Como si fuera la primera vez."}

${modo(api, "nora", {
  lucido: `~ Seis pasos, una pausa, dos más. Hacia la trampilla. Con un ritmo. Las ratas no tienen ritmo. ${marcosSabe ? "Marcos las ha visto. Ha dicho ratas y las ha visto." : ireneSabe ? "Irene las ha visto conmigo. Que lo diga ella o que lo diga yo." : "Y yo soy la única de esta mesa que sabe de qué tamaño son los pies."}`,
  asustado: "~ Encima de la lámpara. Se ha parado encima de la lámpara. Como si mirara hacia abajo. Como si nos mirara.",
  tenso: "~ Ratas. Ratas dice. Con la mano helada. Que diga ratas otra vez y le enseño la muñeca.",
  ido: "~ Los pasos han sonado dentro de la lámpara. No encima: dentro. Como si la lámpara tuviera un pasillo.",
  perdido: "~ Ha bajado a vernos. Ha bajado de la pared caliente y ha venido hasta la lámpara a vernos. Ya sabe cuántos somos.",
  normal: "~ Los cuatro. Lo hemos oído los cuatro. Por primera vez no tengo que convencer a nadie. Y no me sirve de nada.",
})}

La mano de Marcos se aparta de tu nuca. Coge la cerveza. No bebe.`;
    },
    opciones: [
      { texto: "«No son ratas. Tienen dedos.» A la mesa. Sin subir la voz.", a: "vi2_clic", si: (api) => api.bandera("huellas_vistas"),
        efecto: (api) => { api.marcar("vi_nora_dijo", "dedos"); api.contar("nora", "alex", "huellas_pequenas"); api.contar("nora", "irene", "huellas_pequenas"); api.est("nora", "eje", 2); api.est("irene", "miedo", 4); api.est("alex", "miedo", 3); } },
      { texto: "Callarte. Contar los pasos. Apuntar cuántos y hacia dónde.", a: "vi2_clic", lucida: true,
        efecto: (api) => { api.marcar("vi_nora_dijo", "cuenta"); api.evidencia("cuaderno_pasos", "nora", "cuaderno de Nora", "nota"); api.est("nora", "lucidez", 1); api.est("nora", "eje", 1); } },
      { texto: "Mirar a Marcos. Que lo diga él, que las ha visto.", a: "vi2_clic", si: (api) => api.sabe("marcos", "huellas_pequenas"),
        efecto: (api) => { api.marcar("vi_nora_dijo", "marcos"); api.marcar("vi_marcos_dice", api.lucido("marcos") && H(api) !== "marcos"); api.rel("nora", "marcos", "confianza", 2); } },
      { texto: "Coger la mano de Marcos por encima de la mesa. Fría. Da igual.", a: "vi2_clic",
        efecto: (api) => { api.marcar("vi_nora_dijo", "mano"); R().contacto(api, "nora", "marcos", 1); api.est("nora", "estres", -2); } },
      { texto: "«Álex. Cállate.» Antes de que haga el chiste.", a: "vi2_clic", impulsiva: true,
        efecto: (api) => { api.marcar("vi_nora_dijo", "alex"); api.rel("alex", "nora", "resentimiento", 3); api.rel("nora", "alex", "resentimiento", 2); api.est("nora", "estres", 4); } },
    ],
  },

  vi2_clic: {
    pov: "marcos",
    titulo: "La evidencia · El clic",
    hora: "04:07",
    alEntrar: (api) => { R().tick(api); if (api.bandera("vi_marcos_dice") === undefined) api.marcar("vi_marcos_dice", false); },
    texto: (api) => {
      const h = H(api);
      const dijo = api.bandera("vi_nora_dijo");
      const inicio = dijo === "dedos" ? `
Nora: No son ratas. Tienen dedos.

Lo ha dicho bajo. A la mesa. Y nadie ha contestado, porque contestar era discutir con los pies que hemos oído todos.` : dijo === "marcos" ? (api.bandera("vi_marcos_dice") ? `
Nora te mira. Sabes lo que te pide.

Marcos: Las he visto. Arriba. Huellas. Pequeñas. Descalzas.

Lo has dicho. Tú. Álex abre la boca y la cierra. Irene te mira como si hubieras hablado en otro idioma.` : `
Nora te mira. Sabes lo que te pide. Y no lo dices. Tienes la palabra en la boca y se te queda ahí, detrás de los dientes, como se queda el aire cuando te lo tragas.

Nora aparta la vista. Se lo apunta.`) : dijo === "mano" ? `
Nora te ha cogido la mano por encima de la mesa. Está fría, la tuya. Lo sabes porque la suya no. Se la aprietas. Es lo único que tienes claro ahora mismo.` : dijo === "alex" ? `
Nora: Álex. Cállate.

Álex no había dicho nada. Iba a decirlo. Se le ve tragárselo. Y no le sienta bien: a Álex nada le sienta peor que un chiste que no sale.` : `
Nora escribe. Sin mirar el cuaderno. Sin mirar a nadie. Escribe como se cuenta con los dedos.`;
      return `${inicio}

Cuatro personas y un techo.

Y entonces, arriba, en el pasillo, un ruido que conoces. Que conocéis todos. Pequeño. Metálico. Un pestillo que suelta.

[clic]

Clic.

La trampilla.

No cae. No se despliega la escalera. No hay traqueteo. Solo el clic. Como cuando alguien empuja una trampilla desde arriba con la palma de la mano, lo justo para que el pestillo suelte, y luego no hace nada más.

Álex: Vale.

Álex: Vale, vale, vale.

Se ha levantado. Sin decidirlo. Tiene la cerveza en la mano y no sabe dónde dejarla.

Irene: Nadie sube.

Lo dice muy rápido. ${h === "irene" ? "Y luego se queda mirando la escalera con la cabeza ladeada, como se escucha una conversación al otro lado de una pared." : "Con las dos manos en el brazo de Álex."}

~ Un pestillo suelto. Una trampilla mal encajada que cede con el peso de la madera al enfriarse. ${api.bandera("cuerda_desaparece") ? "Sin cuerda. Una trampilla sin cuerda no la abre nadie desde abajo. Desde arriba sí." : "Nora la cerró con las dos manos. Nora cierra las cosas bien."}

~ Ratas. Ratas de veinte kilos con manos.

Y te levantas. Porque eres el que se levanta. Porque hay un problema arriba y los problemas son tuyos, y eso lleva siendo verdad desde primero de carrera.

${h === "marcos" ? `Y al levantarte te llega. Con tu voz. Sin que la pienses.

~ ${R().intrusion(api, "marcos", 2)}

Te quedas de pie. Con la mano en el respaldo. Un segundo. Dos. Nora te mira. Tardas en saber que te mira.` : ""}

El atizador está al lado de la chimenea. De hierro, negro, con el gancho. Lo miras. Lo has mirado tres veces esta noche sin saber por qué.

${modo(api, "marcos", {
  lucido: "~ Subir a mirar. Con luz. Con algo en la mano. Mirar, no encontrar nada, bajar. Es lo que hace un adulto en una casa con ruidos. Y es lo que hace un idiota en una película. Las dos cosas son verdad.",
  asustado: "~ El clic ha sido suave. Como si lo hubieran hecho con cuidado. Como si no quisieran despertarnos.",
  tenso: "~ Nadie sube. Muy bien, Irene. Pues alguien tendrá que subir. Y ese alguien tiene mi cara desde hace cinco años.",
  ido: "~ El clic ha sonado dos veces. Una arriba y otra aquí, en la nuca, un poco después. Como todo esta noche.",
  perdido: `~ ${h === "marcos" ? "Todavía no. Que nadie suba todavía. Primero tiene que bajar." : "Ha abierto. Nos ha abierto la puerta. Está esperando a que subamos, y va a subir el que ella elija."}`,
  normal: "~ Subir. Mirar. Bajar. Y esta vez con el atizador, que no quita nada y tranquiliza.",
})}`;
    },
    opciones: [
      { texto: "Coger el atizador. Sin decir nada. Y mirar la escalera.", a: "vi3_reparto",
        efecto: (api) => { R().coger(api, "marcos", "atizador"); api.marcar("vi_marcos_atizador", true); api.est("marcos", "eje", 3); } },
      { texto: "«Nadie sube solo. Y nadie se queda solo.» Y que se organice la mesa.", a: "vi3_reparto",
        efecto: (api) => { api.marcar("vi_marcos_regla", true); api.est("marcos", "eje", 2); api.rel("nora", "marcos", "confianza", 3); api.rel("irene", "marcos", "afecto", 2); } },
      { texto: "Sacar el móvil. Grabar la escalera desde abajo. Un minuto. Por si algo baja.", a: "vi3_reparto", lucida: true,
        efecto: (api) => { api.evidencia("video_escalera", "marcos", "móvil de Marcos, salón", "video"); api.marcar("vi_marcos_graba", true); api.est("marcos", "lucidez", 1); } },
      { texto: "Quedarte de pie. Mirar la escalera. Y no moverte. «Todavía no.»", a: "vi3_reparto", si: (api) => H(api) === "marcos",
        efecto: (api) => { api.marcar("vi_marcos_todavia", true); R().lapso(api); api.saber("nora", "marcos_raro"); api.est("marcos", "lucidez", -2); api.est("nora", "miedo", 4); } },
    ],
  },

  vi3_reparto: {
    pov: null,
    fondo: "assets/fondos/salon_vacio.jpg",
    titulo: "La evidencia · Quién sube",
    hora: "04:09",
    alEntrar: (api) => R().tick(api),
    texto: (api) => {
      const h = H(api);
      const cartas = cartasSubida(api);
      const regla = api.bandera("vi_marcos_regla");
      return `
${api.bandera("vi_marcos_atizador") ? "Marcos tiene el atizador en la mano. No lo ha levantado. Lo lleva como se lleva un paraguas." : api.bandera("vi_marcos_todavia") ? "Marcos está de pie, quieto, mirando la escalera. Ha dicho «todavía no» a nadie. Nora lo ha oído. Irene también." : regla ? "Marcos: Nadie sube solo. Y nadie se queda solo.\n\nLo ha dicho con la voz de las reglas. Y por una vez nadie ha discutido una regla de Marcos." : "Marcos está de pie con la mano en el respaldo. Álex está de pie con la cerveza. Irene está sentada con las dos manos en la mesa. Nora tiene el cuaderno abierto y no escribe."}

Hay que subir. Lo sabéis todos. No por valor: porque no subir es quedarse en una mesa debajo de una trampilla abierta hasta que amanezca, y faltan tres horas.

${h === "irene" ? "Irene no ha vuelto a decir «nadie sube». Mira la escalera como quien ya ha decidido." : "Irene: Que suba el que quiera. Yo no. Yo no subo."}

${cartas.some((c) => c.id === "alex") ? "Álex: Subo yo. Que los cadáveres son míos desde la historia.\n\nLo dice con la sonrisa. Casi." : api.valor("alex", "eje") >= 70 && !api.bandera("alex_cruzo") ? "Álex: Subo yo.\n\nNadie le contesta. Ni él se lo cree: se sienta y mira la cerveza." : "Álex no se ofrece. Álex, que se ofrece para todo. Se sienta. Mira la cerveza."}

${api.valor("nora", "eje") >= 45 && !api.bandera("fascinacion_rota") ? "Nora: Yo subo. Es mi cuerda. Era.\n\nMarcos la mira. No dice que no. No dice que sí." : "Nora no dice nada. Ha dejado de querer subir en algún momento de esta noche y no sabe cuándo."}

La escalera. El tercero. El séptimo. Y arriba, el pasillo, y la trampilla con el pestillo suelto.

¿Quién sube?`;
    },
    personajes: [
      { id: "nora", si: (api) => cartasSubida(api).some((c) => c.id === "nora"),
        descripcion: (api) => (cartasSubida(api).find((c) => c.id === "nora") || {}).desc, a: "vi4_arriba",
        efecto: (api) => fijarSubida(api, "nora_marcos") },
      { id: "marcos", si: (api) => cartasSubida(api).some((c) => c.id === "marcos"),
        descripcion: (api) => (cartasSubida(api).find((c) => c.id === "marcos") || {}).desc, a: "vi4_arriba",
        efecto: (api) => fijarSubida(api, "marcos") },
      { id: "irene", si: (api) => cartasSubida(api).some((c) => c.id === "irene"),
        descripcion: (api) => (cartasSubida(api).find((c) => c.id === "irene") || {}).desc, a: "vi4_arriba",
        efecto: (api) => fijarSubida(api, "irene_nora") },
      { id: "alex", si: (api) => cartasSubida(api).some((c) => c.id === "alex"),
        descripcion: (api) => (cartasSubida(api).find((c) => c.id === "alex") || {}).desc, a: "vi4_arriba",
        efecto: (api) => fijarSubida(api, "alex") },
    ],
  },

  vi4_arriba: {
    pov: (api) => api.bandera("vi_pov") || "nora",
    fondo: "assets/fondos/buhardilla_oscura.jpg",
    ambiente: "arriba",
    musica: "terror",
    lugar: "buhardilla", hora: "04:12",
    titulo: "La evidencia · La segunda subida",
    alEntrar: (api) => {
      R().tick(api);
      const c = api.bandera("vi_sube") || "nora_marcos";
      const h = H(api);
      api.marcar("vi_subida_hecha", true);
      api.marcar("huellas_vuelven", true);
      // Las huellas vuelven: las ve quien sube. La muñeca, si se quedó, ya no está en la caja.
      const suben = c === "nora_marcos" ? ["nora", "marcos"] : c === "irene_nora" ? ["nora", "irene"] : [c];
      suben.forEach((p) => { api.saber(p, "huellas_vuelven"); api.presenciar(p, 2); });
      if (!api.bandera("nora_toma_muneca")) { api.marcar("muneca_desaparecida", true); suben.forEach((p) => api.saber(p, "muneca_no_esta")); }
      // La voz de la niña: solo con dos semillas (huellas y muñeca), y dentro del presupuesto
      const semillas = (api.bandera("huellas_vistas") ? 1 : 0) + (api.sabe("nora", "muneca") ? 1 : 0);
      const voz = semillas >= 2 && api.anomalia("voz_nina");
      api.marcar("voz_nina", voz);
      if (voz) suben.forEach((p) => { api.saber(p, "voz_nina"); api.presenciar(p, 2); });
      // Heridas: la primera del prólogo. A solas con el huésped cargado, la trampilla sobre la mano. Si no, la escalera que cede.
      let herido = null, tipo = "cojera", como = "escalera";
      if (c === "nora_marcos" && h === "marcos" && cargado(api, "marcos")) { herido = "nora"; tipo = "mano"; como = "trampilla"; api.marcar("vi_huesped_hirio", true); R().lapso(api); R().aSolas(api, "nora"); api.saber("nora", "marcos_me_hirio"); }
      else if (c === "irene_nora" && h === "irene" && cargado(api, "irene")) { herido = "nora"; tipo = "mano"; como = "trampilla"; api.marcar("vi_huesped_hirio", true); R().lapso(api); R().aSolas(api, "nora"); api.saber("nora", "irene_me_hirio"); }
      else if (c === "nora_marcos") { herido = "marcos"; if (h === "marcos") R().aSolas(api, "nora"); }
      else if (c === "irene_nora") { herido = "irene"; if (h === "irene") R().aSolas(api, "nora"); }
      else herido = c;
      api.marcar("vi_herido", herido); api.marcar("vi_herida_tipo", tipo);
      R().herir(api, herido, tipo, como);
      if (tipo === "cojera") api.evidencia("escalon_roto", herido, "escalera de la buhardilla", "objeto");
      if (c === "marcos" && h === "marcos") R().lapso(api);
    },
    texto: (api) => {
      const c = api.bandera("vi_sube") || "nora_marcos";
      const h = H(api);
      const pov = api.bandera("vi_pov") || "nora";
      const voz = api.bandera("voz_nina");
      const muneca = api.bandera("muneca_desaparecida");
      const herido = api.bandera("vi_herido");
      const tipo = api.bandera("vi_herida_tipo");
      const atiz = R().lleva(api, "marcos", "atizador");

      const arriba = `
Polvo. Cajas. La silla sin asiento. ${api.bandera("nora_toma_muneca") ? "La viga quemada con sus siete rayas." : "La viga quemada con sus siete rayas, y la séptima brilla más que antes."}

Y las huellas.

Las de antes: desde la trampilla hasta la pared caliente, doce, trece, que no volvían.

Y otras.

Desde la pared hasta aquí. Hasta la trampilla. Más juntas. Más hondas. Como pisa alguien que ya sabe el camino. Encima de las de antes, cruzándolas, y la última justo al borde del hueco, donde tienes la mano.

Vuelven. Lo que fuera, ha vuelto.

${muneca ? "Y la caja. La de madera, junto a la pared. Abierta. Vacía. La muñeca no está. Nadie ha subido desde entonces. Nadie de vosotros." : "La caja de madera, junto a la pared caliente, sigue abierta y vacía. Se la llevó Nora. Eso lo sabéis. Es lo único de aquí arriba que sabéis."}

${voz ? `Y entonces, desde la pared caliente, bajo, muy bajo, como se cuenta en un juego:

Uno.

Una voz. De niña. Sin cuerpo. Sin dirección. En la madera.

Dos.

...

Tres.

Y nada más. Tres. Como si contara y se hubiera quedado sin dedos.` : "Nada más. El polvo. El frío quieto. La pared caliente. Y el silencio de un sitio donde algo acaba de dejar de andar."}`;

      if (c === "nora_marcos") return `
Marcos delante. ${atiz ? "Con el atizador en una mano y la linterna del móvil en la otra." : "Con la linterna del móvil."} Tú detrás. El tercero. El séptimo.

El pasillo. La lámpara de llama falsa. La alfombra. Y la trampilla, encajada, con el pestillo suelto: se ve la raya negra del hueco, un dedo, como una boca cerrada sin apretar. ${api.bandera("cuerda_desaparece") ? "Sin cuerda." : "La cuerda quieta."}

Marcos la empuja con ${atiz ? "el gancho del atizador" : "la palma"}. Cede. La escalera baja con su traqueteo, hasta la alfombra.

Marcos: Subo yo.

${h === "marcos" ? "Lo dice sin mirarte. Con la cara levantada hacia el hueco, como si allí arriba hubiera alguien esperándole." : "Lo dice como se dice «yo conduzco». Y sube."}

${herido === "marcos" ? `Sube. El primer peldaño. El segundo. El tercero. El cuarto, el que cedía, cede del todo.

CRACK.

La madera se parte y el pie de Marcos se va con ella, hasta la rodilla, y el resto de Marcos se queda colgado de los brazos, y ${atiz ? "el atizador cae a la alfombra" : "el móvil cae a la alfombra, con la linterna hacia arriba,"} con un ruido que oye toda la casa.

Marcos: Joder. Joder, joder.

Le sujetas por la cintura. Saca la pierna. Tiene el tobillo torcido hacia un sitio que no es el suyo, y la cara blanca, y aun así dice:

Marcos: Estoy bien.

No está bien. Se sienta en la alfombra con el pie en alto. Y tú subes. Sola. Por los peldaños que quedan, saltándote el cuarto.` : `Sube. Los peldaños crujen bajo su peso, y el cuarto cede un poco, y aguanta. Desaparece por el hueco. Los pies, y luego nada.

Subes detrás.

Y cuando tienes la cabeza por el hueco y las manos en el borde, la trampilla cae.

CLACK.

Sobre tus dedos. Los de la mano derecha. Contra el marco. Todo el peso de la madera y de la escalera plegada, y algo más.

Gritas. No sabías que gritabas así.

Y la trampilla no sube. Alguien la sujeta desde arriba. Con el peso. Con las dos manos. Ves las zapatillas de Marcos, a un palmo de tu cara, plantadas encima.

Marcos: Todavía no.

Nora: ¡MARCOS!

Un segundo. Dos. Tres.

Y sube. La trampilla. Y la mano sale, y no es tu mano: es una cosa hinchada y roja que no cierra.

Marcos: ¿Qué? ¿Qué ha pasado?

Se arrodilla. Te la coge. Se le ve no saber. Se le ve no acordarse. Y eso es peor que la mano.`}
${arriba}

${modo(api, "nora", {
  lucido: `~ ${herido === "marcos" ? "Un peldaño podrido. Es lo primero que ha cedido en toda la noche que se puede explicar entero. Y no me sirve, porque las huellas vuelven." : "«Todavía no.» Con las botas encima. Y no se acuerda. Marcos no miente: Marcos explica. Y no ha podido explicarme la mano."} ${voz ? "Y ha contado hasta tres. Hasta tres." : ""}`,
  asustado: `~ ${voz ? "Uno, dos, tres. Nos cuenta. Cuenta a los que van a ir." : "Vuelven. Las huellas vuelven. Y la última está donde tenía la mano."}`,
  tenso: "~ Abajo. Bajar. Con Marcos o sin él. Y no volver a subir aquí en lo que queda de noche.",
  ido: `~ ${muneca ? "La muñeca se ha ido andando. Con sus pies. Las huellas nuevas son suyas." : "Las huellas nuevas son más hondas. Pesa más ahora. Ha comido."}`,
  perdido: `~ ${h === "marcos" ? "Le tiene. Le ha puesto encima de la trampilla para que yo no bajara. Todavía no. Todavía no qué. Todavía no yo." : "Ha bajado a vernos y ha vuelto a subir. Ya sabe cuál es cuál. Ya ha elegido."}`,
  normal: "~ Vuelven. Bien. Ya sabemos que vuelven. Ahora abajo, y que nadie diga ratas.",
})}`;

      if (c === "irene_nora") return `
Irene delante. Descalza. ${h === "irene" ? "No ha cogido linterna. No ha mirado atrás." : "Con tu móvil de linterna, porque el suyo se lo ha dejado en la mesa, y con la cara de quien hace algo por segunda vez y sabe que la segunda es peor."} Tú detrás.

El pasillo. La trampilla con el pestillo suelto: la raya negra del hueco, un dedo. ${api.bandera("cuerda_desaparece") ? "Sin cuerda." : "La cuerda quieta."}

Irene la empuja con la palma. Cede. La escalera baja con su traqueteo.

${herido === "irene" ? `Nora: Subo yo.

Irene: No. Sube tú primera y yo me quedo mirando el hueco como una imbécil. No. Subo yo.

Y sube. El primer peldaño. El segundo. El cuarto, descalza, cede del todo.

CRACK.

La madera se parte y el pie de Irene se va con ella, hasta la rodilla, y el resto de Irene se queda colgado de los brazos, gritando algo que no es una palabra.

La sujetas por la cintura. Saca la pierna. El tobillo torcido hacia un sitio que no es el suyo. Un arañazo largo por la pantorrilla, con la madera dentro.

Irene: No pasa nada. No pasa nada.

Pasa. Se sienta en la alfombra con el pie en alto y la cara gris. Y tú subes. Sola. Saltándote el cuarto.` : `Sube. Descalza, ligera, el cuarto peldaño cede un poco y aguanta. Desaparece por el hueco.

Subes detrás.

Y cuando tienes la cabeza por el hueco y las manos en el borde, la trampilla cae.

CLACK.

Sobre tus dedos. Los de la mano derecha. Contra el marco. Todo el peso de la madera y de la escalera plegada, y algo más.

Gritas.

Y la trampilla no sube. Alguien la sujeta desde arriba. Ves los pies descalzos de Irene, a un palmo de tu cara, plantados encima.

Irene: Todavía no.

Nora: ¡IRENE!

Un segundo. Dos. Tres.

Y sube. Y la mano sale, y no es tu mano: es una cosa hinchada y roja que no cierra.

Irene: ¿Qué? ¿Qué te ha pasado?

Se arrodilla. Te la coge, con las manos frías. Se le ve no saber. Se le ve no acordarse. Y a ti se te ve saberlo.`}
${arriba}

${modo(api, "nora", {
  lucido: `~ ${herido === "irene" ? "Un peldaño podrido. Lo único explicable de la noche, y le ha tocado a ella descalza." : "«Todavía no.» Con los pies encima. Y no se acuerda. Y yo con la mano así y ella preguntando qué me ha pasado."} ${voz ? "Y ha contado hasta tres." : ""}`,
  asustado: `~ ${voz ? "Uno, dos, tres. Nos cuenta. Somos cuatro. Le falta uno." : "Vuelven. Y la última huella está donde tenía la mano. Como si me hubiera pisado."}`,
  tenso: "~ Abajo. Ya. Y que no vuelva a subir nadie. Y que Irene no me toque.",
  ido: `~ ${muneca ? "La muñeca se ha ido andando. Con sus pies. Y ha vuelto para mirarnos." : "Las huellas nuevas son más hondas. Pesa más. Ha comido."}`,
  perdido: `~ ${h === "irene" ? "Le tiene. Ha puesto a Irene encima de la trampilla. Todavía no. Todavía no yo. Primero otro." : "Ha bajado a vernos y ha vuelto a subir. Ya sabe cuál es cuál."}`,
  normal: "~ Vuelven. Bien. Ya lo sabemos. Ahora abajo, y que nadie diga ratas.",
})}`;

      if (c === "alex") return `
Subes tú. Con el móvil grabando desde antes de la escalera, porque si vas a subir a una buhardilla con ruidos a las cuatro de la mañana, que quede.

Álex: Documental número cinco. Los cadáveres.

Nadie se ríe abajo. Se te oye a ti, y luego el tercero, y el séptimo.

El pasillo. La trampilla con el pestillo suelto. ${api.bandera("cuerda_desaparece") ? "Sin cuerda. Eso lo dijo Nora y nadie la creyó, y ahora lo ves." : "La cuerda quieta."} La empujas con la mano. Cede. La escalera baja con su traqueteo.

Álex: Ahí arriba están los cadáveres.

Lo dices a cámara. Te sale menos gracioso que las otras veces.

Subes. El primer peldaño. El segundo. El cuarto cede del todo.

CRACK.

La madera se parte y el pie se va con ella, hasta la rodilla, y el móvil sale volando y cae en la alfombra grabando el techo, y tú te quedas colgado de los brazos con el tobillo torcido hacia un sitio que no es el suyo.

Álex: Joder. Joder, joder, joder.

Sacas la pierna. Duele como duele lo que está roto. Y aun así subes. Los peldaños que quedan. A pulso. Porque bajar ahora sería volver con la cara de quien se ha caído de una escalera, y tú prefieres cualquier cosa a esa cara.
${arriba}

${modo(api, "alex", {
  lucido: `~ Huellas de ida y huellas de vuelta. Las de vuelta son nuevas: el polvo de los bordes no ha caído. Esto ha pasado hace minutos. Mientras estábamos abajo oyendo. ${voz ? "Y ha contado. Hasta tres. Con voz de niña." : ""}`,
  asustado: `~ ${voz ? "Uno, dos, tres. Me ha contado a mí. A mí solo. Como si yo valiera por tres." : "Vuelven. Yo dije que había cadáveres. No dije que anduvieran."}`,
  tenso: "~ El tobillo. El puto tobillo. Y el móvil abajo grabando el techo. Y yo aquí con lo que yo mismo me inventé.",
  ido: `~ ${muneca ? "La muñeca ha bajado a por mí. Es lo que hacen. Bajan a por el que las cuenta." : "El polvo se mueve. Alrededor de las huellas. Como si respirara."}`,
  perdido: "~ Está aquí. En la pared caliente. Me está mirando contar y le gusta que sea yo.",
  normal: "~ Vale. Vale. Vuelven. Eso se lo cuento a Nora con la cara de no haberme caído.",
})}`;

      // Marcos solo
      return `
Subes solo. ${atiz ? "Con el atizador en una mano y la linterna del móvil en la otra." : "Con la linterna del móvil."} Porque lo has dicho tú, y porque los tres juntos abajo es mejor que dos y dos, y porque eres el que sube.

El tercero. El séptimo. El pasillo. La trampilla con el pestillo suelto: la raya negra del hueco, un dedo. ${api.bandera("cuerda_desaparece") ? "Sin cuerda." : "La cuerda quieta."}

${h === "marcos" ? `Y antes de tocarla te llega. Con tu voz.

~ ${R().intrusion(api, "marcos", 2)}

Te quedas con la mano a un palmo de la madera. Un segundo. Dos. Y luego la empujas, y no sabes si has decidido tú.` : "La empujas con la palma. Cede."} La escalera baja con su traqueteo, hasta la alfombra.

Subes. El primer peldaño. El segundo. El tercero. El cuarto cede del todo.

CRACK.

La madera se parte y el pie se va con ella, hasta la rodilla, y el resto de ti se queda colgado de los brazos, y ${atiz ? "el atizador cae a la alfombra con un ruido que oye toda la casa" : "el móvil cae a la alfombra y sigue encendido, iluminando el techo"}.

Marcos: Joder.

Desde abajo, Nora dice tu nombre. Dos veces. Tres.

Marcos: Estoy bien.

Sacas la pierna. El tobillo torcido hacia un sitio que no es el suyo. Duele como duele lo que está roto, y aun así subes los peldaños que quedan, porque bajar ahora sería bajar sin haber mirado, y eso no.
${arriba}

${modo(api, "marcos", {
  lucido: `~ Huellas de ida y de vuelta. Las de vuelta con el polvo de los bordes intacto: minutos. Ha pasado mientras estábamos abajo. ${voz ? "Y ha contado hasta tres. Con voz de niña. Yo no tengo nombre para esto. Es la segunda cosa de la noche sin nombre." : "Y el tobillo. Eso sí tiene nombre."}`,
  asustado: `~ ${voz ? "Uno, dos, tres. Me ha contado a mí. Solo. Y ha parado en tres." : "Vuelven. Y yo aquí con un tobillo roto y una linterna, y abajo tres personas que creen que subir era una buena idea."}`,
  tenso: "~ Un peldaño podrido. Un puto peldaño podrido. Y las huellas. Que las huellas se expliquen solas, que yo con el peldaño tengo bastante.",
  ido: "~ El polvo se mueve alrededor de las huellas. Como si respirara. Como si las huellas respiraran.",
  perdido: `~ ${h === "marcos" ? "Abajo. Me lo ha dicho al subir. Abajo. Y he subido. Le he llevado la contraria y me ha roto el pie." : "Está aquí. En la pared caliente. Me ha visto caerme y le ha gustado."}`,
  normal: "~ Vuelven. Vale. Ahora abajo, con el pie como esté, y que nadie diga ratas. Ni yo.",
})}`;
    },
    opciones: [
      { texto: "Bajar. Ya. Y cerrar la trampilla con lo que haya.", a: "vi5_rama",
        efecto: (api) => { api.marcar("vi_bajada", "cierra"); const p = api.bandera("vi_pov") || "nora"; api.est(p, "estres", 3); } },
      { texto: "Fotografiar las huellas nuevas. Con las viejas. Con la caja.", a: "vi5_rama", lucida: true,
        efecto: (api) => { api.marcar("vi_bajada", "foto"); const p = api.bandera("vi_pov") || "nora"; api.evidencia("foto_huellas_vuelven", p, "buhardilla", "foto"); api.est(p, "lucidez", 1); } },
      { texto: "Poner la mano en la pared caliente. Donde empiezan. Solo un segundo.", a: "vi5_rama", impulsiva: true,
        efecto: (api) => { api.marcar("vi_bajada", "pared"); const p = api.bandera("vi_pov") || "nora"; api.est(p, "miedo", 6); api.presenciar(p, 1.5); api.saber(p, "pared_caliente"); } },
      { texto: "«¿Quién está ahí?» A la pared. En voz alta.", a: "vi5_rama", si: (api) => api.bandera("voz_nina"),
        efecto: (api) => { api.marcar("vi_bajada", "habla"); const p = api.bandera("vi_pov") || "nora"; api.est(p, "eje", p === "nora" ? 3 : -2); api.est(p, "miedo", 4); R().ofrenda(api, "nombre"); } },
    ],
  },

  vi5_rama: {
    pov: "alex",
    fondo: "assets/fondos/salon_noche.jpg",
    ambiente: "interior",
    musica: "terror_suave",
    lugar: "comedor", hora: "04:18",
    titulo: "La evidencia · La rama",
    alEntrar: (api) => {
      R().tick(api);
      ["nora", "marcos", "alex", "irene"].forEach((p) => api.est(p, "estres", -4));   // el susto que se explica
      api.est("marcos", "eje", 5);
    },
    texto: (api) => {
      const c = api.bandera("vi_sube") || "nora_marcos";
      const herido = api.bandera("vi_herido");
      const tipo = api.bandera("vi_herida_tipo");
      const h = H(api);
      const heridaTxt = herido === "alex" ? "Tú con el tobillo en alto sobre una silla, hinchado como una fruta, y la cara de que no duele. Duele." : tipo === "mano" ? "Nora con la mano derecha envuelta en un paño de cocina con hielo, roja, que no cierra. " + (h === "marcos" ? "Marcos a su lado sin tocarla, con la cara de quien ha hecho algo y no sabe qué." : "Irene a dos sillas de ella, mirándose las manos.") : herido === "marcos" ? "Marcos con el tobillo en alto sobre una silla, hinchado, y la cara de que no duele. Duele. Se lo ves en la mandíbula." : "Irene con el tobillo en alto sobre una silla y un arañazo largo por la pantorrilla que Nora le ha limpiado con un paño y vodka. No se ha quejado. Eso, en Irene, es raro.";
      const cuenta = c === "alex" ? "Lo has contado. Las huellas nuevas, la caja, " + (api.bandera("voz_nina") ? "la voz que contaba. Lo has contado con detalle, con más detalle del que hubo, y nadie ha dicho nada, ni Marcos." : "el polvo. Y por una vez has contado menos de lo que hubo.") : c === "marcos" ? "Marcos lo ha contado. Las huellas de vuelta. " + (api.bandera("voz_nina") ? "Y la voz. Marcos. Diciendo «he oído una voz» delante de ti. Se lo vas a recordar el resto de su vida, si hay resto." : "Con la voz de las explicaciones, y sin ninguna explicación.") : "Nora lo ha contado. Las huellas de vuelta" + (api.bandera("muneca_desaparecida") ? ", la caja vacía" : "") + (api.bandera("voz_nina") ? ", la voz que contaba hasta tres. Marcos ha asentido. Marcos. Asintiendo a una voz." : ". Marcos ha asentido. Eso es nuevo: Marcos asintiendo a Nora delante de todos.");
      return `
${heridaTxt}

${cuenta}

Y la trampilla, cerrada otra vez. Encajada a pulso, con la escalera plegada dentro. Con el pestillo suelto, que ya no sujeta nada, y lo sabéis.

Cuatro de la mañana y dieciocho minutos. Lo ha dicho Nora. Nora dice la hora como otros rezan.

${modo(api, "alex", {
  lucido: "~ Huellas que vuelven y un tobillo roto. Lo segundo lo entiendo. Lo primero es la primera cosa de esta noche que no puedo convertir en un chiste, y lo he intentado.",
  asustado: "~ Cuenta hasta tres. Y somos cuatro. Uno sobra. Uno se lo lleva.",
  tenso: "~ Nadie habla. Cuatro personas y nadie habla. Es lo peor que puede pasar en una mesa. Que alguien diga algo. Que lo diga yo.",
  ido: "~ El techo está más bajo que antes. Un poco. Como si la casa se hubiera sentado con nosotros.",
  perdido: "~ Nos han contado. Uno, dos, tres. Y el cuarto es el que cuenta. Es la que cuenta. Ella.",
  normal: "~ Vale. Documental número cinco, huellas que andan. Y ahora que alguien abra una cerveza o me abro yo.",
})}

Y entonces:

[golpe]

BUM.

Encima. En el tejado. Un golpe seco, enorme, de algo que cae con peso y arrastra al caer, y toda la casa lo oye, y la lámpara se balancea.

Irene grita. Corto. Con la mano en la boca.

Nora se ha levantado. Marcos ${herido === "marcos" ? "ha intentado levantarse y se ha vuelto a sentar con la cara blanca" : "ya está de pie"}. Tú tienes la cerveza en la mano y la mano no se mueve.

Nadie respira.

Y Marcos ${herido === "marcos" ? (R().lleva(api, "marcos", "atizador") ? "señala la ventana con el atizador" : "señala la ventana desde la silla") : "va a la ventana. Con la linterna"}.

Marcos: La rama.

Nora: ¿Qué rama?

Marcos: La del pino grande. La que colgaba encima del porche. Se ha caído.

Y es verdad. Se ve desde aquí, con la linterna: una rama del grosor de un brazo, partida, encima del tejado del porche, con las agujas todavía verdes. Real. Con peso. Con una explicación.

Marcos: Ha estado toda la noche crujiendo. Lo dije al llegar.

No lo dijo. Da igual. Tiene razón. Esta vez tiene razón, y se le ve en la cara lo que le gusta tener razón, y por una vez te alegras por él.

Irene se ríe. Una risa que no es de risa. Nora se sienta. Y algo se suelta en la mesa, como una cuerda, y se oye soltarse.

Álex: Producción de alto nivel.

Lo has dicho tú. Te ha salido. Y Marcos se ríe. Marcos, que no hacía un chiste desde la ouija.

${modo(api, "alex", {
  lucido: "~ Una rama. Una rama de verdad, con agujas, con peso. La única cosa de esta noche que ha pasado como pasan las cosas. Y nos hemos reído como si nos hubieran perdonado.",
  asustado: "~ Una rama. Vale. Una rama. Y las huellas no son una rama.",
  tenso: "~ Por fin. Por fin algo que se cae y es una rama. Que se caiga todo el pino. Que se caiga el tejado, pero que sea el tejado.",
  ido: "~ La rama ha caído justo cuando nadie hablaba. Como si la casa no soportara el silencio. Como yo.",
  perdido: "~ Ha tirado una rama para que nos riamos. Para que bajemos la guardia. Sabe lo que hace una rama en una mesa así.",
  normal: "~ Una rama. Un chiste. Marcos riéndose. Vale. Vale. Igual todavía es una fiesta.",
})}`;
    },
    opciones: [
      { texto: "Abrir una cerveza. Ponérsela a Marcos delante. «Por la rama.»", a: "vi6_irse",
        efecto: (api) => { api.marcar("vi_alex_rama", "cerveza"); api.consumir("alex", "cerveza"); api.consumir("marcos", "cerveza"); api.rel("alex", "marcos", "afecto", 4); api.rel("marcos", "alex", "afecto", 3); api.est("alex", "estres", -3); } },
      { texto: "«Una rama. Y lo de arriba no.» Decirlo. Que no se quede en la rama.", a: "vi6_irse",
        efecto: (api) => { api.marcar("vi_alex_rama", "arriba"); api.est("alex", "eje", -2); ["nora", "marcos", "irene"].forEach((p) => api.est(p, "estres", 3)); api.rel("nora", "alex", "confianza", 4); } },
      { texto: "Sacar el móvil. Grabar el techo. Un minuto entero, en silencio.", a: "vi6_irse", lucida: true,
        efecto: (api) => { api.marcar("vi_alex_rama", "graba"); api.evidencia("video_techo", "alex", "salón", "video"); api.est("alex", "lucidez", 1); } },
      { texto: "Coger la sartén de hierro de la cocina y dejarla al lado de tu silla. Sin explicar.", a: "vi6_irse",
        efecto: (api) => { api.marcar("vi_alex_rama", "sarten"); if (R().lleva(api, "alex", "llave")) api.marcar("llave_inglesa", "cocina"); R().coger(api, "alex", "sarten"); api.est("alex", "eje", 2); api.est("irene", "miedo", 2); } },
      { texto: "Mirar la puerta. Solo mirarla. Un rato.", a: "vi6_irse", si: (api) => api.bandera("alex_cruzo"),
        efecto: (api) => { api.marcar("vi_alex_rama", "puerta"); api.est("alex", "lucidez", -2); api.saber("nora", "alex_mira_puerta"); } },
    ],
  },

  vi6_irse: {
    pov: "irene",
    fondo: "assets/fondos/salon_gris.jpg",
    titulo: "La evidencia · Irse",
    hora: "04:22",
    alEntrar: (api) => R().tick(api),
    texto: (api) => {
      const h = H(api);
      const herido = api.bandera("vi_herido");
      const tipo = api.bandera("vi_herida_tipo");
      const cruzo = api.bandera("alex_cruzo") ? "alex" : api.bandera("marcos_cruzo") ? "marcos" : null;
      const ar = api.bandera("vi_alex_rama");
      const inicio = ar === "cerveza" ? `
Álex ha puesto una cerveza delante de Marcos. «Por la rama.» Y Marcos la ha cogido. Y durante un minuto la mesa ha sido una mesa.` : ar === "arriba" ? `
Álex: Una rama. Y lo de arriba no.

Lo ha dicho él. Álex. El que se ríe de todo. Y la mesa ha vuelto a ser lo que era antes de la rama.` : ar === "graba" ? `
Álex ha grabado el techo un minuto entero. En silencio. Cuatro personas mirando un móvil que mira un techo. Al terminar ha guardado el vídeo y no ha dicho «documental número nada».` : ar === "sarten" ? `
Álex ha ido a la cocina y ha vuelto con la sartén de hierro. ${api.bandera("llave_inglesa") === "cocina" ? "La llave inglesa se ha quedado en la encimera: dos cosas no se llevan. " : ""}La ha dejado en el suelo, al lado de su silla, con el mango hacia él. Nadie le ha preguntado. Tú le has mirado, y él a ti, y no había chiste.` : `
Álex mira la puerta. Lleva un rato mirándola. Como quien espera a alguien que ha dicho que viene.`;
      return `${inicio}

${tipo === "mano" ? "Nora tiene la mano en el paño con hielo. Ya no está roja: está morada. Marcos le ha dicho que hay que ir a un hospital. Nora ha dicho que a las cuatro y media, con lo que habéis bebido, por esa carretera, no. Y tenía razón. Y Marcos lo sabía." : herido === "irene" ? "Tú tienes el pie en una silla y el tobillo del tamaño de la rodilla. No duele si no lo mueves. Lo mueves. Duele." : herido === "marcos" ? "Marcos tiene el pie en una silla y el tobillo del tamaño de la rodilla. Le has visto la cara cuando ha ido a la ventana. Marcos no cojea delante de la gente. Ha cojeado." : "Álex tiene el pie en una silla y el tobillo del tamaño de la rodilla, y sigue haciendo como que no."}

Y lo dices. Porque alguien tiene que decirlo y llevas media hora esperando a que lo diga Nora, que es la que sabe de estas cosas, y Nora no lo dice.

Irene: Vámonos.

Silencio.

Irene: Nos vamos. Ahora. Cogemos las cosas y nos vamos.

Marcos: Son las cuatro y veinte.

Irene: Ya.

Marcos: Está oscuro hasta las siete. Es una hora de carretera de tierra sin arcén. ${herido === "marcos" ? "Con este pie no puedo conducir." : "Hemos bebido los cuatro. Yo el que menos, y no lo suficiente."} ${cruzo === "marcos" ? "Y el coche... la luz del coche está apagada. No sé si arranca." : ""}

Nora: Marcos.

Marcos: Digo lo que hay.

Álex: Yo conduzco.

Marcos: Tú no conduces ni un carrito de supermercado.

Álex: Entonces nos quedamos aquí a que las ratas con dedos bajen a saludar.

Y es la primera vez que alguien dice «nos quedamos» y suena a lo que es. A una decisión. A que hay que decidir.

${h === "irene" ? `Y te llega. Con tu voz. Sin que lo pienses.

~ ${R().intrusion(api, "irene", 2)}

Te quedas con la boca abierta y la frase de irse a medias. Álex te mira. Tardas en saber que te mira.` : ""}

Nora tiene el cuaderno abierto. No escribe. Mira la puerta. ${api.bandera("nora_toma_muneca") ? "Mira la muñeca. " : ""}Te mira a ti.

${modo(api, "irene", {
  lucido: "~ Irse es lo lógico. Y nadie se va. Porque irse es cruzar veinte metros de grava a oscuras hasta un coche que se enciende solo, y todos lo sabemos, y nadie lo dice.",
  asustado: "~ Fuera. Fuera de esta casa. Me da igual la carretera. Me da igual el pie. Fuera.",
  tenso: "~ Marcos con sus horas y sus arcenes. Marcos, que resuelve todo, que resuelva esto. Que nos saque.",
  ido: "~ Las siete. Ha dicho las siete. Siete. Como las marcas de la viga. Como las ofrendas de Álex. Todo esta noche es siete.",
  perdido: `~ ${h === "irene" ? "Todavía no. Nadie se va todavía. Primero tiene que pasar lo otro. Lo he dicho yo. No lo he dicho yo." : "No nos deja. La puerta. Lo dijo Álex: cuando la casa decide que eres suyo, la puerta deja de dejarte salir. Y la puerta está cerrada."}`,
  normal: "~ Que decidan. Que decida Marcos. Y que yo no tenga que volver a decir vámonos con esa voz.",
})}`;
    },
    opciones: [
      { texto: "«Vámonos ahora. Yo cojo las llaves. Andando si hace falta.»", a: "vi7_imposible",
        efecto: (api) => { api.marcar("decision_irse", "ahora"); api.est("irene", "eje", 3); api.est("irene", "estres", 4); api.rel("marcos", "irene", "tension", 4); } },
      { texto: "«Nos vamos cuando amanezca. Y no me separo de vosotros hasta entonces.»", a: "vi7_imposible",
        efecto: (api) => { api.marcar("decision_irse", "amanecer"); api.rel("irene", "alex", "afecto", 3); api.rel("irene", "marcos", "afecto", 2); api.est("irene", "estres", -2); } },
      { texto: "No decir nada más. Mirar a Marcos. Que lo decida él.", a: "vi7_imposible",
        efecto: (api) => { api.marcar("decision_irse", "marcos"); api.rel("irene", "marcos", "confianza", 4); api.rel("nora", "irene", "resentimiento", 2); api.est("marcos", "eje", 3); } },
      { texto: "«Todavía no.» Y no saber por qué lo has dicho.", a: "vi7_imposible", si: (api) => H(api) === "irene",
        efecto: (api) => { api.marcar("decision_irse", "todavia"); R().lapso(api); api.saber("alex", "irene_rara"); api.saber("nora", "irene_raro"); api.est("irene", "lucidez", -2); } },
    ],
  },

  vi7_imposible: {
    pov: "nora",
    fondo: "assets/fondos/salon_noche.jpg",
    musica: "terror",
    titulo: "La evidencia · Alguien sube",
    hora: "04:28",
    alEntrar: (api) => {
      R().tick(api);
      const quien = api.bandera("marcos_cruzo") ? "marcos" : "alex";
      api.marcar("evento_imposible", true);
      api.marcar("imposible_quien", quien);
      api.horror(3);
      ["nora", "marcos", "alex", "irene"].forEach((p) => { api.presenciar(p, 2.5); api.saber(p, "evento_imposible"); });
      api.marcar("sombra_escalera", api.anomalia("sombra_escalera"));
      api.est("marcos", "eje", -8);
      api.marcar("fascinacion_rota", api.valor("nora", "miedo") >= 55 || api.bandera("vi_herida_tipo") === "mano");
      if (api.bandera("fascinacion_rota")) api.est("nora", "eje", -15);
    },
    texto: (api) => {
      const d = api.bandera("decision_irse");
      const quien = api.bandera("imposible_quien") || "alex";
      const esAlex = quien === "alex";
      const marcado = api.bandera(quien + "_cruzo");
      const h = H(api);
      const decision = d === "ahora" ? `
Irene: Vámonos ahora. Yo cojo las llaves. Andando si hace falta.

Marcos: Andando.

Irene: Andando.

Y Marcos no dice que no. Mira la puerta. Mira el reloj. Y por primera vez esta noche no tiene un dato.

Marcos: Cuando amanezca. A las siete. Recogemos ahora, y a las siete, con luz, el coche o andando.

Nadie discute. Es un plan. Es lo más parecido a un plan que ha habido desde la ouija.` : d === "marcos" ? `
Irene no ha dicho nada más. Ha mirado a Marcos. Y Marcos, con todos mirándole, ha dicho lo que dice Marcos:

Marcos: Cuando amanezca. A las siete. Con luz. Hasta entonces nadie sale y nadie sube. Recogemos ahora, y a las siete nos vamos.

Nadie discute. Es un plan. Es lo más parecido a un plan que ha habido desde la ouija.` : d === "todavia" ? `
Irene: Todavía no.

Álex: ¿Todavía no qué?

Irene: Nada. Que todavía no. Que... cuando amanezca.

Marcos: Cuando amanezca. A las siete. Con luz.

Nadie discute. Pero Álex mira a Irene. Y tú también. Y ella se mira las manos.` : `
Irene: Nos vamos cuando amanezca. Y no me separo de vosotros hasta entonces.

Marcos: A las siete. Con luz. Recogemos ahora.

Nadie discute. Es un plan. Es lo más parecido a un plan que ha habido desde la ouija.`;

      const sale = esAlex ? `
Álex se levanta. ${api.bandera("alex_cruzo") ? "Con las zapatillas mojadas todavía." : ""}

Álex: Voy a mear. Y a fumar. Al porche, dos minutos. Se ve desde aquí.

Marcos: Álex.

Álex: Dos minutos. Delante de la ventana. Si me lleva una rata con dedos, gritad.

Y sale. Se oye la puerta principal. Se ve, a través del cristal, la brasa encenderse. Álex. En el porche. A cuatro metros de la mesa, con una pared en medio.` : `
Marcos se levanta. ${api.bandera("vi_herido") === "marcos" ? (R().lleva(api, "marcos", "atizador") ? "Cojeando. Con el atizador de bastón." : "Cojeando. Apoyándose en los respaldos.") : ""} Con las zapatillas mojadas todavía.

Marcos: Voy a mirar el coche. Si a las siete no arranca, quiero saberlo ahora.

Nora: Marcos.

Marcos: Desde el porche. No bajo. Lo miro desde el porche.

Y sale. Se oye la puerta principal. Se ve, a través del cristal, su silueta en la barandilla. Marcos. En el porche. A cuatro metros de la mesa, con una pared en medio.`;

      const nombre = esAlex ? "Álex" : "Marcos";
      const ropa = esAlex ? "La camisa estampada abierta, los collares" : api.bandera("juego") === "poker" ? "La camiseta negra, los hombros" : "La camisa de cuadros, los hombros";
      return `${decision}
${sale}

Recogéis. Nora mete el cuaderno en la mochila. Irene busca su móvil. ${api.bandera("nora_toma_muneca") ? "La muñeca se queda en la mesa. Nadie la toca. " : ""}La tabla, por fin, vuelve a la caja, y la tapa se desliza, y suena a fin de algo.

Y ${nombre} sube la escalera.

Lo ves tú primero. Por el rabillo. Una figura en la escalera, de espaldas, subiendo. ${ropa}. El paso de ${nombre}. La forma de ${nombre}. El tercero. El séptimo. Sin crujir.

Nora: ¿${nombre}?

No contesta. Sube. Llega al pasillo. Y se va. Hacia la trampilla. Hacia la luz de llama falsa. Y ya no se ve.

Irene: ¿Qué hace?

${esAlex ? "Marcos" : "Álex"}: ${nombre}. ¡${nombre.toUpperCase()}!

Y en ese momento se abre la puerta principal.

Con el frío. Con el olor a pino. Con ${nombre}, ${esAlex ? "con el porro en la boca y las manos en los bolsillos" : "con las manos en los bolsillos y la cara de quien no ha visto arrancar nada"}, entrando desde el porche.

${nombre}: ¿Qué?

Nadie contesta.

${nombre}: ¿Qué pasa? ¿Por qué me miráis así?

Miras la escalera. La miran todos. Vacía. El pasillo, arriba, con la luz de llama falsa haciendo su ciclo. Nadie.

${nombre}: Estaba en el porche. Me habéis visto. Se ve desde aquí.

Se veía. Le habéis visto. ${esAlex ? "La brasa. La silueta." : "La silueta en la barandilla."} Cuatro metros. Y ${nombre} subiendo la escalera al mismo tiempo, con su ropa, con su paso, con su espalda.

${api.bandera("sombra_escalera") ? "Y en el rellano, donde la escalera gira, una sombra que tarda un segundo en irse. Un segundo. Como quien se asoma a ver si le han visto." : ""}

Nadie ha subido. Nadie va a subir a comprobarlo. Nadie va a bajar de allí.

${marcado ? `~ Ha bajado a la grava. Ha cruzado. Y ahora hay dos. Uno fuera y uno dentro. Y no sé cuál de los dos ha entrado por la puerta.` : `~ Le hemos visto los cuatro. Subir. Y le hemos visto los cuatro entrar. Y no puede ser las dos cosas, y ha sido las dos cosas, y nadie va a decir «ratas».`}

${h === "marcos" && !esAlex ? "" : h === "marcos" ? "Marcos no ha dicho nada. No ha dicho «madera vieja». No ha ido a la escalera. Está sentado, con las manos en la mesa, mirando el hueco donde estaba la figura como se mira a alguien conocido." : "Irene no ha gritado. Irene, que grita con las ramas, ha visto subir a alguien que no era nadie y ha tragado. Con la mano en el cuello."}

${modo(api, "nora", {
  lucido: `~ Cuatro testigos. La misma cosa. A la vez. ${api.bandera("fascinacion_rota") ? "Y ya no quiero pruebas. Quería pruebas. No esto." : "Es lo que llevo toda la noche pidiendo. Y ahora que lo tengo, lo que quiero es no haberlo pedido."}`,
  asustado: "~ Ha subido. Está arriba. Con su cara. Y el de la puerta también tiene su cara. Y uno de los dos no es.",
  tenso: "~ Nadie sube. Nadie. Me da igual quién esté arriba con la cara de quien. Nadie sube.",
  ido: "~ Ha subido sin crujir. El tercero y el séptimo no han crujido. Todo lo que sube esta escalera cruje menos eso.",
  perdido: "~ Ya sabe cómo somos. Se ha puesto su ropa. Se ha puesto su paso. Ha subido a esperarle. Está esperándole arriba.",
  normal: "~ Le hemos visto. Los cuatro. Se acabó lo de «cada uno lo suyo». Ahora es de todos.",
})}`;
    },
    opciones: [
      { texto: "«¿Dónde estabas?» Que lo diga delante de todos. Con detalle.", a: "vi8_quedarse",
        efecto: (api) => { api.marcar("vi_nora_imposible", "pregunta"); api.est("nora", "lucidez", 1); const q = api.bandera("imposible_quien") || "alex"; api.est(q, "estres", 6); api.rel("nora", q, "confianza", -4); } },
      { texto: "Coger la mano de Marcos. No soltarla. Pase lo que pase.", a: "vi8_quedarse", si: (api) => api.bandera("imposible_quien") !== "marcos",
        efecto: (api) => { api.marcar("vi_nora_imposible", "mano"); R().contacto(api, "nora", "marcos", 2); api.est("nora", "estres", -3); } },
      { texto: "Escribir. La hora. «Alguien ha subido. Le hemos visto los cuatro.»", a: "vi8_quedarse", lucida: true,
        efecto: (api) => { api.marcar("vi_nora_imposible", "escribe"); api.evidencia("cuaderno_imposible", "nora", "cuaderno de Nora", "nota"); api.est("nora", "lucidez", 2); api.est("nora", "estres", -2); } },
      { texto: "Subir. Ahora. Con la linterna. A ver quién hay arriba.", a: "vi8_quedarse", impulsiva: true,
        efecto: (api) => { api.marcar("vi_nora_imposible", "sube"); api.est("nora", "miedo", 6); api.est("nora", "estres", 6); api.rel("marcos", "nora", "proteccion", 6); api.saber("nora", "arriba_nadie"); } },
    ],
  },

  vi8_quedarse: {
    pov: "marcos",
    titulo: "La evidencia · Todo el mundo se queda aquí",
    hora: "04:35",
    alEntrar: (api) => {
      R().tick(api);
      api.marcar("fase6_completa", true);
      api.marcar("puerta_cerrada_llave", true);
      // Necesidades para la VII: fijadas por lo que ha pasado
      const R_ = R();
      R_.necesidad(api, "irene", "frio");
      R_.necesidad(api, "alex", "fumar");
      R_.necesidad(api, "marcos", R_.herido(api, "marcos", "cojera") ? "herida" : "mear");
      R_.necesidad(api, "nora", R_.herido(api, "nora", "mano") ? "herida" : "sed");
      api.marcar("luz_parpadeo", api.anomalia("luz_parpadeo"));
      ["nora", "alex", "irene"].forEach((p) => api.rel(p, "marcos", "confianza", 3));
      api.est("marcos", "eje", 6);
    },
    texto: (api) => {
      const h = H(api);
      const ni = api.bandera("vi_nora_imposible");
      const quien = api.bandera("imposible_quien") || "alex";
      const nombre = N[quien];
      const inicio = ni === "pregunta" ? `
Nora: ¿Dónde estabas?

${nombre}: En el porche.

Nora: Con detalle.

${nombre}: En el porche. ${quien === "alex" ? "He meado detrás del pino. He encendido el porro. He mirado el coche. Y he entrado." : "He mirado el coche desde la barandilla. Tiene la luz apagada. He entrado."} Dos minutos. Me habéis visto.

Nora: Te hemos visto subir.

${nombre}: No he subido.

Y no ha subido. Se le ve. Se le ve la verdad en la cara y no sirve de nada.` : ni === "mano" ? `
Nora te ha cogido la mano. Por encima de la mesa. Y no la suelta. ${h === "marcos" ? "Está fría, la tuya. Lo sabes porque ella te la frota como se frota una mano que se ha quedado fuera." : "Se la aprietas. Es lo único que tienes claro."}` : ni === "escribe" ? `
Nora escribe. La hora. «Alguien ha subido. Le hemos visto los cuatro.» Y cierra el cuaderno como se cierra una puerta.` : `
Nora se ha levantado con la linterna. Ha subido tres escalones. Cuatro. ${R().herido(api, "marcos", "cojera") ? "Has ido detrás con el pie como está, y te ha costado cuatro escalones alcanzarla. La has cogido del brazo en el séptimo" : "La has cogido del brazo en el quinto"}, con la mano entera, y has tirado de ella hacia abajo, y no te ha discutido. Arriba no había nadie. Lo has visto tú también, desde la escalera, con la linterna: el pasillo vacío. Nadie. Eso es lo peor. Que no haya nadie.`;
      return `${inicio}

Y te levantas. ${R().herido(api, "marcos", "cojera") ? "Cojeando. Da igual." : ""} Porque hay que decir algo y nadie lo dice, y las cosas que nadie dice las dices tú desde primero de carrera.

Marcos: Todo el mundo se queda aquí.

Los tres te miran.

Marcos: Aquí. En esta mesa. Nadie sube. Nadie sale. Nadie va a mear solo. Hasta las siete.

${h === "marcos" ? `Y mientras lo dices te llega. Con tu voz. Debajo de tu voz.

~ ${R().intrusion(api, "marcos", 2)}

Y te oyes decirlo con más fuerza de la que querías. «Nadie sale.» Como una orden. Como si no fuera para ellos.` : `Lo dices con la voz de las reglas. Y por primera vez en toda la noche nadie discute una regla tuya. Ni Álex.`}

Vas a la puerta principal. Las llaves están puestas por dentro. Las giras. Dos vueltas. El cerrojo entra con un ruido de hierro viejo que os llega a todos.

Álex: ¿Nos encierras?

Marcos: Cierro.

Álex: Es lo mismo.

Marcos: No es lo mismo.

No sabes si es lo mismo. Te guardas la llave en el bolsillo. ${api.bandera("llave_inglesa") === "marcos" ? "Al lado de la llave inglesa. " : ""}Pesa como pesan las cosas que has decidido.

Vuelves a la mesa. ${R().lleva(api, "marcos", "atizador") ? "Dejas el atizador apoyado en tu silla, al alcance de la mano." : "Vas a la chimenea. Coges el atizador. Lo dejas apoyado en tu silla, al alcance de la mano. Nadie pregunta."} ${R().lleva(api, "alex", "sarten") ? "Álex tiene la sartén de hierro en el suelo, al lado de la suya. Os miráis. No hay chiste." : ""}

Nora acerca su silla a la tuya. Irene acerca la suya a la de Álex. Cuatro sillas juntas en una mesa redonda, de espaldas a la chimenea, de cara a la escalera y a la puerta. Como se sienta la gente que espera.

${api.bandera("luz_parpadeo") ? `Y la lámpara parpadea.

[parpadeo]

Una vez. Corta. Como un guiño. Y se queda.

Marcos: La bombilla.

Nadie contesta. La bombilla está apretada. ${api.bandera("marcos_aprieta") || api.bandera("luz_por") === "marcos" ? (api.pov() === "marcos" ? "La apretaste tú. Con dos vueltas de más." : "La apretó Marcos. Con dos vueltas de más.") : "La apretó Álex después del susto. Con dos vueltas de más, riéndose."}` : "La lámpara aguanta. Amarilla. La misma de la fiesta, sobre la misma mesa, sobre cuatro personas que ya no son las de la fiesta."}

Cuatro y treinta y cinco. Faltan dos horas y veinticinco minutos para las siete. Nora las ha contado en voz alta. Nadie le ha pedido que las contara.

${modo(api, "marcos", {
  lucido: "~ Dos horas y media. Cuatro personas. Una mesa. Una puerta cerrada con llave, que no sirve para lo de arriba, y lo sé, y la he cerrado igual, porque cerrar es lo que sé hacer.",
  asustado: `~ ${h === "marcos" ? "Nadie sale. Lo he dicho como si me lo hubieran dictado. Nadie sale. Y la llave en mi bolsillo, y yo con la llave." : "Le hemos visto subir. Y está aquí. Y arriba hay alguien con su ropa, o no hay nadie, y no sé cuál de las dos me da más miedo."}`,
  tenso: "~ Dos horas y media. Sin ideomotor. Sin bombilla. Sin nada que arreglar. Es lo único que no sé hacer: esperar.",
  ido: "~ La llave pesa más que antes. Como si hubiera cerrado algo más grande que una puerta.",
  perdido: `~ ${h === "marcos" ? "Todavía no. Primero tiene que bajar. Y cuando baje, que la puerta esté cerrada. Para que no salga nadie. Para que se queden." : "Los he encerrado con ello. Con lo que ha subido. Con lo que va a bajar. Y he tirado la llave a mi bolsillo como se tira al fondo de un pozo."}`,
  normal: "~ Todo el mundo se queda aquí. Ya está dicho. Ahora, que sea verdad.",
})}

...`;
    },
    opciones: [{ texto: "Continuar", a: "vii1_apagon" }],
  },

  });
})();
