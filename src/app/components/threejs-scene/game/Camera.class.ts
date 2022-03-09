import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import {Game, gameInstance} from './Game.class';
import Sizes from "./utils/sizes";

export default class Camera {
  public camera: THREE.PerspectiveCamera;
  private game: Game;
  private sizes: Sizes;
  private canvas: HTMLCanvasElement;
  private scene: THREE.Scene;
  private controls: OrbitControls;

  constructor() {
    this.game = gameInstance;
    this.sizes = this.game.sizes;
    this.canvas = this.game.canvas;
    this.scene = this.game.scene;

    this.setInstance();
    this.setControls();
  }

  setInstance()
  {
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.set(6, 4, 8);
      this.scene?.add(this.camera);
  }

  setControls()
  {
      this.controls = new OrbitControls(this.camera as THREE.PerspectiveCamera, this.canvas);
      this.controls.enableDamping = true;
  }

  resize()
  {
      this.camera.aspect = this.sizes.width / this.sizes.height;
      this.camera.updateProjectionMatrix();
  }

  update()
  {
      this.controls.update();
  }

}
