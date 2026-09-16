/**
 * Registro en memoria de videos que ya empezaron a precargarse en segundo
 * plano (por ejemplo, en el momento del click sobre una isla, mientras
 * corre la transicion cinematografica hacia la pagina real del negocio).
 *
 * Es un modulo plano a proposito, no un componente ni un store reactivo:
 * nadie necesita re-renderizarse cuando esto cambia, solo sirve para (a)
 * no disparar la misma descarga dos veces y (b) que la pagina de destino
 * pueda preguntar "¿este video ya viene en camino?" apenas monta. Como es
 * estado de modulo (no de React), sobrevive la navegacion client-side de
 * Next (App Router no recarga la pagina), que es justo el caso que nos
 * interesa: el click pasa en /, el <video> real se monta despues en
 * /trini-barberia.
 */
const preloading = new Set<string>();

/**
 * Empieza a bajar `src` en segundo plano sin montar ningun <video>, para
 * que el cache HTTP del navegador ya tenga los bytes cuando el <video>
 * real pida esa misma URL mas adelante. Idempotente: llamarlo varias
 * veces con la misma URL no repite la descarga.
 */
export function preloadVideo(src: string) {
  if (typeof window === "undefined" || preloading.has(src)) return;
  preloading.add(src);
  // A proposito un <video> fuera del DOM y no fetch(): el <video> real que
  // se monta despues pide el archivo con Range requests (streaming), y el
  // cache HTTP del navegador solo reaprovecha esos bytes si la precarga usa
  // el mismo tipo de request. Con fetch() (GET simple, sin Range) el video
  // real terminaba re-bajando el archivo completo de nuevo.
  const video = document.createElement("video");
  video.preload = "auto";
  video.muted = true;
  video.src = src;
  video.load();
}

/** Si ya se disparo (o esta en curso) la precarga de `src`. */
export function isVideoPreloading(src: string) {
  return preloading.has(src);
}
