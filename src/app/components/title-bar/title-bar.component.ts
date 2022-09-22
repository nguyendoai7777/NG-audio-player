import { Component, OnInit } from '@angular/core';
import { ICON_BUTTON_ACTIVE_BG_COLOR, ICON_BUTTON_HOVER_BG_COLOR } from '@constants/color.const';
import { ElectronService } from '@core-services/electron/electron.service';

@Component({
  selector: 'title-bar',
  template: `
    <div class="leading"></div>
    <div class="title" id="title-bar-title-box"></div>
    <div class="actions flex">
      <div (click)="hideWindow()" class="action-icon-btn flex align-items-center justify-content-center" matRipple [matRippleColor]="rippleColor">
        <svg>
          <use xlink:href="#minimize"/>
        </svg>
      </div>
      <div (click)="zoomInOrOut()" class="action-icon-btn flex align-items-center justify-content-center" matRipple [matRippleColor]="rippleColor">
        <svg>
          <use [attr.xlink:href]="!isMaximize ? '#maximize' : '#restore'"/>
        </svg>
      </div>
      <div (click)="quit()" class="action-icon-btn flex align-items-center justify-content-center" matRipple [matRippleColor]="rippleColor">
        <svg>
          <use xlink:href="#tclose"/>
        </svg>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      height: 30px;
      background-color: #2D2F35;
      width: 100%;
      .leading {
        width: 30%;
      }
      .title {
        width: calc(100% - 120px - 30%);
      }
      .action-icon-btn {
        cursor: pointer;
        height: 30px;
        width: 45px;
        transition: .25s;
        &:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        /* &:last-child {
           border-top-right-radius: 8px;
         }*/
        svg {
          width: 15px;
          height: 15px;
          fill: var(--main-color);
        }
      }
    }
  `]
})
export class TitleBarComponent implements OnInit {
  rippleColor = ICON_BUTTON_ACTIVE_BG_COLOR;
  hoverColor = ICON_BUTTON_HOVER_BG_COLOR;
  isMaximize = false;

  constructor(private electronService: ElectronService) {
  }

  ngOnInit(): void {
  }

  hideWindow() {
    this.electronService.hideWindow();
  }

  zoomInOrOut() {
    this.isMaximize = !this.isMaximize;
    this.electronService.zoomInOrOut();
  }

  quit() {
    this.electronService.quit();
  }

}
