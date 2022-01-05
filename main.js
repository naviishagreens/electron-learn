const { app, BrowserWindow, ipcMain } = require("electron");
const url = require("url");
const path = require("path");
const fs = require("fs");

let mainWindow;

function openModal() {
  const { BrowserWindow } = require("electron");
  let modal = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    show: false,
  });
  modal.loadURL("https://www.sitepoint.com");
  modal.once("ready-to-show", () => {
    modal.show();
  });
}

ipcMain.on("openModal", (event, arg) => {
  openModal();
});


function listenForBrowserEvents(win) {
  ipcMain.on("toMain", (event, args) => {
    fs.readFile(path.join(__dirname, "README.md"), "utf8", (error, data) => {
      // Do something with file contents

      //console.log("fs", data);
  
      // Send result back to renderer process
      win.webContents.send("fromMain", data);
    });
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "preload.js") // use a preload script
    },
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/electron-learn/index.html`),
      protocol: "file:",
      slashes: true,
    })
  );
  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", function () {
    mainWindow = null;
  });

  listenForBrowserEvents(mainWindow);
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) createWindow();
});
