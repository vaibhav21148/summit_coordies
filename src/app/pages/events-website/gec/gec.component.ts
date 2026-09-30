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
  selector: 'app-gec',
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
  templateUrl: './gec.component.html',
  styleUrl: './gec.component.scss',
})
export class GecComponent implements OnInit {

  backgroundImage = BackgroundImages;
  responsiveOptions: any;
  isScrolled = false;
  faqs: any = [];

  gecButtons = [
    { text: 'REGISTER', clickHandler: 'regDeadline' },
    { text: 'BROCHURE', clickHandler: 'brochure' }
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

  onButtonClick(handler: string) {
    if (handler === 'regDeadline') {
      this.RegDeadline();
    } else if (handler === 'brochure') {
      this.openBrochure();
    }
  }

  RegDeadline() {
    this.router.navigate(['/gec/reg']);
  }

  openBrochure() {
    window.open('https://docs.google.com/document/d/1Cgdei7Jsjuwp6MtnEd-dkqc7LEsC9T3bsRV4_btSX5k/edit?usp=sharing', '_blank');
  }

  getFaqs() {
    this.dataService.getFAQs('gec').subscribe((res: any) => {
      this.faqs = res.map((faq: any, index: number) => ({
        number: (index + 1).toString().padStart(2, '0'),
        title: faq.question,
        content: faq.answer
      }));
    });
  }

  events = [
    {
      status: 'Bootcamp: University-Based Entrepreneurship Ecosystem — Innovation frameworks, case studies, hands-on learning and expert-led sessions',
      date: '8–9 December 2025'
    },
    {
      status: 'Ecosystem Tour: SINE, Research Park and Mumbai startup ecosystem',
      date: '10th December 2025'
    },
    {
      status: 'Cross-Border Dialogues: Roundtables, presentations, keynote and networking',
      date: '11th December 2025'
    },
    {
      status: '22nd E-Summit Immersion: Startup Expo, TTMM and closing ceremony',
      date: '12th December 2025'
    }
  ];
}
