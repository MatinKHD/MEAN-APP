import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class Unsub implements OnDestroy {
  public unSubscribe$ = new Subject<void>();

  ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }
}
