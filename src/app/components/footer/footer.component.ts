import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import * as AOS from 'aos';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit, AfterViewInit {

    currentYear = new Date().getFullYear();

    ngOnInit(): void {
      AOS.init({
        duration: 1000,
        once: false,
        offset: -100
      });
    }

    ngAfterViewInit(): void {
      setTimeout(() => {
        AOS.refresh();
      }, 500);
    }

}

