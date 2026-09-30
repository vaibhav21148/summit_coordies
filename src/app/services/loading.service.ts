import { Injectable } from '@angular/core';
import { BehaviorSubject, timer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private splineLoadingSubject = new BehaviorSubject<boolean>(false);
  splineLoading$ = this.splineLoadingSubject.asObservable();

  private cancelShow = new Subject<void>();

  showLoading(delay: number = 300) {
    timer(delay)
      .pipe(takeUntil(this.cancelShow))
      .subscribe(() => this.loadingSubject.next(true));
  }

  hideLoading() {
    this.cancelShow.next(); // Cancel any pending show
    this.loadingSubject.next(false);
  }

  showSplineLoading() {
    this.splineLoadingSubject.next(true);
  }

  hideSplineLoading() {
    this.splineLoadingSubject.next(false);
  }

  // Simple methods for manual control
  show() {
    this.loadingSubject.next(true);
  }

  hide() {
    this.loadingSubject.next(false);
  }
}
