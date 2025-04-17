// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  login: (deviceCode) => ipcRenderer.invoke("login", deviceCode),
  captureImage: () => ipcRenderer.invoke("capture-image"),
  capturePalm: (data) => ipcRenderer.invoke("capture-palm", data),
});
