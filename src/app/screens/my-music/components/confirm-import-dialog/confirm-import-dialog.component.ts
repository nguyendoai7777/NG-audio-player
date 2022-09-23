import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ICON_BUTTON_ACTIVE_BG_COLOR } from '../../../../shared/constant/color.const';
import { ElectronService } from '../../../../core/services';
import { MUSIC_ACTION } from '../../../../../../shared/communication.actions.const';
import { DirOfSongData, MusicDirInfo, Song } from '../../../../shared/interfaces/music.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppService } from '../../../../shared/services/app.service';

@Component({
  selector: 'confirm-import-dialog',
  templateUrl: './confirm-import-dialog.component.html',
  styles: [`
    :host {
      --text-regular-size: 12px;
      display: block;
      width: fit-content;
      background-color: var(--dialog-bg-color);
      padding: 24px;
      border-radius: 8px;
      border: 1px solid var(--border-general-color);
      * {
        color: var(--text-color);
      }
      @mixin btn {
        background-color: #333333;
        transition: var(--transition);
        border-radius: 6px;
        &:hover {
          background-color: var(--button-hover-bg-color);
        }
      }
      .heading {
        font-size: 16px;
      }
      .detail {
        padding-top: 6px;
        font-size: var(--text-regular-size);
      }
      .po-body {
        padding: 10px 0;
        overflow: auto;
        height: 266px;
      }
      .abstract-folder {
        margin: 6px 0;
        position: relative;
        width: 300px;
        height: 70px;
        min-height: 70px;
        max-height: 70px;
        @include btn;
        padding: 10px
      }
      .po-done-btn {
        padding: 8px;
        width: 125px;
        @include btn;
        margin-right: 16px;
        font-size: var(--text-regular-size);
      }
      .po-close {
        fill: var(--icon-fill);
        width: 12px;
        height: 12px;
        position: absolute;
        top: 12px;
        right: 12px;
      }
      .folder-path, .folder-name {
        font-size: var(--text-regular-size);
      }
      .folder-path {
        padding-top: 4px;
      }
      .po-footer {
        margin-top: 5px;
      }
    }
  `]
})
export class ConfirmImportDialogComponent implements OnInit {
  matRippleColor = ICON_BUTTON_ACTIVE_BG_COLOR;
  listDir: MusicDirInfo[] = [];

  constructor(
    private es: ElectronService,
    private appService: AppService,
    private dialogRef: MatDialogRef<ConfirmImportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DirOfSongData,
    private cdr: ChangeDetectorRef
  ) {
    this.es.ipcRenderer.on(MUSIC_ACTION.ProcessToView.FIRE_DIR_LIST, (_, data) => {
      this.listDir = data;
      cdr.detectChanges();
    });
    this.es.ipcRenderer.on(MUSIC_ACTION.ProcessToView.ADD_DIR, (_, data) => {
      this.listDir = data;
      cdr.detectChanges();
    });
  }

  ngOnInit(): void {
    this.listDir = this.data.listDir;
    this.es.ipcRenderer.on(MUSIC_ACTION.ProcessToView.MUSIC_FOLDER_SELECT, (event, data) => {

      if (data.filePaths.length > 0) {
        this.es.fs.readdir(data.filePaths[0], (error, files) => {
          const filePaths = (data.filePaths[0] as string).split('\\');
          const name = filePaths[filePaths.length - 1];
          const path = String(data.filePaths[0]).replace(/\\\\/g, '\\');
          const songsInfo: Song[] = [];
          for (const song of files) {
            const src = `${data.filePaths[0]}/${song}`;
          /*  console.log('url: ', src);
            const audio = new Audio(src);
            audio.onloadedmetadata = () => {
            };*/
              songsInfo.push({ name: song, duration: 20, dirName: src });
          }
          this.es.ipcRenderer.send(MUSIC_ACTION.ViewToProcess.ADD_DIR, { path, name, songs: songsInfo } as MusicDirInfo);
        });
      }
    });

  }

  done() {
    this.dialogRef.close();
    location.reload();
  }

  addDir() {
    this.es.getFolder();

  }

  removeDir(name: string) {
    this.es.removeDirFromAddDialog(name);

  }
}
