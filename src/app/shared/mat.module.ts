import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    MatDialogModule,
  ],
  exports: [
    MatIconModule,
    MatRippleModule,
    MatButtonModule,
    MatDialogModule,
  ]
})
export class MatModule {
}
