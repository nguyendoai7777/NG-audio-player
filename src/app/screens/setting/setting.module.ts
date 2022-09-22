import { NgModule } from '@angular/core';
import { SettingComponent } from './setting.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SettingComponent],
  imports: [RouterModule.forChild([
    { path: '', component: SettingComponent }
  ])]
})
export class SettingModule {}
