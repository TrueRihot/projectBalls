import { Component, Input, OnInit } from '@angular/core';
import GameState from 'src/app/interfaces/Gamestate';
import { Player } from 'src/app/interfaces/Player';

@Component({
  selector: 'app-match-stats',
  templateUrl: './match-stats.component.html',
  styleUrls: ['./match-stats.component.scss']
})
export class MatchStatsComponent implements OnInit {

  @Input() game: GameState | null = null;

  @Input() players: Player[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
