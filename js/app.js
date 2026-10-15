// Lee datos/propiedades.json y pinta el catálogo (index.html) o la ficha (propiedad.html).
// Bilingüe: ?lang=en o el botón EN/ES (se guarda en localStorage). Los textos de la interfaz
// viven en T; los de cada propiedad en su objeto "en" dentro del JSON (si falta, cae al español).
const RUTA_DATOS = "datos/propiedades.json";

const LANG = (() => {
  const q = new URLSearchParams(location.search).get("lang");
  if (q === "en" || q === "es") { try { localStorage.setItem("lang", q); } catch (e) {} return q; }
  try { const g = localStorage.getItem("lang"); if (g === "en" || g === "es") return g; } catch (e) {}
  return (navigator.language || "es").toLowerCase().startsWith("en") ? "en" : "es";
})();
const EN = LANG === "en";
document.documentElement.lang = LANG;

const T = {
  es: {
    "nav.propiedades": "Propiedades", "nav.nosotros": "Nosotros", "nav.contacto": "Contacto",
    "portada.ojo": "Campeche · Venta y renta",
    "portada.h1": "Casas con historia, hogares con calma.",
    "portada.p": "Una selección corta de propiedades en Campeche, presentadas con el cuidado que merecen.",
    "portada.boton": "Ver propiedades",
    "cat.ojo": "Catálogo", "cat.h2": "Propiedades disponibles",
    "filtro.todas": "Todas", "filtro.venta": "Venta", "filtro.renta": "Renta",
    "nos.ojo": "Nosotros", "nos.h2": "Pocas propiedades, bien atendidas.",
    "nos.p1": "No somos un portal: somos propietarios que muestran directamente lo que ofrecen. Cada casa se visita acompañada, con la documentación en regla y sin intermediarios.",
    "nos.p2": "Si buscas comprar o rentar en Campeche y prefieres hablar directo, escríbenos.",
    "nos.boton": "Hablemos",
    "con.ojo": "Contacto", "con.h2": "¿Te gustaría visitar alguna?",
    "con.p": "Escríbenos por WhatsApp o correo y agendamos una visita el mismo día.",
    "correo": "Correo",
    "ficha.amenidades": "Amenidades", "ficha.incluye": "Qué incluye", "ficha.condiciones": "Condiciones",
    "ficha.avances": "Avances", "ficha.usos": "Usos posibles", "ficha.ubicacion": "Ubicación",
    "ficha.zona": "Zona aproximada; la dirección exacta se comparte al agendar la visita.",
    "ficha.volver": "← Volver al catálogo",
    "ficha.visitar": "¿Quieres visitarla?",
    "ficha.visitar.p": "Escríbenos y coordinamos una visita acompañada, sin compromiso.",
    "rec": "rec", "banos": "baños", "const": "m² const.", "terreno": "m² terreno", "autos": "autos",
    "mes": "mes", "sin_precio": "Precio por definir", "tc": "tipo de cambio de referencia",
    "venta": "Venta", "renta": "Renta", "en_venta": "en venta", "en_renta": "en renta",
    "vacio": "Por ahora no hay propiedades en esta categoría.",
    "vendida": "Vendida", "vendida.t": "Esta propiedad ya se vendió.",
    "prox": "Próximamente", "prox.t": "En preparación: se está poniendo a punto antes de salir a la venta. Si te interesa, escríbenos y te avisamos primero.",
    "apartada": "Apartada", "rentada": "Rentada", "se_libera": "se libera", "lista": "Lista de espera",
    "libera.t": (b, f) => `Actualmente ${b.toLowerCase()}. Se libera el ${f}; puedes apartar tu visita desde ahora.`,
    "espera.t": (b) => `Actualmente ${b.toLowerCase()}, sin fecha de salida todavía. Déjanos tu contacto y serás el primero en saberlo cuando se libere.`,
    "wa.general": "Hola, me interesa información sobre sus propiedades.",
    "wa.avisar": (t, c) => `Hola, me interesa "${t}" (${c}). ¿Me avisan cuando esté disponible?`,
    "wa.visita": (t, c) => `Hola, me interesa "${t}" (${c}). ¿Podemos agendar una visita?`,
    "idioma": "EN",
  },
  en: {
    "nav.propiedades": "Properties", "nav.nosotros": "About", "nav.contacto": "Contact",
    "portada.ojo": "Campeche, Mexico · For sale and for rent",
    "portada.h1": "Homes with history, lived in calm.",
    "portada.p": "A short selection of properties in Campeche, presented with the care they deserve.",
    "portada.boton": "See properties",
    "cat.ojo": "Catalog", "cat.h2": "Available properties",
    "filtro.todas": "All", "filtro.venta": "For sale", "filtro.renta": "For rent",
    "nos.ojo": "About us", "nos.h2": "A few properties, well looked after.",
    "nos.p1": "We are not a listings portal: we are owners showing directly what we offer. Every home is visited with us, with the paperwork in order and no middlemen.",
    "nos.p2": "If you are looking to buy or rent in Campeche and prefer to talk directly, write to us. Foreign buyers welcome.",
    "nos.boton": "Let's talk",
    "con.ojo": "Contact", "con.h2": "Would you like to visit one?",
    "con.p": "Write to us on WhatsApp or by email and we'll schedule a visit the same day.",
    "correo": "Email",
    "ficha.amenidades": "Features", "ficha.incluye": "What's included", "ficha.condiciones": "Terms",
    "ficha.avances": "Progress", "ficha.usos": "Possible uses", "ficha.ubicacion": "Location",
    "ficha.zona": "Approximate area; the exact address is shared when scheduling a visit.",
    "ficha.volver": "← Back to catalog",
    "ficha.visitar": "Want to visit?",
    "ficha.visitar.p": "Write to us and we'll arrange a guided visit, no obligation.",
    "rec": "bd", "banos": "ba", "const": "m² built", "terreno": "m² lot", "autos": "cars",
    "mes": "month", "sin_precio": "Price to be announced", "tc": "reference exchange rate",
    "venta": "For sale", "renta": "For rent", "en_venta": "for sale", "en_renta": "for rent",
    "vacio": "No properties in this category right now.",
    "vendida": "Sold", "vendida.t": "This property has been sold.",
    "prox": "Coming soon", "prox.t": "In preparation: being readied before going on the market. If you're interested, write to us and we'll let you know first.",
    "apartada": "Reserved", "rentada": "Rented", "se_libera": "available", "lista": "Waiting list",
    "libera.t": (b, f) => `Currently ${b.toLowerCase()}. Available on ${f}; you can book your visit now.`,
    "espera.t": (b) => `Currently ${b.toLowerCase()}, no move-out date yet. Leave us your contact and you'll be the first to know when it frees up.`,
    "wa.general": "Hello, I'd like information about your properties.",
    "wa.avisar": (t, c) => `Hello, I'm interested in "${t}" (${c}). Can you let me know when it becomes available?`,
    "wa.visita": (t, c) => `Hello, I'm interested in "${t}" (${c}). Can we schedule a visit?`,
    "idioma": "ES",
  },
};
const t = (k, ...a) => { const v = T[LANG][k] ?? T.es[k] ?? k; return typeof v === "function" ? v(...a) : v; };
// Campo de la propiedad en el idioma activo (cae al español si no hay traducción).
const tr = (p, campo) => (EN && p.en && p.en[campo] != null) ? p.en[campo] : p[campo];

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const fmtFecha = (iso) => new Date(iso + "T12:00:00").toLocaleDateString(EN ? "en-US" : "es-MX", { day: "numeric", month: "long", year: "numeric" });
const fmtUSD = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

let SITIO = {};
function fmtPrecio(p, conUSD = false) {
  if (p.precio == null) return `<small>${t("sin_precio")}</small>`;
  const n = new Intl.NumberFormat("es-MX", { style: "currency", currency: p.moneda || "MXN", maximumFractionDigits: 0 }).format(p.precio);
  let html = p.operacion === "renta" ? `${n} <small>MXN / ${t("mes")}</small>` : `${n} <small>MXN</small>`;
  const tc = SITIO.usd && SITIO.usd.tipo_cambio;
  if (conUSD && tc && (p.moneda || "MXN") === "MXN") {
    const usd = Math.round(p.precio / tc / (p.operacion === "renta" ? 10 : 1000)) * (p.operacion === "renta" ? 10 : 1000);
    html += `<span class="usd">≈ ${fmtUSD(usd)} USD${p.operacion === "renta" ? ` / ${t("mes")}` : ""} <small>· ${t("tc")} ${tc}, ${fmtFecha(SITIO.usd.fecha)}</small></span>`;
  }
  return html;
}

// Estado de la propiedad: disponible (default), rentada, vendida, en_preparacion.
// disponible_desde (AAAA-MM-DD) es opcional; sin fecha se ofrece lista de espera.
// Una propiedad disponible puede traer nota_estado (+ etiqueta_estado), p. ej. «Entrega en 15 días».
function estadoInfo(p) {
  const e = p.estado || "disponible";
  const nota = tr(p, "nota_estado");
  if (e === "disponible") return nota ? { etiqueta: tr(p, "etiqueta_estado") || "", corta: tr(p, "etiqueta_estado"), texto: nota } : null;
  if (e === "vendida") return { etiqueta: t("vendida"), texto: t("vendida.t") };
  if (e === "en_preparacion") return { etiqueta: t("prox"), texto: nota || t("prox.t") };
  const base = p.operacion === "venta" ? t("apartada") : t("rentada");
  if (p.disponible_desde) return { etiqueta: `${base} · ${t("se_libera")} ${fmtFecha(p.disponible_desde)}`, corta: `${cap(t("se_libera"))} ${fmtFecha(p.disponible_desde)}`, texto: t("libera.t", base, fmtFecha(p.disponible_desde)) };
  return { etiqueta: base, corta: t("lista"), texto: nota || t("espera.t", base) };
}
const linkWhats = (sitio, texto) => `https://wa.me/${sitio.whatsapp}?text=${encodeURIComponent(texto)}`;

function datosLinea(p, completo = false) {
  const partes = [];
  if (p.recamaras) partes.push(`<span><b>${p.recamaras}</b> ${t("rec")}</span>`);
  if (p.banos) partes.push(`<span><b>${p.banos}</b> ${t("banos")}</span>`);
  if (p.construccion_m2) partes.push(`<span><b>${p.construccion_m2}</b> ${t("const")}</span>`);
  if (completo && p.terreno_m2) partes.push(`<span><b>${p.terreno_m2}</b> ${t("terreno")}</span>`);
  if (completo && p.estacionamientos) partes.push(`<span><b>${p.estacionamientos}</b> ${t("autos")}</span>`);
  return partes.join("");
}

function tarjeta(p) {
  const est = estadoInfo(p);
  return `
  <a class="tarjeta" href="propiedad.html?clave=${p.clave}">
    <div class="foto">
      <img src="${p.fotos[0]}" alt="${tr(p, "titulo")}" loading="lazy">
      <span class="etiqueta">${t(p.operacion)}</span>
      ${est && (est.corta || est.etiqueta) ? `<span class="etiqueta estado">${est.corta || est.etiqueta}</span>` : ""}
    </div>
    <div class="cuerpo">
      <div class="lugar">${p.colonia} · ${p.ciudad}</div>
      <h3>${tr(p, "titulo")}</h3>
      <div class="precio">${fmtPrecio(p)}</div>
      <div class="datos">${datosLinea(p)}</div>
    </div>
  </a>`;
}

// Textos fijos de la página (data-i18n="clave") y botón de idioma.
function traducirInterfaz() {
  document.querySelectorAll("[data-i18n]").forEach((el) => el.textContent = t(el.dataset.i18n));
  const b = document.getElementById("idioma");
  if (b) {
    b.textContent = t("idioma");
    b.addEventListener("click", (e) => {
      e.preventDefault();
      try { localStorage.setItem("lang", EN ? "es" : "en"); } catch (x) {}
      const u = new URL(location.href); u.searchParams.set("lang", EN ? "es" : "en"); location.href = u.toString();
    });
  }
}

function pintarCatalogo(d) {
  const rejilla = document.getElementById("rejilla");
  const filtros = document.querySelectorAll(".filtros button");
  let filtro = "todas";
  const pintar = () => {
    const lista = d.propiedades
      .filter((p) => filtro === "todas" || p.operacion === filtro)
      .sort((a, b) => ((a.estado || "disponible") === "disponible" ? 0 : 1) - ((b.estado || "disponible") === "disponible" ? 0 : 1));
    rejilla.innerHTML = lista.length ? lista.map(tarjeta).join("") : `<p class="vacio">${t("vacio")}</p>`;
  };
  filtros.forEach((b) => b.addEventListener("click", () => {
    filtros.forEach((x) => x.classList.remove("activo"));
    b.classList.add("activo");
    filtro = b.dataset.filtro;
    pintar();
  }));
  pintar();
  const destacada = d.propiedades.find((p) => p.destacada) || d.propiedades[0];
  const hero = document.getElementById("portada-img");
  if (hero && destacada) hero.src = destacada.fotos[0];
  document.querySelectorAll("[data-whats]").forEach((a) => a.href = linkWhats(d.sitio, t("wa.general")));
  document.querySelectorAll("[data-correo]").forEach((a) => {
    if (d.sitio.correo) a.href = `mailto:${d.sitio.correo}`; else a.remove();
  });
}

function pintarFicha(d) {
  const clave = new URLSearchParams(location.search).get("clave");
  const p = d.propiedades.find((x) => x.clave === clave) || d.propiedades[0];
  const titulo = tr(p, "titulo");
  document.title = `${titulo} · ${d.sitio.nombre}`;
  document.getElementById("galeria").innerHTML = p.fotos.slice(0, 3).map((f, i) => `<img src="${f}" alt="${titulo} ${i + 1}" data-i="${i}">`).join("");
  document.getElementById("ojo").textContent = EN ? `${cap(tr(p, "tipo"))} ${t("en_" + p.operacion)}` : `${cap(p.tipo)} ${t("en_" + p.operacion)}`;
  document.getElementById("titulo").textContent = titulo;
  document.getElementById("lugar").textContent = `${p.colonia} · ${p.ciudad}`;
  document.getElementById("precio").innerHTML = fmtPrecio(p, true);
  const ant = tr(p, "antiguedad");
  document.getElementById("datos").innerHTML = datosLinea(p, true) + (ant ? `<span><b>${ant}</b></span>` : "");
  document.getElementById("texto").textContent = tr(p, "descripcion");
  document.getElementById("amenidades").innerHTML = tr(p, "amenidades").map((a) => `<li>${a}</li>`).join("");
  const eq = tr(p, "equipamiento");
  if (eq && Object.keys(eq).length) {
    document.getElementById("equipamiento").innerHTML = Object.entries(eq)
      .map(([g, items]) => `<h3>${g}</h3><ul class="amenidades">${items.map((i) => `<li>${i}</li>`).join("")}</ul>`).join("");
    document.getElementById("bloque-equipamiento").hidden = false;
  }
  const usos = tr(p, "usos_texto");
  if (usos) {
    document.getElementById("usos").textContent = usos;
    document.getElementById("bloque-usos").hidden = false;
  }
  const ubi = tr(p, "ubicacion_texto");
  if (ubi) {
    const u = document.getElementById("ubicacion-texto"); u.textContent = ubi; u.hidden = false;
  }
  if (p.cercanias && p.cercanias.length) {
    const c = document.getElementById("cercanias");
    c.innerHTML = p.cercanias.map((k) => { const x = (EN && k.en) ? k.en : k; return `<li><span>${x.nombre}</span><b>${x.dato}</b></li>`; }).join("");
    c.hidden = false;
  }
  const cond = tr(p, "condiciones");
  if (cond && cond.length) {
    document.getElementById("condiciones").innerHTML = cond.map((c) => `<li>${c}</li>`).join("");
    document.getElementById("bloque-condiciones").hidden = false;
  }
  const est = estadoInfo(p);
  const banda = document.getElementById("estado");
  if (est) {
    banda.innerHTML = est.etiqueta ? `<strong>${est.etiqueta}</strong> — ${est.texto}` : est.texto;
    banda.hidden = false;
  }
  if (p.bitacora && p.bitacora.length) {
    document.getElementById("bitacora").innerHTML = p.bitacora.map((b) => `
      <article class="avance">
        <div class="ojo">${fmtFecha(b.fecha)}</div>
        <p>${(EN && b.en) || b.texto}</p>
        ${(b.fotos || []).length ? `<div class="avance-fotos">${b.fotos.map((f) => `<img src="${f}" alt="" loading="lazy">`).join("")}</div>` : ""}
      </article>`).join("");
    document.getElementById("bloque-bitacora").hidden = false;
  }
  const msg = (p.estado === "rentada" || p.estado === "en_preparacion")
    ? t("wa.avisar", titulo, p.colonia)
    : t("wa.visita", titulo, p.colonia);
  document.getElementById("whats").href = linkWhats(d.sitio, msg);
  const correo = document.getElementById("correo");
  if (d.sitio.correo) correo.href = `mailto:${d.sitio.correo}?subject=${encodeURIComponent(titulo)}`; else correo.remove();

  // Mapa (Leaflet + OpenStreetMap, sin llave). Círculo en vez de pin exacto: la dirección se da en la visita.
  if (window.L && p.lat) {
    const m = L.map("mapa", { scrollWheelZoom: false }).setView([p.lat, p.lng], 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap" }).addTo(m);
    L.circle([p.lat, p.lng], { radius: 250, color: "#8c7b5a", fillColor: "#8c7b5a", fillOpacity: .25, weight: 1 }).addTo(m);
  }

  // Visor de fotos
  const visor = document.getElementById("visor");
  const vimg = visor.querySelector("img");
  let i = 0;
  const mostrar = (k) => { i = (k + p.fotos.length) % p.fotos.length; vimg.src = p.fotos[i]; visor.classList.add("abierto"); };
  document.querySelectorAll("#galeria img").forEach((img) => img.addEventListener("click", () => mostrar(+img.dataset.i)));
  visor.querySelector(".cerrar").onclick = () => visor.classList.remove("abierto");
  visor.querySelector(".ant").onclick = () => mostrar(i - 1);
  visor.querySelector(".sig").onclick = () => mostrar(i + 1);
  document.addEventListener("keydown", (e) => {
    if (!visor.classList.contains("abierto")) return;
    if (e.key === "Escape") visor.classList.remove("abierto");
    if (e.key === "ArrowLeft") mostrar(i - 1);
    if (e.key === "ArrowRight") mostrar(i + 1);
  });
}

traducirInterfaz();
fetch(RUTA_DATOS + "?t=" + Date.now()).then((r) => r.json()).then((d) => {
  SITIO = d.sitio;
  document.querySelectorAll("[data-marca]").forEach((el) => el.innerHTML = d.sitio.nombre.replace(/(\w+)$/, "<span>$1</span>"));
  if (document.getElementById("rejilla")) pintarCatalogo(d);
  if (document.getElementById("galeria")) pintarFicha(d);
  // Los enlaces internos conservan el idioma elegido.
  if (EN) document.querySelectorAll('a[href^="index.html"], a[href^="propiedad.html"]').forEach((a) => {
    const u = new URL(a.getAttribute("href"), location.href); u.searchParams.set("lang", "en"); a.href = u.toString();
  });
});
