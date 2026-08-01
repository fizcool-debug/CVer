const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  exportPDF: () => ipcRenderer.invoke('export-pdf'),
  saveProjectFile: (dataString) => ipcRenderer.invoke('save-project-file', dataString),
  openProjectFile: () => ipcRenderer.invoke('open-project-file'),
  writeProjectFile: (filePath, dataString) => ipcRenderer.invoke('write-project-file', filePath, dataString),
  readProjectFile: (filePath) => ipcRenderer.invoke('read-project-file', filePath)
});
