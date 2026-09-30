import { HttpClient } from '@angular/common/http';
import {
  Component,
  HostListener,
  OnInit,
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
import { BackgroundImages } from '@constants/enums/background_images_enums';

@Component({
  selector: 'app-vsm',
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
  templateUrl: './vsm.component.html',
  styleUrl: './vsm.component.scss',
})
export class VsmComponent implements OnInit {

  backgroundImage = BackgroundImages;
  responsiveOptions: any;
  isScrolled = false;
  faqs: any = [];

  vsmButtons = [
    { text: 'REGISTER', clickHandler: 'regDeadline' }
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
  ngOnInit() {
    // AOS.init({
    //   duration: 800,
    //   easing: 'ease-in-out',
    //   // once: true  // animate only once
    // });
    this.getFaqs();
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

  onButtonClick(handler: string) {
    if (handler === 'regDeadline') {
      this.RegDeadline();
    }
  }

  RegDeadline() {
    this.router.navigate(['/vsm/reg']);
  }

  getFaqs() {
    this.dataService.getFAQs('vsm').subscribe((res: any) => {
      this.faqs = res.map((faq: any, index: number) => ({
        number: (index + 1).toString().padStart(2, '0'),
        title: faq.question,
        content: faq.answer
      }));
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

  // gallery = [
  //   {
  //     image: 'image/gallery1.jpg',
  //   },
  //   {
  //     image: 'image/gallery1.jpg',
  //   },
  //   {
  //     image: 'image/gallery1.jpg',
  //   },
  //   {
  //     image: 'image/gallery1.jpg',
  //   },
  //   {
  //     image: 'image/gallery1.jpg',
  //   },
  //   {
  //     image: 'image/gallery1.jpg',
  //   },
  //   {
  //     image: 'image/gallery1.jpg',
  //   },
  //   {
  //     image: 'image/gallery1.jpg',
  //   },
  //   {
  //     image: 'image/gallery1.jpg',
  //   },
  // ];

  events = [
    {
      status: 'Registrations Open',
      date: '18th November 2025'
    },
    {
      status: 'Registration Deadline',
      date: '22nd November 2025'
    },
    {
      status: 'Final Competition Day',
      date: '25th November 2025'
    },
  ];
}
