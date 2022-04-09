import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  private uiVisibility$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public uiVisibility$: Observable<boolean> = this.uiVisibility$$.asObservable();

  constructor() { }

  public showUi(): void {
    this.uiVisibility$$.next(true);
  }

  public hideUi(): void {
    this.uiVisibility$$.next(false);
  }
}
