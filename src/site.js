export const pages = {
  '/': { title: 'BookMySKU — Every SKU. One workspace.', description: 'Bring clients, suppliers, products, and pricing together in the connected workspace for custom merchandise businesses.' },
  '/platform': { title: 'The platform | BookMySKU', description: 'Explore a connected workspace for client relationships, supplier directories, product variants, catalog images, and pricing.' },
  '/solutions': { title: 'Built for your business | BookMySKU', description: 'See how BookMySKU helps merchandise distributors, custom product businesses, and growing teams organize their work.' },
  '/pricing': { title: 'Pricing enquiries | BookMySKU', description: 'Tell us about your team and find the right BookMySKU setup for your custom merchandise business.' },
  '/about': { title: 'Our story | BookMySKU', description: 'We believe the details behind every product deserve a better home. Get to know the idea behind BookMySKU.' },
  '/contact': { title: 'Let’s talk | BookMySKU', description: 'Ask about BookMySKU, request a product walkthrough, or discuss your business requirements with our team.' },
}

function publicUrl(value) {
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || (url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname)) ? url.href.replace(/\/$/, '') : null
  } catch { return null }
}

export const appUrl = publicUrl(import.meta.env.VITE_APP_URL)
export const siteUrl = publicUrl(import.meta.env.VITE_SITE_URL)
const configuredEndpoint = import.meta.env.VITE_CONTACT_API_URL?.trim()
export const contactEndpoint = configuredEndpoint?.startsWith('/') && !configuredEndpoint.startsWith('//')
  ? configuredEndpoint
  : publicUrl(configuredEndpoint)

export const faqs = [
  { question: 'What is BookMySKU?', answer: 'BookMySKU is a business workspace for custom merchandise. It brings client and supplier records, configurable products, catalog images, pricing schedules, and team access into one place.' },
  { question: 'Can I manage different product colors and sizes?', answer: 'Yes. Configure colors and sizes, choose the combinations you offer, and keep variant details, supplier item codes, and packaging information with the product.' },
  { question: 'Can different people have different access?', answer: 'Yes. Workspace owners can manage their team and assign roles and permissions. Access to sensitive pricing information, including costs, is controlled separately.' },
  { question: 'Does BookMySKU include orders and inventory?', answer: 'The current platform focuses on clients, suppliers, product configuration, catalog images, and manual pricing. Order management, stock tracking, and invoice creation are outside the current scope.' },
  { question: 'How can I explore the platform?', answer: 'Use the contact page to tell us about your business and request a walkthrough. You can also explore the illustrative product preview on this website.' },
]
