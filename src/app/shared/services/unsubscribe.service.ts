import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable() export class UnsubscribeService implements OnDestroy {
  unsubscribe$ = new Subject<void>();
  ngOnDestroy() {
    this.unsubscribe$.next();
  }
}
