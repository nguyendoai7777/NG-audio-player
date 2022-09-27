import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Song } from '@interfaces/music.interface';

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {
  currentSong$ = new BehaviorSubject<Song>(null);
  currentTime$ = new BehaviorSubject(0);
  duration$ = new BehaviorSubject(0);
  currentList$ = new BehaviorSubject<Song[]>([]);
  audio: HTMLAudioElement;
  isCurrentSong = false;
  currentIndex;
  previousSongName = '';
  isShuffle = false;
  loopState = 0;
  isGlobalPlaying = false;
  constructor() {
  }

  pause() {
    // console.log(this.audio);
    this.audio && this.audio.pause();
  }

  setCurrentTime(time: number) {
    const x = setTimeout(() => {
      this.audio && (this.audio.currentTime = (time));
      clearTimeout(x);
    }, 200);
  }

  resetCurrentState() {
    for (let i = 0; i < this.currentList$.getValue().length; i++) {
      this.currentList$.getValue()[i].isPlaying = false;
    }
  }

  nextSong(currentIndex: number, loopAll = false): void {
    const isShuffle = localStorage.getItem('shuffleState') ? +localStorage.getItem('shuffleState') : this.isShuffle;
    const next = (index) => {
      const nextSongInfo = this.currentList$.getValue()[index];
      this.resetCurrentState();
      this.play({
        name: nextSongInfo.name,
        dirName: nextSongInfo.dirName,
        isPlaying: true,
      }, false, index);
    }
    console.log('loopall: ', loopAll);
    if(!isShuffle) {
      const index = currentIndex + 1 > this.currentList$.getValue().length - 1 ? 0 : currentIndex + 1;
      next(index);
    } else { // random song
      let index;
      if(loopAll) {
        index = Math.floor(Math.random() * this.currentList$.getValue().length);
      } else {
        index = Math.floor(Math.random() * this.currentList$.getValue().length);
      }
      next(index);
    }
  }

  previousSong(currentIndex: number) {
    const index = currentIndex - 1 < 0 ? this.currentList$.getValue().length - 1 : currentIndex - 1;
    const nextSongInfo = this.currentList$.getValue()[index];
    this.resetCurrentState();
    this.play({
      name: nextSongInfo.name,
      dirName: nextSongInfo.dirName,
      isPlaying: true,
    }, false, index);
  }

  play({ name, dirName, isPlaying, image, album, lyrics, title }: Song, isCurrentSong: boolean, index: number) {
    let duration = 0;
    this.currentIndex = index;
    this.isCurrentSong = isCurrentSong;
    if (!isCurrentSong) {
      if (!this.audio) {
        this.audio = new Audio();
        this.setVolume();
        this.audio.addEventListener('ended', () => {
          // console.log('end r ne');
          this.currentSong$.next({name, isPlaying: false, dirName})
          this.loopState = localStorage.getItem('loopState') ? +localStorage.getItem('loopState') : this.loopState;
          if(this.loopState === 2) {
            // console.log('vao day');
            this.audio.currentTime = 0;
            void this.audio.play();
          } else {
            // console.log('hay vao day', this.currentIndex, this.currentList$.getValue().length - 1);
            if(!(this.currentIndex === this.currentList$.getValue().length - 1)) {
              // console.log('??');
              this.nextSong(index, this.loopState === 1);
            } else {
              // console.log('?????????????');
              /*this.audio.currentTime = 0;
              this.currentSong$.next({
                name: this.currentList$.getValue()[0].name,
                dirName: this.currentList$.getValue()[0].dirName,
                isPlaying: false,
              })
              this.currentTime$.next(0);*/
            }
          }
        });
      }
      const next = () => {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.audio.src = 'file:///' + dirName;
        this.audio.onloadedmetadata = () => {
          this.audio.play().then(() => {
            this.duration$.next(Math.floor(this.audio.duration));
          });
          this.audio.ontimeupdate = () => {
            this.currentTime$.next(this.audio.currentTime);
          };
        };
      };
      next();
    } else {
      if (isPlaying) {
        void this.audio.play();
      } else {
        this.audio.pause();
      }
    }
    this.currentSong$.next({ name, isPlaying, dirName, duration, image, title });
  }

  setVolume() {
    const v = +(localStorage.getItem('volume')) ?? 50;
    this.audio && (this.audio.volume = v * .01);
  }
}
