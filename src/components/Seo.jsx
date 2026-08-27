import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Vibewear';
const SITE_URL = 'https://vibewear.online';
const DEFAULT_IMAGE = `${SITE_URL}/images/hero1.jpg`;

/**
 * Drop this into any page to override the site-wide default meta tags
 * from index.html. Only `title` is required — everything else falls
 * back to sensible defaults.
 *
 * <Seo
 *   title="Graphic Tee — WE THE WAVE I"
 *   description="Heavy 240gsm cotton graphic tee."
 *   path="/products/1"
 *   image="https://vibewear.online/images/products/img_2.jpg"
 * />
 */
export default function Seo({
  title,
  description = 'Shop Vibewear for tees, hoodies, shirts, bottoms, and accessories. New drops weekly.',
  path = '/',
  image = DEFAULT_IMAGE,
  noindex = false,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Streetwear & Fits Online`;
  const url = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
