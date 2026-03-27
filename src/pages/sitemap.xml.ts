import { getCollection } from 'astro:content';

const site = 'https://escalatunegocioconia.com';

const staticPages = [
  { url: '/',          priority: '1.0', changefreq: 'weekly'  },
  { url: '/servicios', priority: '0.9', changefreq: 'monthly' },
  { url: '/talento',   priority: '0.8', changefreq: 'monthly' },
  { url: '/blog',      priority: '0.8', changefreq: 'weekly'  },
  { url: '/catalogo-de-landings', priority: '0.75', changefreq: 'monthly' },
  { url: '/oferta/menu-digital', priority: '0.85', changefreq: 'monthly' },
  { url: '/oferta/hub-creadores', priority: '0.75', changefreq: 'monthly' },
];

export async function GET() {
  const posts    = await getCollection('blog', ({ data }) => !data.draft);
  const projects = await getCollection('projects');

  const blogPages = posts.map((post) => ({
    url:        `/blog/${post.slug}`,
    priority:   String(post.data.priority ?? 0.7),
    changefreq: 'monthly',
    lastmod:    post.data.pubDate.toISOString().split('T')[0],
  }));

  const categories = [...new Set(posts.map((p) => p.data.category))];
  const categoryPages = categories.map((cat) => ({
    url:        `/blog/categoria/${cat}`,
    priority:   '0.5',
    changefreq: 'weekly',
  }));

  const tags = [...new Set(posts.flatMap((p) => p.data.tags))];
  const tagPages = tags.map((tag) => ({
    url:        `/blog/etiqueta/${encodeURIComponent(tag)}`,
    priority:   '0.4',
    changefreq: 'weekly',
  }));

  const allPages = [...staticPages, ...blogPages, ...categoryPages, ...tagPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map((entry) => `  <url>
    <loc>${site}${entry.url}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>${'lastmod' in entry ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}