import { Injectable } from '@angular/core';
import { filter, map, of, takeUntil } from 'rxjs';
import { ActivationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  routeData$ = this.router.events.pipe(
    filter(x => x instanceof ActivationEnd),
    map((x: ActivationEnd) => x.snapshot.data.name),
  );

  constructor(private readonly router: Router,) {}
}
