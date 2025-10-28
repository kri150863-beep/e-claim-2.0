import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventBusService {
  private loadingSource = new Subject<boolean>();
  loading$ = this.loadingSource.asObservable();

  setLoading(loading: boolean) {
    this.loadingSource.next(loading);
  }
}
