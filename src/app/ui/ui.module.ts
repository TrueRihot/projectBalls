import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerStatsComponent } from './components/player-stats/player-stats.component';
import { UiComponent } from './components/ui/ui.component';
import { MatchStatsComponent } from './components/match-stats/match-stats.component';
import { UiService } from './services/ui.service';
import { GameService } from '../services/game.service';



@NgModule({
  declarations: [
    UiComponent,
    PlayerStatsComponent,
    MatchStatsComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    UiComponent,
    // Player
  ],
  providers: [
    UiService,
    GameService
  ]
})
export class UiModule { }
