import * as THREE from 'three';
import {Game, gameInstance} from "../Game.class";
import Sizes from "../utils/sizes";
import {Mesh} from "three";

export default class MouseRaycast {
  game: Game;
  raycaster: THREE.Raycaster;
  pointer: THREE.Vector2;
  sizes: Sizes;
  intersects: THREE.Intersection[];

  constructor() {
    this.game = gameInstance;
    this.sizes = this.game.sizes;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    window.addEventListener('mousemove', this.pointerMove.bind(this));
    window.addEventListener('mousedown', this.pointerDown.bind(this));
  }

  pointerMove(event: MouseEvent) {
    this.pointer.x = (event.clientX / this.sizes.width) * 2 - 1;
    this.pointer.y = -(event.clientY / this.sizes.height) * 2 + 1;
  }

  pointerDown(event: MouseEvent) {
    this.pointerMove(event);
    const intersectionObj = this.intersects[0];
    if (this.intersects.length > 0 && intersectionObj.object.name.includes('ball')) {
      const intersectionID = intersectionObj.object.id;
      this.game.world.ballsArray.find(ball => ball.mesh.id === intersectionID).applyForce(intersectionObj.face);
    }
  }

  update() {
    if (!this.game.mouseRaycaster) return;
    this.raycaster.setFromCamera(this.pointer, this.game.camera.camera);
    this.intersects = this.raycaster.intersectObject(this.game.scene, true);

    // color intersected Button green
    if (this.intersects.length > 0 && this.intersects[0].object.name === 'ball') {
      const intersectionObject = this.intersects[0].object as Mesh;
      // @ts-ignore
      intersectionObject.material.color.set(0x00ff00);
    }
  }
}
