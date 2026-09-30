import { HttpClient } from '@angular/common/http';
import {
  Component,
  HostListener,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
  selector: 'app-seed-stars',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FooterComponent,
    NavbarComponent,
    ContactComponent,
    SpeakerCardComponent,
    AccordionComponent,
    TimelineComponent,
  ],
  templateUrl: './seed-stars.component.html',
  styleUrls: ['./seed-stars.component.scss'],
})
export class SeedStarsComponent implements OnInit, AfterViewInit {
  isScrolled = false;
  faqs: any = [];
  investors: any = [];

  public seedstarsButtons = [
    { text: 'REGISTER', clickHandler: 'register' }
  ];

  why_seedstars = [
    {
      title: 'Accessible Investment Paths',
      description: 'Connect directly with top-tier angel investors and leading venture capital firms looking for high-potential early-stage startups.',
      image: 'images/events/info-icons/plant.png'
    },
    {
      title: 'Flexible Funding Terms',
      description: 'Explore adaptable investment structures and customized discussions tailored to your startup’s unique capital and growth needs.',
      image: 'images/events/info-icons/rupee.png'
    },
    {
      title: 'Expert Mentorship Access',
      description: 'Tap into seasoned investor insights, strategic growth advice, and operational expertise to refine your business roadmap.',
      image: 'images/events/info-icons/ppl-connect.png'
    },
    {
      title: 'Early-Stage Risk Support',
      description: 'Gain support from visionary investors who believe in ambitious founders and excel in navigating early-stage venture risks.',
      image: 'images/events/info-icons/meter.png'
    },
    {
      title: 'Broad Networking Prospects',
      description: 'Build valuable relationships with fellow trailblazing founders, industry leaders, and cross-sector strategic partners.',
      image: 'images/events/info-icons/people.png'
    },
    {
      title: 'Enhanced Credibility Boost',
      description: 'Elevate your venture’s profile and market standing with national validation at Asia’s largest entrepreneurship summit.',
      image: 'images/events/info-icons/medal.png'
    }
  ];

  selection_procedure = [
    {
      step: '01',
      title: 'Registration',
      description: 'Fill out the registration form with the necessary information and upload your pitch deck.'
    },
    {
      step: '02',
      title: 'Online Round',
      description: 'After evaluation, shortlisted startups will present online to investors.'
    },
    {
      step: '03',
      title: 'Finals',
      description: 'Qualifying startups will pitch in person to investors on 12th - 13th December, 2026.'
    }
  ];

  events = [
    {
      status: 'Registration Open',
      date: '29 September, 2026',
    },
    {
      status: 'Registration Deadline',
      date: '1 November, 2026',
    },
    {
      status: 'Shortlisted Startups Declaration',
      date: 'To be announced',
    },
    {
      status: 'Online Pitching Round',
      date: 'Second Week of November',
    },
    {
      status: 'Finalists Declaration',
      date: 'To be announced',
    },
    {
      status: 'Day of Event (Offline)',
      date: '12th - 13th December, 2026',
    },
  ];

  readonly pastInvestorsList = [
    {
      id: 1,
      name: 'Rajesh Sehgal',
      designation: 'Managing Partner, Equanimity Investments',
      image: 'https://2k21.s3.amazonaws.com/speakers/Rajesh_Sehgal.jpeg'
    },
    {
      id: 2,
      name: 'Bipin Shah',
      designation: 'Partner at Titan Capital',
      image: 'https://2k21.s3.amazonaws.com/speakers/bipin_shah_4PUOdpj.jpeg'
    },
    {
      id: 3,
      name: 'Sachin Tagra',
      designation: 'Managing Partner at JSW Ventures',
      image: 'https://2k21.s3.amazonaws.com/speakers/sachin_tagra.jpeg'
    },
    {
      id: 4,
      name: 'Abhijeet Kumar',
      designation: 'Founding Partner at ah! Ventures',
      image: 'https://2k21.s3.amazonaws.com/speakers/abhijeet_kumar.jpeg'
    },
    {
      id: 5,
      name: 'Anuj Mehta',
      designation: 'India Investments Lead at Rise Capital',
      image: 'https://2k21.s3.amazonaws.com/speakers/BnW_Linkedin_-_Anuj_Mehta.jpeg'
    },
    {
      id: 6,
      name: 'Sushant Kumar',
      designation: 'Founder at Eskeyn Ventures',
      image: 'https://2k21.s3.amazonaws.com/speakers/WhatsApp_Image_2024-01-18_at_8.30.32_PM_2.jpeg'
    },
    {
      id: 7,
      name: 'Neha Aggarwal',
      designation: 'Vice President at Mumbai Angels',
      image: 'https://2k21.s3.amazonaws.com/speakers/neha_aggarwal.jpeg'
    },
    {
      id: 8,
      name: 'Ankul Maheshwari',
      designation: 'Founder at CENSIE Capital Partners',
      image: 'https://2k21.s3.amazonaws.com/speakers/ankul.jpeg'
    },
    {
      id: 9,
      name: 'Rema Subramanian',
      designation: 'Co-founder and Managing Partner at Ankur Capital Fund',
      image: 'https://2k21.s3.amazonaws.com/speakers/rema_subramanium.jpeg'
    },
    {
      id: 10,
      name: 'Lalit Singla',
      designation: 'Principal Partner at iAngels, India Accelerator',
      image: 'https://2k21.s3.amazonaws.com/speakers/lalit_singla.jpeg'
    },
    {
      id: 11,
      name: 'Aniket Kamthe',
      designation: 'Investor at Nexus Venture Partners',
      image: 'https://2k21.s3.amazonaws.com/speakers/aniket_kamthe_nexus.jpeg'
    },
    {
      id: 12,
      name: 'Jignesh Kenia',
      designation: 'President and Head, Corporate Strategy and Digital Transformation at Times Network',
      image: 'https://2k21.s3.amazonaws.com/speakers/jignesh_kenia.jpeg'
    },
    {
      id: 13,
      name: 'Aashish Gupta',
      designation: 'Vice President at IvyCap Ventures',
      image: 'https://2k21.s3.amazonaws.com/speakers/aashish_Gupta.jpeg'
    },
    {
      id: 14,
      name: 'Ravin Sanghavi',
      designation: 'Managing Partner at VatVistaar Ventures',
      image: 'https://2k21.s3.amazonaws.com/speakers/ravin_sanghavi.jpeg'
    }
  ];

  pastStartups = [
    {
      name: 'Goat Robotics',
      logo: 'images/past_startups/goat_robotics.svg',
      category: 'Robotics & Automation'
    },
    {
      name: '3 Sisters Drinks',
      logo: 'images/past_startups/3sisters.svg',
      category: 'Beverages & FMCG'
    },
    {
      name: 'Wakao Foods',
      logo: 'images/past_startups/wakao.svg',
      category: 'Plant-Based Food'
    },
    {
      name: 'Zip Teams',
      logo: 'images/past_startups/zipteams.svg',
      category: 'Conversational AI'
    }
  ];

  staticFaqs = [
    {
      number: '01',
      title: 'How to register?',
      content: 'Click on "Register", fill out the details, upload a pitch deck containing information about your startup, and then complete the registration process by buying the Platinum Pass. If you already have a Platinum Pass, just fill out the required details and you are good to go.'
    },
    {
      number: '02',
      title: 'At what stage can startups register for Seed Stars?',
      content: 'Seed-stage startups that have already raised some funding and are preparing for their Series A are preferred. Startups from all sectors are welcome to apply.'
    },
    {
      number: '03',
      title: 'Is the registration free?',
      content: 'By buying the E-Summit Platinum Pass, you will be able to register for Seed Stars.'
    },
    {
      number: '04',
      title: 'What happens after I register?',
      content: 'Our team will evaluate all applications and shortlist startups for an online round with investors. Startups that qualify will then pitch in person at E-Summit 2026.'
    }
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
      // 1. Background image zooms in
      .fromTo('#hero-bg',
        { scale: 0.7, opacity: 0 },
        { scale: 1.05, opacity: 1, duration: 1.2, ease: 'power2.out' }
      )
      // 2. Logo emerges
      .fromTo('.hero-logo-img, .hero-title-text',
        { scale: 0.5, y: 35, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.9, ease: 'back.out(1.6)' },
        '-=0.2'
      )
      // 3. Tagline slides in from bottom
      .fromTo('.hero-tagline',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.4'
      )
      // 4. Buttons slide from bottom
      .fromTo('.hero-action-btn',
        { y: 70, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, stagger: 0.12, ease: 'power3.out' },
        '-=0.3'
      );
  }

  ngOnInit(): void {
    this.getInvestors();
    this.getFaqs();
  }

  register() {
    this.router.navigate(['/seedstars/reg']);
  }

  onButtonClick(handler?: string) {
    this.register();
  }

  getFaqs() {
    this.dataService.getFAQs('seedstars').subscribe({
      next: (res: any) => {
        if (res && Array.isArray(res) && res.length > 0) {
          this.faqs = res.map((faq: any, index: number) => ({
            number: (index + 1).toString().padStart(2, '0'),
            title: faq.question,
            content: faq.answer
          }));
        } else {
          this.faqs = this.staticFaqs;
        }
      },
      error: () => {
        this.faqs = this.staticFaqs;
      }
    });
  }

  getInvestors() {
    this.investors = this.pastInvestorsList;
  }
}
