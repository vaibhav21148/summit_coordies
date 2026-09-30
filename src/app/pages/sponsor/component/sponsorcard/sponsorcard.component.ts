import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Sponsor {
  id: number;
  name: string;
  image: string;
  link: string;
  type: string;
  title?: string;
}

@Component({
  selector: 'app-sponsorcard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sponsorcard.component.html',
  styleUrl: './sponsorcard.component.scss'
})
export class SponsorcardComponent {
  @Input() sponsors: Sponsor[] = [];
  @Input() title: string = '';
}
