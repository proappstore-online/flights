import { test, expect } from '@playwright/test'

// Anonymous surface: everything here is reachable without a session.

test('signed-out visitor sees the landing page and a sign-in button', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Flights & Hotels' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Sign in to get started' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'ProAppStore' })).toHaveAttribute('href', 'https://proappstore.online')
})

test('share-card meta tags point at a served 1200x630 og-image', async ({ page, request }) => {
  await page.goto('/')
  const og = await page.locator('meta[property="og:image"]').getAttribute('content')
  const tw = await page.locator('meta[name="twitter:image"]').getAttribute('content')
  expect(og).toMatch(/\/og-image\.png$/)
  expect(tw).toBe(og)
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200')
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '630')

  const res = await request.get('/og-image.png')
  expect(res.status()).toBe(200)
  expect(res.headers()['content-type']).toContain('image/png')
})

test('web app manifest is served with install metadata', async ({ request }) => {
  const res = await request.get('/manifest.webmanifest')
  expect(res.status()).toBe(200)
  const manifest = await res.json()
  expect(manifest.display).toBe('standalone')
  expect(manifest.start_url).toBe('/')
  expect(manifest.icons.some((i: { purpose?: string }) => i.purpose === 'maskable')).toBe(true)
})

test('service worker navigation fallback excludes PAS reserved /.pas/ routes', async ({ request }) => {
  const res = await request.get('/sw.js')
  expect(res.status()).toBe(200)
  const sw = await res.text()
  expect(sw).toContain('createHandlerBoundToURL("index.html")')
  expect(sw).toContain('denylist:[/^\\/\\.pas\\//]')
})
