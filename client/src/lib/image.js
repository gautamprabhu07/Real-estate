// Applies sensible Cloudinary transforms (auto format/quality + width cap) to
// upload URLs so we don't ship full-resolution originals for thumbnails/cards.
// Non-Cloudinary URLs (e.g. seeded picsum.photos placeholders) pass through unchanged.
export function optimizeImageUrl(url, { width = 800 } = {}) {
  if (!url || typeof url !== "string") return url;

  const marker = "/image/upload/";
  const markerIndex = url.indexOf(marker);
  if (!url.includes("res.cloudinary.com") || markerIndex === -1) return url;

  const insertAt = markerIndex + marker.length;
  return (
    url.slice(0, insertAt) +
    `f_auto,q_auto,w_${width}/` +
    url.slice(insertAt)
  );
}
