# VIBE WEAR — Redesign File Replacements

Replace the following files in your frontend repo with the files in this folder:

## Files to Replace (copy from this zip into your repo)

| This file | Replaces |
|-----------|----------|
| src/App.jsx | src/App.jsx |
| src/index.css | src/index.css |
| tailwind.config.js | tailwind.config.js |
| src/components/Navbar.jsx | src/components/Navbar.jsx |
| src/components/Footer.jsx | src/components/Footer.jsx |
| src/components/ProductCard.jsx | src/components/ProductCard.jsx |
| src/components/HeroSlider.jsx | src/components/HeroSlider.jsx |
| src/pages/Home.jsx | src/pages/Home.jsx |
| src/pages/Products.jsx | src/pages/Products.jsx |
| src/pages/ProductDetail.jsx | src/pages/ProductDetail.jsx |
| src/pages/Cart.jsx | src/pages/Cart.jsx |
| src/pages/Auth.jsx | src/pages/Auth.jsx |
| src/pages/Contact.jsx | src/pages/Contact.jsx |

## What's Changed
- Full white (#fff) background, black (#000) text throughout
- Navbar: Home, Shop, Contact links only (no About / Find Store)
- Mobile navbar: user icon + cart icon visible beside hamburger
- Mobile bottom nav: Home, Shop, Cart, Contact
- ProductCard: + button bottom-right of image for quick add
- Home: category filter tabs (All, Tops, Bottoms, Outerwear, Caps) under hero
- Home: products grouped by New Arrivals, On Sale, All Products sections
- Home: 2x2 fits editorial grid
- Home: Follow Us on Instagram section (6-image grid)
- All pages: clean, minimal, web-store aesthetic
- Currency changer maintained
- About and Find Store pages removed from routes (still exist as files, just not linked)

## After replacing files
1. git add .
2. git commit -m "redesign: white/black web store theme"
3. git push
Netlify will auto-deploy.
