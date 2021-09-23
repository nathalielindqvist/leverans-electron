const { app, BrowserWindow, Menu } = require('electron');

const fs = require('fs');

const js = fs.readFileSync('./test.js').toString();

const remoteMain = require('@electron/remote/main');
remoteMain.initialize();

const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nativeWindowOpen: true,
      nodeIntegration: true,
      contextIsolation: false,
      // preload: path.join(app.getAppPath(), 'preload.js')
    }
  });

  mainWindow.webContents.openDevTools();

  remoteMain.enable(mainWindow.webContents);

  mainWindow.loadURL('https://notflix.clientsmile.se/');

//  mainWindow.webContents.on('did-finish-load',() => {
//     mainWindow.webContents.executeJavaScript(js);
//    })
mainWindow.webContents.on('did-finish-load',() => {
    mainWindow.webContents.executeJavaScript(" let someVariable = document.querySelector('.list-item').textContent; console.log(someVariable)");
   })

  mainWindow.show();

  mainWindow.on('closed', function () {
    mainWindow = null
  })

}

function createMenu() {
  let template = require('./menu-choices/menu.json');
  let mac = require('./menu-choices/mac-specific.json');

  if (process.platform === 'darwin') {
    template.unshift(mac.appMenu);
    let editMenu = template.find(x => x.label === 'Edit');
    editMenu.submenu = [...editMenu.submenu, ...mac.speechChoices];
    let windowMenu = template.find(x => x.role === 'window');
    windowMenu.submenu = mac.windowChoices;
  }

  JSON.stringify(template, function (key, val) {
    if (key === 'label' && !this.submenu && !this.role) {
      this.click = (...args) => menuClickHandler(...args);
    }
    if (key === 'accelerator' && val instanceof Array) {

      this.accelerator = process.platform === 'darwin' ? val[0] : val[1];
    }
    return val;
  });

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

let menuEvents = {
  'Reload': () => console.log('Reload!'),
  'Learn more': () => console.log('Learn more'),
  'Toggle Developer Tools': (item, focusedWindow) => {
    console.log('Toggle Developer Tools');
    if (focusedWindow) {
      focusedWindow.webContents.toggleDevTools();
    }
  }
};

function menuClickHandler(menuItem) {
  console.log('You have chosen the menu item', menuItem.label);

  mainWindow.webContents.send('menuChoice', menuItem.label);

  menuEvents[menuItem.label] && menuEvents[menuItem.label](menuItem);
}

app.on('ready', createWindow);
app.on('ready', createMenu);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
});

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

// const { app, BrowserWindow, Menu } = require('electron');
// const path = require('path');

// const remoteMain = require('@electron/remote/main');
// remoteMain.initialize();

// let mainWindow;

// function createWindow() {
//   mainWindow = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       nativeWindowOpen: true,
//       nodeIntegration: true,
//       contextIsolation: false,
//       preload: path.join(__dirname, 'preload.js')

//     }
//   });

//   let win = BrowserWindow.getFocusedWindow();

//   remoteMain.enable(mainWindow.webContents);

//   mainWindow.loadURL('https://notflix.clientsmile.se/');

//   mainWindow.show();

//   mainWindow.on('closed', function () {
//     mainWindow = null
//   })

// }

// function createMenu() {
//   let template = require('./menu-choices/menu.json');
//   let mac = require('./menu-choices/mac-specific.json');

//   if (process.platform === 'darwin') {
//     template.unshift(mac.appMenu);
//     let editMenu = template.find(x => x.label === 'Edit');
//     editMenu.submenu = [...editMenu.submenu, ...mac.speechChoices];
//     let windowMenu = template.find(x => x.role === 'window');
//     windowMenu.submenu = mac.windowChoices;
//   }

//   JSON.stringify(template, function (key, val) {
//     if (key === 'label' && !this.submenu && !this.role) {
//       this.click = (...args) => menuClickHandler(...args);
//     }
//     if (key === 'accelerator' && val instanceof Array) {

//       this.accelerator = process.platform === 'darwin' ? val[0] : val[1];
//     }
//     return val;
//   });

//   const menu = Menu.buildFromTemplate(template);
//   Menu.setApplicationMenu(menu);
// }

// let menuEvents = {
//   'Reload': () => console.log('Reload!'),
//   'Learn more': () => console.log('Learn more'),
//   'Toggle Developer Tools': (item, focusedWindow) => {
//     console.log('Toggle Developer Tools');
//     if (focusedWindow) {
//       focusedWindow.webContents.toggleDevTools();
//     }
//   }
// };

// function menuClickHandler(menuItem) {
//   console.log('You have chosen the menu item', menuItem.label);

//   mainWindow.webContents.send('menuChoice', menuItem.label);

//   menuEvents[menuItem.label] && menuEvents[menuItem.label](menuItem);
// }

// app.on('ready', createWindow);
// app.on('ready', createMenu);

// app.on('window-all-closed', function () {
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// });

// app.on('activate', function () {
//   if (mainWindow === null) {
//     createWindow()
//   }
// });

// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';