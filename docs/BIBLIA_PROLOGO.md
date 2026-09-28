# LA BRUJA — Biblia consolidada del prólogo

Documento de análisis. Fusiona todos los bloques de diseño aportados por el autor
(27-09-2026), resuelve las contradicciones entre versiones y marca las decisiones
abiertas. Es la referencia única para escribir `js/story.js`.

Cuando dos bloques chocan, **manda la versión posterior** (la Propuesta Maestra v0.9),
salvo que el autor indique lo contrario.

---

## 0. Las dos normas de cabecera

> Nada terrible ocurre porque el jugador haya pulsado un botón. Ocurre porque lleva
> tiempo adentrándose en una situación cuyo peligro todavía no comprende.

> Primero hacemos que el jugador mire. Después que dude. Después que tema volver a
> mirar. Y solo entonces le enseñamos lo que había allí.

---

## 1. Qué es el prólogo

- Cuatro jóvenes, dos parejas (Nora–Marcos, Álex–Irene), una noche en una cabaña
  levantada sobre el lugar donde quemaron a "la bruja".
- POV coral: el jugador **controla escenas, no personajes**. La narración decide
  quién es el punto de vista. Solo aparece elección de perspectiva cuando dos
  escenas simultáneas tienen peso real.
- **Libertad local, destino global cerrado.** Las decisiones cambian relaciones,
  percepciones, información, orden, quién presencia qué, cómo muere cada uno y qué
  evidencia queda. No cambian la tragedia.
- Los tres muertos son Álex, Marcos e Irene, en orden variable. **Nora nunca ocupa
  el primer hueco de muerte y siempre es el último POV.** Su final es
  NORA_DEAD o NORA_UNKNOWN (retcon aprobado en la Propuesta Maestra).
- Termina en negro → «DIEZ AÑOS DESPUÉS» → Agus contando la historia a Danna.
- El prólogo es un engaño: parece un coral tipo Until Dawn hasta que mueren todos.
- Trata sobre **cuánto consiguen comprender antes de desaparecer y qué dejan detrás**.

---

## 2. Personajes (fichas visuales en `assets/personajes/fichas/`)

### Nora — La creyente
- Rasgos: curiosa, lúcida, irónica, observadora. Intereses: folklore, leyendas,
  brujería, fenómenos. Lema: «Quería pruebas. No esto.» / «A veces las leyendas
  también te encuentran.»
- La nueva del grupo. Pareja de Marcos. No toma setas. Lleva péndulo, cuaderno,
  ouija, velas.
- Eje propio: **FASCINACIÓN**. Lo sobrenatural la recompensa emocionalmente hasta
  que un evento grave rompe la fascinación (FASCINATION_BREAK) y pasa de «Otra
  vez» a «Se acabó».
- Motor: conectar acontecimientos, formular teorías (NORA_THEORIES, algunas
  falsas), anotar. Su cuaderno sobrevive diez años.
- Evolución: fascinación → inquietud → comprensión → terror.
- Condena: flashes del pasado (gente entre los árboles, fuego), nunca voces de amigos.

### Marcos — El racional
- Rasgos: racional, pragmático, cínico, sarcástico, protector. Meta-humor sobre
  clichés del terror. Esconde el miedo bajo lógica y chistes. Amigo de Álex e
  Irene desde la facultad. Lema: «Si me ves muy tranquilo, desconfía.» /
  «Cuando deja de hacer chistes, corre.»
- Eje propio: **CONTROL**. Resolver un problema sube; no poder explicarlo baja.
  Cuanto menos control, más sarcasmo, más irritabilidad, más necesidad de actuar.
- Puede tomar setas (decisión D5). Si las toma: percepciones únicas, nadie le
  cree, él tampoco se cree.
- Su gran contradicción: no cree, pero le aterra equivocarse.
- Condena: la solución racional. El coche que siempre vuelve a la cabaña, la
  figura de Nora en la carretera, impacto, negro.

### Álex — El provocador
- Rasgos: fogoso, vacilón, narcisista, provocador. Intereses: fiesta, alcohol,
  drogas, grabaciones. Lema: «Si algo va a salir mal, al menos que sea divertido.»
  / «Juega con todo. Hasta que algo juega con él.»
- Carisma real: divertido media hora, luego «este tío es gilipollas». Sin filtro.
  Piropea a Nora sin tacto. Trae las setas. Graba todo y habla a cámara. Odia que
  le digan que no haga algo.
- Eje propio: **EGO**. Puede pesar más que el miedo («no tienes huevos» → sube).
- Con miedo se vuelve agresivo y desafiante: golpea, insulta, provoca.
- Saboteador natural de la ouija.
- Condena: algo aprende su juego y se lo devuelve. Golpes que se adelantan, su
  propia voz repitiendo frases de la fiesta, la voz de Irene pidiendo ayuda, y al
  final «Venga. Si estás ahí, sal.» detrás de él.

### Irene — La insinuante
- Rasgos: sutil, seductora, celosa, manipuladora. Intereses: atención, fiesta,
  deseo, juegos sociales. Lema: «No hace falta empujar demasiado. La gente cae
  sola.» / «Nunca compite de frente. Se acerca, sonríe… y desplaza.»
- Amiga de Marcos desde la facultad. Siempre sintió algo por él, nunca pasó nada.
  Ve a Nora como intrusa. Ataca con ambigüedad: anécdotas que excluyen, «¿te
  acuerdas de cuando…?», contacto excesivo. Puede tirar ficha a Marcos a solas.
- La que mejor lee a la gente. Sabe cuándo Álex actúa y cuándo tiene miedo.
- Eje propio: **CELOS / CONTROL SOCIAL**. Medidor oculto adicional: confianza en
  la realidad (su capacidad de reconocer a los demás).
- Con miedo pierde la máscara: llora, suplica, miente, puede abandonar a alguien.
  Busca a Marcos como refugio (y aprovecha para separarlo de Nora).
- Evolución: diversión → sospecha → desconfianza → aislamiento → terror.
- Condena: social, luego el baño de arriba. La bañera que se llena de un color
  imposible, la voz de Álex tras la puerta que pasa a estar arriba, la mujer del
  camisón en el techo. Su cuerpo aparece en la bañera cuando el agua ya no está.

### Dinámicas
- **Nora–Marcos: relación sana y madura por defecto** (pauta del autor, 28-09-2026).
  Se hablan con cariño, se buscan la mano, se creen, no se reprochan delante de los
  demás y resuelven a solas. Solo las decisiones del jugador (frialdad tras el beso,
  confianza rota, resentimiento acumulado) o el huésped la enfrían, y entonces se nota
  precisamente porque el resto del tiempo no es así. Los pensamientos «tensos» de Nora
  apuntan a Álex o a Irene antes que a Marcos.
- Álex–Irene: muy físicos y sexuales en público, compatibles siendo horribles. El
  contacto pasa de sexual a protección (mano bajo la falda → mano entrelazada →
  Irene agarrándole con las dos manos).
- Marcos + Álex + Irene son «los de antes». Nora entra en un grupo con historia.
- Álex sabe lo de Irene y Marcos y le da igual… hasta que Marcos responda.
- La intoxicación amplifica, no crea. Humanizar sin absolver.

---

## 3. La cabaña

| Espacio | Normalidad | Primer terror | Escalada | Pago |
|---|---|---|---|---|
| Comedor (mesa redonda) | fiesta | péndulo | ouija | grabación |
| Cocina | bebidas | sartén templada | placa encendida | sartén humeando sola |
| Salón | descanso | objetos/música | voces/figuras | reagrupamientos |
| Baño inferior | cotidiano | sonidos | refugio inseguro | evidencia menor |
| Dormitorio 1 | intimidad (Álex–Irene) | golpes en armario | imitación | relaciones |
| Dormitorio 2 | pertenencias | objeto desplazado | identidad dudosa | pistas |
| Baño superior | cotidiano | goteo | agua turbia/oscura | Irene / mujer del techo |
| Pasillo/distribuidor | tránsito | pasos | dobles/voces | orientación |
| Buhardilla | trampilla, cuerda, escalera plegable | roces, cuerda que desaparece | cajas, polvo, viga antigua | historia arquitectónica |
| Almacén (planta baja) | irrelevante | estantería ante puerta antigua | acceso | sótano |
| Sótano | inaccesible hasta el final | — | piedra, madera quemada, inscripción | Nora / lore |
| Porche | fumar (seguro) | observación | voces exteriores | falsa seguridad |
| Cobertizo (15 m) | generador | golpes | ruta Marcos | condena |
| Coche | transporte | luces interiores | salida | ruta exterior |
| Bosque | paisaje | sonidos | imitación, desorientación | condena |

Tres zonas: INTERIOR → PORCHE (seguro) → TERRENO (cruzar = DOOMED).
La casa se aprende primero como espacio pequeño y normal; después se desconfía de ella.
Anomalía espacial: **una sola** en todo el prólogo (HORROR 5), nunca se repite.

---

## 4. Sistema

### Estados globales (ocultos)
`HORROR_STAGE` (0–6, **nunca baja**), `HOUSE_ACTIVITY`, `GROUP_COHESION`,
`GROUP_SUPERNATURAL_CREDIBILITY`, `DEATHS`, `OUIJA_STATE`, `TIME_STAGE`.

| HORROR_STAGE | Permitido |
|---|---|
| 0 | detalles totalmente explicables (toda la Fase I) |
| 1 | coincidencias / ouija ambigua |
| 2 | percepciones privadas contradictorias (tras la ouija) |
| 3 | evidencia multitestigo (tras el evento imposible) |
| 4 | amenaza / primera muerte confirmada |
| 5 | casa hostil / aparición clara |
| 6 | colapso / Nora / sótano |

### Estados por personaje
Visibles (y no siempre): **Miedo, Estrés, Lucidez, Intoxicación**.
Ocultos: Paranoia, eje propio (Fascinación / Control / Ego / Celos), DOOMED,
profundidad de ruta por espacio (`DEPTH 0–4`), credibilidad contextual,
`KNOWLEDGE[personaje][hecho]`.

### Relaciones (ocultas, por pareja)
confianza, afecto, resentimiento, tensión sexual, protección, celos.
Nunca números en pantalla: se ven en quién cree, acompaña, arriesga, se enfada.

### Tipos de decisión (el jugador nunca ve la etiqueta)
MICRO (2–4 s, personalidad) · SOCIAL (relaciones) · EXPLORACIÓN (información) ·
POV (qué escena presencia) · CRÍTICA (irreversible).

### Fenómenos
- Presupuesto de anomalías por fase (Fase I: máx. 3 de una biblioteca de 10–12).
- Clasificación por testigos: PRIVATE → MULTI_WITNESS → CONTRADICTED → RECORDED.
- Semillas obligatorias: GIRL_APPEARANCE requiere 2 de {CHILD_VOICE,
  SMALL_FOOTPRINTS, CHILD_OBJECT, SHADOW_SMALL, OUIJA_CHILD_REFERENCE}.
  WOMAN_APPEARANCE requiere ruidos en techo, arañazos, polvo cayendo, miradas
  arriba. Bañera: goteo → agua → color → otra cosa. Sartén: templada → placa → humo.
- Niveles de lore 0–3; **máximo nivel 1 en el prólogo**.
- Hipótesis (no canon): la entidad aprende las voces con las horas.

### Condena
Cruzar el terreno activa `DOOMED` sin aviso. Se puede volver a entrar.
DOOMED → contaminación → presión de aislamiento → señuelo → falsa salida →
amenaza → muerte. 10–20 minutos. Quince pasos mínimos de una ruta mortal; no se
puede saltar del 3 al 14. La muerte no se anuncia: negro y cambio de POV.
La ausencia precede a la certeza.

### Resolución automática del personaje no controlado
personalidad + estado psicológico + relaciones + información conocida + posición
+ flags + contexto de escena. Nunca congelado, nunca aleatorio.

---

## 5. Estructura (grafo definitivo)

```
FIESTA → DESINHIBICIÓN → MICROANOMALÍAS → LEYENDA ÁLEX → CONTRAHISTORIA NORA
→ OUIJA → PRIMERA DISPERSIÓN (rutas A/B) → REAGRUPAMIENTO → EVIDENCIA COMPARTIDA
→ RUPTURA / APAGÓN → PRIMER CRUCE DEL LÍMITE → DOOM_1 → FALSO ALIVIO
→ PRIMERA DESAPARICIÓN → BÚSQUEDA → PRIMERA MUERTE CONFIRMADA → HORROR 4
→ GRABACIONES / RECONSTRUCCIÓN → SEGUNDA DISPERSIÓN FORZADA → MUERTE 2
→ CASA HOSTIL → ANOMALÍA ESPACIAL → MUERTE 3 → NORA ÚNICO POV → REGLA INTUIDA
→ OUIJA: ABAJO → SÓTANO → NORA_DEAD / NORA_UNKNOWN → MESA VACÍA → NEGRO
→ DIEZ AÑOS DESPUÉS
```

Cada fase destruye una seguridad: estamos entre amigos → conocemos la historia →
controlamos el juego → sabemos dónde están los demás → podemos confiar en nuestros
sentidos → podemos salir → podemos sobrevivir.

### Fase I — Desinhibición (20–30 min, HORROR 0)
Apertura in medias res. Bloques A–M, decisiones D1–D18. Rotación de POV
Marcos → Nora → Álex → Irene. Primera elección real de perspectiva en D10.
Decisiones sistémicas: D5 setas de Marcos, D11A buhardilla de Irene, D11B sartén,
D14 símbolo de la mesa (foto/nota/nada), D16 responder a los golpes, D18 música.
Converge en «Vale. Yo tengo una historia.»

### Fase II — Leyenda de Álex
Texto definitivo: el monólogo completo aportado por el autor (campanilla, siete
ofrendas, niña construida, «Él también le tiene miedo», pactos que se cobran en
quien más quieres, «La puerta deja de dejarte salir»). Microdecisiones de
reacción sin cortar el relato. Pequeños fenómenos integrados en la broma.

### Fase III — Contrahistoria de Nora (< 2 min)
La mujer existió, ayudaba, fue denunciada, Inquisición, tenía una hija, las
atrocidades aparecen mucho después. Álex: «Pregúntaselo. A ella.» → «Entonces no
puede pasar nada.»

### Fase IV — Ouija (HORROR 1 → 2) · `js/story_fase4.js` (reescrita 28-09-2026)
Trece escenas en una sola cadena con POV dinámico. Al montar la mesa el jugador elige
carta (Nora / Marcos / Irene; Álex no es elegible porque lleva el vaso) y esa carta
decide **qué información privada posee el jugador**, no qué ocurre. Ocurre lo mismo
siempre:

1. Preparación con la mesa llena del caos de la fiesta. Álex e Irene improvisan una
   broma: Irene afloja la bombilla de la lámpara colgante y prueba golpes con el talón
   desnudo contra el travesaño mientras Álex distrae a Nora con el péndulo. Solo POV
   Irene lo ve; Marcos puede fijarse en la silla sin entender nada.
2. Álex mueve el vaso a ADIÓS antes de empezar; Nora se mosquea de verdad; Álex baja el
   tono («Palabra. De médium.»).
3. Respuestas falsas de Álex, que es el único que toca el vaso: SÍ (pregunta Irene), NO
   (¿te cae bien Álex?), IRENE (¿con quién de esta mesa quieres hablar?). Golpes de
   Irene. Nora, si no entra al trapo de «estoy sintiendo una energía», ve dos llamas
   inclinarse a la vez (anomalía privada `llama_velas`). No existe la opción «mirar la
   vela»: la decisión es social.
4. Al escribirse IRENE, Irene deja de respirar de verdad. CONTACTO. Álex cree que actúa
   (si ella le hace una señal, le guiña un ojo). Se levanta, golpea la mesa, las velas se
   apagan, la bombilla parpadea y muere. Todo tiene explicación menos el ahogo, y eso
   solo lo sabe Irene.
5. Marcos reacciona a oscuras: persona / lámpara / cocina (POV Marcos elige; si no,
   `decidirMarcos`: afecto y protección hacia Irene contra su necesidad de control, con
   las setas restando y la mirada de Irene sumando). Si Irene se viene abajo y él le hace
   la respiración, siente una corriente helada en dirección contraria: HUÉSPED = Marcos.
   Ocurre la llevemos o no; solo en su POV lo lee el jugador. Si no, HUÉSPED = Irene y
   respira sola.
6. Se descubre la broma: Marcos con la bombilla floja, o Nora pillando a Álex arreglándola
   demasiado rápido («¿Cómo sabías que era la bombilla?»). «Sois unos gilipollas.» Álex
   cobra el «yo nunca» de Nora («Estamos en paz»). Si hubo golpes reales en Fase I,
   Marcos puede preguntar por los de la pared: «Esos no» es la única frase honesta de
   Irene y nadie la cree. Irene miente («me he metido demasiado en el papel») o dice la
   verdad una vez; la cree, como mucho, Marcos si sintió el frío. Todos reinterpretan el
   ahogo como teatro. La tensión cae: es la anestesia antes de ALDA.
7. Si Marcos la rescató, Irene le besa («Mi héroe»): convierte su miedo en poder social.
   Nora tiene tres posiciones reales (reproche a Irene / broma / frialdad con Marcos) y
   una cuarta lúcida (callarse). Sin POV Nora, `decidirNora` usa confianza en Marcos,
   resentimiento con Irene, alcohol y estrés; el silencio es una reacción posible y pesa.
   El texto reconoce si ya hubo boca de Irene en Marcos esta noche.
8. Irene se queda o se va con frases, no con etiquetas («Estoy bien. Seguid.» / «Voy a por
   una cerveza.» / «Necesito mear.»). Sin POV Irene, `decidirIrene`: si la sostuvieron se
   queda; si nadie la tocó se va, al baño si no tiene la máscara puesta.
9. Sesión seria con Nora al mando y Álex moviendo: SÍ («Estoy moviéndolo. No estoy...
   eligiendo.»), ALDA (Nora la reconoce y lo oculta; a Álex le cambia la cara y Nora lo
   ve), AJOBA (las letras de ABAJO desordenadas; Irene lee «alcoba, le falta una ele»;
   Nora lo anota tal cual con jota), nada, nada. La sesión no es Google. Si Irene subió
   al baño, oye su nombre en el pasillo (`voz_nombre`) y puede grabarse un vídeo.
10. Vuelta al tono ocioso: Álex pone música, «Se acabó el velatorio», cervezas, «Hasbro
    satánico», Álex a cámara con el móvil de Irene. Marcos: «Efecto ideomotor. Lo digo
    para que conste.» Señal mínima del huésped desde fuera (manos heladas de Marcos /
    Irene tragando con la mano en el cuello). El vaso unos centímetros más lejos
    (`vaso_final`). HORROR 2.

Ningún vaso se mueve solo en cámara durante la sesión. Lo que la hace real para Nora es
ALDA. Álex es el único que sabe con certeza que no eligió ALDA ni AJOBA, y nadie le cree.
Lo que Nora explica del ritual sigue siendo creencia suya, no regla del mundo.

### Fase V — Primera dispersión (HORROR 2) · `js/story_fase5.js` (escrita 28-09-2026)
Nadie explora. A las 03:30 se dispersan por necesidades: Álex sale a fumar y le ofrece
un porro a Nora (Nora no fuma tabaco); Irene sube a por una sudadera; Marcos va al
cuadro de luces; Nora quiere ver la cuerda de la trampilla. **La configuración sale del
estado, no de un menú**, y las parejas no solo caben: son donde se planta el huésped.

- **Decisión de Nora** (única decisión previa): salir con Álex, subir sola, o pedirle a
  Marcos que suba con ella (solo si confía en él o tiene miedo alto).
- **Reparto** (`repartir`): Marcos acepta subir con Nora salvo que ella le dejara helado
  con el beso. Irene pide compañía a Marcos si oyó su nombre en la ouija, tiene miedo
  o hay tensión con él; Marcos acepta si la aprecia o la rescató. Si Irene es la
  huésped no pide nada y sube callada, pero Marcos puede seguirla porque la ha visto
  rara. Configuraciones resultantes: 2+1+1 lo normal, 2+2 (Álex+Nora / Irene+Marcos) la
  cargada, 1+1+1+1 cuando las relaciones están bien y nadie tiene miedo.
- **Dos cartas** (máximo dos rutas jugadas): el grupo de Nora y el grupo de la huésped
  (si la huésped va con Nora: Irene, o Álex si Irene no oyó nada). Las rutas no seguidas
  se resuelven con `resolverRuta(api, ruta, false)` con las mismas banderas.
- **Rutas y percepción privada (una por ruta, nunca compartida):**
  - Porche (Álex, ± Nora): golpes en la barandilla que se adelantan a su mano; la luz
    interior del coche de Marcos se enciende sola; Álex oye a Irene decir su nombre
    desde los árboles (Irene está arriba); puede bajar hasta el último escalón y hasta
    poner un pie en la grava sin cruzar (`alex_piso_grava`, semilla de la Fase VII).
    Nora, si va, ve un segundo a gente de pie entre los troncos mirando la casa y huele
    a leña y a pelo (su lenguaje de condena; nunca voces).
  - Arriba (Irene, ± Marcos): un golpe dentro del armario del dormitorio; el olor
    dulce; una marca a la altura de la cadera en el fondo del armario; el agua que
    suena y no corre; la voz de Álex pegada a la puerta del baño (Álex está fuera).
    En pareja, quien se queda en el pasillo oye el grifo y quien entra lo ve seco.
  - Almacén (Marcos solo): el piloto rojo de la placa encendido con el mando en cero;
    el diferencial saltado; la única pared de piedra de la casa detrás de la
    estantería, con aire frío por la rendija; un arrastre con peso detrás. Si aparta la
    estantería: la puerta antigua, baja, con candado. No se abre. Es el sótano de la
    Fase XII, que ahora existe mucho antes de que Nora lo necesite.
  - Buhardilla (Nora, ± Marcos): la viga vieja, quemada, con seis rayas iguales y una
    séptima más nueva; huellas pequeñas y descalzas en el polvo que van hasta la pared
    caliente de la chimenea y no vuelven; una muñeca de trapo con los párpados cosidos y
    algo duro dentro que no suena (si Nora la abre: una campanilla sin badajo). La
    trampilla se cierra con ella dentro; sola, al bajar, la cuerda ha desaparecido.
- **El huésped a nivel 1.** Un pensamiento que no es suyo («Abajo.» en Marcos frente a
  la estantería, que es AJOBA cobrándose; «Aliento.» en el pasillo o en el baño: una
  de las siete ofrendas de la leyenda). Un lapso: no contesta a su nombre, no recuerda
  haber movido la estantería o cogido una muñeca. Y **si va acompañado y su estado o la
  relación lo cargan** (`danoMarcosA`, `danoIreneAMarcos`): Marcos sujeta el brazo de
  Irene o el tobillo de Nora en la escalera diciendo «Todavía no» (su firma; conecta
  con «la puerta deja de dejarte salir»); Irene sostiene la mano de Marcos bajo el agua
  hirviendo. Quedan marcas como evidencia y el huésped no se acuerda. Desde fuera:
  Marcos no hace chistes; Irene deja de leer a la gente.
- **Reagrupamiento** (`v9_regreso`, POV Nora): cada uno decide en su ruta si lo cuenta.
  Álex lo cuenta todo; Irene no cuenta nunca salvo que no pueda más; Marcos cuenta los
  hechos (diferencial, puerta) y calla lo que oyó; Nora cuenta o apunta. Que les crean
  lo decide `api.contar` (credibilidad + confianza). Contradicción central: Álex oyó a
  Irene fuera e Irene oyó a Álex arriba, al mismo tiempo, cada uno donde no estaba el
  otro. La muñeca, si Nora la baja, es el primer objeto que ven los cuatro. Las marcas
  se ven y nadie sabe explicarlas, tampoco quien las hizo. Cierra con el techo encima
  de la mesa, «algo que todavía no ha empezado a andar»: los pasos de la Fase VI.
- Sin niña, sin mujer. Semillas dejadas: huellas pequeñas y objeto de niña (dos de las
  cinco que exige GIRL_APPEARANCE), arañazos bajo el suelo, mirada al techo.

### Fase VI — Evidencia compartida (HORROR 3)
Pasos en el techo que los cuatro oyen. «Ratas.» «No.» Clic de la trampilla.
Segunda dispersión (quién sube). Falsa alarma real (una rama). Primera mención de
irse. El evento imposible: todos ven a alguien subir y ese alguien entra desde el
porche. No se enseña quién subió. «Todo el mundo se queda aquí.»

### Fase VII — Ruptura
Apagón. El generador está fuera, a 15 m. Quién sale depende de estados. Cruza,
arregla, vuelve, la casa se ilumina. Falso alivio. DOOMED sin aviso.

### Fases VIII–XI — Muertes
Ruta de condena del primero (vivida o vista como desaparición). Búsqueda.
Grabaciones. Segunda dispersión forzada por necesidad real. Muerte 2. Anomalía
espacial única. Sartén. Muerte 3 con el tramo íntimo Nora + último superviviente.

### Fase XII — Nora
Cuaderno: «Empieza fuera.» / «Los tres salieron.» La ouija escribe ABAJO sin
manos. El almacén, la estantería, la puerta antigua, el sótano de piedra.
Final A (muerte aparente) o Final B (segunda cámara, incredulidad, corte).
Última imagen: la mesa vacía, batería baja, nada, negro.

---

## 6. Reglas duras del motor narrativo (fusión de las dos listas)

1. Nunca modificar HORROR_STAGE salvo que la escena lo autorice; nunca reducirlo.
2. Nunca salvar ni resucitar a un DOOMED; nunca matarlo inmediatamente.
3. Nunca revelar lore por encima del nivel permitido ni inventar lore o reglas sobrenaturales.
4. Nunca inventar respuestas de la ouija: catálogo cerrado.
5. Nunca congelar personajes fuera del POV.
6. Nunca convertir una decisión de exploración directamente en aparición.
7. Una exploración puede terminar sin que ocurra absolutamente nada.
8. Nunca fenómenos «porque dan miedo»: cada uno con antecedente o pago futuro.
9. Nunca niña ni mujer sin sus semillas previas.
10. Nunca el mismo lenguaje de horror para dos personajes.
11. Nunca jumpscares como sustituto de progresión.
12. Nunca microdecisión convertida en rama larga.
13. Nunca decisión sin consecuencia narrativa identificable.
14. Nunca invalidar una decisión anterior sin causa.
15. Nunca GAME OVER. La muerte cambia el POV, no reinicia.
16. Nunca revelar la identidad real de ninguna entidad durante el prólogo.

---

## 7. Evidencias que sobreviven diez años
Cuaderno de Nora (ALDA y AJOBA con jota) · vídeo de la mesa (el móvil de Irene graba la
broma, el ahogo, el apagón y el rescate; nunca el frío) · foto del símbolo · grabación
de Álex · móvil de Marcos (opcional: segundo ángulo de la ouija) · vídeo del coche ·
grabación de Irene (opcional: diez segundos en el baño de arriba) · tablero de ouija ·
péndulo · objetos de buhardilla · marcas en baño · evidencia del sótano.
Cada escena importante responde: **¿qué queda después?**

---

## 8. Contradicciones resueltas (manda la versión posterior)

| Tema | Versión antigua | Versión que manda |
|---|---|---|
| Leyenda de Álex | resumen de la curandera que traslada el mal, «Cuando ella vuelva a llamaros…» | monólogo completo con campanilla y siete ofrendas |
| Irene | empática, confía demasiado, «de las más sensatas» | insinuante, celosa, manipuladora (se conserva: la mejor lectora de personas, «Tú también lo has visto», confianza en la realidad) |
| Muertes | los cuatro mueren, cualquiera puede ser el último | Nora siempre última, NORA_DEAD / NORA_UNKNOWN |
| Álex sube y ve a la niña | bloque del POV coral | prohibido; la niña es un proceso |
| Primera evidencia compartida | cae la cuerda de la buhardilla | solo «clic» de la trampilla |

## 9. Decisiones cerradas (28-09-2026)

1. **Señal al cruzar el límite**: una campanilla, una sola vez, casi inaudible, mezclada con el ambiente. Conecta con la campanilla de la niña en la leyenda. Nadie la comenta en el prólogo.
2. **Irene**: la insinuante, tal como está en fichas y juego. Ojos azules.
3. **Alda**: palabra sin significado fijado en todo el prólogo. Nora la anota; Danna la encuentra.
4. **Sabotajes de la ouija** (revisado 28-09-2026): Álex lleva el vaso toda la sesión y sus respuestas falsas son fijas (ADIÓS, SÍ, NO, IRENE); lo que el jugador decide es desde qué POV las ve y qué hace cada uno alrededor. Irene aporta la bombilla floja y los golpes con el talón (va descalza desde la Fase I). El «yo nunca he hecho trampas en una ouija» de Nora (bebió) se cobra al descubrirse la broma: «Tú hiciste trampas con catorce años. Estamos en paz.» Las respuestas reales (ALDA, AJOBA) llegan a través de las manos de Álex, que no las elige; **Nora sabe que ALDA es real porque nadie puede conocer la palabra**, y lo oculta. El vaso solo se mueve sin manos al final, fuera de cámara.
5. **Evidencias obligatorias**: solo el cuaderno de Nora y el vídeo de la mesa (móvil de Irene desde la ouija). El resto, variable.

## 10. Sistemas del motor (implementados en Fase I)

### Vestuario (fichas)
Nora: pantalón negro con cinturón, camiseta holgada sin nada debajo, **la camisa negra de Marcos** encima (la que Irene le regaló a él hace tres años). Marcos: camisa de cuadros sobre camiseta negra. Álex: camisa estampada abierta, collares. Irene: top blanco de botones que no cierran, shorts vaqueros. **Nora no fuma tabaco**, solo porros. **Nora nunca toma setas**.

### Consumo gradual
`api.consumir(id, tipo)`. Nada es inmediato. Seta: +1,5 intox y −0,5 lucidez por escena, **sin fin, todo el prólogo**; varias setas se suman. Porro: 3 escenas. Chupito: 2. Cerveza: 1. Lucidez no baja de 20 por consumo. Cada escena etiqueta su **consumo narrativo** (lo que el texto dice que beben). **Deriva de fondo** en Fase I: +0,5 intox a todos por escena; desaparece cuando la noche cambia. Si Marcos rechaza su seta, Álex se la come y cuenta.

### AUTO_RESOLVE
En cada bifurcación de perspectiva, cada carta lleva `auto(api)`: lo que hace ese personaje si no le seguimos. Reglas **deterministas con umbrales**, **esencia antes que estados**: Marcos casi nunca hace nada poco racional; Álex e Irene terrenales, Álex despreocupado, Irene más lista. Deja los mismos flags, conocimientos y relaciones que la rama visible (la rama visible aplica sus efectos en `alEntrar` para que pesen igual). El jugador **no ve nada explícito**: solo lo que oye a los personajes y los indicadores en Ver detalles. Lo no visto no se puede asegurar.

### Credibilidad
`api.credibilidad(id)` → alta / media / baja, según lucidez menos miedo, estrés e intoxicación. Cuando alguien cuente lo que hizo fuera de cámara, que le crean depende de cómo suene en ese momento. Para Fase II.

### Marcos graba
Opciones de grabar o fotografiar en momentos que le pegan, siempre con alternativas igual de buenas: el brindis (vídeo), la sartén con el reloj (foto), la pared que golpea (audio). Evidencias persistentes.

### Muerte fuera de cámara
Misma máquina que AUTO_RESOLVE. Matices pendientes al llegar a las rutas de condena.

## 11. Lo que falta recibir
- Fichas de escenarios (fondos por espacio y por nivel de horror).
- Música: ambiente de fiesta, tensión, terror, silencio.
- Edad, estudios y ciudad de los cuatro (pendientes en las fichas).

## 12. Elección de POV por incidente (Fase IV)
Una carta al principio de un incidente largo fija `ouija_pov` y la cadena entera usa
`pov: (api) => P(api)`. No son tres cadenas: es una sola con bloques condicionados por la
carta. Cada POV tiene exactamente dos momentos propios (Nora: la llama y el beso; Irene:
la preparación y el ahogo; Marcos: la reacción y el traspaso) y microdecisiones
caracterizadas en el resto, nunca etiquetas («mirar la vela», «quedarse por miedo»). Lo
que hacen los otros dos se resuelve con `decidirMarcos`, `decidirNora` y `decidirIrene`
en el `alEntrar` de la escena siguiente, dejando **las mismas banderas** que la rama
visible. El mundo no cambia según dónde esté la cámara; cambia lo que el jugador sabe.

## 13. El huésped (CONTACTO) — para las fases V en adelante
Banderas: `contacto = true`, `contacto_inicial = "irene"`, `huesped = "irene" | "marcos"`.
Nadie lo llama posesión: para los personajes solo ha habido un ahogo y una broma.

- **Gradual y difuso.** Nivel 0 en la Fase IV: una sola señal desde fuera (las manos
  heladas de Marcos en la nuca de Nora, «Es la casa»; Irene tragando con la mano en el
  cuello cada vez que se ríe). Sube como mucho un nivel por fase y **nunca baja**.
- **Desde dentro (cuando el huésped es POV):** pensamientos intrusivos en las líneas `~`
  que no son suyos. Primero extrañeza («eso no lo he pensado yo»). Después paranoia
  hostil hacia alguien concreto (en Marcos, hacia quien le quita el control; en Irene,
  hacia quien le quita a Marcos). Después impulsos: opciones que el jugador puede
  rechazar, siempre con una alternativa igual de buena y sin etiqueta. Lo evidente es
  la duda y el miedo interno del POV, no el fenómeno.
- **Desde fuera (cuando no lo es):** cambios de actitud que los demás notan y el jugador
  lee en el texto: contesta tarde, mira demasiado rato, tiene frío, se queda quieto,
  deja de hacer chistes (Marcos) o deja de leer a la gente (Irene, su medidor oculto de
  confianza en la realidad). Los demás lo racionalizan (setas, susto, alcohol) hasta
  que no pueden.
- **Peligro a solas.** Ya en el nivel 1 (Fase V), si el huésped va acompañado y su
  estado o la relación con el otro están cargados, sujeta o quema: deja marca y no se
  acuerda. A partir del nivel 2, compartir escena a solas con el huésped puede ser una
  ruta de condena para el otro. La muerte no se anuncia. El huésped no lo sabe, o lo
  sabe demasiado tarde. Su firma verbal es «Todavía no».
- **Finales.** El huésped abre variantes. En Marcos conecta con su condena racional (el
  coche que vuelve, la figura de Nora en la carretera: quién conduce y qué ve). En Irene
  con el baño de arriba: el ahogo de la ouija es un ahogamiento en seco y la bañera lo
  cobra. Quién es el huésped condiciona quién muere primero y qué queda grabado.
- **Lo que sabe cada uno al salir de la ouija.** Irene: que el ahogo fue real
  (`ahogo_real`). Marcos: si hizo la respiración, el frío (`aliento_frio`) y quizá cree a
  Irene (`marcos_cree_irene`). Nora: quizá la llama (`llama_velas`) y ALDA. Álex: nada;
  es el que menos información auténtica tiene pese a llevar el vaso, y el único que sabe
  que no eligió las palabras.
- **La intoxicación acelera, no crea.** Marcos con setas se lo achaca a las setas y el
  jugador también; sin setas no tiene excusa y pesa más.
- **Irene fuera de la mesa.** Si se fue al baño en la ouija (`irene_fuera = "bano"`), su
  ruta de la Fase V (la voz) ya tiene un primer paso dado. Si se fue a por una cerveza,
  no.
