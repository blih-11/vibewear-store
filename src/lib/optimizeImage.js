/**
 * Appends Cloudinary on-the-fly transformation params to an image URL so the
 * browser gets an auto-compressed, auto-format (WebP/AVIF where supported)
 * version — without re-uploading anything or touching the backend.
 *
 * Non-Cloudinary URLs (e.g. local /images/... fallback paths from
 * src/data/products.js) are returned unchanged.
 *
 * Usage: optimizeImage(product.image, { width: 800 })
 */
export function optimizeImage(url, { width } = {}) {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;

  const transforms = ['f_auto', 'q_auto'];
  if (width) transforms.push(`w_${width}`, 'c_limit');

  return url.replace('/upload/', `/upload/${transforms.join(',')}/`);
}
