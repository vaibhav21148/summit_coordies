import {
  Component,
  OnInit,
  ViewEncapsulation,
  HostListener,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { DialogModule } from 'primeng/dialog';
import { GeneralDataService } from '@services/general-data.service';
import { ContactComponent } from '@shared/contact/contact.component';


import { environment } from 'src/environments/environment';

import { VantaBgComponent } from "@shared/vanta-bg/vanta-bg.component";
@Component({
  selector: 'app-acco-pro',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    NavbarComponent,
    DialogModule,
    ContactComponent,
    VantaBgComponent
],
  templateUrl: './acco-pro.component.html',
  styleUrls: ['./acco-pro.component.scss'],
})
export class AccoProComponent implements OnInit {

  backgroundImage: any;
  responsiveOptions: any;
  isScrolled = false;
  visible = false;
  logo: any;
  title: any;
  description: any;
  hotels: any = [];

  general_info: any = [];

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
    this.getHotel();
  }

  RegDeadline() {
    Swal.fire({
      title: 'Registrations are closed!',
      text: 'Registrations for this event are closed!',
      icon: 'info',
      confirmButtonText: 'OK',
    });
  }

  comingSoon() {
    Swal.fire({
      title: 'Coming Soon',
      text: 'Accommodation registrations for professionals will be opened soon!',
      icon: 'info',
      confirmButtonText: 'OK',
    });
  }
  getHotel() {
    this.http
      .get(environment.API_URL + '/acco_hotel/')
      .subscribe((res: any) => {
        // console.log(res);
        this.hotels = res.details;
        // console.log(this.hotels);
      });
  }
}
