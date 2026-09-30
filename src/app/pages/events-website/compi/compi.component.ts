import {
  Component,
  OnInit,
  ViewEncapsulation,
  HostListener,
} from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { DialogModule } from 'primeng/dialog';
import { BackgroundImages } from '@constants/enums/background_images_enums';

import { GeneralDataService } from '@services/general-data.service';
import { ContactComponent } from '@shared/contact/contact.component';


import { VantaBgComponent } from "@shared/vanta-bg/vanta-bg.component";
import { EventsBgComponent } from '@shared/events-bg/events-bg.component';
import { AccordionComponent } from '@shared/accordion/accordion.component';


@Component({
  selector: 'app-compi',
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
    AccordionComponent
],
  templateUrl: './compi.component.html',
  styleUrl: './compi.component.scss'
})
export class CompiComponent implements OnInit {

  BackgroundImages = BackgroundImages;
  backgroundImage: any;
  responsiveOptions: any;
  isScrolled = false;
  visible = false;
  event_title: any;
  event_description: any;
  event_image: any;
  faqs: any = [];
  arena_events_details: any = [];
  speakers: any = [];

  compiButtons = [
    { text: 'REGISTER', clickHandler: 'compireg' }
  ];

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    const scrollY = window.scrollY;
    this.isScrolled = scrollY > 200;
  }
  constructor(
    private http: HttpClient,
    private dataService: GeneralDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
   
    this.getFaqs();
    localStorage.setItem('compi_name', '');

  }

  handleButtonClick(handler: string) {
    if (handler === 'RegDeadline') {
      this.RegDeadline();
    } else if (handler === 'compireg') {
      this.openRegForm();
    }
  }

  openRegForm() {
    this.router.navigate(['/compi/reg']);
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
    this.dataService.getFAQs('compi').subscribe((res: any) => {
      this.faqs = res.map((faq: any, index: number) => ({
        number: (index + 1).toString(),
        title: faq.question,
        content: faq.answer
      }));
    });
  }

  goToCompi(compi_name: any) {
    // console.log(compi_name);
    this.router.navigate([`/compi/${compi_name}`]);
  }

  compi_list = [
    {
      name: 'IPL Auction',
      image: 'images/events/compi/ipl_auction.png',
      link: 'ipl',
    },
    {
      name: 'Corporate Duel',
      image: 'images/events/compi/corporate_duel.png',
      link: 'duel',
    },
    {
      name: 'Bid and Build',
      image: 'images/events/compi/bid_and_build.png',
      link: 'bidandbuild',
    },
    {
      name: 'Ace the Case',
      image: 'images/events/compi/ace_the_case.png',
      link: 'ace',
    },
    {
      name: 'Fish Tank',
      image: 'images/events/compi/fish_tank.png',
      link: 'fish',
    },
    {
      name: 'Capital Quest',
      image: 'images/events/compi/capital_quest.png',
      link: 'capitalquest',
    },
    {
      name: 'Deciphering The Labyrinth',
      image: 'images/events/compi/dtl.png',
      link: 'dtl',
    },
    // {
    //   name: 'Coming Soon',
    //   image: 'images/events/compi/cs.avif',
    //   // link: 'compi/reg',
    // },
    // {
    //   name: 'Coming Soon',
    //   image: 'images/events/compi/cs.avif',
    //   // link: 'compi/reg',
    // }
  ];
}
