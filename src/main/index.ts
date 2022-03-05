import os from 'os'
import { join } from 'path'
import { app, BrowserWindow, ipcMain } from 'electron'
import './store/index'


const isWin7 = os.release().startsWith('6.1')
if (isWin7) app.disableHardwareAcceleration()

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null

async function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 625,
    frame: false,
    transparent: true,
    minWidth: 600,
    minHeight: 500,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
  })
  ipcMain.on('open-devtools', (event, arg) => {
    win?.webContents.openDevTools()
  })
  // 1. 窗口 最小化
  ipcMain.on('window-min', function () { // 收到渲染进程的窗口最小化操作的通知，并调用窗口最小化函数，执行该操作
    win && win.minimize();
  })
  var isFullScreen = false
  // 2. 窗口 最大化、恢复
  ipcMain.on('window-max', function () {
    // console.log(isFullScreen)
    isFullScreen = !isFullScreen
    if (!isFullScreen) { // 为true表示窗口已最大化
      win && win.unmaximize();// 将窗口恢复为之前的状态.
    } else {
      win && win.maximize();
    }
  })

  // 3. 关闭窗口
  ipcMain.on('window-close', function () {
    win && win.close();
  })
  if (app.isPackaged) {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  } else {
    const pkg = await import('../../package.json')
    const url = `http://${pkg.env.HOST || '127.0.0.1'}:${pkg.env.PORT}`
    win.loadURL(url)
    win.webContents.openDevTools()
  }

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('second-instance', () => {
  if (win) {
    // Someone tried to run a second instance, we should focus our window.
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})
