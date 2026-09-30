import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { BackgroundImages } from '@constants/enums/background_images_enums';

interface ButtonConfig {
  text: string;
  routerLink?: string;
  clickHandler?: string;
}

@Component({
  selector: 'app-events-bg',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './events-bg.component.html',
  styleUrl: './events-bg.component.scss'
})
export class EventsBgComponent {
  @Input() backgroundImage: BackgroundImages = BackgroundImages.DEFAULT;


  @Input() logoImage: string = '';
  @Input() buttons: ButtonConfig[] = [];
  @Output() buttonClick = new EventEmitter<string>();

  onButtonClick(handler?: string) {
    if (handler) {
      this.buttonClick.emit(handler);
    }
  }
}
