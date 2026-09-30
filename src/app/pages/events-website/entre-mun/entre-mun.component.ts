import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { DialogModule } from 'primeng/dialog';

import { GeneralDataService } from '@services/general-data.service';
import { ContactComponent } from '@shared/contact/contact.component';

import { TimelineComponent } from '../../../shared/timeline/timeline.component';
import { AccordionComponent } from '@shared/accordion/accordion.component';
import { VantaBgComponent } from "@shared/vanta-bg/vanta-bg.component";
import { EventsBgComponent } from "@shared/events-bg/events-bg.component";
import { BackgroundImages } from '@constants/enums/background_images_enums';
import { GalleryCarouselComponent } from '@shared/gallery-carousel/gallery-carousel.component';
import { EvervaultCardComponent } from "@shared/evervault-card/evervault-card.component";
import { SponsorcardComponent } from '../../sponsor/component/sponsorcard/sponsorcard.component';
import { MunCommitteeCardComponent } from './components/mun-committee-card/mun-committee-card.component';

@Component({
  selector: 'app-mun',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    NavbarComponent,
    RouterLink,
    DialogModule,
    ContactComponent,
    TimelineComponent,
    AccordionComponent,
    VantaBgComponent,
    EventsBgComponent,
    GalleryCarouselComponent,
    EvervaultCardComponent,
    SponsorcardComponent,
    MunCommitteeCardComponent
  ],
  templateUrl: './entre-mun.component.html',
  styleUrls: ['./entre-mun.component.scss'],
})
export class EntreMunComponent implements OnInit, AfterViewInit {

  backgroundImage: any;
  responsiveOptions: any;
  isScrolled = false;
  visible = false;

  faqs: any = [];

  secretariat: any = [];
  school_committees: any = [];
  college_committees: any = [];
  munGallery: any = [];
  munPartner: any = [];
  collegeCommitteeSponsors: any = [];
  schoolCommitteeSponsors: any = [];


  munButtons = [
    { text: 'Individual Registration', routerLink: '/entremun/reg', isGroup: false },
    { text: 'Group Registration', routerLink: null, isGroup: true }
  ];
  BackgroundImages = BackgroundImages;

  onGroupRegistrationClick(event: Event) {
    event.preventDefault();
    Swal.fire({
      title: 'Coming Soon!',
      text: 'We would soon start the group registration.',
      icon: 'info',
      confirmButtonColor: '#FF7A1A'
    });
  }


  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    const scrollY = window.scrollY;
    this.isScrolled = scrollY > 200;
  }

  constructor(private dataService: GeneralDataService) { }

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
      // 3. Buttons slide in from bottom with stagger
      .fromTo('.hero-action-btn',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: 'power3.out' },
        '-=0.6'
      );
  }

  ngOnInit(): void {
    this.getMUNDetails();
    this.getFaqs();
  }

  showQueryDialog() {
    Swal.fire({
      title: 'Have a Query?',
      html: `
        <div style="text-align: center; margin: 20px 0;">
          <p><strong>Contact us for any queries:</strong></p>
          <p>Email: milan@ecell.in</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Send Mail',
      cancelButtonText: 'Close',
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        window.open('mailto:milan@ecell.in?subject=Query about Entre-MUN', '_blank');
      }
    });
  }

  showCommitteeAgenda(committee: any) {
    const agendaHtml = `
      <div style="text-align: ${committee.designation && committee.metadata ? 'left' : 'center'}; margin: 20px 0;">
        ${committee.designation && committee.metadata ? `<p><strong>1.</strong> ${committee.designation}</p>` : committee.designation}
        ${committee.designation && committee.metadata ? `<p><strong>2.</strong> ${committee.metadata}</p>` : committee.metadata}
      </div>
    `;

    Swal.fire({
      title: `${committee.name} - Agenda`,
      html: agendaHtml,
      confirmButtonText: 'Close',
      confirmButtonColor: '#007bff'
    });
  }

  RegDeadline() {
    // Check if user has already registered for MUN
    const userData = localStorage.getItem('user') || localStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        // Check if user has MUN registration (you can add API call here to check backend)
        // For now, checking localStorage for MUN payment status
        const munRegistered = localStorage.getItem('mun-registered') === 'true';

        if (munRegistered) {
          Swal.fire({
            title: 'Already Registered!',
            text: 'You have already registered for MUN.',
            icon: 'success',
            confirmButtonText: 'OK',
          });
          return;
        }
      } catch (error) {
        console.log('Error parsing user data');
      }
    }

    Swal.fire({
      title: 'Registrations are closed!',
      text: 'Registrations for this event are closed!',
      icon: 'info',
      confirmButtonText: 'OK',
    });
  }

  getMUNDetails() {
    this.dataService.getData('mun_school_committees').subscribe((res: any) => {
      this.school_committees = res;
      this.schoolCommitteeSponsors = res.map((committee: any) => ({
        id: committee.id,
        name: committee.name,
        image: committee.image,
        designation: committee.designation,
        link: '#',
        type: 'committee'
      }));
    });
    this.dataService.getData('mun_college_committees').subscribe((res: any) => {
      this.college_committees = res;
      this.collegeCommitteeSponsors = res.map((committee: any) => ({
        id: committee.id,
        name: committee.name,
        image: committee.image,
        designation: committee.designation,
        link: '#',
        type: 'committee'
      }));
    });
    this.dataService.getData('mun_secretariat').subscribe((res: any) => {
      this.secretariat = res;
    });
    this.dataService.getData('mun_gallery').subscribe((res: any) => {
      this.munGallery = res;
    });
    this.dataService.getData('mun_partner').subscribe((res: any) => {
      this.munPartner = res;
    });
  }

  getFaqs() {
    this.dataService.getFAQs('mun').subscribe((res: any) => {
      this.faqs = res.map((faq: any, index: number) => ({
        number: (index + 1).toString().padStart(2, '0'),
        title: faq.question,
        content: faq.answer
      }));
    });
  }
  events = [
    {
      status: 'Priority Registration Round',
      date: '30th September 2026',
    },
    {
      status: 'Priority Registration Closes',
      date: '17th October 2026',
    },
    {
      status: 'Round 1 Registration Opens',
      date: '18th October 2026',
    },
    {
      status: 'Agenda final',
      date: '25th October 2026',
    },
    {
      status: 'Round 1 Registration Closes',
      date: '27th October 2026',
    },
    {
      status: 'Round 2 Registration Opens',
      date: '29th October 2026',
    },
    {
      status: ' Background Guide Release',
      date: '30th October 2026',
    },
    {
      status: 'Round 2 Registration Closes',
      date: '10th November 2026',
    },
    {
      status: 'Round 3 Registration opens',
      date: '12th November 2026',
    },
    {
      status: 'Round 2 Allotments Release',
      date: '15th November 2026',
    },
    {
      status: 'Round 3 Registration closes',
      date: '5th December 2026',
    },
    {
      status: 'Final Allotments Release',
      date: '7th December 2026',
    },
    {
      status: 'Conference Dates',
      date: '11th-13th December 2026',
    },
  ];
}
