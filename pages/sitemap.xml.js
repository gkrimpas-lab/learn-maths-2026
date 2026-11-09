import { SITEMAP_ROUTES } from '../shared/sitemap-routes';

const SITE_URL = 'https://learnmaths.gr';

function generateSiteMap(routes) {
  const today = new Date().toISOString().split('T')[0];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${routes
  .flatMap(({ path, changefreq = 'weekly', priority = '0.7', lastmod }) => {
    const cleanPath = path === '/' ? '' : path;
    const elUrl = `${SITE_URL}${cleanPath}`;
    const enUrl = `${SITE_URL}/en${cleanPath}`;
    const pageLastMod = lastmod || today;

    return [
      `  <url>
    <loc>${elUrl}</loc>
    <xhtml:link rel="alternate" hreflang="el" href="${elUrl}" />
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${elUrl}" />
    <lastmod>${pageLastMod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
      `  <url>
    <loc>${enUrl}</loc>
    <xhtml:link rel="alternate" hreflang="el" href="${elUrl}" />
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${elUrl}" />
    <lastmod>${pageLastMod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    ];
  })
  .join('\n')}
</urlset>`.trim();
}

export async function getServerSideProps({ res }) {
  const sitemap = generateSiteMap(SITEMAP_ROUTES);

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default function SiteMap() {
  return null;
}