import { SidebarDataProps } from '@interfaces/sidebar-data.interface';
import { ROOT_ROUTES } from '@constants/routes.const';

const [MyMusic, RecentPlay, NowPlay] = ROOT_ROUTES;

export const SIDEBAR_CONST: SidebarDataProps[] = [
  { label: MyMusic.data.name, routerLink: MyMusic.path, iconHref: 'double-notes' },
  { label: RecentPlay.data.name, routerLink: RecentPlay.path, iconHref: 'history' },
  { label: NowPlay.data.name, routerLink: NowPlay.path, iconHref: 'now-playing' }
];

