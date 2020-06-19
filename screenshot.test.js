const fs = require('fs')
const puppeteer = require('puppeteer')
const {toMatchImageSnapshot} = require('jest-image-snapshot')

expect.extend({toMatchImageSnapshot})

describe('color palette', () => {
  it('ips display', async () => {
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()
    await page.goto(`data:text/html;base64,${fs.readFileSync('page.html').toString('base64')}`)
    await page.waitFor(500)
    const screenshot = await page.screenshot()
    await browser.close()
    expect(screenshot).toMatchImageSnapshot({
      failureThreshold: 0,
      failureThresholdType: 'pixel',
      customDiffConfig: {
        threshold: 0.001,
      },
    })
  }, 30e3)
})
