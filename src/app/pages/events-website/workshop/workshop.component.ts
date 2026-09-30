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
import { WorkshopService, Workshop } from '@services/workshop.service';
import { ContactComponent } from '@shared/contact/contact.component';
import { AuthService } from '@services/auth.service';
import { PassType, PassTypeMapping } from '@constants/enums/passtype.enum';
import { handleAPIException, getErrorMessage } from 'src/app/utils/error';

import { VantaBgComponent } from "@shared/vanta-bg/vanta-bg.component";
import { TimelineComponent } from "@shared/timeline/timeline.component";
import { EvervaultCardComponent } from "@shared/evervault-card/evervault-card.component";
import { SponsorcardComponent } from "../../sponsor/component/sponsorcard/sponsorcard.component";

@Component({
  selector: 'app-workshop',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    NavbarComponent,
    RouterLink,
    DialogModule,
    ContactComponent,
    VantaBgComponent,
    TimelineComponent,
    EvervaultCardComponent,
    SponsorcardComponent
],
  templateUrl: './workshop.component.html',
  styleUrls: ['./workshop.component.scss'],
})
export class WorkshopComponent implements OnInit {

  backgroundImage: any;
  responsiveOptions: any;
  isScrolled = false;
  visible: any;
  visible2: any;
  workshop: Workshop[] = [];
  userRegistrations: { [key: string]: boolean } = {};
  hasRegistrations = false;
  innerpopup: any;
  innerworkshopname: any;
  faqs: any = [];

  firstName: any;
  lastName: any;
  email: any;
  contact: any;

  passTypes = PassType;
  passTypeMapping = PassTypeMapping;
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    const scrollY = window.scrollY;
    this.isScrolled = scrollY > 200;
  }

  ShowDetails(index: any) {
    this.innerpopup = this.workshop[index].rules;
    this.innerworkshopname = this.workshop[index].workshop_name;
    this.visible = true;
  }

  navigateToRegistration() {
    this.router.navigate(['/workshops/reg']);
  }
  constructor(
    private http: HttpClient,
    private dataService: GeneralDataService,
    private workshopService: WorkshopService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.fetchDetails();
      this.loadWorkshops();
    } else {
      this.loadWorkshopsPublic();
    }
    this.getFaqs();
  }

  async fetchDetails() {
    try {
      await this.auth.getUserInfo('summit_pass', true);

      this.firstName = this.auth.getStoredUserInfo('firstName');
      this.lastName = this.auth.getStoredUserInfo('lastName');
      this.email = this.auth.getStoredUserInfo('email');
      this.contact = this.auth.getStoredUserInfo('contact');
    } catch (e) {
      console.error(e);
      const errorMessage = getErrorMessage(e);
      handleAPIException(errorMessage);
    }
  }

  get summit_pass() {
    // console.log(this.auth.getStoredUserInfo("summit_pass"))
    return this.auth.getStoredUserInfo('summit_pass');
  }

  get passLabel() {
    const summitPass = this.auth.getStoredUserInfo('summit_pass');
    return this.auth.getPassLabel(summitPass);
  }

  async loadWorkshops() {
    try {
      const response = await this.workshopService.getWorkshops();
      this.workshop = response.workshops;
      this.userRegistrations = response.user_registrations;
      this.hasRegistrations = response.has_registrations;
    } catch (error) {
      console.error('Error loading workshops:', error);
      // Fallback to old API
      this.loadWorkshopsPublic();
    }
  }

  loadWorkshopsPublic() {
    this.dataService.getData('workshops').subscribe((res: any) => {
      this.workshop = res.workshops || [];
    });
  }

  set summit_pass(value) {}

  isWorkshopRegistered(workshopName: string): boolean {
    return this.userRegistrations[workshopName] || false;
  }

  getRegistrationButtonText(workshop: Workshop): string {
    if (!this.auth.isLoggedIn()) {
      return 'Register';
    }
    if (this.isWorkshopRegistered(workshop.workshop_name)) {
      return 'Registered';
    }
    return 'Register';
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
    this.dataService.getFAQs('workshop').subscribe((res: any) => {
      this.faqs = res;
    });
  }

  events = [
    {
      status: 'Registrations Open',
      date: '27th October 2025',
    },
    {
      status: ' Registrations Close',
      date: '9th December 2025',
    },
    {
      status: 'Workshop',
      date: '10th December 2025',
    },
  ];

  formatTime(time: string): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  }
}
