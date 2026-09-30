import {
  Component,
  OnInit,
  ViewEncapsulation,
  HostListener,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { DialogModule } from 'primeng/dialog';
import { GeneralDataService } from '@services/general-data.service';
import { ContactComponent } from '@shared/contact/contact.component';



import { AccordionComponent } from '@shared/accordion/accordion.component';
import { VantaBgComponent } from "@shared/vanta-bg/vanta-bg.component";

@Component({
  selector: 'app-cl',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    NavbarComponent,
    RouterLink,
    DialogModule,
    ContactComponent,
    AccordionComponent,
    VantaBgComponent
],
  templateUrl: './cl.component.html',
  styleUrls: ['./cl.component.scss'],
})
export class CLComponent implements OnInit {


  backgroundImage: any;
  responsiveOptions: any;
  isScrolled = false;
  visible = false;

  faqs: any = [];

  expo_title: any;
  expo_description: any;
  expo_image: any;
  expo_details: any = [];

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    const scrollY = window.scrollY;
    this.isScrolled = scrollY > 200;
  }

  // ShowDetails(i: any) {
  //   this.event_title = this.arena_events_details[i].title;
  //   this.event_description = this.arena_events_details[i].description;
  //   this.event_image = this.arena_events_details[i].image;
  //   this.visible = true;
  // }
  ShowDetails(i: any) {
    this.expo_title = this.expo_details[i].title;
    this.expo_description = this.expo_details[i].description;
    this.expo_image = this.expo_details[i].image;
    this.visible = true;
  }
  constructor(private dataService: GeneralDataService) {}

  ngOnInit(): void {
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
    this.dataService.getFAQs('cl').subscribe((res: any) => {
      this.faqs = res.map((faq: any, index: number) => ({
        number: (index + 1).toString().padStart(2, '0'),
        title: faq.question,
        content: faq.answer
      }));
    });
  }
  events = [
    {
      status: 'Registrations Open',
      date: '13 Dec 2024',
    },
    {
      status: ' Release of detailed schedule',
      date: '19 Jan 2025',
    },
    {
      status: 'Registration Deadline',
      date: '26 Jan 2025',
    },
    {
      status: 'Day of event',
      date: '1 & 2 Feb 2025',
    },
  ];
}
