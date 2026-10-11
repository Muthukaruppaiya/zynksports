import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'

const outDir = path.resolve('public/media')
const brandDir = path.resolve('public/brand')
fs.mkdirSync(outDir, { recursive: true })

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http
    const req = mod.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          Referer: 'https://www.instagram.com/',
        },
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return download(res.headers.location, dest).then(resolve).catch(reject)
        }
        const file = fs.createWriteStream(dest)
        res.pipe(file)
        file.on('finish', () => file.close(() => resolve(dest)))
      },
    )
    req.on('error', reject)
  })
}

function hd(url) {
  if (!url) return url
  return url
    .replace(/stp=[^&]+&?/g, '')
    .replace(/s150x150/g, 's1080x1080')
    .replace(/p150x150/g, 's1080x1080')
    .replace(/s640x640/g, 's1080x1080')
}

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  viewport: { width: 1400, height: 1000 },
})
const page = await context.newPage()

const collected = { posts: [], reels: [], logo: null, colors: ['#FFE600', '#000000', '#E10600', '#FFFFFF'] }

async function dismiss(page) {
  for (const sel of [
    'button:has-text("Decline optional cookies")',
    'button:has-text("Allow all cookies")',
    'button:has-text("Not Now")',
    'button:has-text("Not now")',
    'div[role="dialog"] svg[aria-label="Close"]',
  ]) {
    try {
      const el = page.locator(sel).first()
      if (await el.isVisible({ timeout: 700 })) await el.click({ timeout: 1000 })
    } catch {}
  }
}

// Profile for logo + post grid
await page.goto('https://www.instagram.com/zynkcricketstore/', {
  waitUntil: 'domcontentloaded',
  timeout: 60000,
})
await page.waitForTimeout(3500)
await dismiss(page)
await page.waitForTimeout(2000)

const profile = await page.evaluate(() => {
  const abs = (u) => {
    try {
      return new URL(u, location.href).href
    } catch {
      return u
    }
  }
  const imgs = [...document.querySelectorAll('img')].map((img) => ({
    src: abs(img.currentSrc || img.src),
    alt: img.alt || '',
    w: img.naturalWidth || 0,
    h: img.naturalHeight || 0,
  }))
  const links = [...document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]')].map((a) =>
    abs(a.href).split('?')[0],
  )
  const logo = imgs.find((i) => /profile picture/i.test(i.alt))?.src || null
  return { imgs, links: [...new Set(links)], logo, text: document.body.innerText.slice(0, 3000) }
})

if (profile.logo) {
  const logoUrl = profile.logo.replace(/s150x150/g, 's320x320')
  await download(logoUrl, path.join(brandDir, 'logo.png'))
  collected.logo = '/brand/logo.png'
  console.log('HD logo saved')
}

// Save top grid images as products/hero
let i = 0
for (const img of profile.imgs) {
  if (i >= 10) break
  if (/profile picture|highlight story/i.test(img.alt) && img.w <= 150) continue
  if (img.w < 300) continue
  const dest = path.join(outDir, `ig-${i + 1}.jpg`)
  try {
    await download(hd(img.src), dest)
    if (fs.statSync(dest).size > 8000) {
      collected.posts.push({
        file: `/media/ig-${i + 1}.jpg`,
        alt: img.alt,
        permalink: profile.links[i] || null,
      })
      console.log('saved', dest, fs.statSync(dest).size)
      i++
    } else fs.unlinkSync(dest)
  } catch (e) {
    console.log('img fail', e.message)
  }
}

// Visit reels tab / individual reels for video sources
await page.goto('https://www.instagram.com/zynkcricketstore/reels/', {
  waitUntil: 'domcontentloaded',
  timeout: 60000,
})
await page.waitForTimeout(4000)
await dismiss(page)

const reelLinks = await page.evaluate(() => {
  const abs = (u) => {
    try {
      return new URL(u, location.href).href
    } catch {
      return u
    }
  }
  return [...new Set([...document.querySelectorAll('a[href*="/reel/"]')].map((a) => abs(a.href).split('?')[0]))].slice(
    0,
    6,
  )
})

console.log('reel links', reelLinks)

for (let r = 0; r < reelLinks.length && collected.reels.length < 4; r++) {
  const link = reelLinks[r]
  try {
    await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 45000 })
    await page.waitForTimeout(3500)
    await dismiss(page)
    // try play to force media load
    try {
      await page.locator('video').first().click({ timeout: 1500 })
    } catch {}
    await page.waitForTimeout(2000)

    const media = await page.evaluate(() => {
      const abs = (u) => {
        try {
          return new URL(u, location.href).href
        } catch {
          return u
        }
      }
      const video = document.querySelector('video')
      const src = video ? abs(video.currentSrc || video.src) : ''
      const poster = video ? abs(video.poster || '') : ''
      const img =
        poster ||
        [...document.querySelectorAll('img')]
          .map((i) => abs(i.currentSrc || i.src))
          .find((s) => s.includes('cdninstagram') && !s.includes('s150x150')) ||
        ''
      return { src, poster: img, title: document.title }
    })

    const reel = {
      id: `reel-${collected.reels.length + 1}`,
      title: `Zynk Reel ${collected.reels.length + 1}`,
      permalink: link,
      poster: null,
      src: null,
    }

    if (media.poster) {
      const posterPath = path.join(outDir, `${reel.id}-poster.jpg`)
      await download(hd(media.poster), posterPath)
      reel.poster = `/media/${reel.id}-poster.jpg`
    }

    if (media.src && media.src.includes('cdninstagram')) {
      const videoPath = path.join(outDir, `${reel.id}.mp4`)
      await download(media.src, videoPath)
      if (fs.statSync(videoPath).size > 30000) {
        reel.src = `/media/${reel.id}.mp4`
        console.log('saved video', videoPath, fs.statSync(videoPath).size)
      } else {
        fs.unlinkSync(videoPath)
      }
    }

    // Always keep reel even if only poster+embed permalink (for iframe fallback)
    collected.reels.push(reel)
    console.log('reel meta', reel)
  } catch (e) {
    console.log('reel fail', link, e.message)
  }
}

fs.writeFileSync(path.join(brandDir, 'assets.json'), JSON.stringify(collected, null, 2))
console.log('DONE', JSON.stringify(collected, null, 2))
await browser.close()
