import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as THREE from 'three';
import * as dat from 'lil-gui';
import * as CANNON from 'cannon';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Vec3} from "cannon";

@Component({
  selector: 'app-threejs-scene',
  templateUrl: './threejs-scene.component.html',
  styleUrls: ['./threejs-scene.component.scss'],
})
export class ThreejsSceneComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() cameraZ: number = 400;
  @Input() fieldOfView: number = 1;
  @Input('nearClipping') nearClippingPlane: number = 1;
  @Input('farClipping') farClippingPlane: number = 1000;
  @Input() texture: string = "/assets/texture.jpg";

  // CUBE
  @Input() rotationSpeedX: number = 0.01;
  @Input() rotationSpeedY: number = 0.01;
  @Input() size: number = 200;
  // CUBE end

  private windowSize: { width: number, height: number } = {width: window.innerWidth, height: window.innerHeight};
  private gui = new dat.GUI();
  private debugObject: {[key: string]: any} = {};

  private camera!: THREE.PerspectiveCamera;
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  private loader: THREE.TextureLoader = new THREE.TextureLoader();
  //private geometry: THREE.BoxGeometry = new THREE.BoxGeometry(1,1,1);
  //private material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({map: this.loader.load(this.texture)});

  // Geometry stuff
  private sphereGeometry =  new THREE.SphereBufferGeometry(1, 32, 32);
  private basicMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    map: this.loader.load(this.texture)
  });
  private cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1, 32,32,32);

  //private cube: THREE.Mesh = new THREE.Mesh(this.geometry, this.material);
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private controls!: OrbitControls;

  // physics world
  private world!: CANNON.World;
  private defaultMaterial = new CANNON.Material('default');
  private defaultContactMaterial = new CANNON.ContactMaterial(
    this.defaultMaterial,
    this.defaultMaterial,
    {
      friction: 0.1,
      restitution: .7,
    }
  );

  // object ref for updating
  private objectsToUpdate: {mesh: THREE.Mesh, body: CANNON.Body}[] = [];

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // update window size
    this.windowSize = {width: window.innerWidth, height: window.innerHeight};
    this.createScene();
    this.startRenderingLoop();

    // controls
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;

    //phyics world stuff
    this.world = new CANNON.World();
    this.world.broadphase = new CANNON.SAPBroadphase(this.world)
    this.world.allowSleep = true
    this.world.gravity.set(0, -9.82, 0)
    // physicsmaterials
    this.world.addContactMaterial(this.defaultContactMaterial);
    this.world.defaultContactMaterial = this.defaultContactMaterial;

    // adding floor once
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body();
    floorBody.mass = 0;
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1 , 0, 0), Math.PI / 2);
    floorBody.addShape(floorShape);
    this.world.addBody(floorBody);

    // debugging function
    this.debugObjectBuilder();

    window.addEventListener('resize', () =>
    {
      // Update sizes
      this.windowSize.width = window.innerWidth
      this.windowSize.height = window.innerHeight

      // Update camera
      this.camera.aspect = this.windowSize.width / this.windowSize.height
      this.camera.updateProjectionMatrix()

      // Update renderer
      this.renderer.setSize(this.windowSize.width, this.windowSize.height)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    // two starting spheres
    this.createSphere(0.5, new CANNON.Vec3(0, 2, 0));
    this.createSphere(1, new CANNON.Vec3(1.5, 5, 0));

  }

  ngOnDestroy() {
    // getting rid of listeners
    window.removeEventListener('resize', () => {});
  }
  // LIFE CYCLE end

  debugObjectBuilder() {
    this.debugObject.addSphere = () => {
      this.createSphere(Math.random() * .5,
        new Vec3((Math.random() -.5) * 3,  3,  (Math.random() -.5) * 3));
    }
    this.gui.add(this.debugObject, 'addSphere')

    this.debugObject.addBox = () => {
      this.createCube(Math.random() * .5,
        new Vec3((Math.random() -.5) * 3,  3, (Math.random() -.5) * 3))
    }
    this.gui.add(this.debugObject, 'addBox')

    this.debugObject.reset = () => {
      // Collide sound stuff
     /* for (const obj of this.objectsToUpdate) {
        obj.body.removeEventListener('collide',)
        world.remove(obj.body)
        scene.remove(obj.mesh)
      }*/
      this.objectsToUpdate.splice(0,this.objectsToUpdate.length)

    }
    this.gui.add(this.debugObject, 'reset')
  }

  private createScene(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xcccccc);
    //this.scene.add(this.cube);

    // lighting dis bitch up
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.set(1024, 1024)
    directionalLight.shadow.camera.far = 15
    directionalLight.shadow.camera.left = - 7
    directionalLight.shadow.camera.top = 7
    directionalLight.shadow.camera.right = 7
    directionalLight.shadow.camera.bottom = - 7
    directionalLight.position.set(5, 5, 5)
    this.scene.add(directionalLight);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
      })
    )
    floor.receiveShadow = true
    floor.rotation.x = - Math.PI * 0.5
    this.scene.add(floor)

    // camera stuff
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    );

    this.camera.position.set(- 6, 6, 6);
  }

  private getAspectRatio(): number {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  /*private animateCube(cube: THREE.Mesh): void {
    cube.rotation.x += this.rotationSpeedX;
    cube.rotation.y += this.rotationSpeedY;
  }*/

  private createCube(size: number, position:Vec3):void {
    const mesh = new THREE.Mesh(this.cubeGeometry, this.basicMaterial);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set(position.x, position.y, position.z);
    mesh.scale.set(size, size, size);
    this.scene.add(mesh);

    const shape = new CANNON.Box(new CANNON.Vec3(size / 2, size / 2, size / 2));
    const body = new CANNON.Body({
      mass: 1,
      material: this.defaultMaterial,
      position: new CANNON.Vec3(position.x, position.y, position.z),
      shape
    });
   /* body.addEventListener('collide', (e) => {
    })*/
    this.world.addBody(body);
    this.objectsToUpdate.push({mesh,body});
  }

  createSphere(radius: number, position:Vec3):void {
    // THREE.js mesh
    const mesh = new THREE.Mesh(
      this.sphereGeometry,
      this.basicMaterial
    )
    mesh.scale.set(radius, radius, radius)
    mesh.castShadow = true;
    mesh.position.set(position.x, position.y, position.z);
    this.scene.add(mesh);

    // Cannon.js body
    const shape = new CANNON.Sphere(radius);
    const body = new CANNON.Body({
      mass: 1,
      material: this.defaultMaterial,
      position: new CANNON.Vec3(0,3,0),
      shape,
    })
    // @ts-ignore because vec3 is exactly the same as vector3
    body.position.copy(position)
    this.world.addBody(body)
    // save in objectsToUpdate
    this.objectsToUpdate.push({
      mesh,
      body
    })
   /* body.addEventListener('collide', (e) => {
    })*/
  }
  // IMPORTANT ANIMATION VARIABLES
  private clock = new THREE.Clock()
  private oldElapsedTime = 0


  private startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // für performance optimierung (nur 2x)
    this.renderer.setSize(this.windowSize.width, this.windowSize.height);
    this.camera.aspect = this.windowSize.width / this.windowSize.height;
    this.camera.updateProjectionMatrix();


    let component: ThreejsSceneComponent = this;    // scope this for animationFrameLoop!

    (function render() {
      const elapsedTime = component.clock.getElapsedTime();
      const deltaTime = elapsedTime - component.oldElapsedTime; // time since last frame to make animations the same on all framerates
      component.oldElapsedTime = elapsedTime;

      // updating physics world
      component.world?.step(1/60 , deltaTime, 3);

      //updating objects based on physics
      for (const obj of component.objectsToUpdate) {
        // ignore because vec3 is exactly the same as vector3
        // @ts-ignore
        obj.mesh.position.copy(obj.body.position);
        // @ts-ignore
        obj.mesh.quaternion.copy(obj.body.quaternion);
      }

      requestAnimationFrame(render);  // endless loop
      //component.animateCube(component.cube);
      component.renderer.render(component.scene, component.camera);

      // smooth out controls
      component.controls?.update();

    }());   // call initially
  }
}
