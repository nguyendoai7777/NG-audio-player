import { NgModule } from '@angular/core';
import { RecentPlayComponent } from './recent-play.component';
import { Route, RouterModule } from '@angular/router';

const ROUTES: Route[] = [
  { path: '', component: RecentPlayComponent}
]

@NgModule({
  declarations: [
    RecentPlayComponent
  ],
  imports: [
    RouterModule.forChild(ROUTES)
  ]
})
export class RecentPlaysModule {}
