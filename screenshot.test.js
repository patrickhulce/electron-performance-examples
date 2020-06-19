const fs = require('fs')
const path = require('path')
const os = require('os')
const puppeteer = require('puppeteer')
const spawn = require('child_process').spawn
const {toMatchImageSnapshot, configureToMatchImageSnapshot} = require('jest-image-snapshot')

expect.extend({
  toMatchImageSnapshot: configureToMatchImageSnapshot({
    failureThreshold: 0,
    failureThresholdType: 'pixel',
    customDiffConfig: {
      threshold: 0.001,
    },
  }),
})

const HSL_PAGE = fs.readFileSync('page-hsl.html').toString('base64')
const RGB_PAGE = fs.readFileSync('page-rgb.html').toString('base64')

const ELECTRON_BIN = os.platform() === 'win32' ? 'electron.cmd' : 'electron'
const ELECTRON_BIN_PATH = path.join(__dirname, 'node_modules/.bin', ELECTRON_BIN)

describe('color palette', () => {
  async function takeElectronScreenshot(electron, pageHtml) {
    let stderr = ''
    electron.stderr.on('data', (data) => (stderr += data.toString()))
    while (!stderr.includes('DevTools listening on')) await new Promise((r) => setTimeout(r, 50))
    const browserWSEndpointMatch = stderr.match(/ws:.*?browser\/\S+/)
    const browser = await puppeteer.connect({browserWSEndpoint: browserWSEndpointMatch[0]})
    const targets = await browser.targets()
    const pageTarget = targets.find((target) => target.type() === 'page')
    const page = await pageTarget.page()
    await page.goto(`data:text/html;base64,${pageHtml}`)
    await page.waitFor(500)
    const screenshot = await page.screenshot()
    await browser.close()
    electron.kill()
    expect(screenshot).toMatchImageSnapshot()
  }

  it('hsl', async () => {
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()
    await page.goto(`data:text/html;base64,${HSL_PAGE}`)
    await page.waitFor(500)
    const screenshot = await page.screenshot()
    await browser.close()
    expect(screenshot).toMatchImageSnapshot()
  }, 30e3)

  it('rgb', async () => {
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()
    await page.goto(`data:text/html;base64,${RGB_PAGE}`)
    await page.waitFor(500)
    const screenshot = await page.screenshot()
    await browser.close()
    expect(screenshot).toMatchImageSnapshot()
  }, 30e3)

  it('hsl electron', async () => {
    const electron = spawn(ELECTRON_BIN_PATH, ['.', '--remote-debugging-port=9222'])
    await takeElectronScreenshot(electron, HSL_PAGE)
  }, 30e3)

  it('rgb electron', async () => {
    const electron = spawn(ELECTRON_BIN_PATH, ['.', '--remote-debugging-port=9223'])
    await takeElectronScreenshot(electron, RGB_PAGE)
  }, 30e3)

  it('hsl electron srgb', async () => {
    const electron = spawn(ELECTRON_BIN_PATH, ['.', '--remote-debugging-port=9224'], {
      env: {...process.env, FORCE_COLORS: '1'},
    })
    await takeElectronScreenshot(electron, HSL_PAGE)
  }, 30e3)

  it('rgb electron srgb', async () => {
    const electron = spawn(ELECTRON_BIN_PATH, ['.', '--remote-debugging-port=9225'], {
      env: {...process.env, FORCE_COLORS: '1'},
    })
    await takeElectronScreenshot(electron, RGB_PAGE)
  }, 30e3)
})
