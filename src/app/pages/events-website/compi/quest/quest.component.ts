import {
  Component,
  OnInit,
  ViewEncapsulation,
  HostListener,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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


import { EventsBgComponent } from '@shared/events-bg/events-bg.component';
import { BackgroundImages } from '@constants/enums/background_images_enums';
import { TimelineComponent } from '@shared/timeline/timeline.component';
import { AccordionComponent } from '@shared/accordion/accordion.component';
import { VantaBgComponent } from '@shared/vanta-bg/vanta-bg.component';


@Component({
  selector: 'app-quest',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    NavbarComponent,
    RouterLink,
    DialogModule,
    ContactComponent,
    EventsBgComponent,
    TimelineComponent,
    AccordionComponent,
    VantaBgComponent
  ],
  templateUrl: './quest.component.html',
  styleUrls: ['./quest.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestComponent implements OnInit {

  BackgroundImages = BackgroundImages;
  backgroundImage: any;
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
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getFaqs();
    this.getTimeLine();
  }

  getTimeLine() {
    this.dataService.getCOMPITIMELINEs().subscribe((res: any) => {
      this.events = res
        .filter((timeline: any) => timeline.compi_name === 'capital_quest')
        .sort((a: any, b: any) => a.serial_number - b.serial_number)
        .map((timeline: any) => ({
          status: timeline.title,
          date: timeline.subtitle
        }));
      this.cdr.markForCheck();
    });
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
          .filter((faq: any) => faq.compi_name === 'capital_quest')
          .map((faq: any, index: number) => ({
            number: (index + 1).toString(),
            title: faq.question,
            content: faq.answer
          }));
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('FAQ loading error:', err);
        this.faqs = [];
        this.cdr.markForCheck();
      }
    });
  }


  events: any[] = [];
}
