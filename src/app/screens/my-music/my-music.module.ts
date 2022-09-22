import { NgModule } from '@angular/core';
import { MyMusicComponent } from './my-music.component';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { SongsComponent } from './screens/songs/songs.component';
import { ArtistsComponent } from './screens/artists/artists.component';
import { AlbumsComponent } from './screens/albums/albums.component';
import { ImportMusicFolderComponent } from './components/import-music-folder/import-music-folder.component';
import { ConfirmImportDialogComponent } from './components/confirm-import-dialog/confirm-import-dialog.component';
import { MatRippleModule } from '@angular/material/core';

const ROUTES: Route[] = [
  {path: '', component: MyMusicComponent}
];

@NgModule({
  declarations: [MyMusicComponent, SongsComponent, ArtistsComponent, AlbumsComponent, ImportMusicFolderComponent, ConfirmImportDialogComponent],
  imports: [
    RouterModule.forChild(ROUTES),
    CommonModule,
    MatTabsModule,
    MatRippleModule
  ]
})
export class MyMusicModule {}
