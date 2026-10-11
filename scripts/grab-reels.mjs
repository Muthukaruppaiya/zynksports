import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'

const outDir = path.resolve('public/media/reels')
fs.mkdirSync(outDir, { recursive: true })

const reels = [
  'https://www.instagram.com/zynkcricketstore/reel/DeUNhhmTakC/',
  'https://www.instagram.com/zynkcricketstore/reel/DeRFZJOB8D0/',
  'https://www.instagram.com/zynkcricketstore/reel/DeMyv4UBBa6/',
  'https://www.instagram.com/zynkcricketstore/reel/DeHjINfTb63/',
  'https://www.instagram.com/zynkcricketstore/reel/DeDnbLKT3Wf/',
  'https://www.instagram.com/zynkcricketstore/reel/Dd_aQ3OzW69/',
  'https://www.instagram.com/zynkcricketstore/reel/Dd1d1xcTXTD/',
]

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  viewport: { width: 1280, height: 900 },
})

const results = []

for (const [idx, url] of reels.entries()) {
  const page = await context.newPage()
  const videoUrls = new Set()
  page.on('response', (res) => {
    const u = res.url()
    if (/\.mp4/.test(u) && /(cdninstagram|fbcdn)/.test(u)) videoUrls.add(u)
  })
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(6000)
    try {
      await page.locator('video').first().click({ timeout: 2000 })
    } catch {}
    await page.waitForTimeout(4000)

    const html = await page.content()
    const fromHtml = [...html.matchAll(/"video_url":"([^"]+)"/g)].map((m) =>
      m[1].replace(/\\u0026/g, '&').replace(/\\\//g, '/'),
    )
    const fromVersions = [...html.matchAll(/"url":"(https:[^"]+\.mp4[^"]*)"/g)].map((m) =>
      m[1].replace(/\\u0026/g, '&').replace(/\\\//g, '/'),
    )

    const candidates = [...fromHtml, ...fromVersions]
    for (const u of videoUrls) {
      const clean = u.replace(/&?bytestart=\d+/g, '').replace(/&?byteend=\d+/g, '')
      candidates.push(clean)
    }

    let saved = null
    for (const c of candidates) {
      try {
        const res = await context.request.get(c, {
          headers: { Referer: 'https://www.instagram.com/' },
          timeout: 60000,
        })
        if (!res.ok()) continue
        const buf = await res.body()
        if (buf.length < 150000) continue
        const dest = path.join(outDir, `reel-${idx + 1}.mp4`)
        fs.writeFileSync(dest, buf)
        saved = dest
        console.log('saved', dest, buf.length)
        break
      } catch (e) {
        console.log('dl fail', e.message)
      }
    }
    results.push({ url, saved, candidates: candidates.length, network: videoUrls.size })
    if (!saved) console.log('no video for', url, 'candidates', candidates.length, 'net', videoUrls.size)
  } catch (e) {
    console.log('fail', url, e.message)
  }
  await page.close()
}

fs.writeFileSync(path.join(outDir, 'results.json'), JSON.stringify(results, null, 2))
await browser.close()
