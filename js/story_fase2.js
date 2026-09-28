/*
 * LA BRUJA — PRÓLOGO
 * Fase II: La leyenda de Álex · Fase III: La contrahistoria
 * HORROR_STAGE 0 → 1 (leyenda). La Fase IV (ouija) está en js/story_fase4.js
 *
 * Presupuesto de anomalías Fase II: 3, de esta biblioteca:
 *   musica_sola   → la música que Álex dejó sonando se para sola (solo si la dejó)
 *   campanilla    → un sonido metálico mínimo cuando Álex habla de la campanilla
 *   golpe_arriba  → un golpe en el techo cuando habla de los niños
 *   voz_nombre    → el desertor de la ouija oye su nombre desde donde no está nadie
 *   vaso_final    → el vaso, unos centímetros más lejos de donde lo dejaron
 *
 */
Object.assign(HISTORIA.presupuestoAnomalias, { II: 3 });
Object.assign(HISTORIA.deriva, { II: { estres: -0.2 } });

// Quién habla en cada interjección: la voz de cada uno, no "alguien".
Object.assign(HISTORIA.escenas, {

  // =====================================================================
  // FASE II — LA LEYENDA DE ÁLEX
  // =====================================================================

  l1_leyenda: {
    pov: "nora",
    fondo: "assets/fondos/salon_noche.jpg",
    ambiente: "interior",
    musica: (api) => api.bandera("musica_leyenda") === "apagada" ? "terror_suave" : undefined,
    lugar: "comedor", hora: "02:30",
    titulo: "La leyenda · I",
    alEntrar: (api) => { api.fase("II"); api.horror(1); },
    texto: (api) => `
${api.bandera("musica_leyenda") === "sonando" ? "La música sigue. Álex habla por encima. Puede." : api.bandera("musica_leyenda") === "baja" ? "La música queda como un murmullo debajo de la voz de Álex. Como si viniera de otra casa." : "Sin música se oye la chimenea. Y el viento. Y a Álex."}

Álex: Pero después no quiero gilipolleces de «no puedo dormir» o «acompáñame a mear».

Irene: Cuenta, anda.

Álex sonríe.

Mira alrededor.

Las paredes de madera.

Las ventanas negras.

El pasillo.

Y finalmente el suelo.

Álex: Lo primero que tenéis que saber es que esta casa no la construyeron aquí por casualidad.

Marcos se ríe.

Marcos: Ya empezamos.

Álex: Esta casa está levantada encima del sitio donde la quemaron.

La risa dura un poco menos.

Irene: ¿A quién?

Álex la mira.

Álex: A la bruja.

Silencio.

Álex: Hace cuatrocientos años, todo este bosque pertenecía a varias aldeas que ya ni existen. Y la gente de aquí tenía una norma.

Se inclina hacia delante.

Álex: Cuando caía el sol, los niños tenían que estar dentro de casa.

Marcos: ¿Por los lobos?

Álex: No.

Niega lentamente.

Álex: Por ella.

...

Tienes el cuaderno cerrado bajo la mano. Y dentro, dos páginas fotocopiadas que dicen otra cosa. Que dicen menos. Que dicen que no se sabe.

${({
  lucido: "~ «Cuatrocientos años.» Ya ha metido un siglo de más. La fuente más antigua es de mil seiscientos y pico.",
  asustado: "~ La ha mirado a Irene al decir «a quién». Como si lo hubiera ensayado. Lo ha ensayado.",
  tenso: "~ Va a contarla mal. Va a contarla entera mal y yo voy a tener que estar callada.",
  ido: "~ Las paredes de madera. Las ventanas negras. Las ha dicho él o las he pensado yo.",
  perdido: "~ Sabe cosas. Sabe cosas que no debería saber. No. Es Álex. Es Álex contando una historia.",
  normal: "~ Cuenta bien. Eso hay que reconocérselo. Cuenta como si lo hubiera visto.",
})[api.modo("nora")]}

Álex hace una pausa para beber. Te mira a ti por encima del vaso. Sabe que tienes algo que decir. Está esperando a que lo digas para poder pasar por encima.`,
    opciones: [
      { texto: "«Cuatrocientos, no. Y no era una norma. Era una historia para que los niños volvieran a casa.»", a: "l2_leyenda", lucida: true,
        efecto: (api) => { api.marcar("ley_nora1", "corrige"); api.est("nora", "lucidez", 1); api.rel("alex", "nora", "tension", 3); api.rel("irene", "nora", "resentimiento", 3); api.rel("marcos", "nora", "afecto", 2); } },
      { texto: "Dejarle. Abrir el cuaderno por la página buena y no decir nada. Todavía.", a: "l2_leyenda",
        efecto: (api) => { api.marcar("ley_nora1", "espera"); api.est("nora", "eje", 2); } },
      { texto: "Apoyar la barbilla en el hombro de Marcos y dejar que Álex haga su número.", a: "l2_leyenda",
        efecto: (api) => { api.marcar("ley_nora1", "marcos"); api.rel("nora", "marcos", "afecto", 3); api.rel("irene", "nora", "resentimiento", 2); api.rel("alex", "nora", "afecto", 2); } },
    ],
  },

  l2_leyenda: {
    pov: "marcos",
    titulo: "La leyenda · II",
    alEntrar: (api) => { if (api.bandera("musica_leyenda") === "sonando") api.marcar("musica_sola", api.anomalia("musica_sola")); },
    texto: (api) => {
      const n1 = api.bandera("ley_nora1");
      const inicio = n1 === "corrige" ? `
Nora: Cuatrocientos, no. Y no era una norma. Era una historia para que los niños volvieran a casa.

Álex: ¿Me dejas contar mi puta historia?

Nora: Cuenta tu fanfic. Adelante.

Irene se ríe. Álex le señala a Nora con el vaso como quien señala a un perro que ha ladrado, y sigue.` : n1 === "espera" ? `
Nora ha abierto el cuaderno. Sin decir nada. Ha buscado una página, la ha encontrado, y ha dejado el dedo encima. Álex lo ha visto. Álex lo ve todo cuando es sobre él.

Álex: Luego, profesora. Luego.` : `
Nora ha apoyado la barbilla en tu hombro. Notas su respiración en el cuello. Irene lo ha mirado un segundo y ha vuelto a mirar a Álex, y le ha puesto la mano en el muslo, como se pone una mano en un muslo cuando alguien te está mirando.`;
      return `${inicio}

Álex: Dicen que vivía sola en mitad del bosque.

Álex: Nadie sabía de dónde había venido.

Álex: Un invierno simplemente apareció.

Álex: Primero encontraron su casa.

Álex: Después empezaron a verla a ella.

Álex: Una mujer joven, vestida siempre de negro, que caminaba descalza incluso sobre la nieve y que jamás entraba en una iglesia.

Álex: Los animales tampoco se acercaban a su casa.

Álex: Los perros lloraban.

Álex: Los caballos se negaban a continuar.

Álex: Y cuando algún pájaro volaba sobre el tejado...

Levanta la mano.

Álex: ...caía muerto.

Marcos: Venga ya.

Álex: Eso dice la historia.

Bebe un poco.

${api.bandera("musica_sola") ? `Y la música se para.

No baja. No se corta a mitad. Se para. Como cuando acaba una canción y no empieza otra.

Todos miráis el altavoz. Irene coge el móvil. La lista sigue ahí. El siguiente tema está marcado. No suena.

Irene: Se ha quedado colgado.

Le da a reproducir. No pasa nada. Le da otra vez. Suena. El principio de una canción alegre en mitad de esto.

Irene lo apaga ella. Del todo.

Álex: Gracias. Ahora sí.

` : ""}Álex: Al principio la gente iba a verla.

Álex: Porque la mujer sabía cosas.

Álex: Sabía qué plantas bajaban una fiebre.

Álex: Cómo parar una hemorragia.

Álex: Cómo hacer dormir a un niño que llevaba tres noches gritando.

Álex: Y también cosas que no debería haber sabido.

Álex: Quién estaba embarazada antes de que la mujer lo supiera.

Álex: Quién iba a morir.

Álex: Quién engañaba a su marido.

Mira a Irene al decirlo. Un segundo. Irene sonríe con la boca cerrada.

Álex: Quién había robado.

Álex: Quién había enterrado algo donde nadie podía encontrarlo.

Álex: Y siempre cobraba.

Irene: ¿Dinero?

Álex sonríe.

Álex: Al principio.

Álex: Después empezó a pedir otras cosas.

Álex: Un mechón de pelo.

Álex: Una uña.

Álex: Un diente.

Álex: Un poco de sangre.

Álex: El nombre completo de alguien.

Álex: Cosas pequeñas.

...

${({
  lucido: "~ Está construyendo. Primero lo útil, luego lo raro, luego el precio. Es la estructura de todas las historias de pactos. Lo hace bien.",
  asustado: "~ «Quién engañaba a su marido.» Y la ha mirado. Y ella ha sonreído. Y yo he mirado la mesa.",
  tenso: "~ Cosas pequeñas. Un mechón. Una uña. Como una lista de la compra. Como si supiera que yo estoy pensando en otra lista.",
  ido: "~ Los caballos se negaban a continuar. Los veo. Veo los caballos. Están en la pared.",
  perdido: "~ Está hablando de mí. No. Está hablando de una bruja. Es lo mismo. No lo es.",
  normal: "~ Sanidad privada del siglo diecisiete. Ese chiste está ahí y me lo estoy guardando.",
})[api.modo("marcos")]}

Álex te mira. Sabe que tienes un chiste. Está esperando a que lo hagas para que Irene se ría de ti y no de él.`;
    },
    opciones: [
      { texto: "«Sanidad privada del siglo diecisiete.»", a: "l3_leyenda",
        efecto: (api) => { api.marcar("ley_marcos2", "chiste"); api.est("marcos", "eje", 2); api.rel("alex", "marcos", "afecto", 2); api.rel("irene", "marcos", "afecto", 2); } },
      { texto: "«Eso te lo acabas de inventar. Lo de los pájaros.»", a: "l3_leyenda",
        efecto: (api) => { api.marcar("ley_marcos2", "inventar"); api.rel("alex", "marcos", "tension", 4); api.rel("nora", "marcos", "afecto", 2); } },
      { texto: "Callarte. Escuchar. Mirar a Nora para ver cómo lo escucha ella.", a: "l3_leyenda", lucida: true,
        efecto: (api) => { api.marcar("ley_marcos2", "escucha"); api.est("marcos", "lucidez", 1); api.rel("marcos", "nora", "afecto", 2); } },
    ],
  },

  l3_leyenda: {
    pov: "irene",
    titulo: "La leyenda · III",
    alEntrar: (api) => { api.marcar("campanilla_sono", api.anomalia("campanilla")); },
    texto: (api) => {
      const m2 = api.bandera("ley_marcos2");
      const inicio = m2 === "chiste" ? `
Marcos: Sanidad privada del siglo diecisiete.

Te ríes. Te ríes de verdad, y Álex lo nota, y le cambia la cara medio segundo, y luego se ríe él también, más fuerte, para taparlo.

Álex: Muy bueno. Muy bueno. ¿Puedo seguir?` : m2 === "inventar" ? `
Marcos: Eso te lo acabas de inventar. Lo de los pájaros.

Álex: Todo me lo acabo de inventar. Alguien se lo inventó hace cuatrocientos años. Yo solo lo cuento mejor.

Nora ha sonreído. A Marcos. Álex lo ha visto.` : `
Marcos no ha dicho nada. Está mirando a Nora. Nora está mirando a Álex. Álex te está mirando a ti.

Todo el mundo mira a quien no le mira. Es lo de siempre. Es la mesa.`;
      return `${inicio}

Álex: Hasta que una noche una mujer desesperada llegó hasta aquí llevando a su hijo.

Álex: El niño estaba muriéndose.

Álex: Tenía siete años.

Álex: La madre se arrodilló delante de la bruja y le rogó que lo salvara.

Álex: Y ella aceptó.

Álex: Pero le dijo:

Álex: «Una vida no vuelve sin que otra ocupe su lugar».

Álex: La madre pensó que hablaba de ella.

Álex: Dijo que sí.

Irene: Joder.

Lo has dicho tú. Sin querer. Álex te mira con esa cara de «ahí estás».

Álex: Pero la bruja no quería a la madre.

Deja pasar un segundo.

Álex: Quería a su siguiente hijo.

Silencio.

Álex: La mujer aceptó.

Álex: El niño se recuperó aquella misma noche.

Álex: A la mañana siguiente ya caminaba.

Álex: Un año después, la mujer tuvo una niña.

Álex: Y cuando la niña cumplió seis meses...

Chasquea los dedos.

Álex: Desapareció de la cuna.

Irene: Hostia.

Álex: La encontraron tres días después.

Álex: En el bosque.

Álex: Dentro de un círculo de piedras.

Nora: ¿Muerta?

Álex sonríe. Le encanta que sea Nora la que pregunta.

Álex: Eso habría sido lo mejor.

Se hace un pequeño silencio.

Álex: Estaba viva.

Álex: Pero le habían cosido los párpados.

Marcos: Qué cojones.

Álex: Y tenía algo metido dentro de la boca.

Nora: ¿Qué?

Álex espera.

Álex: Una campanilla.

${api.bandera("campanilla_sono") ? `[campanilla]

Tin.

Un sonido. Metálico. Pequeño. Muy pequeño. Como una cucharilla contra un vaso, pero más agudo, y más lejos, y más corto.

Nadie sabe de dónde.

Álex levanta las dos manos, con el vaso en una.

Álex: Gracias por la colaboración.

Marcos se ríe. Tú te ríes. Nora ha girado la cabeza hacia la cocina, o hacia la escalera, no sabes. Ha vuelto.

~ Los vasos. Alguien ha tocado un vaso con el anillo. Yo. He sido yo. Tengo el anillo en el vaso.

Miras tu mano. El anillo está en el vaso. Podría haber sido.

` : ""}Silencio.

Álex: Cuando la madre la cogió...

Mueve ligeramente los dedos sobre la mesa.

Álex: ...sonó.

Álex: Una sola vez.

Álex: La niña murió en sus brazos.

Álex: Y esa noche, por primera vez, todas las campanas de la iglesia empezaron a sonar solas.

Álex: A medianoche.

...

Le conoces. Le conoces hace cinco años y le has visto contar esta historia, o una parecida, cuatro veces. Y sabes leerle la cara mejor que nadie en esta mesa.

Y esta vez hay algo en la cara que no estaba las otras cuatro veces. No es miedo. Es que está escuchando su propia historia. Es que le está gustando demasiado.

${({
  lucido: "~ Se ha aprendido la parte de la campanilla desde la última vez. Antes era un cascabel. Alguien se lo ha contado mejor. ¿Quién?",
  asustado: "~ La campanilla. Ha dicho campanilla y ha sonado algo. Ha sido mi anillo. Ha sido mi anillo.",
  tenso: "~ Está mirando a Nora más que a mí. Cuando cuenta esto. Con lo de la niña. La está mirando a ella.",
  ido: "~ Las campanas. Las oigo. No. Es la chimenea. Es el mismo sonido si cierras los ojos.",
  perdido: "~ La niña con los párpados cosidos está en esta mesa. No. Es Nora. Nora tiene los ojos abiertos. Los tiene abiertos.",
  normal: "~ Le encanta. Le encanta tanto que da un poco de vergüenza. Y me encanta que le encante.",
})[api.modo("irene")]}

Álex coge aire para seguir. Antes de que lo haga, tienes medio segundo. Como siempre. Como en las cuatro veces anteriores.`;
    },
    opciones: [
      { texto: "Animarle. Meterle la mano por dentro de la camisa, en el pecho, y dejarla ahí. «Sigue.»", a: "l4_leyenda",
        efecto: (api) => { api.marcar("ley_irene3", "anima"); api.rel("irene", "alex", "afecto", 3); api.rel("alex", "irene", "afecto", 3); api.est("alex", "eje", 3); } },
      { texto: "«Te estás pasando. Lo de los párpados sobra.» Con la sonrisa puesta.", a: "l4_leyenda",
        efecto: (api) => { api.marcar("ley_irene3", "frena"); api.rel("alex", "irene", "tension", 3); api.rel("nora", "irene", "confianza", 3); api.est("alex", "eje", -2); } },
      { texto: "Mirar a Nora. Ver si se está asustando. Y que ella vea que la miras.", a: "l4_leyenda",
        efecto: (api) => { api.marcar("ley_irene3", "nora"); api.rel("irene", "nora", "tension", 4); api.rel("nora", "irene", "resentimiento", 3); api.est("irene", "eje", 2); } },
    ],
  },

  l4_leyenda: {
    pov: "nora",
    titulo: "La leyenda · IV",
    texto: (api) => {
      const i3 = api.bandera("ley_irene3");
      const inicio = i3 === "anima" ? `
Irene le ha metido la mano por dentro de la camisa. En el pecho. Y la ha dejado ahí. Álex ha bajado la voz un tono, como si la mano se la bajara.

Irene: Sigue.` : i3 === "frena" ? `
Irene: Te estás pasando. Lo de los párpados sobra.

Álex: Lo de los párpados es lo mejor.

Irene: Lo de los párpados es asqueroso.

Álex: Por eso es lo mejor.

Pero ha bajado el tono. Un poco. Irene manda más de lo que parece.` : `
Irene te está mirando a ti. No a Álex. A ti. Con la cabeza ladeada, como se mira a alguien en una sala de espera.

Le sostienes la mirada. Ella sonríe. Tú no. Ella vuelve a Álex.`;
      return `${inicio}

Álex: Ahí empezó todo.

Álex: Los niños empezaron a desaparecer.

Álex: Uno cada invierno.

Álex: Siempre durante la noche más larga del año.

Álex: Y siempre ocurría lo mismo.

Álex: Antes de que desaparecieran, sus madres encontraban tres cosas delante de la puerta.

Álex: Una rama de espino.

Álex: Un mechón de pelo negro.

Álex: Y un diente de leche.

Álex: Los hombres del pueblo intentaron cazarla.

Álex: Nunca pudieron.

Álex: Algunos se perdían en el bosque aunque llevaran toda su vida viviendo allí.

Álex: Otros regresaban días después sin recordar nada.

Álex: Uno volvió sin lengua.

Álex: Otro llegó desnudo a la iglesia, se arrodilló delante del altar y empezó a golpearse la cabeza contra el suelo mientras repetía una frase.

Baja la voz.

Álex: «No tiene nombre».

Marcos: ¿Quién?

Álex: Eso le preguntaron.

Le mira.

Álex: Se arrancó los ojos antes de responder.

Esta vez nadie se ríe.

Álex: La cosa empeoró.

Álex: Empezaron a decir que la mujer celebraba aquelarres aquí.

Álex: Que durante ciertas noches se veían luces entre los árboles.

Álex: Que había gente bailando desnuda alrededor de hogueras.

Álex: Que sacrificaban animales.

Álex: Después empezaron a faltar cadáveres del cementerio.

Álex: Niños sin bautizar.

Álex: Mujeres que habían muerto durante el parto.

Álex: Ahorcados.

Marcos: ¿Para qué coño quería cadáveres?

Álex: Para sus rituales.

Álex: Según la historia, utilizaba grasa humana para fabricar velas.

Mira tus velas. Las dos que trajiste. Sonríe.

Álex: Huesos de niños para hacer amuletos.

Álex: Lenguas de muertos para obligarlos a hablar.

Álex: Y con la piel...

Se detiene.

Álex: Bueno.

Irene: No. Ahora lo cuentas.

Álex sonríe.

Álex: Con la piel cosía un libro.

Irene: Qué puto asco.

Álex: Un libro que no estaba escrito con tinta.

Pausa.

Álex: Estaba escrito con sangre.

Álex: Y no contenía hechizos.

Álex: Contenía nombres.

Álex: Todos los habitantes de la zona.

Álex: Los vivos.

Álex: Los muertos.

Álex: Y algunos que todavía no habían nacido.

...

Tienes el ceño fruncido. Lo notas porque te duele la frente.

~ Eso no tiene sentido. Eso no está en ninguna parte. Ni en el libro de folklore, ni en el foro, ni en el artículo. El libro de piel es de otra leyenda, de otra provincia. Lo ha mezclado.

~ O alguien se lo ha contado mezclado. Y eso también es información.

${({
  lucido: "~ Rama de espino, pelo negro, diente de leche. Esa tríada sí está. Está en el libro de folklore, página treinta y algo. Lo demás no.",
  asustado: "~ «No tiene nombre.» Eso lo has leído. Eso lo has leído en alguna parte y no te acuerdas dónde y te está subiendo por la espalda.",
  tenso: "~ Cállate. Cállate. Déjale acabar y luego lo desmontas entero.",
  ido: "~ El libro de piel. Lo estás viendo. Está encima de la mesa, debajo de las cartas. No. Es el mantel de rafia.",
  perdido: "~ Ha dicho tu nombre. Ha dicho «todos los habitantes» y ha dicho tu nombre entre ellos. No lo ha dicho. Lo has oído.",
  normal: "~ Se lo está inventando a trozos y encajando a trozos. Y los trozos que encajan son los que más miedo dan.",
})[api.modo("nora")]}

Álex bebe. Te mira por encima del vaso otra vez. Sabe que has fruncido el ceño. Le encanta.`;
    },
    opciones: [
      { texto: "«Eso no tiene sentido. El libro de piel es de otra leyenda. Lo estás mezclando.»", a: "l5_leyenda", lucida: true,
        efecto: (api) => { api.marcar("ley_nora4", "corrige"); api.est("nora", "lucidez", 2); api.rel("alex", "nora", "tension", 4); api.rel("irene", "nora", "resentimiento", 3); api.saber("nora", "leyenda_mezclada"); } },
      { texto: "Abrir el cuaderno y apuntar: «espino, pelo negro, diente de leche». Sin decir nada.", a: "l5_leyenda", lucida: true,
        efecto: (api) => { api.marcar("ley_nora4", "apunta"); api.est("nora", "lucidez", 2); api.est("nora", "eje", 3); api.evidencia("cuaderno_triada", "nora", "cuaderno de Nora", "nota"); api.saber("nora", "leyenda_mezclada"); } },
      { texto: "Callarte. Beber. Dejar que te dé miedo, un poco, porque para eso has venido.", a: "l5_leyenda",
        efecto: (api) => { api.marcar("ley_nora4", "miedo"); api.est("nora", "eje", 4); api.est("nora", "miedo", 3); api.consumir("nora", "chupito"); } },
    ],
  },

  l5_leyenda: {
    pov: "marcos",
    titulo: "La leyenda · V",
    alEntrar: (api) => { api.marcar("golpe_leyenda", api.anomalia("golpe_arriba")); },
    texto: (api) => {
      const n4 = api.bandera("ley_nora4");
      const inicio = n4 === "corrige" ? `
Nora: Eso no tiene sentido. El libro de piel es de otra leyenda. Lo estás mezclando.

Álex: Es una leyenda.

Irene: Continúa.

Álex continúa. Pero le has visto la cara: Nora ha acertado, y él lo sabe, y eso le ha gustado y no le ha gustado.` : n4 === "apunta" ? `
Nora ha abierto el cuaderno y ha escrito tres palabras. Ha vuelto a cerrarlo. Álex lo ha mirado como se mira a alguien que toma notas en una boda.

Álex: ¿Examen luego?

Nora: Luego.` : `
Nora ha bebido. Ha bebido y ha dejado el vaso y se ha quedado mirando a Álex con los ojos un poco más abiertos, y tú has visto que le estaba gustando. Que le estaba dando miedo y que le estaba gustando.

Le has puesto la mano en la rodilla. Ella no la ha mirado.`;
      return `${inicio}

Álex: Entonces empezaron a nacer niños con marcas.

Álex: Una especie de círculo alrededor del cuello.

Álex: Otros nacían con los ojos completamente negros y morían antes de amanecer.

Álex: Y algunos...

Mira hacia la ventana.

Álex: ...simplemente no lloraban.

Álex: Nunca.

Álex: Solo miraban hacia el bosque.

Álex: Hasta que una noche desaparecían.

${api.bandera("golpe_leyenda") ? `TOC.

Arriba.

Un golpe. Uno solo. Seco. Como algo que cae de canto sobre madera.

Todos miráis el techo. Tú el primero.

Álex no mira. Álex sonríe.

Álex: Producción de alto nivel.

Irene: Álex.

Álex: ¿Qué? Yo no he sido. Yo estoy aquí.

Levanta las dos manos. Están vacías.

Nora sigue mirando el techo. Dos segundos. Tres. Baja los ojos.

~ Una mochila. Una mochila mal apoyada en la cama que resbala. Dejamos las mochilas arriba. Es exactamente ese sonido.

~ Exactamente ese sonido. Sí.

` : ""}Álex: Fue entonces cuando el cura del pueblo convenció a varios hombres para entrar en la casa.

Álex: Eran doce.

Álex: Solo volvieron cuatro.

Irene: ¿Qué pasó?

Álex: Nunca contaron exactamente qué encontraron.

Álex: Pero uno de ellos escribió algo antes de morir.

Habla ahora más despacio.

Álex: Dijo que debajo de la casa había una habitación que no podía existir.

Álex: Mucho más grande que la propia casa.

Álex: Sin ventanas.

Álex: Sin puertas.

Álex: Y llena de cunas.

Álex: Decenas.

Álex: Tal vez cientos.

Álex: Todas vacías.

Álex: Excepto una.

Nora: No...

Álex: Dentro había una niña.

Álex: Tendría unos ocho o nueve años.

Álex: La hija de la bruja.

Nora: ¿Tenía una hija?

Lo ha preguntado como si no lo supiera. Lo sabe. Lo tiene en el cuaderno. Lo ha preguntado para ver qué dice él.

Álex asiente.

Álex: Eso dicen.

Álex: Nadie sabía quién era el padre.

Álex: La versión de la Iglesia decía que había nacido del propio Diablo.

Álex: La versión del pueblo decía algo bastante peor.

Marcos: ¿Qué?

Se te ha escapado. Álex sonríe.

Álex: Que la niña no había nacido.

Álex: Que la bruja la había construido.

Se produce una pausa.

Álex: Había cosido un cuerpo con partes de otros niños y luego había metido algo dentro.

Marcos: Qué puta locura.

Álex: Os he avisado.

Álex: La niña nunca hablaba.

Álex: Nunca comía.

Álex: Nunca dormía.

Álex: Pero todos los hombres que bajaron aquella noche juraron haberla escuchado dentro de sus cabezas.

Álex: Y les dijo una cosa.

Mira lentamente alrededor. A cada uno. A ti el último.

Álex: «Mi madre os conoce a todos».

Silencio.

Álex: Entonces encontraron el altar.

Álex: Era una piedra enorme.

Álex: Negra.

Álex: Cubierta de sangre seca.

Álex: Alrededor había siete círculos.

Álex: Y en cada círculo, huesos.

Álex: En el primero, animales.

Álex: En el segundo, hombres.

Álex: En el tercero, mujeres.

Álex: En el cuarto...

Te mira.

Álex: ...niños.

Nora: ¿Y los otros tres?

Álex tarda en responder.

Álex: Vacíos.

La habitación se queda quieta.

Álex: Porque todavía no había terminado.

Álex: Según la leyenda, la bruja llevaba años preparando un ritual.

Álex: Todos los sacrificios, todos los niños, todos los muertos...

Álex: No eran para conseguir poder.

Álex: Ni juventud.

Álex: Ni inmortalidad.

Álex: Eran para llamar a algo.

Irene: ¿Al Diablo?

Álex: No.

Niega.

Álex: Ahí está lo raro.

Álex: Los documentos de la Inquisición hablan del Diablo porque, bueno... eran la Inquisición.

Álex: Pero la leyenda del pueblo nunca habla del Diablo.

Álex: Habla de algo que estaba aquí antes de que hubiera iglesias.

Álex: Antes incluso de que hubiera pueblos.

Álex: Algo que vivía debajo del bosque.

Álex: Algo que dormía.

Álex: Y que necesitaba siete ofrendas para despertar.

Señala con los dedos. Uno por uno.

Álex: Carne.

Álex: Hueso.

Álex: Sangre.

Álex: Aliento.

Álex: Nombre.

Álex: Recuerdo.

Álex: Y alma.

...

${({
  lucido: "~ Siete. Siete círculos, siete ofrendas. Y la niña «construida». Está juntando tres leyendas distintas en una. Y la juntura no se nota. Eso es lo que da miedo: que no se note.",
  asustado: "~ «Mi madre os conoce a todos.» Me ha mirado a mí el último. A mí. ¿Por qué a mí?",
  tenso: "~ Muy específico. Muy específico. Suéltalo ya y que se ría alguien.",
  ido: "~ Siete círculos. Los estoy contando en la mesa. Uno por vaso. Hay siete vasos. ¿Hay siete vasos?",
  perdido: "~ Debajo de la casa. Debajo de esta casa. La habitación está debajo de mis pies. La noto. No la noto. La noto.",
  normal: "~ Muy específico. Eso es lo que hay que decir. Muy específico, y que se ría Irene, y seguimos.",
})[api.modo("marcos")]}

Nora tiene la boca un poco abierta. Irene tiene la mano en el brazo de Álex y no se ha dado cuenta de que la tiene ahí. Y tú tienes el vaso vacío y no te acuerdas de habértelo bebido.`;
    },
    opciones: [
      { texto: "«Muy específico.»", a: "l6_leyenda",
        efecto: (api) => { api.marcar("ley_marcos5", "chiste"); api.est("marcos", "eje", 2); api.rel("alex", "marcos", "afecto", 2); } },
      { texto: "Mirar el techo. Un segundo más. Y volver a mirarlo cuando nadie mira.", a: "l6_leyenda", lucida: true, si: (api) => api.bandera("golpe_leyenda"),
        efecto: (api) => { api.marcar("ley_marcos5", "techo"); api.est("marcos", "lucidez", 1); api.saber("marcos", "golpe_arriba_leyenda"); api.presenciar("marcos", 0.5); } },
      { texto: "Llenarte el vaso. Beber. Que siga.", a: "l6_leyenda",
        efecto: (api) => { api.marcar("ley_marcos5", "bebe"); api.consumir("marcos", "chupito"); } },
      { texto: "«¿Podemos parar un momento?» Demasiado serio. Demasiado pronto.", a: "l6_leyenda", impulsiva: true,
        efecto: (api) => { api.marcar("ley_marcos5", "parar"); api.est("marcos", "estres", 5); api.est("marcos", "eje", -3); api.rel("alex", "marcos", "resentimiento", 4); api.rel("nora", "marcos", "proteccion", 3); api.rel("irene", "marcos", "afecto", -2); } },
    ],
  },

  l6_leyenda: {
    pov: "irene",
    titulo: "La leyenda · VI",
    texto: (api) => {
      const m5 = api.bandera("ley_marcos5");
      const inicio = m5 === "chiste" ? `
Marcos: Muy específico.

Álex: Siglos de tradición oral. Dale un poco de crédito.

Te ríes. Álex también. Pero enseguida continúa. No deja que el chiste respire.` : m5 === "techo" ? `
Marcos ha mirado el techo. Un segundo. Y luego, cuando creía que nadie miraba, otra vez.

Tú mirabas. Tú siempre miras.

Álex: Siglos de tradición oral. Dale un poco de crédito.

Nadie ha hecho el chiste esta vez. Álex lo ha hecho solo.` : m5 === "parar" ? `
Marcos: ¿Podemos parar un momento?

Lo ha dicho serio. Demasiado serio. Álex se ha quedado con la boca abierta a mitad de frase.

Álex: ¿Parar qué?

Marcos: Nada. Sigue.

Álex: ¿Seguro? Que si el racional necesita un descanso...

Marcos: Sigue.

Ha seguido. Pero Nora le ha cogido la mano a Marcos por encima de la mesa. Y tú te has apuntado que Marcos ha pedido parar. Marcos. El que nunca pide nada.` : `
Marcos se ha llenado el vaso. Se lo ha bebido. Se lo ha vuelto a llenar. Álex ha sonreído sin dejar de hablar.

Álex: Siglos de tradición oral. Dale un poco de crédito.`;
      return `${inicio}

Álex: Los hombres sacaron a la niña y prendieron fuego a la casa.

Álex: A la mujer la llevaron al pueblo.

Álex: Dicen que durante todo el camino no opuso resistencia.

Álex: No gritó.

Álex: No suplicó.

Álex: Ni siquiera cuando levantaron la hoguera.

Álex: El inquisidor le ofreció una última oportunidad para confesar.

Álex: Y ella preguntó:

Álex: «¿Confesar qué?»

Álex: Le dijeron:

Álex: «Que has entregado tu alma al Diablo».

Álex: Y entonces...

Sonríe.

Álex: ...se rio.

Marcos: Eso era obvio.

Álex: No.

Niega.

Álex: No una risita.

Álex: Dicen que se rio durante varios minutos.

Álex: Hasta llorar.

Álex: Y cuando consiguió parar dijo:

Álex: «Creéis que vuestro Diablo es lo peor que existe».

Silencio.

Álex: Después miró hacia el bosque.

Álex: Y dijo:

Álex: «Él también le tiene miedo».

Marcos: Joder.

Álex: La ataron.

Álex: Encendieron la hoguera.

Álex: Y ahí es donde todas las versiones coinciden.

Espera.

Álex: La bruja ardió.

Álex: Pero no murió.

Marcos: Venga.

Álex: Los hombres alimentaron el fuego durante horas.

Álex: Su ropa desapareció.

Álex: Su pelo ardió.

Álex: Su piel se abrió.

Álex: Y seguía mirándolos.

Álex: Sin gritar.

Marcos: Eso es imposible.

Álex: Ya.

Sonríe.

Álex: Pero imagina estar allí.

Álex: La gente empezó a rezar.

Álex: El cura también.

Álex: Y entonces la mujer empezó a recitar nombres.

Álex: Uno detrás de otro.

Álex: Los nombres de todos los que estaban mirando.

Álex: Cuando decía un nombre...

Chasquea los dedos.

Álex: ...esa persona moría antes de terminar el año.

Marcos: Qué conveniente.

Álex: Murieron treinta y dos.

Marcos: Claro.

Álex: Déjame acabar.

Álex: Cuando ya apenas quedaba nada de ella, dijo un último nombre.

Álex: El de su hija.

Álex: Y la niña...

Señala hacia algún punto indeterminado de la casa. Hacia arriba. Hacia el pasillo. No se sabe.

Álex: ...que estaba encerrada aquí...

Álex: desapareció.

Álex: La encontraron al amanecer sentada entre las cenizas de su madre.

Álex: Completamente desnuda.

Álex: Sin una sola quemadura.

Álex: Sonriendo.

Irene: No.

Lo has dicho tú. Otra vez. Con la mano en su brazo apretando.

Álex: Sí.

Álex: Uno de los hombres intentó cogerla.

Álex: La niña le mordió la mano.

Álex: Y cuando él la apartó vio que no tenía dientes de niña.

Se pasa la lengua lentamente por sus propios dientes. Te mira mientras lo hace.

Álex: Tenía demasiados.

Marcos: Me estás tocando los cojones.

Álex: La encerraron en la casa.

Álex: Clavaron puertas y ventanas.

Álex: El cura bendijo el terreno.

Álex: Después prendieron fuego a todo.

Álex: La niña seguía dentro.

Álex: Dicen que la escucharon gritar durante horas.

Álex: Hasta que dejó de hacerlo.

Álex: Durante un tiempo no pasó nada.

Álex: Y entonces reconstruyeron la casa.

Nora: ¿Esta?

Álex da dos golpecitos sobre la mesa.

Álex: Esta.

Nadie habla.

...

Le miras. Le miras como le miras cuando duerme, cuando no sabe que le miras. Y ves lo que has visto antes: que está dentro. Que se ha metido tan dentro de la historia que le va a costar salir. Que le ha pasado alguna vez, con otras cosas, y que tú eres la única que sabe cómo sacarle.

${({
  lucido: "~ «Sin una sola quemadura. Sonriendo.» Eso lo ha dicho más despacio. Eso no lo ha inventado él. Eso se lo han contado y le ha dado miedo y por eso lo cuenta tan bien.",
  asustado: "~ Ha señalado arriba. Al pasillo. Donde he estado yo hace media hora. Donde está la cuerda.",
  tenso: "~ Le tengo cogido el brazo. Le estoy dejando marca. Suéltale. No le sueltes.",
  ido: "~ La niña sonriendo entre las cenizas. La veo. Tiene la cara de Nora de pequeña. No conozco a Nora de pequeña.",
  perdido: "~ Demasiados dientes. Álex tiene demasiados dientes. Cuéntalos. No los cuentes.",
  normal: "~ Le encanta. Y le está costando salir. Le conozco. Ahora viene lo de «pero tranquilos» y ahí es cuando vuelve.",
})[api.modo("irene")]}

Nora tiene las manos juntas encima del cuaderno. Marcos tiene la mandíbula así. Y Álex coge aire para la última parte, la que siempre cuenta más bajo.`;
    },
    opciones: [
      { texto: "Pegarte a él. La cabeza en su hombro. Que note que estás. Que vuelva.", a: "l7_leyenda",
        efecto: (api) => { api.marcar("ley_irene6", "pega"); api.rel("irene", "alex", "afecto", 4); api.rel("alex", "irene", "afecto", 4); api.est("alex", "estres", -3); api.est("irene", "miedo", -2); } },
      { texto: "Mirar a Marcos. A ver si a él también se le ha ido la sonrisa. Se le ha ido.", a: "l7_leyenda",
        efecto: (api) => { api.marcar("ley_irene6", "marcos"); api.rel("irene", "marcos", "tension", 4); api.rel("nora", "irene", "resentimiento", 3); api.saber("irene", "marcos_asustado_leyenda"); } },
      { texto: "Mirar a Nora. Ver si se está asustando de verdad. Se está asustando de verdad.", a: "l7_leyenda",
        efecto: (api) => { api.marcar("ley_irene6", "nora"); api.rel("irene", "nora", "tension", 3); api.saber("irene", "nora_asustada_leyenda"); api.est("irene", "eje", 2); } },
    ],
  },

  l7_leyenda: {
    pov: "nora",
    titulo: "La leyenda · VII",
    texto: (api) => {
      const i6 = api.bandera("ley_irene6");
      const inicio = i6 === "pega" ? `
Irene se ha pegado a Álex. La cabeza en su hombro. Él le ha puesto la mano en el pelo sin dejar de mirar la mesa, y ha bajado la voz.` : i6 === "marcos" ? `
Irene está mirando a Marcos. Marcos está mirando a Álex. Marcos no sonríe. Tú lo has visto y ella lo ha visto y ella ha visto que tú lo veías.` : `
Irene te está mirando a ti. Otra vez. Y esta vez no sonríe. Esta vez te mira como se mira a alguien que está a punto de tener un accidente.

Bajas los ojos al cuaderno. Tienes las manos juntas encima y no te acuerdas de haberlas juntado.`;
      return `${inicio}

Álex: Desde entonces la gente que vive cerca cuenta cosas.

Álex: Una niña caminando entre los árboles.

Álex: Una mujer observando desde las ventanas aunque la casa esté vacía.

Álex: Arañazos debajo del suelo.

Álex: Voces que te llaman por tu nombre.

Álex: Bebés llorando cuando no hay ningún bebé.

Álex: Animales encontrados abiertos delante de la puerta.

Álex: Y una cosa más.

Baja todavía más la voz.

Álex: La bruja sigue haciendo pactos.

Irene: ¿Cómo?

Álex: Si entras aquí desesperado por algo...

Álex: dinero,

Álex: amor,

Álex: salud,

Álex: venganza...

Álex: y se lo pides...

Álex: puede concedértelo.

Irene: ¿Y qué quiere?

Álex la mira fijamente.

Álex: Nunca te lo dice al principio.

Se hace silencio.

Álex: Primero te da lo que quieres.

Álex: Después espera.

Álex: Puede pasar un día.

Álex: Un año.

Álex: Diez.

Álex: Y cuando finalmente viene a cobrar...

Gira lentamente la cabeza hacia el pasillo. Hacia la oscuridad de la cocina.

Álex: ...no viene a por ti.

Pausa.

Álex: Viene a por la persona que más quieres.

Una rama golpea la ventana.

Das un respingo. Pequeño. Marcos te aprieta la rodilla.

Álex sonríe.

Álex: Pero tranquilos.

Coge la botella.

Álex: Eso son gilipolleces.

${api.bandera("musica_leyenda") === "sonando" && !api.bandera("musica_sola") ? "La música sigue sonando, alegre, absurda, y ahora sí la oyes." : "Irene vuelve a poner la música. Algo alegre. Absurdo. Y ahora sí la oyes."}

Marcos se ríe. Irene le dice que es un cabrón. Álex llena de nuevo su vaso.

Respiras. No sabías que no estabas respirando.

Y justo antes de que la conversación vuelva completamente a la normalidad, añade:

Álex: Ah.

Todos le miráis.

Álex: Se me olvidaba.

Marcos: ¿Qué?

Álex señala hacia la puerta principal. Con el vaso.

Álex: Hay otra parte de la leyenda.

Silencio.

Álex: Dicen que si la casa decide que eres suyo...

Álex: se puede saber de una forma muy sencilla.

Nora: ¿Cuál?

Lo has preguntado tú. Con la voz que no usas.

Álex sonríe.

Álex: La puerta deja de dejarte salir.

...

...

Marcos: Bueno. Menos mal que hemos decidido dormir aquí.

Irene: Eres un puto enfermo.

Álex está encantado consigo mismo. Ha conseguido exactamente lo que quería: durante diez minutos los cuatro habéis estado escuchándole. Solo a él.

Y tú tienes el cuaderno debajo de las manos, y dentro, lo que de verdad se sabe. Que es poco. Que es peor, porque es poco.

${({
  lucido: "~ Ochenta por ciento inventado. El veinte que queda es lo que da miedo, porque es lo que está en las fuentes: la mujer, la hija, la Inquisición, el fuego. Y «no tiene nombre».",
  asustado: "~ «La puerta deja de dejarte salir.» Miro la puerta. Está cerrada. Estaba cerrada. La cerró Marcos al entrar. ¿La cerró?",
  tenso: "~ Ahora. Ahora es cuando le digo que se ha inventado la mitad. Ahora.",
  ido: "~ La rama ha golpeado la ventana justo cuando lo ha dicho. Justo. Como si la rama fuera suya. Como si la casa fuera suya.",
  perdido: "~ Viene a por la persona que más quieres. Miro a Marcos. Miro a Marcos y no puedo dejar de mirarle y le veo lejos.",
  normal: "~ Te has inventado la mitad. Y lo sabes. Y me estás mirando para que lo diga.",
})[api.modo("nora")]}

Álex te mira. Por encima del vaso. Esperando.`;
    },
    opciones: [
      { texto: "«Te has inventado la mitad.»", a: "c1_contrahistoria",
        efecto: (api) => { api.marcar("ley_fin", "mitad"); } },
      { texto: "«Te has inventado el ochenta por ciento. Y el veinte que queda es peor de lo que has contado.»", a: "c1_contrahistoria", lucida: true,
        efecto: (api) => { api.marcar("ley_fin", "ochenta"); api.est("nora", "lucidez", 1); api.rel("alex", "nora", "tension", 3); api.est("irene", "miedo", 2); api.est("marcos", "miedo", 1); } },
      { texto: "No decir nada. Beber. Dejar que gane esta.", a: "c1_contrahistoria",
        efecto: (api) => { api.marcar("ley_fin", "calla"); api.consumir("nora", "chupito"); api.est("alex", "eje", 3); api.rel("alex", "nora", "afecto", 3); } },
    ],
  },

  // =====================================================================
  // FASE III — LA CONTRAHISTORIA DE NORA
  // =====================================================================

  c1_contrahistoria: {
    musica: (api) => api.bandera("musica_leyenda") === "sonando" ? undefined : "terror_suave",
    pov: "nora",
    titulo: "La contrahistoria",
    hora: "02:45",
    texto: (api) => {
      const fin = api.bandera("ley_fin");
      const inicio = fin === "ochenta" ? `
Nora: Te has inventado el ochenta por ciento. Y el veinte que queda es peor de lo que has contado.

Álex: ¿Solo el ochenta? Estoy perdiendo facultades.

Irene: ¿Peor cómo?

Lo ha preguntado ella. Irene. Sin sonreír.` : fin === "calla" ? `
No dices nada. Bebes. Álex te mira, y espera, y cuando ve que no viene nada, sonríe más.

Álex: ¿Nada? ¿La profesora no tiene apuntes?

Marcos: Déjala.

Álex: Es que me sabe mal. Le he dejado el hueco y todo.

Nora: Te has inventado la mitad.

Lo dices tarde. Suena a lo que es: a tarde.` : `
Nora: Te has inventado la mitad.

Álex: ¿Solo la mitad? Estoy perdiendo facultades.`;
      return `${inicio}

Abres el cuaderno. No lo lees. Lo tienes para tener algo debajo de las manos.

Nora: La mujer existió. Eso sí. Hay referencias a gente que iba a verla porque sabía de plantas, remedios y esas cosas. Acabaron denunciándola, intervino la Inquisición y la quemaron. También tenía una hija.

Álex levanta una ceja.

Álex: ¿Y los niños destripados?

Nora: No.

Álex: ¿El libro de piel?

Nora: Álex...

Álex: ¿Las cunas llenas de cadáveres?

Nora: Me estás ayudando muchísimo.

Marcos: Yo estaba bastante comprometido con el libro de piel.

Nora: Lo que digo es que después aparecen veinte versiones distintas. Algunas se contradicen entre ellas. Que la llamaran bruja no significa que lo fuera.

Álex: Me aburro.

Y aquí está el punto. No te interrumpe solo porque sea gilipollas. Te interrumpe porque le estás desactivando el espectáculo. Acaba de pasar diez minutos con todo el mundo pendiente de él y tú estás convirtiendo a su monstruo en una mujer con un huerto.

Su ego reacciona. Pero lo hace con encanto.

Álex: Vale, profesora.

Nora: ¿Qué?

Álex mira hacia tu mochila. Sabe lo que hay dentro. Lo vio antes.

Álex: Pregúntaselo.

Tardas un segundo.

Nora: ¿A quién?

Álex sonríe.

Álex: A ella.

...

Álex: Si yo me lo he inventado y tú tienes razón... pregúntaselo.

Nora: Eso no funciona así.

Álex: Perfecto.

Pausa.

Álex: Entonces no puede pasar nada.

Y ahí te tiene. Si crees que la ouija no demuestra nada, no hay peligro. Si crees que hay que tomársela mínimamente en serio, acabas de darle la razón.

Marcos: Tengo que reconocer que el imbécil ha construido un argumento.

Nora: No ha construido una mierda.

Irene: Venga, Nora.

Irene. Con esa voz. Con la voz de «no seas aburrida». Con la voz que sabe exactamente dónde aprieta.

${({
  lucido: "~ Es una encerrona lógica de manual. Y la salida es decir que sí y hacerlo bien. Si lo hago bien, no pasa nada. Si no pasa nada, gano.",
  asustado: "~ No. No, no, no. No después de esto. No con la puerta ahí.",
  tenso: "~ Me da igual la ouija. Me da igual. Lo que no soporto es que Irene diga «venga, Nora» con esa voz.",
  ido: "~ Preguntárselo a ella. A ella. Como si estuviera aquí. Como si fuera fácil. Igual es fácil.",
  perdido: "~ Ya está aquí. Ya está sentada con nosotros. No hace falta preguntarle nada. Lo sabe todo.",
  normal: "~ Sabía que iba a acabar así. Lo sabía desde que metí la tabla en la mochila. Para eso la metí.",
})[api.modo("nora")]}

La mochila está a tus pies. La tabla, dentro. Todos lo saben. Todos te miran.

No es si vas a hacerla. Es por qué.`;
    },
    opciones: [
      { texto: "Aceptar el reto. «Vale. Pero dejamos de hacer el gilipollas. Los cuatro.»", a: "o1_ouija",
        efecto: (api) => { api.marcar("ouija_motivo", "reto"); api.est("nora", "eje", 4); api.rel("nora", "alex", "tension", 3); } },
      { texto: "Desde el escepticismo. «Vale. Y cuando no pase nada me dejáis terminar la historia.»", a: "o1_ouija",
        efecto: (api) => { api.marcar("ouija_motivo", "escepticismo"); api.est("nora", "lucidez", 2); api.rel("marcos", "nora", "afecto", 2); } },
      { texto: "«Ni de coña.» Y ver qué hace Álex con eso.", a: "o1_ouija",
        efecto: (api) => { api.marcar("ouija_motivo", "no"); api.est("nora", "miedo", 2); api.rel("alex", "nora", "resentimiento", 3); api.rel("irene", "nora", "resentimiento", 3); } },
      { texto: "«Vale.» Sin más. Porque quieres. Porque llevas años queriendo.", a: "o1_ouija",
        efecto: (api) => { api.marcar("ouija_motivo", "deseo"); api.est("nora", "eje", 8); api.est("nora", "miedo", 2); api.rel("marcos", "nora", "proteccion", 4); } },
    ],
  },

});
