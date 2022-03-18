import * as THREE from 'three';
import * as CANNON from "cannon";
import {Game, gameInstance} from "../Game.class";
import Physics from "./Physics.class";

export class Ball {
  game: Game;
  scene: THREE.Scene;
  physicsWorld: Physics;
  debugPosition: { x: number, y: number, z: number };

  mesh: THREE.Mesh;
  body: CANNON.Body;

  constructor() {
    this.game = gameInstance;
    this.scene = this.game.scene;
    this.physicsWorld = this.game.world.physicsWorld;

    this.debugPosition = {
      x: Math.random() * 2 - 1,
      y: Math.random() * 1,
      z: Math.random() * 2 - 1
    }

    this.setModel();
    this.setPhysics();
  }
  private setModel() {
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 32, 32),
      new THREE.MeshStandardMaterial({
        envMap: this.game.world.environment.environmentMap,
        metalness: 0.3,
        roughness: 0.4,
      })
    );
    this.mesh.position.set(0, 2, 0);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.name = "ball";
    this.scene.add(this.mesh);
  }

  private setPhysics() {
    const shape = new CANNON.Sphere(0.1);
    this.body = new CANNON.Body({
      mass: 1,
      material: this.physicsWorld.ballMaterial,
      position: new CANNON.Vec3(this.debugPosition.x ,2,this.debugPosition.z),
      shape,
      linearDamping: 0.1,
      angularDamping: 0.1,
    });
    this.body.position.set(this.debugPosition.x, 2, this.debugPosition.z);
    this.physicsWorld.physicsWorld.addBody(this.body);
  }

  update() {
    // as any because vec3 == Vector3
    this.mesh.position.copy(this.body.position as any);
    this.mesh.quaternion.copy(this.body.quaternion as any);
    // @ts-ignore Dont know why this is needed
    this.mesh.material.color.set('#ffffff');
  }

  applyForce() {
    this.body.sleepState = CANNON.Body.AWAKE;
    this.body.applyLocalForce(new CANNON.Vec3(Math.random() * 100 -50, 0, Math.random() * 100 - 50), new CANNON.Vec3(0, 0, 0));
  }
}
