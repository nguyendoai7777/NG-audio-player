import { Injectable } from '@angular/core';
import { ElectronService } from '../../core/services';
import { MUSIC_ACTION, SIDEBAR_ACTION } from '../../../../shared/communication.actions.const';
import { MusicDirInfo } from '@interfaces/music.interface';

@Injectable({
  providedIn: 'root',
})
export class AppService {


  constructor(
    private es: ElectronService
  ) {
  }


}
