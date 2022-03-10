import {Game, gameInstance} from '../Game.class'
import Environment from './Environment.class'
import Resources from "../utils/resources.class";
import Table from "./Table.class";

export default class World
{
  game: Game;
  scene: THREE.Scene;
  resources: Resources;

  floor;
  table;
  environment: Environment;

  constructor()
  {
    this.game = gameInstance;
    this.scene = this.game.scene
    this.resources = this.game.resources

    // Wait for resources
    this.resources.on('ready', () =>
    {
      // Setup
      this.environment = new Environment();
      this.table = new Table();
    })
  }

  update()
  {
  }
}
