import { HttpClient } from '@angular/common/http';
import {
  Component,
  HostListener,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { GeneralDataService } from '@services/general-data.service';
import { ContactComponent } from '@shared/contact/contact.component';
import { SpeakerCardComponent } from '../../speakers/speaker-card/speaker-card.component';
import { AccordionComponent } from '@shared/accordion/accordion.component';
import { TimelineComponent } from '../../../shared/timeline/timeline.component';

@Component({
  selector: 'app-isummit',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    NavbarComponent,
    ContactComponent,
    SpeakerCardComponent,
    AccordionComponent,
    TimelineComponent,
  ],
  templateUrl: './isummit.component.html',
  styleUrls: ['./isummit.component.scss'],
})
export class IsummitComponent implements OnInit, AfterViewInit {
  isScrolled = false;
  faqs: any = [];
  speakers: any = [];
  newspeakers: any = [];

  public isummitButtons = [
    { text: 'REGISTER', clickHandler: 'register' }
  ];

  why_isummit = [
    {
      title: 'Direct Access to Top Incubators',
      description: 'Connect with leading incubators across India without lengthy application processes.',
      image: 'images/events/info-icons/plant.png'
    },
    {
      title: 'Accelerated Evaluation Process',
      description: 'Get your startup evaluated significantly faster than traditional incubation cycles.',
      image: 'images/events/info-icons/meter.png'
    },
    {
      title: 'On-the-Spot Decisions',
      description: 'Receive immediate feedback and potential acceptance offers directly from decision makers.',
      image: 'images/events/info-icons/notes.png'
    },
    {
      title: 'Exclusive Mentorship Opportunities',
      description: 'Gain access to seasoned mentors, industry titans, and high-impact strategic guidance.',
      image: 'images/events/info-icons/ppl-connect.png'
    },
    {
      title: 'Networking with Industry Experts',
      description: 'Build valuable long-term connections with leaders across India’s startup ecosystem.',
      image: 'images/events/info-icons/pair.png'
    },
    {
      title: 'Fast-track Your Journey',
      description: 'Skip months of waiting and accelerate your startup’s scaling, validation, and growth.',
      image: 'images/events/info-icons/road-map.png'
    }
  ];

  events = [
    {
      status: 'Registrations Open',
      date: '19th September 2026',
    },
    {
      status: 'Registration Deadline',
      date: '24th October 2026',
    },
    {
      status: 'Selected Startups Declaration for Round 1 pitching',
      date: '30th October 2026',
    },
    {
      status: 'Round 1 Pitching (Online) + Q&A with incubators',
      date: '31st October to 7th November 2026',
    },
    {
      status: 'Finalists Declaration',
      date: '13th November 2026',
    },
    {
      status: 'In-Person Interviews & 1v1 Meetings with Incubators at the Summit',
      date: '12th December 2026',
    },
  ];

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollY = window.scrollY;
    this.isScrolled = scrollY > 200;
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private dataService: GeneralDataService
  ) {}

  ngAfterViewInit() {
    gsap.registerPlugin(ScrollTrigger);

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
  }

  ngOnInit(): void {
    this.getSpeakers();
    this.getFaqs();
  }

  register() {
    this.router.navigate(['/isummit/reg']);
  }

  onButtonClick(handler?: string) {
    this.register();
  }

  getFaqs() {
    this.dataService.getFAQs('isummit').subscribe((res: any) => {
      if (res && Array.isArray(res)) {
        this.faqs = res.map((faq: any, index: number) => ({
          number: (index + 1).toString().padStart(2, '0'),
          title: faq.question,
          content: faq.answer
        }));
      }
    });
  }

  readonly extraPastIncubators = [
    {
      id: 385,
      name: 'IIM Calcutta Innvovation Park',
      image: 'https://2k21.s3.amazonaws.com/esummit26/elements/this_year_isummit_incubators/2.png',
      designation: 'Incubation Partner',
      metadata: ''
    },
    {
      id: 379,
      name: 'FITT',
      image: 'https://2k21.s3.amazonaws.com/esummit26/elements/this_year_isummit_incubators/ANI-20250828125224.jpg',
      designation: 'Incubation Partner',
      metadata: ''
    },
    {
      id: 395,
      name: 'T-Hub',
      image: 'https://2k21.s3.amazonaws.com/esummit26/elements/this_year_isummit_incubators/4.png',
      designation: 'Incubation Partner',
      metadata: ''
    },
    {
      id: 387,
      name: 'IIT Mandi iHub and HCi Foundation',
      image: 'https://2k21.s3.amazonaws.com/esummit26/elements/this_year_isummit_incubators/1.png',
      designation: 'Incubation Partner',
      metadata: ''
    }
  ];

  getSpeakers() {
    this.http.get('https://apiserver.ecell.in/esummit26/isummit_incubators/').subscribe({
      next: (res: any) => {
        const fetched = res || [];
        const existingNames = new Set(fetched.map((item: any) => item.name?.toLowerCase().trim()));
        const toAdd = this.extraPastIncubators.filter(item => !existingNames.has(item.name.toLowerCase().trim()));
        const firstRow = fetched.slice(0, 4);
        const remaining = fetched.slice(4);
        this.speakers = [...firstRow, ...toAdd, ...remaining];
      },
      error: () => {
        this.dataService.getData('isummit_incubators').subscribe((res: any) => {
          const fetched = res || [];
          const existingNames = new Set(fetched.map((item: any) => item.name?.toLowerCase().trim()));
          const toAdd = this.extraPastIncubators.filter(item => !existingNames.has(item.name.toLowerCase().trim()));
          const firstRow = fetched.slice(0, 4);
          const remaining = fetched.slice(4);
          this.speakers = [...firstRow, ...toAdd, ...remaining];
        });
      }
    });
  }
}

