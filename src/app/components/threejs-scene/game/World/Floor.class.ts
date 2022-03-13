import * as THREE from 'three';
import {Game, gameInstance} from "../Game.class";


export default class Floor {
  mesh: THREE.Mesh;
  game: Game;
  scene: THREE.Scene;

  constructor() {
    this.game = gameInstance;
    this.scene = this.game.scene;

    this.createMesh();
    this.createPhysics();
  }

  private createMesh() {
    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: this.game.world.environment.environmentMap,
        envMapIntensity: 0.5
      })
    );
    this.mesh.receiveShadow = true;
    this.mesh.rotation.x = - Math.PI * 0.5;
    this.scene.add(this.mesh);
  }

  private createPhysics() {

  }
}
