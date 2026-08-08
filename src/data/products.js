// ─── PATH HELPER ─────────────────────────────────────────────────────────────
const P = (f) => `/images/products/${f}`;
const S = (f) => `/images/products/${f}`;

// ─── SNAP IMAGE ALIASES (renamed to img_66–img_109) ──────────────────────────
// G18354082 — White graphic tee
const TEE_G1_flat    = S('img_68.jpg');  // 485090257
const TEE_G1_model   = S('img_69.jpg');  // 485186279

// G18354520 — Striped polo shirt (pink/tan rugby)
const POLO_flat      = S('img_73.jpg');  // 486226370
const POLO_models    = [
  S('img_66.jpg'),  // 484922786
  S('img_67.jpg'),  // 485011691
  S('img_70.jpg'),  // 485274761
  S('img_71.jpg'),  // 485492466
  S('img_72.jpg'),  // 485878805
];

// G18357313 — Denim jacket + jeans set
const DENIM_SET_jacket_flat = S('img_79.jpg');  // 491452971
const DENIM_SET_jeans_flat  = S('img_80.jpg');  // 491453197
const DENIM_SET_models = [
  S('img_74.jpg'),  // 491441053
  S('img_75.jpg'),  // 491441782
  S('img_76.jpg'),  // 491442681
  S('img_77.jpg'),  // 491445214
  S('img_78.jpg'),  // 491446120
  S('img_81.jpg'),  // 491460367
  S('img_82.jpg'),  // 491468737
  S('img_83.jpg'),  // 491470928
  S('img_84.jpg'),  // 491511963
];

// G18364638 — Olive/brown short-sleeve shirt + denim bucket hat
const OLIVE_SHIRT_flat    = S('img_87.jpg');  // 504872657
const OLIVE_SHIRT_models  = [
  S('img_85.jpg'),  // 504412799
  S('img_86.jpg'),  // 504555937
  S('img_88.jpg'),  // 505168754
  S('img_89.jpg'),  // 505764966
];
const BUCKET_HAT_flat     = S('img_90.jpg');  // 509721350
const BUCKET_HAT_back     = S('img_90.jpg');  // duplicate was deleted, use same

// G18369324 — White printed tee
const WHITE_TEE_flat   = S('img_92.jpg');  // 525387505
const WHITE_TEE_models = [
  S('img_91.jpg'),  // 524925241
  S('img_93.jpg'),  // 525928901
];

// G18380261 — White oversized button-up shirt
const WHITE_SHIRT_flat   = S('img_94.jpg');  // 568609617
const WHITE_SHIRT_back   = S('img_95.jpg');  // 568688343
const WHITE_SHIRT_models = [
  S('img_96.jpg'),  // 570032076
  S('img_97.jpg'),  // 570081259
  S('img_98.jpg'),  // 570845760
  S('img_99.jpg'),  // 570859148
];

// G18380395 — Black lace-up boots
const BOOTS_flat  = S('img_100.jpg');  // 571279343
const BOOTS_side  = S('img_101.jpg');  // 571959068

// G18380641 — Army/olive 5-panel cap
const ARMY_CAP_flat   = S('img_102.jpg');  // 572106110
const ARMY_CAP_side   = S('img_103.jpg');  // 572376070
const ARMY_CAP_model  = S('img_104.jpg');  // 573268200

// G18382469 — Grey recovery slides
const SLIDES_flat   = S('img_105.jpg');  // 581327984
const SLIDES_side   = S('img_107.jpg');  // 581708472
const SLIDES_model  = S('img_106.jpg');  // 581524035

// G18382975 — White graphic tee (second drop)
const TEE_G10_flat  = S('img_108.jpg');  // 582229399
const TEE_G10_model = S('img_109.jpg');  // 583779745

// ─── CATEGORIES ──────────────────────────────────────────────────────────────
export const categories = [
  { id: 'all',         label: 'All' },
  { id: 'tees',        label: 'Tees' },
  { id: 'shirts',      label: 'Shirts' },
  { id: 'hoodies',     label: 'Hoodies' },
  { id: 'bottoms',     label: 'Bottoms' },
  { id: 'outerwear',   label: 'Outerwear' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'fullfit',     label: 'Full Fits' },
];

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
export const products = [

  // ══════════════════════════════════════════════════════════
  //  TEES
  // ══════════════════════════════════════════════════════════
  {
    id: 1, name: 'Graphic Tee — WE THE WAVE I',
    category: ['tees'], price: 49.99,
    image: P('img_2.jpg'), images: [P('img_2.jpg')],
    isNew: true, isSale: false, inStock: true, rating: 4.8, reviews: 12,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['White'],
    description: 'Heavy 240gsm cotton graphic tee. WE THE WAVE.', tags: ['tees','graphic'],
  },
  {
    id: 2, name: 'Graphic Tee — WE THE WAVE II',
    category: ['tees'], price: 49.99,
    image: P('img_3.jpg'), images: [P('img_3.jpg')],
    isNew: true, isSale: false, inStock: true, rating: 4.9, reviews: 8,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['White'],
    description: 'Heavy 240gsm cotton graphic tee. WE THE WAVE.', tags: ['tees','graphic'],
  },
  {
    id: 3, name: 'Graphic Tee — Cream',
    category: ['tees'], price: 49.99,
    image: P('img_6.jpg'), images: [P('img_6.jpg')],
    isNew: false, isSale: false, inStock: true, rating: 4.7, reviews: 5,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['Cream'],
    description: 'Washed cream graphic tee.', tags: ['tees','graphic'],
  },
  {
    id: 4, name: 'Graphic Tee — Dark I',
    category: ['tees'], price: 49.99,
    image: P('img_7.jpg'), images: [P('img_7.jpg')],
    isNew: false, isSale: false, inStock: true, rating: 4.8, reviews: 7,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black'],
    description: 'Dark graphic tee. WE THE WAVE.', tags: ['tees','graphic'],
  },
  {
    id: 5, name: 'Graphic Tee — Dark II',
    category: ['tees'], price: 49.99,
    image: P('img_12.jpg'), images: [P('img_12.jpg')],
    isNew: true, isSale: false, inStock: true, rating: 4.7, reviews: 6,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black'],
    description: 'Dark graphic tee.', tags: ['tees','graphic'],
  },
  {
    id: 6, name: 'Graphic Tee — Dark III',
    category: ['tees'], price: 54.99,
    image: P('img_13.jpg'), images: [P('img_13.jpg')],
    isNew: true, isSale: false, inStock: true, rating: 4.8, reviews: 20,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black'],
    description: 'Oversized boxy tee. Street premium.', tags: ['tees','graphic'],
  },
  {
    id: 7, name: 'Graphic Tee — Dark IV',
    category: ['tees'], price: 54.99,
    image: P('img_14.jpg'), images: [P('img_14.jpg')],
    isNew: false, isSale: true, originalPrice: 69.99, inStock: true, rating: 4.8, reviews: 14,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black'],
    description: 'Oversized boxy tee. Street premium.', tags: ['tees','graphic'],
  },
  {
    id: 8, name: 'Graphic Tee — Dark V',
    category: ['tees'], price: 49.99,
    image: P('img_15.jpg'), images: [P('img_15.jpg')],
    isNew: false, isSale: false, inStock: true, rating: 4.6, reviews: 9,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black'],
    description: 'Graphic tee. WE THE WAVE.', tags: ['tees','graphic'],
  },
  {
    id: 9, name: 'Graphic Tee — Dark VI',
    category: ['tees'], price: 49.99,
    image: P('img_16.jpg'), images: [P('img_16.jpg')],
    isNew: true, isSale: false, inStock: true, rating: 4.8, reviews: 11,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black'],
    description: 'Premium graphic tee. WE THE WAVE.', tags: ['tees','graphic'],
  },
  {
    id: 10, name: 'Graphic Tee — Vintage I',
    category: ['tees'], price: 49.99,
    image: P('img_22.jpg'), images: [P('img_22.jpg')],
    isNew: false, isSale: true, originalPrice: 64.99, inStock: true, rating: 4.6, reviews: 8,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black'],
    description: 'Vintage washed graphic tee.', tags: ['tees','vintage'],
  },
  {
    id: 11, name: 'Graphic Tee — Vintage II',
    category: ['tees'], price: 54.99,
    image: P('img_23.jpg'), images: [P('img_23.jpg')],
    isNew: true, isSale: false, inStock: true, rating: 4.9, reviews: 16,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black'],
    description: 'Premium heavyweight vintage tee.', tags: ['tees','vintage'],
  },
  {
    id: 12, name: 'Graphic Tee — Vintage III',
    category: ['tees'], price: 54.99,
    image: P('img_29.jpg'), images: [P('img_29.jpg')],
    isNew: false, isSale: false, inStock: true, rating: 4.7, reviews: 7,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black'],
    description: 'Washed graphic tee.', tags: ['tees','vintage'],
  },
  {
    id: 13, name: 'Graphic Tee — Vintage IV',
    category: ['tees'], price: 49.99,
    image: P('img_30.jpg'), images: [P('img_30.jpg')],
    isNew: false, isSale: false, inStock: true, rating: 4.7, reviews: 6,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black'],
    description: 'Vintage graphic tee.', tags: ['tees','vintage'],
  },
  {
    id: 14, name: 'Graphic Tee — Vintage V',
    category: ['tees'], price: 44.99,
    image: P('img_31.jpg'), images: [P('img_31.jpg')],
    isNew: false, isSale: false, inStock: true, rating: 4.6, reviews: 4,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black'],
    description: 'Graphic tee. WE THE WAVE.', tags: ['tees','graphic'],
  },
  {
    id: 15, name: 'Graphic Tee — Vintage VI',
    category: ['tees'], price: 44.99,
    image: P('img_32.jpg'), images: [P('img_32.jpg')],
    isNew: false, isSale: false, inStock: true, rating: 4.7, reviews: 6,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black'],
    description: 'Graphic tee. WE THE WAVE.', tags: ['tees','graphic'],
  },
  {
    id: 16, name: 'Graphic Tee — Supreme',
    category: ['tees'], price: 59.99,
    image: P('img_24.jpg'), images: [P('img_24.jpg')],
    isNew: true, isSale: false, inStock: true, rating: 4.9, reviews: 22,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['Yellow'],
    description: 'Premium graphic tee.', tags: ['tees','graphic','collab'],
  },
  {
    id: 17, name: 'Graphic Tee — Brown',
    category: ['tees'], price: 49.99,
    image: P('img_37.jpg'), images: [P('img_37.jpg')],
    isNew: false, isSale: false, inStock: true, rating: 4.7, reviews: 9,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['Brown'],
    description: 'Washed brown graphic tee.', tags: ['tees','graphic'],
  },
  {
    id: 18, name: 'Graphic Tee — Sand',
    category: ['tees'], price: 49.99,
    image: P('img_49.jpg'), images: [P('img_49.jpg')],
    isNew: false, isSale: false, inStock: true, rating: 4.7, reviews: 5,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['Sand'],
    description: 'Sand washed graphic tee.', tags: ['tees','graphic'],
  },
  {
    id: 19, name: 'Graphic Tee — Red',
    category: ['tees'], price: 49.99,
    image: P('img_45.jpg'), images: [P('img_45.jpg')],
    isNew: true, isSale: false, inStock: true, rating: 4.8, reviews: 13,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['Red'],
    description: 'Washed red graphic tee.', tags: ['tees','graphic'],
  },
  // New Drop tees
  {
    id: 51, name: 'Drop Tee — White Graphic I',
    category: ['tees'], price: 59.99,
    image: TEE_G1_flat, images: [TEE_G1_flat, TEE_G1_model],
    isNew: true, isSale: false, inStock: true, rating: 5, reviews: 0,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['White'],
    description: 'Fresh drop. Heavyweight white graphic tee.', tags: ['tees','new','drop'],
  },
  {
    id: 52, name: 'Drop Tee — White Graphic II',
    category: ['tees'], price: 59.99,
    image: WHITE_TEE_flat, images: [WHITE_TEE_flat, ...WHITE_TEE_models],
    isNew: true, isSale: false, inStock: true, rating: 5, reviews: 0,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['White'],
    description: 'Fresh drop. Printed graphic tee.', tags: ['tees','new','drop'],
  },
  {
    id: 53, name: 'Drop Tee — White Graphic III',
    category: ['tees'], price: 59.99,
    image: TEE_G10_flat, images: [TEE_G10_flat, TEE_G10_model],
    isNew: true, isSale: false, inStock: true, rating: 5, reviews: 0,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['White'],
    description: 'Fresh drop. Graphic tee.', tags: ['tees','new','drop'],
  },

  // ══════════════════════════════════════════════════════════
  //  SHIRTS
  // ══════════════════════════════════════════════════════════
  {
    id: 54, name: 'Drop Shirt — Striped Polo',
    category: ['shirts'], price: 79.99,
    image: POLO_flat, images: [POLO_flat, ...POLO_models],
    isNew: true, isSale: false, inStock: true, rating: 5, reviews: 0,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['Pink/Tan'],
    description: 'Oversized rugby polo. Fresh drop.', tags: ['shirts','polo','new','drop'],
  },
  {
    id: 55, name: 'Drop Shirt — Olive SS',
    category: ['shirts'], price: 74.99,
    image: OLIVE_SHIRT_flat, images: [OLIVE_SHIRT_flat, ...OLIVE_SHIRT_models],
    isNew: true, isSale: false, inStock: true, rating: 5, reviews: 0,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['Olive'],
    description: 'Short sleeve olive work shirt. WE THE WAVE.', tags: ['shirts','new','drop'],
  },
  {
    id: 56, name: 'Drop Shirt — White Oversized',
    category: ['shirts'], price: 74.99,
    image: WHITE_SHIRT_flat, images: [WHITE_SHIRT_flat, WHITE_SHIRT_back, ...WHITE_SHIRT_models],
    isNew: true, isSale: false, inStock: true, rating: 5, reviews: 0,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['White'],
    description: 'Oversized white button-up. Street premium.', tags: ['shirts','new','drop'],
  },
  {
    id: 20, name: 'Shirt — Denim SS I',
    category: ['shirts'], price: 74.99,
    image: P('img_41.jpg'), images: [P('img_41.jpg')],
    isNew: true, isSale: false, inStock: true, rating: 4.7, reviews: 6,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['Blue'],
    description: 'Short-sleeve denim shirt. Street ready.', tags: ['shirts','denim'],
  },
  {
    id: 21, name: 'Shirt — Denim SS II',
    category: ['shirts'], price: 74.99,
    image: P('img_42.jpg'), images: [P('img_42.jpg'), P('img_43.jpg')],
    isNew: false, isSale: true, originalPrice: 89.99, inStock: true, rating: 4.6, reviews: 9,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['Blue'],
    description: 'Short-sleeve denim shirt. Street ready.', tags: ['shirts','denim'],
  },
  {
    id: 22, name: 'Shirt — Premium SS',
    category: ['shirts'], price: 79.99,
    image: P('img_44.jpg'), images: [P('img_44.jpg')],
    isNew: true, isSale: false, inStock: true, rating: 4.8, reviews: 14,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black'],
    description: 'Premium short-sleeve. WE THE WAVE.', tags: ['shirts'],
  },

  // ══════════════════════════════════════════════════════════
  //  HOODIES
  // ══════════════════════════════════════════════════════════
  {
    id: 30, name: 'Hoodie — Heavy Fleece I',
    category: ['hoodies'], price: 89.99,
    image: P('img_27.jpg'), images: [P('img_27.jpg'), P('img_28.jpg')],
    isNew: true, isSale: false, inStock: true, rating: 4.9, reviews: 15,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black'],
    description: 'Heavy fleece zip hoodie. WE THE WAVE.', tags: ['hoodies'],
  },
  {
    id: 31, name: 'Hoodie — Heavy Fleece II',
    category: ['hoodies'], price: 84.99,
    image: P('img_17.jpg'), images: [P('img_17.jpg')],
    isNew: false, isSale: false, inStock: true, rating: 4.8, reviews: 10,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['Black','White'],
    description: 'Heavy fleece hoodie. WE THE WAVE.', tags: ['hoodies'],
  },

  // ══════════════════════════════════════════════════════════
  //  BOTTOMS
  // ══════════════════════════════════════════════════════════
  {
    id: 40, name: 'Shorts — Denim Wash',
    category: ['bottoms'], price: 69.99,
    image: P('img_1.jpg'), images: [P('img_1.jpg')],
    isNew: true, isSale: false, inStock: true, rating: 4.7, reviews: 13,
    sizes: ['S','M','L','XL','XXL'], colors: ['Blue'],
    description: 'Washed denim shorts.', tags: ['bottoms','shorts'],
  },
  {
    id: 41, name: 'Shorts — Plaid',
    category: ['bottoms'], price: 69.99,
    image: P('img_11.jpg'), images: [P('img_11.jpg')],
    isNew: false, isSale: false, inStock: true, rating: 4.7, reviews: 8,
    sizes: ['S','M','L','XL','XXL'], colors: ['Red/Black'],
    description: 'Plaid street shorts.', tags: ['bottoms','shorts'],
  },
  {
    id: 42, name: 'Shorts — Navy Cargo',
    category: ['bottoms'], price: 74.99,
    image: P('img_65.jpg'), images: [P('img_65.jpg')],
    isNew: true, isSale: false, inStock: true, rating: 4.8, reviews: 6,
    sizes: ['S','M','L','XL','XXL'], colors: ['Navy'],
    description: 'Cargo shorts. Ready for the streets.', tags: ['bottoms','shorts','cargo'],
  },
  {
    id: 43, name: 'Jeans — Black I',
    category: ['bottoms'], price: 99.99,
    image: P('img_9.jpg'), images: [P('img_9.jpg')],
    isNew: true, isSale: false, inStock: true, rating: 4.9, reviews: 18,
    sizes: ['28','30','32','34','36'], colors: ['Black'],
    description: 'Street-cut black denim. Built for movement.', tags: ['bottoms','jeans'],
  },
  {
    id: 44, name: 'Jeans — Black II',
    category: ['bottoms'], price: 99.99,
    image: P('img_10.jpg'), images: [P('img_10.jpg')],
    isNew: false, isSale: false, inStock: true, rating: 4.8, reviews: 11,
    sizes: ['28','30','32','34','36'], colors: ['Black'],
    description: 'Street-cut black denim.', tags: ['bottoms','jeans'],
  },
  {
    id: 45, name: 'Jeans — Baggy Washed',
    category: ['bottoms'], price: 109.99,
    image: P('img_26.jpg'), images: [P('img_26.jpg')],
    isNew: true, isSale: false, inStock: true, rating: 4.9, reviews: 22,
    sizes: ['28','30','32','34','36'], colors: ['Indigo'],
    description: 'Baggy washed denim. WE THE WAVE.', tags: ['bottoms','jeans','baggy'],
  },
  {
    id: 46, name: 'Jeans — Drop Denim',
    category: ['bottoms'], price: 109.99,
    image: DENIM_SET_jeans_flat, images: [DENIM_SET_jeans_flat, ...DENIM_SET_models.slice(0,3)],
    isNew: true, isSale: false, inStock: true, rating: 5, reviews: 0,
    sizes: ['28','30','32','34','36'], colors: ['Blue'],
    description: 'Drop wash denim jeans. WE THE WAVE.', tags: ['bottoms','jeans','new','drop'],
  },

  // ══════════════════════════════════════════════════════════
  //  OUTERWEAR
  // ══════════════════════════════════════════════════════════
  {
    id: 60, name: 'Jacket — Denim Drop',
    category: ['outerwear'], price: 149.99,
    image: DENIM_SET_jacket_flat, images: [DENIM_SET_jacket_flat, ...DENIM_SET_models.slice(3)],
    isNew: true, isSale: false, inStock: true, rating: 5, reviews: 0,
    sizes: ['S','M','L','XL','XXL'], colors: ['Blue'],
    description: 'Washed denim jacket. WE THE WAVE.', tags: ['outerwear','jacket','new','drop'],
  },
  {
    id: 61, name: 'Jacket — Heavy Wash I',
    category: ['outerwear'], price: 159.99,
    image: P('img_47.jpg'), images: [P('img_47.jpg'), P('img_48.jpg')],
    isNew: true, isSale: false, inStock: true, rating: 4.9, reviews: 7,
    sizes: ['S','M','L','XL','XXL'], colors: ['Black'],
    description: 'Heavy washed jacket. WE THE WAVE.', tags: ['outerwear','jacket'],
  },
  {
    id: 62, name: 'Jacket — Heavy Wash II',
    category: ['outerwear'], price: 149.99,
    image: P('img_46.jpg'), images: [P('img_46.jpg')],
    isNew: false, isSale: false, inStock: true, rating: 4.8, reviews: 11,
    sizes: ['S','M','L','XL','XXL'], colors: ['Black'],
    description: 'Bomber jacket. Street outerwear.', tags: ['outerwear','jacket','bomber'],
  },
  {
    id: 63, name: 'Vest — Puffer I',
    category: ['outerwear'], price: 89.99,
    image: P('img_51.jpg'), images: [P('img_51.jpg')],
    isNew: true, isSale: true, originalPrice: 119.99, inStock: true, rating: 4.7, reviews: 6,
    sizes: ['S','M','L','XL','XXL'], colors: ['Black'],
    description: 'Puffer vest. Street outerwear.', tags: ['outerwear','vest'],
  },
  {
    id: 64, name: 'Vest — Puffer II',
    category: ['outerwear'], price: 89.99,
    image: P('img_52.jpg'), images: [P('img_52.jpg'), P('img_53.jpg')],
    isNew: false, isSale: false, inStock: true, rating: 4.8, reviews: 14,
    sizes: ['S','M','L','XL','XXL'], colors: ['Black','White'],
    description: 'Reversible puffer vest.', tags: ['outerwear','vest'],
  },

  // ══════════════════════════════════════════════════════════
  //  ACCESSORIES
  // ══════════════════════════════════════════════════════════
  {
    id: 70, name: 'Cap — Army 5-Panel',
    category: ['accessories'], price: 34.99,
    image: ARMY_CAP_flat, images: [ARMY_CAP_flat, ARMY_CAP_side, ARMY_CAP_model],
    isNew: true, isSale: false, inStock: true, rating: 5, reviews: 0,
    sizes: ['One Size'], colors: ['Olive'],
    description: 'Washed army 5-panel cap. WE THE WAVE.', tags: ['accessories','cap','new','drop'],
  },
  {
    id: 71, name: 'Cap — Denim Bucket',
    category: ['accessories'], price: 39.99,
    image: BUCKET_HAT_flat, images: [BUCKET_HAT_flat, BUCKET_HAT_back],
    isNew: true, isSale: false, inStock: true, rating: 5, reviews: 0,
    sizes: ['One Size'], colors: ['Blue'],
    description: 'Distressed denim bucket hat.', tags: ['accessories','cap','bucket','new','drop'],
  },
  {
    id: 72, name: 'Cap — Street I',
    category: ['accessories'], price: 29.99,
    image: P('img_54.jpg'), images: [P('img_54.jpg')],
    isNew: true, isSale: false, inStock: true, rating: 4.9, reviews: 25,
    sizes: ['One Size'], colors: ['Black','White'],
    description: 'Street cap. VIBE WEAR branded.', tags: ['accessories','cap'],
  },
  {
    id: 73, name: 'Cap — Street II',
    category: ['accessories'], price: 29.99,
    image: P('img_55.jpg'), images: [P('img_55.jpg')],
    isNew: false, isSale: false, inStock: true, rating: 4.8, reviews: 17,
    sizes: ['One Size'], colors: ['Black'],
    description: 'Street cap. VIBE WEAR branded.', tags: ['accessories','cap'],
  },
  {
    id: 74, name: 'Beanie — Ribbed',
    category: ['accessories'], price: 24.99,
    image: P('img_56.jpg'), images: [P('img_56.jpg')],
    isNew: true, isSale: false, inStock: true, rating: 4.7, reviews: 10,
    sizes: ['One Size'], colors: ['Black','White'],
    description: 'Ribbed knit beanie. VIBE WEAR branded.', tags: ['accessories','beanie'],
  },
  {
    id: 75, name: 'Bucket Hat — Wide Brim',
    category: ['accessories'], price: 32.99,
    image: P('img_57.jpg'), images: [P('img_57.jpg')],
    isNew: false, isSale: true, originalPrice: 44.99, inStock: true, rating: 4.8, reviews: 19,
    sizes: ['One Size'], colors: ['Black','White'],
    description: 'Wide brim bucket hat. VIBE WEAR branded.', tags: ['accessories','bucket'],
  },
  {
    id: 76, name: 'Boots — Black Combat',
    category: ['accessories'], price: 189.99,
    image: BOOTS_flat, images: [BOOTS_flat, BOOTS_side],
    isNew: true, isSale: false, inStock: true, rating: 5, reviews: 0,
    sizes: ['40','41','42','43','44','45'], colors: ['Black'],
    description: 'Heavy lace-up combat boots. WE THE WAVE.', tags: ['accessories','shoes','boots','new','drop'],
  },
  {
    id: 77, name: 'Slides — Recovery Grey',
    category: ['accessories'], price: 59.99,
    image: SLIDES_flat, images: [SLIDES_flat, SLIDES_side, SLIDES_model],
    isNew: true, isSale: false, inStock: true, rating: 5, reviews: 0,
    sizes: ['40','41','42','43','44','45'], colors: ['Grey'],
    description: 'Recovery slides. Streetwear essential.', tags: ['accessories','shoes','slides','new','drop'],
  },

  // ══════════════════════════════════════════════════════════
  //  FULL FITS
  // ══════════════════════════════════════════════════════════
  {
    id: 80, name: 'Full Fit — Denim Set',
    category: ['fullfit'], price: 229.99,
    image: DENIM_SET_models[0], images: DENIM_SET_models,
    isNew: true, isSale: false, inStock: true, rating: 5, reviews: 0,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['Blue'],
    description: 'Complete denim set — jacket + matching jeans. WE THE WAVE.',
    tags: ['fullfit','denim','new','drop'],
  },
  {
    id: 81, name: 'Full Fit — Olive Shirt Look',
    category: ['fullfit'], price: 0,
    image: OLIVE_SHIRT_models[0], images: OLIVE_SHIRT_models,
    isNew: true, isSale: false, inStock: true, rating: 5, reviews: 0,
    sizes: ['XS','S','M','L','XL','XXL'], colors: ['Olive'],
    description: 'Style inspo — olive shirt styled up. WE THE WAVE.',
    tags: ['fullfit','new','drop'],
  },
];

// ─── HERO SLIDES — using hero1/2/3.jpg ───────────────────────────────────────
export const heroSlides = [
  { id: 1, image: '/images/hero1.jpg' },
  { id: 2, image: '/images/hero2.jpg' },
  { id: 3, image: '/images/hero3.jpg' },
];

// ─── IG SLIDER ────────────────────────────────────────────────────────────────
export const igSliderImages = [
  TEE_G1_flat,
  POLO_flat,
  DENIM_SET_jacket_flat,
  DENIM_SET_jeans_flat,
  OLIVE_SHIRT_flat,
  BUCKET_HAT_flat,
  WHITE_TEE_flat,
  WHITE_SHIRT_flat,
  BOOTS_flat,
  ARMY_CAP_flat,
  SLIDES_flat,
  TEE_G10_flat,
];

export const storeLocations = [
  {
    id: 1,
    name: 'VIBE WEAR — Lagos Store',
    address: 'Lagos, Nigeria',
    hours: 'Mon–Sat: 10am–8pm',
    phone: '+234 000 000 0000',
  },
];