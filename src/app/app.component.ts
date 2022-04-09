import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ThreejsSceneComponent } from './components/threejs-scene/threejs-scene.component';
import { GameService } from './services/game.service';
import { UiService } from './ui/services/ui.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit{
  title = 'angular-threejs';
  @ViewChild('threeJSAPP') threeJSAPP: ThreejsSceneComponent;

  public showUi: boolean = true;

  constructor(public uiService: UiService, public gameService: GameService) {
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.uiService.showUi();
    }, 0);
  }

  temp() {
  }

}
