const { app, BrowserWindow, Tray } = require('electron')
const NodeClam = require('clamscan')
const ClamScan = new NodeClam().init({
  remove_infected: false, // If true, removes infected files
  quarantine_infected: false, // False: Don't quarantine, Path: Moves files to this place.
  scan_log: null, // Path to a writeable log file to write scan results into
  debug_mode: false, // Whether or not to log info/debug/error msgs to the console
  file_list: null, // path to file containing list of files to scan (for scan_files method)
  scan_recursively: true, // If true, deep scan folders recursively
  clamscan: {
      path: '/usr/bin/clamscan', // Path to clamscan binary on your server
      db: null, // Path to a custom virus definition database
      scan_archives: true, // If true, scan archives (ex. zip, rar, tar, dmg, iso, etc...)
      active: true // If true, this module will consider using the clamscan binary
  },
  clamdscan: {
      socket: false, // Socket file for connecting via TCP
      host: false, // IP of host to connect to TCP interface
      port: false, // Port of host to use when connecting via TCP interface
      timeout: 60000, // Timeout for scanning files
      local_fallback: false, // Do no fail over to binary-method of scanning
      path: '/usr/bin/clamdscan', // Path to the clamdscan binary on your server
      config_file: null, // Specify config file if it's in an unusual place
      multiscan: true, // Scan using all available cores! Yay!
      reload_db: false, // If true, will re-load the DB on every call (slow)
      active: true, // If true, this module will consider using the clamdscan binary
      bypass_test: false, // Check to see if socket is available when applicable
  },
  preference: 'clamdscan' // If clamdscan is found and active, it will be used by default
})

function createWindow () {
  // App icon
  // https://www.electronjs.org/docs/api/native-image#nativeimage
  // const appIcon = new Tray('favicon.png')

  // Create the browser window,
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: 'favicon.png',
    backgroundColor: '#212121',
    darkTheme: true,
    show: false,
    vibrancy: 'dark',
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true
    }
  })

  // Maximize window on start
  win.maximize()

  // Debug
  // console.group('Main')
  // console.log(appIcon, win)
  // console.groupEnd()

  // and load the index.html file of the application.
  win.loadFile('index.html')

  // Open the DevTools.
  win.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()

    // Debug
    // console.group('Main')
    // console.log('Window created and loaded.')
    // console.groupEnd()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Inter process communication tests
// From: https://www.electronjs.org/docs/api/ipc-main

// In main process.
const { ipcMain } = require('electron')

/* async */
ipcMain.on('asynchronous-message', (event, arg) => {
  console.group('IPC')
  console.log('Running [async] inter-process communication tests...')
  console.log('Received [' + arg + '], sending [pong]...') // prints "ping"
  console.groupEnd()
  event.reply('asynchronous-reply', 'pong')
})

/* sync */
/* ipcMain.on('synchronous-message', (event, arg) => {
  console.log('Running [sync] inter-process communication tests...')
  console.log('Received [' + arg + '], sending [pong]...') // prints "ping"
  event.returnValue = 'pong'
}) */

console.group('App')
console.log('Starting ClamAV...');
console.groupEnd()

// Get instance by resolving ClamScan promise object
ClamScan.then(async clamscan => {
  try {
    // You can re-use the `clamscan` object as many times as you want
    const version = await clamscan.get_version();
    console.group('ClamAV')
    console.log('ClamAV Started.');
    console.log(`ClamAV Version: ${version}`);
    console.log('Scanning project folder...');
    console.groupEnd()

    /* const {is_infected, file, viruses} = await clamscan.is_infected('/some/file.zip');
    if (is_infected) console.log(`${file} is infected with ${viruses}!`); */

    /* try {
      const {path, is_infected, good_files, bad_files, viruses} = await clamscan.scan_dir('/home/jiab77/Projects/clamav-desktop');
      if (bad_files.length > 0) {
          console.log(`${path} was infected. The offending files (${bad_files.join (', ')}) have been quarantined.`);
          console.log(`Viruses Found: ${viruses.join(', ')}`);
      } else {
          console.log("Everything looks good! No problems here!.");
      }
    } catch (err) {
      // Handle any errors raised by the code in the try block
      console.group('Catched error')
      console.error(err)
      console.groupEnd()
    } */

    clamscan.scan_dir('/home/jiab77/Projects/clamav-desktop', (err, good_files, bad_files, viruses) => {
        if (err) return console.error(err);

        console.group('ClamAV')
        if (bad_files.length > 0) {
            console.log(`${path} was infected. The offending files (${bad_files.join (', ')}) have been quarantined.`);
            console.log(`Viruses Found: ${viruses.join(', ')}`);
        } else {
            console.log('Everything looks good! No problems here!.');
        }
        console.log(`File scanned: ${good_files.length}`)
        console.groupEnd()
    });

  } catch (err) {
    // Handle any errors raised by the code in the try block
    console.group('Catched error')
    console.error(err)
    console.groupEnd()
  }
}).catch(err => {
    // Handle errors that may have occurred during initialization
    console.group('Init catched error')
    console.error(err)
    console.groupEnd()
});
