/*
 * LA BRUJA — PRÓLOGO
 * Fase IV: La ouija (HORROR_STAGE 1 → 2)
 *
 * La ouija es una máquina de verdades distintas. Ocurre lo mismo en las tres partidas;
 * lo que cambia es qué información privada posee el jugador según la carta que eligió
 * al montar la mesa (Nora / Marcos / Irene; Álex no es elegible: lleva el vaso).
 *
 * Lo que ocurre objetivamente, siempre:
 *   - Álex e Irene improvisan una broma: bombilla floja (Irene), golpes con el talón (Irene),
 *     respuestas falsas (Álex): ADIÓS · SÍ · NO · IRENE.
 *   - Al escribirse IRENE, Irene deja de respirar de verdad. CONTACTO. Nadie lo sabe.
 *   - Marcos reacciona (persona / lámpara / cocina). Si le hace la respiración, el contacto
 *     pasa a él: HUÉSPED = marcos. Si no, HUÉSPED = irene.
 *   - Se descubre la broma. Todos reinterpretan el ahogo como teatro. La tensión cae.
 *   - Sesión seria con Nora al mando (Álex sigue moviendo): SÍ · ALDA · AJOBA · nada · nada.
 *
 * Respuestas reales de la ouija (catálogo cerrado): SÍ (ambiguo) · ALDA · AJOBA · (nada).
 * AJOBA son las letras de ABAJO. Nadie lo ve. Nora lo anota tal cual.
 *
 * Presupuesto de anomalías Fase IV: 3
 *   llama_velas  → dos llamas se inclinan a la vez (solo Nora, solo si no entra al trapo)
 *   voz_nombre   → Irene oye su nombre en el pasillo si sube al baño
 *   vaso_final   → el vaso, unos centímetros más lejos de donde lo dejaron
 *
 * Banderas que salen de aquí y pesan después:
 *   ouija_pov · huesped ("irene"|"marcos") · contacto · contacto_inicial · marcos_accion ·
 *   luz_por · irene_fuera · nora_reaccion_beso · irene_verdad · irene_mentira ·
 *   nora_vio_llama · alda_visto · ajoba_visto · ouija_cerrada · vaso_final · voz_desertor
 */
(() => {
  const N = { nora: "Nora", marcos: "Marcos", alex: "Álex", irene: "Irene" };
  const P = (api) => api.bandera("ouija_pov") || "nora";
  const modo = (api, id, m) => m[api.modo(id)] || m.normal;
  // Nora ya ha visto la boca de Irene en Marcos esta noche (cuello en la botella, beso en el póker)
  const yaHuboBeso = (api) => api.sabe("nora", "beso_marcos_irene") || api.bandera("b1") === "prueba";
  // Dónde está el péndulo cuando Álex lo coge
  const penduloEn = (api) => api.bandera("pendulo") === "mesa" || api.bandera("d13") ? "mesa" : "mochila";

  Object.assign(HISTORIA.presupuestoAnomalias, { IV: 3 });
  Object.assign(HISTORIA.deriva, { IV: { estres: 0.3 } });

  // Saltos de prueba: lo mínimo para que cualquier escena de la ouija tenga con qué trabajar
  const saltoPrevio = HISTORIA.prepararSalto;
  HISTORIA.prepararSalto = (api, id) => {
    if (typeof saltoPrevio === "function") saltoPrevio(api, id);
    if (!/^o\d/.test(id)) return;
    api.fase("IV");
    if (!api.bandera("ouija_motivo")) api.marcar("ouija_motivo", "reto");
    if (!api.bandera("ouija_pov")) api.marcar("ouija_pov", "nora");
    if (/^o(7|8|9|1\d)/.test(id) && !api.bandera("marcos_accion")) api.marcar("marcos_accion", "rescate");
    if (id === "o12_irene_arriba") api.marcar("irene_fuera", "bano");
  };

  // ¿Qué hace Marcos a oscuras cuando no le llevamos? Esencia antes que estados:
  // es protector con «los de antes», pero la lámpara es un problema con solución, y eso es Marcos.
  function decidirMarcos(api) {
    let persona = api.relv("marcos", "irene", "afecto") + api.relv("marcos", "irene", "proteccion");
    if (api.bandera("marcos_se_burlo")) persona -= 15;
    if (api.setas()) persona -= 20;                                   // todo le llega un poco tarde
    if (api.bandera("irene_miro_marcos")) persona += 15;
    if (api.bandera("marcos_se_levanta")) persona += 10;
    if (api.bandera("nora_accion_oscuro") === "irene") persona -= 10; // Nora ya va: él reparte
    let lampara = api.valor("marcos", "eje") - 40;
    if (api.bandera("marcos_vio_silla") || api.bandera("marcos_miro_mesa") || api.bandera("marcos_sospecha")) lampara += 20;
    if (api.nivel("marcos", "intox") === "alto") lampara -= 10;
    const cocina = api.valor("marcos", "intox") - 30;
    if (persona >= lampara && persona >= cocina) return "rescate";
    return lampara >= cocina ? "lampara" : "cocina";
  }

  // Cómo reacciona Nora al beso si no la llevamos. Confianza, tensión previa, alcohol, estrés.
  function decidirNora(api) {
    const res = api.relv("nora", "irene", "resentimiento");
    const conf = api.relv("nora", "marcos", "confianza");
    const estres = api.valor("nora", "estres");
    const intox = api.valor("nora", "intox");
    let r;
    // Por defecto la pareja es sana: se lo toma con humor. Solo el resentimiento acumulado o la confianza rota lo cambian.
    if (res >= 45 || api.bandera("nora_pregunta_ahogo")) r = "irene";
    else if (conf < 40) r = "marcos";
    else if (conf >= 50 || estres < 55) r = "broma";
    else r = "silencio";
    if (r === "silencio" && intox >= 65) r = "irene";                 // el alcohol no se calla
    return r;
  }
  function aplicarReaccionNora(api, r) {
    api.marcar("nora_reaccion_beso", r);
    if (r === "irene") { api.rel("nora", "irene", "resentimiento", 10); api.rel("irene", "nora", "resentimiento", 8); api.est("irene", "estres", 5); api.rel("alex", "nora", "afecto", 2); }
    if (r === "broma") { api.est("nora", "estres", -4); api.rel("nora", "marcos", "confianza", 3); api.rel("marcos", "nora", "afecto", 3); api.rel("irene", "nora", "resentimiento", 2); }
    if (r === "marcos") { api.rel("nora", "marcos", "confianza", -8); api.rel("nora", "marcos", "resentimiento", 6); api.est("marcos", "estres", 8); api.est("nora", "estres", 6); }
    if (r === "silencio") { api.rel("nora", "irene", "resentimiento", 4); api.rel("nora", "marcos", "confianza", -3); api.est("nora", "estres", 4); }
  }

  // ¿Se queda Irene en la mesa después? Si la han sostenido, se queda: ha recuperado el suelo.
  // Si nadie la ha tocado, se va: no quiere que la vean así.
  function decidirIrene(api) {
    if (api.bandera("marcos_accion") === "rescate") {
      const reproche = api.bandera("nora_reaccion_beso") === "irene" && api.relv("irene", "nora", "resentimiento") >= 45;
      return reproche ? "cerveza" : null;
    }
    return api.bandera("irene_tras") === "risa" || api.bandera("irene_mentira") ? "cerveza" : "bano";
  }

  Object.assign(HISTORIA.escenas, {

  // =====================================================================
  // FASE IV — LA OUIJA
  // =====================================================================

  o1_ouija: {
    pov: "nora",
    fondo: "assets/fondos/ouija_prep.jpg",
    musica: null,
    titulo: "La ouija · La tabla",
    hora: "02:55",
    alEntrar: (api) => {
      api.fase("IV");
      api.evidencia("video_mesa", "irene", "móvil de Irene, apoyado en una botella", "video");   // obligatoria
    },
    texto: (api) => {
      const motivo = api.bandera("ouija_motivo");
      const inicio = motivo === "no" ? `
Nora: Ni de coña.

Álex: Perfecto.

Se levanta. Va a tu mochila. La abre.

Nora: Álex.

Saca la caja. Plana, de madera, con la tapa que se desliza. Y no la deja en la mesa: se la pega al pecho, con los dos brazos, como se coge a un niño que no es tuyo.

Álex: La hago yo. Tú me indicas.` : motivo === "deseo" ? `
Nora: Vale.

Lo has dicho tan rápido que Álex ha parpadeado.

Álex: ¿Vale?

Nora: Vale.

Y antes de que te levantes ya está él en tu mochila. Es más rápido que tú. Siempre es más rápido que tú cuando se trata de tus cosas.

Saca la caja. Se la pega al pecho.

Álex: La hago yo. Tú me indicas.` : motivo === "escepticismo" ? `
Nora: Vale. Y cuando no pase nada me dejáis terminar la historia.

Álex: Trato.

Marcos: Trato.

Irene: Si no pasa nada.

Álex ya está en tu mochila. Saca la caja de madera y se la pega al pecho con los dos brazos.

Álex: La hago yo. Tú me indicas.` : `
Nora: Vale. Pero dejamos de hacer el gilipollas. Los cuatro.

Álex: Yo nunca hago el gilipollas.

Irene: Nunca.

Marcos: Jamás.

Y mientras lo dice, Álex ya tiene la mano en tu mochila. Saca la caja de madera, plana, con la tapa que se desliza, y se la pega al pecho con los dos brazos.

Álex: La hago yo. Tú me indicas.`;
      return `${inicio}

Nora: Dámela.

Álex: Confía en mí.

Nora: Esa frase contigo debería ser delito.

Te levantas. Él rodea la mesa. Tú rodeas la mesa. Es la segunda vez esta noche que persigues a Álex alrededor de esta mesa por algo tuyo y él lo sabe, y por eso le encanta.

Marcos: Dásela, anda. Que se va a caer con ella.

Irene: Déjale. Que la haga él.

Irene. Con la voz de «va a ser más divertido así». Y lo peor es que tiene razón.

Te paras. Le miras. Álex te mira por encima de la caja con la cara de un perro que ha cogido algo y no piensa soltarlo.

Nora: Vale. Pero si la vas a hacer, se hace bien.

Álex: Se hace perfecta.

Deja la caja en la mesa con una solemnidad ridícula. Desliza la tapa. Saca el tablero.

Álex: Señoras y señores...

Nora: Ya estás empezando.

Álex: Estaba presentando.

Marcos empieza a retirar cosas. Los vasos. Las cartas. Un plato con restos de algo. Lo hace sin que nadie se lo pida, porque es Marcos, y porque si hay que hacer una ouija en esta mesa por lo menos que esté recogida. Irene ya tiene tus velas en la mano. Las dos. No se las has dado. No sabes cuándo ha abierto tu mochila.

Y el resto sigue ahí. Las botellas. El cenicero lleno. La bolsa de Álex con lo que queda de lo que queda. Una camisa de alguien en un respaldo. No parece un ritual. Parece exactamente lo que es: cuatro borrachos montando una ouija en la mesa donde hace media hora ${api.bandera("juego") === "poker" ? "estaban jugando al póker" : "giraba una botella"}.

${api.bandera("musica_leyenda") === "sonando" ? `Nora: Bajad la música.

Álex: ¿Necesitan silencio los muertos?

Nora: Necesito escucharte menos a ti.

Irene la baja. Luego la apaga.` : `La música lleva apagada desde la historia de Álex. Nadie la ha echado de menos hasta ahora, que la echáis de menos todos.`}

Irene deja el móvil apoyado contra una botella, con la cámara hacia la mesa.

Irene: Grabando. Por si acaso.

Álex: Que grabe. Que grabe todo.

Lo dice demasiado contento. Álex lo dice todo demasiado contento.

${modo(api, "nora", {
  lucido: "~ Va a hacer el idiota. Lo sé. Lo sabe todo el mundo. La única pregunta es cuánto rato y si me va a dar tiempo a hacer una sola pregunta en serio antes de que lo haga.",
  asustado: "~ No quiero que la lleve él. No por él. Porque si pasa algo, no quiero que sea su mano la que esté encima.",
  tenso: "~ «Que la haga él.» Irene. Cómo le gusta empujar y quedarse mirando.",
  ido: "~ El tablero tiene las letras en arco, como una sonrisa. Nunca lo había visto así. Es una boca.",
  perdido: "~ Ya está en la mesa. Ella. Antes de que abramos nada. Se ha sentado en la silla vacía y está esperando a que empecemos.",
  normal: "~ Sabía que iba a acabar así. Lo sabía desde que metí la tabla en la mochila. Para eso la metí.",
})}

La mesa se monta despacio. Cada uno está en una cosa. Nora coloca. Marcos recoge. Irene se ocupa de la luz.

Y Álex no se está quieto.

¿Desde dónde quieres verlo?`;
    },
    // Álex no es elegible: lleva el vaso. Es lo único de esta noche que no se decide.
    personajes: [
      { id: "nora", descripcion: "La tabla. Las reglas. Y Álex, que no se está quieto.", a: "o2_distraccion",
        efecto: (api) => api.marcar("ouija_pov", "nora") },
      { id: "marcos", descripcion: "Recoger la mesa. Mirar. No creerse nada.", a: "o2_distraccion",
        efecto: (api) => api.marcar("ouija_pov", "marcos") },
      { id: "irene", descripcion: "Las velas. La luz. El ambiente.", a: "o2_distraccion",
        efecto: (api) => api.marcar("ouija_pov", "irene") },
    ],
  },

  o2_distraccion: {
    pov: (api) => P(api),
    titulo: "La ouija · La luz",
    hora: "03:00",
    alEntrar: (api) => {
      // La broma existe objetivamente. Quién la ve es otra cosa.
      api.marcar("lampara_floja", true);
      api.saber("irene", "lampara_floja"); api.saber("alex", "lampara_floja");
    },
    texto: (api) => {
      const pov = P(api);
      const pend = penduloEn(api) === "mesa" ? "Coge el péndulo de la mesa, donde lleva toda la noche, por la cadena." : "Mete la mano en la mochila de Nora y saca el péndulo por la cadena.";
      const pendN = penduloEn(api) === "mesa" ? "Coge el péndulo de la mesa, por la cadena." : "Mete la mano en tu mochila. Otra vez. Saca el péndulo por la cadena.";

      if (pov === "irene") return `
Miras la lámpara que cuelga sobre la mesa. Amarilla. Con la tulipa de siempre. Con la luz de siempre, que lo enseña todo y no perdona nada.

Irene: Esto mata bastante el ambiente.

Álex: Totalmente.

Nora: No hace falta ambientar nada.

Irene: Nora. Velas y un fluorescente, no.

Nora: No es un fluorescente.

Irene: Lo parece.

Miras a Álex. Álex te mira mirar la lámpara. Y lo entiende. No hace falta decir nada. Nunca ha hecho falta: es lo único bueno de llevar tanto tiempo con alguien que es horrible.

${pend}

Álex: ¿Y esto?

Nora: Déjalo.

Lo levanta a la altura de la cara.

Álex: ¿Detecta espíritus o embarazos?

Nora: Álex.

Álex: Porque Irene tiene un retraso de...

Y ahí te mira. Es tu pie.

Nadie te mira a ti. Eso es lo bueno de Álex: cuando quiere que le miren, le miran.

Arrastras una silla debajo de la lámpara. Sin ruido. Te subes.

Irene: Voy a bajar esto un poco.

Nadie contesta. Nora está intentando quitarle el péndulo a Álex por encima de la mesa. Marcos mira a Nora. Todos están mirando lo que tienen que mirar.

Metes la mano dentro de la tulipa. La bombilla quema. La giras. Un cuarto de vuelta.

La luz se va.

Vuelve.

Medio cuarto atrás. Hasta que se queda encendida sin quedarse del todo. Notas la rosca floja bajo los dedos. Justo eso. Justo así.

${modo(api, "irene", {
  lucido: "~ Cinco segundos. Con Nora encima de él y Marcos mirando a Nora tengo cinco segundos. Sobran tres.",
  asustado: "~ No sé por qué esto me pone nerviosa. Es una bombilla. He hecho cosas peores en esta mesa hace una hora.",
  tenso: "~ «No hace falta ambientar nada.» Nora. Todo lo que no es suyo sobra. Pues ahora va a sobrar la luz.",
  ido: "~ La lámpara se balancea sola. No. Soy yo, que estoy mirándola desde abajo y desde el lado a la vez.",
  perdido: "~ Hay alguien más en la mesa. Ya. Antes de empezar. Y está mirando la lámpara conmigo.",
  normal: "~ Una vuelta. Un cuarto. Lo justo para que parpadee cuando toque. Esto es lo mío.",
})}`;

      if (pov === "marcos") return `
Irene mira la lámpara que cuelga sobre la mesa.

Irene: Esto mata bastante el ambiente.

Álex: Totalmente.

Nora: No hace falta ambientar nada.

Irene: Nora. Velas y un fluorescente, no.

Nora: No es un fluorescente.

Irene: Lo parece.

Sigues recogiendo. El plato. Dos vasos. Un mechero que no es de nadie. La bolsa de Álex la apartas con dos dedos, como se aparta una cosa que muerde.

${pend}

Álex: ¿Y esto?

Nora: Déjalo.

Álex: ¿Detecta espíritus o embarazos?

Nora: Álex.

Álex: Porque Irene tiene un retraso de...

Irene: Álex.

Nora va a por él. Álex retrocede con el péndulo en alto.

Álex: ¡No lo toques! Está calibrado.

Te ríes. No puedes evitarlo. Es un imbécil, pero es un imbécil con ritmo.

Nora le persigue alrededor de la mesa. Segunda vez esta noche. Irene arrastra una silla, se sube y mete la mano en la tulipa.

Irene: Voy a bajar esto un poco.

${modo(api, "marcos", {
  lucido: "~ Nora corriendo detrás de Álex por un péndulo. Irene bajando una lámpara. Y yo recogiendo vasos. Somos exactamente lo que parecemos.",
  asustado: "~ Que empiece ya. Que empiece, que no pase nada, y que se acabe.",
  tenso: "~ Álex. Cinco años. Cinco años riéndome y esta noche no me hace gracia. Casi.",
  ido: "~ El péndulo, en su mano, se mueve solo. No. Es él. Es su brazo. Es que lo miro un poco tarde.",
  perdido: "~ Hay demasiada gente en esta mesa. Los he contado dos veces y me sale cinco.",
  normal: "~ Está bien. Esto está bien. Cuatro idiotas y una tabla. Lo raro sería que pasara algo.",
})}

Tres cosas a la vez. Nora en Álex. Irene en la lámpara. Y tú con un vaso en cada mano.`;

      return `
Irene mira la lámpara que cuelga sobre la mesa.

Irene: Esto mata bastante el ambiente.

Álex: Totalmente.

Nora: No hace falta ambientar nada.

Irene: Nora. Velas y un fluorescente, no.

Nora: No es un fluorescente.

Irene: Lo parece.

Marcos recoge. Tú colocas. Sacas el tablero de la caja, lo giras, lo pones derecho.

${pendN}

Álex: ¿Y esto?

Nora: Déjalo.

Álex: ¿Detecta espíritus o embarazos?

Nora: Álex.

Álex: Porque Irene tiene un retraso de...

Irene: Álex.

Vas a por él. Retrocede con el péndulo en alto, como si fuera una antorcha.

Álex: ¡No lo toques! Está calibrado.

Marcos se ríe. Claro que se ríe.

Por el rabillo del ojo, Irene arrastra una silla, se sube y mete la mano en la tulipa.

Irene: Voy a bajar esto un poco.

Bien. Ambiente. Que baje lo que quiera.

${modo(api, "nora", {
  lucido: "~ Es la segunda vez que me hace esto con el péndulo. La primera fue graciosa. Esta es una estrategia: que me canse antes de empezar.",
  asustado: "~ Que lo suelte. Que lo deje. No quiero que lo tenga en la mano cuando empiece.",
  tenso: "~ Le mataría. Le mataría con el péndulo. Sería poético.",
  ido: "~ El péndulo, en su mano, oscila. Sin que él lo mueva. No. Lo mueve él. Se le ve el tendón. Siempre se le ve el tendón.",
  perdido: "~ Está jugando con algo que no es suyo delante de alguien que ya está aquí. Y ella lo mira. Ella lo mira.",
  normal: "~ Es un crío. Es un crío de treinta años con mi péndulo. Y voy a tener que quitárselo como a un crío.",
})}`;
    },
    opciones: [
      // Irene: qué contesta al «retraso» desde la silla
      { texto: "«Tres días. Y es tuyo.» Desde la silla, sin mirarle.", a: "o3_adios", si: (api) => P(api) === "irene",
        efecto: (api) => { api.rel("irene", "alex", "afecto", 2); api.rel("nora", "irene", "resentimiento", 2); api.est("irene", "eje", 1); } },
      { texto: "«Álex.» Cortante. Que se calle.", a: "o3_adios", si: (api) => P(api) === "irene",
        efecto: (api) => { api.rel("alex", "irene", "tension", 2); } },
      { texto: "No contestar. Desde una silla no se contesta a eso. Seguir con la bombilla.", a: "o3_adios", si: (api) => P(api) === "irene",
        efecto: (api) => { api.est("irene", "lucidez", 1); } },
      // Nora: qué hace con Álex y el péndulo
      { texto: "Perseguirle. Alrededor de la mesa. Como una idiota.", a: "o3_adios", si: (api) => P(api) === "nora",
        efecto: (api) => { api.marcar("nora_pendulo", "persigue"); api.est("nora", "estres", 3); api.est("alex", "eje", 2); api.rel("alex", "nora", "tension", 2); } },
      { texto: "«Marcos.» Que se lo quite él.", a: "o3_adios", si: (api) => P(api) === "nora",
        efecto: (api) => { api.marcar("nora_pendulo", "marcos"); api.rel("marcos", "nora", "proteccion", 2); api.rel("alex", "marcos", "tension", 2); } },
      { texto: "Sentarte. «Cuando termines.» Y esperar.", a: "o3_adios", si: (api) => P(api) === "nora",
        efecto: (api) => { api.marcar("nora_pendulo", "sienta"); api.est("nora", "lucidez", 1); api.est("alex", "eje", -2); } },
      // Marcos: reírse, intervenir o mirar donde nadie mira
      { texto: "Reírte. Y no hacer nada. Es lo mejor de la noche.", a: "o3_adios", si: (api) => P(api) === "marcos",
        efecto: (api) => { api.marcar("marcos_pendulo", "risa"); api.rel("nora", "marcos", "resentimiento", 2); api.est("marcos", "estres", -2); } },
      { texto: "Quitarle el péndulo por detrás. Sin levantarte del todo.", a: "o3_adios", si: (api) => P(api) === "marcos",
        efecto: (api) => { api.marcar("marcos_pendulo", "quita"); api.rel("nora", "marcos", "confianza", 2); api.est("marcos", "eje", 2); api.rel("alex", "marcos", "tension", 2); } },
      { texto: "Mirar a Irene, que se ha subido a una silla.", a: "o3_adios", si: (api) => P(api) === "marcos",
        efecto: (api) => { api.marcar("marcos_pendulo", "risa"); api.marcar("marcos_vio_silla", true); api.est("marcos", "lucidez", 1); } },
    ],
  },

  o3_adios: {
    pov: (api) => P(api),
    fondo: "assets/fondos/ouija_movil.jpg",
    titulo: "La ouija · Adiós",
    alEntrar: (api) => {
      if (!api.bandera("nora_pendulo")) api.marcar("nora_pendulo", "persigue");
      if (!api.bandera("marcos_pendulo")) api.marcar("marcos_pendulo", "risa");
    },
    texto: (api) => {
      const pov = P(api);
      const np = api.bandera("nora_pendulo"), mp = api.bandera("marcos_pendulo");

      // Cómo acaba lo del péndulo
      const pendulo = mp === "quita" || np === "marcos" ? `
Marcos le quita el péndulo a Álex por detrás, sin levantarse del todo, y lo deja en la mesa.

Álex: Traidor.

Marcos: Siéntate.` : np === "sienta" ? `
Nora se sienta. «Cuando termines.» Y Álex se queda con el péndulo en alto y sin público, que es lo peor que le puede pasar. Lo deja en la mesa como quien deja un mando de la tele.` : `
Nora le alcanza en la segunda vuelta. Le quita el péndulo de la mano con las dos suyas. Álex levanta los brazos como si le apuntaran.

Álex: Vale. Vale. Era para calibrar.`;

      // Solo Irene sabe lo de la bombilla. Y el talón.
      const irenePrepara = pov === "irene" ? `
Bajas. La silla vuelve a su sitio. Nadie ha visto nada porque no había nada que ver: una chica bajando una lámpara.

Miras a Álex. Álex, con el péndulo todavía en la mano y Nora colgada del brazo, te mira.

Una sonrisa de nada. Un milímetro.

Ya está.

Te sientas. Estiras la pierna por debajo de la mesa. Descalza, como toda la noche. El talón encuentra el travesaño de madera.

[toc]

Toc.

Poco. Nadie lo oye porque Álex está gritando que el péndulo está calibrado. Pero lo has oído tú. Sirve.
` : pov === "marcos" && api.bandera("marcos_vio_silla") ? `
La has mirado. A Irene. En la silla, con la mano en la tulipa, bajándola. Y bajar de la silla. Y mirar a Álex.

Y Álex mirarla.

Nada. Una mirada. Llevan cinco años mirándose así por encima de la gente. Te la guardas donde guardas las cosas que no son nada.
` : `
Irene baja de la silla. La lámpara, ahora más baja, deja la mesa en un círculo amarillo y el resto del salón en sombra.
`;

      const reglas = pov === "nora" ? `
Colocas el tablero derecho. Las letras en arco. Los números debajo. SÍ a un lado, NO al otro. ADIÓS abajo. El vaso boca abajo en el centro. Tus velas, las dos, a los lados. Irene las enciende con el mechero de Álex.

Nora: Pon los dedos encima. Sin apretar. Tú lo desplazas, pero no intentes llevarlo a ningún sitio. Las preguntas las hacemos por turnos. Nadie quita el vaso de golpe. Y cuando acabemos, se cierra. Se dice adiós.

Álex: Sí, mamá.

Nora: Álex.

Álex: Vale, vale.

Lo que acabas de decir es lo que tú crees. Lo que has leído. Lo que te enseñó tu prima con catorce años antes de que tú movieras el vaso. No sabes si es verdad. Nadie lo sabe.` : `
Nora coloca el tablero derecho. Las letras en arco. Los números debajo. SÍ a un lado, NO al otro. ADIÓS abajo. El vaso boca abajo en el centro. Las velas a los lados. ${pov === "irene" ? "Las enciendes tú, con el mechero de Álex." : "Irene las enciende con el mechero de Álex."}

Nora: Pon los dedos encima. Sin apretar. Tú lo desplazas, pero no intentes llevarlo a ningún sitio. Las preguntas las hacemos por turnos. Nadie quita el vaso de golpe. Y cuando acabemos, se cierra. Se dice adiós.

Álex: Sí, mamá.

Nora: Álex.

Álex: Vale, vale.

Lo dice como quien sabe. Nadie en esta mesa sabe. ${pov === "irene" ? "Pero ella lo dice mejor que nadie, eso hay que reconocérselo." : "Pero suena bien, y a estas horas eso es casi lo mismo."}`;

      const adios = `
Álex asiente solemnemente.

Silencio.

Coloca los dedos. La punta. Los otros seis, sobre la mesa, esperando.

Todos esperáis.

Álex desliza lentamente el vaso.

Muy serio.

Hasta ADIÓS.

Retira las manos.

Álex: Bueno, chicos. Ha sido emocionante.

Marcos se ríe. ${pov === "irene" ? "Tú también." : "Irene también."} ${pov === "nora" ? "Tú no." : "Nora no."}

Nora: Vale. Lo sabía.

Se levanta.

Nora: Trae eso.

Álex retrocede con el vaso.

Álex: No, no, no. Ya.

Nora: Álex.

Álex: Se acabó.

Nora: Que me lo des.

Álex baja el tono. Se le ve bajarlo. Es lo único que tiene Álex que no tiene nadie: sabe exactamente cuándo se ha pasado, y le da igual, y a veces no.

Álex: Nor. Va. En serio.

Nora le mira.

Álex: Me pongo serio.`;

      const cierre = {
        nora: modo(api, "nora", {
          lucido: "~ Lo hace porque se ha dado cuenta de que estoy cabreada de verdad. Eso es lo peor: que sabe leerlo y lo usa.",
          asustado: "~ Que se ponga serio. Que se ponga serio de verdad. Porque si esto empieza y él sigue así, yo no sé qué va a estar riéndose con él.",
          tenso: "~ «Nor.» No me llames Nor. Marcos me llama Nor.",
          ido: "~ Ha dicho adiós antes de decir hola. Eso tiene que significar algo. Todo significa algo a estas horas.",
          perdido: "~ Ha dicho adiós. Se lo ha dicho a ella. Y ella no se ha ido.",
          normal: "~ Una gilipollez más y lo hago yo. Una más. Lo digo en serio y él lo sabe.",
        }),
        marcos: modo(api, "marcos", {
          lucido: "~ Ha dicho adiós antes de empezar. Es el chiste más viejo que existe y nos hemos reído los dos. Nora no. Nora tiene una idea de esto que no es un chiste.",
          asustado: "~ Que empiece. Que empiece y que se acabe. No me gusta cómo se ha reído Irene.",
          tenso: "~ Nora de pie, Álex con el vaso en alto. Y yo aquí. Otra vez de árbitro. Cinco años de árbitro.",
          ido: "~ ADIÓS. Las letras se han quedado encendidas un momento después de que quitara el vaso. No. Es la vela.",
          perdido: "~ Ha dicho adiós y alguien se ha ido. Lo he notado. Como cuando alguien sale de una habitación a tu espalda.",
          normal: "~ Muy bueno. Muy bueno y muy Álex. Y ahora a ver cuánto le dura lo de serio.",
        }),
        irene: modo(api, "irene", {
          lucido: "~ Se ha pasado. Lo justo. Nora está a un comentario de hacerlo ella y entonces la bombilla no sirve de nada.",
          asustado: "~ Que no la cabree más. Que la deje empezar. Quiero que esto empiece y quiero que acabe y no sé por qué.",
          tenso: "~ Nora de pie. Nora mandando. En mi mesa. Con mis amigos. Con mi luz.",
          ido: "~ Álex ha dicho adiós y, por un segundo, ha sonado a otra cosa. A alguien que se despide de verdad.",
          perdido: "~ Ha dicho adiós y ha sonado a despedida. A que alguien ya se está yendo. No sé quién.",
          normal: "~ Perfecto. Que se rían ahora. Cuanto más se rían ahora, menos van a reírse luego.",
        }),
      }[pov];

      return `${pendulo}
${irenePrepara}
${reglas}
${adios}

${cierre}`;
    },
    opciones: [
      // Nora
      { texto: "«Como vuelvas a hacer una gilipollez, te levantas y lo hago yo.»", a: "o4_falsas", si: (api) => P(api) === "nora",
        efecto: (api) => { api.marcar("nora_amenaza", true); api.est("nora", "eje", 2); api.rel("alex", "nora", "tension", 2); } },
      { texto: "Reírte por fin. «Eres imbécil.» Y sentarte.", a: "o4_falsas", si: (api) => P(api) === "nora",
        efecto: (api) => { api.est("nora", "estres", -3); api.rel("alex", "nora", "afecto", 2); } },
      { texto: "No decir nada. Quedarte de pie, mirándole, hasta que baje el tono solo.", a: "o4_falsas", si: (api) => P(api) === "nora",
        efecto: (api) => { api.rel("alex", "nora", "afecto", 2); api.est("nora", "estres", 2); } },
      // Marcos
      { texto: "Reírte. «Ha sido bueno.»", a: "o4_falsas", si: (api) => P(api) === "marcos",
        efecto: (api) => { api.rel("alex", "marcos", "afecto", 2); api.rel("nora", "marcos", "resentimiento", 2); } },
      { texto: "«Álex. Ya.» Del lado de Nora.", a: "o4_falsas", si: (api) => P(api) === "marcos",
        efecto: (api) => { api.rel("nora", "marcos", "confianza", 3); api.rel("alex", "marcos", "tension", 2); } },
      { texto: "Sacar el móvil. Grabar tú también. Otro ángulo.", a: "o4_falsas", lucida: true, si: (api) => P(api) === "marcos",
        efecto: (api) => { api.marcar("marcos_graba_ouija", true); api.evidencia("video_marcos_ouija", "marcos", "móvil de Marcos, en el aparador", "video"); api.est("marcos", "lucidez", 1); } },
      // Irene
      { texto: "Reírte con él. Es tu público.", a: "o4_falsas", si: (api) => P(api) === "irene",
        efecto: (api) => { api.est("irene", "eje", 1); api.rel("nora", "irene", "resentimiento", 2); } },
      { texto: "«Álex. En serio. Que la vas a cabrear.» Con la voz de responsable.", a: "o4_falsas", si: (api) => P(api) === "irene",
        efecto: (api) => { api.est("irene", "eje", 2); api.rel("nora", "irene", "confianza", 2); } },
      { texto: "El pie por su pantorrilla, por debajo. «Empieza ya.»", a: "o4_falsas", si: (api) => P(api) === "irene",
        efecto: (api) => { api.marcar("irene_prisa", true); api.rel("alex", "irene", "tension", 2); } },
    ],
  },

  o4_falsas: {
    pov: (api) => P(api),
    titulo: "La ouija · Las respuestas de Álex",
    hora: "03:05",
    texto: (api) => {
      const pov = P(api);
      const nora = api.bandera("nora_amenaza") ? `
Nora: Como vuelvas a hacer una gilipollez, te levantas y lo hago yo.

Álex: Palabra.

Pausa.

Álex: De médium.

Nora: Álex.

Álex: Vale, vale.` : `
Álex: Palabra.

Pausa.

Álex: De médium.

Nora: Álex.

Álex: Vale, vale.`;

      const primera = `
Y ahora sí.

Irene se inclina hacia la tabla. Entra en el personaje como entra en todo: entera.

Irene: ¿Hay alguien aquí?

Álex tiene los dedos en el vaso. Empieza a moverlo.

Nora: No tan rápido.

Frena. Lo lleva despacio, con la cara de quien no lo lleva.

S.

Í.

Álex abre un poco los ojos. Interpretando.

Álex: Hostia.

Marcos: Actor's Studio.

Álex: Yo no estoy eligiendo.

Nora: Sí, claro.`;

      const golpe = pov === "irene" ? `
Tu talón. El travesaño.

[toc]

Toc.

Todos miran la mesa. Tú pones la cara. La de nada. La tienes ensayada desde los doce años.

Álex: ¿Habéis oído eso?

Marcos: He oído algo.

Álex te mira medio segundo. Lo justo. Le has dado su golpe y él lo sabe.` : `
[toc]

Toc.

Debajo de la mesa. Seco. Como un nudillo en madera.

Todos miráis la mesa. Irene pone cara de nada.

Álex: ¿Habéis oído eso?

Marcos: He oído algo.`;

      const energia = `
Álex cierra los ojos. Levanta un poco la barbilla.

Álex: Estoy sintiendo una energía...`;

      if (pov === "nora") return `${nora}
${primera}
${golpe}
${energia}

${modo(api, "nora", {
  lucido: "~ Está exagerando para que le conteste. Si le contesto, gana. Si no le contesto, sigue. Y si sigue, en algún momento se le acaba el chiste y queda la mesa.",
  asustado: "~ El golpe. El golpe no ha sido Álex. Álex tiene las dos manos en el vaso. Y no ha sido Marcos. Y no ha sido...",
  tenso: "~ Cuatro cervezas. Eso es lo que está sintiendo. Cuatro cervezas y ganas de que le miren.",
  ido: "~ Una energía. Tiene gracia. Yo también la noto. Está en la mesa, debajo de la madera, y sube por las patas.",
  perdido: "~ La está sintiendo. La está sintiendo de verdad y no lo sabe. Es ella. Es ella que ha llegado.",
  normal: "~ Le puedo seguir la corriente o puedo no dársela. Las dos cosas son Nora. Solo una de ellas mira la mesa.",
})}

Tienes una frase en la boca. Y tienes la mesa delante.`;

      if (pov === "marcos") return `${nora}
${primera}
${golpe}
${energia}

${modo(api, "nora", {
  lucido: "Nora: Lo que estás sintiendo son cuatro cervezas.",
  asustado: "Nora no dice nada. Se ha quedado mirando la mesa.",
  tenso: "Nora: Lo que estás sintiendo son cuatro cervezas.",
  ido: "Nora no dice nada. Está mirando las velas como si le hablaran.",
  perdido: "Nora no dice nada. Mira las velas.",
  normal: "Nora: Lo que estás sintiendo son cuatro cervezas.",
})}

${["asustado", "ido", "perdido"].includes(api.modo("nora")) ? "Álex abre un ojo. Nadie le ha contestado. Baja la barbilla, un poco decepcionado." : "Risas. Álex abre los ojos con cara de ofendido y sigue."}

Álex: Vale. Siguiente.

Marcos: Vale, yo tengo una.

Álex: Adelante.

${modo(api, "marcos", {
  lucido: "~ El golpe ha venido de abajo. De la mesa, no del suelo. Alguien tiene un pie donde no toca. Hay tres pares de pies debajo de esta mesa que no son míos.",
  asustado: "~ No ha sido Álex. Álex tiene las dos manos encima. No ha sido Álex y quiero que haya sido Álex.",
  tenso: "~ Si me pongo a buscar pies debajo de la mesa soy el gilipollas de la noche. Si no los busco, el gilipollas es el que hace los golpes.",
  ido: "~ El golpe ha sonado dos veces. Una en la mesa y otra un poco después, dentro. Como el hielo en la cocina.",
  perdido: "~ Ha llamado. Alguien ha llamado desde debajo de la mesa. Se llama a la puerta cuando se quiere entrar.",
  normal: "~ Pregunta tonta, respuesta tonta. Que se vea de qué va esto. Y de paso, mirar.",
})}

Tienes la pregunta. Y tienes medio segundo mientras Álex mueve para mirar donde nadie está mirando.`;

      // Irene
      return `${nora}
${primera}
${golpe}
${energia}

${modo(api, "nora", {
  lucido: "Nora: Lo que estás sintiendo son cuatro cervezas.\n\nRisas. Álex abre los ojos con cara de ofendido y sigue.",
  asustado: "Nora no dice nada. Se ha quedado mirando la mesa. Mejor. Cuanto más mire las velas, menos te mira a ti.",
  tenso: "Nora: Lo que estás sintiendo son cuatro cervezas.\n\nRisas. Álex abre los ojos con cara de ofendido y sigue.",
  ido: "Nora no dice nada. Está mirando las velas como si le hablaran. Mejor. Cuanto más mire las velas, menos te mira a ti.",
  perdido: "Nora no dice nada. Mira las velas. Mejor.",
  normal: "Nora: Lo que estás sintiendo son cuatro cervezas.\n\nRisas. Álex abre los ojos con cara de ofendido y sigue.",
})}

Álex: Vale. Siguiente.

Marcos: Vale, yo tengo una.

Álex: Adelante.

Marcos se inclina. Tiene esa cara de «esto es una tontería y por eso me quedo».

${modo(api, "irene", {
  lucido: "~ Un golpe ha bastado. Dos serían mejores. Tres serían de aficionada.",
  asustado: "~ Ha sonado más fuerte de lo que quería. O la casa ha sonado con él. La madera de esta casa hace eso: te devuelve las cosas más grandes.",
  tenso: "~ Nora mirando la mesa como si fuera suya. Pues toma mesa.",
  ido: "~ Cuando he dado el golpe, algo ha contestado. Un poco después. No. Ha sido el eco. Las casas de madera tienen eco.",
  perdido: "~ He llamado y han contestado. Debajo. Alguien ha dado un golpe debajo del mío.",
  normal: "~ Marcos va a preguntar una tontería. Álex va a contestar otra. Y en medio, si quiero, la mesa habla.",
})}

Tienes el talón en el travesaño. Y a Marcos cogiendo aire.`;
    },
    opciones: [
      // Nora: entrar al trapo o mirar la mesa. No hay opción «mirar la vela». La vela viene sola.
      { texto: "«Lo que estás sintiendo son cuatro cervezas.»", a: "o5_irene", si: (api) => P(api) === "nora",
        efecto: (api) => { api.marcar("nora_vio_llama", false); api.est("nora", "estres", -2); api.rel("alex", "nora", "afecto", 2); } },
      { texto: "No entrar. Callarte. Mirar la mesa.", a: "o5_irene", si: (api) => P(api) === "nora",
        efecto: (api) => { const v = api.anomalia("llama_velas"); api.marcar("nora_vio_llama", v); if (v) { api.saber("nora", "llama_velas"); api.presenciar("nora", 1); } } },
      { texto: "Mirar a Irene. Que es la que se ríe.", a: "o5_irene", si: (api) => P(api) === "nora",
        efecto: (api) => { api.marcar("nora_vio_llama", false); api.marcar("nora_sospecha_irene", true); api.est("nora", "lucidez", 1); } },
      // Marcos: la pregunta es la misma; lo que cambia es dónde mira
      { texto: "«¿Te cae bien Álex?» Y mirar el vaso.", a: "o5_irene", si: (api) => P(api) === "marcos",
        efecto: (api) => { api.marcar("marcos_falsas", "vaso"); } },
      { texto: "«¿Te cae bien Álex?» Y mirar debajo de la mesa mientras Álex mueve.", a: "o5_irene", si: (api) => P(api) === "marcos",
        efecto: (api) => { api.marcar("marcos_falsas", "mesa"); api.marcar("marcos_miro_mesa", true); api.est("marcos", "lucidez", 1); } },
      { texto: "«Álex. Los pies quietos.» Antes de preguntar.", a: "o5_irene", si: (api) => P(api) === "marcos",
        efecto: (api) => { api.marcar("marcos_falsas", "alex"); api.marcar("marcos_culpa_alex", true); api.rel("alex", "marcos", "resentimiento", 1); } },
      // Irene: cuántos golpes
      { texto: "Otro. Con el talón. Cuando Marcos pregunte.", a: "o5_irene", si: (api) => P(api) === "irene",
        efecto: (api) => { api.marcar("golpes_irene", 2); } },
      { texto: "Ninguno más. Guardarlo.", a: "o5_irene", si: (api) => P(api) === "irene",
        efecto: (api) => { api.marcar("golpes_irene", 1); api.est("irene", "lucidez", 1); } },
      { texto: "La rodilla contra el bajo de la mesa. Que vibren los vasos.", a: "o5_irene", si: (api) => P(api) === "irene",
        efecto: (api) => { api.marcar("golpes_irene", 3); api.marcar("marcos_sospecha", true); api.est("irene", "eje", 2); } },
    ],
  },

  o5_irene: {
    pov: (api) => P(api),
    musica: "terror_suave",
    titulo: "La ouija · Irene",
    alEntrar: (api) => {
      // Lo que hacen los que no llevamos, con sus reglas de siempre
      if (api.bandera("nora_vio_llama") === undefined) {
        // Nora no entra al trapo si la fascinación manda y tiene la cabeza para mirar
        const mira = api.valor("nora", "eje") >= 50 && api.valor("nora", "lucidez") >= 55 && api.valor("nora", "estres") < 60;
        const v = mira && api.anomalia("llama_velas");
        api.marcar("nora_vio_llama", v);
        if (v) { api.saber("nora", "llama_velas"); api.presenciar("nora", 1); }
      }
      if (api.bandera("golpes_irene") === undefined) api.marcar("golpes_irene", api.lucido("irene") ? 2 : 1);
      if (!api.bandera("marcos_falsas")) api.marcar("marcos_falsas", "vaso");
    },
    texto: (api) => {
      const pov = P(api);
      const g = api.bandera("golpes_irene");
      const miro = api.bandera("marcos_miro_mesa");

      // Cómo ha quedado lo de Nora y la energía de Álex
      const llama = pov === "nora" ? (api.bandera("nora_vio_llama") ? `
No dices nada. Te quedas mirando la mesa. Álex sigue con los ojos cerrados, esperando una risa que no llega.

Y en la mesa, sin viento, sin que nadie se mueva, las dos llamas se inclinan a la vez. Hacia el mismo lado. Un segundo. Dos. Como si alguien hubiera abierto una puerta que no existe.

Miras la ventana. Cerrada. El arco de la cocina. Nadie.

Las llamas vuelven a su sitio.

No dices nada. No hay nada que decir que no suene a lo que sonaría.

~ Dos llamas. A la vez. Sin corriente. Lo he visto. Lo he visto y no se lo voy a contar a nadie de esta mesa porque sé exactamente qué cara van a poner.` : api.bandera("nora_sospecha_irene") ? `
No le contestas. Miras a Irene. Se está riendo. Con la boca. No con el resto. Irene se ríe con todo cuando le hace gracia algo, y ahora solo se ríe con la boca.

Te lo guardas.

Álex abre un ojo. Nadie le ha contestado. Baja la barbilla, un poco decepcionado.` : `
Nora: Lo que estás sintiendo son cuatro cervezas.

Risas. Álex abre los ojos con cara de ofendido.

Álex: Cinco.

Y sigue. Y tú sigues. Y la mesa es una mesa.`) : "";

      const marcosPregunta = api.bandera("marcos_culpa_alex") ? `
Marcos: Álex. Los pies quietos.

Álex: ¿Qué pies?

Marcos: Los tuyos.

Álex: Tengo las dos manos en el vaso, Sherlock.

Marcos: Los pies no son las manos.

Álex: Pregunta, anda.

Marcos: ¿Te cae bien Álex?` : `
Marcos: ¿Te cae bien Álex?`;

      const respuestaNo = `
Álex: Pregunta seria.

El vaso empieza a moverse.

N.

Álex: Marcos.

O.

Risas. De verdad esta vez.

Marcos: Bueno. Caso cerrado.

Nora también se ríe. ${pov === "irene" ? "Bien. Que se ría. Que se ría ahora." : "Se le va la cara de antes por un momento."}`;

      const debajo = pov === "marcos" && miro ? `
Mientras Álex movía, has mirado debajo de la mesa. Rápido. Como se mira un reloj.

Los pies de Irene, descalzos, uno apoyado en el travesaño. Como se apoya un pie. Los de Álex, quietos, con las zapatillas. Los de Nora, cruzados por los tobillos.

Nada.

${g >= 2 ? "Y el segundo golpe no llega mientras miras. Llega después, cuando ya te has incorporado. Toc. Como si hubiera esperado.\n\nIrene te está mirando. Sonríe. Irene sonríe cuando la miran." : "No hay segundo golpe. Te incorporas. Irene te está mirando. Sonríe."}` : g >= 3 ? `
[toc]

Toc.

[temblor]

Y la mesa vibra. Un temblor corto, de dentro. Los vasos tiemblan. La llama de una vela se estira.

${pov === "irene" ? "La rodilla. Contra el bajo de la mesa. Duele un poco. Merece la pena: Marcos ha mirado debajo de la mesa como quien mira debajo de la cama." : "Marcos mira debajo de la mesa. Fugaz. No ve nada. Se incorpora con la cara de quien no ha visto nada y le molesta."}` : g >= 2 ? `
[toc]

Toc.

Otra vez. Desde abajo. ${pov === "irene" ? "Tu talón. Con más cuidado esta vez: Marcos tiene la cabeza ladeada, escuchando." : "Marcos ladea la cabeza. Mira debajo de la mesa, fugaz. Nada. Se incorpora."}` : `
${pov === "irene" ? "Guardas el talón. Un golpe ha sido suficiente. Dos sería insistir, y tú nunca insistes." : "Marcos mira debajo de la mesa, fugaz, por si acaso. Nada."}`;

      const otra = `
Irene: Yo otra. Tengo otra.

Nora: Joder, Irene.

Irene: Es buena.

${api.bandera("irene_prisa") ? (pov === "irene" ? "Álex te mira. Le has dicho que empezara. Pues empieza." : "Álex mira a Irene.\n\nÁlex: Tú has dicho que empezara.\n\nIrene: Pues empieza.") : (pov === "irene" ? "Miras a Álex. Álex entiende que empieza el número fuerte. Se le ve entenderlo: se le va la sonrisa a un sitio más pequeño." : "Irene mira a Álex. Álex la mira. Algo pasa entre los dos que es lo de siempre entre los dos.")}

Irene: ¿Con quién de esta mesa quieres hablar?

Álex mueve.

I.

${pov === "irene" ? "Ya has empezado a poner la cara. Una inquietud pequeña. Bien medida. Llevas toda la vida midiéndola." : "Irene ya ha empezado a poner cara. Una inquietud pequeña. Bien medida."}

R.

Marcos: Ir...

E.

Álex aguanta la sonrisa. Casi.

N.

Nora mira a Irene.

E.

IRENE.

[silencio]`;

      if (pov === "irene") return `${llama}${marcosPregunta}
${respuestaNo}
${debajo}
${otra}

Y sonríes. Todavía. Una fracción.

Luego no.

Vas a inspirar para la siguiente frase, la de «¿yo?», la que tenías preparada, y no entra.

No entra.

Intentas otra vez. Es como si el aire llegara a la garganta y allí se quedara, sin sitio, delante de una puerta cerrada. Los pulmones hacen el gesto. Solo el gesto.

Te llevas una mano al cuello. No hay nada en el cuello. Te llevas la otra.

La habitación está exactamente igual. Las velas. El tablero. El vaso sobre la E. Nadie ha entrado. No hay frío, no hay voz, no hay nada. Solo tú, sin aire, en una mesa con tres personas que te están mirando.

Y Álex sonriendo.

Álex sonriendo porque piensa que ahora viene tu parte.

~ Para. Ya está. Para. Para, Álex.

No puedes decirlo. No sale. No sale nada.

${modo(api, "irene", {
  lucido: "~ No es un atragantamiento. No he tragado nada. No es un ataque de ansiedad, sé cómo son. Es que no hay aire. Es que no hay aire y todo lo demás sigue.",
  asustado: "~ Me estoy muriendo. Me estoy muriendo en una broma. Me estoy muriendo delante de Álex y Álex sonríe.",
  tenso: "~ Nora me mira. Nora me mira y no sabe. Nadie sabe. Se me ha ido la cara y nadie sabe.",
  ido: "~ El aire está ahí. Lo veo. Está delante de mi boca y no entra. Como si tuviera la forma equivocada.",
  perdido: "~ Ha dicho mi nombre y me ha cogido. Por dentro. Me ha cogido por dentro del cuello.",
  normal: "~ Que se acabe. Que se acabe. Que me vea alguien. Que alguien vea que no es esto.",
})}

Y tienes un segundo. Uno. Antes de que el cuerpo decida por ti.`;

      if (pov === "marcos") return `${llama}${marcosPregunta}
${respuestaNo}
${debajo}
${otra}

Irene sonríe todavía. Una fracción.

Luego no.

Se lleva una mano al cuello. Después la otra.

Álex sonríe más. Se le ve pensarlo: ahora viene su parte.

Irene inspira. No. Hace el gesto de inspirar. Es distinto. No sabrías decir en qué.

${modo(api, "marcos", {
  lucido: "~ Se ha quedado sin aire. O lo hace muy bien. Con Irene nunca se sabe, y ese es exactamente el problema de Irene.",
  asustado: "~ No. No, no. Que sea teatro. Que sea teatro. Álex está sonriendo, así que es teatro.",
  tenso: "~ Otro numerito. Otro. Y Álex encantado. Y yo aquí.",
  ido: "~ Se ha puesto de otro color. No. Es la vela. Las velas ponen a la gente de otro color.",
  perdido: "~ Le está pasando algo. Se lo está haciendo alguien. Se lo está haciendo desde dentro.",
  normal: "~ Muy buena, Irene. Muy buena. Ahora respira, que ya está.",
})}

Tienes medio segundo. Como todo el mundo en esta mesa.`;

      return `${llama}${marcosPregunta}
${respuestaNo}
${debajo}
${otra}

Irene sonríe todavía. Una fracción.

Luego no.

Se lleva una mano al cuello. Después la otra.

Álex sonríe más. Se le ve pensarlo: ahora viene su parte.

${api.bandera("nora_sospecha_irene") ? "Y tú la estás mirando. Ves el momento exacto en que la cara le cambia. No sabrías decir en qué. Solo que cambia." : "Irene inspira. No. Hace el gesto de inspirar. Es distinto. No sabrías decir en qué."}

${modo(api, "nora", {
  lucido: "~ Se ha escrito su propio nombre. Se lo ha escrito Álex, y lo sabía, y ahora hace el número. Y lo hace bien. Lo hace demasiado bien.",
  asustado: "~ No respira. No respira. Que sea teatro. Álex sonríe, así que es teatro. Álex sonríe.",
  tenso: "~ Su nombre. Cómo no. Cómo no iba a ser su nombre. Todo acaba siendo su nombre.",
  ido: "~ El vaso sigue en la E. Y se ha quedado ahí como si pesara. Como si no pudiera irse de la E.",
  perdido: "~ La ha llamado. Ha dicho su nombre y la ha cogido. Está pasando ahora. Está pasando delante de mí.",
  normal: "~ Muy buena. Muy buena, Irene. Ahora respira y nos reímos todos.",
})}

Tienes medio segundo. Como todo el mundo en esta mesa.`;
    },
    opciones: [
      // Irene: nada funciona del todo. Pero no es lo mismo pedir ayuda que aguantar.
      { texto: "Hacerle una señal a Álex. Con la mano. Con los ojos. Lo que sea.", a: "o6_accidente", si: (api) => P(api) === "irene",
        efecto: (api) => { api.marcar("irene_senal", true); api.rel("irene", "alex", "confianza", -10); api.rel("irene", "alex", "resentimiento", 8); api.est("irene", "miedo", 8); } },
      { texto: "Aguantar. No dar el espectáculo. Va a pasar.", a: "o6_accidente", si: (api) => P(api) === "irene",
        efecto: (api) => { api.marcar("irene_aguanta", true); api.est("irene", "estres", 8); api.est("irene", "eje", 1); } },
      { texto: "Levantarte. Ya.", a: "o6_accidente", si: (api) => P(api) === "irene",
        efecto: (api) => { api.marcar("irene_levanta_ya", true); api.est("irene", "miedo", 6); } },
      // Nora
      { texto: "«Irene.»", a: "o6_accidente", si: (api) => P(api) === "nora",
        efecto: (api) => { api.marcar("nora_dijo_irene", true); api.rel("nora", "irene", "proteccion", 2); } },
      { texto: "«Muy buena.» Como Álex.", a: "o6_accidente", si: (api) => P(api) === "nora",
        efecto: (api) => { api.marcar("nora_se_burlo", true); api.rel("irene", "nora", "resentimiento", 6); } },
      { texto: "Mirar a Álex. No a Irene. A Álex.", a: "o6_accidente", lucida: true, si: (api) => P(api) === "nora",
        efecto: (api) => { api.marcar("nora_miro_alex", true); api.est("nora", "lucidez", 1); } },
      // Marcos
      { texto: "«Irene.» Y levantarte.", a: "o6_accidente", si: (api) => P(api) === "marcos",
        efecto: (api) => { api.marcar("marcos_se_levanta", true); api.rel("marcos", "irene", "proteccion", 3); } },
      { texto: "«Muy buena.»", a: "o6_accidente", si: (api) => P(api) === "marcos",
        efecto: (api) => { api.marcar("marcos_se_burlo", true); api.rel("irene", "marcos", "resentimiento", 4); } },
      { texto: "Mirar a Álex. Está sonriendo.", a: "o6_accidente", lucida: true, si: (api) => P(api) === "marcos",
        efecto: (api) => { api.marcar("marcos_miro_alex", true); api.est("marcos", "lucidez", 1); } },
    ],
  },

  o6_accidente: {
    pov: (api) => P(api),
    fondo: "assets/fondos/ouija_negro.jpg",
    musica: "terror",
    titulo: "La ouija · Su nombre",
    texto: (api) => {
      const pov = P(api);
      const senal = api.bandera("irene_senal");
      const burla = api.bandera("nora_se_burlo") ? "Nora: Muy buena." : "Nora: Irene.";
      const burlaM = api.bandera("marcos_se_burlo") ? "Marcos: Muy buena." : api.bandera("marcos_se_levanta") ? "Marcos ya está de pie.\n\nMarcos: Irene." : "Marcos: ¿Irene?";

      if (pov === "irene") return `
${api.bandera("irene_levanta_ya") ? "Te levantas antes de decidirlo." : api.bandera("irene_aguanta") ? "Aguantas tres segundos más de lo que podías. Luego el cuerpo decide." : "El cuerpo decide."}

La silla sale hacia atrás. Las patas contra la madera.

Estás de pie con las dos manos en el cuello.

${burla}

Álex tarda un segundo. Un segundo entero.

Álex: Muy buena.

${senal ? `Le miras. Le haces el gesto. La mano abierta, corta, hacia abajo: para.

Y Álex te guiña un ojo.

Te guiña un ojo.` : "Álex sigue sonriendo. Está esperando el remate. El tuyo."}

Te apoyas en la mesa. La golpeas sin querer, con las dos manos, con el peso. Los vasos saltan. El tablero se desplaza. Las llamas se agitan. Una se apaga. Después la otra.

La lámpara.

[parpadeo]

Clic.

Oscuridad.

Luz.

${burlaM}

Vuelves a intentar respirar. No.

Clic.

Nora se levanta.

[parpadeo]

Otro fogonazo. La cara de Álex, sin sonrisa, un instante.

[corte]

[negro]

Y negro.

Queda el rojo de la chimenea, a brasas. La ventana, azul. La pantalla del móvil, contra la botella, grabando el negro.

Y falta un ruido. El único que debería estar. El tuyo.

${modo(api, "irene", {
  lucido: "~ Ha sido la bombilla. Mi bombilla. Lo he preparado yo y ahora estoy a oscuras en mi propio truco y no puedo respirar.",
  asustado: "~ Que me vean. Que me vean. Que alguien vea que no es esto.",
  tenso: "~ Álex. Álex, hijo de puta. Sonríe. Sonríe, que es tu número.",
  ido: "~ La oscuridad pesa. Se me ha metido en la boca. Es lo que no me deja. Es la oscuridad, que ocupa el sitio del aire.",
  perdido: "~ Me está sujetando. Por dentro. Alguien me está sujetando por dentro del cuello y ha apagado la luz para hacerlo.",
  normal: "~ Alguien. Quien sea. Marcos. Nora. Quien sea.",
})}

Las piernas ya no son tuyas.`;

      if (pov === "marcos") return `
La silla de Irene sale hacia atrás. Las patas contra la madera.

Se pone de pie con las dos manos en el cuello.

${burla}

Álex tarda un segundo. Un segundo entero.

Álex: Muy buena.

${senal ? "Irene le hace un gesto con la mano. Corto. Hacia abajo. Álex le guiña un ojo. Sigue pensando que es el número." : "Álex sigue sonriendo. Está esperando el remate."}

Irene se apoya en la mesa. La golpea sin querer, con el peso. Los vasos saltan. El tablero se desplaza. Las llamas se agitan. Una se apaga. Después la otra.

La lámpara.

[parpadeo]

Clic.

Oscuridad.

Luz.

${burlaM}

Clic.

Nora se levanta.

[parpadeo]

Otro fogonazo. La cara de Álex, sin sonrisa, un instante.

[corte]

[negro]

Y negro.

Queda el rojo de la chimenea, a brasas. La ventana, azul. La pantalla del móvil de Irene, contra la botella, grabando el negro.

Y falta un ruido. Tardas un momento en saber cuál. El de Irene respirando.

${modo(api, "marcos", {
  lucido: "~ La lámpara ha parpadeado antes de irse. Eso no lo hace un fusible. Eso lo hace un contacto. Y Irene no respira, o no la oigo, y las dos cosas no pueden ser la misma urgencia.",
  asustado: "~ Luz. Luz. Que haya luz y que Irene esté haciendo el tonto cuando haya luz.",
  tenso: "~ Tres cosas. Irene, la lámpara, la cocina. Una. Elige una. Elige ya.",
  ido: "~ La oscuridad ha llegado un poco después que el clic. Todo llega un poco después. Irene también va a llegar.",
  perdido: "~ Se ha apagado porque hay alguien más en la habitación. Y ese alguien no quiere que veamos lo que le está haciendo.",
  normal: "~ Irene. La lámpara. La cocina. Tres problemas. Uno se resuelve con las manos.",
})}

${api.setas() ? "Todo llega un poco tarde. Esto también. Pero llega.\n\n" : ""}Irene se tambalea. Lo oyes: la mano buscando la mesa, y no encontrarla.`;

      return `
La silla de Irene sale hacia atrás. Las patas contra la madera.

Se pone de pie con las dos manos en el cuello.

${burla}

Álex tarda un segundo. Un segundo entero.

Álex: Muy buena.

${senal ? "Irene le hace un gesto con la mano. Corto. Hacia abajo. Álex le guiña un ojo. Sigue pensando que es el número." : "Álex sigue sonriendo. Está esperando el remate."}

Irene se apoya en la mesa. La golpea sin querer, con el peso. Los vasos saltan. El tablero se desplaza. Las llamas se agitan. Una se apaga. Después la otra.

La lámpara.

[parpadeo]

Clic.

Oscuridad.

Luz.

${burlaM}

Clic.

Te levantas.

[parpadeo]

Otro fogonazo. La cara de Álex, sin sonrisa, un instante.

[corte]

[negro]

Y negro.

Queda el rojo de la chimenea, a brasas. La ventana, azul. La pantalla del móvil de Irene, contra la botella, grabando el negro.

Y falta un ruido. Tardas un momento en saber cuál. El de Irene respirando.

${modo(api, "nora", {
  lucido: "~ Las velas se han apagado con el golpe. La lámpara ha parpadeado antes de irse. Todo tiene una explicación menos lo que no oigo.",
  asustado: "~ No respira. No la oigo. Se ha ido la luz y no la oigo y esto es exactamente lo que dice la historia. Exactamente.",
  tenso: "~ Un numerito. Un numerito con la luz. Y Álex encantado. Y yo de pie a oscuras en mi propia sesión.",
  ido: "~ La oscuridad ha llegado un poco después que el clic. Como si la luz se hubiera resistido. Como si alguien la hubiera apagado con la mano.",
  perdido: "~ Ha apagado la luz. Ella. Para que no veamos lo que le está haciendo a Irene.",
  normal: "~ Irene. Luz. Irene. Luz. Una de las dos primero.",
})}

Marcos ya se ha movido. Lo oyes. Una silla. Su voz. No sabes hacia dónde.`;
    },
    opciones: [
      // Marcos: tres reacciones. Las tres son Marcos.
      { texto: "Irene. Ir a Irene.", a: "o7_reaccion", si: (api) => P(api) === "marcos",
        efecto: (api) => { api.marcar("marcos_accion", "rescate"); } },
      { texto: "La lámpara. Es la lámpara. Está encima de la mesa.", a: "o7_reaccion", si: (api) => P(api) === "marcos",
        efecto: (api) => { api.marcar("marcos_accion", "lampara"); } },
      { texto: "La luz de la cocina. El interruptor está a tres pasos.", a: "o7_reaccion", si: (api) => P(api) === "marcos",
        efecto: (api) => { api.marcar("marcos_accion", "cocina"); } },
      // Nora
      { texto: "Ir a Irene.", a: "o7_reaccion", si: (api) => P(api) === "nora",
        efecto: (api) => { api.marcar("nora_accion_oscuro", "irene"); api.rel("nora", "irene", "proteccion", 3); } },
      { texto: "El móvil. La linterna.", a: "o7_reaccion", si: (api) => P(api) === "nora",
        efecto: (api) => { api.marcar("nora_accion_oscuro", "luz"); api.est("nora", "lucidez", 1); } },
      { texto: "Quedarte. Las manos en la mesa. Mirar donde estaba el vaso.", a: "o7_reaccion", si: (api) => P(api) === "nora",
        efecto: (api) => { api.marcar("nora_accion_oscuro", "mesa"); api.est("nora", "eje", 3); } },
      // Irene
      { texto: "Mirar a Marcos.", a: "o7_reaccion", si: (api) => P(api) === "irene",
        efecto: (api) => { api.marcar("irene_miro_marcos", true); } },
      { texto: "La ventana. Aire.", a: "o7_reaccion", si: (api) => P(api) === "irene",
        efecto: (api) => { api.est("irene", "miedo", 4); } },
      { texto: "Agarrarte a la mesa. No caerte.", a: "o7_reaccion", si: (api) => P(api) === "irene",
        efecto: (api) => { api.est("irene", "estres", 2); } },
    ],
  },

  o7_reaccion: {
    pov: (api) => P(api),
    titulo: "La ouija · A oscuras",
    hora: "03:07",
    alEntrar: (api) => {
      if (!api.bandera("marcos_accion")) api.marcar("marcos_accion", decidirMarcos(api));
      const acc = api.bandera("marcos_accion");
      // El contacto existe. Nadie lo sabe. Irene sabe que no ha sido teatro.
      api.marcar("contacto", true);
      api.marcar("contacto_inicial", "irene");
      api.saber("irene", "ahogo_real");
      api.est("irene", "miedo", 12); api.est("irene", "estres", 10); api.est("irene", "eje", -6);
      if (acc === "rescate") {
        api.marcar("huesped", "marcos");
        api.marcar("luz_por", "alex");
        api.saber("marcos", "aliento_frio");
        api.presenciar("marcos", 1.5);
        api.rel("irene", "marcos", "afecto", 8);
        api.rel("marcos", "irene", "proteccion", 6);
      } else {
        api.marcar("huesped", "irene");
        api.marcar("luz_por", acc === "lampara" ? "marcos" : "cocina");
        if (acc === "lampara") api.est("marcos", "eje", 4);
      }
    },
    texto: (api) => {
      const pov = P(api);
      const acc = api.bandera("marcos_accion");
      const noraOsc = api.bandera("nora_accion_oscuro");

      // ---------- RESCATE ----------
      if (acc === "rescate") {
        if (pov === "marcos") return `
[negro]

No piensas. Eso es lo raro. Tú siempre piensas.

Rodeas la mesa a oscuras. Te llevas una silla por delante. Irene está de pie y luego no: se dobla, y la coges por debajo de los brazos antes de que llegue al suelo, y pesa lo que pesa alguien que no se está sujetando.

Marcos: Irene. Irene. Mírame.

No te mira. Tiene la boca abierta y no entra nada. Lo oyes. Oyes que no entra nada.

La bajas al suelo. La alfombra. Le pones dos dedos en el cuello porque es lo que sabes hacer, del cursillo del trabajo, de un vídeo, de donde sea. Hay pulso. Rápido. Hay pulso y no hay aire.

${noraOsc === "luz" ? "La luz del móvil de Nora, temblando, os encuentra. Ves la cara de Irene. Está de un color que no es de Irene." : noraOsc === "irene" ? "Nora está a tu lado. De rodillas. Le sujeta la cabeza.\n\nNora: ¿Qué le pasa? ¿Qué le pasa?" : "Nora no se ha movido. Lo sabes porque no la oyes."}

Le echas la cabeza hacia atrás. Le levantas la barbilla. Le tapas la nariz.

Y soplas.

Una vez.

Y aquí pasa.

No es que tú soples hacia ella. Es que algo viene hacia ti. Una corriente. Helada. En dirección contraria. No por la boca. Más adentro. Como si Irene respirase hacia dentro de ti, y no por donde se respira.

Baja. Garganta. Pecho. Un segundo. Uno.

Te apartas. Sin decidirlo.

Respiras. Estás bien. Estás bien.

Irene inspira. Violento. Un ruido feo, de tubería. Y otro. Y tose. Y vuelve.

Marcos: ¿Qué coño...?

Irene: Estoy bien.

No está bien. Pero respira.

[luz]

[clic]

Y la luz vuelve. Así, sin más. Levantas la cabeza: Álex está subido a una silla con la mano dentro de la tulipa.

Álex: Ya está. Ya está. Era la bombilla.

Lo dice rápido. Demasiado. Y baja de la silla y no te mira a ti: mira a Irene.

${api.setas() ? "~ Frío. Era frío. Tengo la camiseta pegada y la casa está helada y he estado a punto de... Es eso. Es adrenalina. Es la seta. Las setas ponen frío en las cosas." : "~ Frío. Era frío. Y venía hacia mí. No. El aire no viene hacia ti cuando soplas. Eso no es así. Eso no es así y lo he notado."}

${modo(api, "marcos", {
  lucido: "~ Tres explicaciones. Adrenalina. El aire de sus pulmones al volver, que es más frío que el mío. O lo tercero. Las dos primeras sirven. Me quedo con las dos primeras.",
  asustado: "~ Me ha entrado algo. Me ha entrado algo por la boca y ha bajado y no sé dónde está ahora.",
  tenso: "~ No pienses en eso. No pienses en eso. Está respirando. Has hecho lo que había que hacer. Punto.",
  ido: "~ Ha sido como beber de una botella que está más fría de lo que parece. Eso es todo. Un trago.",
  perdido: "~ Ha pasado de ella a mí. Lo he sentido pasar. Ahora está aquí. Ahora está en mí.",
  normal: "~ Frío. Un segundo. Ya. Ya está. Ya está y respira.",
})}`;

        if (pov === "nora") return `
[negro]

Marcos ya no está a tu lado. Lo oyes: la silla que tira, «Irene, Irene, mírame». Lo ves a trozos, con el rojo de la chimenea: Irene doblándose, Marcos cogiéndola, los dos bajando al suelo.

${noraOsc === "irene" ? "Estás con ellos. De rodillas. Le sujetas la cabeza a Irene sin saber por qué la cabeza. Está fría. Está sudando y está fría.\n\nNora: ¿Qué le pasa? ¿Qué le pasa?" : noraOsc === "luz" ? "La linterna del móvil. Te tiembla. Los encuentra: Marcos encima de Irene, Irene con la boca abierta y un color que no es el suyo." : "No te has movido. Tienes las manos en la mesa y las dos velas apagadas delante y no te has movido. Lo ves desde aquí. Desde la mesa."}

Marcos: Irene. Irene.

Nadie contesta. Álex está de pie. Ya no sonríe. Se le ve la cara con el rojo, y no es la cara de la broma.

Marcos le echa la cabeza hacia atrás. Le tapa la nariz. Baja.

${modo(api, "nora", {
  lucido: "~ Le está haciendo la respiración. Marcos sabe hacer eso. Del trabajo. Y lo hace porque ella no respira, y ella no respira porque... porque.",
  asustado: "~ En el suelo de esta casa. Con la tabla abierta. Con su nombre escrito. Le está pasando lo que dice la historia y estoy mirando.",
  tenso: "~ Marcos con la boca en la boca de Irene. Es lo que es. Es lo que hay que hacer. Es lo que es.",
  ido: "~ Se le mete el aire por la boca y le sale por los ojos. Los ojos de Irene se han abierto un poco cuando él ha soplado.",
  perdido: "~ La está sacando. Marcos la está sacando de dentro de Irene con el aire. Y va a entrar en él. Va a entrar en él.",
  normal: "~ Respira. Respira, Irene. Respira, joder.",
})}

Un segundo. Dos.

Irene inspira. Un ruido horrible. Tose. Marcos se aparta de golpe, como si le hubiera dado un calambre.

Marcos: ¿Qué coño...?

Irene: Estoy bien.

[luz]

[clic]

Y la luz vuelve.

Álex. Subido a una silla. Con la mano en la tulipa.

Álex: Ya está. Era la bombilla.

Lo ha arreglado en dos segundos. Ni ha mirado. Ha ido directo a la silla, se ha subido, ha metido la mano y ha girado.

${api.bandera("nora_miro_alex") ? "Y antes de subirse estaba sonriendo. Lo viste. Sonreía mientras ella se ahogaba. Y ha dejado de sonreír exactamente cuando Marcos la ha bajado al suelo." : "Y ahora está mirando a Irene con una cara que no le habías visto nunca."}`;

        // Irene
        return `
[negro]

El suelo. No sabes cómo has llegado al suelo. Marcos encima. Su voz muy lejos, «mírame, mírame», y le miras, y no sirve de nada porque no es de mirar de lo que se trata.

No hay aire. Hay una puerta cerrada en la garganta y detrás de la puerta, nada.

${api.bandera("irene_senal") ? "Álex te ha guiñado un ojo. Te ha guiñado un ojo. Es lo último que has visto con luz." : "Lo último que has visto con luz es a Álex sonriendo."}

${noraOsc === "irene" ? "Otras manos. En la cabeza. Nora. Nora te está sujetando la cabeza y dice algo que no oyes." : ""}

Marcos te echa la cabeza hacia atrás. Te tapa la nariz. Su boca.

Y entra.

No es su aire. O sí. No lo sabes. Es aire, y baja, y la puerta se abre, y algo se va.

Algo se va. Lo notas irse. Como cuando se te destapa un oído. Hacia arriba y hacia fuera y hacia él.

Inspiras. El ruido que haces te da vergüenza incluso ahora. Toses. Otra vez. Estás.

Marcos se aparta de golpe. Se queda a un palmo. Te mira como no te ha mirado nunca. Ni en el sofá de Rubén.

Marcos: ¿Qué coño...?

Irene: Estoy bien.

Es lo primero que dices. Antes de saber si es verdad.

[luz]

[clic]

Y la luz. Álex en la silla, la mano en la tulipa. Rápido.

Álex: Ya está. Era la bombilla.

Lo dice como se dice «ha sido sin querer».

${modo(api, "irene", {
  lucido: "~ Ha entrado con su aire. Ha entrado y se ha ido algo. No sé qué se ha ido. Sé que antes estaba y ahora no.",
  asustado: "~ Me ha sacado algo. Marcos me ha sacado algo con la boca y se lo ha llevado. Se lo ha llevado él.",
  tenso: "~ Todos mirando. Todos encima. Nora con las manos en mi cabeza. No. No así. Así no.",
  ido: "~ El aire de Marcos sabe a cerveza y a otra cosa. A algo más frío que la cerveza.",
  perdido: "~ Se ha ido a él. Lo he notado pasar. Ahora lo tiene él y no lo sabe.",
  normal: "~ Estoy. Respiro. Estoy. Y ahora todos me están mirando, y eso es lo único que sé arreglar.",
})}`;
      }

      // ---------- LÁMPARA ----------
      if (acc === "lampara") {
        const ireneSola = `Irene está en el suelo, sentada, de espaldas a la mesa. Con las manos en el cuello. ${noraOsc === "irene" ? "Nora con ella, de rodillas, sin saber qué hacer con las manos." : "Sola."}

Y de pronto respira. Un ruido feo, de tubería. Tose. Vuelve.`;
        if (pov === "marcos") return `
[negro]

La lámpara. Ha parpadeado antes de irse: eso no lo hace un fusible. Eso lo hace una rosca.

Rodeas la mesa. Hay una silla debajo de la lámpara. ${api.bandera("marcos_vio_silla") ? "La que has visto usar a Irene hace veinte minutos para «bajar esto un poco»." : "Alguien la ha dejado ahí."} Te subes.

Abajo, a oscuras, Irene hace un ruido. Nora dice su nombre. Álex dice «Irene» con otra voz.

La tulipa quema. La bombilla, dentro, gira medio cuarto con dos dedos.

[luz]

[clic]

Luz.

Miras abajo. ${ireneSola}

Marcos: Estaba floja.

Silencio.

Miras a Irene. Luego a Álex. Álex te está mirando a ti, y no a Irene, y esa es la primera cosa rara de la noche que sí sabes explicar.

${modo(api, "marcos", {
  lucido: "~ Floja. Un cuarto de vuelta. Una bombilla no se afloja sola en una casa sin que nadie la toque en toda la noche. Alguien la ha tocado. Y solo una persona se ha subido a una silla.",
  asustado: "~ Floja. Bien. Floja es bien. Floja es una mano. Prefiero una mano.",
  tenso: "~ Un cuarto de vuelta. Un puto cuarto de vuelta. Y yo aquí subido como un idiota mientras ella se ahoga en el suelo.",
  ido: "~ La bombilla estaba caliente y floja y ha girado como si me esperara. Como si supiera que iba a venir yo.",
  perdido: "~ Alguien la ha aflojado. Alguien que no está en esta mesa. Alguien que sabía que la íbamos a necesitar.",
  normal: "~ Estaba floja. Eso es todo. Y ahora que hay luz, a ver quién pone qué cara.",
})}`;

        if (pov === "nora") return `
[negro]

Marcos no va a Irene. Lo oyes rodear la mesa hacia el otro lado. Una silla. Sube.

${noraOsc === "irene" ? "Tú sí vas. Te arrodillas. Irene está en el suelo, sentada, con las manos en el cuello, y le tocas la cara y está fría y sudando.\n\nNora: Irene. Irene, mírame." : noraOsc === "luz" ? "La linterna del móvil. Irene, en el suelo, sentada, con las manos en el cuello, cerrando los ojos contra la luz." : "No te has movido. Oyes a Irene en el suelo. Oyes que no respira. Y no te has movido."}

Álex: Irene.

Con otra voz. Sin la sonrisa.

Y entonces Irene respira. Un ruido feo, de tubería. Tose. Vuelve. Sola.

[luz]

[clic]

Luz.

Marcos, subido a una silla, con la mano dentro de la tulipa.

Marcos: Estaba floja.

Silencio.

Marcos mira a Irene. Luego a Álex. Álex mira a Marcos.

${modo(api, "nora", {
  lucido: "~ Floja. Marcos ha ido a la lámpara antes que a Irene porque la lámpara la entendía. Y la ha arreglado en dos segundos. Y ha dicho «floja» como se dice «mentira».",
  asustado: "~ Ha respirado sola. Sin que nadie la tocara. Se ha ahogado sola y ha respirado sola y en medio se ha ido la luz.",
  tenso: "~ Marcos a la lámpara. Marcos con la solución. Marcos que no ha mirado a Irene hasta que ha habido luz. Bien. Bien por Marcos.",
  ido: "~ Ha respirado cuando ha vuelto la luz. Exactamente cuando. Como si la luz fuera el aire.",
  perdido: "~ La ha soltado. Cuando Marcos ha tocado la lámpara, la ha soltado. Está en la lámpara. Está en la luz.",
  normal: "~ Floja. Vale. Floja. Y ahora que se vea la cara de cada uno.",
})}`;

        return `
[negro]

El suelo. Te has sentado sin decidirlo, de espaldas a la mesa, con las manos en el cuello. Nadie te sujeta.

${noraOsc === "irene" ? "Nora. Nora está de rodillas a tu lado, y te toca la cara, y dice tu nombre. Nora." : "Oyes a Marcos rodear la mesa. Hacia el otro lado. Hacia la lámpara. No hacia ti."}

Álex: Irene.

Con otra voz. Por fin con otra voz.

Y de pronto, sin nadie, la puerta se abre.

Inspiras. El ruido que haces te da vergüenza incluso ahora. Toses. Otra vez. Estás.

Nadie te ha tocado. Ha vuelto sola. Como se fue.

[luz]

[clic]

Luz.

Marcos, subido a una silla, con la mano en la tulipa.

Marcos: Estaba floja.

Silencio.

Te mira. Luego mira a Álex. Y lo sabe. Se le ve saberlo. Y te da exactamente igual.

${modo(api, "irene", {
  lucido: "~ Ha vuelto sola. Eso es lo peor. Si hubiera sido alguien, se lo podría contar. Ha sido nada. Se ha ido nada y ha vuelto nada.",
  asustado: "~ Ha vuelto. Y puede irse otra vez. Puede irse cuando quiera. No depende de mí.",
  tenso: "~ Marcos en la lámpara. Marcos con la bombilla. Y yo en el suelo. Nadie ha venido. Nadie.",
  ido: "~ El aire ha vuelto por la lámpara. Cuando Marcos la ha tocado. Como si estuviera en el cable.",
  perdido: "~ Me ha soltado. Me ha soltado porque ya tiene lo que quería. Ya sabe cómo entro.",
  normal: "~ Se acabó la broma. Para mí se acabó. Y ahora todos me miran, y eso es lo único que sé arreglar.",
})}`;
      }

      // ---------- COCINA ----------
      if (pov === "marcos") return `
[negro]

El interruptor de la cocina. Tres pasos. Conoces la casa: el arco, la pared, a la altura del hombro.

[luz]

[clic]

Lo das. Luz blanca, de tubo, desde la cocina, que cruza el arco y llega al salón en una franja. No ilumina la mesa. Ilumina lo que hay al lado de la mesa.

Irene, en el suelo, sentada, de espaldas a la mesa, con las manos en el cuello. ${noraOsc === "irene" ? "Nora con ella." : "Sola."} Álex de pie, sin saber dónde poner las manos. La lámpara de encima de la mesa, muerta.

Y entonces Irene respira. Un ruido feo, de tubería. Tose. Vuelve.

Álex: Irene.

Con otra voz.

Irene: Estoy bien.

No lo está. Pero respira.

Te quedas en el arco. Un segundo. Con la mano todavía en el interruptor.

${modo(api, "marcos", {
  lucido: "~ La lámpara de la mesa es la única que se ha ido. Las demás funcionan. No es el generador. No es un fusible. Es esa lámpara.",
  asustado: "~ Luz. Ya hay luz. Y sigue sin gustarme lo que veo con ella.",
  tenso: "~ He ido al interruptor. Al interruptor. Irene en el suelo y yo al interruptor. Es lo que había que hacer. Es lo que había.",
  ido: "~ La luz de la cocina llega tarde a la mesa. Se queda en el borde, como si no quisiera entrar.",
  perdido: "~ La luz no entra en la mesa. Llega hasta el borde y ahí se para. Ahí hay algo que no la deja.",
  normal: "~ Luz. Bien. Ahora la lámpara. Y luego a ver quién explica qué.",
})}`;

      if (pov === "nora") return `
[negro]

Marcos no va a Irene. Lo oyes cruzar hacia el arco. Tres pasos.

${noraOsc === "irene" ? "Tú sí vas. Te arrodillas. Irene está en el suelo, sentada, con las manos en el cuello, y le tocas la cara y está fría y sudando.\n\nNora: Irene. Irene, mírame." : noraOsc === "luz" ? "La linterna del móvil. Irene, en el suelo, sentada, con las manos en el cuello, cerrando los ojos contra la luz." : "No te has movido. Oyes a Irene en el suelo. Oyes que no respira. Y no te has movido."}

[luz]

[clic]

Luz. Blanca. Desde la cocina. Una franja que cruza el arco y llega al borde de la mesa y ahí se queda.

Y entonces Irene respira. Un ruido feo, de tubería. Tose. Vuelve. Sola.

Álex: Irene.

Con otra voz. Sin la sonrisa.

Irene: Estoy bien.

Marcos en el arco, con la mano en el interruptor. La lámpara de encima de la mesa, muerta. Las velas, apagadas. El tablero torcido.

${modo(api, "nora", {
  lucido: "~ Ha respirado sola. Y la lámpara sigue muerta. Y Marcos ha ido a la cocina en vez de a ella porque la cocina tiene interruptor y ella no.",
  asustado: "~ Sola. Se ha ahogado sola y ha respirado sola y nadie la ha tocado. Eso no es una broma. Eso es otra cosa.",
  tenso: "~ Marcos al interruptor. Al interruptor. Vale.",
  ido: "~ La luz de la cocina no llega a la mesa. Se para en el borde. Como si la mesa fuera de otro sitio.",
  perdido: "~ La ha soltado. Cuando ha llegado la luz, la ha soltado. No le gusta la luz. Eso lo sé ahora.",
  normal: "~ Vale. Luz. Y ahora la lámpara, y ahora Irene, y ahora que alguien me explique algo.",
})}`;

      return `
[negro]

El suelo. Te has sentado sin decidirlo, de espaldas a la mesa, con las manos en el cuello. Nadie te sujeta.

${noraOsc === "irene" ? "Nora. Nora está de rodillas a tu lado, y te toca la cara, y dice tu nombre. Nora." : "Oyes a Marcos cruzar hacia la cocina. No hacia ti."}

Álex: Irene.

Con otra voz. Por fin con otra voz.

[luz]

[clic]

Luz. Blanca. De la cocina. Llega hasta el borde de la mesa.

Y de pronto, sin nadie, la puerta se abre.

Inspiras. El ruido que haces te da vergüenza incluso ahora. Toses. Otra vez. Estás.

Nadie te ha tocado. Ha vuelto sola. Como se fue.

Irene: Estoy bien.

Es lo primero que dices. Antes de saber si es verdad.

${modo(api, "irene", {
  lucido: "~ Ha vuelto sola. Eso es lo peor. Si hubiera sido alguien, se lo podría contar. Ha sido nada. Se ha ido nada y ha vuelto nada.",
  asustado: "~ Ha vuelto. Y puede irse otra vez. Puede irse cuando quiera. No depende de mí.",
  tenso: "~ Marcos al interruptor. Y yo en el suelo. Nadie ha venido. Nadie.",
  ido: "~ El aire ha vuelto con la luz de la cocina. Blanco. El aire era blanco.",
  perdido: "~ Me ha soltado. Me ha soltado porque ya tiene lo que quería. Ya sabe cómo entro.",
  normal: "~ Se acabó la broma. Para mí se acabó. Y ahora todos me miran, y eso es lo único que sé arreglar.",
})}`;
    },
    opciones: [
      // Marcos, tras el rescate
      { texto: "«¿Qué coño...?» Apartarte. Un paso.", a: "o8_gilipollas", si: (api) => P(api) === "marcos" && api.bandera("marcos_accion") === "rescate",
        efecto: (api) => { api.marcar("marcos_tras", "aparta"); api.est("marcos", "miedo", 4); } },
      { texto: "Quedarte con ella. «Estás bien. Estás bien.»", a: "o8_gilipollas", si: (api) => P(api) === "marcos" && api.bandera("marcos_accion") === "rescate",
        efecto: (api) => { api.marcar("marcos_tras", "queda"); api.rel("marcos", "irene", "proteccion", 6); api.rel("irene", "marcos", "afecto", 6); } },
      { texto: "«Te has hiperventilado.» En voz alta. Para ti.", a: "o8_gilipollas", si: (api) => P(api) === "marcos" && api.bandera("marcos_accion") === "rescate",
        efecto: (api) => { api.marcar("marcos_tras", "racionaliza"); api.marcar("marcos_racionaliza", true); api.est("marcos", "eje", 3); } },
      // Marcos, en la lámpara
      { texto: "«Estaba floja.» Decirlo otra vez. Más despacio.", a: "o8_gilipollas", si: (api) => P(api) === "marcos" && api.bandera("marcos_accion") === "lampara",
        efecto: (api) => { api.marcar("marcos_tras", "floja"); api.est("marcos", "eje", 4); } },
      { texto: "Callarte. Bajar de la silla. Guardártelo.", a: "o8_gilipollas", si: (api) => P(api) === "marcos" && api.bandera("marcos_accion") === "lampara",
        efecto: (api) => { api.marcar("marcos_tras", "calla"); api.marcar("marcos_calla", true); api.est("marcos", "eje", 2); api.est("marcos", "lucidez", 1); } },
      { texto: "«¿Estás bien?» A Irene, primero.", a: "o8_gilipollas", si: (api) => P(api) === "marcos" && api.bandera("marcos_accion") === "lampara",
        efecto: (api) => { api.marcar("marcos_tras", "irene"); api.rel("marcos", "irene", "proteccion", 3); } },
      // Marcos, desde la cocina
      { texto: "Volver a Irene.", a: "o8_gilipollas", si: (api) => P(api) === "marcos" && api.bandera("marcos_accion") === "cocina",
        efecto: (api) => { api.marcar("marcos_tras", "irene"); api.rel("marcos", "irene", "proteccion", 2); } },
      { texto: "Mirar la lámpara desde el arco. Es la única que se ha ido.", a: "o8_gilipollas", si: (api) => P(api) === "marcos" && api.bandera("marcos_accion") === "cocina",
        efecto: (api) => { api.marcar("marcos_tras", "lampara"); api.marcar("marcos_sospecha", true); api.est("marcos", "lucidez", 1); } },
      { texto: "Quedarte en el arco. Mirarlos a los tres desde fuera.", a: "o8_gilipollas", si: (api) => P(api) === "marcos" && api.bandera("marcos_accion") === "cocina",
        efecto: (api) => { api.marcar("marcos_tras", "arco"); api.est("marcos", "lucidez", 1); } },
      // Nora, tras el rescate
      { texto: "«¿Cómo sabías que era la bombilla?»", a: "o8_gilipollas", lucida: true, si: (api) => P(api) === "nora" && api.bandera("marcos_accion") === "rescate",
        efecto: (api) => { api.marcar("nora_pillo_alex", true); api.est("nora", "lucidez", 1); api.rel("nora", "alex", "resentimiento", 4); } },
      { texto: "Arrodillarte con ellos. «Irene. Irene, mírame.»", a: "o8_gilipollas", si: (api) => P(api) === "nora" && api.bandera("marcos_accion") === "rescate",
        efecto: (api) => { api.rel("nora", "irene", "proteccion", 3); api.rel("irene", "nora", "resentimiento", -3); } },
      { texto: "Mirar la mesa. El tablero torcido. Las velas apagadas. El vaso.", a: "o8_gilipollas", si: (api) => P(api) === "nora" && api.bandera("marcos_accion") === "rescate",
        efecto: (api) => { api.marcar("nora_miro_vaso", true); api.est("nora", "eje", 2); } },
      // Nora, sin rescate
      { texto: "«¿Floja?»", a: "o8_gilipollas", si: (api) => P(api) === "nora" && api.bandera("marcos_accion") !== "rescate",
        efecto: (api) => { api.marcar("nora_sospecha_irene", true); api.est("nora", "lucidez", 1); } },
      { texto: "Ir a Irene. «Irene. Mírame.»", a: "o8_gilipollas", si: (api) => P(api) === "nora" && api.bandera("marcos_accion") !== "rescate",
        efecto: (api) => { api.rel("nora", "irene", "proteccion", 3); api.rel("irene", "nora", "resentimiento", -3); } },
      { texto: "Encender las velas otra vez. Que haya luz de la tuya.", a: "o8_gilipollas", si: (api) => P(api) === "nora" && api.bandera("marcos_accion") !== "rescate",
        efecto: (api) => { api.marcar("nora_velas_otra_vez", true); api.est("nora", "estres", -2); } },
      // Irene, tras el rescate
      { texto: "«Estoy bien.» Otra vez. Hasta que sea verdad.", a: "o8_gilipollas", si: (api) => P(api) === "irene" && api.bandera("marcos_accion") === "rescate",
        efecto: (api) => { api.marcar("irene_tras", "bien"); api.est("irene", "eje", 2); } },
      { texto: "No decir nada. Agarrarle la camiseta. No soltarle.", a: "o8_gilipollas", si: (api) => P(api) === "irene" && api.bandera("marcos_accion") === "rescate",
        efecto: (api) => { api.marcar("irene_tras", "agarra"); api.rel("irene", "marcos", "afecto", 6); api.rel("irene", "marcos", "proteccion", 5); } },
      { texto: "Mirar a Álex. Solo mirarle.", a: "o8_gilipollas", si: (api) => P(api) === "irene" && api.bandera("marcos_accion") === "rescate",
        efecto: (api) => { api.marcar("irene_tras", "alex"); api.rel("irene", "alex", "resentimiento", 6); } },
      // Irene, sin rescate
      { texto: "«Estoy bien. Estoy bien.» A todos. Con la voz de siempre.", a: "o8_gilipollas", si: (api) => P(api) === "irene" && api.bandera("marcos_accion") !== "rescate",
        efecto: (api) => { api.marcar("irene_tras", "bien"); api.est("irene", "eje", 2); } },
      { texto: "Quedarte en el suelo. Las manos en el cuello. Sin decir nada.", a: "o8_gilipollas", si: (api) => P(api) === "irene" && api.bandera("marcos_accion") !== "rescate",
        efecto: (api) => { api.marcar("irene_tras", "suelo"); api.est("irene", "estres", 4); api.rel("nora", "irene", "proteccion", 2); } },
      { texto: "Reírte. «Joder. Me he metido demasiado en el papel.»", a: "o8_gilipollas", si: (api) => P(api) === "irene" && api.bandera("marcos_accion") !== "rescate",
        efecto: (api) => { api.marcar("irene_tras", "risa"); api.marcar("irene_mentira", true); api.est("irene", "eje", 4); } },
    ],
  },

  o8_gilipollas: {
    pov: (api) => P(api),
    fondo: "assets/fondos/ouija_movil.jpg",
    musica: null,
    titulo: "La ouija · Sois unos gilipollas",
    hora: "03:10",
    alEntrar: (api) => {
      // Se descubre la broma. Todo el mundo cree haber descubierto todo el misterio. La tensión se desploma.
      ["nora", "marcos", "alex", "irene"].forEach((p) => api.saber(p, "prank_revelado"));
      ["nora", "marcos", "alex"].forEach((p) => { api.est(p, "estres", -5); api.saber(p, "irene_actuaba"); });
      api.est("nora", "miedo", -3); api.est("marcos", "miedo", -3);
      api.est("marcos", "eje", 6);                          // un problema resuelto
      api.rel("nora", "alex", "resentimiento", 4); api.rel("nora", "irene", "resentimiento", 3);
      api.rel("marcos", "alex", "resentimiento", 2);
      api.est("alex", "eje", 3);                            // le ha salido. Le ha salido demasiado bien.
    },
    texto: (api) => {
      const pov = P(api);
      const acc = api.bandera("marcos_accion");
      const luz = api.bandera("luz_por");
      const g = api.bandera("golpes_irene") || 0;

      // Cómo se descubre la bombilla
      let descubre;
      if (luz === "alex" && api.bandera("nora_pillo_alex")) descubre = `
Nora: ¿Cómo sabías que era la bombilla?

Álex: Se veía.

Nora: Estaba a oscuras.

Álex: ...Se intuía.

Marcos levanta la cabeza. Mira la lámpara. Mira la silla que hay debajo. Mira a Álex.

Marcos: No.`;
      else if (luz === "alex") descubre = `
Marcos se levanta. Todavía aturdido. Mira la lámpara. La silla que hay debajo. ${api.bandera("marcos_vio_silla") ? "La silla que ha usado Irene para «bajar esto un poco»." : ""}

Se sube. Mete la mano en la tulipa. Gira la bombilla. Está apretada, ahora. Alguien la ha apretado hace un minuto en dos segundos y sin mirar.

Baja. Mira a Álex.

Marcos: No.`;
      else if (luz === "marcos") descubre = api.bandera("marcos_calla") ? `
Marcos no ha dicho nada más. Ha bajado de la silla. Ha esperado a que Irene respirase normal. Y entonces, con la calma de quien ha decidido cuándo:

Marcos: Estaba floja. La bombilla. Un cuarto de vuelta.

Mira a Irene. Luego a Álex.

Marcos: No.` : `
Marcos: Estaba floja. La bombilla. Un cuarto de vuelta.

Lo ha dicho ${api.bandera("marcos_tras") === "floja" ? "dos veces. La segunda más despacio." : "una vez. Ha bastado."}

Mira a Irene. Luego a Álex.

Marcos: No.`;
      else descubre = `
Marcos deja el interruptor. Cruza el salón. Va a la lámpara muerta. Hay una silla debajo. Se sube. Mete la mano en la tulipa. Gira.

Luz. Amarilla. La de siempre.

Marcos: Estaba floja.

Baja. Mira a Irene. Luego a Álex.

Marcos: No.`;

      const golpes = g === 0 ? `
Marcos: ¿Y los golpes?

Álex: Con la rodilla.

Marcos: Tenías las dos manos en el vaso.

Álex: Y las dos rodillas debajo de la mesa.

Nadie se lo cree del todo. Nadie insiste.` : `
Marcos: ¿Los golpes también?

Silencio.

Álex sonríe.

Irene levanta el pie. Descalzo. Lo apoya en el travesaño.

[toc]

Toc.

Irene: Con el talón.

${g >= 3 ? "Irene: Y la rodilla. Para los vasos." : ""}`;

      const mentira = api.bandera("irene_mentira") ? `
Irene ya lo ha dicho antes. «Me he metido demasiado en el papel.» Y ahora lo repite, riéndose, y suena mejor la segunda vez.` : pov === "irene" ? "" : `
Irene se ríe. Pero su risa tiene algo. Un temblor pequeño, al final, que se traga.

Irene: Me he metido demasiado en el papel.`;

      const trampas = `
Nora: Sois unos putos gilipollas.

Álex: Tú hiciste trampas con catorce años. Estamos en paz.

Nora: Tenía catorce años.

Álex: Yo tengo la edad mental.

Marcos se ríe. No quería. Se ríe.

Y se rompe. La tensión. Como una cuerda que alguien suelta. Se oye soltarse.

Álex se echa hacia atrás en la silla con la cara de quien ha hecho el mejor chiste de su vida. Marcos niega con la cabeza y coge una cerveza. Nora dice «gilipollas» otra vez, más bajo, ya sin fuerza.`;

      const lectura = {
        nora: `
Y ya está. Eso es lo que hay en la mesa ahora: Irene se ha pasado interpretando. Le ha entrado ansiedad. Se ha asustado de su propia broma. Se ha ahogado con su propio número. Eso es lo que se va a contar mañana.

${api.bandera("nora_vio_llama") ? "Y la llama. La llama fue antes de todo esto. Antes de la bombilla. Las dos a la vez. Eso no era de Irene. Eso no lo sabe nadie." : api.bandera("nora_sospecha_irene") ? "Y la cara. La cara que le cambió. No sabrías decir en qué. Sigues sin saberlo." : "Y nada más. Nada más que lo que hay."}

${modo(api, "nora", {
  lucido: "~ Todo encaja. Bombilla, talón, Álex. Todo encaja tan bien que da rabia. Lo único que no encaja es el rato que ha tardado Irene en respirar.",
  asustado: "~ Era una broma. Era una broma. Entonces por qué sigo teniendo frío en las muñecas.",
  tenso: "~ En mi sesión. Con mis velas. Con mi tabla. Los dos. Riéndose.",
  ido: "~ Una broma. Todo. Hasta la parte en que no respiraba. Eso también. Sobre todo eso.",
  perdido: "~ Se ríen. Se ríen porque creen que ha sido la bombilla. Y ella les deja creerlo. Ella prefiere que se rían.",
  normal: "~ Gilipollas. Los dos. Y yo, por haberme asustado. Sobre todo yo.",
})}`,
        marcos: acc === "rescate" ? `
Y ya está. Eso es lo que hay en la mesa ahora: Irene se ha pasado interpretando. Le ha entrado ansiedad. Se ha ahogado con su propio número. Eso es lo que se va a contar mañana.

${api.bandera("marcos_racionaliza") ? "Y tú lo has dicho antes que nadie. «Te has hiperventilado.» Lo has dicho en voz alta para oírlo." : "Y tú asientes. Porque encaja. Porque todo encaja."}

${api.bandera("marcos_miro_alex") ? "Y Álex sonriendo mientras ella se ahogaba. Eso lo viste. Eso lo viste antes que la bombilla.\n\n" : ""}Menos el frío. El frío no está en la mesa. El frío está en ti.

${modo(api, "marcos", {
  lucido: "~ Hiperventilación. Espasmo de glotis. Ataque de pánico. Tres nombres para una cosa que tiene nombre. Y ninguno para lo otro.",
  asustado: "~ Todos se ríen. Yo también. Y tengo la camiseta pegada de sudor frío y el sudor no es mío. Es de dentro.",
  tenso: "~ Ríete. Ríete con ellos. Es una broma, la has resuelto, se acabó. Ríete.",
  ido: "~ El frío se ha quedado. Debajo del esternón. Como un hielo que no se termina de deshacer.",
  perdido: "~ Se ríen. Y lo que me ha entrado también se ríe. Lo noto reírse.",
  normal: "~ Una broma. Muy buena. Y un segundo de frío que no cuenta. No cuenta.",
})}` : `
Y ya está. Eso es lo que hay en la mesa ahora: Irene se ha pasado interpretando. Le ha entrado ansiedad. Se ha ahogado con su propio número. Eso es lo que se va a contar mañana.

${api.bandera("marcos_miro_alex") ? "Y Álex sonriendo mientras ella se ahogaba. Eso lo viste. Eso lo viste antes que la bombilla.\n\n" : ""}${api.bandera("marcos_culpa_alex") ? "Y tú te equivocaste de pies. Eso también se va a contar." : "Y tú has sido el que ha encontrado la bombilla. Eso también se va a contar."}

${modo(api, "marcos", {
  lucido: "~ Todo encaja. Una bombilla, un talón, un imbécil. La única variable que no controlo es cuánto ha tardado Irene en respirar. Y esa no la voy a meter en la ecuación.",
  asustado: "~ Era una broma. Bien. Bien. Entonces que se ría Irene como se ríe siempre y no como se está riendo.",
  tenso: "~ Cinco años. Cinco años de bromas. Y esta noche he estado a punto de no reírme.",
  ido: "~ La bombilla giraba como si me esperara. No. Giraba como giran las bombillas.",
  perdido: "~ Encaja demasiado bien. Las cosas que encajan demasiado bien las ha encajado alguien.",
  normal: "~ Caso cerrado. De verdad esta vez. Y ahora una cerveza y a ver qué pasa con la sesión.",
})}`,
        irene: `
Y ya está. Eso es lo que van a creer: que te has pasado interpretando. Que te ha entrado ansiedad. Que te has ahogado con tu propio número.

Que lo dejen ahí.

${acc === "rescate" ? "Marcos te mira de otra manera. No sabes cuál. Marcos tampoco." : "Nadie te ha tocado. Nadie ha venido. Y ahora todos se ríen y tú también, porque es lo que hay que hacer."}

${api.bandera("irene_senal") ? "Álex te ha guiñado un ojo mientras te ahogabas. Eso también lo vas a guardar. Eso no lo vas a dejar ahí." : ""}

${modo(api, "irene", {
  lucido: "~ Tres explicaciones sobre la mesa y todas mías. Me las he construido yo. Y ninguna es lo que ha pasado. Lo que ha pasado no tiene explicación y no tiene testigos.",
  asustado: "~ Se ríen. Que se rían. Mientras se rían no me miran la garganta.",
  tenso: "~ «Me he metido en el papel.» Cómo no. Cómo no iba a ser mi culpa. Todo acaba siendo mi culpa.",
  ido: "~ Me río y la risa sale por el sitio por donde no salía el aire. Está abierto otra vez. Por ahora.",
  perdido: "~ Se ríen porque no saben. Yo sé. Yo sé y no lo voy a decir porque decirlo es volver a sentirlo.",
  normal: "~ Perfecto. Que se rían. Y ahora, arreglar lo otro: la cara que tengo.",
})}`,
      }[pov];

      return `${descubre}

Nora: ¿Qué?

Marcos mira debajo de la mesa. Ve el pie de Irene. Ve a Irene mirándole mirar.

Irene y Álex se miran.

Nora: No.

Álex intenta mantener la cara. Le dura un segundo.

Nora: No.
${golpes}
${mentira}
${trampas}
${lectura}`;
    },
    opciones: [
      // Nora: dónde deposita el enfado
      { texto: "Enfadarte de verdad. «No tiene puta gracia.»", a: "o9_despues", si: (api) => P(api) === "nora",
        efecto: (api) => { api.marcar("nora_fraude", "enfado"); api.rel("nora", "alex", "resentimiento", 6); api.rel("nora", "irene", "resentimiento", 5); api.rel("alex", "nora", "tension", 3); } },
      { texto: "Rendirte. «Os odio. Os odio a los dos.» Riéndote.", a: "o9_despues", si: (api) => P(api) === "nora",
        efecto: (api) => { api.marcar("nora_fraude", "risa"); api.est("nora", "estres", -6); api.rel("alex", "nora", "afecto", 3); } },
      { texto: "«Y lo de ahogarte. ¿También?» A Irene.", a: "o9_despues", si: (api) => P(api) === "nora",
        efecto: (api) => { api.marcar("nora_fraude", "ahogo"); api.marcar("nora_pregunta_ahogo", true); api.est("irene", "estres", 6); api.rel("irene", "nora", "resentimiento", 4); } },
      // Marcos
      { texto: "«Sois unos gilipollas.» Riéndote. Caso cerrado.", a: "o9_despues", si: (api) => P(api) === "marcos",
        efecto: (api) => { api.marcar("marcos_fraude", "cerrado"); api.est("marcos", "eje", 4); api.est("marcos", "estres", -4); } },
      { texto: "«¿Y los de la pared? Los de antes.» Insistir.", a: "o9_despues", si: (api) => P(api) === "marcos" && api.bandera("hubo_golpes"),
        efecto: (api) => { api.marcar("marcos_fraude", "pared"); api.marcar("marcos_pregunto_pared", true); api.est("marcos", "lucidez", 1); api.rel("marcos", "irene", "confianza", -3); } },
      { texto: "«¿Estás bien? De verdad.» A Irene. Sin la coña.", a: "o9_despues", si: (api) => P(api) === "marcos",
        efecto: (api) => { api.marcar("marcos_fraude", "irene"); api.rel("marcos", "irene", "proteccion", 3); api.rel("irene", "marcos", "afecto", 3); } },
      // Irene: reírse, mentir, o decir la verdad una vez
      { texto: "Reírte. Que se rían. Que se quede ahí.", a: "o9_despues", si: (api) => P(api) === "irene",
        efecto: (api) => { api.marcar("irene_fraude", "risa"); api.est("irene", "eje", 3); } },
      { texto: "«Me he metido demasiado en el papel.»", a: "o9_despues", si: (api) => P(api) === "irene",
        efecto: (api) => { api.marcar("irene_fraude", "mentira"); api.marcar("irene_mentira", true); api.est("irene", "eje", 2); } },
      { texto: "«No ha sido teatro.» Decirlo. Una vez.", a: "o9_despues", si: (api) => P(api) === "irene",
        efecto: (api) => {
          api.marcar("irene_fraude", "verdad"); api.marcar("irene_verdad", true); api.est("irene", "estres", 6);
          // Que la crean depende de cómo suene ahora mismo y de cuánto se fíen de ella.
          // Marcos, si sintió el frío, no necesita fiarse: ya lo sabe por su cuenta.
          let m;
          if (api.sabe("marcos", "aliento_frio")) { api.saber("marcos", "ahogo_real", "deducido"); m = true; }
          else m = api.contar("irene", "marcos", "ahogo_real");
          api.marcar("marcos_cree_irene", m);
          api.marcar("nora_cree_irene", api.contar("irene", "nora", "ahogo_real"));
          api.marcar("alex_cree_irene", api.contar("irene", "alex", "ahogo_real"));
          if (!api.bandera("alex_cree_irene")) api.rel("irene", "alex", "resentimiento", 8);
        } },
    ],
  },

  o9_despues: {
    pov: (api) => P(api),
    titulo: "La ouija · Después",
    alEntrar: (api) => {
      const pov = P(api);
      const acc = api.bandera("marcos_accion");
      // Los que no llevamos, con sus reglas
      if (api.bandera("marcos_pregunto_pared") === undefined && pov !== "marcos") api.marcar("marcos_pregunto_pared", Boolean(api.bandera("hubo_golpes")) && api.lucido("marcos"));
      if (pov !== "irene" && !api.bandera("irene_mentira") && !api.bandera("irene_verdad")) api.marcar("irene_mentira", true);
      if (acc === "rescate") {
        // El beso es Irene: convierte el miedo en poder social. Ocurre la llevemos o no.
        api.marcar("irene_beso_marcos", true);
        api.rel("irene", "marcos", "tension", 8); api.rel("marcos", "irene", "tension", 5);
        api.est("irene", "eje", 6); api.rel("alex", "marcos", "celos", 5);
        api.saber("nora", "beso_marcos_irene"); api.saber("alex", "beso_marcos_irene");
        if (pov !== "nora") aplicarReaccionNora(api, decidirNora(api));
      }
    },
    texto: (api) => {
      const pov = P(api);
      const acc = api.bandera("marcos_accion");
      const r = api.bandera("nora_reaccion_beso");

      const pared = api.bandera("marcos_pregunto_pared") ? `
Marcos: ¿Y los de la pared? Los de antes.

Irene: Esos no.

Silencio.

Álex: Esos tampoco.

Marcos: Claro.

${pov === "irene" ? "Es la única frase honesta que has dicho en toda la noche y es la única que no se creen. Tiene su lógica." : pov === "marcos" ? "Lo dices como se dice «claro» cuando es que no. Y te lo apuntas. Los de la pared fueron tres, secos, espaciados. Los del talón no suenan así. Lo sabes. Lo sabes y prefieres no saberlo." : "Lo dice como se dice «claro» cuando es que no. Nadie insiste. Tú tampoco. Pero te lo apuntas."}` : "";

      const verdad = api.bandera("irene_verdad") ? `
Irene: No ha sido teatro.

Álex: Claro que no.

Irene: Álex.

Álex: Que no, que ya lo sé, que ha sido buenísimo.

${api.bandera("marcos_cree_irene") ? "Marcos no dice nada. La mira. La mira un segundo más de lo que se mira a alguien que ha hecho una broma." : "Marcos: Irene. Ya está."}

${api.bandera("nora_cree_irene") ? "Nora la mira. Y por un momento la cree. Y no quiere." : "Nora: Ya."}

${pov === "irene" ? "Lo has dicho. Una vez. No lo vas a decir dos." : ""}` : "";

      const ahogo = api.bandera("nora_pregunta_ahogo") ? `
Nora: Y lo de ahogarte. ¿También?

Irene: Sobre todo eso.

${pov === "irene" ? "Lo dices con la sonrisa. Te ha costado ponértela. Nora lo nota, porque Nora nota las cosas, y no sabe qué es lo que ha notado." : "Lo dice con la sonrisa. La de siempre. Le ha costado ponérsela, y se nota si sabes mirar."}` : "";

      if (acc !== "rescate") {
        // Sin rescate: Irene se recompone sola y decide si se queda
        if (pov === "irene") return `${pared}${verdad}${ahogo}

Todos te miran. Marcos desde la lámpara. Álex desde su silla. Nora desde donde esté Nora.

Es lo único que sabes arreglar: que te miren. Lo llevas haciendo desde los doce años. Solo hay que decidir cómo.

${modo(api, "irene", {
  lucido: "~ Si me quedo, me miran hasta que se cansen. Si me voy, hablan de mí hasta que vuelva. Lo segundo lo controlo mejor.",
  asustado: "~ Fuera de esta mesa. Fuera de esta mesa un minuto. Donde no esté la tabla.",
  tenso: "~ Nora mirándome. Con esa cara de que se lo apunta todo. Que apunte esto.",
  ido: "~ La mesa se ha quedado pequeña. Cabemos peor que antes. Como si hubiera alguien más sentado.",
  perdido: "~ Ha dicho mi nombre. Sabe mi nombre. Si me quedo en la mesa, lo vuelve a decir.",
  normal: "~ Una cerveza. Un minuto. Y vuelvo con la cara puesta.",
})}`;

        if (pov === "nora") return `${pared}${verdad}${ahogo}

Irene se levanta del suelo. Se estira el top. Se pasa las manos por el pelo. Como si viniera de la cocina.

Pero le tiembla algo. La mano, al soltarse el pelo. Un segundo.

${api.bandera("nora_dijo_irene") ? "Le dijiste su nombre antes que nadie. Antes que Marcos. Ella no lo oyó. Nadie lo oyó.\n\n" : ""}${yaHuboBeso(api) ? "Marcos la mira. Con esa cara. La que le pones a alguien que casi se te rompe delante. Y tú ya has visto esa cara esta noche, y no era para ti." : "Marcos la mira desde la lámpara con la cara de quien ha arreglado una cosa y no la otra."}

${modo(api, "nora", {
  lucido: "~ Se ha recuperado sola. Sin que nadie la tocara. Y ahora se recompone como se recompone Irene: por fuera.",
  asustado: "~ Que no se vaya. Que no se vaya sola por la casa. No después de esto.",
  tenso: "~ Un minuto de atención. Un minuto entero de todos mirándola. Ya ha cobrado.",
  ido: "~ Le tiembla la mano. La mano izquierda. La que tenía en el cuello. Como si el cuello siguiera ahí.",
  perdido: "~ Se levanta y hay algo que se levanta con ella. Un segundo después. Como una sombra que llega tarde.",
  normal: "~ Está bien. Está bien y no está bien. Con Irene siempre son las dos cosas.",
})}`;

        return `${pared}${verdad}${ahogo}

Irene se levanta del suelo. Se estira el top. Se pasa las manos por el pelo. Como si viniera de la cocina.

Pero le tiembla algo. La mano, al soltarse el pelo. Un segundo. Lo ves porque la conoces.

${modo(api, "marcos", {
  lucido: "~ Se ha recuperado sola. Eso es bueno. Eso descarta cosas. Y deja otras.",
  asustado: "~ Le tiembla la mano. A Irene no le tiembla nada. Nunca.",
  tenso: "~ La bombilla arreglada, el fraude descubierto, Irene de pie. Todo resuelto. Entonces por qué sigo de pie yo.",
  ido: "~ Se levanta despacio. Como si pesara más que antes. Como si se hubiera traído algo del suelo.",
  perdido: "~ Se ha levantado con algo. Lo ha traído del suelo. Lo lleva en el cuello.",
  normal: "~ Está bien. Le ha dado un ataque de ansiedad con su propia broma. Pasa. Pasa más de lo que la gente cree.",
})}`;
      }

      // Con rescate: el beso
      const beso = `
Marcos: ¿Seguro que estás bien?

Irene: Sí.

Respira. Todavía un poco fuerte. Le mira.

Irene: Mi héroe.

Y antes de que nadie procese la frase le agarra de la camiseta y tira de él hacia ella y le besa. En la boca. No un roce. Un beso con la boca abierta, lo bastante largo como para que deje de parecer agradecimiento y empiece a parecer otra cosa.

${api.bandera("marcos_tras") === "aparta" ? "Marcos había dado un paso atrás. No sirve de nada: Irene tiene la camiseta." : api.bandera("irene_tras") === "agarra" ? "Todavía tenía la camiseta en el puño. Solo ha tenido que tirar." : "Marcos seguía agachado con ella. No ha hecho falta tirar mucho."}

Le suelta. Sonríe.

Irene: Ya estoy mejor.

Álex: Hostia.`;

      const reaccion = {
        irene: `
Nora: ¿En serio?

Irene: ¿Qué?

Nora: Casi te mueres y te has recuperado rapidísimo.

Irene: Nora.

Nora: Nada. Nada. Es admirable.

${pov === "irene" ? "Te lo ha dicho a ti. Delante de todos. Y tiene razón, y eso es lo que no se lo vas a perdonar." : "Irene se pone recta. Álex disfruta. Se le ve disfrutar del incendio que acaba de empezar."}`,
        broma: `
Nora: Qué eficiente es la reanimación moderna.

Risas. Nora tira de Marcos hacia ella, suave, por la camiseta que Irene acaba de soltar.

Nora: Ya has cobrado.

Irene: Perfectamente.

${pov === "marcos" ? "Te dejas llevar. Es lo mejor que te ha pasado en diez minutos." : "Marcos se deja llevar. Nora sonríe. Sonríe de verdad. Eso es lo que más te molesta."}`,
        marcos: `
Nora: ¿Y tú?

Marcos: ¿Yo qué?

Nora: Nada.

Marcos: Nora, me ha besado ella.

Nora: Ya lo he visto.

${pov === "marcos" ? "Y ya está. Ha dicho «ya lo he visto» y se ha sentado. Y tú te has quedado de pie con el sabor de Irene en la boca y la cara de Nora en la cabeza." : "Marcos se queda de pie. Nora se sienta. No ha ido contra ti. Ha ido contra él. Mejor. Peor."}`,
        silencio: `
Nora no dice nada.

Mira a Irene. Mira a Marcos. Le pone la mano en la espalda, al pasar, y se sienta. Lo que tenga que decirle se lo dirá a él. No a la mesa.

${pov === "marcos" ? "Y esa mano en la espalda te dice más que cualquier frase: que lo ha visto, que no va contigo, y que luego hablaréis. Los dos solos. Como siempre." : "Ni una palabra para ti. Eso es lo que más te molesta: que no haya hecho falta."}`,
      };

      if (pov === "nora") return `${pared}${verdad}${ahogo}
${beso}

Y Nora.

${yaHuboBeso(api) ? "Otra vez. Es la segunda vez esta noche que ves la boca de Irene en Marcos, y la primera al menos era un juego." : "Es la primera vez esta noche que ves la boca de Irene en Marcos. Sabías que iba a haber una primera vez. No sabías que iba a ser así."}

Marcos te mira. Con la cara de quien no ha hecho nada y sabe que da igual. ${api.bandera("marcos_tras") === "queda" ? "Ha tardado un segundo de más en apartarse. Lo has contado." : api.bandera("marcos_tras") === "aparta" ? "Se había apartado antes. Eso lo has visto. Eso cuenta." : "No se ha apartado deprisa. Tampoco despacio. No sabrías decir."}

${modo(api, "nora", {
  lucido: "~ Lo ha hecho para recuperar la mesa. Estaba en el suelo y ahora está en el centro. Es Irene. Es exactamente Irene. Y saberlo no ayuda nada.",
  asustado: "~ Casi se muere y lo primero que hace es besarle. Casi se muere. Eso es lo que no me quito de la cabeza. Lo otro también.",
  tenso: "~ Delante de mí. Con mi camisa de él puesta. Delante de mí.",
  ido: "~ Le ha besado como se bebe. Como quien tiene sed. Y él ha tardado en cerrar la boca.",
  perdido: "~ Le ha metido algo. Con la boca. Lo que Marcos le sacó, ella se lo ha devuelto.",
  normal: "~ Vale. Vale. Dónde pongo esto. Dónde pongo esto ahora mismo.",
})}

Tienes tres sitios donde ponerlo. Y todos te miran para ver cuál eliges.`;

      if (pov === "marcos") return `${pared}${verdad}${ahogo}
${beso}
${reaccion[r] || ""}

${modo(api, "marcos", {
  lucido: "~ Lo ha hecho para recuperar la mesa. Estaba en el suelo y ahora está en el centro. Y me ha usado de escalera. Y Nora lo ha visto todo.",
  asustado: "~ Su boca. Otra vez su boca. Y esta vez no hay frío. Esta vez es solo su boca. Por qué eso me tranquiliza.",
  tenso: "~ Cinco años sin que pasara nada y esta noche dos veces. Y ninguna la he empezado yo. Y da igual.",
  ido: "~ Sabe a lo mismo que antes. A cerveza. Y a lo otro no. Lo otro se ha quedado en mí.",
  perdido: "~ Me ha besado para comprobar que sigue ahí. Lo que me metió. Lo ha tocado con la lengua.",
  normal: "~ Irene. Joder, Irene. Y Nora mirando. Y yo con las manos donde las tenía.",
})}

Y tú de pie, entre las dos.`;

      // Irene
      return `${pared}${verdad}${ahogo}

Marcos: ¿Seguro que estás bien?

Irene: Sí.

Respiras. Todavía un poco fuerte. Le miras.

Hace un minuto estabas en el suelo sin aire con tres personas encima. Ahora hay tres personas mirándote. Es lo mismo. Es exactamente lo mismo, y odias las dos cosas, y solo una de ellas sabes arreglarla.

Irene: Mi héroe.

Y le agarras de la camiseta y tiras de él y le besas. En la boca. Con la boca abierta. Lo bastante largo como para que deje de parecer agradecimiento y empiece a parecer lo que es.

${api.bandera("marcos_tras") === "aparta" ? "Había dado un paso atrás. No sirve de nada. Tienes la camiseta." : api.bandera("irene_tras") === "agarra" ? "Todavía tenías la camiseta en el puño. Solo has tenido que tirar." : "Seguía agachado contigo. No ha hecho falta tirar mucho."}

Le sueltas. Sonríes.

Irene: Ya estoy mejor.

Y es verdad. Ahora sí. Ahora la mesa vuelve a ser tuya.

Álex: Hostia.
${reaccion[r] || ""}

${modo(api, "irene", {
  lucido: "~ Ya está. Ya no soy la que se ha ahogado. Soy la que ha besado a Marcos. Es peor para todos y mejor para mí.",
  asustado: "~ Le he besado para no pensar en lo otro. Y ha funcionado un segundo. Uno.",
  tenso: "~ Nora. Nora con la cara. Que la ponga. Que la ponga toda.",
  ido: "~ Sabe a lo mismo. A lo que entró. Le he buscado el frío con la lengua y no estaba.",
  perdido: "~ Se lo he devuelto. Lo que me sacó. Se lo he devuelto con la boca. No. Se lo he dejado. Se lo he dejado a él.",
  normal: "~ Y ahora, la salida. Quedarse o irse. Las dos son buenas. Depende de qué quiera que digan cuando no esté.",
})}`;
    },
    opciones: [
      // Nora: tres posiciones de verdad, y una cuarta que es no elegir
      { texto: "«¿En serio?» A Irene. «Casi te mueres y te has recuperado rapidísimo.»", a: "o10_alda", si: (api) => P(api) === "nora" && api.bandera("marcos_accion") === "rescate",
        efecto: (api) => aplicarReaccionNora(api, "irene") },
      { texto: "«Qué eficiente es la reanimación moderna.» Y tirar de Marcos hacia ti.", a: "o10_alda", si: (api) => P(api) === "nora" && api.bandera("marcos_accion") === "rescate",
        efecto: (api) => aplicarReaccionNora(api, "broma") },
      { texto: "«¿Y tú?» A Marcos. Solo eso.", a: "o10_alda", si: (api) => P(api) === "nora" && api.bandera("marcos_accion") === "rescate",
        efecto: (api) => aplicarReaccionNora(api, "marcos") },
      { texto: "Callarte. Mirar.", a: "o10_alda", lucida: true, si: (api) => P(api) === "nora" && api.bandera("marcos_accion") === "rescate",
        efecto: (api) => { aplicarReaccionNora(api, "silencio"); api.est("nora", "lucidez", 1); } },
      // Nora, sin beso
      { texto: "«¿Estás bien?» A Irene. De verdad.", a: "o10_alda", si: (api) => P(api) === "nora" && api.bandera("marcos_accion") !== "rescate",
        efecto: (api) => { api.marcar("nora_tras", "irene"); api.rel("nora", "irene", "proteccion", 2); api.rel("irene", "nora", "resentimiento", -2); } },
      { texto: "No decir nada. Recoger el tablero. Ponerlo derecho.", a: "o10_alda", si: (api) => P(api) === "nora" && api.bandera("marcos_accion") !== "rescate",
        efecto: (api) => { api.marcar("nora_tras", "mesa"); api.est("nora", "estres", -2); api.est("nora", "eje", 1); } },
      { texto: "«Vuelve, que sin ti no hay sesión.» Con humor.", a: "o10_alda", si: (api) => P(api) === "nora" && api.bandera("marcos_accion") !== "rescate",
        efecto: (api) => { api.marcar("nora_tras", "humor"); api.rel("irene", "nora", "resentimiento", -3); api.rel("alex", "nora", "afecto", 2); } },
      // Marcos, tras el beso
      { texto: "«Nora, me ha besado ella.»", a: "o10_alda", si: (api) => P(api) === "marcos" && api.bandera("marcos_accion") === "rescate",
        efecto: (api) => { api.marcar("marcos_beso", "defiende"); api.est("marcos", "estres", -2); if (api.bandera("nora_reaccion_beso") === "marcos") api.rel("nora", "marcos", "resentimiento", 2); } },
      { texto: "«¿Podemos no convertir esto en nada raro?»", a: "o10_alda", si: (api) => P(api) === "marcos" && api.bandera("marcos_accion") === "rescate",
        efecto: (api) => { api.marcar("marcos_beso", "corta"); api.est("marcos", "estres", -2); api.rel("alex", "marcos", "afecto", 2); } },
      { texto: "Ir a Nora. Sin decir nada. La mano en su nuca.", a: "o10_alda", si: (api) => P(api) === "marcos" && api.bandera("marcos_accion") === "rescate",
        efecto: (api) => { api.marcar("marcos_beso", "nora"); api.rel("nora", "marcos", "confianza", 4); api.rel("irene", "marcos", "resentimiento", 3); } },
      // Marcos, sin beso
      { texto: "«¿Estás bien?» Otra vez. Sin la coña.", a: "o10_alda", si: (api) => P(api) === "marcos" && api.bandera("marcos_accion") !== "rescate",
        efecto: (api) => { api.marcar("marcos_beso", "irene"); api.rel("marcos", "irene", "proteccion", 2); } },
      { texto: "Apretar la bombilla del todo. Que no vuelva a pasar.", a: "o10_alda", si: (api) => P(api) === "marcos" && api.bandera("marcos_accion") !== "rescate",
        efecto: (api) => { api.marcar("marcos_beso", "lampara"); api.marcar("marcos_aprieta", true); api.est("marcos", "eje", 2); } },
      { texto: "Coger una cerveza. Y ofrecerle una a Irene.", a: "o10_alda", si: (api) => P(api) === "marcos" && api.bandera("marcos_accion") !== "rescate",
        efecto: (api) => { api.marcar("marcos_beso", "cerveza"); api.consumir("marcos", "cerveza"); api.rel("irene", "marcos", "afecto", 2); } },
      // Irene: quedarse o irse. Con frases, no con etiquetas.
      { texto: "«Estoy bien. Seguid.»", a: "o10_alda", si: (api) => P(api) === "irene",
        efecto: (api) => { api.marcar("irene_fuera", null); api.est("irene", "eje", 2); } },
      { texto: "«Voy a por una cerveza.»", a: "o10_alda", si: (api) => P(api) === "irene",
        efecto: (api) => { api.marcar("irene_fuera", "cerveza"); api.est("irene", "estres", -2); } },
      { texto: "«Necesito mear.»", a: "o10_alda", si: (api) => P(api) === "irene",
        efecto: (api) => { api.marcar("irene_fuera", "bano"); api.est("irene", "estres", 2); } },
    ],
  },

  o10_alda: {
    pov: "nora",
    musica: "terror_suave",
    titulo: "La ouija · Alda",
    hora: "03:15",
    alEntrar: (api) => {
      if (api.bandera("irene_fuera") === undefined) api.marcar("irene_fuera", decidirIrene(api));
      // Nora sabe lo que nadie más sabe: la palabra. Por eso esto es real para ella.
      api.marcar("alda_visto", true);
      api.saber("nora", "alda");
      api.presenciar("nora", 2.5);
      api.est("nora", "miedo", 6);        // sin conversión a fascinación: esto asusta
      api.est("nora", "eje", 4);          // y fascina. Las dos cosas.
      api.rel("nora", "alex", "confianza", -3);
      api.saber("alex", "no_elegi_alda"); // Álex sabe que no lo ha elegido. Nadie le va a creer.
      api.presenciar("alex", 1);
      api.presenciar("marcos", 0.5);
    },
    texto: (api) => {
      const fuera = api.bandera("irene_fuera");
      const tras = api.bandera("nora_tras");
      const salida = fuera === "cerveza" ? `
Irene: Voy a por una cerveza. ¿Alguien quiere?

Nadie quiere. Va igual. Descalza, por el arco. Se oye la nevera. No vuelve enseguida.` : fuera === "bano" ? `
Irene: Necesito mear.

${tras === "humor" ? "Nora: Vuelve, que sin ti no hay sesión.\n\nIrene: Sin mí no hay nada.\n\nLo dice con la sonrisa. Casi." : ""}

Sube. Descalza. El tercer escalón. El séptimo. La puerta del baño.

Quedáis tres.` : `
Irene: Estoy bien. Seguid.

Se sienta. Se pone recta. Coge su vaso como si viniera de la cocina. ${tras === "irene" ? "Le has preguntado si estaba bien, de verdad, y te ha dicho «de verdad» con una cara que no era de verdad." : ""}`;

      return `${salida}

${api.bandera("nora_fraude") === "enfado" ? "Álex: ¿Sigues enfadada?\n\nNora: Mueve.\n\n" : ""}${api.bandera("marcos_beso") === "nora" ? "Marcos tiene la mano en tu nuca desde hace un minuto. No la ha quitado. No ha dicho nada. Es su manera.\n\n" : api.bandera("marcos_fraude") === "irene" ? "Marcos le ha preguntado a Irene si estaba bien. De verdad. Sin la coña. Y ella ha dicho «de verdad» con la voz de siempre.\n\n" : ""}Marcos: Venga.

Te señala.

Marcos: Haz tú los honores.

Álex: Eh. Que esto lo llevo yo.

Nora: Tú vas a mover lo que yo te diga y a cerrar la boca.

Álex: Eso ha sonado bastante peor de lo que pretendías.

${api.bandera("nora_amenaza") ? "Álex: Además, dijiste que si hacía una gilipollez lo harías tú.\n\nNora: Y lo hago. Tú mueves. Yo hago.\n\nÁlex: Eso es peor todavía." : ""}

${fuera ? "Marcos se ríe. Bajito. La habitación se ha relajado. Con tres cabe más aire." : "Irene: Por favor, no empieces otra vez.\n\nPequeña risa. La habitación se ha relajado. Se nota en los hombros de todos."}

${api.bandera("nora_velas_otra_vez") ? "Las velas, que encendiste tú en cuanto volvió la luz, siguen encendidas." : "Enciendes las velas otra vez. Prenden a la primera."} Pones el tablero derecho. El vaso en el centro. La bombilla, apretada${api.bandera("marcos_aprieta") ? " hasta el fondo, por Marcos, con dos vueltas de más" : ""}. La luz de siempre.

Álex pone los dedos. Sin solemnidad esta vez. Ya ha gastado la solemnidad.

Nora: ¿Hay alguien aquí?

Álex: ¿No habíamos establecido que sí?

Nora: Álex.

Álex: Vale.

Mueve.

SÍ.

Marcos: ¿Eso lo estás haciendo tú?

Álex: Estoy moviéndolo. No estoy... eligiendo.

Y ahí está. Esa distinción. Álex no siente ninguna mano fantasma. Álex describe exactamente lo que describe todo el mundo: que el vaso va y él va con el vaso. Ideomotor. Tú lo sabes. Lo has leído veinte veces. Por eso sigues.

Nora: ¿Quién eres?

El vaso.

Quieto. Cinco segundos. Diez.

Y se mueve.

A.

Despacio. Como si le costara.

L.

Marcos: ¿Al...?

D.

Nora: Shh.

A.

Se para. Encima de la A. Se queda ahí.

[silencio]

ALDA.

...

Dejas de sonreír. Se te va de la cara sola. Lo notas irse.

Y a Álex le cambia la cara. No mucho. Nadie que no le conociera lo vería. Pero tú le conoces desde marzo y ya lo ves: la sonrisa se le queda puesta y los ojos se le van a otro sitio.

Álex: ¿Quién coño se llama Alda?

Lo dice con la voz de siempre. Casi.

${fuera ? "" : "Irene: ¿Alda?\n\n"}Marcos te mira. Porque a ti te ha cambiado la cara antes que a él.

Marcos: ¿Te suena?

Nora: No.

Pero es algo. Es algo que está en una fotocopia doblada en tu cuaderno, en una nota al pie de un libro que sacaste de una biblioteca de provincia hace dos meses. Una palabra. Un nombre, o un apellido, o una mala transcripción. Alda. Que no le has dicho a nadie. Que no le has dicho a Marcos.

Que no está en internet.

Que no está en la leyenda de Álex.

Que no puede saber nadie de esta mesa.

~ Ha salido de él. De su dedo. Ideomotor. Álex la ha oído en algún sitio y su mano la ha escrito. Eso es lo que dice todo el mundo. Eso es lo que diría yo.

~ Pero Álex no la ha oído en ningún sitio. No está en ningún sitio. Y el vaso se ha movido despacio. Como si le costara. Como si no supiera escribir.

Tienes frío. Un frío que empieza en las muñecas.

${modo(api, "nora", {
  lucido: "~ Tres opciones. Álex ha visto mi cuaderno. Alguien ha visto mi cuaderno. O es real. Las dos primeras son posibles. La tercera es la que siento.",
  asustado: "~ Es real. Es real. Es real y estoy sentada delante y lo he pedido yo.",
  tenso: "~ No les digas nada. No les des nada. Que no vean la cara. Ya la han visto.",
  ido: "~ Alda. Suena a nombre de alguien que conozco. Suena a mi nombre dicho al revés. No lo es.",
  perdido: "~ Me está diciendo su nombre. A mí. Solo a mí. Los otros no lo entienden. Yo sí.",
  normal: "~ Sé lo que es. Y sé que no lo sabe nadie más. Y eso me asusta más que la palabra.",
})}

Álex: Estás blanca.

Nora: Estoy bien.

Marcos te ha cogido la mano por debajo de la mesa. Se la aprietas. Fuerte. Más de lo que querías.

Y quieres seguir. Es lo más horrible de todo. Tienes frío en las muñecas y el estómago en el suelo y quieres seguir.

Nora: Otra.

Marcos: Nora...

Nora: Espera.`;
    },
    opciones: [
      { texto: "«¿Eres la mujer de la historia?»", a: "o11_ajoba",
        efecto: (api) => { api.marcar("o10_nora", "mujer"); api.est("nora", "eje", 2); } },
      { texto: "«¿Alda eres tú?» Y ver si el vaso vuelve al SÍ.", a: "o11_ajoba",
        efecto: (api) => { api.marcar("o10_nora", "eres_tu"); api.est("nora", "eje", 3); } },
      { texto: "Anotar ALDA en el cuaderno con la hora antes de seguir. Que quede.", a: "o11_ajoba", lucida: true,
        efecto: (api) => { api.marcar("o10_nora", "anota"); api.est("nora", "lucidez", 2); api.evidencia("cuaderno_alda", "nora", "cuaderno de Nora", "nota"); } },
      { texto: "«Para.» A Álex. Y no poder decir por qué.", a: "o11_ajoba", impulsiva: true,
        efecto: (api) => { api.marcar("o10_nora", "para"); api.est("nora", "estres", 6); api.est("nora", "miedo", 3); api.rel("alex", "nora", "resentimiento", 3); } },
    ],
  },

  o11_ajoba: {
    pov: "nora",
    titulo: "La ouija · Ajoba",
    alEntrar: (api) => {
      api.marcar("ajoba_visto", true);
      ["nora", "marcos", "alex"].forEach((p) => api.saber(p, "ajoba"));
      if (!api.bandera("irene_fuera")) api.saber("irene", "ajoba");
      api.evidencia("cuaderno_ajoba", "nora", "cuaderno de Nora", "nota");
      api.presenciar("nora", 1.5); api.presenciar("marcos", 1);
    },
    texto: (api) => {
      const fuera = api.bandera("irene_fuera");
      const n = api.bandera("o10_nora");
      const anterior = n === "mujer" ? `
Nora: ¿Eres la mujer de la historia?

Nada.

Esperáis.

Nada.

Álex: Nos ha dejado en visto.

Marcos: Siglo diecisiete, pero concepto correcto.

Eso relaja. Un poco. Lo justo.` : n === "eres_tu" ? `
Nora: ¿Alda eres tú?

El vaso se mueve. Hacia el SÍ. Se para antes de llegar. Vuelve. Se queda en medio de la nada, entre la S y el 7.

Álex: Indeciso.

Marcos: Como todo el pueblo.` : n === "anota" ? `
Abres el cuaderno con la mano libre. Escribes ALDA. Y la hora. Lo cierras.

Álex: ¿Qué apuntas?

Nora: Lo que ha dicho.

Álex: No ha dicho nada. Lo he movido yo.

Nora: Pues lo que has movido.

Nora: ¿Alda eres tú?

El vaso se mueve. Hacia el SÍ. Se para antes de llegar. Vuelve.` : `
Nora: Para.

Álex quita los dedos.

Álex: ¿Qué?

Nora: Nada. Sigue.

Álex te mira. Los vuelve a poner. Despacio. Como quien vuelve a tocar algo que ha quemado.`;

      const alcoba = fuera ? `
Álex: ¿Qué coño es ajoba?

Marcos: Alcoba.

Álex: Le falta una ele.

Marcos: Eso lo dices tú.

Álex: Fantasma viciosón.

Marcos: Álex.` : `
Álex: ¿Qué coño es ajoba?

Irene: Alcoba.

Todos la miráis.

Irene: Le falta una ele.

Álex: Fantasma viciosón.

Irene: Claramente.

Nora: ¿Podéis estaros callados?

Álex: Igual quiere ir a la alcoba.

Marcos: Álex.`;

      return `${anterior}

Marcos coge aire. Marcos, que no cree en nada, que ha encontrado la bombilla, que ha dicho «claro». Marcos pregunta.

Marcos: ¿Dónde estás?

Álex empieza a mover.

A.

J.

O.

Silencio. El vaso se queda. Tres segundos. Cuatro.

B.

A.

Marcos: ¿Ajoba?
${alcoba}

Escribes. AJOBA. Con jota. Exactamente así. No lo corriges. No le das vueltas. No buscas la ele que falta ni la letra que sobra. Lo apuntas debajo de ALDA y ya.

~ Ajoba. No es nada. No es una palabra. Es una jota donde no toca.

Nora: ¿Qué quieres?

Nada.

Nora: ¿Estás sola?

Nada. Diez segundos. Veinte.

Álex: Se ha ido a la alcoba.

Nora: Álex.

Álex: Es que no hace nada.

Y no hace nada. Otra pregunta. Nada. Otra. Nada. El vaso quieto bajo los dedos de Álex como un vaso.

A Álex se le cae el hombro. Se le ve aburrirse: el codo en la mesa, la mirada al techo. Ya ha pasado lo suyo. Ya ha tenido su bombilla y su ADIÓS y su IRENE, y esto es lento, y lo lento no es de Álex.

Marcos: Efecto ideomotor.

Lo dice bajo. Para sí. Y luego más alto, porque ya lo ha dicho.

Marcos: Lo mueve él sin saberlo. Alda lo ha oído en algún sitio. Y ajoba es que se le ha ido el dedo.

Nora: ¿Dónde ha oído Alda?

Marcos: No lo sé. Donde lo hayas oído tú.

No contestas. Marcos te mira esperando que contestes. No contestas.

${modo(api, "nora", {
  lucido: "~ Dos palabras. Una que solo sé yo. Otra que no es nada. Y luego nada. La sesión no es Google. La sesión ha dicho lo que tenía que decir y se ha callado. Eso es lo que más me asusta: que tenga sentido.",
  asustado: "~ No hemos cerrado. Todavía no hemos cerrado. Y ha dicho dónde está y no lo he entendido.",
  tenso: "~ Ajoba. Ajoba. Álex riéndose de ajoba. Y yo apuntándolo como una idiota.",
  ido: "~ Las letras se han quedado encendidas un momento. A. J. O. B. A. Como si el tablero las recordara.",
  perdido: "~ Me ha dicho dónde está. Me lo ha dicho y no lo he entendido y eso le ha gustado.",
  normal: "~ Alda. Ajoba. Y nada. Me lo llevo a la cama. No voy a dormir.",
})}

Álex: ¿Cerramos? Que tengo la mano dormida.`;
    },
    opciones: [
      { texto: "Cerrar. «Adiós.» Y que Álex lleve el vaso a ADIÓS. Despacio.", a: (api) => api.bandera("irene_fuera") === "bano" ? "o12_irene_arriba" : "o13_fin",
        efecto: (api) => { api.marcar("ouija_cerrada", true); api.est("nora", "estres", -3); } },
      { texto: "«Una más.» Y que no conteste.", a: (api) => api.bandera("irene_fuera") === "bano" ? "o12_irene_arriba" : "o13_fin",
        efecto: (api) => { api.marcar("ouija_cerrada", false); api.est("nora", "eje", 2); api.est("nora", "estres", 2); } },
      { texto: "Dejarlo. Sin cerrar. Levantarte.", a: (api) => api.bandera("irene_fuera") === "bano" ? "o12_irene_arriba" : "o13_fin",
        efecto: (api) => { api.marcar("ouija_cerrada", false); api.est("nora", "miedo", 2); } },
    ],
  },

  o12_irene_arriba: {
    pov: "irene",
    titulo: "La ouija · Arriba",
    fondo: "assets/fondos/bano.jpg",
    ambiente: "bano",
    lugar: "baño de arriba",
    alEntrar: (api) => {
      const v = api.anomalia("voz_nombre");
      api.marcar("voz_desertor", v);
      if (v) { api.saber("irene", "oi_mi_nombre"); api.presenciar("irene", 1.5); }
    },
    texto: (api) => {
      const voz = api.bandera("voz_desertor");
      const huesped = api.bandera("huesped") === "irene";
      return `
Arriba. La escalera. El tercero. El séptimo. El pasillo con la lámpara de llama falsa y la cuerda de la buhardilla, quieta, a la altura de la cara.

Entras al baño. Cierras. Te sientas en el borde de la bañera. No has venido a mear.

Te miras en el espejo. Te levantas el pelo. Te miras la garganta.

No hay marca. Tendría que haber una marca. Algo. Rojo. Un dedo. Nada.

${huesped ? "Tragas. Y otra vez. Hay algo que no baja. No es nada. Es la garganta, que se acuerda.\n\nTe abrochas un botón. Te lo desabrochas. Tragas otra vez." : "Te abrochas un botón. Te lo desabrochas. Respiras. Entra. Entra sin más, como si nunca hubiera dejado de entrar."}

${modo(api, "irene", {
  lucido: "~ No ha sido teatro. Lo sé porque el teatro lo sé hacer y esto no lo he hecho yo. Y ahora abajo están preguntando cosas a un vaso y yo estoy aquí mirándome el cuello.",
  asustado: "~ Aquí no. Aquí no hay tabla. Aquí no hay velas. Aquí no me llama nadie.",
  tenso: "~ Nora abajo. Con la tabla. Con Marcos. Que apunte. Que apunte todo.",
  ido: "~ El espejo tarda un poco en devolverme la cara. Como si la buscara primero.",
  perdido: "~ La del espejo tiene la garganta bien. La del espejo respira. Yo no sé.",
  normal: "~ Un minuto. Un minuto y bajo. Con la cara puesta.",
})}

Desde abajo, las voces. Nora preguntando. Álex diciendo algo. Marcos.

${voz ? `Y entonces, desde el pasillo, al otro lado de la puerta:

Nora: Irene.

Irene: ¿Qué?

Nada.

Irene: ¿Qué quieres?

Nada. Y abajo, desde la mesa, a través del suelo, Nora sigue hablando. Con la voz de abajo. Preguntando cosas al vaso.

Abres la puerta.

El pasillo. Vacío. La cuerda. Quieta. La escalera bajando hacia la luz.

~ Me ha llamado desde aquí. Desde este pasillo. Y está abajo. No. Ha dicho algo abajo y yo he oído Irene arriba. Es lo que pasa con los nombres cuando no los esperas.

~ Es lo que pasa con mi nombre esta noche. Que lo dicen y pasa algo.` : `Te levantas. Te miras una vez más. Abres. El pasillo, vacío. La cuerda, quieta. La escalera bajando hacia la luz.`}`;
    },
    opciones: [
      { texto: "Bajar. Ya.", a: "o13_fin" },
      { texto: "Quedarte un minuto más. Que no te vean así.", a: "o13_fin",
        efecto: (api) => { api.est("irene", "estres", 3); api.est("irene", "eje", 2); } },
      { texto: "Grabarte. Un vídeo. Diez segundos. «Por si acaso.»", a: "o13_fin", lucida: true,
        efecto: (api) => { api.evidencia("video_irene_bano", "irene", "móvil de Irene, baño de arriba", "video"); api.est("irene", "lucidez", 1); } },
    ],
  },

  o13_fin: {
    pov: "nora",
    fondo: "assets/fondos/salon_fiesta_b.jpg",
    ambiente: "interior",
    lugar: "comedor", hora: "03:25",
    titulo: "La ouija · Se acabó el velatorio",
    consumo: (api) => [["alex", "cerveza"], ["marcos", "cerveza"], ["irene", "cerveza"]],
    alEntrar: (api) => {
      api.horror(2);
      api.marcar("vaso_final", api.anomalia("vaso_final"));
      if (api.bandera("ouija_cerrada") === undefined) api.marcar("ouija_cerrada", false);
      api.marcar("fase4_completa", true);
    },
    texto: (api) => {
      const fuera = api.bandera("irene_fuera");
      const voz = api.bandera("voz_desertor");
      const huesped = api.bandera("huesped");
      const cerrada = api.bandera("ouija_cerrada");

      const vuelve = fuera === "bano" ? `
El séptimo escalón. El tercero. Irene.

Irene: ¿Me habéis llamado?

Nadie la ha llamado.

Marcos: No.

${voz ? `Irene: Alguien ha dicho mi nombre.

Nora: Nadie ha dicho tu nombre.

Irene: Tú. Desde el pasillo.

Nora: Yo no me he movido de aquí.

Silencio.

Irene: Da igual. Habré oído mal.

No da igual. Se le nota en la cara que no da igual. Y a ti se te nota en la tuya que no has dicho su nombre. Y ninguna de las dos va a insistir. Todavía.` : `Irene: Vale.

Se sienta. Coge su vaso.`}` : fuera === "cerveza" ? `
Irene vuelve de la cocina con dos cervezas. Una es para Marcos. La deja delante de él sin mirarte. Se sienta.

Irene: ¿Qué me he perdido?

Álex: Un fantasma con problemas de ortografía.` : "";

      const cierre = cerrada ? `
Has cerrado. Has dicho adiós. Álex ha llevado el vaso a ADIÓS despacio, bien, sin coña, y lo ha soltado. Eso es lo que dice tu prima que hay que hacer, y tu prima es idiota, y lo has hecho igual.` : `
No has cerrado. Álex ha quitado los dedos y ya está.

Nora: No hemos cerrado.

Álex: ¿Cerrado qué?

Nora: Hay que decir adiós.

Álex: Adiós.

Lo dice al tablero. Con la mano. Como quien se despide de un perro. ${fuera ? "Marcos" : "Irene"} se ríe. Tú no.

Tú sabes lo que dice tu prima de eso y sabes que tu prima es idiota, y las dos cosas te importan.`;

      const huespedTexto = huesped === "marcos" ? `
Marcos te pone la mano en la nuca. Te giras hacia él.

Nora: Tienes las manos heladas.

Marcos: Es la casa.

${api.bandera("marcos_racionaliza") ? "Lo dice rápido. Como quien ya se lo ha dicho a sí mismo." : "Lo dice sin mirarte. Mirando la mesa."}

Te frota la nuca con la mano fría hasta que deja de estarlo. O hasta que dejas de notarlo. No sabrías decir cuál.` : `
Irene se ríe de algo de Álex. Con la mano en el cuello. No se la ha quitado de ahí desde que ha vuelto a la mesa. Cada vez que se ríe, traga.

Marcos te pone la mano en la nuca. Caliente. Te giras hacia él.`;

      return `${vuelve}
${cierre}

Álex: Bueno. Hasta aquí mi interés por Hasbro satánico.

Se levanta. Va al altavoz. Le da.

Álex: Se acabó el velatorio.

[musica:fiesta_baja]

Música. Baja. Algo de Irene. Algo que no pega con nada de lo que ha pasado, y por eso pega.

Álex coge el móvil de Irene de la botella. Para la grabación. Se mira en la pantalla. Habla a cámara.

Álex: Documental número dos. La ouija. Ha sobrevivido todo el mundo.

Se ríe. Deja el móvil. Abre una cerveza. Le pasa otra a Marcos. Marcos la coge. Y así se acaba una ouija: con alguien abriendo una cerveza.

Marcos: Efecto ideomotor.

Nora: Ya.

Marcos: Lo digo para que conste.

Nora: Consta.

Y la mesa vuelve a ser una mesa. Botellas. El cenicero. La baraja en el aparador. ${api.bandera("marcos_graba_ouija") ? "El móvil de Marcos, en el aparador, grabando todavía. Nadie se acuerda." : ""} La tabla, en el centro, con las velas a medio consumir. Todavía está ahí. Nadie la ha guardado. Nadie va a guardarla.
${huespedTexto}

Álex habla. Irene le contesta. ${api.bandera("irene_fraude") === "risa" ? "Se ha reído del fraude más que nadie. Eso también te lo apuntas. " : ""}Marcos bebe. La fiesta todavía existe físicamente. Se oye. Se ve. Si alguien entrara ahora por la puerta pensaría que no ha pasado nada.

${modo(api, "nora", {
  lucido: "~ Alda. Ajoba. Una palabra que solo sé yo y otra que no sabe nadie. Y tres explicaciones para cada una. Y ninguna que me sirva.",
  asustado: `~ ${cerrada ? "He cerrado. He cerrado y da igual: ha dicho dónde está y sigue ahí." : "No hemos cerrado. No hemos cerrado y la puerta deja de dejarte salir. Son dos cosas distintas. Son dos cosas distintas."}`,
  tenso: "~ Álex bebiendo. Irene riéndose. Marcos con su ideomotor. Y yo con dos palabras en un cuaderno que nadie va a leer.",
  ido: "~ La música. Es la misma de antes. Pero antes sonaba en una casa y ahora suena en otra.",
  perdido: "~ Sigue aquí. No se ha ido. Se ha sentado con nosotros a oír la música. Está en la silla de Irene. Irene está encima.",
  normal: "~ Ha pasado algo. No sé qué. Y lo peor es que quiero saberlo.",
})}

${api.bandera("nora_vio_llama") ? "Y las velas. Miras las velas. Ahora arden derechas. Como si no hubieran hecho nunca otra cosa.\n\n" : ""}Cuando vuelves a mirar la mesa, un momento después, el vaso ${api.bandera("vaso_final") ? `está donde lo dejasteis.

No.

Está unos centímetros más lejos. Hacia el borde. Hacia ti.

${api.bandera("nora_miro_vaso") ? "Ya lo miraste antes, a oscuras. Estaba en el centro. Lo sabes porque lo miraste." : "No lo has visto moverse. Nadie lo ha visto moverse."} Y cualquiera de ellos ha podido rozarlo al levantarse.

Cualquiera.` : `sigue donde lo dejasteis. Boca abajo. En mitad del tablero. Quieto.

Lo miras un rato. No se mueve. Claro que no se mueve.`}

...`;
    },
    opciones: [{ texto: "Continuar", a: "v1_necesidades" }],
  },

  });
})();
