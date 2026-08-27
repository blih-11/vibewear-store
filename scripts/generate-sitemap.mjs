// Generates public/sitemap.xml from static routes + live product data.
// Runs automatically before every build (see package.json "prebuild").
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { products } from '../src/data/products.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://vibewear.online';
const today = new Date().toISOString().split('T')[0];

// Static, publicly-indexable routes.
// (cart/checkout/auth/orders/order-success are excluded on purpose —
// they're private/transactional and are blocked in robots.txt too.)
const staticRoutes = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/products', changefreq: 'daily', priority: '0.9' },
  { path: '/contact', changefreq: 'monthly', priority: '0.5' },
];

const productRoutes = products.map((p) => ({
  path: `/products/${p.id}`,
  changefreq: 'weekly',
  priority: '0.8',
}));

const allRoutes = [...staticRoutes, ...productRoutes];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (r) => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const outPath = resolve(__dirname, '../public/sitemap.xml');
writeFileSync(outPath, xml, 'utf8');
console.log(`✓ sitemap.xml generated with ${allRoutes.length} URLs → ${outPath}`);
