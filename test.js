
   function general() {

   let test = document.querySelector('.row');
   console.log(test);


    const { ipcRenderer } = require('electron');
    const remote = require('@electron/remote');

    const { app } = remote;
    const { dialog } = remote;

    const fs = require('fs');
    const path = require('path');

    console.log('userData', app.getPath('userData'));

    ipcRenderer.on('menuChoice', (ipcEvent, menuItemLabel) => {
      console.log('You chose the menu item ' + menuItemLabel + '.');

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
          // let text = document.querySelector('.wishlist').value;
          fs.writeFileSync(
            filePath,
            JSON.stringify({ test }, null, '  '),
            'utf-8'
          );
        }
      }

      // if (menuItemLabel === 'Upload wishlist to cart') {
      //   let filePaths = dialog.showOpenDialogSync({
      //     properties: ['openFile'],
      //     options: { filters: { extensions: [fileExtensionToUse] } }
      //   });
      //   if (filePaths) {
      //     let json = fs.readFileSync(filePaths[0], 'utf-8');
      //     let data = JSON.parse(json);
      //     document.querySelector('.text-to-remember').value = data.textArea;
      //   }
      // }
    });

    }

    setTimeout(general, 5000);