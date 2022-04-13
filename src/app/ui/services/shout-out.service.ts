import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Shout } from '../interfaces/Shout';

@Injectable({
  providedIn: 'root'
})
export class ShoutOutService {

  private shoutOut$$: Subject<Shout> = new Subject<Shout>();
  public shoutOut$: Observable<Shout> = this.shoutOut$$.asObservable();

  constructor() { }


  public shout(text: string): void {
    this.shoutOut$$.next(
      {
        text,
        introDuration: 2,
        outroDuration: .5,
        pauseDuration: 1
      }
    );
  }
}
