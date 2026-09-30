import { Component, Input, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AccordionItem {
  number: string;
  title: string;
  content: string;
}

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss'
})
export class AccordionComponent implements AfterViewInit {
  @Input() items: AccordionItem[] = [];
  @Input() title: string = 'Our Services';
  @Input() allowMultiple: boolean = false;
  @Input() defaultOpen: number = -1;
  
  public activeIndex: number = -1;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.setAccordionItems();
      if (this.defaultOpen >= 0 && this.defaultOpen < this.items.length) {
        this.toggleAccordion(this.defaultOpen);
      }
    }, 0);
  }

  private setAccordionItems() {
    const accordion = this.elementRef.nativeElement.querySelector('.accordion');
    if (accordion) {
      accordion.style.visibility = 'visible';
    }
  }

  toggleAccordion(index: number) {
    const accordionItems = this.elementRef.nativeElement.querySelectorAll('.accordion__item');
    const currentItem = accordionItems[index];
    
    if (this.activeIndex === index) {
      this.closeAccordion(currentItem);
      this.activeIndex = -1;
    } else {
      if (this.activeIndex !== -1) {
        this.closeAccordion(accordionItems[this.activeIndex]);
      }
      this.openAccordion(currentItem);
      this.activeIndex = index;
    }
  }



  private openAccordion(item: HTMLElement) {
    const content = item.querySelector('.content') as HTMLElement;
    const paragraph = content.querySelector('.paragraph') as HTMLElement;
    
    if (paragraph) {
      content.style.height = `${paragraph.scrollHeight + 16}px`;
    }
  }

  private closeAccordion(item: HTMLElement) {
    const content = item.querySelector('.content') as HTMLElement;
    content.style.height = '0';
  }
}
