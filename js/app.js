// Lee datos/propiedades.json y pinta el catálogo (index.html) o la ficha (propiedad.html).
const RUTA_DATOS = "datos/propiedades.json";

const fmtPrecio = (p) => {
  const n = new Intl.NumberFormat("es-MX", { style: "currency", currency: p.moneda || "MXN", maximumFractionDigits: 0 }).format(p.precio);
  return p.operacion === "renta" ? `${n} <small>/ ${p.periodo || "mes"}</small>` : n;
};
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const linkWhats = (sitio, texto) => `https://wa.me/${sitio.whatsapp}?text=${encodeURIComponent(texto)}`;

function datosLinea(p, completo = false) {
  const partes = [];
  if (p.recamaras) partes.push(`<span><b>${p.recamaras}</b> rec</span>`);
  if (p.banos) partes.push(`<span><b>${p.banos}</b> baños</span>`);
  if (p.construccion_m2) partes.push(`<span><b>${p.construccion_m2}</b> m² const.</span>`);
  if (completo && p.terreno_m2) partes.push(`<span><b>${p.terreno_m2}</b> m² terreno</span>`);
  if (completo && p.estacionamientos) partes.push(`<span><b>${p.estacionamientos}</b> autos</span>`);
  return partes.join("");
}

function tarjeta(p) {
  return `
  <a class="tarjeta" href="propiedad.html?clave=${p.clave}">
    <div class="foto">
      <img src="${p.fotos[0]}" alt="${p.titulo}" loading="lazy">
      <span class="etiqueta">${cap(p.operacion)}</span>
    </div>
    <div class="cuerpo">
      <div class="lugar">${p.colonia} · ${p.ciudad}</div>
      <h3>${p.titulo}</h3>
      <div class="precio">${fmtPrecio(p)}</div>
      <div class="datos">${datosLinea(p)}</div>
    </div>
  </a>`;
}

function pintarCatalogo(d) {
  const rejilla = document.getElementById("rejilla");
  const filtros = document.querySelectorAll(".filtros button");
  let filtro = "todas";
  const pintar = () => {
    const lista = d.propiedades.filter((p) => filtro === "todas" || p.operacion === filtro);
    rejilla.innerHTML = lista.length ? lista.map(tarjeta).join("") : `<p class="vacio">Por ahora no hay propiedades en esta categoría.</p>`;
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
  document.querySelectorAll("[data-whats]").forEach((a) => a.href = linkWhats(d.sitio, "Hola, me interesa información sobre sus propiedades."));
  document.querySelectorAll("[data-correo]").forEach((a) => {
    if (d.sitio.correo) a.href = `mailto:${d.sitio.correo}`; else a.remove();
  });
}

function pintarFicha(d) {
  const clave = new URLSearchParams(location.search).get("clave");
  const p = d.propiedades.find((x) => x.clave === clave) || d.propiedades[0];
  document.title = `${p.titulo} · ${d.sitio.nombre}`;
  document.getElementById("galeria").innerHTML = p.fotos.slice(0, 3).map((f, i) => `<img src="${f}" alt="${p.titulo} ${i + 1}" data-i="${i}">`).join("");
  document.getElementById("ojo").textContent = `${cap(p.tipo)} en ${p.operacion}`;
  document.getElementById("titulo").textContent = p.titulo;
  document.getElementById("lugar").textContent = `${p.colonia} · ${p.ciudad}`;
  document.getElementById("precio").innerHTML = fmtPrecio(p);
  document.getElementById("datos").innerHTML = datosLinea(p, true) + (p.antiguedad ? `<span><b>${p.antiguedad}</b></span>` : "");
  document.getElementById("texto").textContent = p.descripcion;
  document.getElementById("amenidades").innerHTML = p.amenidades.map((a) => `<li>${a}</li>`).join("");
  if (p.equipamiento && Object.keys(p.equipamiento).length) {
    document.getElementById("equipamiento").innerHTML = Object.entries(p.equipamiento)
      .map(([g, items]) => `<h3>${g}</h3><ul class="amenidades">${items.map((i) => `<li>${i}</li>`).join("")}</ul>`).join("");
    document.getElementById("bloque-equipamiento").hidden = false;
  }
  if (p.condiciones && p.condiciones.length) {
    document.getElementById("condiciones").innerHTML = p.condiciones.map((c) => `<li>${c}</li>`).join("");
    document.getElementById("bloque-condiciones").hidden = false;
  }
  const msg = `Hola, me interesa "${p.titulo}" (${p.colonia}). ¿Podemos agendar una visita?`;
  document.getElementById("whats").href = linkWhats(d.sitio, msg);
  const correo = document.getElementById("correo");
  if (d.sitio.correo) correo.href = `mailto:${d.sitio.correo}?subject=${encodeURIComponent(p.titulo)}`; else correo.remove();

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

fetch(RUTA_DATOS).then((r) => r.json()).then((d) => {
  document.querySelectorAll("[data-marca]").forEach((el) => el.innerHTML = d.sitio.nombre.replace(/(\w+)$/, "<span>$1</span>"));
  if (document.getElementById("rejilla")) pintarCatalogo(d);
  if (document.getElementById("galeria")) pintarFicha(d);
});
