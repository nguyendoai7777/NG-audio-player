import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Song } from '../../shared/interfaces/music.interface';
import { AudioPlayerService } from '../../core/services/audio-player.service';


@Component({
  selector: 'song-item',
  templateUrl: './song-item.component.html',
  styleUrls: ['./song-item.component.scss']
})
export class SongItemComponent implements OnInit {
  @Input() song: Song;
  @Input() currentIndex: number = 0;
  @Input() index: number;
  @Input() hasContextMenu = false;
  @Output() play = new EventEmitter<void>();
  @Output() ctxMenu = new EventEmitter<MouseEvent>();
  @Input() isPlaying = false
  isPlaying$ = this.audioService.isGlobalPlaying;
  constructor(
    private audioService: AudioPlayerService
  ) {}

  ngOnChanges(changes) {
    // console.log(changes['song']);
  }

  ngOnInit(): void {
    /*this.audioService.currentSong$.subscribe((s) => {
      if(s) {
        console.log(s.isPlaying);
      }
    })*/
  }

}
