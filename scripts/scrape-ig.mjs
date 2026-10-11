import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'

const outDir = path.resolve('public/media')
const brandDir = path.resolve('public/brand')
fs.mkdirSync(outDir, { recursive: true })
fs.mkdirSync(brandDir, { recursive: true })

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http
    const file = fs.createWriteStream(dest)
    mod
      .get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close()
          fs.unlinkSync(dest)
          return download(res.headers.location, dest).then(resolve).catch(reject)
        }
        res.pipe(file)
        file.on('finish', () => file.close(() => resolve(dest)))
      })
      .on('error', reject)
  })
}

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  viewport: { width: 1280, height: 900 },
})
const page = await context.newPage()

const urlsTried = []
let data = null

for (const url of [
  'https://www.instagram.com/zynkcricketstore/',
  'https://www.instagram.com/zynkcricketstore/reels/',
  'https://imginn.com/zynkcricketstore/',
]) {
  urlsTried.push(url)
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(4000)

    // dismiss cookie / login popups if any
    for (const sel of [
      'button:has-text("Decline optional cookies")',
      'button:has-text("Allow all cookies")',
      'button:has-text("Not Now")',
      'button:has-text("Not now")',
      'svg[aria-label="Close"]',
    ]) {
      try {
        const el = page.locator(sel).first()
        if (await el.isVisible({ timeout: 800 })) await el.click({ timeout: 1000 })
      } catch {}
    }

    await page.waitForTimeout(2000)
    await page.screenshot({ path: path.join(brandDir, `shot-${urlsTried.length}.png`), fullPage: false })

    data = await page.evaluate(() => {
      const abs = (u) => {
        try {
          return new URL(u, location.href).href
        } catch {
          return u
        }
      }
      const imgs = [...document.querySelectorAll('img')]
        .map((img) => ({
          src: abs(img.currentSrc || img.src),
          alt: img.alt || '',
          w: img.naturalWidth || img.width || 0,
          h: img.naturalHeight || img.height || 0,
        }))
        .filter((i) => i.src && !i.src.includes('data:') && i.w >= 64)

      const videos = [...document.querySelectorAll('video')]
        .map((v) => ({
          src: abs(v.currentSrc || v.src),
          poster: abs(v.poster || ''),
        }))
        .filter((v) => v.src)

      const links = [...document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]')].map((a) =>
        abs(a.href),
      )

      const meta = {
        title: document.title,
        desc:
          document.querySelector('meta[property="og:description"]')?.content ||
          document.querySelector('meta[name="description"]')?.content ||
          '',
        ogImage: document.querySelector('meta[property="og:image"]')?.content || '',
        text: document.body?.innerText?.slice(0, 2500) || '',
      }

      return { imgs, videos, links: [...new Set(links)].slice(0, 40), meta, href: location.href }
    })

    fs.writeFileSync(
      path.join(brandDir, `extract-${urlsTried.length}.json`),
      JSON.stringify(data, null, 2),
    )

    if (data.imgs.length > 3 || data.videos.length || data.meta.ogImage) {
      console.log('Got media from', url, 'imgs', data.imgs.length, 'videos', data.videos.length)
      break
    }
  } catch (e) {
    console.log('Fail', url, e.message)
  }
}

if (!data) {
  console.log('No data')
  await browser.close()
  process.exit(1)
}

const logoCandidate =
  data.meta.ogImage ||
  data.imgs.find((i) => /profile|avatar|logo/i.test(i.alt) || (i.w === i.h && i.w >= 140))?.src ||
  data.imgs[0]?.src

const mediaList = []
if (logoCandidate) {
  try {
    const dest = path.join(brandDir, 'logo.jpg')
    await download(logoCandidate, dest)
    mediaList.push({ type: 'logo', file: '/brand/logo.jpg', src: logoCandidate })
    console.log('Logo saved')
  } catch (e) {
    console.log('Logo download failed', e.message)
  }
}

let count = 0
for (const img of data.imgs) {
  if (count >= 12) break
  if (logoCandidate && img.src === logoCandidate) continue
  if (img.w < 200 && img.h < 200) continue
  try {
    const dest = path.join(outDir, `post-${count + 1}.jpg`)
    await download(img.src, dest)
    if (fs.statSync(dest).size > 5000) {
      mediaList.push({ type: 'image', file: `/media/post-${count + 1}.jpg`, src: img.src, alt: img.alt })
      count++
      console.log('Saved', dest)
    } else {
      fs.unlinkSync(dest)
    }
  } catch (e) {
    console.log('img fail', e.message)
  }
}

let vcount = 0
for (const v of data.videos) {
  if (vcount >= 4) break
  try {
    const dest = path.join(outDir, `reel-${vcount + 1}.mp4`)
    await download(v.src, dest)
    if (fs.statSync(dest).size > 20000) {
      mediaList.push({
        type: 'video',
        file: `/media/reel-${vcount + 1}.mp4`,
        src: v.src,
        poster: v.poster,
      })
      vcount++
      console.log('Saved video', dest)
    } else fs.unlinkSync(dest)
  } catch (e) {
    console.log('video fail', e.message)
  }
}

fs.writeFileSync(path.join(brandDir, 'manifest.json'), JSON.stringify({ data, mediaList }, null, 2))
console.log('DONE media', mediaList.length)
await browser.close()
