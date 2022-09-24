import { Injectable } from '@angular/core';
import { ipcRenderer, webFrame } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import { MUSIC_ACTION, SIDEBAR_ACTION, TITLE_BAR_ACTION } from '../../../../../shared/communication.actions.const';
import { MusicDirInfo } from '@interfaces/music.interface';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  childProcess: typeof childProcess;
  fs: typeof fs;

  listDir: MusicDirInfo[] = [];
  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.fs = window.require('fs');
      console.log('is App Mode');
      this.childProcess = window.require('child_process');
      this.childProcess.exec('node -v', (error, stdout, stderr) => {
        if (error) {
          // console.error(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          // console.error(`stderr: ${stderr}`);
          return;
        }
        // console.log(`stdout:\n${stdout}`);
      });
    }
  }

  getElectronWindow() {
    console.log(window);
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  /** @start (send process) */

  toggleSidebar(state) {
    this.ipcRenderer.send(SIDEBAR_ACTION.ViewToProcess.TOGGLE_EXPAND_SIDEBAR, state);
  }

  quit() {
    this.ipcRenderer.send(TITLE_BAR_ACTION.CLOSE_FROM_CUSTOM_TITLE_BAR);
  }

  zoomInOrOut() {
    this.ipcRenderer.send(TITLE_BAR_ACTION.TOGGLE_SIZE_FROM_CUSTOM_TITLE_BAR);
  }

  hideWindow() {
    this.ipcRenderer.send(TITLE_BAR_ACTION.HIDE_FROM_CUSTOM_TITLE_BAR);
  }

  getFolder() {
    this.ipcRenderer.send(MUSIC_ACTION.ViewToProcess.SELECT_DIR);
  }

  removeDirFromAddDialog(name: string) {
    this.ipcRenderer.send(MUSIC_ACTION.ViewToProcess.REMOVE_DIR, name);
  }

  listenListDirChange() {

    this.ipcRenderer.on(MUSIC_ACTION.ProcessToView.FIRE_DIR_LIST, (_, data) => {
      this.listDir = data || [];
    });

  }

  /** @end (send process) */

  /** --------------------------- **/

}
