# Aventura narrativa — Documento de diseño

## Objetivo
Aventura narrativa web (HTML/JS sin dependencias), género terror/suspense, fiel al
material aportado por el autor pero contada con inmersión.

## Requisitos de interfaz (acordados 2026-09-27)
- **Interfaz moderna y oscura**, con imagen de fondo a pantalla completa que cambia
  según la escena o situación.
- **Cuadro de texto** legible donde ocurre la historia. Debe distinguirse claramente:
  - narración,
  - diálogo (quién habla, con nombre visible y estilo propio por personaje),
  - pensamientos del protagonista.
- **Botones de elección** para decisiones normales.
- **Cartas de personaje**: cuando la decisión sea elegir entre personajes aparecen
  una, dos o más cartas (imagen + nombre + descripción breve) y se pincha en la elegida.
- **Música ambiental** que cambia según el momento: terror, fiesta, tensión, etc.
  Con botón de silencio. (Los navegadores exigen una interacción del usuario antes
  de reproducir audio: se arranca en el primer clic.)
- Imágenes de personajes y fondos las aporta el autor.

## Estructura de carpetas
```
index.html
css/style.css
js/engine.js        motor genérico (no toca la historia)
js/story.js         la historia: escenas, personajes, fondos y música
assets/fondos/      imágenes de fondo
assets/personajes/  retratos para las cartas
assets/musica/      pistas de audio (mp3/ogg)
DISEÑO.md           este documento
```

## Formato del texto de escena
Cada párrafo va separado por una línea en blanco. Prefijos:
- Sin prefijo → narración.
- `Nombre: texto` → diálogo de ese personaje.
- `~ texto` → pensamiento del protagonista.

## Pendiente
- Recibir el material del autor (texto, imágenes, notas).
- Analizarlo y proponer estructura de escenas, personajes, ramas y finales.
- Escribir `js/story.js` a partir de esa propuesta.
