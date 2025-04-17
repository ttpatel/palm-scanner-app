const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { login } = require("./modules/apiClient");
const { saveToken } = require("./modules/tokenManger");
const { captureImage } = require("./core/cameraManager");
const { runPythonCapture } = require("./python-runner"); // 👈 NEW

// Handle login (your existing code)
ipcMain.handle("login", async (event, deviceCode) => {
  try {
    const data = await login(deviceCode);
    saveToken(data.token);
    console.log("Login successful. Token saved.");
    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: error.message };
  }
});

// Handle raw camera capture (existing)
ipcMain.handle("capture-image", async () => {
  try {
    const imagePath = await captureImage();
    return { success: true, path: imagePath };
  } catch (error) {
    console.error("Camera capture failed:", error);
    return { success: false, message: error.message };
  }
});

// 👇 NEW: handle structured palmprint capture using Python
ipcMain.handle("capture-palm", async (event, userData) => {
  try {
    const imagePath = await runPythonCapture(userData);
    return { success: true, path: imagePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false,
      allowRunningInsecureContent: true,
      sandbox: false,
    },
  });

  win.loadFile("renderer/pages/login.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
