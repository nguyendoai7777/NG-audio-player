import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmImportDialogComponent } from './components/confirm-import-dialog/confirm-import-dialog.component';
import { ElectronService } from '../../core/services';
import { MUSIC_ACTION } from '../../../../shared/communication.actions.const';
import { MusicDirInfo, MusicDirInfoInDialog, Song, SongInfo } from '../../shared/interfaces/music.interface';
import { AppService } from '../../shared/services/app.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AudioPlayerService } from '../../core/services/audio-player.service';

@Component({
  selector: 'my-music',
  templateUrl: './my-music.component.html',
  styleUrls: ['./my-music.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MyMusicComponent implements OnInit {
  listDir: MusicDirInfo[] = [];
  listDirWithoutSongs: MusicDirInfoInDialog[] = [];
  allSongs: Song[] = [];
  audio: HTMLAudioElement;
  previousSong = '';

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private es: ElectronService,
    private sanitizer: DomSanitizer,
    private audioService: AudioPlayerService
  ) {
    this.es.ipcRenderer.on(MUSIC_ACTION.ProcessToView.FIRE_DIR_LIST, (_, data) => {
      this.listDir = data;
      for (const { songs } of this.listDir) {
        for (const { name, duration, dirName } of songs) {
          this.allSongs.push({
              isPlaying: false,
              name,
              duration,
              dirName: sanitizer.bypassSecurityTrustUrl(dirName) as string
            },
          );
        }
      }
      this.listDirWithoutSongs = data.map(data => ({
        name: data.name,
        path: data.path
      }));
    });
    this.listDirWithoutSongs = this.es.listDir.map(data => ({
      name: data.name,
      path: data.path
    }));
    this.listDir = this.es.listDir;
    for (const { songs } of this.listDir) {
      for (const { name, duration, dirName } of songs) {
        this.allSongs.push({ isPlaying: false, name, duration, dirName: sanitizer.bypassSecurityTrustUrl(dirName) as string });
      }
    }
  }

  ngOnInit(): void {


  }

  play({ name, dirName, isPlaying }: Song, index: number) {
    let duration = 0;
    for (let i = 0; i < this.allSongs.length; i++) {
      this.allSongs[i].isPlaying = false;
    }
    this.allSongs[index].isPlaying = !isPlaying;
    if (this.previousSong !== name) {
      this.previousSong = name;
      if(!this.audio) {
        this.audio = new Audio();
      }
      this.audio.pause();
      this.audio.currentTime = 0;

      const url = (dirName)['changingThisBreaksApplicationSecurity'];
      this.audio.src = 'file:///' + url;
      this.audio.play();
      this.audio.onloadedmetadata = () => {
        console.log('vao roi',  this.audio.duration);
        const d = Math.floor(this.audio.duration)
        duration = this.audio.duration;
      }
    } else {
      if (isPlaying) {
        this.audio.pause();
      } else {
        this.audio.play();
      }

    }

    console.log('next');
    this.audioService.currentSong$.next({ name, isPlaying, dirName, duration  });
  }

  openImportConfirmPopup() {
    this.es.listenListDirChange();
    const dialog = this.dialog.open(ConfirmImportDialogComponent, {
      data: {
        listDir: this.listDirWithoutSongs
      }
    });
  }

}
