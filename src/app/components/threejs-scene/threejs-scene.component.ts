import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-threejs-scene',
  templateUrl: './threejs-scene.component.html',
  styleUrls: ['./threejs-scene.component.scss'],
})
export class ThreejsSceneComponent implements OnInit, AfterViewInit {
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

  private camera!: THREE.PerspectiveCamera;
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  private loader: THREE.TextureLoader = new THREE.TextureLoader();
  private geometry: THREE.BoxGeometry = new THREE.BoxGeometry(1,1,1);
  private material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({map: this.loader.load(this.texture)});

  private cube: THREE.Mesh = new THREE.Mesh(this.geometry, this.material);
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.createScene();
    this.startRenderingLoop();
  }
  // LIFE CYCLE end


  private createScene(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xcccccc);
    this.scene.add(this.cube);

    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    );

    this.camera.position.z = this.cameraZ;
  }

  private getAspectRatio(): number {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private animateCube(cube: THREE.Mesh): void {
    cube.rotation.x += this.rotationSpeedX;
    cube.rotation.y += this.rotationSpeedY;
  }

  private startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    let component: ThreejsSceneComponent = this;    // scope this for animationFrameLoop!

    (function render() {
      requestAnimationFrame(render);  // endless loop
      component.animateCube(component.cube);
      component.renderer.render(component.scene, component.camera);

    }());   // call initially
  }
}
