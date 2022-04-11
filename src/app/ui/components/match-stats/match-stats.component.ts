import { Component, Input, OnInit } from '@angular/core';
import { Player } from 'src/app/interfaces/Player';

@Component({
  selector: 'app-match-stats',
  templateUrl: './match-stats.component.html',
  styleUrls: ['./match-stats.component.scss']
})
export class MatchStatsComponent implements OnInit {

  @Input() players: Player[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
