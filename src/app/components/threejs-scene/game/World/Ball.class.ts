import * as THREE from 'three';
import * as CANNON from "cannon";
import {Game, gameInstance} from "../Game.class";
import Physics from "./Physics.class";
import Table from './Table.class';

export class Ball {
  game: Game;
  scene: THREE.Scene;
  physicsWorld: Physics;
  debugPosition: { x: number, y: number, z: number };
  table: Table;

  mesh: THREE.Mesh;
  name: string = 'ball';
  shadow: THREE.Mesh;
  body: CANNON.Body;
  number: number;

  constructor(number: number = -1) {
    this.game = gameInstance;
    this.scene = this.game.scene;
    this.physicsWorld = this.game.world.physicsWorld;
    this.number = number;
    this.table = this.game.world.table;

    this.debugPosition = {
      x: Math.random() * 2 - 1,
      y: Math.random() * 1,
      z: Math.random() * 2 - 1
    }

    this.setModel();
    this.setShadow();
    this.setPhysics();
  }
  private setModel() {
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 128, 128),
      new THREE.MeshStandardMaterial({
        envMap: this.game.world.environment.environmentMap,
        metalness: 0.3,
        roughness: 0.1,
        map: this.game.resources.getBallTexutre(this.number),
      })
    );
    this.mesh.position.set(0, 2, 0);
    this.mesh.castShadow = false;
    this.mesh.receiveShadow = false;
    this.mesh.name = this.name + this.number;
    this.scene.add(this.mesh);
  }

  private setShadow () {
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(.2,.2),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: this.game.resources.items.roundAlpha,
        opacity: 0.5
      })
    );
    shadow.rotateX(-Math.PI / 2);
    this.shadow = shadow;
    this.scene.add(this.shadow);
  }

  private setPhysics() {
    const shape = new CANNON.Sphere(0.09);
    this.body = new CANNON.Body({
      mass: 1,
      material: this.physicsWorld.ballMaterial,
      position: new CANNON.Vec3(this.debugPosition.x ,2,this.debugPosition.z),
      shape,
      linearDamping: 0.2,
      angularDamping: 0.2,
      sleepTimeLimit: 50,
    });
    this.physicsWorld.physicsWorld.addBody(this.body);
    this.body.position.set(this.debugPosition.x, 2, this.debugPosition.z);
  }

  update() {
    // as any because vec3 == Vector3
    this.mesh.position.copy(this.body.position as any);
    this.mesh.quaternion.copy(this.body.quaternion as any);
    const meshPosition = this.mesh.position;
    // Shadow Update
    this.shadow.position.set(meshPosition.x, this.table.size.y + .01 , meshPosition.z);
    // @ts-ignore Dont know why this is needed
    this.mesh.material.color.set('#ffffff');
  }

  respawnRandomly() {
    this.debugPosition = {
      x: Math.random() * 2 - 1,
      y: Math.random() * 1 + 2,
      z: Math.random() * 2 - 1
    }
    this.spawn(this.debugPosition.x, this.debugPosition.y, this.debugPosition.z);
  }

  spawn(x: number, y: number, z: number) {
    this.body.position.set(x, y, z);
    this.body.sleepState = CANNON.Body.AWAKE;
  }
}


export class Playball extends Ball {
  constructor() {
    super(-1);
    this.name = 'playball';
    this.mesh.name = this.name;
  }

  applyForce(face: THREE.Face = undefined) {
    const direction = face ? face.normal.clone().normalize().multiply(new THREE.Vector3(-1))  : new THREE.Vector3(0) //new THREE.Vector3(Math.random() * 100 -50, 0, Math.random() * 100 - 50).normalize();
    let force = new CANNON.Vec3(direction.x, direction.y, direction.z);
    force = force.scale(5);
    this.body.sleepState = CANNON.Body.AWAKE;
    this.body.applyLocalForce(force, this.body.position);
  }
}
