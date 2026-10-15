# Sitio de propiedades

Sitio estático: HTML + CSS + JS, sin build. Todo el contenido sale de `datos/propiedades.json`.

- `index.html` — portada, catálogo con filtro venta/renta, nosotros, contacto.
- `propiedad.html?clave=...` — ficha con galería, datos, amenidades, mapa y botones de contacto.
- `datos/propiedades.json` — nombre del sitio, WhatsApp, correo y la lista de propiedades.
- `css/estilo.css` — paleta neutra (blanco, huevo, manta, carbón, bronce).

Para ver en local: abrir la carpeta con cualquier servidor estático (`python -m http.server`),
porque `fetch` del JSON no funciona abriendo el archivo directo.

Para publicar: subir la carpeta a GitHub y activar Pages en la rama principal.

Las fotos de muestra son de Unsplash (licencia libre); se cambian por las reales en el JSON.
