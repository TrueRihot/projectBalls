import * as CANNON from "cannon";
import Time from "../utils/time.class";
import {gameInstance} from "../Game.class";

export default class Physics {
  time: Time;

  physicsWorld: CANNON.World;
  defaultMaterial: CANNON.Material;

  constructor() {
    this.time = gameInstance.time;
    // Create a world with gravity
    this.physicsWorld = new CANNON.World();
    this.physicsWorld.broadphase = new CANNON.SAPBroadphase(this.physicsWorld);
    // allows bodies to be skipped when not moving
    //this.physicsWorld.allowSleep = true;
    // Basic earth gravity -- Play around to see funny results
    this.physicsWorld.gravity.set(0, -9.82, 0);

    // getting a Default Contact Material for the world
    this.defaultMaterial = new CANNON.Material('default');
    const defaultContactMaterial = new CANNON.ContactMaterial(
      this.defaultMaterial,
      this.defaultMaterial,
      {
        friction: 0.1,
        restitution: .3,
      }
    );
    this.physicsWorld.addContactMaterial(defaultContactMaterial);
    this.physicsWorld.defaultContactMaterial = defaultContactMaterial;
  }

  update() {
    this.physicsWorld.step(1/60 , this.time.delta, 3);
  }
}
