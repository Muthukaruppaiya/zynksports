import { chromium } from 'playwright'

const base = process.argv[2] || 'http://localhost:5173'
const browser = await chromium.launch({ channel: 'msedge' })
const page = await browser.newPage({ viewport: { width: 1366, height: 860 } })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))

await page.goto(base, { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
await page.mouse.move(980, 300)
await page.waitForTimeout(600)
await page.screenshot({ path: 'scripts/s1-hero.png' })

for (const [name, y] of [['s2-scroll', 700], ['s3-cats', 1500], ['s4-store', 3300]]) {
  await page.evaluate((top) => window.scrollTo(0, top), y)
  await page.waitForTimeout(1200)
  await page.screenshot({ path: `scripts/${name}.png` })
}

await page.evaluate(() => document.querySelector('.grid-products')?.scrollIntoView({ block: 'center' }))
await page.waitForTimeout(1000)
const card = await page.locator('.product-card').first().boundingBox()
await page.mouse.move(card.x + card.width * 0.85, card.y + card.height * 0.2)
await page.waitForTimeout(700)
await page.screenshot({ path: 'scripts/s5-tilt.png' })

console.log('Page errors:', errors.length ? errors : 'none')
await browser.close()
