import {Component, OnDestroy, OnInit} from '@angular/core';
import {fromEvent, Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit, OnDestroy {

  public isHiding: boolean = true;
  private subscriptions: Subscription = new Subscription();

  constructor() {
    console.log('Hit "H" to toggle HELP');
  }

  ngOnInit(): void {
    this.subscriptions.add(
      fromEvent<KeyboardEvent>(document, 'keyup')
        .subscribe((event: KeyboardEvent) => {
          if (event.code === 'KeyH') { // H
            this.isHiding = !this.isHiding;
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
