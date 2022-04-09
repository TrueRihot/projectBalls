import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerStatsComponent } from './components/player-stats/player-stats.component';
import { UiComponent } from './components/ui/ui.component';
import { MatchStatsComponent } from './components/match-stats/match-stats.component';
import { UiService } from './services/ui.service';



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
    UiComponent
  ],
  providers: [
    UiService
  ]
})
export class UiModule { }
