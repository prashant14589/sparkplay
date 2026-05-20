const { chromium } = require('playwright')
const path = require('path')
const fs = require('fs')

const OUT = path.join(__dirname, '../screenshots')
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true })

async function shot(page, name) {
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: false })
  console.log(`✓ ${name}.png`)
}
async function shotFull(page, name) {
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true })
  console.log(`✓ ${name}.png (full)`)
}

;(async () => {
  const browser = await chromium.launch()

  // ── MOBILE 375px ──────────────────────────────────────────────────────────
  {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } })
    const page = await ctx.newPage()

    // Home — above fold
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)
    await shot(page, 'm-01-home-top')

    // Home — scroll to game area (MemoryMatch is below the theme strip)
    await page.evaluate(() => window.scrollTo(0, 500))
    await page.waitForTimeout(600)
    await shot(page, 'm-02-home-game')

    // Home full page
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(400)
    await shotFull(page, 'm-03-home-full')

    // Switch to Space theme
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)
    // Click age 6-8
    const age68 = page.locator('button', { hasText: '6–8 yrs' })
    if (await age68.count()) { await age68.click(); await page.waitForTimeout(500) }
    // Click Space theme
    const spaceBtn = page.locator('text=Space').first()
    if (await spaceBtn.count()) { await spaceBtn.click(); await page.waitForTimeout(600) }
    await page.evaluate(() => window.scrollTo(0, 400))
    await page.waitForTimeout(500)
    await shot(page, 'm-04-space-theme-game')

    // Dashboard
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)
    await shot(page, 'm-05-dashboard')
    await shotFull(page, 'm-05-dashboard-full')

    // Builder page
    await page.goto('http://localhost:3000/builder', { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)
    await shot(page, 'm-06-builder')

    await ctx.close()
  }

  // ── DESKTOP 1280px ────────────────────────────────────────────────────────
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
    const page = await ctx.newPage()

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)
    await shot(page, 'd-01-home')
    await shotFull(page, 'd-01-home-full')

    // Space theme
    const age68 = page.locator('button', { hasText: '6–8 yrs' })
    if (await age68.count()) { await age68.click(); await page.waitForTimeout(400) }
    const spaceBtn = page.locator('text=Space').first()
    if (await spaceBtn.count()) { await spaceBtn.click(); await page.waitForTimeout(600) }
    await shot(page, 'd-02-space-game')

    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)
    await shot(page, 'd-03-dashboard')

    await ctx.close()
  }

  await browser.close()
  console.log('\nAll screenshots saved to /screenshots')
})()
