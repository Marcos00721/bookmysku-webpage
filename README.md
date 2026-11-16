# BookMySKU website

A responsive React marketing website with six pages, an interactive sample workspace, and an enquiry form. The production build includes rendered HTML for each page.

## Run locally

Requires Node.js 22.12+ or 24+.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5180. The sample workspace supports product search, product details, client records, and pricing tabs. All displayed workspace records are illustrative.

## Production build

```sh
npm run build
npm run preview
```

Preview at http://127.0.0.1:4180. Deploy the `dist` directory to a static host. Configure the host to serve `/platform/index.html`, `/solutions/index.html`, `/pricing/index.html`, `/about/index.html`, and `/contact/index.html` for their matching clean URLs. Serve `dist/404.html` with HTTP 404 for unknown paths. Keep real page files ahead of any SPA fallback so a direct page visit receives matching rendered HTML.

## Configuration

Copy `.env.example` to `.env` and set the values you have. Rebuild after changing them. Vite exposes these values to visitors; never put secrets in them.

| Variable | Purpose |
| --- | --- |
| `VITE_APP_URL` | Public application origin. Enables the navigation's login link. |
| `VITE_SITE_URL` | Public website origin. Generates per-page canonical URLs and `sitemap.xml`. |
| `VITE_CONTACT_API_URL` | HTTPS enquiry endpoint or a same-origin path such as `/api/enquiries`. |

The enquiry endpoint is an external integration; this static project does not include a mail service or backend. Until an endpoint is configured, the form clearly explains that enquiries cannot be sent and preserves entered details if a visitor tries submitting.

The form sends a JSON POST with `name`, `email`, `company`, `teamSize`, `interest`, `message`, `consent`, `source`, `submittedAt`, and `requestId`. It sends `Idempotency-Key: <requestId>` and omits credentials. The endpoint should validate and rate-limit requests, deduplicate by request ID, and return a successful HTTP status only after accepting the enquiry. Cross-origin endpoints must allow the website origin, the POST method, and the `Content-Type` and `Idempotency-Key` headers. The form handles failed requests, HTTP 429, and a 15-second timeout without displaying false success.

## Browser checks

```sh
npm run build
npm run test:e2e
```

The tests cover all six pages at 320, 390, 768, and 1440 pixels, browser errors, image loading, product interactions, keyboard navigation, section links, FAQs, enquiry validation, and production HTML. Desktop and mobile homepage screenshots are saved under `test-results`.

Playwright uses an installed Chrome on Windows when available. On other machines, install Playwright Chromium once with `npx playwright install chromium`.
