import { Route } from '@angular/router';
type RouteData = {
  name: string;
  data: {
    name: string;
  };
}

export type CustomRoute = Route & RouteData;

