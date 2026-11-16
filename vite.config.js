import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const publicRoutes = new Set(['/platform', '/solutions', '/pricing', '/about', '/contact'])
const prerenderedPreview = {
  name: 'prerendered-preview',
  configurePreviewServer(server) {
    server.middlewares.use((request, response, next) => {
      const pathname = new URL(request.url, 'http://localhost').pathname.replace(/\/$/, '')
      if (publicRoutes.has(pathname)) request.url = `${pathname}/index.html`
      else if (pathname && !pathname.split('/').at(-1).includes('.')) {
        request.url = '/404.html'
        response.statusCode = 404
      }
      next()
    })
  },
}

export default defineConfig({
  plugins: [react(), prerenderedPreview],
  build: { sourcemap: false },
  server: { strictPort: true },
  preview: { strictPort: true },
})
