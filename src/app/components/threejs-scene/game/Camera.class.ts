import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import {Game, gameInstance} from './Game.class';
import Sizes from "./utils/sizes";
import Debug from "./utils/Debugger.class";

export default class Camera {
  public camera: THREE.PerspectiveCamera;
  private game: Game;
  private sizes: Sizes;
  private canvas: HTMLCanvasElement;
  private scene: THREE.Scene;

  public controls: OrbitControls;
  private debug: Debug;
  private debugFolder : any;

  constructor() {
    this.game = gameInstance;
    this.sizes = this.game.sizes;
    this.canvas = this.game.canvas;
    this.scene = this.game.scene;
    this.debug = this.game.debug;

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
      this.controls.maxDistance = 10;
      this.controls.minDistance = 3.1;
      this.controls.maxPolarAngle = 1.16;
      this.controls.minPolarAngle = 0.73;
      this.controls.target.set(0, 2, 0);
      this.controls.enablePan = false;
      this.controls.saveState();
      if (this.debug.active){
        this.addControlDebug();
      }
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

  addControlDebug() {
    this.debugFolder = this.debug.ui.addFolder('Camera');
    this.debugFolder.add(this.camera.position, 'x').listen();
    this.debugFolder.add(this.camera.position, 'y').listen();
    this.debugFolder.add(this.camera.position, 'z').listen();

    const controlFolder = this.debugFolder.addFolder('Controls');
    controlFolder.add(this.controls, 'enableDamping');
    controlFolder.add(this.controls, 'enablePan');
    controlFolder.add(this.controls, 'dampingFactor', 0, 1);
    controlFolder.add(this.controls, 'maxDistance', 0, 10).step(0.1);
    controlFolder.add(this.controls, 'minDistance', 0, 10).step(0.1);
    controlFolder.add(this.controls, 'maxPolarAngle', 0, Math.PI / 2).step(0.01);
    controlFolder.add(this.controls, 'minPolarAngle', 0, Math.PI / 2).step(0.01);
    controlFolder.add(this.controls, 'reset');
  }

}
