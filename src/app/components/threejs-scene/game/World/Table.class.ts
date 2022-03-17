import * as THREE from 'three';
import * as CANNON from "cannon";
import {Box, Vec3} from "cannon";

import {Game, gameInstance} from '../Game.class';
import Resources from "../utils/resources.class";
import Time from "../utils/time.class";
import Debug from "../utils/Debugger.class";
import Physics from "./Physics.class";

export default class Table
{
  game: Game;
  scene: THREE.Scene;
  physics: Physics;
  resources: Resources;
  time: Time;
  debug: Debug;

  resource: any;
  model: THREE.Object3D;
  animation: any;

  sides: Vec3[];

  debugFolder: any;

  constructor()
  {
    this.game = gameInstance;
    this.scene = this.game.scene;
    this.physics = this.game.world.physicsWorld;
    this.resources = this.game.resources;
    this.time = this.game.time;
    this.debug = this.game.debug;

    // Debug
    if(this.debug.active)
    {
      this.debugFolder = this.debug.ui.addFolder('table')
    }

    // Resource
    this.resource = this.resources.items.tableModel

    this.setModel();
    this.setPhysics();
  }

  setModel()
  {
    this.model = this.resource.scene;
    this.model.scale.set(1, 1, 1);
    this.scene.add(this.model);

    this.model.traverse((child) =>
    {
      if(child instanceof THREE.Mesh)
      {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    })
  };

  setPhysics() {
    const size = {
      x: 2.35,
      y: 2.03,
      z: 1.2
    }
    this.sides = [
      new Vec3(size.x / 2, size.y, size.z + size.x / 10),
      new Vec3(size.x / 2, size.y, -size.z - size.x / 10),
      new Vec3(-size.x / 2, size.y, size.z + size.x / 10),
      new Vec3(-size.x / 2, size.y, -size.z - size.x / 10),
      new Vec3(size.x + size.x / 13, size.y, 0),
      new Vec3(-size.x - size.x / 13, size.y, 0)
    ];

    if (this.debug.active) {
      const temp = new THREE.Mesh(
         new THREE.BoxGeometry(size.x * 2, size.y * 2 , size.z * 2),
         new THREE.MeshBasicMaterial({color: 0xffffff})
      );
      this.scene.add(temp);
    }

    const tableBody = new CANNON.Body();
    const tableShape = new CANNON.Box(new CANNON.Vec3(size.x, size.y, size.z));

    // get boxes for each side of the table
    for (let i = 0; i < this.sides.length; i++) {
      // lets get a physics box for each side
      const side = this.sides[i];
      let box;
      // boxes on the far sides need to get "rotated" hence this if statement
      if (this.sides[i].z === 0 ) {
        box = this.getSideBoundries(size, true);
      } else {
        box = this.getSideBoundries(size);
      }
      // visual representation in debug mode
      if (this.debug.active) {
        const geometry = new THREE.BoxBufferGeometry(box.halfExtents.x * 2, box.halfExtents.y * 2, box.halfExtents.z * 2);
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(side.x, side.y, side.z);
        this.scene.add(cube);
      }
      // add our side to the table
      tableBody.addShape(box ,new Vec3(side.x, side.y, side.z))
    }

    tableBody.mass = 0;
    tableBody.position.set(0,0,0);
    tableBody.addShape(tableShape);
    this.physics.physicsWorld.addBody(tableBody);
  };

  // get size of border box. If far side rotate it
  private setBarrierSize(size, isRotated: boolean = false):Vec3 {
    if (isRotated) {
      return new Vec3(size.x / 10, size.y / 10,  size.x / 2.5);
    }
    return new Vec3(size.x / 2.5, size.y / 10, size.x / 10);
  }

  // box builder for each side of the table
  private getSideBoundries(size , isRotated: boolean = false):Box {
    const barryR = this.setBarrierSize(size, isRotated);
    return new CANNON.Box(new CANNON.Vec3(barryR.x, barryR.y, barryR.z));
  }

  setAnimation()
  {
    this.animation = {}

    // Mixer
    this.animation.mixer = new THREE.AnimationMixer(this.model)

    // Actions
    this.animation.actions = {}

    this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
    this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1])
    this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2])

    this.animation.actions.current = this.animation.actions.idle
    this.animation.actions.current.play()

    // Play the action
    this.animation.play = (name) =>
    {
      const newAction = this.animation.actions[name]
      const oldAction = this.animation.actions.current

      newAction.reset()
      newAction.play()
      newAction.crossFadeFrom(oldAction, 1)

      this.animation.actions.current = newAction
    }

    // Debug
    if(this.debug.active)
    {
      const debugObject = {
        playIdle: () => { this.animation.play('idle') },
        playWalking: () => { this.animation.play('walking') },
        playRunning: () => { this.animation.play('running') }
      }
      this.debugFolder.add(debugObject, 'playIdle')
      this.debugFolder.add(debugObject, 'playWalking')
      this.debugFolder.add(debugObject, 'playRunning')
    }
  }

  update()
  {
    //this.animation.mixer.update(this.time.delta * 0.001)
  }
}
