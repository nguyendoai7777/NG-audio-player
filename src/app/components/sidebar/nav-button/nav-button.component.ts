import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'nav-button',
  template: `
    <button mat-button>
      <span class="flex align-items-center">
        <svg  [class]="svgClassList?  svgClassList : ' icon '"><use [attr.xlink:href]="'#' + iconHref"/></svg>
        <div class="label select-none">{{label}}</div>
      </span>
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
      width: 100%;
      transition: .35s;
      &:hover {
        background-color: var(--light-color);
      }
      button {
        width: 100%;
        display: flex;
        padding: 7px 16px 7px 14px;
        align-items: center;
        cursor: pointer;
      }

      .icon {
        fill: var(--icon-fill);
        width: 20px;
        height: 20px;
      }
      .label {
        transition: .25s;
        margin-left: 14px;
        font-size: 14px;
        color: var(--text-color);
      }
    }
  `]
})
export class NavButtonComponent implements OnInit {
  @Input() iconHref = '';
  @Input() label = '';
  @Input() svgClassList?: string;

  constructor() {
  }

  ngOnInit(): void {
  }

}
