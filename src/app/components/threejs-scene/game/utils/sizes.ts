import EventEmitter from  './Eventemitter.class';

export default class Sizes extends EventEmitter {
  width: number;
  height: number;
  aspectRatio: number;
  pixelRatio: number;

  constructor(){
    super();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspectRatio = this.width / this.height;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);

    window.addEventListener('resize', () =>
        {
            this.updateSizes();
            this.trigger('resize')
        })

  }

  updateSizes() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspectRatio = this.width / this.height;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
  }
}
