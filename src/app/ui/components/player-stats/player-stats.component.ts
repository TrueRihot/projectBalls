import { Component, Input, OnInit } from '@angular/core';
import { Player } from 'src/app/interfaces/Player';

@Component({
  selector: 'app-player-stats',
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.scss']
})
export class PlayerStatsComponent implements OnInit {

  @Input() totalMatchCount: number = 0;
  @Input() players: Player[];

  constructor() { }

  ngOnInit(): void {
  }

}
