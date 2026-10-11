import { chromium } from 'playwright'

const base = process.argv[2] || 'http://localhost:5173'
const routes = ['/', '/shop', '/catalogue', '/product/p2', '/cart', '/account', '/orders', '/reviews', '/admin', '/admin/billing']
const widths = process.argv[3] ? process.argv[3].split(',').map(Number) : [1366, 1024, 768, 390]

const browser = await chromium.launch({ channel: 'msedge' })
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 860 } })
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)
    for (const y of [0, 900, 1800, 3000, 99999]) {
      await page.evaluate((top) => window.scrollTo(0, top), y)
      await page.waitForTimeout(350)
    }
    const r = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth
      const sw = document.documentElement.scrollWidth
      const offenders = []
      for (const el of document.querySelectorAll('body *')) {
        const b = el.getBoundingClientRect()
        if (b.width === 0 || b.right <= vw + 1) continue
        if (el.closest('.float-wa, .float-video, .sbg')) continue
        let p = el.parentElement
        let clipped = false
        while (p && p !== document.body) {
          const s = getComputedStyle(p)
          if (['hidden', 'clip', 'auto', 'scroll'].includes(s.overflowX)) {
            const pb = p.getBoundingClientRect()
            if (pb.right <= vw + 1) {
              clipped = true
              break
            }
          }
          if (s.position === 'fixed') break
          p = p.parentElement
        }
        if (!clipped) offenders.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} right=${Math.round(b.right)}`)
      }
      return { vw, sw, offenders: offenders.slice(0, 6) }
    })
    if (r.sw > r.vw || r.offenders.length) {
      console.log(`${width}px ${route}: scrollWidth ${r.sw} > ${r.vw}`, r.offenders)
    }
  }
  await page.close()
}
console.log('done')
await browser.close()
