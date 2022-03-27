import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Player } from '../interfaces/Player';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private players: Player[] = [
    {name: 'Player 1', winCount: 0},
    {name: 'Player 2', winCount: 10},
    {name: 'Player 3', winCount: 54},
    {name: 'Player 4', winCount: 999},
  ];

  private players$$: BehaviorSubject<Player[]> = new BehaviorSubject<Player[]>(this.players);
  public players$: Observable<Player[]> = this.players$$.asObservable();

  public totalMatchCount: number = 123456789;

  constructor() { }


}
