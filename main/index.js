const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  const isDev = !app.isPackaged;

  const isWin = process.platform === 'win32';

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1000,
    minHeight: 700,
    frame: false, // Make window frameless
    transparent: isWin, // Transparent only on Windows for Mica
    backgroundColor: isWin ? '#00000000' : '#202020', // Solid background on Linux/macOS
    hasShadow: true,
    icon: path.join(__dirname, '../assets/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Apply Mica effect on Windows 11
  if (process.platform === 'win32') {
    mainWindow.setBackgroundMaterial('mica');
  }

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

// Window actions
ipcMain.on('window-minimize', () => mainWindow.minimize());
ipcMain.on('window-maximize', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});
ipcMain.on('window-close', () => mainWindow.close());
ipcMain.handle('get-platform', () => process.platform);

// Native A4 print-to-PDF export
ipcMain.handle('export-pdf', async (event) => {
  const { filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Export CV to PDF',
    defaultPath: path.join(app.getPath('downloads'), 'Resume.pdf'),
    filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
  });

  if (!filePath) return { success: false, error: 'Cancelled' };

  try {
    const data = await mainWindow.webContents.printToPDF({
      printBackground: true,
      pageSize: 'A4',
      margins: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }
    });
    fs.writeFileSync(filePath, data);
    return { success: true, path: filePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Save CV project configuration file (Save As)
ipcMain.handle('save-project-file', async (event, dataString) => {
  const { filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Save CV Project',
    defaultPath: path.join(app.getPath('documents'), 'MyResume.cver'),
    filters: [{ name: 'CVer Project Files', extensions: ['cver', 'json'] }]
  });

  if (!filePath) return { success: false, error: 'Cancelled' };

  try {
    fs.writeFileSync(filePath, dataString, 'utf-8');
    return { success: true, path: filePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Open existing CV project configuration file
ipcMain.handle('open-project-file', async (event) => {
  const { filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Open CV Project',
    filters: [{ name: 'CVer Project Files', extensions: ['cver', 'json'] }],
    properties: ['openFile']
  });

  if (!filePaths || filePaths.length === 0) return { success: false, error: 'Cancelled' };

  try {
    const dataString = fs.readFileSync(filePaths[0], 'utf-8');
    const data = JSON.parse(dataString);
    return { success: true, data, path: filePaths[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Quick save/write to existing CV project path
ipcMain.handle('write-project-file', async (event, filePath, dataString) => {
  try {
    fs.writeFileSync(filePath, dataString, 'utf-8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Read specific project file path (for loading recents)
ipcMain.handle('read-project-file', async (event, filePath) => {
  try {
    const dataString = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(dataString);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
