import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmImportDialogComponent } from './components/confirm-import-dialog/confirm-import-dialog.component';
import { ElectronService } from '../../core/services';
import { MUSIC_ACTION } from '../../../../shared/communication.actions.const';
import { MusicDirInfo, MusicDirInfoInDialog, Song } from '../../shared/interfaces/music.interface';
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
  isPlaying = false;
  previousSong = '';
  currentIndex = this.audioService.currentIndex;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private es: ElectronService,
    private sanitizer: DomSanitizer,
    private audioService: AudioPlayerService,
    private cdr: ChangeDetectorRef
  ) {
    this.onLoad();
  }

  ngOnInit(): void {
    this.checkCurrentIndexSongActive();
  }

  play({ name, dirName, isPlaying, image, album, lyrics, title, type }: Song, index: number) {
    this.currentIndex = index;
    for (let i = 0; i < this.allSongs.length; i++) {
      this.allSongs[i].isPlaying = false;
    }
    this.allSongs[index].isPlaying = !isPlaying;
    this.isPlaying = this.allSongs[index].isPlaying;
    let currentSong;
    this.audioService.previousSongName = name;
    if (this.previousSong !== name) {
      this.previousSong = name;
      currentSong = false;
    } else {
      currentSong = true;
    }
    this.audioService.play({title, type, image, name, dirName, isPlaying: this.allSongs[index].isPlaying }, currentSong, index);
  }

  openImportConfirmPopup() {
    this.es.listenListDirChange();
    const dialog = this.dialog.open(ConfirmImportDialogComponent, {
      data: {
        listDir: this.listDirWithoutSongs
      }
    });
  }

  onLoad() {
    this.es.ipcRenderer.on(MUSIC_ACTION.ProcessToView.FIRE_DIR_LIST, (_, data) => {
      this.listDir = data || [];
      for (const { songs } of this.listDir) {
        for (const { name, duration, dirName, lyrics, album, type, title} of songs || []) {
          this.allSongs.push({
              lyrics,
              album,
              isPlaying: false,
              name,
              duration,
              dirName: this.sanitizer.bypassSecurityTrustUrl(dirName) as string
            },
          );
        }
      }
      this.listDirWithoutSongs = data.map(data => ({
        name: data.name,
        path: data.path
      }));
    });
    this.listDirWithoutSongs = (this.es.listDir || []).map(data => ({
      name: data.name,
      path: data.path
    }));
    this.listDir = this.es.listDir;
    for (const { songs } of this.listDir) {
      for (const {title, type, name, duration, dirName, image, lyrics, album, } of songs || []) {
        this.allSongs.push({title, type, lyrics, album, image, isPlaying: false, name, duration, dirName: this.sanitizer.bypassSecurityTrustUrl(dirName) as string });
      }
    }
    this.audioService.currentList$.next(this.allSongs);
  }

  checkCurrentIndexSongActive() {
    this.audioService.currentSong$.subscribe(song => {
      if (song) {
        this.currentIndex = this.audioService.currentIndex;
        this.allSongs = this.audioService.currentList$.getValue();
        this.allSongs[this.audioService.currentIndex].isPlaying = song.isPlaying;
        this.cdr.detectChanges();
      }
    });
  }

}

