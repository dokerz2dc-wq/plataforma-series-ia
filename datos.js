/* ============================================================
   datos.js — EL ÚNICO ARCHIVO QUE NECESITAS EDITAR
   ------------------------------------------------------------
   Para agregar una serie nueva: copia un bloque de SERIES,
   cámbiale el "id", el título y los episodios. Listo.
   No hace falta tocar index.html, estilos.css ni app.js.
   ============================================================ */


/* ---------- 1. CONFIGURACIÓN GENERAL ---------- */
const CONFIG = {
  nombreSitio: "Series IA",

  // id de la serie que aparece en el banner principal
  destacada: "motomanada",

  // Reel vertical que se muestra al lado del banner.
  // Déjalo en null si no quieres reel arriba.
  reelBanner: "https://www.instagram.com/p/De4zHLYoeCQ/",

  // Contacto del botón "Sube tu serie"
  contacto: {
    correo: "dokerz2dc@gmail.com",
    whatsapp: "",            // <-- PENDIENTE: número con indicativo, ej. "573001234567" (sin + ni espacios)
    asunto: "Quiero subir mi serie a Series IA",
    mensaje: "Hola, quiero subir mi serie hecha con IA a Series IA. Te cuento de qué se trata:"
  }
};


/* ---------- 2. AUTORES ---------- */
/* foto: URL de una imagen. Si la dejas en "", se genera un
   avatar con las iniciales automáticamente.
   Las redes que dejes en "" simplemente no muestran botón.   */
const AUTORES = [
  {
    id: "visionario-david",
    nombre: "Visionario David",
    rol: "Creador de Motomanada",
    foto: "",
    bio: "Recorro Colombia en moto con Onis y Firu, mis dos perros. Convierto esos viajes en series hechas con IA: historia, naturaleza y un poco de viaje en el tiempo.",
    redes: {
      youtube:   "",   // <-- PENDIENTE: pega aquí tu canal
      instagram: "",   // <-- PENDIENTE
      tiktok:    "",   // <-- PENDIENTE
      facebook:  ""    // <-- PENDIENTE
    }
  },
  {
    // ---- autor de ejemplo (ficticio, solo para ver el catálogo con varios autores) ----
    id: "lia-moreno",
    nombre: "Lía Moreno",
    rol: "Autora de ejemplo",
    foto: "",
    bio: "Autora ficticia incluida como ejemplo. Hace ciencia ficción corta con animación generada por IA.",
    redes: { youtube: "", instagram: "", tiktok: "", facebook: "" }
  },
  {
    // ---- autor de ejemplo (ficticio) ----
    id: "tomas-varela",
    nombre: "Tomás Varela",
    rol: "Autor de ejemplo",
    foto: "",
    bio: "Autor ficticio incluido como ejemplo. Documentales ilustrados sobre pueblos que ya no existen.",
    redes: { youtube: "", instagram: "", tiktok: "", facebook: "" }
  }
];


/* ---------- 3. SERIES Y EPISODIOS ---------- */
/* estado:    "disponible" | "proximamente"
   portada:   URL de imagen. Si la dejas en "", se genera una
              portada con degradado y el título.
   episodios: cada uno es
              { titulo, sinopsis, duracion, tipo:"youtube",   video:"ID_O_ENLACE" }
              { titulo, sinopsis, duracion, tipo:"instagram", video:"ENLACE_DEL_REEL" }  */
const SERIES = [
  {
    id: "motomanada",
    titulo: "Motomanada, Historias sobre Ruedas",
    autorId: "visionario-david",
    anio: 2026,
    categorias: ["Aventura", "Historia", "Animación IA"],
    estado: "disponible",
    portada: "",
    sinopsis: "Una moto que también es máquina del tiempo. En cada episodio, Visionario David y sus perros Onis y Firu llegan a un lugar real de Colombia y lo ven cambiar de época frente a sus ojos: el paisaje de hoy, la aldea precolombina, la erupción que lo arrasó todo. Los perros hablan mediante un implante y no se quedan callados.",
    episodios: [
      {
        titulo: "Episodio 1 · Cañón del Combeima",
        sinopsis: "Subida al cañón del Combeima. David marca una fecha en el tablero, levanta la mirada y el cañón ya no es el mismo: tres mil seiscientos años atrás, con el Nevado del Tolima a punto de hacer lo suyo.",
        duracion: "Episodio completo",
        tipo: "youtube",
        video: "pTGh6yX31xo"
      },
      {
        titulo: "Adelanto · Reel vertical",
        sinopsis: "El reel corto con el que arranca la historia, tal como se publicó en Instagram.",
        duracion: "Reel",
        tipo: "instagram",
        video: "https://www.instagram.com/p/De4zHLYoeCQ/"
      }
    ]
  },

  {
    // ---- serie de ejemplo ----
    id: "ecos-de-marte",
    titulo: "Ecos de Marte",
    autorId: "lia-moreno",
    anio: 2026,
    categorias: ["Ciencia ficción", "Animación IA"],
    estado: "proximamente",
    portada: "",
    sinopsis: "Serie de ejemplo. La primera colonia en Marte empieza a recibir mensajes de radio en un idioma que nadie programó. Seis episodios cortos hechos con imagen y voz generadas por IA.",
    episodios: []
  },

  {
    // ---- serie de ejemplo ----
    id: "el-ultimo-jardin",
    titulo: "El Último Jardín",
    autorId: "tomas-varela",
    anio: 2026,
    categorias: ["Documental", "Historia"],
    estado: "proximamente",
    portada: "",
    sinopsis: "Serie de ejemplo. Pueblos que quedaron bajo el agua cuando se construyeron las represas, reconstruidos imagen por imagen a partir de fotos viejas y relatos de los que alcanzaron a salir.",
    episodios: []
  }
];


/* ---------- 4. FILAS DEL CATÁLOGO ---------- */
/* Cada fila es un título + los ids de las series que muestra.
   Si pones series: "todas", la fila se llena sola.          */
const FILAS = [
  { titulo: "Estrenos en Series IA", series: ["motomanada"] },
  { titulo: "Próximamente",          series: ["ecos-de-marte", "el-ultimo-jardin"] },
  { titulo: "Todo el catálogo",      series: "todas" }
];
