import {
  Component,
  OnInit,
  AfterViewInit,
  ViewEncapsulation,
  HostListener,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';

import { GeneralDataService } from '@services/general-data.service';
import { ContactComponent } from '@shared/contact/contact.component';

import { TimelineComponent } from '../../../shared/timeline/timeline.component';
import { AccordionComponent } from '@shared/accordion/accordion.component';
import { VantaBgComponent } from '@shared/vanta-bg/vanta-bg.component';
import { SpeakerCardComponent } from '../../speakers/speaker-card/speaker-card.component';
import { EventsBgComponent } from '@shared/events-bg/events-bg.component';
import { BackgroundImages } from '@constants/enums/background_images_enums';

@Component({
  selector: 'app-na',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,

    ContactComponent,
    TimelineComponent,
    AccordionComponent,
    VantaBgComponent,
    SpeakerCardComponent,
    EventsBgComponent,
  ],
  templateUrl: './na.component.html',
  styleUrl: './na.component.scss',
})
export class NaComponent implements OnInit, AfterViewInit {

  backgroundImage: any;
  responsiveOptions: any;
  isScrolled = false;

  faqs: any = [];
  arena_events_details: any = [];
  speakers: any = [];

  BackgroundImages = BackgroundImages;

  naButtons = [{ text: 'Register Now', clickHandler: 'register' }];

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    this.isScrolled = scrollY > 200;
  }

  onButtonClick(action: string) {
    if (action === 'register') {
      this.router.navigate(['/na/reg']);
    }
  }

  constructor(
    private http: HttpClient,
    private dataService: GeneralDataService,
    private router: Router
  ) { }

  ngAfterViewInit() {
    gsap.registerPlugin(ScrollTrigger);

    // Intro Animation: Background zooms from behind -> Logo and Buttons slide smoothly from bottom
    const introTl = gsap.timeline({
      defaults: { ease: 'power3.out' }
    });

    introTl
      // 1. Background image
      .fromTo('#hero-bg',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out' }
      )
      // 2. Logo slides in from bottom
      .fromTo('.hero-logo-img',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
        '-=0.4'
      )
      // 3. Register button slides in from bottom
      .fromTo('.hero-action-btn',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: 'power3.out' },
        '-=0.6'
      );
  }

  ngOnInit(): void {
    this.getArenaEvents();
    this.getFaqs();
    this.getSpeakers();
  }

  getArenaEvents() {
    this.dataService.getData('arena_events').subscribe((res: any) => {
      this.arena_events_details = res;
    });
  }

  getSpeakers() {
    this.dataService.getData('na_speakers_investors').subscribe((res: any) => {
      this.speakers = res;
    });
  }

  getFaqs() {
    this.dataService.getFAQs('na').subscribe((res: any) => {
      this.faqs = res.map((faq: any, index: number) => ({
        number: (index + 1).toString().padStart(2, '0'),
        title: faq.question,
        content: faq.answer,
      }));
    });
  }
  events = [
    {
      status: 'Registrations Open',
      date: '23rd September 2026',
    },
    {
      status: ' Release of detailed schedule',
      date: '25th November 2026',
    },
    {
      status: 'Registration Deadline',
      date: '4th December 2026',
    },
    {
      status: 'Day of event',
      date: '12th & 13th December 2026',
    },
  ];
}
