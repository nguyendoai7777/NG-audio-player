import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from '@components/sidebar/sidebar.component';
import { MediaControllerComponent } from '@components/media-controller/media-controller.component';
import { DSvgComponent } from '@cell-components/d-svg/d-svg.component';
import { NavButtonComponent } from '@components/sidebar/nav-button/nav-button.component';
import { MatModule } from './shared/mat.module';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '@screens/page-not-found/page-not-found.component';
import { TitleBarComponent } from '@components/title-bar/title-bar.component';
import { SettingComponent } from '@screens/setting/setting.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';

// AoT requires an exported function for factories
const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader => new TranslateHttpLoader(http, './assets/i18n/', '.json');


const routes: Routes = [
  {
    path: '',
    redirectTo: 'my-music',
    pathMatch: 'full'
  },
  {
    path: 'my-music',
    loadChildren: () => import('./screens/my-music/my-music.module').then(m => m.MyMusicModule),
    data: {
      name: 'My Music',
    }
  },
  {
    path: 'recent-play',
    loadChildren: () => import('./screens/recent-play/recent-plays.module').then(m => m.RecentPlaysModule),
    data: {
      name: 'Recent Play',
    }
  },
  {
    path: 'now-playing',
    loadChildren: () => import('./screens/now-playing/now-playing.module').then(m => m.NowPlayingModule),
    data: {
      name: 'Now Playing',
    }
  },
  {
    loadChildren: () => import('./screens/playlists/playlists.module').then(m => m.PlaylistsModule),
    path: 'playlists',
    data: {
      name: 'Play Lists',
    }
  },
  {
    loadChildren: () => import('./screens/playlists/playlists.module').then(m => m.PlaylistsModule),
    path: 'setting',
    data: {
      name: 'Setting',
    }
  },
  {
    path: '**',
    component: PageNotFoundComponent
  },
];

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    MediaControllerComponent,
    DSvgComponent,
    NavButtonComponent,
    TitleBarComponent,
    SettingComponent,
  ],
  imports: [
    MatModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    MatSliderModule,
    RouterModule.forRoot(routes),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [],
  exports: [ ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
