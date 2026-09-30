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
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { DialogModule } from 'primeng/dialog';


import { BackgroundImages } from '@constants/enums/background_images_enums';
import { GeneralDataService } from '@services/general-data.service';
import { ContactComponent } from '@shared/contact/contact.component';
import { EventsBgComponent } from "@shared/events-bg/events-bg.component";
import { TimelineComponent } from '../../../shared/timeline/timeline.component';
import { AccordionComponent } from '@shared/accordion/accordion.component';
import { VantaBgComponent } from "@shared/vanta-bg/vanta-bg.component";

@Component({
  selector: 'app-expo',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    NavbarComponent,
    RouterLink,
    DialogModule,
    ContactComponent,
    EventsBgComponent,
    TimelineComponent,
    AccordionComponent,
    VantaBgComponent
],
  templateUrl: './expo.component.html',
  styleUrls: ['./expo.component.scss'],
})
export class ExpoComponent implements OnInit, AfterViewInit {

  BackgroundImages = BackgroundImages;
  backgroundImage: any;
  responsiveOptions: any;
  isScrolled = false;
  visible = false;
  
  expoButtons: { text: string; clickHandler?: string; routerLink?: string }[] = [
    { text: 'Query Form', clickHandler: 'QueryForm' }
  ];

  faqs: any = [];
  speakers: any = [];

  expo_title: any;
  expo_description: any;
  expo_image: any;
  expo_details: any = [];

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    const scrollY = window.scrollY;
    this.isScrolled = scrollY > 200;
  }

  // ShowDetails(i: any) {
  //   this.event_title = this.arena_events_details[i].title;
  //   this.event_description = this.arena_events_details[i].description;
  //   this.event_image = this.arena_events_details[i].image;
  //   this.visible = true;
  // }
  ShowDetails(i: any) {
    this.expo_title = this.expo_details[i].title;
    this.expo_description = this.expo_details[i].description;
    this.expo_image = this.expo_details[i].image;
    this.visible = true;
  }
  constructor(
    private http: HttpClient,
    private dataService: GeneralDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getWhyExpo();
    this.getSpeakers();
    this.getFaqs();
  }

  ngAfterViewInit() {
    gsap.registerPlugin(ScrollTrigger);

    // Intro Animation: Background zooms from behind -> Logo emerges & Buttons slide from bottom simultaneously
    const introTl = gsap.timeline({
      defaults: { ease: 'power3.out' }
    });

    introTl
      // 1. Image comes from behind
      .fromTo('#hero-bg',
        { scale: 0.7, opacity: 0 },
        { scale: 1.05, opacity: 1, duration: 1.2, ease: 'power2.out' }
      )
      // 2. Logo emerges
      .fromTo('.hero-logo-img',
        { scale: 0.5, y: 35, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.9, ease: 'back.out(1.6)' },
        '-=0.2'
      )
      // 3. Simultaneously buttons slide from bottom
      .fromTo('.hero-action-btn',
        { y: 70, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, stagger: 0.12, ease: 'power3.out' },
        '<'
      );

    // Cards Entrance Animation
    gsap.from('.why-cards-grid .flip-card', {
      scrollTrigger: {
        trigger: '#why-cards-container',
        start: 'top 85%',
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    });
  }

  handleButtonClick(handler: string) {
    if (handler === 'RegDeadline') {
      this.RegDeadline();
    } else if (handler === 'QueryForm') {
      this.openQueryForm();
    }
  }

  RegDeadline() {
    Swal.fire({
      title: 'Registrations are closed!',
      text: 'Registrations for this event are closed!',
      icon: 'info',
      confirmButtonText: 'OK',
    });
  }

  openQueryForm() {
    this.router.navigate(['/expo/query']);
  }
  // getArenaEvents() {
  //   this.http
  //     .get('https://apiserver.ecell.in/esummit24/get_arena_events/')
  //     .subscribe((res: any) => {
  //       this.arena_events_details = res;
  //       console.log(this.arena_events_details);
  //     });
  // }

  getWhyExpo() {
    this.http
      .get('https://apiserver.ecell.in/esummit24/why_expo/')
      .subscribe((res: any) => {
        this.expo_details = res;
        // console.log(this.arena_events_details);
      });
  }

  getFaqs() {
    this.dataService.getFAQs('expo').subscribe((res: any) => {
      this.faqs = res.map((faq: any, index: number) => ({
        number: String(index + 1).padStart(2, '0'),
        title: faq.question,
        content: faq.answer
      }));
    });
  }

  getSpeakers() {
    this.dataService.getData('expo_exhibitors').subscribe((res: any) => {
      this.speakers = res;
    });
  }

  events = [
    {
      status: 'Launch',
      date: '13th September',
    },
    {
      status: 'Query Form Closes',
      date: '25th November',
    },
    {
      status: 'Detailed Schedule',
      date: '1st December',
    },
    {
      status: 'Expo',
      date: '12th-13th December',
    },
  ];
}
