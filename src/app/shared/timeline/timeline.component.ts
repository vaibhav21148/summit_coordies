import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import * as AOS from 'aos';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})
export class TimelineComponent implements OnInit {
  @Input() events: any[] = [];
  @Input() heading: string = 'TIMELINE';

  ngOnInit() {
    AOS.init({
      duration: 800,
      offset: 100,
      once: true,
    });
  }

}
