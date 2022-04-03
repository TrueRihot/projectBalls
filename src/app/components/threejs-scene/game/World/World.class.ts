import {Game, gameInstance} from '../Game.class'
import Environment from './Environment.class'
import Resources from "../utils/resources.class";
import Table from "./Table.class";
import {Ball, Playball} from "./Ball.class";
import Physics from "./Physics.class";
import Floor from "./Floor.class";

export default class World
{
  game: Game;
  scene: THREE.Scene;
  physicsWorld: Physics;
  resources: Resources;
  isLoaded: boolean;

  // Objects
  floor;
  table;
  environment: Environment;
  ballsArray: Ball[] = [];

  constructor()
  {
    this.game = gameInstance;
    this.scene = this.game.scene;
    this.physicsWorld = new Physics();
    this.resources = this.game.resources;

    // Wait for resources
    this.resources.on('ready', () =>
    {
      // Setup
      this.environment = new Environment();
      this.table = new Table();
      //this.floor = new Floor();
      this.createBalls(16);
      this.isLoaded = true;
    });
  }

  createBalls(number: number)
  {
    // Ball 0 is our playball!
    for (let i = 0; i < number; i++)
    {
      i === 0 ? this.ballsArray.push(new Playball()) : this.ballsArray.push(new Ball(i));
    }
  }

  update()
  {
    if (this.isLoaded)
    {
      // Update Physics calculations FIRST
      this.physicsWorld.update();
      this.ballsArray.forEach((ball) =>
      {
        ball.update();
      });
    }
  }
}
