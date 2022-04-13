import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';
import { ThreejsSceneComponent } from './components/threejs-scene/threejs-scene.component';
import GameState from './interfaces/Gamestate';
import { GameService } from './services/game.service';
import { ShoutOutService } from './ui/services/shout-out.service';
import { UiService } from './ui/services/ui.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit{
  title = 'angular-threejs';
  @ViewChild('threeJSAPP') threeJSAPP: ThreejsSceneComponent;

  public game: GameState;
  public showUi: boolean = true;

  constructor(public uiService: UiService, public gameService: GameService, private shoutOutService: ShoutOutService) {
  }
  ngAfterViewInit(): void {
    this.gameService.game$.pipe(take(1)).subscribe(game => {
      // initially add players to match
      this.gameService.updateGame({...game, players: this.gameService.players})
      this.game = game;
    });

    setTimeout(() => {
      this.uiService.showUi();
      this.gameService.updateGame({activePlayerId: '1'});
    }, 0);

  }

  temp() {
  }

  public get activePlayerName(): string {
    return '[active player name]';
  }

  // update
  public setPlayer(playerId: string): void {
    this.gameService.updateGame({
      activePlayerId: playerId,
    })
  }

  public shoutOut(txt: string): void {
    this.shoutOutService.shout(txt);
  }
}
