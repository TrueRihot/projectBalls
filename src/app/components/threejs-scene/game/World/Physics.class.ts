import * as CANNON from "cannon";
import Time from "../utils/time.class";
import {Game, gameInstance} from "../Game.class";

export default class Physics {
  time: Time;
  game: Game;

  physicsWorld: CANNON.World;
  defaultMaterial: CANNON.Material;

  tableMaterial: CANNON.Material;
  ballMaterial: CANNON.Material;
  tableBallMaterial: CANNON.ContactMaterial;

  constructor() {
    this.game = gameInstance;;
    this.time = gameInstance.time;
    // Create a world with gravity
    this.physicsWorld = new CANNON.World();
    this.physicsWorld.broadphase = new CANNON.SAPBroadphase(this.physicsWorld);
    // allows bodies to be skipped when not moving
    this.physicsWorld.allowSleep = true;
    // Basic earth gravity -- Play around to see funny results
    this.physicsWorld.gravity.set(0, -9.82, 0);

    // getting a Default Contact Material for the world
    this.defaultMaterial = new CANNON.Material('default');
    const defaultContactMaterial = new CANNON.ContactMaterial(
      this.defaultMaterial,
      this.defaultMaterial,
      {
        friction: 0.1,
        restitution: .7,
      }
    );
    this.physicsWorld.addContactMaterial(defaultContactMaterial);
    this.physicsWorld.defaultContactMaterial = defaultContactMaterial;

    // Instanciateing Table Material
    this.tableMaterial = new CANNON.Material('table');
    this.ballMaterial = new CANNON.Material('ball');

    // Instanciateing Table Ball Material
    this.tableBallMaterial = new CANNON.ContactMaterial(
      this.ballMaterial,
      this.tableMaterial,
      {
        // Doesn't need friction since balls are not affected by it.
        // If you want to alter the slowdown effect of the balls, goto the Ball.class.ts and tweak linear and angular damping
        restitution: .8,
      }
    );
    this.physicsWorld.addContactMaterial(this.tableBallMaterial);

  };


  update() {
    this.physicsWorld.step(1/60 , this.time.delta, 3);
  }
}
