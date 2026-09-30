import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  HostListener,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { DialogModule } from 'primeng/dialog';
import { GeneralDataService } from '@services/general-data.service';
import { ContactComponent } from '@shared/contact/contact.component';


import { BackgroundImages } from '@constants/enums/background_images_enums';
import { CarouselComponent } from '@shared/css-carousel/carousel.component';

import { EventsBgComponent } from '@shared/events-bg/events-bg.component';
import { VantaBgComponent } from "@shared/vanta-bg/vanta-bg.component";
import { AccordionComponent } from '@shared/accordion/accordion.component';
import { GreenovationHeroComponent } from './greenovation-hero/greenovation-hero.component';
import { EvervaultCardComponent } from '@shared/evervault-card/evervault-card.component';
import { getErrorMessage, handleAPIException } from 'src/app/utils/error';
import { environment } from 'src/environments/environment';
import { Endpoint } from '@constants/enums/endpoints.enum';
import { AuthService } from '@services/auth.service';
import * as AOS from 'aos';

@Component({
  selector: 'app-acco',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    NavbarComponent,
    RouterLink,
    DialogModule,
    ContactComponent,
    CarouselComponent,
    EventsBgComponent,
    VantaBgComponent,
    AccordionComponent,
    GreenovationHeroComponent,
    EvervaultCardComponent
  ],
  templateUrl: './acco.component.html',
  styleUrls: ['./acco.component.scss'],
})
export class AccoComponent implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    // Close the SweetAlert if user navigates away
    Swal.close();
  }

  backgroundImage = BackgroundImages.ACCO;
  responsiveOptions: any;
  isScrolled = false;
  visible = false;
  showComingSoon = false;

  // accoButtons = [
  //   { text: 'Register for Student', routerLink: '/acco/reg' },
  //   { text: 'Register for Professional', routerLink: '/acco/pro' }
  // ];
  greenovationButtons = [
    { text: 'Register for Challenge', routerLink: '/greenovation/reg' },
    { text: 'Submit Project', clickHandler: 'submission' },
  ];

  onButtonClick(handler: string) {
    if (handler === 'submission') {
      this.handleSubmission();
    }
  }

  handleSubmission() {
    if (!this.auth.isLoggedIn()) {
      this.auth.redirectToLogin();
    } else {
      window.location.href = '/dashboard/greenovation-status';
    }
  }

  faqs: any = [];
  mappedFaqs: any = [];
  logo: any;
  title: any;
  description: any;

  general_info: any = [];
  // expo_title: any;
  // expo_description: any;
  // expo_image: any;
  // expo_details: any = [];
  carouselImages = [
    'images/acco/frames/frame_0001.jpg',
    'images/acco/frames/frame_0015.jpg',
    'images/acco/frames/frame_0030.jpg',
    'images/acco/frames/frame_0045.jpg',
    'images/acco/frames/frame_0060.jpg',
  ];

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    const scrollY = window.scrollY;
    this.isScrolled = scrollY > 200;
  }

  // ShowDetails(i: any) {
  //   this.expo_title = this.expo_details[i].title;
  //   this.expo_description = this.expo_details[i].description;
  //   this.expo_image = this.expo_details[i].image;
  //   this.visible = true;
  // }
  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private dataService: GeneralDataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Initialize AOS
    AOS.init({
      duration: 500,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });

    // Check if user has already submitted pre-acco details
    this.showComingSoon = false;
    // const alreadySubmitted = localStorage.getItem('preAccoSubmitted');
    // if (alreadySubmitted) {
    //   // User already filled details, show coming soon directly
    //   this.showComingSoon = true;
    // } else {
    //   // Show the SweetAlert popup for collecting details
    //   this.showPreAccoPopup();
    // }

    // this.getWhyExpo();
    this.getInfo();
    this.getFaqs();
  }

  showPreAccoPopup() {
    Swal.fire({
      title: 'Accommodation Opening Soon!',
      html: `
        <p style="margin-bottom: 1rem; color: #ccc; font-size: 0.95rem;">
          We are soon starting the Accommodation!<br>To get the latest updates for Accommodation, fill in your details below.
        </p>
        <input type="text" id="swal-name" class="swal2-input" placeholder="Full Name" style="margin-bottom: 0.5rem;">
        <input type="email" id="swal-email" class="swal2-input" placeholder="Email" style="margin-bottom: 0.5rem;">
        <input type="text" id="swal-contact" class="swal2-input" placeholder="Contact Number">
      `,
      background: '#1a1a2e',
      color: '#ffffff',
      confirmButtonText: 'Submit',
      confirmButtonColor: '#FF7A1A',
      showCancelButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      focusConfirm: false,
      preConfirm: () => {
        const name = (document.getElementById('swal-name') as HTMLInputElement)?.value?.trim();
        const email = (document.getElementById('swal-email') as HTMLInputElement)?.value?.trim();
        const contact = (document.getElementById('swal-contact') as HTMLInputElement)?.value?.trim();

        if (!name || !email || !contact) {
          Swal.showValidationMessage('Please fill in all fields');
          return false;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          Swal.showValidationMessage('Please enter a valid email address');
          return false;
        }

        // Basic contact validation (at least 10 digits)
        const contactRegex = /^\d{10,}$/;
        if (!contactRegex.test(contact)) {
          Swal.showValidationMessage('Please enter a valid contact number (at least 10 digits)');
          return false;
        }

        return { name, email, contact };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const { name, email, contact } = result.value;

        // POST to backend
        this.http.post(`${environment.API_URL}/pre_acco/`, {
          name,
          email,
          contact
        }).subscribe({
          next: (res: any) => {
            // Save to localStorage so popup doesn't show again
            localStorage.setItem('preAccoSubmitted', 'true');
            this.showComingSoon = true;
          },
          error: (err: HttpErrorResponse) => {
            // Even on error, mark as submitted to avoid annoying the user
            localStorage.setItem('preAccoSubmitted', 'true');
            this.showComingSoon = true;
          }
        });
      }
    });
  }

  RegDeadline() {
    Swal.fire({
      title: 'Registrations are closed!',
      text: 'Registrations for Greenovation Challenge are closed!',
      icon: 'info',
      confirmButtonText: 'OK',
    });
  }

  comingSoon() {
    Swal.fire({
      title: 'Coming Soon',
      text: 'Greenovation Challenge submissions will be opened soon!',
      icon: 'info',
      confirmButtonText: 'OK',
    });
  }
  showInfo(i: any) {
    this.visible = true;
    this.logo = this.general_info[i].logo;
    this.title = this.general_info[i].title;
    this.description = this.general_info[i].description;
  }
  getInfo() {
    this.http
      .get('https://apiserver.ecell.in/esummit26/acco_info/')
      .subscribe((res: any) => {
        const data: any = res;
        this.general_info = data.info;
        console.log(this.general_info);
      });
  }

  getFaqs() {
    this.dataService.getFAQs('acco').subscribe((res: any) => {
      this.faqs = res;
      this.mappedFaqs = res.map((faq: any, index: number) => ({
        number: (index + 1).toString().padStart(2, '0'),
        title: faq.question,
        content: faq.answer
      }));
    });
  }

  events = [
    {
      status: 'Challenge Launch',
      date: '15 Dec 2024',
    },
    {
      status: 'Team Registration Deadline',
      date: '20 Jan 2025',
    },
    {
      status: 'Project Submission Deadline',
      date: '28 Jan 2025',
    },
    {
      status: 'Final Presentations',
      date: '1 & 2 Feb 2025',
    },
  ];

}
