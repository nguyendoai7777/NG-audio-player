import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'import-music-folder',
  template: `
    <svg><use xlink:href="#import-folder"/></svg>
    <div style="margin-left: 7px;">
      <p class="import-title">You can add music by import folder.</p>
      <p class="import-title">Show us where to look for music.</p>
    </div>
  `,
  styles: [`
    :host {
      width: fit-content;
      cursor: pointer;
      display: flex;
      .import-title {
        font-size: 12px;
        &:last-child {
          padding-top: 7px;
          opacity: .4;
        }
      }
      svg {
        opacity: .8;
        width: 23px;
        transform: scale(.7);
        height: 17px;
        fill: var(--icon-fill)
      }
    }
  `]
})
export class ImportMusicFolderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
