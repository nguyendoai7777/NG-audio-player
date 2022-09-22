import { NgModule } from '@angular/core';
import { PlaylistsComponent } from './playlists.component';
import { Route, RouterModule } from '@angular/router';

const ROUTES: Route[] = [
  { path: '', component: PlaylistsComponent}
]

@NgModule({
  declarations: [PlaylistsComponent],
  imports: [
    RouterModule.forChild(ROUTES)
  ]
})
export class PlaylistsModule {}
