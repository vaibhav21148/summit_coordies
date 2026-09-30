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
import { FooterComponent } from '../../../../components/footer/footer.component';
import { NavbarComponent } from '../../../../components/navbar/navbar.component';
import { DialogModule } from 'primeng/dialog';
import { GeneralDataService } from '@services/general-data.service';
import { ContactComponent } from '@shared/contact/contact.component';


import { TimelineComponent } from '@shared/timeline/timeline.component';
import { E } from '@angular/cdk/keycodes';
import { EventsBgComponent } from '@shared/events-bg/events-bg.component';
import { VantaBgComponent } from '@shared/vanta-bg/vanta-bg.component';
import { BackgroundImages } from '@constants/enums/background_images_enums';
import { AccordionComponent } from '@shared/accordion/accordion.component';

@Component({
  selector: 'app-fish',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    NavbarComponent,
    RouterLink,
    DialogModule,
    ContactComponent,
    TimelineComponent,
    EventsBgComponent,
    VantaBgComponent,
    AccordionComponent
  ],
  templateUrl: './fish.component.html',
  styleUrls: ['./fish.component.scss'],
})
export class FishComponent implements OnInit {


  backgroundImage: any;
  BackgroundImages = BackgroundImages;
  responsiveOptions: any;
  isScrolled = false;
  visible = false;
  faqs: any = [];
  timelines: any = [];

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    const scrollY = window.scrollY;
    this.isScrolled = scrollY > 200;
  }

  constructor(
    private http: HttpClient,
    private dataService: GeneralDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getFaqs();
    this.getTimeLine();
  }

  compiButtons = [
    { text: 'REGISTER', clickHandler: 'compireg' }
  ];

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
    this.dataService.getCOMPIFAQs().subscribe({
      next: (res: any) => {
        this.faqs = res
          .filter((faq: any) => faq.compi_name === 'fish_tank')
          .map((faq: any, index: number) => ({
            number: (index + 1).toString(),
            title: faq.question,
            content: faq.answer
          }));
      },
      error: (err) => {
        console.error('FAQ loading error:', err);
        this.faqs = [];
      }
    });
  }

  getTimeLine() {
    this.dataService.getCOMPITIMELINEs().subscribe((res: any) => {
      this.events = res
        .filter((timeline: any) => timeline.compi_name === 'fish_tank')
        .sort((a: any, b: any) => a.serial_number - b.serial_number)
        .map((timeline: any) => ({
          status: timeline.title,
          date: timeline.subtitle
        }));
    });
  }

  events: any[] = [];
}
