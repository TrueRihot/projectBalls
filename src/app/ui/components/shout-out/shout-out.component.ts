import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ShoutOutService } from '../../services/shout-out.service';

import gsap from "gsap";
import { Shout } from '../../interfaces/Shout';

@Component({
  selector: 'app-shout-out',
  templateUrl: './shout-out.component.html',
  styleUrls: ['./shout-out.component.scss']
})
export class ShoutOutComponent implements OnInit, AfterViewInit {

  @ViewChild('shoutOutText') shoutOutText: ElementRef;

  public messageTxt: string = 'shout out!'

  constructor(private shoutOutService: ShoutOutService) { }

  ngOnInit(): void {
    this.shoutOutService.shoutOut$.subscribe(message => {
      console.log('shout out message', message);
      this.showMessage(message);
    });
  }

  private showMessage(message: Shout) {
    this.messageTxt = message.text;

    const intro: gsap.core.Tween = gsap.to(this.shoutOutText.nativeElement, {
      duration: message.introDuration,
      opacity: 1,
      scale: 7,
      // rotate: 360,
    });

    const outro: gsap.core.Tween = gsap.to(this.shoutOutText.nativeElement, {
      duration: message.outroDuration,
      opacity: 0,
      scale: 0,
      // rotate: 0,
      delay: message.pauseDuration,
    });

    const animation = gsap.timeline();
    animation.add(intro);
    animation.add(outro);

    animation.play();
  }

  ngAfterViewInit(): void {
  }


}
