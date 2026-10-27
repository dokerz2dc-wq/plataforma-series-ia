# Series IA

Catálogo web tipo Netflix para series hechas con inteligencia artificial, de autores
independientes. Sitio **estático**: HTML, CSS y JavaScript. Sin base de datos y sin
pasos de compilación.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La estructura de la página. Casi nunca hay que tocarla. |
| `estilos.css` | El diseño oscuro tipo Netflix. |
| `app.js` | La lógica: filas, buscador, modal, reproductores. No hay que tocarla. |
| **`datos.js`** | **Aquí se agregan autores, series y episodios.** Es el único archivo que se edita a diario. |

## Cómo agregar una serie

Abre `datos.js` y copia un bloque dentro de `SERIES`:

```js
{
  id: "mi-serie",                    // sin espacios ni tildes
  titulo: "Mi Serie",
  autorId: "visionario-david",       // debe existir en AUTORES
  anio: 2026,
  categorias: ["Aventura"],
  estado: "disponible",              // o "proximamente"
  portada: "",                       // vacío = se genera sola
  sinopsis: "De qué se trata.",
  episodios: [
    { titulo: "Episodio 1", sinopsis: "...", duracion: "12 min",
      tipo: "youtube",   video: "pTGh6yX31xo" },              // ID o enlace de YouTube
    { titulo: "Adelanto",   sinopsis: "...", duracion: "Reel",
      tipo: "instagram", video: "https://www.instagram.com/p/XXXX/" }
  ]
}
```

Luego añade su `id` a una fila en `FILAS` (o deja que salga en "Todo el catálogo").

## Videos

- **YouTube**: se inserta con el reproductor oficial (`youtube-nocookie.com`). Sirve el
  ID (`pTGh6yX31xo`) o el enlace completo.
- **Instagram**: se usa el código de inserción oficial (`blockquote.instagram-media` +
  `embed.js`). Si Instagram bloquea la inserción, la página muestra sola un botón
  para abrir el reel.

## Publicación

No requiere compilación. En Netlify y en Cloudflare Pages:

- Comando de compilación: *(vacío)*
- Carpeta de publicación / directorio de salida: `/` (la raíz)

## Prueba local

```bash
python3 -m http.server 8080
# abrir http://localhost:8080
```
