import { HttpClient } from '@angular/common/http';
import {
  Component,
  HostListener,
  OnInit,
  AfterViewInit,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Renderer2 } from '@angular/core';
import * as AOS from 'aos';
import { RouterLink } from '@angular/router';
// import { TtmmLogoComponent } from '../../../spline/ttmm-logo/ttmm-logo.component';

import { GeneralDataService } from '@services/general-data.service';
import { ContactComponent } from '@shared/contact/contact.component';


import { SpeakerCardComponent } from '../../speakers/speaker-card/speaker-card.component';
import { AccordionComponent } from '@shared/accordion/accordion.component';
import { EvervaultCardComponent } from "@shared/evervault-card/evervault-card.component";
import { TimelineComponent } from '../../../shared/timeline/timeline.component';

import { AccoComponent } from "../../acco/acco.component";
import { EventsBgComponent } from "@shared/events-bg/events-bg.component";
import { VantaBgComponent } from "@shared/vanta-bg/vanta-bg.component";
@Component({
  selector: 'app-ttmm',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    NavbarComponent,
    RouterLink,

    ContactComponent,

    SpeakerCardComponent,
    AccordionComponent,
    EvervaultCardComponent,
    TimelineComponent,

    AccoComponent,
    EventsBgComponent,
    VantaBgComponent
  ],
  templateUrl: './ttmm.component.html',
  styleUrl: './ttmm.component.scss',
})
export class TtmmComponent implements OnInit, AfterViewInit {

  backgroundImage: any;
  responsiveOptions: any;
  isScrolled = false;
  faqs: any = [];
  investors: any = [];

  public ttmmButtons = [
    { text: 'REGISTER', clickHandler: 'register' }
  ];

  why_ttmm = [
    {
      title: 'On-Spot Funding',
      description: 'Secure up to INR 3.5 Million in just 10 minutes - an opportunity that could change your startup’s future.',
      image: 'images/events/info-icons/rupee.png'
    },
    {
      title: 'Investor Validation',
      description: 'Validation from Esteemed Investors - Backing and feedback from India’s top Angels & VCs.',
      image: 'images/events/info-icons/medal.png'
    },
    {
      title: 'Broadcast & Media Reach',
      description: 'The previous editions aired on JioTV and OTT Play. This year promises even greater reach and exposure.',
      image: 'images/events/info-icons/film_camera.png'
    },
    {
      title: 'Grand Stage Pitching',
      description: 'Pitch in front of an audience of 3.5k+ with full media coverage at an open-air grand event.',
      image: 'images/events/info-icons/people.png'
    }
  ];

  jwt: string | null = null;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    const scrollY = window.scrollY;
    this.isScrolled = scrollY > 200;
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private dataService: GeneralDataService
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

  ngOnInit() {

    // AOS.init({
    //   duration: 800,
    //   easing: 'ease-in-out',
    //   // once: true  // animate only once
    // });
    this.getFaqs();
    this.getInvestors();
    this.responsiveOptions = [
      {
        breakpoint: '2000px',
        numVisible: 5,
        numScroll: 1,
      },
      {
        breakpoint: '1192px',
        numVisible: 4,
        numScroll: 1,
      },
      {
        breakpoint: '991px',
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  // ngAfterViewInit() {
  //   this.initTimelines();
  // }

  register() {
    this.router.navigate(['/ttmm/reg']);
  }

  RegDeadline() {
    this.register();
  }

  onButtonClick(handler: string) {
    if (handler === 'register' || handler === 'regDeadline') {
      this.register();
    }
  }


  getFaqs() {
    this.dataService.getFAQs('ttmm').subscribe((res: any) => {
      this.faqs = res.map((faq: any, index: number) => ({
        number: (index + 1).toString().padStart(2, '0'),
        title: faq.question,
        content: faq.answer
      }));
    });
  }

  getInvestors() {
    this.dataService.getData('ttmm_investors').subscribe((res: any) => {
      this.investors = res;
    });
  }

  // initTimelines() {
  //   setTimeout(() => {
  //     gsap.registerPlugin(ScrollTrigger);
  //     const timeline = gsap.timeline({
  //       scrollTrigger: {
  //         trigger: '.investors',
  //         start: 'top bottom',
  //         end: 'bottom bottom,',
  //         scrub: 0.1,
  //         markers: true,
  //       },
  //     });

  //     timeline.from('.investor-card', {
  //       opacity: 0,
  //       translateY: -50,
  //       duration: 0.3,
  //       stagger: {
  //         each: -0.1,
  //         from: 'end',
  //       },
  //     });
  //   }, 300);
  // }

  gallery = [
    {
      image: 'image/gallery1.jpg',
    },
    {
      image: 'image/gallery1.jpg',
    },
    {
      image: 'image/gallery1.jpg',
    },
    {
      image: 'image/gallery1.jpg',
    },
    {
      image: 'image/gallery1.jpg',
    },
    {
      image: 'image/gallery1.jpg',
    },
    {
      image: 'image/gallery1.jpg',
    },
    {
      image: 'image/gallery1.jpg',
    },
    {
      image: 'image/gallery1.jpg',
    },
  ];

  events = [
    {
      status: 'Registrations Open',
      date: '11th September 2026'
    },
    {
      status: 'Registration Deadline',
      date: '18th October 2026'
    },
    {
      status: 'Semi-Finalists Declaration',
      date: '30th October 2026'
    },
    {
      status: 'Finalists Declaration',
      date: '25th November 2026'
    },
    {
      status: 'The Grand Finale',
      date: '12th & 13th December 2026'
    }
  ];
}
