import * as THREE from 'three';

import EventEmitter from "./Eventemitter.class";

export default class Time extends EventEmitter {
  start: number;
  current: number;
  elapsed: number;
  delta: number;

  constructor() {
    super();

    // Setup
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;

    window.requestAnimationFrame(() => {
      this.tick()
    })
  }

  tick() {
    const currentTime = Date.now();
    this.delta = currentTime - this.current

    if(this.delta >= 15) {
      this.current = currentTime
      this.elapsed = this.current - this.start
      this.trigger('tick')

    }


    window.requestAnimationFrame(() => {
      this.tick()
    })
  }
}
