import * as THREE from 'three';

import {Game, gameInstance} from './Game.class';
import Sizes from "./utils/sizes";

export default class Camera {
  private camera: THREE.PerspectiveCamera;
  private game: Game | undefined;
  private sizes: Sizes | undefined;

  constructor() {
    this.game = gameInstance;
    this.sizes = this.game.sizes;
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  }
}
