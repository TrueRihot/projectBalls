import * as THREE from 'three';

import Camera from './Camera.class';
import Sizes from "./utils/sizes";
import Time from "./utils/time.class";

export let gameInstance: Game;

export class Game {
  private static _instance: Game;
  public sizes: Sizes;
  public camera: Camera;
  public time: Time;
  public scene: THREE.Scene = new THREE.Scene();
  public canvas: HTMLCanvasElement ;

  private constructor(canvas: HTMLCanvasElement = undefined) {
    this.canvas = canvas;
  }

  public init() {
    this.camera = new Camera();
    this.sizes = new Sizes();
    this.time = new Time();
  }

  public static getInstance(canvas: HTMLCanvasElement = undefined):Game
  {
    if (!Game._instance) {
      gameInstance= new Game(canvas);
    }
    return gameInstance;
  }
}
