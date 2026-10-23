// Product URLs look like  /products/rick-owens-cargo-trousers-65f1c0a8e4b0a1b2c3d4e5f6
// The readable slug is for people and search engines; the trailing 24-char id is what
// the app actually uses to load the product. That means:
//   • nothing in the database changes (no slug field to backfill),
//   • renaming a product just changes the slug part — the page still loads, and the
//     app redirects old links to the new canonical address,
//   • old links that are just the bare id (already shared on WhatsApp/Instagram) keep working.
// No imports on purpose — scripts/generate-sitemap.mjs reuses this file in Node.

const OBJECT_ID = /^[a-f0-9]{24}$/i;

export function slugify(text = '') {
  return String(text)
    .toLowerCase()
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '') // é → e
    .replace(/&/g, ' and ')
    .replace(/['’]/g, '')                               // women's → womens
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/, '');
}

export function productPath(product) {
  const id = String(product?._id || product?.id || '');
  if (!OBJECT_ID.test(id)) return `/products/${id}`; // legacy/non-database ids stay as they are
  const slug = slugify(product.name);
  return slug ? `/products/${slug}-${id}` : `/products/${id}`;
}

// "rick-owens-cargo-trousers-65f1…" → "65f1…";   "65f1…" → "65f1…"
export function extractProductId(param = '') {
  const tail = String(param).slice(-24);
  return OBJECT_ID.test(tail) ? tail : String(param);
}
