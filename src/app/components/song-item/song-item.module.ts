import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongItemComponent } from './song-item.component';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  declarations: [SongItemComponent],
  imports: [CommonModule, MatRippleModule],
  exports: [SongItemComponent]
}) export class SongItemModule {}
