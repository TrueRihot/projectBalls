import * as THREE from 'three';
import {Game, gameInstance} from "../Game.class";
import Sizes from "../utils/sizes";
import {Intersection, Object3D} from "three";

export default class MouseRaycast {
  game: Game;
  raycaster: THREE.Raycaster;
  pointer: THREE.Vector2;
  sizes: Sizes;
  intersects: THREE.Intersection[];

  intersectionPointer : intersectionBall;
  record: boolean = true;
  recordedPosition: Intersection<Object3D>;
  private _playBallIntersection: Intersection<Object3D>;

  constructor() {
    this.game = gameInstance;
    this.sizes = this.game.sizes;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.intersectionPointer = new intersectionBall();
    window.addEventListener('mousemove', this.pointerMove.bind(this));
    window.addEventListener('mousedown', this.pointerDown.bind(this));
  }

  pointerMove(event: MouseEvent) {
    this.pointer.x = (event.clientX / this.sizes.width) * 2 - 1;
    this.pointer.y = -(event.clientY / this.sizes.height) * 2 + 1;
  }

  pointerDown(event: MouseEvent) {
    this.pointerMove(event);
    if (this.record === true) this.saveCurrentShotPosition();
  }

  private saveCurrentShotPosition() {
    if(!this.intersects.length || !this._playBallIntersection) return;
    this.recordedPosition = this._playBallIntersection;
  }

  resetShotPosition() {
    this.recordedPosition = null;
  }

  resetRecordingState() {
    this.record = false;
  }

  update() {
    if (!this.game.mouseRaycaster) return;

    this.raycaster.setFromCamera(this.pointer, this.game.camera.camera);
    this.intersects = this.raycaster.intersectObject(this.game.scene, true);

    // color intersected Button green
    if (this.intersects.length > 0) {
      //const intersectionObject = this.intersects[0].object as Mesh;
      // @ts-ignore
      //intersectionObject.material.color.set(0x00ff00);
      // This loop gets the first ball infront of the raycaster and uses the intersectionBall to show the intersected point
      for(let i = 0; i < this.intersects.length; i++) {
        if(i > 2) break;
        const intersectsObj = this.intersects[i];
        if(intersectsObj.object.name.includes('playball')) {
          this._playBallIntersection = intersectsObj;
          this.intersectionPointer.setPosition(intersectsObj.point);
          !this.intersectionPointer.isInScene ? this.intersectionPointer.toggleInScene() : null;
          return;
        }
      }
    }

    this._playBallIntersection = null;

    if (this.recordedPosition) {
      !this.intersectionPointer.isInScene ? this.intersectionPointer.toggleInScene() : null;
      this.intersectionPointer.setPosition(this.recordedPosition.point);
      return;
    }
    this.intersectionPointer.isInScene && !this.recordedPosition ? this.intersectionPointer.toggleInScene() : null;
  }
}


class intersectionBall {
  game: Game;
  isInScene: boolean;

  mesh: THREE.Mesh;
  size : number;

  constructor() {
    this.game = gameInstance;
    this.isInScene = false;
    this.size = 0.02;
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(this.size, 32, 32),
      new THREE.MeshBasicMaterial({color: 0xff0000})
    );
  }

  toggleInScene() {
    this.isInScene = !this.isInScene;
    if (this.isInScene) {
      this.game.scene.add(this.mesh);
    } else {
      this.game.scene.remove(this.mesh);
    }
  }

  setPosition(vec: THREE.Vector3) {
    this.mesh.position.set(vec.x, vec.y, vec.z);
  }
}
