import * as THREE from 'three';
import {Game, gameInstance} from "../Game.class";

export class Ball {
  game: Game;
  scene: THREE.Scene;

  mesh: THREE.Mesh;

  constructor() {
    this.game = gameInstance;
    this.scene = this.game.scene;

    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        envMap: this.game.world.environment.environmentMap,
        envMapIntensity: 100,
        metalness: 0,
        roughness: 10,
      })
    );
    this.mesh.position.set(0, 2, 0);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
  }
}
