import { CustomRoute } from '@interfaces/routes.interface';

export const ROOT_ROUTES: CustomRoute[] = [
  {
    name: 'MyMusic',
    path: 'my-music',
    loadChildren: () => import('../../screens/my-music/my-music.module').then(m => m.MyMusicModule),
    data: {
      name: 'My Music',
    }
  },
  {
    name: 'RecentPlay',
    path: 'recent-play',
    loadChildren: () => import('../../screens/recent-play/recent-plays.module').then(m => m.RecentPlaysModule),
    data: {
      name: 'Recent Play',
    }
  },
  {
    name: 'NowPlay',
    path: 'now-playing',
    loadChildren: () => import('../../screens/now-playing/now-playing.module').then(m => m.NowPlayingModule),
    data: {
      name: 'Now Playing',
    }
  },
  {
    name: 'Playlists',
    loadChildren: () => import('../../screens/playlists/playlists.module').then(m => m.PlaylistsModule),
    path: 'playlists',
    data: {
      name: 'Play Lists',
    }
  },
  {
    name: 'Setting',
    loadChildren: () => import('../../screens/playlists/playlists.module').then(m => m.PlaylistsModule),
    path: 'setting',
    data: {
      name: 'Setting',
    }
  }
];
