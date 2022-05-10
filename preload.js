const { contextBridge, ipcRenderer } = require('electron')

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

contextBridge.exposeInMainWorld('electronAPI', {
  getData: () => ipcRenderer.send('get-data'),
  collectHeapSnapshot: () => ipcRenderer.send('collect-heapsnapshot'),
  callsResponse: (callback) => ipcRenderer.on('call-response', callback)
})

