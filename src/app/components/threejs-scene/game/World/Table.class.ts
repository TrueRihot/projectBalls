import * as THREE from 'three';
import * as CANNON from "cannon";

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
    console.log(this.model);

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
      x: 2.1,
      y: 2.02,
      z: 1
    }

    const tableShape = new CANNON.Box(new CANNON.Vec3(size.x, size.y, size.z));
    // const temp = new THREE.Mesh(
    //   new THREE.BoxGeometry(size.x * 2, size.y * 2 , size.z * 2),
    //   new THREE.MeshBasicMaterial({color: 0xffffff})
    // );
    // this.scene.add(temp);
    const tableBody = new CANNON.Body();
    tableBody.mass = 0;
    tableBody.position.set(0,0,0);
    tableBody.addShape(tableShape);
    this.physics.physicsWorld.addBody(tableBody);
    console.log(tableBody)
  };

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
