import {Game, gameInstance} from "./Game.class";

export default class Interface {
  game: Game;
  constructor() {
    this.game = gameInstance;
  }

  public toggleFocusCamera() {
    const camera = this.game.camera;
    camera.switchState();
  }


}
