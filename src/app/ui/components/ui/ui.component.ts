import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import GameState from 'src/app/interfaces/Gamestate';
import { Player } from 'src/app/interfaces/Player';
import { GameService } from 'src/app/services/game.service';
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

  @Input() game: GameState | null = null;

  private subscriptions: Subscription = new Subscription();

  constructor(private uiService: UiService, private gameService: GameService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.uiService.uiVisibility$.subscribe((showUi) => {
        this.showUi = showUi;
      })
    );

    this.subscriptions.add(
      this.gameService.game$.subscribe(game => {
        this.game = game;

        this.updateCssVariables(this.game);

        console.log('game update:', this.game);
      })
    );
  }

  private updateCssVariables(game: GameState): void {
    // update match stats background color
    const activePlayerColor = getComputedStyle(document.documentElement).getPropertyValue('--activePlayerColor');

    if(game.activePlayer) {
      document.documentElement.style.setProperty('--activePlayerColor', game.activePlayer.color || 'deeppink');
      document.documentElement.style.setProperty('--player-color-1', game.players[0].color || 'deeppink');
      document.documentElement.style.setProperty('--player-color-2', game.players[1].color || 'deeppink');
    }

  }

  public newGame(event: Event): void {
    console.log('start new game');
  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
