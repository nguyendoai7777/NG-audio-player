import { Component, OnInit } from '@angular/core';
import { AudioPlayerService } from '@core-services/audio-player.service';

@Component({
  selector: 'media-controller',
  templateUrl: './media-controller.component.html',
  styleUrls: ['./media-controller.component.scss']
})
export class MediaControllerComponent implements OnInit {

  currentValue = 0;

  current
  constructor(private audioService: AudioPlayerService) {}

  ngOnInit(): void {
    this.audioService.currentSong$.subscribe(song => {
      console.log(`currentSong: `, song);
    });
  }

}
