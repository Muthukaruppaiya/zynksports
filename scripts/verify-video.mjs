import { chromium } from 'playwright'

const base = process.argv[2] || 'http://localhost:5173'
const browser = await chromium.launch({ channel: 'msedge', args: ['--autoplay-policy=no-user-gesture-required'] })
const page = await browser.newPage({ viewport: { width: 1366, height: 860 } })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))

async function playing(label) {
  const report = await page.evaluate(async () => {
    const vids = [...document.querySelectorAll('video')]
    const before = vids.map((v) => v.currentTime)
    await new Promise((r) => setTimeout(r, 1500))
    return vids.map((v, i) => ({
      src: v.currentSrc.split('/').pop(),
      advanced: +(v.currentTime - before[i]).toFixed(2),
      paused: v.paused,
      muted: v.muted,
    }))
  })
  const live = report.filter((r) => r.advanced > 0.3)
  console.log(`${label}: ${live.length}/${report.length} videos playing`, JSON.stringify(live.map((r) => r.src)))
  return report
}

await page.goto(base, { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
await playing('Home (top)')
await page.screenshot({ path: 'scripts/shot-home.png' })

await page.locator('.float-video').click({ position: { x: 40, y: 120 } })
await page.waitForTimeout(1500)
const modal = await page.evaluate(() => {
  const v = document.querySelector('.vp-modal video, [class*="vp"] video')
  return v ? { src: v.currentSrc.split('/').pop(), t: v.currentTime, muted: v.muted, paused: v.paused } : null
})
console.log('Floater tap -> player:', JSON.stringify(modal))
await page.screenshot({ path: 'scripts/shot-player.png' })
await page.keyboard.press('Escape')

await page.evaluate(() => document.querySelector('.reel-strip')?.scrollIntoView({ block: 'center' }))
await page.waitForTimeout(1200)
await playing('Home (reel strip)')
await page.screenshot({ path: 'scripts/shot-strip.png' })

await page.goto(base + '/catalogue', { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
await playing('Catalogue')
await page.screenshot({ path: 'scripts/shot-catalogue.png' })

await page.goto(base + '/product/p2', { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
await playing('Product')
await page.screenshot({ path: 'scripts/shot-product.png' })

console.log('Page errors:', errors.length ? errors : 'none')
await browser.close()
