
import { CommonModule } from '@angular/common';
import { Component, Input, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-evervault-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './evervault-card.component.html',
  styleUrl: './evervault-card.component.scss'
})
export class EvervaultCardComponent {
  @Input() text: string = 'hover';

  mouseX: number = 0;
  mouseY: number = 0;
  randomString: string = '';

  characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  constructor(private el: ElementRef) {
    this.randomString = this.generateRandomString(1500);
  }

  onMouseMove(event: MouseEvent) {
    const rect = this.el.nativeElement.getBoundingClientRect();
    this.mouseX = event.clientX - rect.left;
    this.mouseY = event.clientY - rect.top;

    // update random string for scramble effect
    this.randomString = this.generateRandomString(1500);
  }

  generateRandomString(length: number) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += this.characters.charAt(
        Math.floor(Math.random() * this.characters.length)
      );
    }
    return result;
  }
}
