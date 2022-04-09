import {AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import GameState from 'src/app/interfaces/Gamestate';
import {Game} from "./game/Game.class";
import Interface from './game/Interface.class';

@Component({
  selector: 'app-threejs-scene',
  templateUrl: './threejs-scene.component.html',
  styleUrls: ['./threejs-scene.component.scss'],
})
export class ThreejsSceneComponent implements OnInit, AfterViewInit, OnDestroy {
  private game: Game | undefined;
  public interface: Interface;
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  @Output() gameStateChanged: EventEmitter<GameState> = new EventEmitter();

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  ngAfterViewInit() {
    this.game = Game.getInstance(this.canvasRef.nativeElement);
    this.game.init();
    // this is the entrypoint from outside of the THREE Scene
    // These functions can be called from the outside
    this.interface = this.game.interface;

    // Getting Gamestate Changes from Inside THREE.js
    // This should probably get hooked up to a Service to communicate with the UI
    this.game.interface._StateChanged.subscribe(gameState => {
      this.gameStateChanged.emit(gameState);
      console.log('gameState changed', gameState);
    })
  }
}
