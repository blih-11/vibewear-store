export const categories = [
  { id: 'all', label: 'All' },
  { id: 'fits', label: 'A Fits' },
  { id: 'tops', label: 'Tops' },
  { id: 'bottoms', label: 'Bottoms' },
  { id: 'outerwear', label: 'Outerwear' },
  { id: 'accessories', label: 'Accessories' },
];

// Image map: categorized from 65 images
// Fits = full outfit shots with multiple pieces / styled looks
// Products = individual item focus shots

export const products = [
  // ── FITS (Full outfit styled shots) ────────────────────────────────────────
  { id: 1, name: 'Wave Fit Vol.1', category: ['fits'], price: 179.99, image: '/images/products/img_1.jpg', images: ['/images/products/img_1.jpg', '/images/products/img_2.jpg'], isNew: true, isSale: false, inStock: true, rating: 5, reviews: 0, sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black','White'], description: 'Full outfit bundle. WE THE WAVE.', tags: ['fits'] },
  { id: 2, name: 'Wave Fit Vol.2', category: ['fits'], price: 169.99, image: '/images/products/img_3.jpg', images: ['/images/products/img_3.jpg', '/images/products/img_4.jpg'], isNew: true, isSale: false, inStock: true, rating: 5, reviews: 0, sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black','White'], description: 'Full outfit bundle. WE THE WAVE.', tags: ['fits'] },
  { id: 3, name: 'Wave Fit Vol.3', category: ['fits'], price: 159.99, image: '/images/products/img_5.jpg', images: ['/images/products/img_5.jpg', '/images/products/img_6.jpg'], isNew: false, isSale: false, inStock: true, rating: 5, reviews: 0, sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black','White'], description: 'Full outfit bundle. WE THE WAVE.', tags: ['fits'] },
  { id: 4, name: 'Wave Fit Vol.4', category: ['fits'], price: 164.99, image: '/images/products/img_7.jpg', images: ['/images/products/img_7.jpg', '/images/products/img_8.jpg'], isNew: false, isSale: false, inStock: true, rating: 5, reviews: 0, sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black','White'], description: 'Full outfit bundle. WE THE WAVE.', tags: ['fits'] },
  { id: 5, name: 'Wave Fit Vol.5', category: ['fits'], price: 154.99, image: '/images/products/img_9.jpg', images: ['/images/products/img_9.jpg', '/images/products/img_10.jpg'], isNew: false, isSale: false, inStock: true, rating: 5, reviews: 0, sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black','White'], description: 'Full outfit bundle. WE THE WAVE.', tags: ['fits'] },
  { id: 6, name: 'Wave Fit Vol.6', category: ['fits'], price: 174.99, image: '/images/products/img_11.jpg', images: ['/images/products/img_11.jpg', '/images/products/img_12.jpg'], isNew: false, isSale: false, inStock: true, rating: 5, reviews: 0, sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black','White'], description: 'Full outfit bundle. WE THE WAVE.', tags: ['fits'] },
  { id: 7, name: 'Wave Fit Vol.7', category: ['fits'], price: 184.99, image: '/images/products/img_20.jpg', images: ['/images/products/img_20.jpg', '/images/products/img_21.jpg'], isNew: true, isSale: false, inStock: true, rating: 5, reviews: 0, sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black','White'], description: 'Full outfit bundle. WE THE WAVE.', tags: ['fits'] },
  { id: 8, name: 'Wave Fit Vol.8', category: ['fits'], price: 189.99, image: '/images/products/img_22.jpg', images: ['/images/products/img_22.jpg', '/images/products/img_23.jpg'], isNew: true, isSale: false, inStock: true, rating: 5, reviews: 0, sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black','White'], description: 'Full outfit bundle. WE THE WAVE.', tags: ['fits'] },
  { id: 9, name: 'Wave Fit Vol.9', category: ['fits'], price: 194.99, image: '/images/products/img_24.jpg', images: ['/images/products/img_24.jpg', '/images/products/img_25.jpg', '/images/products/img_26.jpg', '/images/products/img_27.jpg'], isNew: true, isSale: false, inStock: true, rating: 5, reviews: 0, sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black','White'], description: 'Full outfit bundle. WE THE WAVE.', tags: ['fits'] },
  { id: 10, name: 'Wave Fit Vol.10', category: ['fits'], price: 199.99, image: '/images/products/img_65.jpg', images: ['/images/products/img_65.jpg'], isNew: true, isSale: false, inStock: true, rating: 5, reviews: 0, sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black','White'], description: 'Latest drop bundle. WE THE WAVE.', tags: ['fits'] },

  // ── TOPS ────────────────────────────────────────────────────────────────────
  { id: 11, name: 'Vibe Wear Graphic Tee #1', category: ['tops'], price: 49.99, image: '/images/products/img_13.jpg', images: ['/images/products/img_13.jpg'], isNew: true, isSale: false, inStock: true, rating: 4.8, reviews: 12, sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black','White'], description: 'Heavy 240gsm cotton graphic tee. WE THE WAVE.', tags: ['tops','tee'] },
  { id: 12, name: 'Vibe Wear Graphic Tee #2', category: ['tops'], price: 49.99, image: '/images/products/img_14.jpg', images: ['/images/products/img_14.jpg'], isNew: true, isSale: false, inStock: true, rating: 4.9, reviews: 8, sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black','White'], description: 'Heavy 240gsm cotton graphic tee. WE THE WAVE.', tags: ['tops','tee'] },
  { id: 13, name: 'Vibe Wear Graphic Tee #3', category: ['tops'], price: 49.99, image: '/images/products/img_15.jpg', images: ['/images/products/img_15.jpg'], isNew: false, isSale: false, inStock: true, rating: 4.7, reviews: 5, sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black','White'], description: 'Oversized boxy tee. Street premium.', tags: ['tops','tee'] },
  { id: 14, name: 'Vibe Wear Graphic Tee #4', category: ['tops'], price: 54.99, image: '/images/products/img_16.jpg', images: ['/images/products/img_16.jpg'], isNew: false, isSale: true, originalPrice: 69.99, inStock: true, rating: 4.8, reviews: 20, sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black','White'], description: 'Oversized boxy tee. Street premium.', tags: ['tops','tee'] },
  { id: 15, name: 'Vibe Wear Hoodie #1', category: ['tops','outerwear'], price: 89.99, image: '/images/products/img_37.jpg', images: ['/images/products/img_37.jpg', '/images/products/img_38.jpg'], isNew: true, isSale: false, inStock: true, rating: 4.9, reviews: 15, sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black'], description: 'Heavy fleece zip hoodie. WE THE WAVE.', tags: ['tops','hoodie'] },
  { id: 16, name: 'Vibe Wear Hoodie #2', category: ['tops','outerwear'], price: 84.99, image: '/images/products/img_39.jpg', images: ['/images/products/img_39.jpg', '/images/products/img_40.jpg'], isNew: false, isSale: false, inStock: true, rating: 4.8, reviews: 10, sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black','White'], description: 'Heavy fleece zip hoodie. WE THE WAVE.', tags: ['tops','hoodie'] },
  { id: 17, name: 'Vibe Wear Shirt #1', category: ['tops'], price: 74.99, image: '/images/products/img_41.jpg', images: ['/images/products/img_41.jpg'], isNew: true, isSale: false, inStock: true, rating: 4.7, reviews: 6, sizes: ['XS','S','M','L','XL','XXL'], colors: ['White','Black'], description: 'Oversized short-sleeve shirt. Street ready.', tags: ['tops','shirt'] },
  { id: 18, name: 'Vibe Wear Shirt #2', category: ['tops'], price: 74.99, image: '/images/products/img_42.jpg', images: ['/images/products/img_42.jpg', '/images/products/img_43.jpg'], isNew: false, isSale: true, originalPrice: 89.99, inStock: true, rating: 4.6, reviews: 9, sizes: ['XS','S','M','L','XL','XXL'], colors: ['White','Black'], description: 'Oversized short-sleeve shirt. Street ready.', tags: ['tops','shirt'] },
  { id: 19, name: 'Vibe Wear Shirt #3', category: ['tops'], price: 79.99, image: '/images/products/img_44.jpg', images: ['/images/products/img_44.jpg'], isNew: true, isSale: false, inStock: true, rating: 4.8, reviews: 14, sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black'], description: 'Premium short-sleeve. WE THE WAVE.', tags: ['tops','shirt'] },
  { id: 20, name: 'Vibe Wear Shirt #4', category: ['tops'], price: 79.99, image: '/images/products/img_46.jpg', images: ['/images/products/img_46.jpg'], isNew: false, isSale: false, inStock: true, rating: 4.7, reviews: 7, sizes: ['XS','S','M','L','XL','XXL'], colors: ['White'], description: 'Premium short-sleeve. WE THE WAVE.', tags: ['tops','shirt'] },

  // ── BOTTOMS ─────────────────────────────────────────────────────────────────
  { id: 21, name: 'Vibe Wear Jeans #1', category: ['bottoms'], price: 99.99, image: '/images/products/img_28.jpg', images: ['/images/products/img_28.jpg'], isNew: true, isSale: false, inStock: true, rating: 4.9, reviews: 18, sizes: ['28','30','32','34','36'], colors: ['Black','Indigo'], description: 'Street-cut denim. Built for movement.', tags: ['bottoms','jeans'] },
  { id: 22, name: 'Vibe Wear Jeans #2', category: ['bottoms'], price: 99.99, image: '/images/products/img_29.jpg', images: ['/images/products/img_29.jpg'], isNew: false, isSale: false, inStock: true, rating: 4.8, reviews: 11, sizes: ['28','30','32','34','36'], colors: ['Black','Indigo'], description: 'Street-cut denim. Built for movement.', tags: ['bottoms','jeans'] },
  { id: 23, name: 'Vibe Wear Jeans #3', category: ['bottoms'], price: 109.99, image: '/images/products/img_30.jpg', images: ['/images/products/img_30.jpg'], isNew: true, isSale: false, inStock: true, rating: 4.9, reviews: 22, sizes: ['28','30','32','34','36'], colors: ['Black'], description: 'Premium cargo jeans. WE THE WAVE.', tags: ['bottoms','jeans','cargo'] },
  { id: 24, name: 'Vibe Wear Jeans #4', category: ['bottoms'], price: 109.99, image: '/images/products/img_31.jpg', images: ['/images/products/img_31.jpg'], isNew: false, isSale: true, originalPrice: 129.99, inStock: true, rating: 4.7, reviews: 16, sizes: ['28','30','32','34','36'], colors: ['Black'], description: 'Premium cargo jeans. WE THE WAVE.', tags: ['bottoms','jeans','cargo'] },
  { id: 25, name: 'Vibe Wear Jeans #5', category: ['bottoms'], price: 94.99, image: '/images/products/img_32.jpg', images: ['/images/products/img_32.jpg', '/images/products/img_33.jpg'], isNew: true, isSale: false, inStock: true, rating: 4.8, reviews: 9, sizes: ['28','30','32','34','36'], colors: ['Black','Blue'], description: 'Distressed straight-leg. Street premium.', tags: ['bottoms','jeans'] },
  { id: 26, name: 'Vibe Wear Shorts #1', category: ['bottoms'], price: 69.99, image: '/images/products/img_34.jpg', images: ['/images/products/img_34.jpg'], isNew: true, isSale: false, inStock: true, rating: 4.7, reviews: 13, sizes: ['S','M','L','XL','XXL'], colors: ['Black','White'], description: 'Cargo shorts. Ready for the streets.', tags: ['bottoms','shorts'] },
  { id: 27, name: 'Vibe Wear Shorts #2', category: ['bottoms'], price: 74.99, image: '/images/products/img_35.jpg', images: ['/images/products/img_35.jpg'], isNew: false, isSale: false, inStock: true, rating: 4.8, reviews: 8, sizes: ['S','M','L','XL','XXL'], colors: ['Black'], description: 'Denim shorts. Street ready.', tags: ['bottoms','shorts'] },
  { id: 28, name: 'Vibe Wear Shorts #3', category: ['bottoms'], price: 69.99, image: '/images/products/img_36.jpg', images: ['/images/products/img_36.jpg'], isNew: false, isSale: true, originalPrice: 84.99, inStock: true, rating: 4.6, reviews: 5, sizes: ['S','M','L','XL','XXL'], colors: ['Black'], description: 'Tactical cargo shorts. WE THE WAVE.', tags: ['bottoms','shorts','cargo'] },

  // ── OUTERWEAR ───────────────────────────────────────────────────────────────
  { id: 29, name: 'Vibe Wear Jacket #1', category: ['outerwear'], price: 159.99, image: '/images/products/img_47.jpg', images: ['/images/products/img_47.jpg', '/images/products/img_48.jpg'], isNew: true, isSale: false, inStock: true, rating: 4.9, reviews: 7, sizes: ['S','M','L','XL','XXL'], colors: ['Black'], description: 'Heavy washed jacket. Street outerwear. WE THE WAVE.', tags: ['outerwear','jacket'] },
  { id: 30, name: 'Vibe Wear Jacket #2', category: ['outerwear'], price: 149.99, image: '/images/products/img_49.jpg', images: ['/images/products/img_49.jpg', '/images/products/img_50.jpg'], isNew: false, isSale: false, inStock: true, rating: 4.8, reviews: 11, sizes: ['S','M','L','XL','XXL'], colors: ['Black','Grey'], description: 'Bomber jacket. Street outerwear. WE THE WAVE.', tags: ['outerwear','jacket','bomber'] },
  { id: 31, name: 'Vibe Wear Vest #1', category: ['outerwear'], price: 89.99, image: '/images/products/img_51.jpg', images: ['/images/products/img_51.jpg'], isNew: true, isSale: true, originalPrice: 119.99, inStock: true, rating: 4.7, reviews: 6, sizes: ['S','M','L','XL','XXL'], colors: ['Black'], description: 'Puffer vest. Street outerwear.', tags: ['outerwear','vest'] },
  { id: 32, name: 'Vibe Wear Vest #2', category: ['outerwear'], price: 89.99, image: '/images/products/img_52.jpg', images: ['/images/products/img_52.jpg', '/images/products/img_53.jpg'], isNew: false, isSale: false, inStock: true, rating: 4.8, reviews: 14, sizes: ['S','M','L','XL','XXL'], colors: ['Black','White'], description: 'Reversible puffer vest. Street outerwear.', tags: ['outerwear','vest'] },

  // ── ACCESSORIES ─────────────────────────────────────────────────────────────
  { id: 33, name: 'Vibe Wear Cap #1', category: ['accessories'], price: 29.99, image: '/images/products/img_54.jpg', images: ['/images/products/img_54.jpg'], isNew: true, isSale: false, inStock: true, rating: 4.9, reviews: 25, sizes: ['One Size'], colors: ['Black','White'], description: 'Street cap. VIBE WEAR branded.', tags: ['accessories','cap'] },
  { id: 34, name: 'Vibe Wear Cap #2', category: ['accessories'], price: 29.99, image: '/images/products/img_55.jpg', images: ['/images/products/img_55.jpg'], isNew: false, isSale: false, inStock: true, rating: 4.8, reviews: 17, sizes: ['One Size'], colors: ['Black'], description: 'Street cap. VIBE WEAR branded.', tags: ['accessories','cap'] },
  { id: 35, name: 'Vibe Wear Beanie #1', category: ['accessories'], price: 24.99, image: '/images/products/img_56.jpg', images: ['/images/products/img_56.jpg'], isNew: true, isSale: false, inStock: true, rating: 4.7, reviews: 10, sizes: ['One Size'], colors: ['Black','White'], description: 'Ribbed knit beanie. VIBE WEAR branded.', tags: ['accessories','beanie'] },
  { id: 36, name: 'Vibe Wear Bucket Hat', category: ['accessories'], price: 32.99, image: '/images/products/img_57.jpg', images: ['/images/products/img_57.jpg'], isNew: false, isSale: true, originalPrice: 44.99, inStock: true, rating: 4.8, reviews: 19, sizes: ['One Size'], colors: ['Black','White'], description: 'Wide brim bucket hat. VIBE WEAR branded.', tags: ['accessories','bucket'] },

  // ── MORE TOPS / LOOKBOOK SHOTS ──────────────────────────────────────────────
  { id: 37, name: 'Vibe Wear Tee #5', category: ['tops'], price: 44.99, image: '/images/products/img_58.jpg', images: ['/images/products/img_58.jpg'], isNew: false, isSale: false, inStock: true, rating: 4.6, reviews: 4, sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black','White'], description: 'Graphic tee. WE THE WAVE.', tags: ['tops','tee'] },
  { id: 38, name: 'Vibe Wear Tee #6', category: ['tops'], price: 44.99, image: '/images/products/img_59.jpg', images: ['/images/products/img_59.jpg'], isNew: false, isSale: false, inStock: true, rating: 4.7, reviews: 6, sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black','White'], description: 'Graphic tee. WE THE WAVE.', tags: ['tops','tee'] },
  { id: 39, name: 'Vibe Wear Tee #7', category: ['tops'], price: 49.99, image: '/images/products/img_60.jpg', images: ['/images/products/img_60.jpg'], isNew: true, isSale: false, inStock: true, rating: 4.8, reviews: 11, sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black','White'], description: 'Premium graphic tee. WE THE WAVE.', tags: ['tops','tee'] },
  { id: 40, name: 'Vibe Wear Tee #8', category: ['tops'], price: 49.99, image: '/images/products/img_61.jpg', images: ['/images/products/img_61.jpg'], isNew: false, isSale: true, originalPrice: 64.99, inStock: true, rating: 4.6, reviews: 8, sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black','White'], description: 'Premium graphic tee. WE THE WAVE.', tags: ['tops','tee'] },
  { id: 41, name: 'Vibe Wear Tee #9', category: ['tops'], price: 54.99, image: '/images/products/img_62.jpg', images: ['/images/products/img_62.jpg'], isNew: true, isSale: false, inStock: true, rating: 4.9, reviews: 16, sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black'], description: 'Premium heavyweight tee. WE THE WAVE.', tags: ['tops','tee'] },
  { id: 42, name: 'Vibe Wear Tee #10', category: ['tops'], price: 54.99, image: '/images/products/img_63.jpg', images: ['/images/products/img_63.jpg'], isNew: false, isSale: false, inStock: true, rating: 4.7, reviews: 7, sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black'], description: 'Premium heavyweight tee. WE THE WAVE.', tags: ['tops','tee'] },
  { id: 43, name: 'Vibe Wear Tee #11', category: ['tops'], price: 44.99, image: '/images/products/img_64.jpg', images: ['/images/products/img_64.jpg'], isNew: false, isSale: false, inStock: true, rating: 4.5, reviews: 3, sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black','White'], description: 'Graphic tee. WE THE WAVE.', tags: ['tops','tee'] },
  { id: 44, name: 'Vibe Wear Shirt #5', category: ['tops'], price: 79.99, image: '/images/products/img_45.jpg', images: ['/images/products/img_45.jpg'], isNew: false, isSale: false, inStock: true, rating: 4.7, reviews: 9, sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black','White'], description: 'Street shirt. WE THE WAVE.', tags: ['tops','shirt'] },
];

export const heroSlides = [
  {
    id: 1,
    title: 'WE THE\nWAVE',
    subtitle: 'New season drops. Premium streetwear built different.',
    cta: 'Shop Now',
    badge: 'New Drop',
    image: '/images/products/img_65.jpg',
  },
  {
    id: 2,
    title: 'VIBE\nWEAR',
    subtitle: 'Street-ready fits. Zero compromise. Lagos to the world.',
    cta: 'View Fits',
    badge: 'A Fits',
    image: '/images/products/img_22.jpg',
  },
  {
    id: 3,
    title: 'CATCH\nTHE WAVE',
    subtitle: 'The latest from VIBE WEAR. Limited pieces. Move fast.',
    cta: 'Shop Collection',
    badge: 'Limited',
    image: '/images/products/img_9.jpg',
  },
];

export const storeLocations = [
  {
    id: 1,
    name: 'VIBE WEAR Lagos',
    address: '15 Adeola Odeku Street, Victoria Island, Lagos',
    phone: '+234 801 234 5678',
    hours: 'Mon–Sat: 9am–8pm | Sun: 11am–6pm',
    mapUrl: 'https://maps.google.com',
  },
  {
    id: 2,
    name: 'VIBE WEAR Ikeja',
    address: 'Ikeja City Mall, Obafemi Awolowo Way, Ikeja, Lagos',
    phone: '+234 802 345 6789',
    hours: 'Mon–Sat: 10am–9pm | Sun: 12pm–7pm',
    mapUrl: 'https://maps.google.com',
  },
];
