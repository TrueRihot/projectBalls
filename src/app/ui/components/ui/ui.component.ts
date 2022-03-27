import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Player } from 'src/app/interfaces/Player';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss'],
})
export class UiComponent implements OnInit, OnDestroy {
  @Input() showUi: boolean = false;
  @Input() players: Player[] = [];
  @Input() totalMatchCount: number = 0;

  private subscriptions: Subscription = new Subscription();

  constructor(private uiService: UiService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.uiService.uiVisibility$.subscribe((showUi) => {
        this.showUi = showUi;
      })
    );
  }

  public newGame(event: Event): void {
    console.log('start new game');
  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
