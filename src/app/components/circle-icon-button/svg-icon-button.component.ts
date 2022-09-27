import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: 'circle-icon-button',
  template: `
    <svg class="ic-{{size}}" style="transform: translateX(2px)">
      <use [attr.xlink:href]="'#'+icon"/>
    </svg>
  `,
  styles: [`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: .25s;
      overflow: hidden;
      &:hover {
        background-color: var(--icon-button-hover-color);
      }
      svg {
        fill: var(--icon-fill);
      }
      .ic-small {
        width: 15px;
        height: 15px;
      }
      .ic-medium {
        width: 25px;
        height: 25px;
      }
      .ic-large {
        width: 35px;
        height: 35px;
      }
      &.ico-small-btn {
        width: 30px;
        height: 30px;
      }
      &.ico-medium-btn {
        width: 40px;
        height: 40px;
      }
      &.ico-large-btn {
        width: 50px;
        height: 50px;
      }
      &.circle {
        border-radius: 50%;
      }
      &.box {
        border-radius: unset;
      }
      &.rounded {
        border-radius: 5px;
      }
    }
  `],
})
export class SvgIconButton implements OnInit {
  @Input() icon = '';
  @Input() size: 'small' | 'medium' | 'large' = 'small';
  @Input() type: 'circle' | 'box' | 'rounded' = 'circle';

  ngOnChanges(changes) {
    if(changes['type']) {
      this.elr.nativeElement.classList.add(this.type);
    }
    if(changes['size']) {
      this.elr.nativeElement.classList.add(`ico-${this.size}-btn`);
    }
  }

  constructor(private elr: ElementRef<HTMLElement>) {
    elr.nativeElement.className = `cursor-pointer`;
  }

  ngOnInit(): void {}

}
