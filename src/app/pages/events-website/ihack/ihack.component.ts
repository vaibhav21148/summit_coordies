import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { GeneralDataService } from '@services/general-data.service';
import { ContactComponent } from '@shared/contact/contact.component';
import { CarouselComponent } from '@shared/css-carousel/carousel.component';



import { EvervaultCardComponent } from '@shared/evervault-card/evervault-card.component';
import { TimelineComponent } from '../../../shared/timeline/timeline.component';
import { AccordionComponent } from '@shared/accordion/accordion.component';
import { VantaBgComponent } from "@shared/vanta-bg/vanta-bg.component";
import { EventsBgComponent } from "@shared/events-bg/events-bg.component";
import { BackgroundImages } from '@constants/enums/background_images_enums';

@Component({
  selector: 'app-ihack',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    NavbarComponent,
    RouterLink,
    ContactComponent,
    CarouselComponent,
    EvervaultCardComponent,
    TimelineComponent,
    AccordionComponent,
    VantaBgComponent,
    EventsBgComponent
],
  templateUrl: './ihack.component.html',
  styleUrl: './ihack.component.scss',
})
export class IhackComponent implements OnInit {

  // showSpline = true;

  backgroundImage: any;
  responsiveOptions: any;
  isScrolled = false;
  faqs: any = [];
  investors: any = [];

  
  carouselImages = [
    'https://2k21.s3.amazonaws.com/s3uploadapi/ihack1.png',
    'https://2k21.s3.amazonaws.com/s3uploadapi/ihack2.png',
    'https://2k21.s3.amazonaws.com/s3uploadapi/ihack3.png',
    'https://2k21.s3.amazonaws.com/s3uploadapi/ihack4.png',
    'https://2k21.s3.amazonaws.com/s3uploadapi/ihack5.png',
  ];

  jwt: string | null = null;

  BackgroundImages = BackgroundImages;

  ihackButtons = [
    { text: 'Register', routerLink: '/ihack/reg' },
    { text: 'Make Submission', routerLink: '/ihack/sub' },
  ];
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    const scrollY = window.scrollY;
    this.isScrolled = scrollY > 200;
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private dataService: GeneralDataService
  ) {}
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

  RegDeadline() {
    Swal.fire({
      title: 'Registrations are closed!',
      text: 'Registrations for this event are closed!',
      icon: 'info',
      confirmButtonText: 'OK',
    });
  }

  getFaqs() {
    this.dataService.getFAQs('i-hack').subscribe((res: any) => {
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

  events: {
    status: string;
    date: string;
    description?: string;
    sub_events?: { status: string; date: string; description?: string }[];
  }[] = [
    {
      status: 'Registrations Open',
      date: '13 Dec 2024',
    },
    {
      status: 'Registration Deadline',
      date: '3 Jan 2025',
    },
    {
      status: 'Semi-Finalists Declaration',
      date: '10 Jan 2025',
    },
    {
      status: 'Finalists Declaration',
      date: '15 Jan 2025',
    },
    {
      status: 'The Grand Finale',
      date: '1 & 2 Feb 2025',
      sub_events: [
        {
          status: 'Day 1',
          date: '1 Feb 2025',
          description: 'Funding Amount: 2.4 Million INR',
        },
        {
          status: 'Day 2',
          date: '2 Feb 2025',
          description: 'Funding Amount: 3.5 Million INR',
        },
      ],
    },
  ];
}
