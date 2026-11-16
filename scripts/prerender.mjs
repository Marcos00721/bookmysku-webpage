import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { createServer } from 'vite'

// Render public routes at build time so static hosts and crawlers see page content.
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
const escape = value => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
try {
  const [{ default: App }, { pages, siteUrl }] = await Promise.all([
    vite.ssrLoadModule('/src/App.jsx'),
    vite.ssrLoadModule('/src/site.js'),
  ])
  const template = await readFile(resolve('dist/index.html'), 'utf8')
  for (const [route, meta] of Object.entries(pages)) {
    const content = renderToString(createElement(StaticRouter, { location: route }, createElement(App)))
    let html = template
      .replace('<div id="root"></div>', () => `<div id="root">${content}</div>`)
      .replace(/<title>.*?<\/title>/, () => `<title>${escape(meta.title)}</title>`)
      .replace(/(<meta name="description" content=")[^"]*/, () => `<meta name="description" content="${escape(meta.description)}`)
      .replace(/(<meta property="og:title" content=")[^"]*/, () => `<meta property="og:title" content="${escape(meta.title)}`)
      .replace(/(<meta property="og:description" content=")[^"]*/, () => `<meta property="og:description" content="${escape(meta.description)}`)
    if (siteUrl) html = html.replace('</head>', `<link rel="canonical" href="${escape(siteUrl + route)}" /><meta property="og:url" content="${escape(siteUrl + route)}" /></head>`)
    const directory = resolve('dist', route.slice(1))
    await mkdir(directory, { recursive: true })
    await writeFile(resolve(directory, 'index.html'), html)
  }
  const notFound = renderToString(createElement(StaticRouter, { location: '/404' }, createElement(App)))
  await writeFile(resolve('dist/404.html'), template
    .replace('<div id="root"></div>', () => `<div id="root">${notFound}</div>`)
    .replace(/<title>.*?<\/title>/, '<title>Page not found | BookMySKU</title>')
    .replace('</head>', '<meta name="robots" content="noindex" /></head>'))
  if (siteUrl) {
    const entries = Object.keys(pages).map(route => `<url><loc>${escape(siteUrl + route)}</loc></url>`).join('')
    await writeFile(resolve('dist/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`)
  }
  await writeFile(resolve('dist/robots.txt'), `User-agent: *\nAllow: /\n${siteUrl ? `Sitemap: ${siteUrl}/sitemap.xml\n` : ''}`)
  console.log(`Prerendered ${Object.keys(pages).length} pages and the 404 page.`)
} finally {
  await vite.close()
}
