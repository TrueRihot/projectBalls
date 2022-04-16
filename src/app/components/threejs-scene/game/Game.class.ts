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
  private debugFolder: any;

  public debugObject = {
    shotMultiplyer: 3
  };

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

    if (this.debug.active) {
      this.initDebug();
    }

  }

  initDebug() {
    this.debugFolder = this.debug.ui.addFolder('Game');
    this.debugFolder.add(this.debugObject, 'shotMultiplyer').name('shotMultiplyer').min(1).max(10).step(.2);
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

  despawnAll() {
    this.world.ballsArray.forEach(ball => {
      ball.despawn();
    });
  }

  shoot(intensity: number) {
    intensity *= this.debugObject.shotMultiplyer;
    // get the recorded Position where the mouse clicked
    const intersection = this.mouseRaycaster.recordedPosition;
    // If there wasn't any recorded position return
    // TODO: we should return an error if there is no intersection since there is no shot to be made
    if(!intersection) return;
    // getting our playball
    const playBall = this.world.ballsArray[0] as Playball;

    // calculating the direction of the shot between the intersected point and the middle of our playball
    const direction = new THREE.Vector3();
    direction.subVectors(intersection.point, playBall.mesh.getWorldPosition(direction));
    // normalize the direction to get consistent shots
    direction.normalize();
    // Lets go and take our shot. (yay)
    playBall.applyForce(intersection.point, direction , intensity);
    // remove the recent recorded position
    this.mouseRaycaster.resetShotPosition();
  }
}
