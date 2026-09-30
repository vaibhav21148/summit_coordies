import {
  Component,
  OnInit,
  ViewEncapsulation,
  HostListener,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { DialogModule } from 'primeng/dialog';
import { GeneralDataService } from '@services/general-data.service';
import { ContactComponent } from '@shared/contact/contact.component';


import { BackgroundImages } from '@constants/enums/background_images_enums';

import { VantaBgComponent } from "@shared/vanta-bg/vanta-bg.component";
import { EventsBgComponent } from "@shared/events-bg/events-bg.component";
import { EvervaultCardComponent } from "@shared/evervault-card/evervault-card.component";
import { TimelineComponent } from "@shared/timeline/timeline.component";
import { SpeakerCardComponent } from "../../speakers/speaker-card/speaker-card.component";
import { SponsorcardComponent } from "../../sponsor/component/sponsorcard/sponsorcard.component";
import { AccordionComponent } from "@shared/accordion/accordion.component";
@Component({
  selector: 'app-ijf',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    NavbarComponent,
    RouterLink,
    DialogModule,
    ContactComponent,
    VantaBgComponent,
    EventsBgComponent,
    EvervaultCardComponent,
    TimelineComponent,
    SpeakerCardComponent,
    SponsorcardComponent,
    AccordionComponent
],
  templateUrl: './ijf.component.html',
  styleUrls: ['./ijf.component.scss'],
})
export class IjfComponent implements OnInit {

  BackgroundImages = BackgroundImages;

  backgroundImage: any;
  responsiveOptions: any;
  isScrolled = false;
  visible = false;

  faqs: any = [];
  speakers: any = [];

  expo_title: any;
  expo_description: any;
  expo_image: any;
  expo_details: any = [];
  
  ijfButtons = [
    { text: 'Register as Student', routerLink: '/ijf/studreg' },
    { text: 'Register as recruiter', routerLink: '/ijf/compreg' },
  ];
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    const scrollY = window.scrollY;
    this.isScrolled = scrollY > 200;
  }

  constructor(
    private http: HttpClient,
    private dataService: GeneralDataService
  ) {}

  ngOnInit(): void {
    this.getSpeakers();
    this.getFaqs();
  }

  RegDeadline() {
    Swal.fire({
      title: 'Registrations are closed!',
      text: 'Registrations for this event are closed!',
      icon: 'info',
      confirmButtonText: 'OK',
    });
  }

  getFaqs() {
    this.dataService.getFAQs('ijf').subscribe((res: any) => {
            this.faqs = res.map((faq: any, index: number) => ({
        number: (index + 1).toString().padStart(2, '0'),
        title: faq.question,
        content: faq.answer
      }));
    });
  }

  getSpeakers() {
    this.dataService.getData('ijf_recruiters').subscribe((res: any) => {
      this.speakers = res;
    });
  }

  events = [
    {
      status: 'Registrations Open',
      date: '12th September 2025',
    },
    {
      status: 'Application for individual companies begins',
      date: '12th September 2025',
    },
    {
      status: 'Shortlisting of Participants',
      date: '4th December 2025',
    },
    {
      status: 'Final Interviews',
      date: '11th-12th December 2025',
    },
  ];
}
