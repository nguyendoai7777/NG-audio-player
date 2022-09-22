import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Song } from '@interfaces/music.interface';

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {
  currentSong$ = new BehaviorSubject<Song>(null);
  currentTime$ = new BehaviorSubject(0);
  endTime$ = new BehaviorSubject(0);
  constructor() { }


}
