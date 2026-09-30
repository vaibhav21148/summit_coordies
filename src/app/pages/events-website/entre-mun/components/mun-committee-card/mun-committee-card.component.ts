import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Committee {
  id: number;
  name: string;
  image: string;
  designation?: string;
  metadata?: string;
}

@Component({
  selector: 'app-mun-committee-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mun-committee-card.component.html',
  styleUrl: './mun-committee-card.component.scss'
})
export class MunCommitteeCardComponent {
  @Input() committees: Committee[] = [];
  @Input() title: string = '';
  @Output() showAgenda = new EventEmitter<Committee>();

  onShowAgenda(committee: Committee) {
    this.showAgenda.emit(committee);
  }
}