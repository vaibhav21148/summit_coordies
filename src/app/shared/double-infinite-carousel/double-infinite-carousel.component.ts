import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CarouselItem {
  id: string;
  name: string;
  image: string;
  designation?: string;
}

@Component({
  selector: 'app-double-infinite-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './double-infinite-carousel.component.html',
  styleUrls: ['./double-infinite-carousel.component.scss']
})
export class DoubleInfiniteCarouselComponent implements OnInit, OnChanges {
  @Input() items: CarouselItem[] = [];
  @Input() type: 'sponsors' | 'investors' = 'sponsors';
  @Input() title: string = '';

  leftItems: CarouselItem[] = [];
  rightItems: CarouselItem[] = [];

  ngOnInit() {
    if (this.items && this.items.length > 0) {
      this.splitItems();
    }
  }

  ngOnChanges() {
    if (this.items && this.items.length > 0) {
      this.splitItems();
    }
  }

  private splitItems() {
    const halfLength = Math.ceil(this.items.length / 2);
    this.leftItems = [...this.items.slice(0, halfLength), ...this.items.slice(0, halfLength)];
    this.rightItems = [...this.items.slice(halfLength), ...this.items.slice(halfLength)];
  }
}