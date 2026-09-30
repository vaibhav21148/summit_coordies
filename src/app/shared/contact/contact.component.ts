import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-square-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  @Input() name!: string;
  @Input() email: string = '';
  @Input() designation!: string;
  @Input() img_url: string = 'images/misc/default-neutral.jpg';
  @Input() linkedin?: string;
  @Input() contact?: string;
  @Input() img_style?: string;
}
