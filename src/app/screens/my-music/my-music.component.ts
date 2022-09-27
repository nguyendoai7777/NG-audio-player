import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmImportDialogComponent } from './components/confirm-import-dialog/confirm-import-dialog.component';
import { ElectronService } from '../../core/services';
import { MUSIC_ACTION } from '../../../../shared/communication.actions.const';
import { MusicDirInfo, MusicDirInfoInDialog, Song } from '../../shared/interfaces/music.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { AudioPlayerService } from '../../core/services/audio-player.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { filter, fromEvent, Subscription, take } from 'rxjs';
import { TemplatePortal } from '@angular/cdk/portal';


@Component({
  selector: 'my-music',
  templateUrl: './my-music.component.html',
  styleUrls: ['./my-music.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MyMusicComponent implements OnInit {
  @ViewChild('contextMenu') contextMenu: TemplateRef<any>;

  listDir: MusicDirInfo[] = [];
  listDirWithoutSongs: MusicDirInfoInDialog[] = [];
  allSongs: Song[] = [];
  isPlaying = false;
  previousSong = '';
  currentIndex = this.audioService.currentIndex;
  currentIndexAtFolder = this.audioService.currentIndex;
  currentTabIndex = +localStorage.getItem('MyMusic.TabIndex') || 0;
  matRippleDarkColor = 'rgba(255,255,255,0.2)';
  hasContextMenu = false;
  overlayRef: OverlayRef;
  sub: Subscription;
  currentSong: Song;
  currentDir: MusicDirInfo;
  isInnerFolder = false;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private es: ElectronService,
    private audioService: AudioPlayerService,
    private cdr: ChangeDetectorRef,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef
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
    this.audioService.play({ title, type, image, name, dirName, isPlaying: this.allSongs[index].isPlaying }, currentSong, index);
  }

  playAtFolder({ name, dirName, isPlaying, image, album, lyrics, title, type }: Song, index: number) {
    this.currentIndexAtFolder = index;
    for (let i = 0; i < this.currentDir.songs.length; i++) {
      this.currentDir.songs[i].isPlaying = false;
    }
    this.currentDir.songs[index].isPlaying = !isPlaying;
    this.isPlaying = this.currentDir.songs[index].isPlaying;
    let currentSong;
    this.audioService.previousSongName = name;
    if (this.previousSong !== name) {
      this.previousSong = name;
      currentSong = false;
    } else {
      currentSong = true;
    }
    this.audioService.play({ title, type, image, name, dirName, isPlaying: this.currentDir.songs[index].isPlaying }, currentSong, index);

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
      this.cdr.detectChanges();
      this.allSongs = [];
      if (data.length > 0) {
        for (const { songs } of this.listDir) {
          for (const { name, duration, dirName, lyrics, album, type, title } of songs || []) {
            this.allSongs.push({
                lyrics,
                album,
                isPlaying: false,
                name,
                duration,
                type, title,
                dirName
              },
            );
          }
        }
      }
      this.listDirWithoutSongs = data.map(data => ({
        name: data.name,
        path: data.path
      }));
    });
    this.listDirWithoutSongs = (this.es.listDir || []).map(data => ({
      thumb: data.thumb,
      name: data.name,
      path: data.path
    }));
    this.listDir = this.es.listDir;
    for (const { songs } of this.listDir) {
      for (const { title, type, name, duration, dirName, image, lyrics, album, } of songs || []) {
        this.allSongs.push({ title, type, lyrics, album, image, isPlaying: false, name, duration, dirName });
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

  onTabIndexChange(index: number): void {
    localStorage.setItem('MyMusic.TabIndex', String(index));
  }

  openContextMenu({ x, y }: MouseEvent, song: Song, index: number): void {
    this.close();
    this.hasContextMenu = true;
    const positionStrategy = this.overlay.position().flexibleConnectedTo({ x, y }).withPositions([{
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
    }]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close()
    });

    this.overlayRef.attach(new TemplatePortal(this.contextMenu, this.viewContainerRef, {
      $implicit: { song, index }
    }));

    this.sub = fromEvent<MouseEvent>(document, 'click')
      .pipe(
        filter(event => {
          const clickTarget = event.target as HTMLElement;
          return !!this.overlayRef && !this.overlayRef.overlayElement.contains(clickTarget);
        }),
        take(1)
      ).subscribe(() => this.close());

  }


  close() {
    this.hasContextMenu = false;
    this.sub && this.sub.unsubscribe();
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  delete(a) {
    console.log(a);
  }

  select(e) {
  }

  selectThisFolder(al) {
    const navigateTime = setTimeout(() => {
      this.isInnerFolder = true;
      clearTimeout(navigateTime);
    }, 200);
    this.currentDir = al;
    for(const s of this.currentDir.songs) {
      s.isPlaying = this.audioService.currentSong$.getValue()?.name === s.name && this.audioService.currentSong$.getValue()?.isPlaying;
    }
  }

}

