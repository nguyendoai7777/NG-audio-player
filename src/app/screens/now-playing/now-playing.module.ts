import { NgModule } from '@angular/core';
import { NowPlayingComponent } from './now-playing.component';
import { Route, RouterModule } from '@angular/router';

const ROUTES: Route[] = [
  { path: '', component: NowPlayingComponent}
]

@NgModule({
  declarations: [ NowPlayingComponent],
  imports: [ RouterModule.forChild(ROUTES) ]
})
export class NowPlayingModule {}
