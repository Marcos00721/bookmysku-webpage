import { test, expect } from '@playwright/test'

const routes = ['/', '/platform', '/solutions', '/pricing', '/about', '/contact']

for (const width of [320, 390, 768, 1440]) {
  test(`all pages render without overflow or browser errors at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
    for (const route of routes) {
      await page.goto(route)
      await expect(page.locator('main h1')).toBeVisible()
      await expect(page).toHaveTitle(/BookMySKU/)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
      expect(overflow, `${route} overflows at ${width}px`).toBe(false)
      expect(await page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true)
    }
    expect(errors).toEqual([])
  })
}

test('product demo supports search, modal keyboard controls, tabs, and empty results', async ({ page }) => {
  await page.goto('/')
  const workspace = page.locator('.product-showcase .workspace-preview')
  const search = workspace.getByRole('textbox', { name: 'Search preview products' })
  await search.fill('bottle')
  await expect(workspace.getByRole('button', { name: /^View / })).toHaveCount(1)
  await workspace.getByRole('button', { name: 'View The everyday bottle' }).click()
  const dialog = page.getByRole('dialog', { name: 'The everyday bottle' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText('3 colors · 600 ml · Stainless steel')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(workspace.getByRole('button', { name: 'View The everyday bottle' })).toBeFocused()
  await search.fill('no-such-product')
  await expect(workspace.getByText('No products match', { exact: false })).toBeVisible()
  await workspace.getByRole('button', { name: 'Clients', exact: true }).click()
  await expect(workspace.getByText('Northstar Studio')).toBeVisible()
  await workspace.getByRole('button', { name: 'Pricing', exact: true }).click()
  await expect(workspace.getByText('$12.50')).toBeVisible()
  await workspace.getByRole('button', { name: 'Products', exact: true }).click()
  await expect(search).toHaveValue('')
  await expect(workspace.getByRole('button', { name: /^View / })).toHaveCount(3)
})

test('mobile navigation opens, closes with Escape, and follows links', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const toggle = page.getByRole('button', { name: 'Open navigation' })
  await toggle.click()
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(toggle).toBeFocused()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await toggle.click()
  await page.getByRole('navigation').getByRole('link', { name: 'Pricing', exact: true }).click()
  await expect(page).toHaveURL(/\/pricing$/)
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(page.locator('main h1')).toContainText('Start with your business.')
})

test('feature links land on the correct platform section', async ({ page }) => {
  await page.goto('/')
  await page.locator('.feature-products').getByRole('link').click()
  await expect(page).toHaveURL(/\/platform#products$/)
  await expect(page.locator('#products h2')).toBeInViewport()
})

test('FAQ disclosures and enquiry privacy dialog work with keyboard', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/contact?interest=pricing')
  await expect(page.locator('select[name="interest"]')).toHaveValue('pricing')
  await page.getByRole('button', { name: 'How we use your details' }).click()
  await expect(page.locator('#enquiry-privacy')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.locator('#enquiry-privacy')).not.toBeVisible()
  await expect(page.getByRole('button', { name: 'How we use your details' })).toBeFocused()
  await page.locator('summary').filter({ hasText: 'What is BookMySKU?' }).click()
  await expect(page.locator('details[open]')).toContainText('business workspace for custom merchandise')
  expect(errors).toEqual([])
})

test('unconfigured enquiries show an honest error and retain entered details', async ({ page }) => {
  await page.goto('/contact?interest=walkthrough')
  await expect(page.locator('select[name="interest"]')).toHaveValue('walkthrough')
  await expect(page.getByRole('status')).toContainText('Online enquiries are not open yet')
  await page.locator('input[name="name"]').fill('Alex Morgan')
  await page.locator('input[name="email"]').fill('alex@example.com')
  await page.locator('input[name="company"]').fill('Sample Studio')
  await page.locator('textarea[name="message"]').fill('We would like a product walkthrough for our team.')
  await page.locator('input[name="consent"]').check()
  await page.getByRole('button', { name: 'Let’s start a conversation' }).click()
  await expect(page.getByRole('alert')).toContainText('Your details have not been sent')
  await expect(page.locator('input[name="name"]')).toHaveValue('Alex Morgan')
  await expect(page.locator('.form-success')).toHaveCount(0)
})

test('production HTML includes route content before JavaScript and a 404 page', async ({ request, page }) => {
  for (const route of routes) {
    const response = await request.get(route)
    expect(response.ok()).toBe(true)
    const html = await response.text()
    expect(html).toContain('<h1>')
    if (route !== '/') expect(html).not.toContain('<title>BookMySKU — Every SKU. One workspace.</title>')
  }
  await page.goto('/missing-page')
  await expect(page.locator('main h1')).toContainText('back on track.')
  await page.getByRole('link', { name: 'Back to BookMySKU' }).click()
  await expect(page).toHaveURL('/')
})

test('capture desktop and mobile homepage previews', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')
  await page.screenshot({ path: testInfo.outputPath('homepage-desktop.png'), fullPage: true })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.screenshot({ path: testInfo.outputPath('homepage-mobile.png'), fullPage: true })
})
