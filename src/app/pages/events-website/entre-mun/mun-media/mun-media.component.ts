import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MediaPartner {
  id: number;
  name: string;
  image: string;
  link: string;
}

@Component({
  selector: 'app-mun-media',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mun-media.component.html',
  styleUrl: './mun-media.component.scss'
})
export class MunMediaComponent {
  mediaPartners: MediaPartner[] = [
    {
      id: 1,
      name: 'Media Partner 1',
      image: 'images/logos/mun_logo.png',
      link: '#'
    },
    {
      id: 2,
      name: 'Media Partner 2', 
      image: 'images/logos/mun_logo.png',
      link: '#'
    }
  ];
}
