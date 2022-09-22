import { app, BrowserWindow, dialog, ipcMain, screen } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { STORAGE_KEY, LocalKey } from '../shared/storage-key.const';
import { APP_ACTION, MUSIC_ACTION, SIDEBAR_ACTION, TITLE_BAR_ACTION } from '../shared/communication.actions.const';
import { MusicDirInfo } from '../src/app/shared/interfaces/music.interface';
const { protocol } = require('electron');
const os = require('os');

class SettingStorage {
  #settingPath = `${os.homedir()}\\groover`;

  constructor(defaultData = {}) {
    if (!fs.existsSync(this.#settingPath)) {
      fs.mkdirSync(this.#settingPath);
      this.setData(defaultData);
    } else {
      if (!fs.existsSync(`${os.homedir()}\\groover\\settings.json`)) {
        this.setData(defaultData);
      }
    }
  }

  setData(data) {
    const currentData = this.getAllData().getData();
    const syncData = { ...currentData, ...data };
    fs.writeFileSync(`${os.homedir()}\\groover\\settings.json`, JSON.stringify(syncData));
  }

  getData(key) {
    const fileContentRaw = fs.readFileSync(`${os.homedir()}\\groover\\settings.json`, { encoding: 'utf-8' });
    return JSON.parse(fileContentRaw)[key];
  }

  getAllData() {
    const fileContentRaw = fs.readFileSync(`${os.homedir()}\\groover\\settings.json`, { encoding: 'utf-8' });
    if (fileContentRaw.length <= 0) {
      return {
        getData: (): Partial<LocalKey> => ({}),
        length: 0
      };
    }
    const data = JSON.parse(fileContentRaw);
    return {
      getData: (): LocalKey => data,
      length: Object.keys(data).length
    };
  }

  removeOne(key) {
    const fileContentRaw = fs.readFileSync(`${os.homedir()}\\groover\\settings.json`, { encoding: 'utf-8' });
    const data = JSON.parse(fileContentRaw);
    if (!this.checkExistKey(key, data)) {
      throw new Error('key not exist!');
    }
    delete data[key];
    fs.writeFileSync(`${os.homedir()}\\groover\\settings.json`, JSON.stringify(data));
  }

  editOne(key, value) {
    const fileContentRaw = fs.readFileSync(`${os.homedir()}\\groover\\settings.json`, { encoding: 'utf-8' });
    const data = JSON.parse(fileContentRaw);
    if (!this.checkExistKey(key, data)) {
      throw new Error('key not exist!');
    }
    data[key] = value;
    fs.writeFileSync(`${os.homedir()}\\groover\\settings.json`, JSON.stringify(data));
  }

  checkExistKey(key, obj: object) {
    return !!Object.keys(obj).includes(key);
  }
}

let win: BrowserWindow = null;
const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');
const myStorage = new SettingStorage();


function createWindow(): BrowserWindow {
  const size = screen.getPrimaryDisplay().workAreaSize;
  win = new BrowserWindow({
    frame: false,
    center: true,
    backgroundColor: 'rgba(255, 255, 255, 0)',
    // transparent: true,
    width: size.width * .7,
    height: size.height * .7,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      allowRunningInsecureContent: (serve),
      contextIsolation: false,
    }
  });
  win.setMenu(null);
  if (serve) {
    const debug = require('electron-debug');
    debug();
    require('electron-reloader')(module);
    void win.loadURL('http://localhost:4200');
  } else {
    let pathIndex = './index.html';
    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      pathIndex = '../dist/index.html';
    }
    const url = new URL(path.join('file:', __dirname, pathIndex));
    void win.loadURL(url.href);
  }
  win.on('closed', () => {
    win = null;
  });
  return win;
}

function onAppOpen() {
  const storage = myStorage.getAllData().getData();
  ipcMain.on(APP_ACTION.ViewToProcess.APP_INIT, () => {
    win.webContents.send(SIDEBAR_ACTION.ProcessToView.EXPAND_SIDEBAR_STATE, storage.ExpandedSidebar);
    sendMusicDirs();
  });
}

function fromSidebarCommunication() {
  ipcMain.on(SIDEBAR_ACTION.ViewToProcess.TOGGLE_EXPAND_SIDEBAR, (_, data) => {
    myStorage.setData({ [STORAGE_KEY.ExpandedSidebar]: data });
  });
}

function fromCustomTitleBarCommunication() {
  ipcMain.on(TITLE_BAR_ACTION.CLOSE_FROM_CUSTOM_TITLE_BAR, () => {
    app.quit();
  });
  ipcMain.on(TITLE_BAR_ACTION.HIDE_FROM_CUSTOM_TITLE_BAR, () => {
    win.minimize();
  });
  ipcMain.on(TITLE_BAR_ACTION.TOGGLE_SIZE_FROM_CUSTOM_TITLE_BAR, () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });
}

function sendMusicDirs(position = '') {
  const storage = myStorage.getAllData().getData();
  win.webContents.send(MUSIC_ACTION.ProcessToView.FIRE_DIR_LIST, storage.MusicDirectories);
}

function fromMyMusicCommunication() {
  ipcMain.on(MUSIC_ACTION.ViewToProcess.SELECT_DIR, async () => {
    const result = await dialog.showOpenDialog(win, {
      properties: ['openDirectory'],
      title: 'Select your music folder',
      buttonLabel: 'Add this folder to Music'
    });
    setTimeout(() => {
      sendMusicDirs(MUSIC_ACTION.ViewToProcess.SELECT_DIR);
      win.webContents.send(MUSIC_ACTION.ProcessToView.MUSIC_FOLDER_SELECT, result);
    }, 500)
  });
  ipcMain.on(MUSIC_ACTION.ViewToProcess.ADD_DIR, (_, data) => {
    const storage = myStorage.getAllData().getData();
    const existIndex = (storage.MusicDirectories as MusicDirInfo[]).findIndex(dir => dir.name === data.name);
    if (!(existIndex !== -1)) {
      myStorage.setData({ [STORAGE_KEY.MusicDirectories]: [...storage.MusicDirectories || [], data] });
      setTimeout(() => {
        sendMusicDirs(MUSIC_ACTION.ViewToProcess.ADD_DIR);
      }, 500)
    }
  });
  ipcMain.on(MUSIC_ACTION.ViewToProcess.REMOVE_DIR, (_, dirName) => {
    const storage = myStorage.getAllData().getData();
    const existIndex = (storage.MusicDirectories as MusicDirInfo[]).findIndex(dir => dir.name === dirName);
    if (existIndex > -1) {
      const cloneStorage = [...storage.MusicDirectories]
      const listAfterRemove = cloneStorage.splice(existIndex + 1, 1);
      myStorage.setData({ [STORAGE_KEY.MusicDirectories]: [...listAfterRemove] });
      setTimeout(() => {
        sendMusicDirs(MUSIC_ACTION.ViewToProcess.REMOVE_DIR);
      }, 500)
    }
  });
}

try {
  app.on('ready', () => setTimeout(() => {
    createWindow();
  }, 400));
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (win === null) {
      createWindow();
    }
  });
  onAppOpen();
  fromCustomTitleBarCommunication();
  fromMyMusicCommunication();
  fromSidebarCommunication();

} catch (e) {
}
