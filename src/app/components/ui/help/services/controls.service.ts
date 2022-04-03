import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ControlsService {

  public isTakingAshot = new BehaviorSubject<boolean>(false);
  public switchView() {
    this.isTakingAshot.next(!this.isTakingAshot.value);
  }

  constructor() { }
}
