import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AudioPlayerService } from '@core-services/audio-player.service';
import { throttleTime } from 'rxjs';
import { convertDurationToTime } from '../../core/module/module.features';
import { Song } from '@interfaces/music.interface';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'media-controller',
  templateUrl: './media-controller.component.html',
  styleUrls: ['./media-controller.component.scss']
})
export class MediaControllerComponent implements OnInit {
  @ViewChild('songName', { static: true }) songName: ElementRef<HTMLDivElement>;
  @ViewChild('songWrapper', { static: true }) songWrapper: ElementRef<HTMLDivElement>;
  @ViewChild('animateText', { static: true }) animateText: ElementRef<HTMLDivElement>;
  isPlaying = false;
  currentTime = '';
  endTime = '';
  currentValue = 0;
  currentSong: Song;
  duration = this.audioService.duration$;
  d = 0;
  currentVolume = 0;
  isMute = false;
  loopState = 0;
  shuffleState = 0;
  tooLong = false;
  constructor(
    public audioService: AudioPlayerService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.audioService.currentTime$.pipe(throttleTime(1000)).subscribe((time: number) => {
      this.currentValue = Math.floor(time);
      this.cdr.detectChanges();
      // console.log(this.currentValue);
      this.currentTime = convertDurationToTime(this.currentValue);
      this.cdr.detectChanges();

    });
    this.duration.subscribe(e => {
      this.d = e;
      this.endTime = convertDurationToTime(this.d);
      this.cdr.detectChanges();
    });
    this.audioService.currentSong$.subscribe(song => {
      this.isPlaying = song?.isPlaying || false;
      this.cdr.detectChanges();
      this.currentSong = song;
      this.cdr.detectChanges();
      if(this.songWrapper.nativeElement.offsetWidth < this.songName.nativeElement.offsetWidth) {
        this.animateText.nativeElement.classList.add('extend-name');
        this.tooLong = true;
      } else {
        this.tooLong = false;
        this.animateText.nativeElement.classList.contains('extend-name') && this.animateText.nativeElement.classList.remove('extend-name');
      }
    });
    this.currentVolume = +(localStorage.getItem('volume')) ?? 50;
    this.loopState = localStorage.getItem('loopState') ? +localStorage.getItem('loopState') : this.loopState;
    this.shuffleState = localStorage.getItem('shuffleState') ? +localStorage.getItem('shuffleState') : this.shuffleState;
    this.isMute = this.currentVolume === 0;
    this.setVolume();
  }

  onTimeChange({ value }: MatSliderChange) {
    this.audioService.setCurrentTime(value);
  }

  onVolumeChange({ value }: MatSliderChange) {
    this.currentVolume = value;
    this.setVolume();
    localStorage.setItem('volume', value.toString());
  }

  volumeChangeByWheel({ deltaY }: WheelEvent) {
    if (deltaY < 0) {
      if (this.currentVolume < 100) {
        this.currentVolume += 2;
      }
    } else {
      if (this.currentVolume > 0) {
        this.currentVolume -= 2;
      }
    }
    this.setVolume();
    this.saveVolume();
  }

  saveVolume() {
    const s = setTimeout(() => {
      localStorage.setItem('volume', this.currentVolume.toString());
      clearTimeout(s);
    }, 100);
  }

  setVolume() {
    this.audioService.audio && (this.audioService.audio.volume = this.currentVolume * .01);
  }

  consecutiveChange({ value }: MatSliderChange) {
    this.currentVolume = value;
    this.setVolume();
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    this.currentSong && this.audioService.play({
      isPlaying: this.isPlaying,
      dirName: this.currentSong.dirName,
      name: this.currentSong.name,
      image: this.currentSong.image,
      album: this.currentSong.album,
      lyrics: this.currentSong.lyrics
    }, true, this.audioService.currentIndex);
    // console.log(this.currentSong);
  }

  toggleShuffle() {
    this.shuffleState = (this.shuffleState + 1) % 2;
    localStorage.setItem('shuffleState', this.shuffleState.toString());
  }

  toggleVolume() {
    this.isMute = !this.isMute;
    if (this.isMute) {
      this.currentVolume = 0;
    } else {
      this.currentVolume = this.currentVolume = +(localStorage.getItem('volume')) ?? 50;
    }
    this.setVolume();
    this.saveVolume();
  }

  setLoop() {
    this.loopState = ((this.loopState + 1) % 3);
/*    switch (this.loopState) {
      case 0:  // no loop
        break;
      case 1:  // loop all
        break;
      case 2: // loop current song
        break;
      default:
        break;
    }*/
    localStorage.setItem('loopState', this.loopState.toString());
  }
}
