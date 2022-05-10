// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nativeWindowOpen: true,
      contextIsolation: true,
      webviewTag: false,
    }
  })

  ipcMain.on('collect-heapsnapshot', async () => {
    process.takeHeapSnapshot(path.join(__dirname, "out.heapsnapshot"));
  })

  ipcMain.on('get-data', async () => {
    const { net } = require('electron')
    const request = net.request({
      method: 'GET',
      protocol: 'https:',
      hostname: 'github.com',
      port: 443
    })

    request.on('response', (response) => {
      
      console.log(`status: ${response.statusCode}`)
      
      // response.on('data', (data) => {
      //   console.log(data);
      // });

      mainWindow.webContents.send('call-response', response);
    })

    request.on('error', (error) => {
      mainWindow.webContents.send('call-response', error);
      
      console.log(error);
    });

    request.end()
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
