import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { DialogModule } from 'primeng/dialog';
import { GeneralDataService } from '@services/general-data.service';
import { ContactComponent } from '@shared/contact/contact.component';
import { GravityBgComponent } from '@shared/gravity-bg/gravity-bg.component';


import { SponsorcardComponent } from './component/sponsorcard/sponsorcard.component';


interface Incentive {
  link: string;
  img: string;
  title: string;
}

@Component({
  selector: 'app-sponsor',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    NavbarComponent,
    DialogModule,
    ContactComponent,
    SponsorcardComponent,
    GravityBgComponent
  ],
  templateUrl: './sponsor.component.html',
  styleUrls: ['./sponsor.component.scss'],
})
export class SponsorComponent implements OnInit {

  backgroundImage: any;
  responsiveOptions: any;
  isScrolled = false;
  visible = false;
  logo: any;
  description: any;
  general_info: any = [];
  lif: any;
  lift: Incentive[] = [];
  displayStyles = 'block';
  sponsors: Record<string, any[] | undefined> = {};
  markiData: any[] = [];
  mediaData: any[] = [];

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    const scrollY = window.scrollY;
    this.isScrolled = scrollY > 200;
  }

  constructor(
    private http: HttpClient,
    private dataService: GeneralDataService
  ) { }

  ngOnInit(): void {
    this.getSponsors();
    this.getTeam();
  }

  getTeam() {
    this.http
      .get('https://apiserver.ecell.in/mainpage/team/')
      .subscribe((res: any) => {
        this.markiData = [];
        this.mediaData = [];
        for (let i = 0; i < res.length; i++) {
          if (res[i].designation === 'Marketing Head') {
            this.markiData.push(res[i]);
          } else if (res[i].designation === 'Media Head') {
            this.mediaData.push(res[i]);
          }
        }
      });
  }

  getSponsors() {
    this.http.get('https://apiserver.ecell.in/admin/summit26/sponsorsandpartners/').subscribe((data: any) => {
      this.sponsors = data;
      console.log(this.sponsors);
    });
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
}
