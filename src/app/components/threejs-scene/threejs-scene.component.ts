import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Game} from "./game/Game.class";

@Component({
  selector: 'app-threejs-scene',
  templateUrl: './threejs-scene.component.html',
  styleUrls: ['./threejs-scene.component.scss'],
})
export class ThreejsSceneComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;
  private game: Game | undefined;

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  ngAfterViewInit() {
    this.game = Game.getInstance(this.canvasRef.nativeElement);
    this.game.init();
    console.log(this.game)
  }
}
