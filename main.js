const {app, BrowserWindow, ipcMain} = require('electron')
const minimist = require('minimist')
const {stall} = require('./utils')

const argv = minimist(process.argv.slice(2))

function createRenderer() {
  console.log('Options', argv)
  const window = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {nodeIntegration: true},
  })

  window.loadFile('index.html')
}

console.log('Loading...')
app.on('ready', () => {
  console.log('Loaded!')
  createRenderer()
})

ipcMain.on('command', (evt, payload) => {
  switch (payload.type) {
    case 'new-renderer':
      createRenderer()
      break
    case 'stall-main':
      stall(5000)
      break
  }
})
