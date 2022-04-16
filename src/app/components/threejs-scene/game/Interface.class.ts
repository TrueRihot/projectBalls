import { EventEmitter } from "@angular/core";
import GameState from "src/app/interfaces/Gamestate";
import {Game, gameInstance} from "./Game.class";

export default class Interface {
 public _StateChanged: EventEmitter<GameState> = new EventEmitter();
 private game: Game;
 // Those are the default gameState values
 private gameState: GameState = {
    isPaused: false,
    isLoaded: false
 };

  constructor() {
    this.game = gameInstance;
    // Setting inital gamestate yeye
    this.game.gameState = this.gameState;
  }

  // Subscribe to this from outside to recieve stateChanges from inside THREE
  public stateChanged() {
    this._StateChanged.emit(this.gameState);
  }

  // Toggles the Focus of the Camera between global and the white ball
  public toggleFocusCamera() {
    const camera = this.game.camera;
    camera.switchState();
  }

  // Toggles Updates on Phsyics and Renderer
  public togglePauseState() {
    this.gameState.isPaused = !this.gameState.isPaused;
    this.updateGameState();
  }

  public respawnBallsRandomly() {
    this.game.world.respawnBallsRandomly();
  }

  public startUpGame() {
    this.game.world.setupBallgame();
  }

  public goForShot() {
    this.toggleFocusCamera();
    this.game.goForShot();
  }

  public despawnAll(){
    this.game.despawnAll();
  }

  public shoot(intensity: number) {
    this.game.shoot(intensity);
  }

  // This Updates the THREE INTERN gamestate
  // This should be called after the Interface State updated
  private updateGameState() {
    this.game.gameState = this.gameState;
  }
}
