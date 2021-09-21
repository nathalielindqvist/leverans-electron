const { ipcRenderer } = require('electron');
const remote = require('@electron/remote');

const { app } = remote;
const { dialog } = remote;

const fs = require('fs');
const path = require('path');

console.log('userData', app.getPath('userData'));

ipcRenderer.on('menuChoice', (ipcEvent, menuItemLabel) => {
  document.querySelector('.footer').innerHTML = '<p>You chose the menu item ' + menuItemLabel + '.</p>';

  let fileExtensionToUse = 'notflix';
  if (menuItemLabel === 'Download wishlist as file') {
    let filePath = dialog.showSaveDialogSync({
      properties: ['createDirectory']
    });
    if (filePath) {
      if (
        filePath.slice(-fileExtensionToUse.length - 1) !==
        '.' + fileExtensionToUse
      ) {
        filePath += '.' + fileExtensionToUse;
      }
      let text = document.querySelector('.text-to-remember').value;
      fs.writeFileSync(
        filePath,
        JSON.stringify({ textArea: text }, null, '  '),
        'utf-8'
      );
    }
  }

  if (menuItemLabel === 'Upload wishlist to cart') {
    let filePaths = dialog.showOpenDialogSync({
      properties: ['openFile'],
      options: { filters: { extensions: [fileExtensionToUse] } }
    });
    if (filePaths) {
      let json = fs.readFileSync(filePaths[0], 'utf-8');
      let data = JSON.parse(json);
      document.querySelector('.text-to-remember').value = data.textArea;
    }
  }
});