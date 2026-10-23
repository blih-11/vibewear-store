// Generates public/sitemap.xml from the static routes + the REAL products in your
// database. Runs automatically before every build (see package.json "prebuild"),
// so every Netlify deploy refreshes it. After adding lots of new products, trigger
// a redeploy (or a Netlify build hook) so Google is told about them.
//
// It never fails the build: if the API can't be reached it writes the static pages
// only (better than listing dead URLs).
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { productPath } from '../src/lib/productUrl.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://vibewear.online';
const API = process.env.VITE_API_URL || 'https://vibewear-server.onrender.com/api';
const today = new Date().toISOString().split('T')[0];

// Static, publicly-indexable routes (cart/checkout/auth/orders are private and blocked in robots.txt)
const staticRoutes = [
  { path: '/',         changefreq: 'daily',   priority: '1.0', lastmod: today },
  { path: '/products', changefreq: 'daily',   priority: '0.9', lastmod: today },
  { path: '/contact',  changefreq: 'monthly', priority: '0.5', lastmod: today },
];

// The server runs on a free tier that sleeps when idle — the first request can take
// ~30-60s to wake it, so retry a few times before giving up.
async function fetchProducts() {
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const res = await fetch(`${API}/products`, { signal: AbortSignal.timeout(30000) });
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) return data.products;
    } catch (err) {
      console.warn(`sitemap: attempt ${attempt} failed (${err.message})`);
    }
    await new Promise(r => setTimeout(r, 5000));
  }
  return null;
}

const products = await fetchProducts();
if (!products) console.warn('⚠️  sitemap: could not reach the API — writing static pages only.');

const productRoutes = (products || []).map(p => ({
  path: productPath(p),
  changefreq: 'weekly',
  priority: '0.8',
  lastmod: (p.updatedAt || p.createdAt || today).toString().split('T')[0],
}));

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const allRoutes = [...staticRoutes, ...productRoutes];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(r => `  <url>
    <loc>${esc(SITE_URL + r.path)}</loc>
    <lastmod>${r.lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

const outPath = resolve(__dirname, '../public/sitemap.xml');
writeFileSync(outPath, xml, 'utf8');
console.log(`✓ sitemap.xml generated with ${allRoutes.length} URLs (${productRoutes.length} products) → ${outPath}`);
