import {Game, gameInstance} from '../Game.class'
import Environment from './Environment.class'
import Resources from "../utils/resources.class";
import Table from "./Table.class";
import {Ball, Playball} from "./Ball.class";
import Physics from "./Physics.class";

export default class World
{
  game: Game;
  scene: THREE.Scene;
  physicsWorld: Physics;
  resources: Resources;
  isLoaded: boolean;

  // Objects
  floor;
  table: Table;
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
    if (this.isLoaded && !this.game.gameState.isPaused)
    {
      // Update Physics calculations FIRST
      this.physicsWorld.update();
      this.ballsArray.forEach((ball) =>
      {
        ball.update();
      });
    }
  }

  respawnBallsRandomly() {
    this.ballsArray.forEach((ball) =>
    {
      ball.respawnRandomly();
    });
  }

  setupBallgame() {

    const sizeRef = this.table.size;
    const ballSize = 0.09;
    const offset = 0.1;

    const calcOffsetForRow = (rowOffset: number) => {
      return rowOffset * (ballSize + offset / 1.5);
    };

    const calcOffsetForColumn = (columnOffset: number) => {
      return columnOffset * (ballSize / 2 + offset / 2);
    };

    const ballGamePositionMap: {x: number, z: number}[] =
      [
        {x: sizeRef.x / 2, z: 0},
        {x: -sizeRef.x / 2 + calcOffsetForRow(2), z: calcOffsetForColumn(0)},
        {x: -sizeRef.x / 2 + calcOffsetForRow(1), z: calcOffsetForColumn(1)},
        {x: -sizeRef.x / 2 + calcOffsetForRow(1), z: calcOffsetForColumn(- 1)},
        {x: -sizeRef.x / 2 + calcOffsetForRow(0), z: calcOffsetForColumn(2)},
        {x: -sizeRef.x / 2 + calcOffsetForRow(0), z: calcOffsetForColumn(0)},
        {x: -sizeRef.x / 2 + calcOffsetForRow(0), z: calcOffsetForColumn(-2)},
        {x: -sizeRef.x / 2 + calcOffsetForRow(-1), z: calcOffsetForColumn(1)},
        {x: -sizeRef.x / 2 + calcOffsetForRow(-1), z: calcOffsetForColumn(-1)},
        {x: -sizeRef.x / 2 + calcOffsetForRow(-1), z: calcOffsetForColumn(3)},
        {x: -sizeRef.x / 2 + calcOffsetForRow(-1), z: calcOffsetForColumn(-3)},
        {x: -sizeRef.x / 2 + calcOffsetForRow(-2), z: calcOffsetForColumn(0)},
        {x: -sizeRef.x / 2 + calcOffsetForRow(-2), z: calcOffsetForColumn(2)},
        {x: -sizeRef.x / 2 + calcOffsetForRow(-2), z: calcOffsetForColumn(-2)},
        {x: -sizeRef.x / 2 + calcOffsetForRow(-2), z: calcOffsetForColumn(4)},
        {x: -sizeRef.x / 2 + calcOffsetForRow(-2), z: calcOffsetForColumn(-4)},
      ];

    // debug stuff
    while (ballGamePositionMap.length < this.ballsArray.length) {
      ballGamePositionMap.push({x: 10, z: 10});
    }

    this.ballsArray.forEach((ball, index) =>
    {
      const ballGamePosition = ballGamePositionMap[index];
      ball.spawn(ballGamePosition.x, this.table.size.y + 0.001, ballGamePosition.z);
    });
  }

}
