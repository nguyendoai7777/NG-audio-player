import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChangePropertyAccess } from '../../shared/interfaces/changes-properties.interface';

interface DSvgComponentPropsChanges {
  href?: ChangePropertyAccess<boolean>;
  disabled?: ChangePropertyAccess<boolean>;
}

@Component({
  selector: 'icon-button-svg',
  template: `
      <svg class="icon">
        <use [attr.xlink:href]="'#'+ href"></use>
      </svg>
  `,
  styles: [`
  :host {
    width: 50px;
    min-width: 50px;
  }
  `]
})
export class DSvgComponent implements OnChanges {
  @Input() href = '';
  @Input() disabled = false;

  constructor(private elr: ElementRef<HTMLElement>) {
    elr.nativeElement.classList.add('icon-button');
  }

  ngOnChanges(changes: DSvgComponentPropsChanges) {
    if(changes.disabled) {
      if(changes.disabled.currentValue) {
        this.elr.nativeElement.classList.add('nav-icon-btn-disabled');
      } else {
        this.elr.nativeElement.classList.remove('nav-icon-btn-disabled');
      }
    }
  }

}
