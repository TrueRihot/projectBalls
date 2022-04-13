import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Game } from '../components/threejs-scene/game/Game.class';
import GameState from '../interfaces/Gamestate';
import { Player } from '../interfaces/Player';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  public players: Player[] = [    // private? public is easy solution
    {
      id: '1',
      name: 'Player 1',
      winCount: 0,
      color: 'red',
      remainingBalls: [],
    },
    {
      id: '2',
      name: 'Player 2',
      winCount: 0,
      color: 'green',
      remainingBalls: [],
    },
    // { name: 'Player 2', winCount: 10 },
    // {name: 'Player 3', winCount: 54},
    // {name: 'Player 4', winCount: 999},
  ];

  private players$$: BehaviorSubject<Player[]> = new BehaviorSubject<Player[]>(
    this.players
  );
  public players$: Observable<Player[]> = this.players$$.asObservable();

  private game: GameState | null = null;
  private game$$: ReplaySubject<GameState> = new ReplaySubject<GameState>();
  public game$: Observable<GameState> = this.game$$.asObservable();

  public totalMatchCount: number = 123456789;

  constructor() {}

  public updateGame(updatedGame: Partial<GameState>): boolean {
    if(!this.game && !(updatedGame as GameState)) {
      console.error('failed to initiate game', this.game, updatedGame);
      return false;
    }
    const newState: GameState = this.updateProperties({...this.game, ...updatedGame})
    this.game = newState;
    this.game$$.next(this.game);
    return true;
  }

  private updateProperties(game: GameState): GameState {
    // update players
    if(game.players && game.players.length > 0 ){
      return {...game, activePlayer: game.players.find(p => p.id === game.activePlayerId)};
    }

    return game;

    // return {...game, activePlayerColor: game.activePlayer.color};
  }

  public updatePlayer(playerUpdate: Partial<Player>): boolean {
    const playerIndex: number = this.players.findIndex(
      (p) => p.id === playerUpdate.id
    );
    if (playerIndex <= 0) {
      return false;
    }
    const player: Player = this.players[playerIndex];
    const updatedPlayer: Player = { ...player, ...playerUpdate };

    this.players[playerIndex] = updatedPlayer;

    // console.log('updated player: ', updatedPlayer);
    this.players$$.next(this.players);

    return true;
  }
}
