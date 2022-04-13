import * as THREE from 'three';

import Camera from './Camera.class';
import Sizes from "./utils/sizes";
import Time from "./utils/time.class";
import Renderer from "./renderer.class";
import Debug from "./utils/Debugger.class";
import Resources from "./utils/resources.class";
import sources from "./sources";
import World from "./World/World.class";
import MouseRaycast from "./World/MouseRaycast.class";
import Interface from './Interface.class';
import GameState from 'src/app/interfaces/Gamestate';
import {Playball} from "./World/Ball.class";
import {Vector3} from "three";

export let gameInstance: Game;

export class Game {
  private static _instance: Game;
  public sizes: Sizes;
  public camera: Camera;
  public time: Time;
  public scene: THREE.Scene = new THREE.Scene();
  public canvas: HTMLCanvasElement;
  public renderer: Renderer;
  public resources: Resources;
  public world: World;
  public mouseRaycaster: MouseRaycast;
  public debug: Debug;

  public gameState: GameState;
  public interface: Interface;

  private constructor(canvas: HTMLCanvasElement = undefined) {
    this.canvas = canvas;
  }

  public init() {
    this.interface = new Interface();

    this.debug = new Debug();
    this.sizes = new Sizes();
    this.camera = new Camera();
    this.time = new Time();
    this.renderer = new Renderer();
    this.resources = new Resources(sources);
    this.world = new World();
    this.mouseRaycaster = new MouseRaycast();

    this.time.on('tick' , () => {
      this.update();
    });

    this.sizes.on('resize', () => {
      this.resize();
    });
  }

  resize() {
    this.sizes.updateSizes();
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.world.update();
    this.mouseRaycaster.update();
    this.renderer.update();
  }

  destroy()
  {
    this.sizes.off('resize')
    this.time.off('tick')

    // Traverse the whole scene
    this.scene.traverse((child) =>
    {
      // Test if it's a mesh
      if(child instanceof THREE.Mesh)
      {
        child.geometry.dispose()

        // Loop through the material properties
        for(const key in child.material)
        {
          const value = child.material[key]

          // Test if there is a dispose function
          if(value && typeof value.dispose === 'function')
          {
            value.dispose()
          }
        }
      }
    })

    this.camera.controls.dispose()
    this.renderer.instance.dispose()

    if(this.debug.active)
      this.debug.ui.destroy()
  }

  public static getInstance(canvas: HTMLCanvasElement = undefined):Game
  {
    if (!Game._instance) {
      gameInstance= new Game(canvas);
    }
    return gameInstance;
  }

  goForShot() {
    this.mouseRaycaster.record = true;
  }

  shoot(intensity: number) {
    const intersection = this.mouseRaycaster.recordedPosition;
    if(!intersection) return;
    const playBall = this.world.ballsArray[0] as Playball;
    const direction = new THREE.Vector3();
    direction.subVectors(intersection.point, playBall.mesh.getWorldPosition(direction));
    direction.normalize();
    playBall.applyForce(intersection.point, direction , intensity);

    this.mouseRaycaster.resetShotPosition();
  }
}
