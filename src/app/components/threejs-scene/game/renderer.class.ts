import * as THREE from 'three'
import {Game, gameInstance} from './Game.class'
import Camera from "./Camera.class";
import Sizes from "./utils/sizes";

export default class Renderer
{
  game: Game;
  canvas: HTMLCanvasElement;
  scene: THREE.Scene;
  camera: Camera;
  sizes: Sizes;

  instance: THREE.WebGLRenderer;

  constructor()
  {
    this.game = gameInstance;
    this.canvas = this.game.canvas;
    this.sizes = this.game.sizes;
    this.scene = this.game.scene;
    this.camera = this.game.camera;

    this.setInstance()
  }

  setInstance()
  {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    })
    this.instance.physicallyCorrectLights = true;
    this.instance.outputEncoding = THREE.sRGBEncoding;
    this.instance.toneMapping = THREE.CineonToneMapping;
    this.instance.toneMappingExposure = 1.75;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
    this.instance.setClearColor('#211d20');
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
  }

  resize()
  {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
  }

  update()
  {
    this.instance.render(this.scene, this.camera.camera);
  }
}
