import { Component, OnInit } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, ActivationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, of, takeUntil } from 'rxjs';
import { UnsubscribeService } from '@services/unsubscribe.service';
import { fadeAnimation } from '@constants/animation.const';
import { APP_ACTION } from '../../shared/communication.actions.const';
import { AppService } from '@services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [UnsubscribeService],
  animations: [fadeAnimation]
})
export class AppComponent implements OnInit {
  routeData$ = of('');

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private electronService: ElectronService,
    private translate: TranslateService,
    private unsubscribeService: UnsubscribeService,
  ) {
    this.translate.setDefaultLang('en');
    if (electronService.isElectron) {
      electronService.ipcRenderer.send(APP_ACTION.ViewToProcess.APP_INIT);
      /*console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);*/
    } else {
//      console.log('Run in browser');
    }
    this.electronService.listenListDirChange();
  }

  ngOnInit() {
    this.routeData$ = this.router.events.pipe(
      filter(x => x instanceof ActivationEnd),
      map((x: ActivationEnd) => x.snapshot.data.name),
      takeUntil(this.unsubscribeService.unsubscribe$)
    );
  }

  getRouterOutletState(outlet: RouterOutlet) {
    console.log(outlet);
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
}
