/*
 * LA BRUJA — PRÓLOGO
 * Fase I: Desinhibición (HORROR_STAGE 0)
 * Referencia: docs/BIBLIA_PROLOGO.md · Formato: cabecera de js/engine.js
 *
 * VESTUARIO (fichas):
 *   Nora   — pantalón negro con cinturón, camiseta negra holgada sin sujetador, camisa negra de Marcos, holgada,
 *            abierta encima, colgante de luna, anillos. Cuaderno y péndulo.
 *   Marcos — camisa de cuadros marrones abierta sobre camiseta negra, vaqueros oscuros, cinturón, reloj.
 *   Álex   — camisa estampada abierta sobre el pecho desnudo, collares, anillos, pantalón negro, cinturón.
 *   Irene  — top blanco de botones que no cierran del todo, shorts vaqueros deshilachados, aros, colgante.
 *
 * INTOXICACIÓN: api.nivel(id, "intox") → bajo / medio / alto. Las escenas cambian el comportamiento.
 */
window.HISTORIA = {
  id: "la-bruja-prologo",
  version: 11,
  titulo: "La Bruja",
  inicio: "portada",
  faseInicial: "I",
  presupuestoAnomalias: { I: 3 },

  // Deriva de fondo por fase: en la fiesta se sigue bebiendo aunque el texto no lo diga.
  // Se aplica a los cuatro en cada escena nueva. Desaparece cuando la noche cambia.
  deriva: { I: { intox: 0.5, estres: -0.3 } },

  prepararSalto: (api, id) => {
    if (id.startsWith("b_")) api.marcar("juego", "botella");
    if (id.startsWith("p_")) api.marcar("juego", "poker");
    if (/^(d3|e1|f|g|h|i|j|k|l|m)/.test(id) && !api.bandera("juego")) api.marcar("juego", "botella");
  },

  // Música: fiesta hasta el final de la botella o el póker; terror ambiental después, en dos volúmenes.
  // El ambiente sintetizado (chimenea, viento, goteo) suena siempre por debajo.
  musica: {
    fiesta:            { src: "assets/musica/fiesta_feeling_good.mp3", vol: 0.42 },
    fiesta_southbound: { src: "assets/musica/fiesta_southbound.mp3", vol: 0.42 },
    fiesta_prnstar:    { src: "assets/musica/fiesta_prnstar.mp3", vol: 0.42 },
    fiesta_runrunrun:  { src: "assets/musica/fiesta_runrunrun.mp3", vol: 0.42 },
    fiesta_seven:      { src: "assets/musica/fiesta_seven_nation_army.mp3", vol: 0.42 },
    fiesta_baja:       { src: "assets/musica/fiesta_southbound.mp3", vol: 0.14 },
    terror:            { src: "assets/musica/terror_ambiente.mp3", vol: 0.5, aleatorio: true },
    terror_suave:      { src: "assets/musica/terror_ambiente.mp3", vol: 0.2, aleatorio: true },
    tension:           { src: "assets/musica/terror_ambiente.mp3", vol: 0.2, aleatorio: true },
  },
  portada: { fondo: "assets/fondos/portada.jpg" },

  personajes: {
    nora:   { nombre: "Nora",   subtitulo: "la creyente",   color: "#c9a86a", genero: "f", imagen: "assets/personajes/fichas/nora.webp",
              cara: "47% 14%", caraZoom: "330%",
              inicial: { miedo: 8,  estres: 10, lucidez: 80, intox: 15, eje: 40 } },
    marcos: { nombre: "Marcos", subtitulo: "el racional",   color: "#6f9bc4", genero: "m", imagen: "assets/personajes/fichas/marcos.webp",
              cara: "48% 15%", caraZoom: "330%",
              inicial: { miedo: 5,  estres: 8,  lucidez: 75, intox: 30, eje: 80 } },
    alex:   { nombre: "Álex",   subtitulo: "el provocador", color: "#d8b13a", genero: "m", imagen: "assets/personajes/fichas/alex.webp",
              cara: "45% 12%", caraZoom: "330%",
              inicial: { miedo: 3,  estres: 5,  lucidez: 55, intox: 55, eje: 75 } },
    irene:  { nombre: "Irene",  subtitulo: "la insinuante", color: "#c94a5a", genero: "f", imagen: "assets/personajes/fichas/irene.webp",
              cara: "52% 13%", caraZoom: "330%",
              inicial: { miedo: 6,  estres: 12, lucidez: 70, intox: 40, eje: 30 } },
  },

  relacionesIniciales: {
    "nora>marcos":  { confianza: 70, afecto: 75, tension: 40 },
    "marcos>nora":  { confianza: 75, afecto: 80, proteccion: 60 },
    "alex>irene":   { afecto: 55, tension: 80 },
    "irene>alex":   { afecto: 50, tension: 75 },
    "irene>marcos": { afecto: 45, celos: 35, tension: 30 },
    "marcos>irene": { confianza: 50, afecto: 40, tension: 25 },
    "irene>nora":   { resentimiento: 25 },
    "alex>marcos":  { confianza: 55, afecto: 50 },
    "marcos>alex":  { confianza: 45, afecto: 45 },
    "alex>nora":    { tension: 20 },
    "nora>alex":    { resentimiento: 15 },
    "nora>irene":   { confianza: 20 },
  },

  escenas: {

    // =====================================================================
    portada: {
      pov: null,
      fondo: "assets/fondos/portada.jpg",
      ambiente: "exterior",
      titulo: "Prólogo",
      texto: `
Una cabaña en mitad del bosque.

Cuatro amigos.

Una noche.

Lo que ocurrió aquí se contó después de muchas maneras. Ninguna coincide del todo.

Esta es una de ellas.
      `,
      opciones: [{ texto: "Empezar", a: "a1_brindis" }],
    },

    // =====================================================================
    // BLOQUE A — TODAVÍA ES UNA FIESTA
    // =====================================================================

    a1_brindis: {
      pov: "marcos",
      fondo: "assets/fondos/salon_fiesta.jpg",
      ambiente: "interior",
      musica: "fiesta",
      titulo: "Sábado · 00:40",
      lugar: "comedor", hora: "00:40",
      texto: `
Negro.

Música, amortiguada, como desde otra habitación.

Una carcajada. De Irene. La reconocerías en cualquier parte.

Corte.

La mesa. Redonda, de madera oscura, con más años que vosotros cuatro juntos. Una lámpara colgando encima, amarilla, que deja las esquinas del salón en penumbra. Al fondo, la chimenea encendida. A la derecha, el arco de la cocina. A la izquierda, la escalera que sube hacia el negro.

Sobre la mesa: dos botellas, una casi vacía. Vasos que no hacen juego. Un cenicero que ya no da más de sí. Cartas. Una bolsa de patatas abierta por el lado equivocado. Dos móviles boca arriba. La mochila de Nora, apoyada contra la pata de su silla, enfrente, con la cremallera a medio cerrar.

Fuera de las ventanas, nada. Ni una luz. El cristal devuelve la habitación.

Álex está de pie detrás de la silla de Irene, sirviendo en cuatro vasos con una botella en cada mano. La camisa estampada abierta hasta el cinturón, el pecho fuera, los collares enredados. Lo que sale de las botellas tiene un color que no existe en la naturaleza.

Irene está sentada de lado, con las piernas cruzadas. Los shorts vaqueros, deshilachados, dejan el muslo entero a la luz de la lámpara. El top blanco, de botones, le va una talla pequeña a propósito: el segundo botón hace lo que puede y el tercero ya ha perdido. Tiene la cabeza apoyada hacia atrás, contra el estómago de Álex. Él le pasa la botella por encima del hombro y le roza el pecho con el antebrazo al hacerlo. No es un accidente. Ella no se aparta.

Lo miras.

Marcos: Eso tiene exactamente el color de algo que luego explicas en urgencias.

Álex: Confía en mí.

Marcos: Esa frase tampoco mejora nada.

Irene se ríe sin levantar la cabeza. Álex deja una botella, mete la mano entre dos botones del top, sin prisa, como quien busca las llaves, y ella le da un manotazo que llega tarde y flojo.

Irene: Bébetelo.

Nora está enfrente de ti. Sentada de lado, las piernas cruzadas sobre la silla. Pantalón negro, cinturón ancho, una camiseta negra holgada que no lleva nada debajo y que se nota cuando se mueve, y encima tu camisa negra, la que te cogió del armario esta mañana sin preguntar y no piensa devolverte, abierta, con las mangas hasta los nudillos. El colgante de luna sobre la clavícula. El mechero dando vueltas entre dos dedos, porque no fuma tabaco y necesita algo en las manos. Mira los vasos como se mira un experimento.

Nora: Qué bonito. Presión de grupo, alcohol y una cabaña en mitad del bosque.

Pausa.

Nora: Luego que las noticias digan que nadie podía preverlo.

Álex: Lo dice la que ha traído velas.

Nora: Para la luz.

Álex: Claro.

Sonríe. Le sonríe a ella, pero mira a Irene mientras lo hace. Irene le devuelve una sonrisa que dura medio segundo.

Álex coge su vaso. Lo levanta.

Te mira a ti. No a Irene. No a Nora. A ti. Porque sabe que si tú brindas, brindan todos. Siempre ha sido así. Desde primero.

Por debajo de la mesa, la rodilla de Nora encuentra la tuya. Se queda ahí.

Espera.

~ La una menos veinte. La noche todavía es larga. Y esto es lo que hay.
      `,
      opciones: [
        { texto: "Levantar el vaso. «Por nuestras futuras necrológicas.»", a: "a2_yonunca",
          efecto: (api) => { api.rel("alex", "marcos", "afecto", 5); api.rel("marcos", "alex", "afecto", 5); api.marcar("d1", "juego"); } },
        { texto: "No levantarlo. «Yo no bebo nada preparado por un tío con la mano en una teta.»", a: "a2_yonunca",
          efecto: (api) => { api.est("marcos", "eje", 3); api.est("alex", "eje", -3); api.marcar("d1", "vacile"); } },
        { texto: "Levantarlo hacia Nora. «Por la única que ha traído algo útil a esta casa.»", a: "a2_yonunca",
          efecto: (api) => { api.rel("nora", "marcos", "afecto", 6); api.rel("marcos", "nora", "afecto", 4); api.rel("irene", "nora", "resentimiento", 4); api.marcar("d1", "nora"); } },
        { texto: "Sacar el móvil antes de brindar. Grabar los cuatro vasos en alto. «Para el documental.»", a: "a2_yonunca",
          efecto: (api) => { api.marcar("d1", "grabar"); api.evidencia("video_brindis", "marcos", "móvil de Marcos", "video"); api.est("marcos", "eje", 2); api.rel("alex", "marcos", "afecto", 3); api.rel("nora", "marcos", "afecto", 2); } },
      ],
    },

    a2_yonunca: {
      pov: "marcos",
      titulo: "Yo nunca",
      // brindis + rondas del yo nunca: lo que bebe cada uno en el texto
      consumo: [["marcos", "chupito"], ["alex", "chupito"], ["irene", "chupito"], ["nora", "chupito"],
                ["alex", "chupito"], ["alex", "chupito"], ["nora", "chupito"], ["marcos", "chupito"], ["irene", "chupito"]],
      alEntrar: (api) => { api.saber("alex", "nora_trampas_ouija"); api.saber("irene", "nora_trampas_ouija"); api.saber("marcos", "nora_trampas_ouija"); },
      texto: (api) => {
        const d1 = api.bandera("d1");
        const inicio = d1 === "grabar" ? `
Sacas el móvil. Lo levantas. Los cuatro vasos en alto, la lámpara, las caras.

Marcos: Para el documental.

Álex: ¡Documental número uno! Cuatro idiotas en la casa de una bruja. ¿Qué podría salir mal?

Lo dice a cámara. Con la sonrisa entera. Irene levanta el vaso hacia el objetivo y le manda un beso. Nora mira el móvil como si fuera un testigo.

Nora: Luego borra eso.

Marcos: Nunca borro nada.

Es verdad. Nunca borras nada.

Bebéis. Está horrible. Bebéis otra vez, ya sin cámara.` : d1 === "juego" ? `
Álex choca su vaso con el tuyo tan fuerte que salpica la mesa.

Álex: Necrológicas. Me gusta. Me gusta mucho.

Irene levanta el suyo. Nora tarda medio segundo más. Pero lo levanta.

Bebéis.

Está horrible.

Nadie lo dice. Bebéis otra vez.` : d1 === "vacile" ? `
Álex saca la mano del top de Irene y se la lleva al pecho como si le hubieras disparado.

Álex: Me duele. Aquí.

Marcos: Ahí tienes el hígado.

Irene se ríe. Nora también, pero mirándote a ti, no a él.

Irene: A mí no me molesta la mano.

Álex: ¿Ves?

Bebe solo, de un trago, y deja el vaso boca abajo en la mesa como si eso demostrara algo. Bebes tú también. Está horrible.` : `
Nora levanta una ceja. No sonríe. No del todo.

Nora: Gracias. Creo.

Irene sonríe muy despacio. De esa manera que tú ya conoces, la que empieza en la boca y no llega a los ojos.

Irene: Qué mono. Marcos brindando por su novia.

Álex: Antes brindaba por otras cosas.

Irene: Antes brindaba por todo.

Se ríen los dos. De algo que Nora no estaba. Nora bebe. Está horrible.`;
        return `${inicio}

Álex vuelve a llenar los vasos. Se sienta, por fin, y en vez de sentarse en su silla se sienta en la de Irene, y ella se le sube encima sin mirar, como quien se sube a un coche. La mano de él aparece en su muslo, donde acaba el short y empieza ella. Se queda ahí. Ninguno de los dos hace nada al respecto.

Álex: Vale. Yo nunca.

Irene: Yo nunca he estado con alguien que dijera «yo nunca» sin querer sacar algo.

Álex: Yo nunca he hecho trampas en una ouija.

Nora: Eso no cuenta. Todavía no la hemos sacado.

Álex: Estoy sembrando.

Bebe. Tú no. Irene tampoco. Nora se lo piensa, y bebe.

Marcos: ¿Tú has hecho trampas en una ouija?

Nora: Tenía catorce años y mi prima estaba insoportable.

Segunda ronda. Irene. Lo dice acomodándose en las rodillas de Álex, sin prisa, con la mano de él subiendo un centímetro más por dentro del short.

Irene: Yo nunca lo he hecho en un sitio público.

Álex bebe. Irene bebe. Tú bebes. Nora mira su vaso, y bebe, y Álex abre mucho los ojos.

Álex: Nora.

Nora: Un coche es un sitio público.

Álex: ¿Con éste?

Nora: Con éste.

Te mira. Tú miras la mesa. Irene mira a Nora como se mira a alguien que ha entrado en una habitación sin llamar.

Tercera. Nora, que lo dice jugando con el mechero, sin mirar a nadie:

Nora: Yo nunca he grabado a alguien sin que lo supiera.

Álex bebe. Irene bebe. Hay una pausa muy pequeña y bebes tú también. Porque hay una cosa de hace dos años que preferirías no explicar ahora, y menos con Irene delante.

Álex: Te he visto.

Marcos: No has visto nada.

Cuarta. Álex. Con la sonrisa de las malas ideas y la mano de Irene ahora sobre la suya, encima del muslo, guiándola o parándola, no sabes.

Álex: Yo nunca he tenido ganas de follarme a alguien de esta mesa que no fuera mi pareja.

...

Álex bebe. El primero. Mirando a Nora. A la camiseta de Nora, que se mueve cuando ella respira.

Irene bebe. Mirándote a ti.

Nora no bebe.

Tú tienes el vaso a dos dedos de la boca.

~ Todo el mundo lo ha visto. Lo de Álex es Álex, y Nora ya lo sabe. Lo de Irene es otra cosa. Lo de Irene lleva cinco años siendo otra cosa.

~ Si bebo, bebo mirando a Nora. Si no bebo, miento. Y las dos lo saben.

La rodilla de Nora se aparta de la tuya. Solo un poco. Como para dejarte sitio.`;
      },
      opciones: [
        { texto: "Beber mirando a Nora. «Es que está muy buena.»", a: "b1_pendulo",
          efecto: (api) => { api.rel("nora", "marcos", "afecto", 5); api.rel("irene", "marcos", "resentimiento", 6); api.rel("alex", "marcos", "afecto", 3); api.marcar("d2", "nora"); } },
        { texto: "No beber. «Siguiente.»", a: "b1_pendulo",
          efecto: (api) => { api.rel("nora", "marcos", "confianza", 4); api.rel("irene", "marcos", "resentimiento", 5); api.rel("alex", "marcos", "resentimiento", 3); api.marcar("d2", "pasar"); } },
        { texto: "Mirar a Irene un segundo. Y beber.", a: "b1_pendulo",
          efecto: (api) => { api.rel("irene", "marcos", "tension", 10); api.rel("irene", "marcos", "celos", 5); api.rel("nora", "marcos", "confianza", -6); api.rel("alex", "marcos", "celos", 4); api.marcar("d2", "mirada"); api.saber("irene", "marcos_mirada"); api.saber("nora", "marcos_mirada"); } },
        { texto: "Beber sin mirar a nadie. Vaciar el vaso. Y pedirle a Álex el porro que está liando.", a: "b1_pendulo",
          efecto: (api) => { api.marcar("d2", "beber"); api.consumir("marcos", "chupito"); api.consumir("marcos", "porro"); api.rel("alex", "marcos", "afecto", 4); api.rel("nora", "marcos", "confianza", -2); api.rel("irene", "marcos", "tension", 3); } },
      ],
    },

    // =====================================================================
    // BLOQUE B — ENTRA LO ESOTÉRICO COMO BROMA
    // =====================================================================

    b1_pendulo: {
      musica: "fiesta_southbound",
      pov: "nora",
      titulo: "El péndulo",
      texto: (api) => {
        const d2 = api.bandera("d2");
        const inicio = d2 === "beber" ? `
Marcos ha bebido sin mirar a nadie. De un trago. Ha dejado el vaso y ha alargado la mano hacia Álex, y Álex le ha pasado el porro a medio liar, y Marcos lo ha terminado él, con los dedos rápidos de antes, de cuando lo hacía cada noche.

Irene: Mira. Ha vuelto.

Álex: Nunca se fue. Estaba de vacaciones.

Se han reído los dos. De algo tuyo. De algo de Marcos que tú no conocías.

Marcos ha encendido el porro y te ha mirado por encima de la llama. No ha dicho nada. No hacía falta decir nada. Y eso es lo que te ha molestado.` : d2 === "mirada" ? `
Marcos ha mirado a Irene antes de beber.

Ha sido medio segundo. Menos. Pero ha sido.

Irene ha sonreído al vaso. Álex ha dicho «¡eeeh!» y le ha dado un golpe en el hombro a Marcos, de los de broma, de los que duelen un poco. Irene se ha reído y le ha cogido la cara a Álex con las dos manos y le ha besado como se besa a un perro grande.

Tú no has dicho nada. Lo has guardado donde guardas las cosas.

Y has vuelto a poner la rodilla contra la de Marcos. Porque sí. Porque es tuyo.` : d2 === "pasar" ? `
Marcos ha dejado el vaso en la mesa sin beber.

Marcos: Siguiente.

Lo ha dicho con una seriedad que en él es rarísima. Irene ha vuelto a coger el suyo como si nada, pero le has visto el mohín. Un segundo. Después la sonrisa otra vez, más grande.

Álex: Qué aburrido te has vuelto.

Marcos: Qué viejo me he vuelto. No es lo mismo.

Irene: Es exactamente lo mismo.

Y te ha mirado a ti al decirlo. Como si fuera culpa tuya. Como si lo fuera.

Tú has puesto la mano sobre la rodilla de Marcos por debajo de la mesa, y la has subido un poco, y la has dejado ahí.` : `
«Es que está muy buena.»

Marcos ha bebido mirándote. Álex ha aplaudido. Irene ha dicho «qué romántico» con la voz con la que se dice «qué frío».

Tú te has puesto roja. Odias ponerte roja. Y Marcos, por debajo de la mesa, te ha puesto la mano en el muslo y ha apretado, y se te ha ido el rojo a otro sitio.

Irene lo ha visto. Irene lo ve todo.`;
        return `${inicio}

El juego se deshace solo, como se deshacen todos. Álex saca papel y empieza a liar. Tú buscas el cuaderno en la mochila y tienes que abrirla del todo porque está en el fondo, debajo de las velas.

Álex se asoma por encima del hombro de Irene. Con la barbilla apoyada en su clavícula y la mano todavía dentro del short.

Álex: No.

Nora: ¿Qué?

Álex: Has traído mierdas.

Nora: He traído un péndulo.

Álex: Has traído mierdas.

Saca la mano de donde estaba, se limpia los dedos en el pantalón, sin ninguna vergüenza, y mete la mano en tu mochila. Es más rápido que tú. Saca el péndulo por la cadena y lo levanta a la altura de su cara, como un pescador con un pez pequeño.

Una piedra negra, pulida, del tamaño de una uña. Una cadena fina. Nada más.

Álex: ¿Y esto para qué es?

Nora: Para preguntar cosas.

Álex: ¿A quién?

Nora: A lo que conteste.

Marcos se ríe por la nariz. Irene se ha incorporado un poco, con el top torcido y un botón menos, para ver.

Álex apoya el codo en la mesa, deja colgar la piedra, cierra un ojo.

Álex: Pregunta importante.

Pausa.

Álex: ¿Voy a follar esta noche?

El péndulo empieza a oscilar. Adelante. Atrás. Cada vez más. Álex lo está moviendo, obviamente. Se le ve el tendón.

Irene: Eso lo decido yo.

Álex: ¿Va a follar Marcos esta noche?

Marcos: Cállate.

Oscila. Sí. Irene te mira. Tú miras el péndulo.

Álex: ¿Se lo va a hacer Nora con la luz encendida por si aparece la bruja?

Nora: Álex.

Álex: Lo pregunta la piedra.

Tienes la mano a medio camino. Puedes quitárselo. O puedes dejarle. Es Álex. Va a hacer el imbécil de todas formas.`;
      },
      opciones: [
        { texto: "Quitárselo. «No lo sujetes así. Y no se pregunta eso.»", a: "b2_pendulo_alex",
          efecto: (api) => { api.marcar("d3", "quitar"); api.rel("alex", "nora", "tension", 3); } },
        { texto: "Dejarle. Coger el porro que Álex acaba de liar y encenderlo tú. Que se canse.", a: "b2_pendulo_alex",
          efecto: (api) => { api.marcar("d3", "dejar"); api.est("alex", "eje", 5); api.marcar("alex_ocultismo", (api.bandera("alex_ocultismo") || 0) + 1); } },
      ],
    },

    b2_pendulo_alex: {
      pov: "nora",
      titulo: "El péndulo",
      texto: (api) => {
        const quitar = api.bandera("d3") === "quitar";
        const inicio = quitar ? `
Se lo quitas de la mano. Sin brusquedad. Como se le quita un mechero a un niño.

Álex: Eh.

Nora: No lo sujetes así.

Le coges la mano. Está caliente. Se la colocas: el codo apoyado en la mesa, la cadena entre el pulgar y el índice, la muñeca quieta.

Nora: Así. Y no se le pregunta con quién follas.

Álex: ¿El fantasma se ofende?

Nora: El fantasma no. Yo.

Irene: Uuuh. Cuidado, Álex. Que te enseña.

Álex te mira con esa cara de «vale, vale». Le devuelves el péndulo. Lo deja caer sobre la mesa, con la cadena enroscada al lado, y vuelve a poner la mano donde la tenía antes. Irene abre un poco las piernas para que quepa. Nadie hace ningún comentario.

Álex: Demasiadas reglas para una piedra.` : `
Enciendes el porro. Le das la primera calada mirando por la ventana, donde no hay nada que mirar. Álex protesta: era suyo.

Álex sigue.

Álex: ¿Irene se va a quedar sin botones antes de las tres?

Oscila. Sí. Irene se ríe y le muerde la oreja.

Álex: ¿Marcos va a ser un coñazo toda la noche?

Oscila. Sí. Marcos le tira una patata a la cabeza.

Álex: ¿Nora se va a casar con este péndulo?

Nora: Si sigues así, sí.

Álex: ¿Nora hace ruido?

Marcos: Álex.

Álex: ¡Lo pregunta la piedra! Mira. Mira cómo se mueve.

Oscila. Mucho. Irene se está riendo con la cara metida en el cuello de Álex. Marcos no se ríe. Tú tampoco. Te da igual. Casi.

Se ríe. Deja el péndulo en la mesa como quien suelta un mando de la tele. La piedra rueda un poco y se para.

Álex: Confirmado. El más allá me adora.`;
        return `${inicio}

La conversación se va por otro lado. Marcos quiere saber si hay hielo. Irene encuentra una canción en el móvil y sube el volumen sin preguntarle a nadie. Álex protesta por la canción. Irene le dice que se calle, y se lo dice con la boca pegada a la suya, y se besan de esa manera en que se besan ellos, con lengua y con ruido, como si estuvieran solos.

No lo están. Marcos mira la chimenea. Tú miras la brasa del porro, que ya no es tuyo, que ha vuelto a la mano de Álex.

Nadie mira el péndulo.

La piedra, sobre la madera. La cadena enroscada. Quieta.

...

Un centímetro.

Hacia la ventana.

Nada más. Ni un milímetro más. Como un reloj que ha dado una hora que no toca.

Puede ser la mesa. Puede ser que Marcos la haya rozado con la rodilla. Puede ser que Álex e Irene estén moviendo la silla, que la están moviendo.

Puede ser nada.

Vuelves a mirar la ventana. Tu propio reflejo te devuelve la mirada. Detrás, la lámpara, la mesa, tus amigos. Los dos que se besan. El que no te mira.

Nada más.

Álex se despega de Irene con un chasquido y ya está sacando otra cosa del bolsillo de la camisa. Una bolsita de plástico.

El péndulo sigue ahí, en mitad de la mesa. Puedes guardarlo. O dejarlo.`;
      },
      alEntrar: (api) => { api.anomalia("pendulo_solo"); },
      opciones: [
        { texto: "Guardarlo en la mochila.", a: "c1_setas", efecto: (api) => { api.marcar("pendulo", "mochila"); api.est("nora", "lucidez", 1); } },
        { texto: "Dejarlo donde está.", a: "c1_setas", efecto: (api) => { api.marcar("pendulo", "mesa"); } },
      ],
    },

    // =====================================================================
    // BLOQUE C — PROPUESTAS DE CONSUMO
    // =====================================================================

    c1_setas: {
      musica: "fiesta_prnstar",
      pov: "alex",
      titulo: "Ahora sí",
      texto: (api) => `
${api.bandera("pendulo") === "mochila" ? "Nora ha guardado el péndulo en la mochila con el cuidado con el que se guarda un anillo. Bien. Menos competencia para lo tuyo." : "El péndulo sigue en la mesa. Nora lo ha dejado ahí. Perfecto. Que se quede mirándolo."}

Sacas la bolsita y la dejas en el centro de la mesa. Encima de las cartas. Como se pone la última.

Dentro: algo seco, marrón, arrugado. Poca cosa. Suficiente.

Álex: Ahora sí.

Nora: No.

Álex: Ni siquiera he dicho nada.

Nora: Te conozco.

Álex: No me conoces. Me conoces desde marzo.

Lo dices sonriendo. Con la mano todavía en el muslo de Irene, por dentro del short, subiéndola un poco, por el calor. Irene te aprieta la mano con las piernas. Un aviso o un permiso. Con ella nunca se sabe y por eso te gusta.

Marcos mira la bolsa. No dice nada. Se ha remangado la camisa de cuadros hasta el codo, como hace cuando va a discutir.

Irene te mira a ti, con la barbilla apoyada en el hombro, con esa cara de «a ver por dónde sales». Le encanta verte hacer esto. Lo sabes. Luego, en la cama, te lo cobra.

Álex: Supuestamente reducen la distancia entre el mundo de los vivos y el de los muertos.

Marcos: ¿Eso viene en el prospecto?

Álex: Lo he leído en un sitio.

Nora: ¿En qué sitio?

Álex: En internet, Nora. Donde está todo. Donde has sacado tú lo de las velas.

Coges la bolsa. La abres. Huele a tierra y a algo que no es tierra.

~ Esto es una fiesta. Si hemos venido de fiesta, hemos venido de fiesta. Y la gracia no es tomarlas. La gracia es a quién se las ofreces primero.

Marcos, que lleva toda la noche haciendo de adulto. Con la novia nueva mirando.

Irene, que va a decir que sí sin dejar de mirarte, y luego va a estar insoportable de buena manera.

O Nora. La experta. La que dice que no antes de que preguntes. La que se puso roja antes. La que no lleva nada debajo de esa camiseta y cree que no se nota.`,
      opciones: [
        { texto: "Empujar la bolsa hacia Marcos. «Tú. Que desde que tienes novia no te dejan salir.»", a: "c2_setas_marcos",
          efecto: (api) => { api.marcar("d4", "marcos"); api.rel("alex", "marcos", "afecto", 3); api.rel("nora", "alex", "resentimiento", 4); } },
        { texto: "Ofrecérsela a Irene primero. Con la boca.", a: "c2_setas_marcos",
          efecto: (api) => { api.marcar("d4", "irene"); api.consumir("irene", "seta"); api.rel("irene", "alex", "afecto", 4); } },
        { texto: "Girarte hacia Nora. «¿Tú no? ¿La experta no quiere abrirse un poco?»", a: "c2_setas_marcos",
          efecto: (api) => { api.marcar("d4", "nora"); api.rel("nora", "alex", "resentimiento", 6); api.rel("alex", "nora", "tension", 5); api.rel("marcos", "alex", "resentimiento", 3); } },
        { texto: "Comerte tú el primer trozo. Con la boca abierta. Que vean cómo se hace.", a: "c2_setas_marcos",
          efecto: (api) => { api.marcar("d4", "alex"); api.consumir("alex", "seta"); api.est("alex", "eje", 4); api.rel("irene", "alex", "afecto", 3); } },
      ],
    },

    c2_setas_marcos: {
      pov: "marcos",
      titulo: "Ahora sí",
      texto: (api) => {
        const d4 = api.bandera("d4");
        const inicio = d4 === "alex" ? `
Álex se mete el primer trozo en la boca. Mastica con la boca abierta, mirando a Nora, enseñando la lengua marrón.

Álex: Así. ¿Ves? No pasa nada.

Nora: Todavía.

Álex: Todavía.

Traga. Bebe. Se limpia la boca con el dorso de la mano y se pasa la mano por el pecho. Irene le lame el pulgar cuando pasa cerca de su cara. Sin que él se lo pida.

Y luego se gira hacia ti.` : d4 === "irene" ? `
Álex se pone un trozo entre los dientes.

Irene se gira en sus rodillas, le coge la cara y se lo quita de la boca con la boca. Despacio. Tarda más de lo que hace falta. Cuando se separa, mastica mirándole, y traga, y le pasa la lengua por el labio de abajo a él, no a ella.

Irene: Ya está.

Álex: Esa es mi chica.

Irene: No soy de nadie.

Vuelven a besarse. Con setas. Es una imagen que preferirías no tener.

Nora mira su vaso. Tú miras a Nora.

Y luego Álex se gira hacia ti, con la boca brillante.` : d4 === "nora" ? `
«¿La experta no quiere abrirse un poco?»

Nora no contesta. Ni se molesta.

Mira a Álex como se mira a un perro que ha vuelto a subirse al sofá. Luego te mira a ti. Esperando.

Irene se ríe bajito, con la nariz metida en el cuello de Álex.

Álex también te mira a ti. Los dos. Como si tú fueras el que tiene que decidir algo. Como si Nora fuera tuya y hubiera que pedirte permiso.` : `
«Tú. Que desde que tienes novia no te dejan salir.»

Álex empuja la bolsa por encima de la mesa hasta que se para contra tu vaso.

Nora: No le dejo nada.

Álex: No hablaba contigo.

Lo dice sonriendo. Con cariño. Con el cariño de Álex, que es un cariño con dientes.

Todo el mundo te mira.`;
        return `${inicio}

Álex tiene la mano abierta sobre la mesa. En la palma, un trozo seco, retorcido, del tamaño de una moneda. Parece corteza.

Álex: Venga.

Marcos: No.

Álex: Que si luego pasa algo raro, quiero que lo veas tú también.

Marcos: Ese es exactamente el argumento para no hacerlo.

Álex: Ese es exactamente el argumento para hacerlo.

Sonríe. Sabe que lleva razón en algo, aunque no sepa en qué.

Irene se ha bajado de las rodillas de Álex. Se ha sentado en su silla, con una pierna cruzada sobre la otra, el short subido, y balancea el pie descalzo. El pie te roza la pantorrilla. Una vez. Puede ser sin querer. Con Irene nunca ha sido sin querer.

Nora no dice nada. Tiene el mechero entre los dedos y mira la mano de Álex, no a ti. Pero sabes lo que está pensando. Y sabes que si lo coges, lo va a leer como algo tuyo y de Álex, algo de antes, algo de lo que ella no forma parte.

La chimenea chasquea.

~ No sería la primera vez. Ni la quinta. Antes lo hacíamos los tres, en el piso de Álex, y acabábamos en el suelo hablando de la muerte hasta las ocho. Nora no estaba. Nora no estaba en nada de eso.

~ Y la cuestión es si quiero verla entera o quiero verla de otra manera.

La mano de Álex sigue abierta. El pie de Irene sigue balanceándose.`;
      },
      opciones: [
        { texto: "Cogerlo. «Ya que estamos.»", a: "c3_setas_nora",
          efecto: (api) => { api.consumir("marcos", "seta"); api.rel("alex", "marcos", "afecto", 8); api.rel("marcos", "alex", "afecto", 5); api.rel("nora", "marcos", "confianza", -4); api.rel("irene", "marcos", "afecto", 3); } },
        { texto: "Apartarle la mano. «Alguien tiene que conducir mañana. Y no vas a ser tú.»", a: "c3_setas_nora",
          efecto: (api) => { api.marcar("marcos_setas", false); api.consumir("alex", "seta"); api.est("marcos", "eje", 4); api.rel("nora", "marcos", "confianza", 4); api.rel("alex", "marcos", "resentimiento", 4); api.rel("irene", "marcos", "resentimiento", 2); } },
      ],
    },

    c3_setas_nora: {
      pov: "nora",
      titulo: "Ahora sí",
      texto: (api) => {
        const setas = api.setas();
        const inicio = setas ? `
Marcos coge el trozo de la mano de Álex.

Lo mira. Lo huele. Hace una mueca.

Marcos: Huele a zapato.

Álex: Sabe peor.

Se lo mete en la boca. Mastica con la cara de alguien que se está comiendo un corcho. Traga. Bebe medio vaso detrás.

Álex le da una palmada en la espalda tan fuerte que casi lo tira sobre la mesa.

Álex: ¡Ese es mi Marcos! ¡El de antes!

Irene: El de antes era más divertido.

Marcos: El de antes vomitaba en tu bañera.

Irene: Y yo le sujetaba el pelo.

Lo dice mirándote a ti. Con dulzura. Como se le cuenta a la nueva cómo funciona la casa.

Marcos te mira de reojo. Se encoge de hombros. Esa media sonrisa que usa cuando sabe que la ha liado un poco y quiere que se lo perdones antes de que se lo eches en cara.

No dices nada.

Dejas el mechero en la mesa.` : `
Marcos aparta la mano de Álex con dos dedos. Como se aparta una mosca.

Marcos: Alguien tiene que conducir mañana. Y no vas a ser tú.

Álex pone los ojos en blanco. Se mete el trozo en su propia boca y lo mastica mirando a Marcos, masticando con la boca abierta, como un niño.

Álex: Qué pena me das.

Marcos: Ya somos dos.

Irene: Ya somos tres.

Lo dice bajito. Con una sonrisa que no es para ti pero que te llega a ti.

Marcos te mira. Tú intentas no sonreír demasiado. No lo consigues del todo. Le pones la mano en la nuca, por dentro del cuello de la camisa de cuadros, donde le gusta, y él cierra los ojos un segundo.

Irene aparta la vista.`;
        return `${inicio}

Álex se gira hacia ti. Todavía tiene la bolsa en la mano. La agita un poco, como una campanilla.

Álex: ¿Y tú?

Nora: Ya te he dicho que no.

Álex: ¿La experta no quiere abrirse un poco?

Irene: Déjala. Que la nueva tiene que conservar la dignidad.

Álex: Estoy siendo hospitalario.

Marcos: Estás siendo pesado.

Álex: Es lo mismo con más cariño.

Se inclina hacia ti por encima de la mesa. Te llega el olor: tabaco, alcohol, el perfume de Irene, y debajo, él. Te mira la boca cuando habla. Y luego más abajo, donde la camiseta cae suelta. No lo disimula. Nunca lo ha disimulado.

Álex: Venga, Nora. Un trocito. Te prometo que luego te aguanto el pelo.

Irene deja de sonreír durante un parpadeo. Marcos también.

Todos te miran. Álex con la bolsa en alto y la boca a un palmo. Irene con la sonrisa de siempre, otra vez puesta. Marcos con ${setas ? "los ojos ya un poco más grandes de lo normal" : "cara de haber ganado una pequeña batalla y de estar a punto de perder otra"}.

No es si vas a tomarlas. Eso lo tienes claro desde que Álex sacó la bolsa. Lo has tenido claro desde que subisteis al coche.

Es cómo se lo dices. Y a quién se lo estás diciendo.`;
      },
      opciones: [
        { texto: "«Precisamente por eso. Alguien tiene que verte hacer el ridículo sobria.»", a: "d1_juego",
          efecto: (api) => { api.est("nora", "eje", 3); api.marcar("d6", "experta"); api.rel("alex", "nora", "tension", 3); } },
        { texto: "«Alguien tendrá que recordar esta noche. Y contarla.»", a: "d1_juego",
          efecto: (api) => { api.est("nora", "lucidez", 3); api.marcar("d6", "recordar"); } },
        { texto: "«Paso de que tú me aguantes nada. Ya tengo quien me lo aguante.»", a: "d1_juego",
          efecto: (api) => { api.rel("alex", "nora", "tension", 6); api.rel("nora", "alex", "resentimiento", 3); api.rel("nora", "marcos", "afecto", 4); api.rel("irene", "nora", "resentimiento", 5); api.marcar("d6", "chaman"); } },
      ],
    },

    // =====================================================================
    // BLOQUE D — EL JUEGO SE CALIENTA
    // =====================================================================

    d1_juego: {
      musica: "fiesta_runrunrun",
      pov: "irene",
      titulo: "El juego",
      texto: (api) => {
        const d6 = api.bandera("d6");
        const intox = api.nivel("irene", "intox");
        const inicio = d6 === "chaman" ? `
«Ya tengo quien me lo aguante.»

Y ha mirado a Marcos. Y Marcos ha sonreído como un imbécil.

Álex se ha reído. Se ha reído bien, con la cabeza hacia atrás. Pero le conoces. Se le ha quedado dentro, en algún sitio pequeño, y va a salir más tarde en forma de otra cosa.

Le pones la mano en el muslo por debajo de la mesa. Se la subes hasta donde ya no es el muslo. Aprieta la tuya contra él sin mirarte y sigue riéndose.

~ La nueva marca territorio. Bien. Ya somos dos.` : d6 === "recordar" ? `
«Alguien tendrá que recordar esta noche. Y contarla.»

Nora lo ha dicho sin mirar a nadie. Como si lo dijera para ella.

Te ha parecido una frase bonita.

También te ha parecido la frase de alguien que se cree un poco por encima de la mesa. Por encima de ti. Con la camisa de Marcos. La negra. La que le regalé yo hace tres años y él no se acuerda. Y ella no lo sabe. Y se le ve todo igual.` : `
«Alguien tiene que verte hacer el ridículo sobria.»

Álex ha hecho una reverencia. Nora lo ha dicho con esa seguridad tranquila que tiene para todo. Como si supiera algo que los demás no.

Marcos la ha mirado con orgullo. Le ha puesto la mano en la nuca, por dentro del pelo.

Tú has mirado la mano de Marcos.`;
        const cuerpo = intox === "alto" ? `

~ Y la lámpara. La lámpara tiene un halo. No lo tenía antes. O sí. Da igual. Es bonito.

Te pasas la lengua por los dientes. Los notas más grandes. Álex huele más fuerte. Todo huele más fuerte.` : "";
        return `${inicio}${cuerpo}

Álex ya está de pie. Una botella vacía en una mano. La baraja en la otra. Las levanta como un árbitro. La camisa abierta se le ha caído de un hombro y no se la sube.

Álex: Señoras. Señor. Hay que decidir.

Marcos: ¿Decidir qué?

Álex: Si esta noche va de botella y retos o de póker con prendas.

Marcos: Yo voto por dormir.

Álex: Nadie te ha preguntado. Y hace tres años votabas por prendas antes de que yo acabara la frase.

Marcos: Hace tres años tenía menos que perder.

Nora: ¿Perdón?

Marcos: Ropa. Tenía menos ropa.

Y todos te miran a ti.

Siempre te miran a ti para esto. Sabes por qué. Porque tú sabes exactamente cuál de los dos juegos va a poner a quién más incómodo. Y ellos saben que lo sabes. Y les gusta.

Nora no te mira. Nora mira las cartas.

~ Con la botella, Álex hace el espectáculo y yo hago el mío y todo va rápido. Con las cartas, la cosa va lenta. Y lenta significa más rato mirando a la gente. Y más rato para que la gente se mire.

~ Marcos juega mal al póker. Siempre ha jugado mal. Se le nota en la boca. Y Nora, no tengo ni idea. Y eso es lo que quiero saber.

Álex agita la botella.

Álex: ¿Y bien?`;
      },
      opciones: [
        { texto: "«Botella. Y retos de verdad. No de instituto.»", a: "b_r1",
          efecto: (api) => { api.marcar("juego", "botella"); api.est("alex", "eje", 3); } },
        { texto: "«Póker. Con prendas. Y reparto yo.»", a: "p_r1",
          efecto: (api) => { api.marcar("juego", "poker"); api.est("irene", "eje", 3); } },
      ],
    },

    // =====================================================================
    // LA BOTELLA — cuatro rondas. Quien lanza elige la prueba para quien señala.
    // Quien la recibe elige: prueba, seta (Nora: porro y chupito) o prenda.
    // =====================================================================

    b_r1: {
      musica: "fiesta_seven",
      pov: "irene",
      titulo: "La botella · Marcos lanza",
      texto: (api) => {
        const intox = api.nivel("irene", "intox");
        return `
Álex pone la botella vacía en el centro de la mesa. La hace girar una vez, sin que cuente, solo para oír el sonido. Vidrio contra veta.

Álex: Reglas. Uno lanza. A quien señale, le toca. El que lanza elige la prueba. El que la recibe puede hacerla, o comerse una seta, o quitarse una prenda.

Nora: Yo no me como nada.

Álex: Tú fumas y bebes. Un porro y un chupito. Eso o la prenda.

Nora: Eso o la prueba.

Álex: Eso o la prueba.

Marcos: ¿Y quién decide qué es una prueba?

Álex: El que lanza. Y si es floja, la mesa la sube.

Te mira a ti. Sabe que tú eres la mesa. Le sostienes la mirada con la lengua apoyada en el interior de la mejilla, como hace cinco años, cuando él decía «la mesa» y quería decir «tú».

Álex: Empieza Marcos. Que lleva toda la noche de espectador.

Marcos coge la botella. La mira como si fuera a explicarle algo. Se ha quitado la camisa de cuadros y la ha colgado del respaldo; la camiseta negra se le pega a la espalda por el calor de la chimenea, y por los hombros, y tú te acuerdas de esa espalda mejor de lo que te gustaría. La lanza.

Gira. Gira. Se frena.

Te señala a ti.

Nora deja el mechero en la mesa. Álex se ríe por la nariz. Marcos no se ríe.

Marcos: Vale. Irene.

Irene: Dime.

Lo dices bajo. Con la voz de las dos de la mañana. Marcos lo nota. Traga.

Marcos: Que... no sé. Que te bebas esto de un trago.

Álex: Floja.

Marcos: Es mi prueba.

Álex: Y la mesa la sube. Irene se sienta en tus rodillas y te come el cuello hasta que digas basta. Y no vale decir basta antes de diez segundos.

Nora: Álex.

Álex: Es el juego. Ella puede comerse una seta.

Marcos te mira. Te mira de verdad. Con esa cara de «no lo hagas» que es también una cara de «hazlo». Y tú le miras la boca, y luego el cuello, el sitio exacto, como si ya estuvieras eligiendo dónde.

${intox === "alto" ? "~ Se le ve doble. Un Marcos que dice que no y otro que dice que sí. Con los dos me vale.\n\n" : intox === "medio" ? "~ Estoy caliente. No de él. De la noche. De la chimenea, del licor, de tener a Álex encima media hora. Marcos solo es donde se pone eso.\n\n" : ""}~ Cinco años. Cinco años sin que pase nada. Y ahora me lo ponen en bandeja y con testigos.

~ Nora está mirando. Bien. Que mire. Que aprenda cómo se le mira a él.

Coges la botella y la dejas de pie, en el centro, apuntando al techo. Te pasas el pulgar por el segundo botón del top. El que aguanta. Lo notas tenso contra el dedo, como todo lo demás.`;
      },
      opciones: [
        { texto: "Hacerlo. Sentarte en sus rodillas, de frente, y buscarle el cuello con la boca.", a: "b_r2",
          efecto: (api) => { api.marcar("b1", "prueba"); api.rel("irene", "marcos", "tension", 15); api.rel("marcos", "irene", "tension", 12); api.rel("nora", "irene", "resentimiento", 15); api.rel("nora", "marcos", "confianza", -8); api.rel("alex", "marcos", "celos", 8); api.est("irene", "eje", 6); api.est("nora", "estres", 10); api.est("marcos", "estres", 8); } },
        { texto: "Comerte una seta. Mirando a Marcos mientras masticas.", a: "b_r2",
          efecto: (api) => { api.marcar("b1", "seta"); api.consumir("irene", "seta"); api.rel("irene", "marcos", "tension", 5); api.rel("alex", "irene", "afecto", 4); } },
        { texto: "Prenda. El top. Botón a botón, sin prisa, y dejar que se abra.", a: "b_r2",
          efecto: (api) => { api.marcar("b1", "prenda"); api.est("irene", "eje", 4); api.rel("alex", "irene", "tension", 6); api.rel("marcos", "irene", "tension", 6); api.est("nora", "estres", 4); } },
      ],
    },

    b_r2: {
      pov: "marcos",
      titulo: "La botella · Nora lanza",
      texto: (api) => {
        const b1 = api.bandera("b1");
        const intox = api.nivel("marcos", "intox");
        const inicio = b1 === "prueba" ? `
Irene rodea la mesa. Despacio. Descalza. No corre. No tiene ninguna prisa y quiere que lo sepas.

Te pone una mano en el hombro. Se sube a tus rodillas de frente, con las piernas a los lados de las tuyas, y el short vaquero se le sube hasta donde ya no hay short, y notas el calor de sus muslos a través del pantalón como si no llevaras pantalón.

Pesa poco. Huele a lo de siempre. A hace cinco años. A ese perfume que no sabes cómo se llama y que reconocerías en un ascensor lleno.

Álex: Diez segundos. Cuento yo.

Irene te aparta el cuello de la camiseta con dos dedos. Te mira. Te mira la boca, y luego los ojos, y luego el cuello, y baja.

No es un beso. Es otra cosa. Es la boca abierta y caliente en el sitio donde el cuello se junta con el hombro, y la lengua, despacio, y los dientes después, y la respiración, y su mano en tu nuca sujetándote como se sujeta algo que puede escaparse. El top de ella, con los botones a punto, contra tu pecho. Su pelo en tu cara. Su pecho, subiendo y bajando, contra el tuyo.

Álex: Cuatro. Cinco.

Tienes las manos en la mesa. Las dos. Planas. No las mueves. Es lo único que puedes hacer y lo haces. Se te clavan las uñas en la madera.

${intox !== "bajo" ? "El cuello te arde. No en el sitio de la boca. En todo el cuello. Y baja. Y la lámpara se ha puesto a respirar con ella.\n\n" : ""}Álex: Ocho. Nueve.

Irene te muerde. Suave. Justo debajo de la oreja. Y te dice algo tan bajo que solo lo oyes tú. Con los labios pegados a la piel.

Irene: Basta lo dices tú.

Álex: Diez.

No dices basta.

Irene se queda un segundo más. Uno. Con la boca quieta en tu cuello, respirando. Y luego se levanta. Se estira el short. Se abrocha el botón que se le ha soltado, o lo intenta. Vuelve a su silla. Se sienta con las piernas cruzadas y coge su vaso como si viniera de la cocina.

Miras a Nora.

Nora está mirando la marca que te ha dejado. Mojada. Roja. Tarda en levantar los ojos. Cuando lo hace, no sonríe y no deja de sonreír. Coge la botella.` : b1 === "seta" ? `
Irene alarga la mano hasta la bolsa de Álex. Coge un trozo. Lo mira. Te mira a ti.

Irene: Otra vez será.

Se lo come masticando despacio, sin dejar de mirarte, con la boca un poco abierta, como si fueras tú lo que se está comiendo. Traga. Se pasa la lengua por los dientes. Por el labio.

Álex: Qué cobarde.

Irene: Qué estratégica.

Álex le pasa el brazo por los hombros y le muerde la oreja. Ella se deja. Echa la cabeza hacia atrás. Pero te sigue mirando a ti por encima de la cabeza de él, con los ojos entrecerrados, mientras él le hace lo que le hace.

Nora exhala. No sabías que estaba conteniendo el aire. Coge la botella.` : `
Irene se levanta.

Se lleva las manos al top. El primer botón. Lo suelta con dos dedos, sin mirar, mirándote a ti. El segundo, el que aguantaba, se abre solo cuando ella respira hondo, y respira hondo a propósito. El tercero hace tiempo que no está.

El top se abre. Ella no lo aparta. No hace falta. Se ve la curva entera, la piel más clara donde no le da el sol, y ella sabe exactamente lo que se ve.

Se queda de pie dos segundos. Para que se vea. Para que lo veas tú. Luego se sienta, con el top abierto a los lados, y cruza los brazos por debajo, que no tapa nada, que lo sube todo.

Álex silba. Le pone la mano en la espalda desnuda, y la baja. Ella le deja.

Álex: Esto es una prenda de verdad.

Irene: Esto es un aviso.

Nora ha mirado. Un segundo. Luego ha mirado el vaso. Luego te ha mirado a ti, para ver si tú mirabas.

Mirabas. Coge la botella.`;
        return `${inicio}

Nora la hace girar. Fuerte. Demasiado fuerte, como se hace cuando se quiere que dure.

Gira. Gira. Se frena.

Te señala a ti.

Álex: ¡Uy!

Nora te mira. La prueba la pone ella. Y tú ves cómo se lo piensa, cómo le pasa por la cara la tentación de ponerte algo fácil, algo vuestro, algo de los dos.

Y cómo mira a Irene. Y decide otra cosa.

Nora: Marcos.

Marcos: Dime.

Nora: Me besas. Aquí. Delante de ellos. Me desabrochas el cinturón tú, con las manos, mirándome. Y mientras me besas me metes la mano por dentro. Y no la sacas hasta que yo diga.

...

Álex: Hostia.

Irene no dice nada. ${b1 === "prenda" ? "Se ha cruzado más los brazos." : "Ha dejado el vaso."}

Nora sigue mirándote. Tiene las mejillas rojas y la barbilla alta y la voz le ha salido más grave de lo que ella quería. Se ha quitado la camisa de Marcos y la ha dejado en el respaldo, y debajo la camiseta holgada se mueve con cada respiración y se nota exactamente lo que no lleva, y respira rápido. Por debajo de la mesa ha descruzado las piernas.

~ No es un reto. Es una respuesta. Me está diciendo «esto es mío» delante de la única persona a la que hace falta decírselo.

~ Y quiero. Joder, si quiero. Y ella lo sabe. Y ellos también.

~ Y si lo hago, Irene mira. Y Álex cuenta. Y Nora lo hace por eso. Y a mí me pone que lo haga por eso, y eso es lo peor.

${intox !== "bajo" ? "~ Y no sé si es la seta o es ella, pero la veo más nítida que a nadie en esta mesa. Como si el resto fuera un cuadro y ella no.\n\n" : ""}La mano de Nora está sobre la mesa, abierta. Esperando la tuya. La hebilla del cinturón, ancha, negra, brilla bajo la lámpara, justo debajo de donde acaba la camiseta.`;
      },
      opciones: [
        { texto: "Hacerlo. Levantarte, ir hasta ella, y que se olviden de que existen.", a: "b_r3",
          efecto: (api) => { api.marcar("b2", "prueba"); api.rel("nora", "marcos", "afecto", 12); api.rel("nora", "marcos", "confianza", 8); api.rel("marcos", "nora", "afecto", 8); api.rel("irene", "nora", "resentimiento", 15); api.rel("irene", "marcos", "celos", 12); api.rel("alex", "nora", "tension", 10); api.est("nora", "eje", 4); api.est("nora", "estres", -5); api.est("irene", "estres", 10); } },
        { texto: "Seta. «Esta noche no me toca ser el espectáculo.»", a: "b_r3",
          efecto: (api) => { api.marcar("b2", "seta"); api.consumir("marcos", "seta"); api.rel("nora", "marcos", "confianza", -12); api.rel("nora", "marcos", "resentimiento", 10); api.rel("irene", "marcos", "afecto", 5); api.rel("alex", "marcos", "afecto", 5); api.est("nora", "estres", 12); } },
        { texto: "Prenda. Quitarte la camiseta y tirársela a Álex a la cara.", a: "b_r3",
          efecto: (api) => { api.marcar("b2", "prenda"); api.rel("nora", "marcos", "confianza", -6); api.rel("nora", "marcos", "resentimiento", 6); api.rel("irene", "marcos", "tension", 5); api.est("nora", "estres", 8); } },
      ],
    },

    b_r3: {
      pov: "nora",
      titulo: "La botella · Irene lanza",
      texto: (api) => {
        const b2 = api.bandera("b2");
        const inicio = b2 === "prueba" ? `
Marcos se levanta.

Rodea la mesa sin prisa. Se para delante de ti. Te mira desde arriba, y luego se agacha hasta que sus ojos quedan a la altura de los tuyos, con una rodilla en el suelo, como si fuera a pedirte algo.

No te pide nada.

Te pone una mano en el cuello. Abierta. El pulgar en la mandíbula, los dedos por detrás, debajo del pelo. Te sujeta la cara y te mira como si fueras lo único que hay en la habitación. Te mira la boca. Te mira los ojos. Te mira la boca otra vez. Y te devora. Sin tocarte todavía. Solo con eso. Y ya estás perdida.

Y la otra mano baja al cinturón.

La hebilla. La suelta con dos dedos, sin mirar, mirándote a ti. El cuero cede con un sonido pequeño. El botón del pantalón. Baja la cremallera despacio. Se oye cada diente. Nadie en la mesa respira.

Te besa.

No como en el juego de antes. Como en casa. Como cuando no hay nadie. Con la boca abierta y despacio y sin ninguna intención de parar. Y la mano entra. Por dentro del pantalón. Por dentro de lo otro. Caliente. Segura. Como si supiera el camino, que lo sabe.

Se te escapa. Un sonido. Bajo. Contra su boca. No lo puedes evitar y no lo intentas. Y otro, cuando los dedos se mueven. Y notas cómo te empapas contra su mano, y él lo nota, y lo notas en cómo te besa, más fuerte, con los ojos abiertos, mirándote gemir. Le agarras la camiseta con las dos manos. Le clavas los dedos en la espalda por debajo.

Álex ha dejado de contar. Irene no ha apartado la vista. Lo sabes sin mirar, porque Marcos te está besando con los ojos abiertos y te lo está diciendo con ellos: mírame a mí. Solo a mí.

Cuando dices «ya», lo dices contra su boca, sin voz. Él tarda un segundo más en sacar la mano. Te abrocha el pantalón él. El cinturón también, sin mirar la hebilla, mirándote. Te besa la frente. Te besa la boca otra vez, corto.

Se sienta. Tienes las piernas de goma y la cara ardiendo y las bragas mojadas y el pulso en sitios donde no debería haber pulso, y no te importa nada.

Irene: Bonito.

Lo dice como se dice «frío». Coge la botella.` : b2 === "seta" ? `
Marcos coge la seta.

Marcos: Esta noche no me toca ser el espectáculo.

Se la come mirando a Álex. No a ti. Álex le da una palmada en la mesa. Irene sonríe al vaso, y luego a ti, y luego al vaso.

Tú tienes la mano abierta sobre la mesa todavía. La cierras. La bajas. Te la pones en el muslo, donde iba a estar la suya. Notas el calor de la tuya y piensas en el de la de él y aprietas.

~ Delante de ella. Ha dicho que no delante de ella.

~ Y yo lo había pedido con el cuerpo entero. Con la voz que no uso. Y se lo ha comido mirando a Álex.

Irene coge la botella. Te mira mientras la coge.

Irene: Qué pena.` : `
Marcos se quita la camiseta por la cabeza y se la tira a Álex a la cara.

Álex: ¡Eh!

Marcos: Prenda.

Se sienta con el pecho desnudo y los brazos cruzados. No te mira. Mira la chimenea. La luz le da en el hombro, en la clavícula, en el sitio donde tú pones la boca cuando estáis solos.

Tú tienes la mano abierta sobre la mesa todavía. La cierras.

Irene: Vaya.

Coge la botella. Te mira mientras la coge. Le mira el pecho a Marcos, sin ninguna prisa, recorriéndolo, y luego te mira a ti otra vez.

Irene: Pensaba que ibas a decir que sí.`;
        return `${inicio}

Irene la hace girar con dos dedos. Con desgana. Como si le diera igual.

Gira. Gira. Se frena.

Te señala a ti.

...

Irene sonríe. No una sonrisa grande. Una pequeña, de las que se guardan.

Irene: Nora.

Nora: Dime.

Irene: Ven.

No te mueves.

Irene: Ven aquí. Siéntate a mi lado.

Álex: ¿Qué prueba es?

Irene: Espera.

Te levantas. Rodeas la mesa. Te sientas en la silla de Álex, que se aparta, encantado, a mirar. Irene se gira hacia ti. ${api.bandera("b1") === "prenda" ? "Con el top abierto, sin arreglárselo, a un palmo. Te llega el calor de ella." : "Con el top a punto de reventar, a un palmo. Te llega su perfume y debajo del perfume, ella."} Te pone una mano en la rodilla. Sube. Por la parte de dentro del muslo. Despacio. Se para en el cinturón. Mete un dedo por debajo del cuero, entre la hebilla y tu piel.

Irene: Un beso. De los de verdad. Y mientras te beso, meto la mano aquí.

Aprieta. Encima de la hebilla. Y luego un poco más abajo.

Irene: Por debajo.

Marcos: Irene.

Irene: Es el juego. Puede fumar y beber. Puede quitarse la camiseta, que total. Puede decir que no.

Te mira. Muy cerca. Tiene los ojos azules y las pupilas enormes${b2 === "prueba" ? " y una rabia debajo de la calma que solo tú ves porque solo tú la has provocado, y esa rabia le queda bien, y eso también lo ves" : ""}. Te mira la boca. Se humedece la suya.

~ Sabe lo que hace. Lo sabe exactamente. Quiere que diga que no delante de Marcos. O quiere que diga que sí delante de Marcos. Le vale cualquiera de las dos.

~ Y lo peor es que la mano no se ha movido. Y yo tampoco. Y tengo el dedo de ella debajo del cinturón y no me he apartado.

${api.nivel("nora", "intox") !== "bajo" ? "~ Y estoy más borracha de lo que creía. Lo sé porque Irene me parece guapa. Siempre me lo ha parecido. Pero ahora me parece guapa de cerca. Y huele bien. Y eso no debería importar.\n\n" : ""}Álex tiene el móvil en la mano. No lo ha levantado. Todavía. Marcos tiene las dos manos en la mesa, como antes, planas, y no sabes si es para no moverlas o para levantarse.`;
      },
      opciones: [
        { texto: "Aceptar. Cogerle la cara antes de que ella te la coja a ti.", a: "b_r4",
          efecto: (api) => { api.marcar("b3", "prueba"); api.rel("irene", "nora", "resentimiento", -10); api.rel("irene", "nora", "tension", 20); api.rel("nora", "irene", "tension", 15); api.rel("marcos", "nora", "tension", 10); api.rel("marcos", "irene", "resentimiento", 8); api.rel("alex", "nora", "tension", 15); api.est("nora", "eje", 6); api.est("nora", "estres", 15); api.est("marcos", "estres", 15); api.est("alex", "eje", 5); api.saber("alex", "beso_irene_nora"); } },
        { texto: "Porro y chupito. Fumar mirándola a los ojos, sin toser.", a: "b_r4",
          efecto: (api) => { api.marcar("b3", "porro"); api.consumir("nora", "porro"); api.consumir("nora", "chupito"); api.rel("irene", "nora", "resentimiento", 8); api.rel("nora", "irene", "resentimiento", 10); api.rel("marcos", "nora", "afecto", 4); } },
        { texto: "Prenda. Quitarte la camiseta. Sin nada debajo. Y quedarte mirándola.", a: "b_r4",
          efecto: (api) => { api.marcar("b3", "prenda"); api.rel("irene", "nora", "resentimiento", 12); api.rel("nora", "irene", "resentimiento", 8); api.rel("alex", "nora", "tension", 15); api.rel("marcos", "nora", "tension", 8); api.est("nora", "eje", 4); api.est("nora", "estres", 10); } },
      ],
    },

    b_r4: {
      pov: "irene",
      titulo: "La botella · Álex lanza",
      texto: (api) => {
        const b3 = api.bandera("b3");
        const intox = api.nivel("irene", "intox");
        const inicio = b3 === "prueba" ? `
Nora te coge la cara.

Eso no lo esperabas. Te la coge con las dos manos, frías, con los anillos contra tu mandíbula, y te besa ella. No espera a que lo hagas tú. Con la boca cerrada al principio, y luego no. Y luego con la lengua, despacio, como si tuviera todo el tiempo del mundo y toda la razón.

Sabe a lo de Álex, ese licor de mierda, y a algo más que es solo ella. Y besa bien. Besa como alguien que no está pensando en quién mira. Y eso te enfada y te pone, las dos cosas, en el mismo sitio.

Metes la mano.

Sueltas la hebilla con una mano, que se te da bien, y bajas la cremallera, y entras. Por dentro. Piel caliente, y luego más caliente, y Nora se queda quieta un segundo entero contra tu boca, y luego respira, y ese aliento entre los dientes es lo que querías. Es exactamente lo que querías. Y está mojada. Está mojada de antes, de él, y eso también lo querías saber, y ahora lo sabes, y no sabes qué hacer con ello.

Nora te muerde el labio. No fuerte. Lo justo.

Marcos no ha dicho nada. Álex ha dicho «joder» muy bajo. Y luego otra vez.

Cuando la sueltas, Nora no se aparta la primera. Te sostiene la mirada con la boca mojada y las pupilas dilatadas y el cinturón abierto. Y luego se abrocha, despacio, sin dejar de mirarte, y vuelve a su silla, y se sienta al lado de Marcos, y le coge la mano por encima de la mesa, y se la lleva a la boca, y le besa los nudillos.

Marcos le aprieta la mano. Pero te está mirando a ti. Y no sabes lo que hay en esa cara. Y eso, de Marcos, no te había pasado nunca.

~ Vale. Vale. La nueva sabe jugar. Y besa mejor que él.

Álex coge la botella. Le tiembla un poco la mano. De ganas.` : b3 === "porro" ? `
Nora coge el porro de la mano de Álex. Lo enciende ella. Le da una calada larga, sin toser, mirándote, y suelta el humo despacio, hacia ti, hacia tu boca, como si fuera lo único que te va a dar esta noche.

Nora: No.

Se bebe el chupito detrás. Deja el vaso boca abajo.

Nora: Siguiente.

Te quitas la mano de su cinturón. Despacio. Le rozas el estómago por encima de la camiseta al sacarla, y ella lo nota, y no se mueve. Sonríes. Es lo único que puedes hacer y lo haces bien.

Irene: Otra vez será.

Nora: No.

Vuelve a su silla. Marcos le pasa el brazo por los hombros y ella se apoya, y él te mira a ti por encima de su cabeza, y no sabes lo que hay en esa cara.

Álex coge la botella. Decepcionado y encantado al mismo tiempo, como solo él.` : `
Nora se quita la camiseta. Por la cabeza. Despacio. Sin nada debajo, como todos sabían y nadie había dicho.

Y se queda así. Con el colgante de luna en medio del pecho y la piel de gallina y la barbilla alta. Mirándote a ti. Solo a ti.

Nora: Prenda.

No se tapa. No se cruza de brazos. Deja que la mires. Deja que la miren. Y te das cuenta de que Marcos no la está mirando a ella, te está mirando a ti mirarla.

Se levanta y vuelve a su silla, y se sienta al lado de Marcos, y Marcos le pone la camisa de cuadros por los hombros sin decir nada, y ella no se la abrocha. Se la deja abierta. Con el pecho entre las dos mitades de la camisa de él.

Álex no ha parpadeado. Tú tampoco.

~ La nueva sabe jugar. Joder si sabe. Y tiene más de lo que parecía debajo de esa camiseta. Y lo sabe llevar. Eso es lo que más me jode.

Álex coge la botella. La lanza sin mirar. No puede mirar otra cosa.`;
        return `${inicio}

Gira. Gira. Se frena.

Te señala a ti.

Álex se ríe. Con toda la boca. Como si la botella fuera suya. Que lo es.

Álex: Irene.

Irene: Dime.

Álex: Ven.

Sabes lo que va a pedir antes de que lo diga. Se lo ves en la manera de echarse hacia atrás en la silla, con la camisa abierta y las piernas abiertas y la mano ya en el cinturón. Y en cómo te mira: no a los ojos. A la boca.

Álex: Aquí. Ahora. Con ellos delante.

Marcos: Álex, joder.

Álex: Puede comerse una seta.

Nora no dice nada. Está pálida, o roja, no lo sabes con la luz. Tiene la mano de Marcos entre las suyas.

${intox === "alto" ? "~ Todo va despacio. Álex habla despacio. La hebilla suena despacio. Me gusta. Me gusta que vaya despacio.\n\n" : intox === "medio" ? "~ Tengo calor. Tengo mucho calor y el top no ayuda y el short no ayuda y Álex mirándome así no ayuda nada.\n\n" : ""}~ Lo ha hecho otras veces. En sitios peores. Con gente peor. Y le gusta que me lo pida así, y me gusta que le guste. Y me gusta lo que le pasa en la cara cuando lo hago.

~ Pero hoy están ellos. Está ella. Y está él, mirando la chimenea como si la chimenea fuera a salvarle.

~ Y si lo hago, Marcos va a tener que decidir hacia dónde mira. Y sea lo que sea, me lo voy a quedar.

Álex termina de soltarse el cinturón. No se baja nada. Espera. Es lo único que Álex sabe esperar. Le brillan los ojos como a un niño delante de un regalo que ya sabe lo que es.`;
      },
      opciones: [
        { texto: "Hacerlo. Arrodillarte entre sus piernas sin quitarle la vista a Marcos.", a: "d3_pregunta",
          efecto: (api) => { api.marcar("b4", "prueba"); api.rel("alex", "irene", "afecto", 10); api.rel("alex", "irene", "tension", 10); api.rel("irene", "marcos", "tension", 10); api.rel("marcos", "irene", "tension", 8); api.rel("marcos", "alex", "resentimiento", 10); api.rel("nora", "irene", "resentimiento", 10); api.rel("nora", "alex", "resentimiento", 10); api.est("irene", "eje", 8); api.est("alex", "eje", 10); api.est("nora", "estres", 15); api.est("marcos", "estres", 15); api.est("marcos", "eje", -5); api.saber("nora", "irene_alex_publico"); } },
        { texto: "Seta. Comértela de la boca de Álex, que es casi lo mismo.", a: "d3_pregunta",
          efecto: (api) => { api.marcar("b4", "seta"); api.consumir("irene", "seta"); api.rel("alex", "irene", "afecto", 4); api.rel("alex", "irene", "resentimiento", 5); api.est("alex", "eje", -3); } },
        { texto: "Prenda. Los shorts. Al suelo. Y quedarte así el resto de la noche.", a: "d3_pregunta",
          efecto: (api) => { api.marcar("b4", "prenda"); api.est("irene", "eje", 5); api.rel("alex", "irene", "tension", 8); api.rel("marcos", "irene", "tension", 8); api.rel("nora", "irene", "resentimiento", 6); api.est("nora", "estres", 6); api.est("marcos", "estres", 8); } },
      ],
    },

    // =====================================================================
    // EL PÓKER — prendas, y en la última mano, el ganador manda.
    // =====================================================================

    p_r1: {
      musica: "fiesta_seven",
      pov: "irene",
      titulo: "Póker · Primera parte",
      texto: (api) => `
Repartes.

Lo haces bien. Rápido, sin mirar las cartas, con el pulgar. Lo has hecho muchas veces, en muchas mesas, con mucha gente que ya no ves.

Álex: Reglas.

Irene: Las digo yo. Quien pierde, prenda. Quien pierde sin nada en la mano, prenda doble. Y cuando alguien se quede sin prendas, la mesa decide qué hace.

Marcos: ¿La mesa?

Irene: El que gane esa mano.

Álex: Me encanta. Me encanta esta mujer.

Te lo dice al oído, con la mano en tu muslo, y te muerde el lóbulo al terminar la frase. Le dejas. Repartes sin que te tiemble el pulso.

Nora: ¿Y las setas?

Irene: Las setas son para el que quiera quedarse vestido. Un trozo, te libras de una prenda. Tú, un porro y un chupito.

Nora: Vale.

Lo dice rápido. Como si ya lo hubiera decidido antes de que lo dijeras.

Primera mano. Marcos pierde con una pareja de cuatros. Se quita la camisa de cuadros con la dignidad de quien ha perdido un reino. La cuelga del respaldo. Se queda en camiseta negra, y la camiseta negra le queda como tú recuerdas que le quedaba.

Segunda. Pierde Álex. Se levanta, se quita la camisa estampada directamente, que ya estaba abierta y no tapaba nada, y la tira sobre la de Marcos. Se sienta. Se estira. Los collares le caen por el pecho y se le enganchan en el vello. Sabe que se le está mirando. Nora también le mira. Un segundo. Lo suficiente. Se lo apuntas.

Tercera. Nora gana. Con un trío. Sin celebrar. Recoge las fichas, que son patatas, y se las come una a una, chupándose el dedo después. No sabes si lo hace a propósito. Con ella empiezas a no saber.

~ Juega mejor de lo que esperaba.

~ Eso me molesta un poco. Y me interesa un poco. Las dos cosas.

Cuarta. Ganas tú. Quinta. Ganas tú. Marcos se queda sin calcetines y sin cinturón. Álex sin cinturón y sin pantalones, en calzoncillos negros, con las piernas abiertas y la mano de Marcos en el hombro diciéndole «tápate» y él diciendo «jamás». Y no hace falta que se tape. Se le ve lo que se le ve. A Álex nunca le ha importado.

Sexta. Pierde Nora. Por fin.

Se quita la camisa de Marcos. Por los hombros, despacio, sin mirar a nadie. La deja en el respaldo. Debajo, la camiseta holgada. Y debajo de la camiseta, nada, y ahora que no hay camisa se nota en cada movimiento, en cada respiración, en cómo cae la tela y en dónde se marca. Álex silba. Marcos le pega en el brazo. Nora ni se inmuta. Te mira a ti. Como diciendo «tu turno».

Nora: Siguiente.

Séptima. Pierdes tú.

Te levantas. Te llevas las manos al top. El primer botón. Lo sueltas mirando a Álex. El segundo, el que aguanta, lo dejas. Te sientas. El top se abre lo que le da la gana, que es bastante. Te echas hacia delante sobre la mesa a coger las cartas, y se abre un poco más.

Álex: Eso no es una prenda.

Irene: Es una promesa.

Marcos mira las cartas con mucha atención. Demasiada. Tiene la mandíbula apretada. Te encanta esa mandíbula.

Octava. Repartes. Miras la mesa por encima de las cartas: Álex en calzoncillos, Marcos descalzo y mirando al vacío, Nora en camiseta con las manos frías, y tú con un botón menos.

${api.nivel("irene", "intox") === "alto" ? "Las cartas pesan. Las notas pesar. Y los colores de los palos son más rojos que nunca. Y la piel de Marcos tiene un brillo que no tenía.\n\n" : ""}Y pierde Marcos. Sin nada. Prenda doble.

Marcos: Camiseta.

Álex: Y otra.

Marcos: No hay otra.

Álex: Hay pantalón.

Marcos te mira a ti, que eres la banca. Esperando que digas algo. Que le salves o que le hundas. Y a ti te gusta que te mire así. Pidiendo.`,
      opciones: [
        { texto: "«Pantalón. Son las reglas.» Y mirarle mientras se lo quita.", a: "p_r2",
          efecto: (api) => { api.marcar("p1", "pantalon"); api.rel("irene", "marcos", "tension", 10); api.rel("marcos", "irene", "resentimiento", 5); api.rel("nora", "irene", "resentimiento", 8); api.est("marcos", "estres", 8); } },
        { texto: "«Camiseta y una seta. Te la doy yo.» Ponérsela en los labios.", a: "p_r2",
          efecto: (api) => { api.marcar("p1", "seta"); api.consumir("marcos", "seta"); api.rel("irene", "marcos", "tension", 12); api.rel("nora", "marcos", "confianza", -8); api.rel("nora", "irene", "resentimiento", 12); api.rel("alex", "marcos", "afecto", 4); } },
        { texto: "«Camiseta. Y Nora te quita la siguiente cuando pierdas.» Dejarle la puerta abierta.", a: "p_r2",
          efecto: (api) => { api.marcar("p1", "nora"); api.rel("nora", "irene", "resentimiento", -3); api.rel("marcos", "irene", "afecto", 3); api.rel("nora", "marcos", "afecto", 4); } },
        { texto: "«Camiseta. Y el pantalón te lo perdono por un porro.» Liarlo tú, fumar la primera calada, y pasárselo.", a: "p_r2",
          efecto: (api) => { api.marcar("p1", "porro"); api.consumir("irene", "porro"); api.consumir("marcos", "porro"); api.rel("irene", "marcos", "tension", 6); api.rel("marcos", "irene", "afecto", 3); api.rel("nora", "irene", "resentimiento", 4); } },
      ],
    },

    p_r2: {
      pov: "nora",
      titulo: "Póker · Segunda parte",
      texto: (api) => {
        const p1 = api.bandera("p1");
        const inicio = p1 === "porro" ? `
Irene lía. Rápido, con la lengua fuera, sin mirar el papel. Marcos se quita la camiseta mientras tanto y se queda con el pecho desnudo y los codos en la mesa, esperando.

Irene enciende. Le da la primera calada con los ojos cerrados. Suelta el humo hacia Marcos, despacio, y se lo pasa con dos dedos, rozándole los suyos.

Irene: Perdonado.

Marcos: Gracias.

Fuma. Le brillan los ojos al segundo tirón. Se lo pasa a Álex. Álex te lo pasa a ti. No lo coges.

~ Le ha perdonado el pantalón. Como si el pantalón fuera de ella.

Irene ha visto que no lo cogías. Ha sonreído.` : p1 === "pantalon" ? `
Marcos se levanta. Se quita la camiseta por la cabeza. Se desabrocha el pantalón mirando a Irene. No a ti. A Irene. Se lo baja. Se lo quita por los pies, con los calcetines ya fuera, y se queda en calzoncillos grises delante de la mesa, delante de ella, que no ha dejado de mirar, que le ha recorrido entero de arriba abajo sin ninguna vergüenza y se ha quedado donde se ha quedado.

Irene: Gracias.

Marcos: De nada.

Se sienta. Tú le pones la mano en el muslo desnudo, por debajo de la mesa. Está frío. Le aprietas. Él te cubre la mano con la suya y te la sube, por la parte de dentro, hasta donde el calzoncillo, y la deja ahí, y no te mira, mira las cartas, y notas contra la mano lo que le ha hecho que Irene le mire así. O tú. No lo sabes. Y no sabes cuál de las dos respuestas prefieres.

Irene ha visto la mano. Irene ve todo.` : p1 === "seta" ? `
Irene rodea la mesa con un trozo de seta entre los dedos. Con el top abierto. Descalza. Con ese paso.

Se para delante de Marcos. Se inclina, y el top se abre más, a un palmo de la cara de él. Se lo pone en los labios, como se le da de comer a alguien que no puede usar las manos, y espera a que abra la boca.

Marcos la abre.

Irene le mete el trozo con el dedo. Le deja el dedo dentro un segundo más. Le roza el labio de abajo al sacarlo, y luego se lleva ese mismo dedo a su propia boca. Vuelve a su silla.

Álex: Eso ha sido lo más sucio que he visto hoy y llevo sin pantalones desde la quinta mano.

Marcos mastica. Traga. Te mira. Tú no le miras.

~ Se la ha comido de la mano de ella. Delante de mí. Y ha abierto la boca sin que se lo pidieran dos veces.

~ Y yo tengo la mano en su muslo y no la he quitado. Porque es mío. Aunque abra la boca.` : `
Irene: Camiseta. Y Nora te quita la siguiente.

Marcos se quita la camiseta. Se sienta con el pecho desnudo. Tú le pones la mano en la espalda, en la parte baja, donde sabes que le da escalofríos. Le da. Se le eriza la piel bajo tus dedos y se le escapa el aire. Irene lo oye.

Irene ha visto la mano. Ha sonreído. De una manera que no entiendes del todo. Como si te hubiera dejado ganar algo que no era suyo.`;
        return `${inicio}

Novena mano.

Pierdes tú. Sin nada. Prenda doble.

Te quedas quieta. Tienes la camiseta y el pantalón. Y lo de debajo del pantalón. Y ya está.

Álex: Doble.

Nora: Ya.

Álex: ¿O un porro y un chupito por cada una?

Irene: Eso son dos porros y dos chupitos.

Nora: Ya sé sumar.

Marcos: Puede quitarse una y beber por la otra.

Álex: Puede. Pero no ha ganado Marcos. He ganado yo.

Te mira. Con las piernas abiertas, en calzoncillos, con la cerveza en la mano y los collares. Te mira como te ha mirado toda la noche, sin disimular, de arriba abajo, parándose donde se para.

Álex: Y el que gana decide. La camiseta. Y la otra prenda la elijo yo: te sientas en las rodillas de Marcos, de espaldas a él, y le dejas que te quite el cinturón y el pantalón. Él. Con las manos. Despacio. Y te quedas así. Y yo miro.

Marcos: Álex.

Álex: O fuma y bebe. Doble.

Irene no dice nada. Se ha inclinado hacia delante, con los codos en la mesa, y el top se le ha abierto hasta el último botón, y no se lo ha arreglado. Te mira como se mira una carta que aún no se ha dado la vuelta.

~ Me está pidiendo que me desnude. No él. Marcos. Delante de ellos. Y sabe que si digo que no, Irene gana algo. Y si digo que sí, Irene gana otra cosa.

~ Y Marcos me está mirando como si quisiera que dijera que sí. O como si quisiera que no. Con Marcos hoy no lo sé.

~ Y tengo calor. Y no es la chimenea.

${api.nivel("nora", "intox") !== "bajo" ? "~ Y tengo la cabeza como si estuviera dentro de una campana. Todo llega un poco tarde. Todo llega un poco bien.\n\n" : ""}Te llevas las manos al borde de la camiseta.`;
      },
      opciones: [
        { texto: "Hacerlo. Las dos cosas. Camiseta fuera, y sentarte en Marcos de espaldas, y dejar que sea él.", a: "p_r3",
          efecto: (api) => { api.marcar("p2", "prueba"); api.rel("nora", "marcos", "afecto", 12); api.rel("nora", "marcos", "confianza", 6); api.rel("marcos", "nora", "afecto", 10); api.rel("marcos", "nora", "proteccion", 8); api.rel("alex", "nora", "tension", 15); api.rel("irene", "nora", "resentimiento", 12); api.rel("irene", "marcos", "celos", 12); api.est("nora", "eje", 4); api.est("nora", "estres", 12); api.est("irene", "estres", 10); api.est("alex", "eje", 6); } },
        { texto: "Camiseta fuera. Y por el pantalón, porro y chupito. «El cinturón me lo quita él cuando yo diga.»", a: "p_r3",
          efecto: (api) => { api.marcar("p2", "mitad"); api.consumir("nora", "porro"); api.consumir("nora", "chupito"); api.rel("nora", "marcos", "afecto", 6); api.rel("alex", "nora", "tension", 12); api.rel("irene", "nora", "resentimiento", 5); api.est("nora", "estres", 6); } },
        { texto: "Dos porros y dos chupitos. Seguidos. Sin dejar de mirar a Álex.", a: "p_r3",
          efecto: (api) => { api.marcar("p2", "fumar"); api.consumir("nora", "porro"); api.consumir("nora", "porro"); api.consumir("nora", "chupito"); api.consumir("nora", "chupito"); api.rel("alex", "nora", "resentimiento", 4); api.rel("nora", "alex", "resentimiento", 8); api.rel("irene", "nora", "resentimiento", 4); api.rel("marcos", "nora", "proteccion", 5); } },
      ],
    },

    p_r3: {
      pov: "marcos",
      titulo: "Póker · Última mano",
      texto: (api) => {
        const p2 = api.bandera("p2");
        const intox = api.nivel("marcos", "intox");
        const inicio = p2 === "prueba" ? `
Nora se quita la camiseta por la cabeza. Sin prisa. Sin mirar a nadie. Sin nada debajo, como todos sabían y nadie había dicho. El colgante de luna en medio del pecho. La piel erizada.

Se levanta. Rodea tu silla. Se sienta en tus rodillas de espaldas a ti, con la espalda desnuda contra tu pecho desnudo, y te coge las manos y te las pone en su cintura. Y luego más arriba. Y luego las baja otra vez a la cintura, como diciendo «ahora no, luego».

Nora: Cuando quieras.

Y tú.

Buscas la hebilla del cinturón. La sueltas. El cuero se abre. El botón. La cremallera. La bajas con dos dedos, despacio, porque te lo han pedido despacio y porque quieres, y con cada diente notas cómo Nora contiene el aire. Nora levanta las caderas un poco, lo justo, y tú le bajas el pantalón por los muslos, por las rodillas, rozándola entera con los nudillos al bajar, y cae al suelo con un sonido de tela y hebilla.

Nora se queda así. Sentada en ti. Solo con lo de debajo. Con tus manos en la cintura y su pelo en tu cara y su espalda subiendo y bajando contra tu pecho. Se echa hacia atrás. Apoya la cabeza en tu hombro. Gira la cara hacia tu cuello y te respira ahí.

No la ves. La sientes. Y sientes cómo respira. Y cómo se le eriza la piel donde la tocas. Y sientes lo que ella siente contra ella, porque no hay manera de que no lo sienta, y ella mueve las caderas un centímetro, uno, y te mira de reojo, y sabes que lo ha hecho a propósito.

${intox !== "bajo" ? "Y la piel de ella brilla. No es la luz. Es la seta. O es ella. Ya no sé dónde acaba una cosa y empieza la otra.\n\n" : ""}Irene no dice nada. Irene mira. Y por primera vez en la noche, Irene mira con la boca un poco abierta. Álex tampoco dice nada, y eso sí que no había pasado nunca.

~ Es mía. Y lo está diciendo con el cuerpo entero. Y ellos lo están viendo, y de repente me da exactamente igual lo que vean. Que lo vean. Que lo vean todo.

Nora se queda. No se levanta. Se echa hacia atrás contra ti y coge las cartas.

Nora: Última mano.` : p2 === "mitad" ? `
Nora se quita la camiseta por la cabeza. Sin prisa. Sin mirar a nadie. Sin nada debajo. Se queda con el pantalón negro y el cinturón y el colgante, con la piel de gallina y la barbilla alta.

Coge el porro de Álex. Le da tres caladas, con los ojos cerrados, con el pecho subiendo con cada una. Se bebe el chupito. Se limpia la boca con el dorso de la mano.

Nora: El cinturón me lo quita él cuando yo diga.

Y vuelve a sentarse. A tu lado. Con la pierna contra la tuya. Con el pecho fuera y sin taparse. Se te queda mirando y luego te coge la mano y te la pone en su rodilla, y la sube, y la deja donde la deja. Delante de todos.

Álex: Eso es hacer trampas.

Nora: Eso es saber jugar.

Irene se ríe. Una risa corta y de verdad. Puede que la primera de verdad hacia Nora en toda la noche. O puede que no.

~ Ha dicho «él». Ha dicho «cuando yo diga». Ha dicho que soy suyo delante de Irene con dos frases y una mano. Y yo no he abierto la boca.` : `
Nora coge los dos porros que Álex lía en un minuto, uno detrás de otro. Se los fuma mirándole. Sin toser. Se bebe los dos chupitos. Deja los vasos boca abajo.

Nora: Ya.

Le brillan los ojos. Se le ha ido la voz un poco a otro sitio. Te coge la mano por debajo de la mesa y te la aprieta muy fuerte, y no la suelta. Se ríe de algo que nadie ha dicho. Te apoya la frente en el hombro y te dice, muy bajo, que quiere irse a la cama contigo ahora mismo, y que no es para dormir. Lo dice con los labios pegados a tu piel.

Álex: Qué aburrida.

Nora: Qué sobria estás tú.

Irene: Sobria no está.

Nora: Vestida sí.

~ No se ha quitado nada. Y ha ganado igual. Y yo no he abierto la boca. Y tengo que abrirla ahora o dejar de respirar.`;
        return `${inicio}

Reparte Irene. Última mano. Lo dice ella, porque las manos son suyas.

Irene: Última. Y el que gane pide lo que quiera. A quien quiera. Sin setas, sin prendas, sin nada.

Álex: Eso es nuevo.

Irene: Es la última mano.

Miras tus cartas. Una pareja de reinas. No es nada y es algo.

Álex se retira el primero. Nora se retira la segunda, mirándote, con cara de «tú sabrás».

Quedáis Irene y tú.

Irene te mira por encima de las cartas. Tiene el top abierto hasta el último botón y la luz de la lámpara encima y no se lo ha arreglado en toda la mano. Y no va a arreglárselo. Te mira como te miraba en el sofá. Con esa paciencia. Con esa manera de esperar que es una manera de empujar.

Irene: ¿Vas?

Marcos: Voy.

Ella baja las cartas. Trío de sietes.

Tú bajas las tuyas.

Irene: Gano.

Se echa hacia atrás en la silla. Se toma su tiempo. Le encanta tomarse su tiempo. Cruza las piernas, despacio, y el short hace lo que hace.

Irene: Marcos.

Marcos: Dime.

Irene: Ven aquí y bésame. Como me besabas en el sofá de Rubén cuando no me besabas.

...

Álex: ¡Hostia!

Nora no dice nada. Tenía la mano en tu muslo. La ha quitado.

Irene: Es la última mano. Y no hay setas.

~ Nunca la besé. Nunca. Y ella lo sabe, y lo ha dicho como si sí. Delante de Nora. Delante de Álex. Y ahora tengo que decidir si es verdad o si es mentira con la boca.

~ Y lo peor es que sé exactamente cómo sería. Lo he sabido cinco años.

${intox !== "bajo" ? "~ Y la boca de Irene se mueve antes de que hable. Y después. Como si hubiera dos. Como si siempre hubiera habido dos.\n\n" : ""}Álex ha dejado de reírse. Te mira. Con la cerveza a medio camino.`;
      },
      opciones: [
        { texto: "Hacerlo. Levantarte, ir hasta ella, y besarla. Corto. Cerrado. Como se paga una deuda.", a: "d3_pregunta",
          efecto: (api) => { api.marcar("p3", "beso"); api.rel("irene", "marcos", "tension", 15); api.rel("irene", "marcos", "afecto", 8); api.rel("marcos", "irene", "tension", 10); api.rel("nora", "marcos", "confianza", -15); api.rel("nora", "marcos", "resentimiento", 12); api.rel("nora", "irene", "resentimiento", 15); api.rel("alex", "marcos", "celos", 12); api.rel("alex", "marcos", "resentimiento", 8); api.est("marcos", "estres", 15); api.est("marcos", "eje", -8); api.est("nora", "estres", 15); api.saber("nora", "beso_marcos_irene"); api.saber("alex", "beso_marcos_irene"); } },
        { texto: "Hacerlo. Pero besarla de verdad. Con la mano en la nuca. Que sepa lo que no pasó.", a: "d3_pregunta",
          efecto: (api) => { api.marcar("p3", "beso_fuerte"); api.rel("irene", "marcos", "tension", 25); api.rel("irene", "marcos", "afecto", 15); api.rel("marcos", "irene", "tension", 18); api.rel("nora", "marcos", "confianza", -25); api.rel("nora", "marcos", "resentimiento", 20); api.rel("nora", "irene", "resentimiento", 20); api.rel("alex", "marcos", "celos", 20); api.rel("alex", "marcos", "resentimiento", 15); api.rel("alex", "irene", "resentimiento", 10); api.est("marcos", "estres", 20); api.est("marcos", "eje", -12); api.est("nora", "estres", 25); api.est("nora", "miedo", 5); api.est("alex", "eje", -8); api.saber("nora", "beso_marcos_irene"); api.saber("alex", "beso_marcos_irene"); } },
        { texto: "No. «Has ganado la mano. No has ganado eso.» Y besar a Nora.", a: "d3_pregunta",
          efecto: (api) => { api.marcar("p3", "no"); api.rel("nora", "marcos", "confianza", 15); api.rel("nora", "marcos", "afecto", 12); api.rel("irene", "marcos", "resentimiento", 20); api.rel("irene", "nora", "resentimiento", 15); api.rel("irene", "marcos", "celos", 10); api.rel("alex", "marcos", "afecto", 5); api.est("marcos", "eje", 6); api.est("irene", "estres", 12); api.est("irene", "eje", -5); } },
        { texto: "Beber. «Un chupito por cada año que llevas esperando eso. Cinco.» Y bebértelos seguidos, mirándola.", a: "d3_pregunta",
          efecto: (api) => { api.marcar("p3", "beber"); api.consumir("marcos", "chupito"); api.consumir("marcos", "chupito"); api.consumir("marcos", "chupito"); api.rel("irene", "marcos", "tension", 8); api.rel("irene", "marcos", "resentimiento", 8); api.rel("nora", "marcos", "confianza", 4); api.rel("alex", "marcos", "afecto", 6); api.est("marcos", "eje", 2); api.est("marcos", "estres", 6); } },
      ],
    },

    // =====================================================================
    // BLOQUE D3 — PREGUNTAS QUE NO HARÍAS SOBRIO
    // =====================================================================

    d3_pregunta: {
      musica: "fiesta_southbound",
      pov: "irene",
      titulo: "Preguntas que no harías sobrio",
      consumo: (api) => api.bandera("b4") === "prueba" ? [["irene", "cerveza"], ["alex", "cerveza"]] : [["alex", "cerveza"]],
      texto: (api) => {
        const juego = api.bandera("juego");
        const intox = api.nivel("irene", "intox");
        let inicio = "";
        if (juego === "botella") {
          const b4 = api.bandera("b4");
          inicio = b4 === "prueba" ? `
Lo has hecho.

Te has arrodillado entre sus piernas, en la alfombra, con la mesa a la altura de la cara, y no le has quitado la vista a Marcos ni un segundo. Ni cuando Álex te ha puesto la mano en la nuca. Ni cuando ha empezado a respirar por la boca. Ni cuando ha dicho tu nombre como se dice en la cama.

Marcos ha mirado la chimenea. Ha mirado la mesa. Ha mirado a Nora. Y al final te ha mirado a ti, porque no había otro sitio donde mirar, y le has sostenido la mirada desde abajo con la boca ocupada y los ojos abiertos.

Nora no ha apartado la vista. Eso te ha sorprendido. Ha mirado como se mira un accidente. O como se mira a alguien aprender algo.

Cuando has terminado, Álex ha dicho «joder» tres veces y se ha subido el pantalón sin cinturón. Tú te has sentado en su silla, con él, con los labios hinchados, y te has bebido su cerveza.

Nadie ha hablado durante un rato.` : b4 === "seta" ? `
Álex se ha puesto la seta entre los dientes. Tú se la has quitado con la boca. Despacio. Con ruido. Con la mano en su cuello. Con la otra mano en el cinturón suelto, sin bajar nada, solo para que lo sintiera.

Álex: Tramposa.

Irene: Otra noche.

Álex: Me lo apunto.

Te lo apunta. Lo sabes. Álex se lo apunta todo.

Marcos ha soltado el aire. Nora le ha soltado la mano.` : `
Te has levantado. Te has desabrochado los shorts. Te los has bajado por las piernas, despacio, y los has apartado con el pie.

Y te has sentado otra vez. Con las piernas cruzadas. Con el top abierto y lo de abajo y nada más.

Irene: Prenda.

Álex: Eso no es una prenda. Eso es un estado.

Irene: Es lo que hay.

Marcos ha mirado. No ha podido no mirar. Y luego ha mirado a Nora, y Nora estaba mirándole a él mirarte a ti.

Así vas a estar el resto de la noche. Para que se acostumbren.`;
        } else {
          const p3 = api.bandera("p3");
          inicio = p3 === "beber" ? `
Marcos no se ha levantado.

Marcos: Un chupito por cada año que llevas esperando eso.

Ha cogido la botella. Ha llenado cinco vasos, los que había, y se los ha bebido uno detrás de otro, sin dejar de mirarte, sin que se le moviera la cara. Ha dejado el último boca abajo.

Marcos: Cinco.

Álex ha aplaudido. Álex adora esto. Nora ha puesto la mano en la espalda de Marcos y la ha dejado ahí.

Tú has sonreído. Por fuera.

~ Cinco. Ha dicho cinco. Ha contado los años delante de ella. Y ha preferido cinco chupitos a un beso. Las dos cosas se apuntan.` : p3 === "beso_fuerte" ? `
Marcos se ha levantado.

Ha rodeado la mesa. Te ha cogido por la nuca, con los dedos dentro del pelo, y te ha besado como no te besó nunca en el sofá de Rubén. Con la boca abierta. Con la mano cerrada. Como si llevara cinco años queriendo cobrárselo.

Has tardado en abrir los ojos. Cuando lo has hecho, él ya estaba sentado otra vez, mirando la mesa, y Nora estaba de pie, con la camisa de Marcos puesta otra vez y abrochada hasta arriba.

Nora: Voy a por hielo.

No ha mirado a nadie. Álex tampoco. Álex tenía la cerveza en la mano y no bebía.

Te has pasado la lengua por el labio. Todavía sabe a él.

~ Ya está. Ya sé lo que sabe. Y ellos también.` : p3 === "beso" ? `
Marcos se ha levantado.

Ha rodeado la mesa. Se ha inclinado. Te ha besado en la boca, cerrada, corto, como se firma un papel.

Marcos: Pagado.

Y se ha sentado. Nora tenía la mano en la mesa, abierta, y la ha cerrado. Se ha puesto la camisa de Marcos otra vez. Se la ha abrochado.

Álex se ha reído demasiado tarde.

~ Corto. Cerrado. Con testigos. Ha sido peor que si no lo hubiera hecho. Y mejor.` : `
Marcos no se ha levantado.

Marcos: Has ganado la mano. No has ganado eso.

Se ha girado hacia Nora y la ha besado. Con la mano en la cara. Con los ojos cerrados. Delante de ti, que habías pedido otra cosa.

Nora ha sonreído contra su boca. Tú has recogido las cartas.

Irene: Vale.

Álex te ha puesto la mano en el muslo. Se la has quitado.

~ Vale. Vale. Esto también se apunta.`;
        }
        const alex = api.nivel("alex", "intox");
        return `${inicio}

Poco a poco, la ropa vuelve. No toda.

${juego === "poker" ? "Álex se sube el pantalón sin abrochárselo y recupera la camisa del respaldo. Se la pone sin abrochar. Nunca la abrocha. Marcos se pone la camiseta y lo demás sin mirar a nadie, con la cara de quien recoge después de una pelea." : "Álex se abrocha el cinturón, o lo intenta, y se deja la camisa como está. Marcos recupera la camiseta de donde haya caído."} Nora se pone la camisa de Marcos encima de lo que le queda${api.bandera("b3") === "prenda" || api.bandera("p2") === "prueba" || api.bandera("p2") === "mitad" ? ", que es nada, y se la abrocha a medias" : ""}. Tú te abrochas lo que se puede abrochar.

Álex se deja caer en la silla. Estira los brazos por encima de la cabeza. Se le marcan las costillas y los collares le bailan. Te coge por la cintura y te sienta en su regazo otra vez, de lado, y te acomoda con la mano en la parte de atrás del muslo, por dentro. ${api.bandera("b4") === "prenda" ? "No hay short que apartar." : "Por dentro del short, hasta donde llega."}

${intox === "alto" ? "Te ríes de algo. No sabes de qué. Álex te pregunta de qué y no sabes decírselo y te ríes más.\n\n" : ""}Álex: Vale. Nivel dos.

Marcos: No hay nivel dos.

Álex: Preguntas que no harías sobrio.

Marcos: Yo estoy sobrio.

Álex: Mentira. Y aunque fuera verdad, no por mucho tiempo.

${alex === "alto" ? "Se le traba un poco la lengua en «verdad». No se da cuenta. Tú sí.\n\n" : ""}Mira alrededor de la mesa. Despacio. Como un tiburón eligiendo. Le encanta este momento. Le encanta que le miren elegir.

Álex: Nora. ¿Cuántos antes de Marcos?

Nora: Los que hagan falta.

Álex: Eso no es un número.

Nora: Es una respuesta.

Álex: Marcos. ¿Cuántas antes de Nora?

Marcos: Cállate.

Álex: Ese sí es un número.

Irene: Yo cuento por dos.

Lo has dicho tú. Sin pensar. Y Marcos ha mirado la mesa, y Álex se ha reído, y Nora ha girado la cabeza hacia ti muy despacio.

Y entonces Álex te elige a ti.

Cómo no.

Álex: Irene.

Irene: Qué.

Álex: ¿Con quién de esta mesa te acostarías si yo no estuviera?

...

Marcos: Yo voto por acabar la partida antes de que alguien duerma en el sofá.

Nadie se ríe del todo.

Nora no dice nada. Te mira. Marcos también te mira, pero fingiendo que mira la botella. Álex tiene la mano donde la tiene y sonríe con toda la boca.

Le encanta. No tiene ni idea de lo que acaba de hacer.

O sí. Y le da igual. O sí, y quiere saberlo.

~ Puedo decir la verdad. Puedo hacer un chiste. O puedo devolvérsela. Y cualquiera de las tres va a quedarse en esta mesa toda la noche.`;
      },
      opciones: [
        { texto: "La verdad. Riéndote. «Marcos. Obvio. Ya lo sabes.»", a: "e1_crack",
          efecto: (api) => { api.rel("irene", "marcos", "tension", 10); api.rel("nora", "irene", "resentimiento", 8); api.rel("alex", "marcos", "celos", 8); api.saber("nora", "irene_quiere_a_marcos"); api.saber("alex", "irene_dijo_marcos"); api.marcar("d8", "honesta"); } },
        { texto: "Un chiste. «Con la bruja. Dicen que sabe hacer cosas con la lengua.»", a: "e1_crack",
          efecto: (api) => { api.est("irene", "eje", 2); api.marcar("d8", "broma"); } },
        { texto: "Devolvérsela. «¿Y tú? Dilo tú primero. Y no vale decir Nora, que llevas toda la noche.»", a: "e1_crack",
          efecto: (api) => { api.rel("alex", "nora", "tension", 8); api.rel("marcos", "alex", "resentimiento", 6); api.rel("nora", "alex", "resentimiento", 4); api.marcar("d8", "alex"); } },
      ],
    },

    // =====================================================================
    // BLOQUE E — PRIMERA GRIETA
    // =====================================================================

    e1_crack: {
      pov: "nora",
      titulo: "Preguntas que no harías sobrio",
      consumo: [["alex", "cerveza"], ["marcos", "cerveza"], ["irene", "cerveza"]],
      texto: (api) => {
        const d8 = api.bandera("d8");
        const intox = api.nivel("nora", "intox");
        const inicio = d8 === "honesta" ? `
«Marcos. Obvio. Ya lo sabes.»

Lo ha dicho riéndose. Todo el mundo se ha reído. Álex el que más, con la cabeza hacia atrás, dando palmadas en el muslo de Irene, y luego ha dicho «lo sabía» y le ha mordido el hombro, y ella ha chillado, y ha sido todo muy divertido.

Marcos ha dicho «gracias» con una voz que no era la suya.

Álex ha mirado a Marcos por encima del hombro de Irene. Un segundo. Sin sonreír. Luego sí.

Tú te has levantado a por hielo.

No hacía falta hielo.` : d8 === "alex" ? `
«Y no vale decir Nora, que llevas toda la noche.»

Álex se ha quedado un segundo sin respuesta. Eso no pasa casi nunca. Ha sido bonito.

Luego ha dicho:

Álex: Nora, obviamente. Es la única que no me ha visto vomitar. Y no lleva sujetador.

Marcos no se ha reído. Tú tampoco. Irene sí, y le ha cogido la cara a Álex y se la ha girado hacia ella, y le ha dicho «mírame a mí» y él la ha mirado. Con la mano de ella en la mandíbula. Como se sujeta a un animal.

Te has levantado a por hielo. No hacía falta hielo.` : `
«Con la bruja. Dicen que sabe hacer cosas con la lengua.»

Álex ha dicho que eso es hacer trampa. Marcos ha dicho que es la mejor respuesta de la noche. Irene ha hecho una reverencia sentada, en las rodillas de Álex, y él ha aprovechado para meterle la mano donde ha podido, y ella se ha dejado.

El momento ha pasado. Irene lo ha manejado. Como siempre.

Te has levantado a por hielo. Porque sí. Porque necesitabas ver otra habitación.`;
        return `${inicio}

En la cocina la luz es más blanca. Abres el congelador. Está lleno de escarcha y de una bolsa de guisantes de alguien que ya no vive aquí. El hielo está pegado. Lo golpeas contra la encimera.

${intox !== "bajo" ? "El golpe suena dos veces. Una en la encimera y otra dentro de tu cabeza, un poco después. Te apoyas. La cocina se queda quieta. Bien.\n\n" : ""}Desde el salón:

Álex: ¡Otra ronda!

Marcos: ¡Devuélveme el calcetín!

Irene se ríe. Esa risa. Y luego un silencio corto que sabes exactamente qué es. Es Álex besándola. Es Irene dejándose.

~ Llevan cinco años así. Marcos dice que llevan cinco años así. Marcos estaba cuando empezaron. Marcos estaba en todo.

Vuelves con la cubitera. La dejas en la mesa. Nadie la mira. Irene ya no está en las rodillas de Álex. Está en su silla, ${api.bandera("b4") === "prenda" ? "sin shorts, con las piernas cruzadas como si nada," : api.bandera("b1") === "prenda" || api.bandera("juego") === "poker" ? "con el top abierto y sin ninguna intención de cerrarlo," : "con el top abrochado hasta el botón que aguanta,"} y tiene la mano en la nuca de Álex y le acaricia el pelo mientras habla con Marcos, y no sabes con cuál de los dos está hablando en realidad.

Te sientas. Marcos te pasa el brazo por los hombros, por encima de la camisa, y te acerca. Huele a él y a lo que ha bebido. Apoyas la cabeza. Irene mira el brazo.

CRACK.

Arriba.

Un chasquido seco. De madera. Como una tabla que cede bajo un peso y vuelve a su sitio.

Todos os calláis. Un segundo entero.

Marcos mira el techo. Irene mira a Álex. Álex mira el techo con la boca abierta en una sonrisa que aún no ha terminado de hacer.

Álex: Ha llegado mamá.

Risas. La de Marcos la primera. La de Irene después, con la mano en la boca.

La conversación vuelve. Como el agua cuando quitas una piedra.

Es madera. Casas viejas. El viento en el tejado. Un animal. Cualquier cosa.

Álex está en mitad de una frase sobre un baño de discoteca en el que se quedó encerrado con una chica cuyo nombre no recuerda. Es la tercera vez que la cuenta. Irene le corrige el nombre. Sigue siendo graciosa.

Y otra vez.

Más pequeño.

Un roce. Un chasquido corto. Como una tabla que se asienta.

Nadie más lo ha oído. O nadie más le ha hecho caso. Marcos tiene la mano dentro de tu pelo.

${({
  lucido: "Lo sitúas sin querer: encima de la mesa, un metro a la derecha de la lámpara. Donde estaría alguien de pie en el dormitorio de arriba. El vuestro.",
  asustado: "Se te encoge el estómago antes de que sepas por qué. La mano de Marcos en tu pelo pesa de repente como si fuera de otro.",
  tenso: "Aprietas el vaso. No lo notas hasta que Marcos te lo quita de la mano y lo deja en la mesa.",
  ido: "Ha sonado. ¿Ha sonado? Ha sonado. Te ríes bajito y no sabes de qué.",
  perdido: "Lo has oído dentro de la cabeza, no arriba. Estás casi segura. Casi.",
  normal: "",
})[api.modo("nora")]}

~ La casa es vieja. Cruje. Eso es lo que hacen las casas viejas.

~ Pero ha sonado en el mismo sitio. Justo encima de la mesa.`;
      },
      alEntrar: (api) => { api.anomalia("crack_arriba"); ["nora", "marcos", "alex", "irene"].forEach((p) => api.presenciar(p, 1)); api.presenciar("nora", 0.5); },
      opciones: [
        { texto: "Mirar hacia arriba. Quedarte escuchando.", a: "f1_pov",
          efecto: (api) => { api.est("nora", "eje", 6); api.est("nora", "miedo", 3); api.saber("nora", "crujido_repetido"); api.marcar("d9", "mirar"); } },
        { texto: "Meter la cara en el cuello de Marcos. Reírte de lo que sea que esté diciendo Álex.", a: "f1_pov",
          efecto: (api) => { api.rel("nora", "alex", "resentimiento", -3); api.rel("alex", "nora", "afecto", 3); api.rel("nora", "marcos", "afecto", 3); api.marcar("d9", "ignorar"); } },
        { texto: "Levantarte de golpe. «¿Qué coño ha sido eso?» Demasiado alto.", a: "f1_pov", impulsiva: true,
          efecto: (api) => { api.est("nora", "estres", 8); api.est("nora", "miedo", 4); api.est("nora", "eje", -3); api.rel("alex", "nora", "afecto", -3); api.rel("irene", "nora", "resentimiento", 4); api.rel("marcos", "nora", "proteccion", 4); api.marcar("d9", "impulso"); } },
      ],
    },

    // =====================================================================
    // BLOQUE F — PRIMERA ELECCIÓN DE PERSPECTIVA
    // =====================================================================

    f1_pov: {
      musica: "fiesta_prnstar",
      pov: null,
      titulo: "Un descanso",
      texto: (api) => `
${api.bandera("d9") === "impulso" ? `Nora se ha levantado de golpe. La silla ha chirriado contra el suelo.

Nora: ¿Qué coño ha sido eso?

Demasiado alto. Todos la han mirado. Álex con la ceja levantada. Irene con la sonrisa a medio hacer. Marcos ya de pie, con la mano en su espalda.

Marcos: Madera vieja. Siéntate.

Nora se ha sentado. Despacio. Con la cara roja de otra cosa.

Álex: La experta.

Irene no ha dicho nada. No hacía falta.` : api.bandera("d9") === "mirar" ? `Nora se ha quedado mirando el techo. Las vigas. La lámpara. El punto exacto encima de la mesa.

Marcos le ha puesto la mano en la rodilla.

Marcos: Madera vieja.

Lo ha dicho sin que se lo preguntara. Nora ha asentido. Ha vuelto.

Irene ha mirado la mano.` : `Nora se ha reído contra el cuello de Marcos en el momento justo, cuando Álex ha dicho lo del rollo de papel. Álex ha brindado con ella. Marcos le ha besado la cabeza, por encima del pelo.

Irene ha mirado el beso. Un segundo más de la cuenta. Luego ha dejado de mirarlo.`}

La botella se ha acabado. La segunda también está en las últimas.

Álex se levanta. Con la camisa abierta, o sin ella, ya da igual.

Álex: Hielo.

Nora: Acabo de traer.

Álex: Más hielo. Y otra cosa. Voy a la cocina.

Marcos se levanta detrás de él. Nora se queda con el hueco donde estaba su brazo.

Marcos: Voy contigo. A vigilar que no mezcles nada con lejía.

Álex: A ver si te voy a tener que vigilar yo a ti.

Irene se estira. Se levanta despacio, con las manos en la parte baja de la espalda, como una gata, y ${api.bandera("b4") === "prenda" ? "recoge los shorts del suelo y se los pone sin prisa, mirando a Marcos mientras se abrocha el botón" : "se abrocha el top. Todos los botones que quedan. Mirando a Marcos mientras lo hace"}.

Irene: Voy al baño. Al de arriba. El de abajo huele a pino químico.

Álex: ¿Te acompaño?

Irene: A mear me sé ir sola.

Álex: Por si hay cadáveres.

Irene: Si hay cadáveres, te llamo.

Nora se queda en la mesa. Sola. Con el mechero, el cuaderno cerrado y ${api.bandera("pendulo") === "mesa" ? "el péndulo delante" : "la mochila a los pies"}. Con la camisa de Marcos sobre los hombros y el cinturón otra vez abrochado.

Dos cosas pasan a la vez. Arriba y en la cocina.

¿Cuál quieres ver?
      `,
      personajes: [
        {
          id: "irene", descripcion: "Sube al baño de arriba. Sola.", a: "f2_irene_arriba",
          // AUTO_RESOLVE — lo que hace Irene si seguimos a Marcos.
          // Esencia: terrenal, lista, curiosea si le sirve para algo. Los estados matizan.
          auto: (api) => {
            const intox = api.nivel("irene", "intox");
            const social = api.valor("irene", "eje");
            // La cuerda: tira si está suelta (intox) o si quiere tener algo que contar en la mesa (control social alto)
            if (intox !== "bajo" || social >= 45) { api.marcar("buhardilla_descubierta", "irene"); api.saber("irene", "buhardilla"); }
            else api.marcar("buhardilla_descubierta", false);
            // El grifo: Irene aprieta. Salvo que esté demasiado ida para molestarse.
            api.marcar("grifo", intox === "alto" ? "goteando" : "cerrado");
            if (intox !== "alto") api.est("irene", "eje", 1);
            // Lo que piensa en el baño sobre Nora y sobre Marcos ocurre igual aunque no lo veamos
            api.rel("irene", "nora", "resentimiento", 3);
            if (api.sabe("irene", "marcos_mirada")) api.rel("irene", "marcos", "tension", 3);
          },
        },
        {
          id: "marcos", descripcion: "Acompaña a Álex a la cocina.", a: "f4_marcos_cocina",
          // AUTO_RESOLVE — lo que hace Marcos si seguimos a Irene.
          // Esencia: racional. Casi siempre comprueba. Con las setas muy arriba, pasa. Con control muy alto, documenta.
          auto: (api) => {
            const intox = api.nivel("marcos", "intox");
            const control = api.valor("marcos", "eje");
            api.saber("marcos", "sarten_templada");
            if (intox === "alto") api.marcar("d11b", "pasar");
            else if (control >= 85 && api.hayEvidencia("video_brindis")) { api.marcar("d11b", "foto"); api.evidencia("foto_sarten", "marcos", "móvil de Marcos", "foto"); api.est("marcos", "lucidez", 2); api.est("marcos", "eje", 2); }
            else { api.marcar("d11b", "comprobar"); api.est("marcos", "eje", 4); }
            // La pulla de Álex en la cocina ocurre igual
            api.rel("marcos", "alex", "resentimiento", 4);
            api.rel("alex", "marcos", "tension", 2);
          },
        },
      ],
    },

    f2_irene_arriba: {
      pov: "irene",
      fondo: "assets/fondos/pasillo.jpg",
      ambiente: "arriba",
      titulo: "Arriba",
      lugar: "distribuidor de arriba",
      texto: (api) => `
La escalera es de madera. Estrecha. Con un pasamanos gastado por el lado de dentro.

Cruje en el tercer escalón.

Cruje en el séptimo.

Lo apuntas sin querer. Como apuntas todo.

${api.nivel("irene", "intox") === "alto" ? "Te agarras al pasamanos más de lo que hace falta. Los escalones no están donde deberían. O tus pies no. Te ríes sola. Bajito.\n\n" : ""}Abajo se oye a Marcos decir algo en la cocina y a Álex reírse. Nora ha subido la música un punto. Se oye una silla arrastrarse.

~ Se ha quedado sola. Con la camisa de Marcos. Mi camisa, en realidad. Se la olerá. Yo lo haría.

Arriba, el pasillo.

Una lámpara de pared con una bombilla que imita una llama, y que se mueve como una llama, y que no es una llama. Dos puertas a la izquierda, cerradas: los dormitorios. El de Álex y tuyo, el del fondo, con la cama grande. El de Marcos y Nora, el primero, con la cama que cruje. Lo comprobaste al llegar, sentándote en ella, mientras Nora deshacía la mochila.

Al fondo, el baño, con la luz encendida. Desde aquí se ve la bañera. Antigua, con patas. Una toalla colgada del borde.

A la derecha, una mesita con un jarrón de flores secas. Cuadros de montañas que nadie ha mirado nunca. Una alfombra larga, roja, que se hunde bajo los pies descalzos.

Y en el techo. Justo en mitad del pasillo.

Una trampilla rectangular de madera.

Con una cuerda colgando.

La cuerda tiene un nudo al final. Y el nudo se queda a la altura de tu cara. Podrías cogerlo sin levantar el brazo.

~ Es una buhardilla. Todas estas casas tienen una. Trastos. Polvo. Ratones.

La cuerda está quieta. Completamente quieta.

${({
  lucido: "El nudo está gastado por un lado. Alguien tira de ella a menudo. O tiraba.",
  asustado: "No la miras. La miras. Está quieta y aun así das un paso a un lado para no pasar por debajo.",
  tenso: "Te dan ganas de darle un manotazo, como se le da a algo que estorba. No lo haces.",
  ido: "Se balancea. No. Está quieta. Te has balanceado tú.",
  perdido: "Está quieta y te está mirando. Las cuerdas no miran. Esta sí.",
  normal: "",
})[api.modo("irene")]}

Te quedas mirándola dos segundos más de los necesarios.

Abajo, Álex grita algo. Marcos le contesta que no.
      `,
      opciones: [
        { texto: "Tirar de la cuerda. Por curiosidad.", a: "f3_irene_bano",
          efecto: (api) => { api.marcar("buhardilla_descubierta", "irene"); api.saber("irene", "buhardilla"); } },
        { texto: "Dejarla. Ir al baño, que es a lo que has subido.", a: "f3_irene_bano",
          efecto: (api) => { api.marcar("buhardilla_descubierta", false); } },
      ],
    },

    f3_irene_bano: {
      pov: "irene",
      fondo: "assets/fondos/bano.jpg",
      ambiente: "bano",
      titulo: "El baño",
      lugar: "baño de arriba",
      // mismos efectos que la resolución automática, para que ver la rama o no verla pese igual
      alEntrar: (api) => { api.rel("irene", "nora", "resentimiento", 3); if (api.sabe("irene", "marcos_mirada")) api.rel("irene", "marcos", "tension", 3); },
      texto: (api) => {
        const abrio = api.bandera("buhardilla_descubierta") === "irene";
        const intox = api.nivel("irene", "intox");
        const inicio = abrio ? `
Tiras.

CLACK.

La trampilla cede de golpe. Baja medio palmo. Y una escalera plegable de madera se despliega sola, con un traqueteo de bisagras que retumba en todo el pasillo, hasta apoyarse en la alfombra a veinte centímetros de tus pies.

Irene: ¿Qué coño...?

Miras arriba.

Un rectángulo negro. Huele a polvo. A madera seca. A algo dulce, muy al fondo, que no sabes qué es.

No se ve nada.

No se oye nada.

Desde abajo:

Álex: ¿Qué ha sido eso?

Irene: Una escalera. Hay una buhardilla.

Álex: ¡Ahí arriba están los cadáveres!

Marcos: Cállate, hombre.

No subes. No vas a subir a una buhardilla a oscuras con dos copas de más y descalza.

Empujas la escalera hacia arriba con las dos manos. Pesa más de lo que parece. La trampilla encaja con un golpe sordo. La cuerda queda colgando. Balanceándose.

Entras al baño. Cierras.` : `
Pasas por debajo de la cuerda. Te roza el pelo.

Entras al baño. Cierras.`;
        return `${inicio}

El baño es más grande de lo que parecía desde el pasillo.

La bañera de patas, blanca, con el esmalte desconchado en los bordes. Un lavabo de porcelana con dos grifos antiguos, uno para cada agua. Un espejo con el azogue gastado por las esquinas, que te devuelve una versión tuya con la cara un poco borrada.

Una ventana con cortinas de flores. Por ella, la luna entre los pinos. Alguien ha dejado una vela encendida en el alféizar. Nora, seguramente, cuando ha subido las mochilas.

~ Velas. Para la luz. Claro.

Haces lo que has subido a hacer.

Te lavas las manos. El agua sale fría y luego, de repente, caliente.

Te miras en el espejo. Te desabrochas un botón del top. Te lo abrochas. Te quedas con el de en medio abierto. Te miras de perfil. Te subes el short por un lado, donde ya no sube.

${intox === "alto" ? "El espejo tarda en devolverte. Un poco. Como si lo pensara. Te ríes. Te ríes tú y el espejo se ríe después.\n\n" : ""}~ Estás bien. Estás muy bien. Álex tiene suerte.

~ Y la otra lleva la camisa que yo le regalé a Marcos, dos tallas grande, y nada debajo de la camiseta. Y se le veía todo igual.${api.bandera("b3") === "prenda" || api.bandera("p2") === "prueba" || api.bandera("p2") === "mitad" ? " Y luego sin camiseta. Y tenía más de lo que parecía. Y Álex no ha parpadeado." : ""}

${api.sabe("irene", "marcos_mirada") ? "~ Y Marcos me ha mirado. Antes de beber. Medio segundo. Pero ha sido. Cinco años y sigue siendo.\n\n" : ""}${api.bandera("b1") === "prueba" ? "~ Y le he dejado marca. Y ella la ha visto. Y él no ha dicho basta.\n\n" : ""}Abajo, risas. Una carcajada de Álex, de las de verdad. Marcos diciendo «no, no, no» de esa manera que significa que sí.

Te retocas el pelo con los dedos.

Y entonces te das cuenta de que el grifo gotea.

Gota.

Gota.

Lo cierras del todo. Aprietas. Para.

Te giras hacia la puerta. Pones la mano en el pomo.

Gota.

...

Gota.

Te giras. Miras el grifo. Miras el espejo, donde el grifo también gotea, al revés.

~ Grifos viejos. Casa vieja. Todo aquí es viejo.

Tienes la mano en el pomo. Y el grifo detrás.`;
      },
      opciones: [
        { texto: "Volver y cerrarlo más fuerte.", a: "g1_regreso", efecto: (api) => { api.marcar("grifo", "cerrado"); api.est("irene", "eje", 1); } },
        { texto: "Pasar. Salir.", a: "g1_regreso", efecto: (api) => { api.marcar("grifo", "goteando"); } },
      ],
    },

    f4_marcos_cocina: {
      fondo: "assets/fondos/cocina.jpg",
      ambiente: "cocina",
      pov: "marcos",
      titulo: "La cocina",
      lugar: "cocina",
      texto: (api) => `
La cocina está al fondo, pasando el arco de madera. La luz es más blanca aquí. Más fea.

Una encimera vieja de piedra. Una cocina de gas de cuatro fuegos, con los mandos gastados. Estantes con tarros que no son de nadie. Cazos y sartenes colgando de ganchos, en fila, por tamaño. Una ventana encima del fregadero que da al negro.

Álex abre la nevera y se agacha delante de ella como si fuera a rezarle. Con la camisa abierta y los collares colgando hacia el suelo. ${api.bandera("b1") === "prueba" ? "Con la marca de una boca en tu cuello, que él ha mirado dos veces y no ha comentado. Todavía." : ""}

Álex: Hay cerveza. Hay una cosa verde. Hay algo que en su día fue un limón.

Marcos: Coge la cerveza y deja al limón descansar en paz.

${api.setas() ? `Notas algo. No mucho. Un cosquilleo detrás de los ojos. Los colores de los tarros un poco más saturados de lo que deberían. La luz que se queda un instante más en las cosas cuando apartas la vista.

${api.nivel("marcos", "intox") === "alto" ? "Y el suelo. El suelo está un poco más lejos de lo que debería. Te apoyas en la encimera con las dos manos y esperas a que vuelva." : "Todavía no. Pero está llegando."}

` : ""}Te apoyas en la encimera. Hay una sartén de hierro sobre uno de los fuegos, con un dedo de aceite en el fondo. Alguien la ha usado antes. Tú. Hace tres horas. Las salchichas.

Apoyas la mano en el mango sin pensar.

Está templado.

No caliente. Templado. Como está el asiento de un coche cuando alguien se acaba de levantar.

Retiras la mano.

Álex: ¿Qué?

Marcos: Nada.

Miras el mando del fuego. Está en cero. Miras la sartén. Es una sartén.

${({
  lucido: "Y sin embargo lo apuntas: templada a las dos y pico, fuego en cero, tres horas desde las salchichas. Datos. Luego se verá qué significan.",
  asustado: "Retiras la mano más rápido de lo que hacía falta. Álex no lo ha visto. Tú sí.",
  tenso: "Te dan ganas de tirarla al fregadero y acabar con esto. Con la sartén. Con la noche.",
  ido: "El mango tiene un pulso. No. Tienes tú el pulso en la mano. Lo notas contra el hierro.",
  perdido: "Está caliente porque alguien la ha usado. Alguien. Hace un momento. Estás seguro y no puedes estarlo.",
  normal: "",
})[api.modo("marcos")]}

~ Tres horas. Hierro. Cocina cerrada. Es la habitación más caliente de la casa.

Álex está abriendo cervezas con el mechero. Una se le cae y rueda por el suelo.

Álex: Joder.

Se agacha a por ella. Tú sigues con la mano a diez centímetros del mango.
      `,
      opciones: [
        { texto: "Comprobar el fuego. Oler el gas. Tocar los otros quemadores.", a: "f5_marcos_cocina2", lucida: true,
          efecto: (api) => { api.marcar("d11b", "comprobar"); api.est("marcos", "eje", 4); api.saber("marcos", "sarten_templada"); } },
        { texto: "Coger la cerveza. Pasar.", a: "f5_marcos_cocina2",
          efecto: (api) => { api.marcar("d11b", "pasar"); api.saber("marcos", "sarten_templada"); } },
        { texto: "Hacerle una foto a la sartén. Con el mando en cero al lado. Por si acaso.", a: "f5_marcos_cocina2", lucida: true,
          efecto: (api) => { api.marcar("d11b", "foto"); api.saber("marcos", "sarten_templada"); api.evidencia("foto_sarten", "marcos", "móvil de Marcos", "foto"); api.est("marcos", "lucidez", 2); api.est("marcos", "eje", 2); } },
      ],
    },

    f5_marcos_cocina2: {
      pov: "marcos",
      titulo: "La cocina",
      // la pulla de Álex pesa igual se vea o no
      alEntrar: (api) => { api.rel("marcos", "alex", "resentimiento", 4); api.rel("alex", "marcos", "tension", 2); },
      texto: (api) => {
        const inicio = api.bandera("d11b") === "foto" ? `
Sacas el móvil. Encuadras: la sartén, el mando en cero, el reloj de pared al fondo con la hora. Disparas. Dos veces, por si la primera sale movida.

Álex: ¿Le estás haciendo fotos a la sartén?

Marcos: Le estoy haciendo fotos a la hora.

Álex: Eres un tío muy raro.

Marcos: Soy un tío que apunta cosas.

Guardas el móvil. Vuelves a tocar el mango. Templado. Menos que antes. O te lo parece.

~ Ya está. Ya no es una sensación. Es una foto con hora. Si mañana sigue templada, tengo un problema con la cocina. Si no, tengo una anécdota.` : api.bandera("d11b") === "comprobar" ? `
Giras el mando del fuego. Cerrado. Lo giras al otro lado. Cerrado.

Te agachas. Hueles. Aceite viejo. No gas.

Tocas el quemador de al lado. Frío. El de detrás. Frío.

Vuelves a tocar el mango de la sartén.

Templado. Menos que antes. O te lo parece.

~ Hierro. El hierro guarda el calor horas. Física de primero. Sonríes. Te gusta cuando las cosas tienen explicación. Te gusta mucho.

Álex: ¿Estás hablando con la sartén?

Marcos: Estoy comprobando que tu limón no haya abierto el gas.

Álex: Mi limón es inocente.` : `
Sueltas el mango.

Coges la cerveza que Álex te tiende. La abres con el mechero. Bebes.

Vuelves a mirar la sartén una vez. De reojo.

Y luego dejas de mirarla.

Álex: ¿Qué te pasa?

Marcos: Nada. Que esta casa tiene cosas viejas.

Álex: Esta casa tiene una nevera con un limón momificado. Eso es lo más viejo que hay aquí.`;
        const juego = api.bandera("juego");
        const pulla = juego === "poker"
          ? (api.bandera("p3") === "no" ? "Álex: Lo de antes. Lo de Irene. Que le has dicho que no.\n\nMarcos: Le he dicho que no.\n\nÁlex: Delante de todos. A Irene. Que no se lo han dicho nunca.\n\nBebe.\n\nÁlex: Ella se lo apunta. Y yo también."
            : api.bandera("p3") ? "Álex: Lo de antes. Lo de Irene.\n\nMarcos: Ha sido el juego.\n\nÁlex: Ha sido el juego.\n\nBebe.\n\nÁlex: Lo que pasa es que llevabas cinco años queriendo que fuera el juego."
            : "Álex: Lo de antes.\n\nMarcos: ¿Qué de antes?\n\nÁlex: Todo.")
          : (api.bandera("b2") === "prueba" ? "Álex: Lo de antes. Lo de Nora. La mano.\n\nMarcos: Ha sido el juego.\n\nÁlex: Ha sido el juego.\n\nBebe.\n\nÁlex: Lo que pasa es que ella lo ha hecho para Irene. Y tú lo has hecho para ti. Y las dos cosas se han notado."
            : api.bandera("b1") === "prueba" ? "Álex: Lo de antes. Lo de Irene. El cuello.\n\nMarcos: Ha sido tu prueba.\n\nÁlex: Ha sido mi prueba.\n\nBebe.\n\nÁlex: Lo que pasa es que no has dicho basta. Y llevas cinco años sin decirlo."
            : "Álex: Lo de antes.\n\nMarcos: ¿Qué de antes?\n\nÁlex: Todo.");
        return `${inicio}

Álex cierra la nevera con el pie. Se apoya a tu lado en la encimera. Hombro con hombro. Piel contra tu camiseta. Como antes. Como hace cinco años, en la cocina de su piso, a las cinco de la mañana, esperando a que Irene saliera del baño.

Álex: Oye.

Marcos: Qué.

${pulla}

Te mira. Con esa sonrisa. La que usa cuando ha pulsado un botón y quiere ver qué hace la máquina.

...

Álex: ¿Sabes qué es lo que más me gusta de Nora?

Marcos: No me interesa.

Álex: Que no te conoce. Que no sabe cómo eras. Debe de ser descansado.

Marcos: Álex.

Álex: ¿Qué? Es un cumplido.

Sonríe. Te da con el hombro. Se oye la escalera crujir. Irene bajando. El tercer escalón. El séptimo.

Álex: Y no lleva sujetador. Eso también.

Marcos: Volvamos. Que Nora está sola con el péndulo y se va a casar con él.

Álex: Con el péndulo o contigo. Ya no sé cuál es peor.

Salís de la cocina. Antes de cruzar el arco miras atrás una vez. La sartén. El fuego apagado. La ventana negra.

Nada.`;
      },
      opciones: [
        { texto: "Volver a la mesa", a: "g1_regreso" },
      ],
    },

    // =====================================================================
    // BLOQUE G — EL PRIMER «¿HAS SIDO TÚ?»
    // =====================================================================

    g1_regreso: {
      pov: "nora",
      fondo: "assets/fondos/salon_fiesta_b.jpg",
      ambiente: "interior",
      musica: "fiesta_runrunrun",
      titulo: "La mesa",
      lugar: "comedor", hora: "02:11",
      consumo: [["alex", "cerveza"], ["marcos", "cerveza"], ["irene", "cerveza"], ["nora", "cerveza"]],
      texto: (api) => {
        const buh = api.bandera("buhardilla_descubierta") === "irene";
        return `
Vuelven todos casi a la vez.

Álex con cuatro cervezas entre los dedos y la camisa abierta. Marcos detrás, con cara de haber pensado algo y haberlo dejado a medias. Irene bajando la escalera con el paso de quien sabe que la están mirando bajar, con el top abrochado hasta arriba, como si ahora fuera otra.

${buh ? `Irene: Álex. Hay una buhardilla. Si quieres subir a ver los cadáveres, la escalera está ahí.

Álex: ¿Tú has subido?

Irene: Descalza no subo ni a un taburete. Ni a ti.` : `Irene: El baño de arriba tiene una bañera con patas. Nos vamos a bañar todos.

Álex: Por turnos.

Irene: Por turnos no.

Mira a Marcos al decirlo. Marcos mira las cervezas.`}

Se sientan. Álex reparte. Marcos coge la suya sin mirarla y se sienta a tu lado, y vuelve a poner el brazo donde estaba, y tú vuelves a caber debajo.

Irene se sienta en su silla. No en las rodillas de Álex. Álex la mira, extrañado, y ella le sonríe y le pasa la mano por el pecho, por entre los collares, y ya está.

Marcos: ¿Y el hielo?

Álex: Se me ha olvidado el hielo.

Nora: Yo he traído hielo.

Álex: Pues ya está. Para eso estás.

Sigue la música. Sigue la noche. Álex empieza otra historia, una de un festival y una tienda de campaña que no era suya y una chica que sí.

Y en mitad de la frase, la música se corta.

No se apaga. Se interrumpe.

Medio segundo de silencio limpio. Como un hipo.

Y sigue. En el mismo sitio de la canción. Como si no hubiera pasado nada.

Álex: Excelente cobertura.

Nora: No necesita cobertura. Está en el móvil de Irene.

Álex: Pues peor todavía.

Risas. Marcos coge el altavoz. Lo mira por debajo. Lo deja.

Marcos: Bluetooth. Se corta. Es lo que hace.

Irene: Es lo que hace.

Y entonces uno de los móviles que hay sobre la mesa vibra.

Una vez.

Boca arriba. Con la pantalla apagada.

Es el tuyo.

Todos lo miran. Luego te miran a ti.

Álex: ¿Tienes cobertura?

Nora: Aquí no hay cobertura.

Álex: Pues alguien te quiere mucho.

Irene: ¿Alguien de antes de Marcos?

Lo dice sonriendo. Marcos no se ríe.

El móvil está a diez centímetros de tu mano. Quieto. Con la pantalla negra.`;
      },
      opciones: [
        { texto: "Cogerlo. Mirarlo.", a: "h1_pendulo2",
          efecto: (api) => { api.marcar("d12", "mirar"); api.marcar("movil_anomalia", api.anomalia("movil_0000")); } },
        { texto: "Dejarlo. «Es la batería.» Y mirar a Irene.", a: "h1_pendulo2",
          efecto: (api) => { api.marcar("d12", "dejar"); api.rel("nora", "irene", "resentimiento", 3); } },
      ],
    },

    // =====================================================================
    // BLOQUE H — MINI RETO CON EL PÉNDULO
    // =====================================================================

    h1_pendulo2: {
      pov: "nora",
      titulo: "El péndulo, otra vez",
      texto: (api) => {
        const d12 = api.bandera("d12");
        const inicio = d12 === "dejar" ? `
No lo coges.

Nora: Es la batería. Siempre es la batería.

Miras a Irene mientras lo dices. Irene te sostiene la mirada. Sonríe primero. Siempre sonríe primero.

Álex: O la bruja. Que te ha añadido a un grupo.

Lo giras boca abajo con un dedo, sin mirarlo. Se acabó.` : api.bandera("movil_anomalia") ? `
Lo giras.

La pantalla se enciende. Ninguna notificación. Ningún mensaje. Sin cobertura. La foto de fondo: Marcos dormido en tu cama, con la boca abierta, el primer domingo.

Irene se inclina para verla. Ve la foto. No dice nada. Vuelve a sentarse.

Y la hora.

00:00

Parpadea.

02:11

Miras el reloj de la cocina. El redondo, el de pared, que se ve desde aquí a través del arco.

Las dos y once.

~ Ha sido un parpadeo. La pantalla ha tardado en cargar la hora. Eso pasa. Eso pasa constantemente.

Nora: Nada.

Marcos: Batería. Deja el móvil, que estás de vacaciones.

Lo dejas boca abajo esta vez.` : `
Lo giras.

La pantalla se enciende. Ninguna notificación. Ningún mensaje. Sin cobertura. La foto de fondo: Marcos dormido en tu cama, con la boca abierta, el primer domingo. Las dos y once.

Irene se inclina para verla. Ve la foto. No dice nada. Vuelve a sentarse.

Nora: Nada. Batería.

Marcos: Deja el móvil, que estás de vacaciones.

Lo dejas boca abajo.`;
        return `${inicio}

Álex alarga el brazo por encima de la mesa.

${api.bandera("pendulo") === "mesa" ? "Coge el péndulo, que sigue donde lo dejó." : "Abre tu mochila sin preguntar y saca el péndulo. Y de paso mira lo que hay dentro, y saca la ouija, la tabla, y la deja en la mesa, y no dice nada, y la vuelve a meter. Eso es todo. Por ahora."}

Esta vez no se lo quitas.

Esta vez le enseñas.

Nora: No. Así no.

Álex: ¿El fantasma se ofende?

Nora: El fantasma no. Yo. El codo en la mesa.

Lo hace.

Nora: La cadena entre dos dedos. Así. No la aprietes.

Le coges los dedos y se los colocas. Los anillos de él contra los tuyos. Álex te mira la mano en su mano. Irene mira la mano de Álex en la tuya.

Nora: La mano quieta. Que se note que no la mueves tú.

Álex: Qué autoritaria. Me gusta. ¿Le hablas así a él?

Marcos: A mí no me hace falta.

Álex deja la mano quieta. Para sorpresa de todos. La piedra cuelga. Gira sobre sí misma muy despacio, por la torsión de la cadena, y se para.

Nora: Se hace una pregunta de sí o no. Adelante y atrás es sí. De lado es no.

Irene: ¿Y en círculo?

Nora: En círculo es que Álex está moviendo la mano.

Álex: Venga. Pregunta tú. Que eres la experta. ${api.bandera("b3") === "prenda" || api.bandera("p2") === "prueba" || api.bandera("p2") === "mitad" ? "La que ya se ha quitado todo lo que tenía que quitarse." : "La única que no se ha quitado nada."}

La chimenea chasquea. Marcos se ha inclinado hacia delante sin darse cuenta. Irene también. Los cuatro alrededor de una piedra que cuelga de un hilo.

~ Es una tontería. Es una tontería y me encanta. Y por una vez me están mirando a mí. Por esto.`;
      },
      opciones: [
        { texto: "«¿Hay alguien aquí con nosotros?»", a: "i1_simbolo", efecto: (api) => { api.marcar("d13", "alguien"); api.est("nora", "eje", 3); } },
        { texto: "«¿Murió alguien en esta casa?»", a: "i1_simbolo", efecto: (api) => { api.marcar("d13", "murio"); api.est("nora", "eje", 4); api.est("irene", "miedo", 3); } },
        { texto: "«¿Álex es gilipollas?»", a: "i1_simbolo", efecto: (api) => { api.marcar("d13", "alex"); api.rel("nora", "alex", "resentimiento", -4); api.rel("alex", "nora", "afecto", 5); } },
      ],
    },

    // =====================================================================
    // BLOQUE I — ALGO QUE SOLO NORA NOTA
    // =====================================================================

    i1_simbolo: {
      pov: "nora",
      titulo: "La marca",
      texto: (api) => {
        const d13 = api.bandera("d13");
        const respuesta = d13 === "alex" ? `
Silencio. Álex intenta no reírse. La piedra cuelga quieta.

Tres segundos.

Y empieza a oscilar. Adelante. Atrás. Adelante. Atrás. Cada vez más amplio.

SÍ.

Irene se dobla sobre la mesa. Marcos aplaude despacio, tres veces.

Álex: Lo estás moviendo.

Nora: No te estoy tocando.

Álex: Pues tócame. A ver si cambia.

Marcos: Álex.

Álex: Lo estoy moviendo yo entonces. Inconscientemente. Porque en el fondo lo sé.

Nora: Claramente el más allá tiene criterio.

Álex suelta el péndulo sobre la mesa. De mala gana. La piedra rueda y se para.` : d13 === "murio" ? `
Silencio.

Irene deja de sonreír. No del todo. Un poco.

La piedra cuelga quieta.

Tres segundos. Cinco.

Y empieza a oscilar. Adelante. Atrás. Muy poco. Luego un poco más. Luego bastante.

SÍ.

Álex: Vaaale.

Marcos: Es una casa de doscientos años. Aquí ha muerto gente. De viejos. De gripe. De aburrimiento.

Irene: ¿Por qué has preguntado eso?

Nora: Porque es la pregunta.

Irene: Es una pregunta de mierda.

Se ha cruzado de brazos. Álex le pone la mano en la rodilla. Ella se la quita.

Álex suelta el péndulo sobre la mesa. Se ríe. Pero ha soltado la cadena un poco rápido.` : `
Silencio.

La piedra cuelga quieta. Álex tiene la mano tan tensa que se le marcan los tendones.

Tres segundos. Cinco. Siete.

Nada.

Marcos: Bueno. Pues no hay nadie. Podemos seguir bebiendo.

Y empieza a oscilar.

Adelante. Atrás. Casi imperceptible.

Luego más.

SÍ.

Álex: Lo juro. Lo juro por mis muertos.

Irene: Tus muertos están aquí, por lo visto.

Nora: Es el pulso. Es ideomotor. El cuerpo hace lo que la cabeza espera.

Marcos: Gracias, Nora.

Nora: No he dicho que sea lo que ha pasado. He dicho que es lo que dice todo el mundo.

Álex suelta el péndulo sobre la mesa. La piedra rueda y se para.`;
        return `${respuesta}

Vas a recogerlo.

La cadena se ha enganchado en algo. Tiras suave. No sale. Apartas el mantel individual de Marcos, el de rafia, que estaba medio encima.

Un arañazo en la madera. En el borde de la mesa. Pequeño.

No.

No es un arañazo.

O sí, pero hecho a propósito. Tres líneas que se cruzan en un punto. Y un círculo pequeño, del tamaño de una lenteja, en el extremo de una de ellas. Todo cabe debajo de una moneda.

Muy viejo. La madera está oscura dentro de los surcos. Más oscura que el barniz. Como si llevara ahí más tiempo que el barniz.

Pasas el dedo por encima. Se nota.

~ No lo conozco. O lo conozco y no me acuerdo. Podría ser una marca de carpintero. Podría ser un niño con una navaja hace cincuenta años. Podría ser cualquier cosa.

${api.nivel("nora", "intox") !== "bajo" ? "~ O podría ser que estoy más fumada de lo que pensaba y estoy mirando un arañazo como si fuera un libro.\n\n" : ""}Nadie más lo ha visto. Álex está abriendo otra cerveza con los dientes. Irene se ha vuelto a subir a sus rodillas, reconciliada o no, y le está diciendo algo al oído que le hace cerrar los ojos. Marcos mira la chimenea con la cerveza en la mano y la otra mano en tu muslo, quieta, como si se hubiera olvidado de que está ahí.

El móvil está boca abajo a tu lado. El cuaderno, cerrado, debajo de tu mano.

La marca, bajo la luz de la lámpara, parece un poco más profunda de lo que era hace un segundo. No lo es. Es la luz.`;
      },
      opciones: [
        { texto: "Fotografiarla con el móvil. Sin decir nada.", a: "j1_preguntas", lucida: true, efecto: (api) => { api.evidencia("simbolo_mesa", "nora", "comedor", "foto"); api.saber("nora", "simbolo_mesa"); api.est("nora", "eje", 3); } },
        { texto: "Abrir el cuaderno y copiarla. Con la fecha y la hora.", a: "j1_preguntas", lucida: true, efecto: (api) => { api.evidencia("simbolo_mesa", "nora", "cuaderno de Nora", "nota"); api.saber("nora", "simbolo_mesa"); api.est("nora", "eje", 3); api.est("nora", "lucidez", 2); } },
        { texto: "Volver a tapar la marca con el mantel.", a: "j1_preguntas", efecto: (api) => { api.saber("nora", "simbolo_mesa"); } },
      ],
    },

    // =====================================================================
    // BLOQUE J — SEGUNDO JUEGO / TENSIÓN SOCIAL
    // =====================================================================

    j1_preguntas: {
      pov: "marcos",
      titulo: "Preguntas que no harías sobrio",
      consumo: [["marcos", "cerveza"], ["alex", "cerveza"]],
      texto: (api) => `
${api.setas() ? `Ya está.

Lo notas. Las vetas de la mesa tienen más profundidad de la que deberían. Como surcos. La luz de la lámpara se queda un instante más en las cosas cuando apartas la vista, y luego las sigue. La piel de Nora, bajo tu mano, tiene una temperatura que puedes ver.

${api.nivel("marcos", "intox") === "alto" ? "Y las voces llegan un poco desde dentro. Como si hablaran dentro de tu cabeza y luego, por educación, también fuera." : "No es desagradable.\n\nTodavía."}

Nora está haciendo algo con el cuaderno. O con el móvil. No te has fijado. Tiene la cara de cuando encuentra una palabra en un libro.` : `La cerveza está fría. Esa es la mejor noticia de la última media hora.

Nora ha estado un rato callada, con el cuaderno. Ahora lo ha cerrado y te mira como si no hubiera pasado nada. No ha pasado nada. Tienes la mano en su muslo y ella te la ha cubierto con la suya, y así estáis.`}

Álex ha vuelto a la carga con las preguntas. Ahora va por rondas. Cada uno pregunta a quien quiera. Lo que quiera. Y ya nadie pregunta cosas de las que se puedan contestar.

Álex: Nora. ¿Cuál es la cosa más rara que te ha pedido Marcos en la cama?

Nora: Que me callara.

Álex: Eso es lo más normal que ha pedido en su vida.

Irene: A mí nunca me pidió que me callara.

...

Nadie dice nada. Álex se ríe solo. Irene le mira. Él deja de reírse.

Irene: Es broma.

Álex: Ya.

Le toca a Irene.

Te mira a ti. Se ha vuelto a bajar de las rodillas de Álex. Tiene los codos en la mesa y la barbilla en las manos, y el top ${api.bandera("b1") === "prenda" || api.bandera("juego") === "poker" ? "abierto otra vez, por si alguien lo había olvidado" : "con un botón menos que hace media hora"}. Como si nada.

Irene: Marcos.

Marcos: Qué.

Irene: ¿Te acuerdas de aquella noche en casa de Rubén? Cuando se fueron todos y nos quedamos tú y yo en el sofá hasta las siete.

...

Nora sigue mirando el vaso. No se ha movido. Pero ha quitado la mano de encima de la tuya. Álex ha dejado de sonreír exactamente lo que dura un parpadeo, y luego ha vuelto a sonreír, más.

Irene: ¿De qué hablamos? Yo no me acuerdo. Y me da rabia.

Te está sonriendo. Con toda la cara. Con los ojos también, esta vez.

Es una pregunta inocente. Cualquiera diría que es una pregunta inocente.

~ Hablamos de todo. De su padre. De mi madre. De que ella no sabía qué hacer con su vida y yo tampoco. Y a las seis y media se quedó callada, se tumbó con la cabeza en mis piernas, y me miró desde abajo, y yo miré la ventana.

~ Y ella lo sabe. Y ha hecho la pregunta delante de Nora. Con el top abierto.

La chimenea. El viento en la ventana. Álex tamborileando en la mesa con dos dedos, mirándote.
      `,
      opciones: [
        { texto: "Seguirle el juego. «De ti, sobre todo. Y de lo mal que cantabas.»", a: "k1_golpes",
          efecto: (api) => { api.rel("irene", "marcos", "tension", 8); api.rel("irene", "marcos", "afecto", 4); api.rel("nora", "marcos", "confianza", -8); api.rel("alex", "marcos", "celos", 6); api.marcar("d15", "seguir"); } },
        { texto: "Distancia, con humor. «De que algún día tendríamos una conversación tan buena como esta. Y mira. Aquí estamos.»", a: "k1_golpes",
          efecto: (api) => { api.rel("nora", "marcos", "confianza", 5); api.rel("nora", "marcos", "afecto", 3); api.rel("irene", "marcos", "resentimiento", 3); api.marcar("d15", "distancia"); } },
        { texto: "Pasarte. «No me acuerdo. Me acuerdo de que Álex se quedó dormido en el baño y tú te fuiste a las siete y media. Sola.»", a: "k1_golpes",
          efecto: (api) => { api.rel("irene", "marcos", "resentimiento", 10); api.rel("irene", "nora", "resentimiento", 5); api.rel("alex", "marcos", "resentimiento", 4); api.est("marcos", "eje", 2); api.marcar("d15", "borde"); } },
      ],
    },

    // =====================================================================
    // BLOQUE K — SEGUNDO MICROFENÓMENO
    // =====================================================================

    k1_golpes: {
      musica: "fiesta",
      pov: "marcos",
      titulo: "Entre canciones",
      alEntrar: (api) => { api.marcar("hubo_golpes", api.anomalia("golpes_pared")); if (api.bandera("hubo_golpes")) ["nora", "marcos", "alex", "irene"].forEach((p) => api.presenciar(p, 1.2)); },
      texto: (api) => {
        const d15 = api.bandera("d15");
        const inicio = d15 === "seguir" ? `
«De ti, sobre todo. Y de lo mal que cantabas.»

Irene se ha reído. Con la cabeza hacia atrás, enseñando el cuello. Nora no. Nora ha bebido. Y ha apartado la pierna.

Álex: Qué bonito.

Lo ha dicho con un tono que no era bonito. Y ha cogido a Irene por la nuca, con la mano abierta, y la ha atraído hacia él y la ha besado en la boca fuerte, con los ojos abiertos, mirándote a ti por encima de la cara de ella.

Has cambiado de tema con la delicadeza de un camión. Algo sobre la película de antes. Nadie te ha seguido.` : d15 === "distancia" ? `
«De que algún día tendríamos una conversación tan buena como esta. Y mira. Aquí estamos.»

Irene ha sonreído. Como si le hubieras dado la razón en algo que solo ella sabe.

Nora ha vuelto a poner la mano sobre la tuya. Y ha subido la tuya un poco. Por dentro.

Álex ha vuelto a respirar.` : `
«Y tú te fuiste a las siete y media. Sola.»

...

Irene: Qué memoria.

No ha sonreído. Se ha abrochado el top. Del todo. Hasta el botón que no cierra. Álex se ha reído demasiado fuerte y demasiado tarde y le ha pasado el brazo por los hombros, y ella se ha dejado, pero sin apoyarse.

Nora te ha mirado como diciendo «¿hacía falta?».

Probablemente no hacía falta. Pero te ha puesto la mano en la nuca.`;
        if (api.bandera("hubo_golpes")) {
          return `${inicio}

Se acaba una canción.

Antes de que empiece la siguiente hay dos segundos de silencio. Se oye el bosque a través de las paredes. El viento en los pinos. La chimenea. La respiración de Irene, que está un poco agitada.

[toc]

Tok.

[toc]

Tok.

[toc]

Tok.

No arriba.

En la pared. La de detrás de Irene. La que da al bosque.

Tres golpes. Secos. Espaciados. Como con un nudillo.

Marcos: Ratones.

Álex: Educados.

Nora ha girado la cabeza hacia la pared. Irene se ha apartado un poco de ella, con la silla, sin darse cuenta de que lo hacía, y se ha pegado a Álex por primera vez en toda la noche sin que fuera para otra cosa.

Tok.

Más suave.

Y ya nada.

Empieza la siguiente canción. Una que le gusta a Álex. Empieza a cantarla.

${({
  lucido: "Tres. Igual de separados. Y el cuarto más suave, como el que se aleja. Eso lo registras antes de decidir qué piensas de ello.",
  asustado: "Se te ha erizado el brazo entero. Tienes la mano en la mesa y no la sientes. La pared está a dos metros y parece más cerca.",
  tenso: "Notas la mandíbula. La tienes apretada desde lo de Irene y ahora más. Te duele.",
  ido: "Los golpes han dejado un rastro en el aire. Como anillos. Los ves irse. No los ves. Los ves.",
  perdido: "Han sonado desde tu lado de la mesa. No. Desde la pared. No. Desde dentro. Da igual. Han sonado.",
  normal: "",
})[api.modo("marcos")]}

~ Ratones. Tuberías. La madera, que se contrae por la noche cuando baja la temperatura. Cualquier casa de piedra y madera hace eso.

~ Tres golpes. Igual de separados.

${api.nivel("marcos", "intox") === "alto" ? "~ O son las setas. Las setas hacen ruidos. ¿Hacen ruidos? No sé si hacen ruidos.\n\n" : ""}Tienes los nudillos apoyados en la mesa.`;
        }
        return `${inicio}

Se acaba una canción.

Antes de que empiece la siguiente hay dos segundos de silencio. Se oye el bosque a través de las paredes. El viento en los pinos. La chimenea. Un pájaro, lejos, que hace un ruido de pájaro que no conoces.

Nadie dice nada durante esos dos segundos.

Es raro. Cuatro personas y nadie dice nada. Irene tiene los labios hinchados. Nora tiene la mano en tu nuca. Álex mira a Nora.

Empieza la siguiente canción. Una que le gusta a Álex. Empieza a cantarla, mal, y todo vuelve.`;
      },
      opciones: [
        { texto: "Burlarte. «Son los ratones que vienen a por el limón.»", a: "l1_casa", si: (api) => api.bandera("hubo_golpes"),
          efecto: (api) => { api.marcar("d16", "burla"); api.est("marcos", "eje", 2); } },
        { texto: "Callarte. Escuchar.", a: "l1_casa", lucida: true, si: (api) => api.bandera("hubo_golpes"),
          efecto: (api) => { api.marcar("d16", "escuchar"); api.est("marcos", "lucidez", 2); api.saber("marcos", "golpes_pared"); } },
        { texto: "Levantarte. Golpear la pared de vuelta. Tok. Tok. Tok.", a: "l1_casa", si: (api) => api.bandera("hubo_golpes"),
          efecto: (api) => { api.marcar("d16", "golpear"); api.marcar("respondio_golpes", true); api.saber("marcos", "golpes_pared"); api.est("alex", "eje", 2); } },
        { texto: "Sacar el móvil sin decir nada. Grabar la pared. Esperar.", a: "l1_casa", lucida: true, si: (api) => api.bandera("hubo_golpes"),
          efecto: (api) => { api.marcar("d16", "grabar"); api.saber("marcos", "golpes_pared"); api.evidencia("audio_golpes", "marcos", "móvil de Marcos", "audio"); api.est("marcos", "lucidez", 2); api.est("nora", "eje", 3); api.rel("nora", "marcos", "confianza", 3); } },
        { texto: "Cantar con Álex. Peor que él.", a: "l1_casa", si: (api) => !api.bandera("hubo_golpes"),
          efecto: (api) => { api.marcar("d16", "nada"); api.rel("alex", "marcos", "afecto", 3); } },
        { texto: "Dar un golpe en la mesa con la palma. «Ya está bien de ruiditos.»", a: "l1_casa", impulsiva: true, si: (api) => api.bandera("hubo_golpes"),
          efecto: (api) => { api.marcar("d16", "golpe_mesa"); api.est("marcos", "estres", 6); api.est("marcos", "eje", -4); api.est("nora", "miedo", 3); api.est("irene", "miedo", 3); api.rel("nora", "marcos", "confianza", -4); api.rel("alex", "marcos", "afecto", -3); api.saber("marcos", "golpes_pared"); } },
      ],
    },

    // =====================================================================
    // BLOQUE L — LA CASA PARTICIPA EN LA FIESTA
    // =====================================================================

    l1_casa: {
      pov: "nora",
      titulo: "Entre canciones",
      texto: (api) => {
        const d16 = api.bandera("d16");
        let t = "";
        if (d16 === "golpear") {
          t = `
Marcos se levanta.

Va hasta la pared. La de detrás de Irene. Irene se aparta con la silla para dejarle sitio, y esta vez sí se da cuenta, y le roza la cadera con el hombro al pasar, y él no lo nota o hace que no.

Marcos golpea con los nudillos. Tok. Tok. Tok.

Silencio.

Álex se tapa la boca con la mano. Irene mira a Marcos desde abajo, como se mira a alguien que se ha subido a una mesa. Tú no te ríes.

Marcos espera. Con la oreja a un palmo de la madera.

Nada.

Marcos: Ya está. No hay ratones. O son ratones tímidos.

Todos se ríen. Marcos también. Vuelve a sentarse. Te mira y se encoge de hombros. Le coges la mano por debajo de la mesa y te la llevas al muslo.

~ Ha respondido. Ha respondido a la pared. Y la pared no ha dicho nada.

~ Bien.`;
        } else if (d16 === "burla") {
          t = `
Marcos: Son los ratones. Que vienen a por el limón.

Álex: Ratones veganos.

Irene: Ratones con modales. Como Marcos.

Y la mesa vuelve a la normalidad en tres segundos. Álex cuenta algo de unos ratones en el piso que compartían. Marcos dice que eran ratas. Irene dice que ella los mató con un tacón, y Álex dice «con mi tacón», y ella dice «con mi tacón», y se pelean por eso, y se ríen, y tú no estabas.

Tú tardas un poco más. Tienes la cabeza girada hacia la pared. Nadie se da cuenta.`;
        } else if (d16 === "golpe_mesa") {
          t = `
Marcos da un golpe en la mesa con la palma abierta. Los vasos saltan. Uno se vuelca.

Marcos: Ya está bien de ruiditos.

Nadie se ríe. Álex le mira como se mira a alguien que ha dicho algo en otro idioma. Irene se ha pegado más a Álex. Tú has dado un respingo y te odias por ello.

Silencio.

Marcos: Perdón.

Se pasa la mano por la cara. Endereza el vaso. Nadie dice nada durante tres segundos que son largos.

~ No es él. O sí es él, pero no el que yo conozco. El que yo conozco no pega en las mesas.`;
        } else if (d16 === "grabar") {
          t = `
Marcos no ha dicho nada. Ha sacado el móvil. Lo ha apoyado en la mesa, con el micrófono hacia la pared, y ha pulsado grabar. Y se ha quedado quieto.

Álex: ¿Qué haces?

Marcos: Shh.

Y todos os habéis callado. Los cuatro. Mirando un móvil que graba una pared.

Diez segundos. Veinte. La chimenea. El viento.

Nada.

Marcos ha parado la grabación. La ha guardado. No la ha borrado.

Álex: Documental número dos. Pared.

Irene se ha reído. Tú no. Tú le has mirado a él, y él te ha mirado a ti, y ha sido la primera vez esta noche que os habéis entendido sin que hiciera falta nada.

~ Ha grabado. Ha grabado la pared. Sin creer en nada, ha grabado.`;
        } else if (d16 === "escuchar") {
          t = `
Marcos no ha dicho nada. Se ha quedado quieto, con la cerveza a medio camino, mirando la pared.

Tú también.

Nada más. La pared es una pared. Madera. Nudos. Un cuadro torcido.

Álex canta. Irene le hace coros, sentada de nuevo encima de él, con la espalda contra su pecho y la mano de él plana en su estómago, por debajo del top. La normalidad vuelve como el agua.

Marcos te mira. Tú le miras. Ninguno de los dos dice nada. No hace falta. Le pones la mano en la nuca.`;
        } else {
          t = `
Marcos canta con Álex. Peor. Mucho peor. Irene se tapa los oídos. Tú te ríes de verdad, con la cara en el hombro de Marcos.

Es una buena noche. Es exactamente lo que tenía que ser.`;
        }
        if (api.bandera("buhardilla_descubierta") === "irene") {
          t += `

Álex se levanta a mear. Al baño de abajo, el del pino químico. Vuelve por el pasillo mirando hacia la escalera. Con la camisa abierta, con la cerveza, rascándose el estómago.

Álex: ¿Eso estaba abierto antes?

Irene: Ya te lo he dicho. He tirado de la cuerda. Ha caído la escalera. La he vuelto a subir.

Álex: ¿Y no has subido?

Irene: Álex.

Álex: Vale, vale. Luego subimos. Los dos.

Irene: Eso ya se verá.

Todo resuelto. Perfecto.`;
        } else {
          t += `

Álex se levanta a mear. Al baño de abajo, el del pino químico. Vuelve por el pasillo con una cerveza nueva, sin mirar la escalera, rascándose el estómago, y se sienta.

Nadie mira hacia la escalera.

Nadie ve, desde la mesa, que arriba, en mitad del pasillo del primer piso, la cuerda de la trampilla se balancea. Muy despacio. Como si alguien acabara de pasar a su lado.

Tú tampoco. Estás mirando a Marcos.`;
        }
        const restos = api.bandera("juego") === "poker"
          ? "La camisa estampada de Álex encima de la de cuadros de Marcos, en el mismo respaldo, y los dos sin ellas. Tu camisa de Marcos en tu silla, y tú " + (api.bandera("p2") === "prueba" || api.bandera("p2") === "mitad" ? "con la de cuadros de Marcos por los hombros, sin abrochar, y nada más arriba." : "en camiseta con la piel de gallina.")
          : "La botella vacía todavía en el centro, apuntando a nadie. " + (api.bandera("b4") === "prenda" ? "Los shorts de Irene otra vez puestos, con el botón sin abrochar, después de media hora en el suelo." : api.bandera("b1") === "prueba" ? "La marca en el cuello de Marcos, que ya no está roja, que ahora es de otro color." : api.bandera("b3") === "prenda" ? "Tu camiseta hecha una bola en tu regazo y tu camisa de Marcos abrochada a medias sobre nada." : "El cinturón de Álex colgando de la silla.");
        return `${t}

La mesa está como suelen estar las mesas a las dos y pico.

Vasos por todas partes. Ceniza fuera del cenicero. La baraja desordenada. ${restos} ${api.bandera("pendulo") === "mesa" || api.bandera("d13") ? "El péndulo donde lo dejó Álex." : ""} Tu cuaderno cerrado bajo tu mano.

Nora: Por cierto.

Álex: Ahí está.

Nora: Esta casa sí que tiene historia.

Marcos: Ya la hemos perdido.

Irene: ¿Qué historia? ¿La de las velas?

Te ríes. Abres el cuaderno. Tienes cosas: una captura de un foro, un artículo de un periódico local de hace veinte años, dos páginas de un libro de folklore de la zona, fotocopiadas y dobladas.

Nora: Mirad. En serio. Esto es...

Álex: No, no, no.

Se inclina hacia delante. Apoya los codos en la mesa. Irene se queda a un lado, apartada con el brazo, como se aparta una cortina. Y le cambia la cara.

Es la cara que pone cuando ha decidido que la siguiente media hora es suya.

Álex: Si vamos a contar esto, se cuenta bien.

Irene sonríe. Ya sabe lo que viene. Le encanta. Le ha visto hacerlo veinte veces. Tú, ninguna.

Marcos te mira a ti. Esperando a ver si le dejas.

Cierras el cuaderno.`;
      },
      opciones: [
        { texto: "«Venga. Ilumínanos.»", a: "m1_musica", pov: "nora", efecto: (api) => { api.marcar("d17", "nora"); api.est("nora", "eje", 2); } },
        { texto: "«Esto promete ser históricamente rigurosísimo.»", a: "m1_musica", pov: "marcos", efecto: (api) => { api.marcar("d17", "marcos"); api.rel("alex", "marcos", "tension", 2); } },
        { texto: "«Cuéntala. Y que se calle la nueva.»", a: "m1_musica", pov: "irene", efecto: (api) => { api.marcar("d17", "irene"); api.rel("nora", "irene", "resentimiento", 6); api.rel("alex", "irene", "afecto", 3); api.rel("marcos", "irene", "resentimiento", 3); } },
      ],
    },

    // =====================================================================
    // BLOQUE M — LA MÚSICA
    // =====================================================================

    m1_musica: {
      pov: "alex",
      titulo: "Esta casa",
      texto: (api) => `
${api.bandera("d17") === "nora" ? "«Venga. Ilumínanos.»\n\nNora te ha cedido el turno. Con retintín. Pero te lo ha cedido. Mejor. Y te lo ha cedido mirándote a los ojos, cosa que no hace mucho." :
  api.bandera("d17") === "marcos" ? "«Esto promete ser históricamente rigurosísimo.»\n\nMarcos. Le has enseñado el dedo. Con cariño. Con el mismo dedo que hace cinco años. Él se ha reído. Nora no ha entendido el chiste porque no hay chiste, hay cinco años." :
  "«Cuéntala. Y que se calle la nueva.»\n\nIrene. Como siempre. Es el mejor público que existe. Y lo sabe. Nora ha mirado a Marcos. Marcos ha dicho «Irene» en voz baja. Irene ha dicho «¿qué?» con cara de nada."}

${api.nivel("alex", "intox") === "alto" ? "Te cuesta un segundo encontrar las palabras. Están ahí. Están todas. Solo hay que esperar a que se pongan en fila.\n\n" : ""}Miras alrededor.

Las paredes de madera. Las ventanas negras. El pasillo oscuro hacia la cocina. La escalera que sube. La chimenea, que ha bajado a brasas.

Todo lo que hace falta.

Nora, con el cuaderno cerrado y cara de «a ver». Con ese cuello. Con esa camiseta. Marcos, con la cerveza y el brazo alrededor de ella, y cara de «a ver». Irene, con las piernas recogidas en la silla y la barbilla en las rodillas y el top como está, con cara de «venga».

~ Cuatro. Solo cuatro. Y ya los tengo.

Solo queda una cosa.

La música. Está sonando algo que no pega con lo que vas a contar. Algo alegre. Algo de Irene.

Alargas la mano hacia el altavoz.
      `,
      opciones: [
        { texto: "Bajarla. Que quede como un murmullo.", a: "f2_leyenda_inicio", efecto: (api) => { api.marcar("musica_leyenda", "baja"); } },
        { texto: "Apagarla del todo.", a: "f2_leyenda_inicio", efecto: (api) => { api.marcar("musica_leyenda", "apagada"); } },
        { texto: "Dejarla. Que suene. Tú puedes hablar por encima de cualquier cosa.", a: "f2_leyenda_inicio", efecto: (api) => { api.marcar("musica_leyenda", "sonando"); } },
      ],
    },

    // =====================================================================
    // FASE II — LA LEYENDA (siguiente entrega)
    // =====================================================================

    f2_leyenda_inicio: {
      pov: "alex",
      musica: (api) => ({ sonando: "fiesta", baja: "fiesta_baja" })[api.bandera("musica_leyenda")] || null,
      titulo: "Vale. Yo tengo una historia.",
      alEntrar: (api) => { api.marcar("fase1_completa", true); api.fase("II"); },
      texto: (api) => `
${api.bandera("musica_leyenda") === "baja" ? "Bajas la música. No del todo. Solo lo suficiente para que quede sonando muy bajo, como un murmullo." :
  api.bandera("musica_leyenda") === "apagada" ? "Apagas la música.\n\nEl silencio de la casa es más grande de lo que esperabas. Se oye el bosque. Se oye la chimenea. Se oye a Irene tragar." :
  "Dejas la música. Que suene. Tú puedes hablar por encima de cualquier cosa."}

Dejas la botella sobre la mesa.

Álex: Vale. Yo tengo una historia.

Marcos: Hostia, no.

Álex: Calla.
      `,
      opciones: [{ texto: "Continuar", a: "l1_leyenda" }],
    },
  },
};
