const {app, BrowserWindow} = require('electron');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });

  mainWindow.loadURL('https://notflix.clientsmile.se/');

  app.on('activate', function () {
    if (mainWindow === null) {
      createWindow()
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== darwin) {
    app.quit()
  }
})