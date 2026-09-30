import { Component, HostListener } from '@angular/core';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ContactComponent } from '@shared/contact/contact.component';

import { GeneralDataService } from '@services/general-data.service';
import { Endpoint } from '@constants/enums/endpoints.enum';
import { SpeakerCardComponent } from './speaker-card/speaker-card.component';
import { GravityBgComponent } from '@shared/gravity-bg/gravity-bg.component';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-speakers',
  templateUrl: './speakers.component.html',
  styleUrls: ['./speakers.component.scss'],
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, ContactComponent, SpeakerCardComponent, GravityBgComponent],
})
export class SpeakersComponent {
  backgroundImage: any;
  responsiveOptions: any;
  isScrolled = false;
  speakers: any = [];
  pastSpeakers: any = [];
  crData: any = [];

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    const scrollY = window.scrollY;
    this.isScrolled = scrollY > 200;
  }

  constructor(
    private http: HttpClient,
    private dataService: GeneralDataService
  ) {
    this.getSpeakers();
    this.getPastSpeakers();
    this.getCr();
  }

  getCr() {
    this.http
      .get('https://apiserver.ecell.in/mainpage/team/')
      .subscribe((res) => {
        const data: any = res;
        for (let i = 0; i < data.length; i++) {
          if (data[i].designation == 'Corporate Relations Head') {
            this.crData.push(data[i]);
          }
        }
      });
  }

  getPastSpeakers() {
    this.http
      .get('https://apiserver.ecell.in/mainpage/inspirational-speakers/')
      .subscribe({
        next: (res: any) => {
          const data: any = res || [];
          this.pastSpeakers = data.sort(
            (a: any, b: any) => Number(a.serial_number || 0) - Number(b.serial_number || 0)
          );
        },
        error: () => {
          this.http
            .get(`${environment.API_URL}/speakers/`)
            .subscribe((res: any) => {
              this.pastSpeakers = res || [];
            });
        }
      });
  }

  getSpeakers() {
    this.http
      .get(`${environment.API_URL}/current_speakers/`)
      .subscribe((res: any) => {
        this.speakers = res || [];
      });
  }

  onMouseMove(event: MouseEvent, index: number) {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) / 10;
    const y = (event.clientY - rect.top - rect.height / 2) / 10;

    const cardInner = card.querySelector('.card-inner') as HTMLElement;
    if (cardInner) {
      cardInner.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;

      const image = cardInner.querySelector('.card-image') as HTMLElement;
      const details = cardInner.querySelector('.card-details') as HTMLElement;

      if (image) {
        image.style.transform = `translateZ(400px)`;
      }
      if (details) {
        details.style.transform = `translateZ(450px)`;
      }
    }
  }

  onMouseLeave(index: number) {
    const cardInner = document.querySelector(`[data-index="${index}"]`) as HTMLElement;
    if (cardInner) {
      cardInner.style.transform = 'rotateY(0deg) rotateX(0deg)';

      const image = cardInner.querySelector('.card-image') as HTMLElement;
      const details = cardInner.querySelector('.card-details') as HTMLElement;

      if (image) {
        image.style.transform = `translateZ(0px)`;
      }
      if (details) {
        details.style.transform = `translateZ(0px)`;
      }
    }
  }

  // getSpeakers() {
  //   this.http
  //     .get('https://apiserver.ecell.in/mainpage/inspirational-speakers/')
  //     .subscribe((res: any) => {
  //       const data: any = res;
  //       this.speakers = data.sort(
  //         (a: any, b: any) => a.serial_number - b.serial_number
  //       );
  //       console.log(this.speakers);
  //     });
  // }
}
