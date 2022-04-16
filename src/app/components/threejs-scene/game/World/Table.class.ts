import * as THREE from 'three';
import * as CANNON from "cannon";
import {Box, Vec3} from "cannon";

import {Game, gameInstance} from '../Game.class';
import Resources from "../utils/resources.class";
import Time from "../utils/time.class";
import Debug from "../utils/Debugger.class";
import Physics from "./Physics.class";
import Sizes from '../utils/sizes';

export default class Table
{
  game: Game;
  scene: THREE.Scene;
  physics: Physics;
  resources: Resources;
  time: Time;
  debug: Debug;

  resource: any;
  model: THREE.Object3D;
  animation: any;
  size;

  sides: Vec3[];
  pockets: Vec3[];

  debugFolder: any;

  constructor()
  {
    this.game = gameInstance;
    this.scene = this.game.scene;
    this.physics = this.game.world.physicsWorld;
    this.resources = this.game.resources;
    this.time = this.game.time;
    this.debug = this.game.debug;
    this.size = {
      x: 2.35,
      y: 2.03,
      z: 1.2
    };

    // Debug
    if(this.debug.active)
    {
      this.debugFolder = this.debug.ui.addFolder('table')
    }

    // Resource
    this.resource = this.resources.items.tableModel

    this.setModel();
    this.setPhysics();

    if (this.debug.active) {
      this.debugFolder.add(this.model.scale, 'x')
      .name('scale')
      .min(0.1)
      .max(10)
      .step(0.0001)
      .onChange(change => {
        console.log(change);
        this.model.scale.set(change, change, change)
      });
    }

  }

  setModel()
  {
    // currently the table consist of more than just the table since the blender scene is exported as one file
    // The lamp model and its lights are also in this file and should be exported as a separate file in the future
    this.model = this.resource.scene;
    this.model.scale.set(.44255, .44255 , .44255  );
    this.scene.add(this.model);
    this.model.traverse((child) =>
    {
      if(child instanceof THREE.Mesh)
      {
        // Table Stuff
        if (child.name.includes('Cube')) {
          child.castShadow = true;
          child.receiveShadow = true;
            // green carpet thingy on top
          if (child.material.name.includes('Green')) {
            child.material.roughness = 2.4
            if(this.debug.active){
              this.debugFolder.add(child.material, 'roughness', 0, 10).name('table green roughness').step(.1);
            }
          }
          // Floor texture stuff
        } else if (child.name.includes('Floor')) {
          child.material.alphaMap = this.resources.items.roundAlpha;
          child.material.transparent = true;
          child.receiveShadow = true;
        } else {
          child.receiveShadow = true;
        }

      }else if (child instanceof THREE.Light) {
        child.intensity = 5;
        child.castShadow = false;;
      }
    })
  };

  setPhysics() {
    // Fixed size of the CURRENT Table
    const size = this.size;

    const modelOffst = .04;

    // getting the 6 sidepannels of our table
    this.sides = [
      new Vec3(size.x / 2 - modelOffst, size.y, size.z + size.x / 10),
      new Vec3(size.x / 2 - modelOffst, size.y, -size.z - size.x / 10),
      new Vec3(-size.x / 2 + modelOffst, size.y, size.z + size.x / 10),
      new Vec3(-size.x / 2 + modelOffst, size.y, -size.z - size.x / 10),
      new Vec3(size.x + size.x / 13, size.y, 0),
      new Vec3(-size.x - size.x / 13, size.y, 0)
    ];
    // Table instance for Physics
    const tableBody = new CANNON.Body();
    // Tweaking the main Table Body with an Offset Cause the corners are round and i dont know how to fix this issue
    const bodyOffset = .1;
    const tableShape = new CANNON.Box(new CANNON.Vec3(size.x - bodyOffset, size.y, size.z - bodyOffset));

      // Debugging the Main TableBody in the TRHEE SCENE
      if (this.debug.active) {
        const temp = new THREE.Mesh(
           new THREE.BoxGeometry(size.x * 2 - bodyOffset, size.y * 2 , size.z * 2 - bodyOffset),
           new THREE.MeshBasicMaterial({color: 0xffffff})
        );
        this.scene.add(temp);
      };

    // get boxes for each side of the table
    for (let i = 0; i < this.sides.length; i++) {
      // lets get a physics box for each side
      const side = this.sides[i];
      let box;
      // boxes on the far sides need to get "rotated" hence this if statement
      if (this.sides[i].z === 0 ) {
        box = this.getSideBoundries(size, true);
      } else {
        box = this.getSideBoundries(size);
      }
      // visual representation in debug mode
      if (this.debug.active) {
        const geometry = new THREE.BoxBufferGeometry(box.halfExtents.x * 2, box.halfExtents.y * 2, box.halfExtents.z * 2);
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(side.x, side.y, side.z);
        this.scene.add(cube);
      }
      // add our side to the table
      tableBody.addShape(box ,new Vec3(side.x, side.y, side.z))
    }

    // Add a box to the long sites of the table to emulate the pockets
    const sideFixes = [
      new Vec3(0, size.y, size.z + size.x / 10),
      new Vec3(0, size.y, -size.z - size.x / 10),
    ]

    for (let i = 0; i < sideFixes.length; i++) {
      const side = sideFixes[i];
      const box = this.getSideBoundries(size);
      const offset = 0.05;
      box.halfExtents.y = box.halfExtents.y * 2;
      box.halfExtents.z = box.halfExtents.z / 2;
      side.z = i === 0 ? side.z + box.halfExtents.z - offset : side.z - box.halfExtents.z + offset;
      if (this.debug.active) {
        const geometry = new THREE.BoxBufferGeometry(box.halfExtents.x * 2, box.halfExtents.y * 2, box.halfExtents.z * 2);
        const material = new THREE.MeshBasicMaterial({color: 0xff0000});
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(side.x, side.y -.001 - box.halfExtents.y / 2, side.z);
        this.scene.add(cube);
      }
      tableBody.addShape(box ,new Vec3(side.x, side.y - box.halfExtents.y / 2, side.z))
    }

    // Get each corner of the table and the center of the two lager sides and add a colisionBox for each
    const corners = [
      new Vec3(size.x + size.x / 10, size.y, size.z + size.x / 10),
      new Vec3(-size.x - size.x / 10, size.y, size.z + size.x / 10),
      new Vec3(-size.x - size.x / 10, size.y, -size.z - size.x / 10),
      new Vec3(size.x + size.x / 10, size.y, -size.z - size.x / 10),
    ];

    // This function is HELLA scuffed and needs some desprate refactoring
    // TODO: Refactor this
    for (let i = 0; i < corners.length; i++) {
      const corner = corners[i];
      const corner2 = corners[i];
      const box = this.getSideBoundries(size);
      const offset = 0.05;
      // builds 2 boxes for each corner
      box.halfExtents.y = box.halfExtents.y * 2;
      box.halfExtents.z = box.halfExtents.z / 2;
      box.halfExtents.x = box.halfExtents.x / 3;
      const box2 = this.getSideBoundries(size);
      box2.halfExtents.y = box.halfExtents.y;
      box2.halfExtents.z = box.halfExtents.x;
      box2.halfExtents.x = box.halfExtents.z;

      corner.z = i <= 1 ? corner.z + box.halfExtents.z - offset : corner.z - box.halfExtents.z + offset;


      if (this.debug.active) {
        const geometry = new THREE.BoxBufferGeometry(box.halfExtents.x * 2, box.halfExtents.y * 2, box.halfExtents.z * 2);
        const material = new THREE.MeshBasicMaterial({color: 0xff00ff});
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(corner.x, corner.y, corner.z);
        this.scene.add(cube);

        const geometry2 = new THREE.BoxBufferGeometry(box2.halfExtents.x * 2, box2.halfExtents.y * 2, box2.halfExtents.z * 2);
        const cube2 = new THREE.Mesh(geometry2, material);
        cube2.position.set(corner2.x, corner2.y, corner2.z);
        this.scene.add(cube2);
      }
      tableBody.addShape(box ,new Vec3(corner.x, corner.y, corner.z))
      tableBody.addShape(box2 ,new Vec3(corner.x, corner.y, corner.z))
    }


    // create a plane where the pockets end
    const pocketPlane = new CANNON.Box(new CANNON.Vec3(size.x * 1.5, size.y / 22, size.x * 1.5));
    const pocketBody = new CANNON.Body();
    pocketBody.mass = 0;
    pocketBody.addShape(pocketPlane, new Vec3(0, size.y - size.y * 0.15, 0));

    // Debug the plane
    if (this.debug.active) {
      const threePocketPlane = new THREE.Mesh(
        new THREE.BoxBufferGeometry(size.x * 1.5 * 2, size.y / 22 * 2, size.x * 1.5 *2),
        new THREE.MeshBasicMaterial({color: 0x00ff00})
      );
      this.scene.add(threePocketPlane);
      threePocketPlane.position.set(0, size.y - size.y * 0.15 - size.y / 22 /2, 0);
      this.scene.add(threePocketPlane);
    }

    tableBody.material = this.game.world.physicsWorld.tableMaterial;

    tableBody.mass = 0;
    tableBody.position.set(0,0,0);
    tableBody.addShape(tableShape);
    this.physics.physicsWorld.addBody(pocketBody);
    this.physics.physicsWorld.addBody(tableBody);
  };

  // get size of border box. If far side rotate it
  private setBarrierSize(size, isRotated: boolean = false):Vec3 {
    const sizeOffest = 2.34;
    if (isRotated) {
      return new Vec3(size.x / 10, size.y / 10,  size.x / sizeOffest + .04);
    }
    return new Vec3(size.x / sizeOffest, size.y / 10, size.x / 10);
  }

  // box builder for each side of the table
  private getSideBoundries(size , isRotated: boolean = false):Box {
    const barryR = this.setBarrierSize(size, isRotated);
    return new CANNON.Box(new CANNON.Vec3(barryR.x, barryR.y, barryR.z));
  }
}
