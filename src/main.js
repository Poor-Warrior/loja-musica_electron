const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    })

    win.loadFile(path.resolve('src/view/index.html'))
    win.maximize()
    win.show()
}

const createIpcMain = () => {}

app.whenReady().then(() => {
    createIpcMain()
    createWindow()
})