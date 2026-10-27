/* ============================================================
   Series IA — app.js
   Lee todo de datos.js y dibuja la página. No necesitas editarlo
   para agregar series: eso se hace en datos.js.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- utilidades ---------- */
  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  const esc = (t) =>
    String(t == null ? "" : t)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  const normal = (t) =>
    String(t == null ? "" : t).toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "");

  const autorDe  = (serie) => AUTORES.find((a) => a.id === serie.autorId) || null;
  const serieDe  = (id)    => SERIES.find((s) => s.id === id) || null;
  const hash     = (t) => { let h = 0; for (const c of String(t)) h = (h * 31 + c.charCodeAt(0)) % 9973; return h; };

  /* ---------- IDs / URLs de video ---------- */
  function idYoutube(v) {
    if (!v) return "";
    if (!/[/.?=]/.test(v)) return v.trim();            // ya es un ID
    const m = String(v).match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([A-Za-z0-9_-]{6,})/);
    return m ? m[1] : "";
  }
  function urlInstagram(v) {
    if (!v) return "";
    const m = String(v).match(/instagram\.com\/(p|reel|reels|tv)\/([A-Za-z0-9_-]+)/);
    return m ? "https://www.instagram.com/" + (m[1] === "reels" ? "reel" : m[1]) + "/" + m[2] + "/" : String(v);
  }

  /* ---------- imágenes generadas (sin archivos externos) ---------- */
  const PALETAS = [
    ["#1b1035", "#5b2a86", "#28d9d2"],
    ["#0d1b2a", "#1b4965", "#62b6cb"],
    ["#2b0a12", "#7a1024", "#ff6b4a"],
    ["#101c14", "#1f4d2e", "#8ddf6c"],
    ["#1a1024", "#3d2a6b", "#ff9ecd"],
    ["#241603", "#7a4a0f", "#ffc24a"]
  ];

  function corta(txt, max) {
    const pal = String(txt).split(/\s+/);
    const out = []; let linea = "";
    for (const p of pal) {
      if ((linea + " " + p).trim().length > max) { if (linea) out.push(linea); linea = p; }
      else linea = (linea + " " + p).trim();
    }
    if (linea) out.push(linea);
    return out.slice(0, 3);
  }

  function portadaGenerada(titulo, vertical, sinTexto) {
    const p = PALETAS[hash(titulo) % PALETAS.length];
    const w = vertical ? 540 : 960, h = vertical ? 960 : 540;
    let capaTexto = "";
    if (!sinTexto) {
      const lineas = corta(titulo, vertical ? 16 : 22).slice(0, 2);
      const fs = vertical ? 46 : 50;
      const base = h - 46 - (lineas.length - 1) * fs * 1.14;
      capaTexto =
        `<rect x="0" y="${h * 0.52}" width="${w}" height="${h * 0.48}" fill="url(#velo)"/>` +
        lineas.map((l, i) =>
          `<text x="46" y="${base + i * fs * 1.14}" font-family="Segoe UI,Arial,sans-serif" font-size="${fs}" font-weight="750" fill="#ffffff" opacity=".95">${esc(l)}</text>`
        ).join("");
    }
    const svg =
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${p[0]}"/><stop offset="1" stop-color="${p[1]}"/>
</linearGradient>
<radialGradient id="r" cx="76%" cy="20%" r="72%">
<stop offset="0" stop-color="${p[2]}" stop-opacity=".55"/><stop offset="1" stop-color="${p[2]}" stop-opacity="0"/>
</radialGradient>
<linearGradient id="velo" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity=".66"/>
</linearGradient>
</defs>
<rect width="${w}" height="${h}" fill="url(#g)"/>
<rect width="${w}" height="${h}" fill="url(#r)"/>
<g stroke="#ffffff" stroke-opacity=".07">
${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="${(h / 12) * i}" x2="${w}" y2="${(h / 12) * i + 90}"/>`).join("")}
</g>
${capaTexto}
</svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  function avatarGenerado(nombre) {
    const p = PALETAS[hash(nombre + "x") % PALETAS.length];
    const ini = String(nombre).split(/\s+/).slice(0, 2).map((x) => x[0] || "").join("").toUpperCase();
    const svg =
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
<defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${p[1]}"/><stop offset="1" stop-color="${p[2]}"/></linearGradient></defs>
<rect width="160" height="160" fill="url(#a)"/>
<text x="80" y="104" font-family="Segoe UI,Arial,sans-serif" font-size="68" font-weight="800" fill="#0b0b12" text-anchor="middle" opacity=".85">${esc(ini)}</text>
</svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  const portadaDe = (s, vertical) => s.portada ? s.portada : portadaGenerada(s.titulo, !!vertical);
  const fotoDe    = (a) => a && a.foto ? a.foto : avatarGenerado(a ? a.nombre : "?");

  /* ---------- Instagram: carga del script oficial una sola vez ---------- */
  let igPedido = false;
  function cargarIG() {
    if (igPedido) return;
    igPedido = true;
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.instagram.com/embed.js";
    document.body.appendChild(s);
  }
  function procesarIG(contenedor) {
    cargarIG();
    let intentos = 0;
    const t = setInterval(() => {
      intentos++;
      if (window.instgrm && window.instgrm.embeds) { window.instgrm.embeds.process(); }
      const listo = contenedor.querySelector("iframe");
      if (listo || intentos > 14) {
        clearInterval(t);
        if (!listo) {
          const bq = contenedor.querySelector(".instagram-media");
          const url = bq ? bq.getAttribute("data-instgrm-permalink") : "#";
          contenedor.innerHTML =
            `<div class="reel-alterno"><p>El reel no se pudo cargar aquí (Instagram a veces bloquea la inserción). Ábrelo directamente:</p>
             <a class="btn btn--sube" href="${esc(url)}" target="_blank" rel="noopener">Ver el reel en Instagram</a></div>`;
        }
      }
    }, 400);
  }
  function blockquoteIG(url) {
    const u = urlInstagram(url);
    return `<blockquote class="instagram-media" data-instgrm-permalink="${esc(u)}?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style="background:#FFF;border:0;border-radius:3px;margin:0;max-width:540px;min-width:0;padding:0;width:100%"></blockquote>`;
  }

  /* ---------- iconos de redes (genéricos) ---------- */
  const ICONOS = {
    youtube:   '<svg viewBox="0 0 24 24"><path d="M3 7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7zm6.5 1.8v6.4l5.3-3.2-5.3-3.2z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24"><path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 4.6a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8zm0 2a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 0 1 0-4.8zM17.6 6a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z"/></svg>',
    tiktok:    '<svg viewBox="0 0 24 24"><path d="M9.5 10.2v6.1a1.9 1.9 0 1 1-1.9-1.9c.2 0 .4 0 .6.1v-2.4a4.3 4.3 0 1 0 3.7 4.2V3h2.4c.2 1.9 1.7 3.4 3.6 3.6v2.4a6 6 0 0 1-3.6-1.3v7"/></svg>',
    facebook:  '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1.3 6.4h1.5V6.2h-1.9c-1.7 0-2.6 1-2.6 2.7v1.4H8.9v2.3h1.4V18h2.4v-5.4h1.7l.3-2.3h-2V9.3c0-.6.2-.9.9-.9z"/></svg>'
  };
  const NOMBRES_RED = { youtube: "YouTube", instagram: "Instagram", tiktok: "TikTok", facebook: "Facebook" };

  function htmlRedes(autor) {
    if (!autor || !autor.redes) return "";
    const items = Object.keys(NOMBRES_RED)
      .filter((k) => autor.redes[k] && String(autor.redes[k]).trim())
      .map((k) => `<a class="red red--${k}" href="${esc(autor.redes[k])}" target="_blank" rel="noopener">${ICONOS[k]}<span>${NOMBRES_RED[k]}</span></a>`);
    if (!items.length) return `<p class="redes__sin">Redes sociales pendientes de agregar.</p>`;
    return `<div class="redes">${items.join("")}</div>`;
  }

  /* ---------- contacto "Sube tu serie" ---------- */
  function enlaceCorreo() {
    const c = CONFIG.contacto;
    return "mailto:" + c.correo + "?subject=" + encodeURIComponent(c.asunto) + "&body=" + encodeURIComponent(c.mensaje);
  }
  function enlaceWhatsapp() {
    const c = CONFIG.contacto;
    if (!c.whatsapp) return "";
    return "https://wa.me/" + String(c.whatsapp).replace(/[^0-9]/g, "") + "?text=" + encodeURIComponent(c.mensaje);
  }
  function abrirContacto() {
    const wa = enlaceWhatsapp();
    if (wa) window.open(wa, "_blank", "noopener");
    else window.location.href = enlaceCorreo();
  }
  function pintarContacto() {
    const wa = enlaceWhatsapp();
    const html =
      (wa ? `<a class="btn btn--wa" href="${esc(wa)}" target="_blank" rel="noopener">Escribir por WhatsApp</a>` : "") +
      `<a class="btn btn--mail" href="${esc(enlaceCorreo())}">Escribir al correo</a>`;
    $("#ctaBotones").innerHTML = html;
    $("#btnSubeCabecera").addEventListener("click", () => {
      document.querySelector(".cta").scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  /* ---------- BANNER ---------- */
  function pintarHero() {
    const s = serieDe(CONFIG.destacada) || SERIES[0];
    if (!s) return;
    const a = autorDe(s);
    $("#heroFondo").style.backgroundImage = `url("${s.portada || portadaGenerada(s.titulo, false, true)}")`;
    $("#heroTitulo").textContent = s.titulo;
    $("#heroSinopsis").textContent = s.sinopsis || "";
    $("#heroKicker").lastChild.textContent = s.estado === "proximamente" ? "Próximamente" : "Serie destacada";
    const nEp = (s.episodios || []).length;
    $("#heroMeta").innerHTML = [
      a ? `Por <strong>${esc(a.nombre)}</strong>` : "",
      s.anio ? esc(s.anio) : "",
      nEp ? `${nEp} ${nEp === 1 ? "episodio" : "episodios"}` : "",
      (s.categorias || []).map(esc).join(" · ")
    ].filter(Boolean).map((x) => `<span>${x}</span>`).join("");

    $("#heroVer").hidden = nEp === 0;
    $("#heroVer").addEventListener("click", () => abrirSerie(s.id, 0));
    $("#heroInfo").addEventListener("click", () => abrirSerie(s.id, null));

    const cont = $("#heroReel");
    if (CONFIG.reelBanner) {
      cont.innerHTML = `<div class="reel-marco"><div class="reel-cargando">Cargando el reel…</div>${blockquoteIG(CONFIG.reelBanner)}</div>`;
      procesarIG(cont);
    } else {
      cont.hidden = true;
    }
  }

  /* ---------- TARJETAS Y FILAS ---------- */
  function htmlTarjeta(s) {
    const a = autorDe(s);
    const pronto = s.estado === "proximamente";
    const chip = pronto
      ? `<span class="chip chip--pronto tarjeta__chip">Próximamente</span>`
      : `<span class="chip chip--nuevo tarjeta__chip">Nuevo</span>`;
    return `<button class="tarjeta" type="button" data-serie="${esc(s.id)}" aria-label="${esc(s.titulo)}, por ${esc(a ? a.nombre : "autor")}">
      <div class="tarjeta__marco">
        ${chip}
        <img class="tarjeta__img" src="${esc(portadaDe(s))}" alt="Portada de ${esc(s.titulo)}" loading="lazy">
        <span class="tarjeta__play"><span><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span></span>
      </div>
      <div class="tarjeta__info">
        <p class="tarjeta__titulo">${esc(s.titulo)}</p>
        <p class="tarjeta__autor">${esc(a ? a.nombre : "")}</p>
      </div>
    </button>`;
  }

  function pintarCatalogo() {
    const cont = $("#catalogo");
    cont.innerHTML = FILAS.map((fila, i) => {
      const lista = fila.series === "todas" ? SERIES : (fila.series || []).map(serieDe).filter(Boolean);
      if (!lista.length) return "";
      return `<section class="fila" aria-labelledby="fila-${i}">
        <h2 class="fila__titulo" id="fila-${i}">${esc(fila.titulo)}</h2>
        <button class="flecha flecha--izq" type="button" aria-label="Desplazar a la izquierda">&#8249;</button>
        <div class="fila__pista">${lista.map(htmlTarjeta).join("")}</div>
        <button class="flecha flecha--der" type="button" aria-label="Desplazar a la derecha">&#8250;</button>
      </section>`;
    }).join("");

    $$(".fila").forEach((fila) => {
      const pista = $(".fila__pista", fila);
      $(".flecha--izq", fila).addEventListener("click", () => pista.scrollBy({ left: -pista.clientWidth * 0.85, behavior: "smooth" }));
      $(".flecha--der", fila).addEventListener("click", () => pista.scrollBy({ left:  pista.clientWidth * 0.85, behavior: "smooth" }));
    });
  }

  /* ---------- AUTORES ---------- */
  function pintarAutores() {
    $("#autoresRejilla").innerHTML = AUTORES.map((a) => {
      const suyas = SERIES.filter((s) => s.autorId === a.id);
      return `<article class="autor-tarjeta">
        <img class="autor-tarjeta__foto" src="${esc(fotoDe(a))}" alt="Foto de ${esc(a.nombre)}" loading="lazy">
        <div>
          <h3 class="autor-tarjeta__nombre">${esc(a.nombre)}</h3>
          ${a.rol ? `<p class="autor-tarjeta__rol">${esc(a.rol)}</p>` : ""}
          <p class="autor-tarjeta__bio">${esc(a.bio || "")}</p>
          ${suyas.length ? `<p class="autor-tarjeta__series">Series: ${suyas.map((s) => esc(s.titulo)).join(" · ")}</p>` : ""}
          ${htmlRedes(a)}
        </div>
      </article>`;
    }).join("");
  }

  /* ---------- BUSCADOR ---------- */
  function buscar(q) {
    const t = normal(q).trim();
    const secc = $("#resultados");
    const limpiar = $("#limpiarBusqueda");
    limpiar.hidden = !q;

    if (!t) {
      secc.hidden = true;
      $("#catalogo").hidden = false;
      $("#hero").hidden = false;
      return;
    }
    const halla = SERIES.filter((s) => {
      const a = autorDe(s);
      return normal(s.titulo).includes(t)
          || (a && normal(a.nombre).includes(t))
          || (s.categorias || []).some((c) => normal(c).includes(t));
    });
    $("#resultadosTitulo").textContent = halla.length
      ? `${halla.length} ${halla.length === 1 ? "resultado" : "resultados"} para “${q}”`
      : `Sin resultados para “${q}”`;
    $("#resultadosRejilla").innerHTML = halla.length
      ? halla.map(htmlTarjeta).join("")
      : `<p class="vacio">No encontramos series ni autores con ese nombre. Prueba con otra palabra, o escríbeme para subir la tuya.</p>`;
    secc.hidden = false;
    $("#catalogo").hidden = true;
    $("#hero").hidden = true;
  }

  /* ---------- MODAL ---------- */
  let ultimoFoco = null;

  function pintarEpisodio(serie, i) {
    const cont = $("#modalReproductor");
    const ep = (serie.episodios || [])[i];
    if (!ep) {
      cont.innerHTML = `<img class="modal__portada" src="${esc(portadaDe(serie))}" alt="Portada de ${esc(serie.titulo)}">`;
      return;
    }
    if (ep.tipo === "instagram") {
      cont.innerHTML = `<div class="reel-caja">${blockquoteIG(ep.video)}</div>`;
      procesarIG(cont);
    } else {
      const id = idYoutube(ep.video);
      cont.innerHTML = `<div class="video-marco"><iframe
        src="https://www.youtube-nocookie.com/embed/${esc(id)}?rel=0&amp;modestbranding=1&amp;playsinline=1"
        title="${esc(ep.titulo)}" loading="lazy" allowfullscreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"></iframe></div>
        <p class="aviso-yt">¿El video no carga aquí? Algunos videos de YouTube tienen la inserción bloqueada por derechos de música.
        <a href="https://www.youtube.com/watch?v=${esc(id)}" target="_blank" rel="noopener">Ábrelo en YouTube</a>.</p>`;
    }
    $$("#modalEpisodios .episodio").forEach((b, k) => b.classList.toggle("activo", k === i));
  }

  function abrirSerie(id, iEpisodio) {
    const s = serieDe(id);
    if (!s) return;
    const a = autorDe(s);
    const eps = s.episodios || [];
    ultimoFoco = document.activeElement;

    $("#modalTitulo").textContent = s.titulo;
    $("#modalSinopsis").textContent = s.sinopsis || "";
    const estado = $("#modalEstado");
    if (s.estado === "proximamente") {
      estado.textContent = "Próximamente"; estado.className = "chip chip--pronto"; estado.hidden = false;
    } else { estado.hidden = true; }

    $("#modalMeta").innerHTML = [
      a ? `Por <strong>${esc(a.nombre)}</strong>` : "",
      s.anio ? esc(s.anio) : "",
      eps.length ? `${eps.length} ${eps.length === 1 ? "episodio" : "episodios"}` : "Sin episodios aún",
      (s.categorias || []).map(esc).join(" · ")
    ].filter(Boolean).map((x) => `<span>${x}</span>`).join("");

    $("#modalAutor").innerHTML = a
      ? `<img class="autor-tarjeta__foto" src="${esc(fotoDe(a))}" alt="Foto de ${esc(a.nombre)}">
         <div>
           <h3 class="autor-tarjeta__nombre">${esc(a.nombre)}</h3>
           ${a.rol ? `<p class="autor-tarjeta__rol">${esc(a.rol)}</p>` : ""}
           <p class="autor-tarjeta__bio">${esc(a.bio || "")}</p>
           ${htmlRedes(a)}
         </div>` : "";

    $("#modalEpisodiosTitulo").hidden = false;
    $("#modalEpisodios").innerHTML = eps.length
      ? eps.map((ep, i) => `<li><button class="episodio" type="button" data-ep="${i}">
          <span class="episodio__num">${i + 1}</span>
          <span class="episodio__texto">
            <span class="episodio__titulo">${esc(ep.titulo)}</span>
            ${ep.sinopsis ? `<span class="episodio__sin">${esc(ep.sinopsis)}</span>` : ""}
          </span>
          <span class="episodio__tag">${ep.tipo === "instagram" ? "Reel" : "YouTube"}${ep.duracion ? " · " + esc(ep.duracion) : ""}</span>
        </button></li>`).join("")
      : `<li><p class="sin-episodios">Esta serie todavía no tiene episodios publicados. Su autor los subirá pronto.</p></li>`;

    $$("#modalEpisodios .episodio").forEach((b) =>
      b.addEventListener("click", () => pintarEpisodio(s, Number(b.dataset.ep)))
    );

    pintarEpisodio(s, iEpisodio === null || iEpisodio === undefined ? (eps.length ? -1 : -1) : iEpisodio);

    $("#modal").hidden = false;
    document.body.classList.add("sin-scroll");
    $("#modalCaja").scrollTop = 0;
    $("#modalCaja").focus();
  }

  function cerrarModal() {
    $("#modal").hidden = true;
    $("#modalReproductor").innerHTML = "";
    document.body.classList.remove("sin-scroll");
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
  }

  /* ---------- ARRANQUE ---------- */
  function inicio() {
    document.title = CONFIG.nombreSitio + " — Series hechas con inteligencia artificial";
    pintarHero();
    pintarCatalogo();
    pintarAutores();
    pintarContacto();

    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-serie]");
      if (t) abrirSerie(t.dataset.serie, null);
    });

    $("#busqueda").addEventListener("input", (e) => buscar(e.target.value));
    $("#limpiarBusqueda").addEventListener("click", () => {
      $("#busqueda").value = ""; buscar(""); $("#busqueda").focus();
    });

    $("#modalCerrar").addEventListener("click", cerrarModal);
    $("#modalFondo").addEventListener("click", cerrarModal);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !$("#modal").hidden) cerrarModal();
    });

    const cab = $("#cabecera");
    const alScroll = () => cab.classList.toggle("solida", window.scrollY > 30);
    window.addEventListener("scroll", alScroll, { passive: true });
    alScroll();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", inicio);
  else inicio();
})();
