import { Component, ElementRef, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { filter, map, of, takeUntil } from 'rxjs';
import { UnsubscribeService } from '@services/unsubscribe.service';
import { SIDEBAR_CONST } from '@constants/sidebar-data.const';
import { ICON_BUTTON_ACTIVE_BG_COLOR } from '@constants/color.const';
import { ROOT_ROUTES } from '@constants/routes.const';
import { ElectronService } from '@core-services/electron/electron.service';
import { MUSIC_ACTION, SIDEBAR_ACTION } from '../../../../shared/communication.actions.const';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [UnsubscribeService]
})
export class SidebarComponent implements OnInit {
  navBtns = SIDEBAR_CONST;
  rippleColor = ICON_BUTTON_ACTIVE_BG_COLOR;
  disableBack$ = of(false);
  isExpanded = true;

  constructor(
    private router: Router,
    private location: Location,
    private unsubscribeService: UnsubscribeService,
    private elr: ElementRef<HTMLElement>
  ) {
    this.isExpanded = (localStorage.getItem('isSideExpanded') || '1') === '1';
  }

  ngOnInit(): void {
    this.disableBack$ = this.router.events.pipe(
      takeUntil(this.unsubscribeService.unsubscribe$),
      filter(e => e instanceof NavigationEnd),
      map((e: NavigationEnd) => e.url === ROOT_ROUTES[0].path)
    );
    this.checkExpanded();
  }

  goPrevious() {
    void this.location.back();

  }

  goNext() {
    this.location.forward();
  }


  toggleSide() {
    this.isExpanded = !this.isExpanded;
    localStorage.setItem('isSideExpanded', this.isExpanded ? '1' : '0');
    this.checkExpanded();
  }

  checkExpanded() {
    if (!this.isExpanded) {
      this.elr.nativeElement.classList.add('SidebarExpanded');
    } else {
      this.elr.nativeElement.classList.remove('SidebarExpanded');
    }
  }
}
