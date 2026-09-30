import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { AuthService } from '@services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Endpoint } from '@constants/enums/endpoints.enum';
import { getErrorMessage, handleAPIException } from 'src/app/utils/error';
import { CometCardComponent } from '@shared/comet-card/comet-card.component';
import { CommonModule } from '@angular/common';

const NO_WEBSITE_TAGS: string[] = [];

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [RouterLink, CommonModule, CometCardComponent],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss',
})
export class EventCardComponent {
  @Input() event!: any;
  hasWebsite = true;

  randomDelay1 = `${Math.random() * -5}s`;
  randomDelay2 = `${Math.random() * -5}s`;
  randomDelay3 = `${Math.random() * -5}s`;
  randomDuration1 = `${6 + Math.random() * 4}s`;
  randomDuration2 = `${7 + Math.random() * 4}s`;
  randomDuration3 = `${5 + Math.random() * 3}s`;

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  getMaskUrl(url: string): SafeStyle {
    if (!url) return '';
    return this.sanitizer.bypassSecurityTrustStyle(`url(${url})`);
  }

  ngOnInit() {
    this.hasWebsite = !NO_WEBSITE_TAGS.includes(this.event?.tag);
    const tag = (this.event?.tag || '').toLowerCase().trim();
    const name = (this.event?.name || '').toLowerCase().trim();
    if (tag === 'seedstars' || tag === 'seedstar' || tag === 'seed-stars' || name.includes('seed star') || name.includes('seedstar')) {
      this.event.big_image = 'images/seedstars_logo.png';
      this.event.image = 'images/seedstars_logo.png';
    }
  }

  hasEventWebsite(event: any): boolean {
    return !!this.getWebsiteUrl(event);
  }

  isRegistrationOpen(event: any): boolean {
    if (event?.registrations_open) return true;
    const tag = (event?.tag || '').toLowerCase().trim();
    const name = (event?.name || '').toLowerCase().trim();
    return tag === 'ttmm' || tag === 'expo' || tag === 'isummit' || tag === 'i_summit' || tag === 'i-summit' || tag === 'seedstars' || tag === 'seedstar' || tag === 'seed-stars' ||
      name.includes('ten minute million') || name.includes('startup expo') || name.includes('incubator') || name.includes('isummit') || name.includes('seed star') || name.includes('seedstar');
  }

  getWebsiteUrl(event: any): string {
    const tag = (event?.tag || '').toLowerCase().trim();
    const name = (event?.name || '').toLowerCase().trim();
    if (tag === 'ttmm' || name.includes('ten minute million') || name.includes('ttmm')) {
      return '/ttmm';
    } else if (tag === 'expo' || name.includes('startup expo') || name.includes('expo')) {
      return '/expo';
    } else if (tag === 'seedstars' || tag === 'seedstar' || tag === 'seed-stars' || name.includes('seed star') || name.includes('seedstar') || name.includes('seedstars')) {
      return '/seedstars';
    } else if (tag === 'isummit' || tag === 'i_summit' || tag === 'i-summit' || name.includes('incubator') || name.includes('isummit') || name.includes('i-summit') || name.includes('i summit')) {
      return '/isummit';
    } else if (tag === 'mun' || tag === 'entremun' || tag === 'entre-mun' || name.includes('entre-mun') || name.includes('entremun') || name.includes('mun')) {
      return '/entremun';
    } else if (tag === 'gec' || name.includes('global entrepreneurship') || name.includes('gec')) {
      return '/gec';
    } else if (tag === 'na' || name.includes('networking arena')) {
      return '/na';
    } else if (tag === 'workshop' || tag === 'workshops' || name.includes('workshop')) {
      return '/workshops';
    } else if (tag === 'ihack' || tag === 'i-hack' || name.includes('ihack') || name.includes('i-hack')) {
      return '/ihack';
    } else if (tag === 'ijf' || name.includes('internship') || name.includes('job fair')) {
      return '/ijf';
    } else if (tag === 'compi' || name.includes('competition')) {
      return '/compi';
    } else if (tag === 'cl' || name.includes('contingent')) {
      return '/cl';
    } else if (tag === 'influencer' || name.includes('influencer')) {
      return '/influencer';
    } else if (tag) {
      return `/${tag}`;
    }
    return '';
  }

  goToWebsite(event: any) {
    const url = this.getWebsiteUrl(event);
    if (url) {
      const urlTree = this.router.serializeUrl(this.router.createUrlTree([url]));
      window.open(urlTree, '_blank');
    }
  }

  eventReg(event: any) {
    const event_tag = (event?.tag || '').toLowerCase().trim();
    const name = (event?.name || '').toLowerCase().trim();
    let pageURL: string;
    
    if (event_tag === 'expo' || name.includes('startup expo') || name.includes('expo')) {
      pageURL = '/expo/query';
    } else if (event_tag === 'seedstars' || event_tag === 'seedstar' || event_tag === 'seed-stars' || name.includes('seed star') || name.includes('seedstar') || name.includes('seedstars')) {
      pageURL = '/seedstars/reg';
    } else if (event_tag === 'ttmm' || name.includes('ten minute million') || name.includes('ttmm')) {
      pageURL = '/ttmm/reg';
    } else if (event_tag === 'isummit' || event_tag === 'i_summit' || event_tag === 'i-summit' || name.includes('incubator') || name.includes('isummit') || name.includes('i-summit') || name.includes('i summit')) {
      pageURL = '/isummit/reg';
    } else if (event_tag === 'mun' || event_tag === 'entremun' || event_tag === 'entre-mun' || name.includes('entre-mun') || name.includes('entremun') || name.includes('mun')) {
      pageURL = '/entremun/reg';
    } else if (event_tag === 'gec' || name.includes('global entrepreneurship') || name.includes('gec')) {
      pageURL = '/gec/reg';
    } else if (event_tag === 'na' || name.includes('networking arena')) {
      pageURL = '/na/reg';
    } else if (event_tag === 'workshop' || event_tag === 'workshops' || name.includes('workshop')) {
      pageURL = '/workshop/reg';
    } else if (event_tag === 'ihack' || event_tag === 'i-hack' || name.includes('ihack') || name.includes('i-hack')) {
      pageURL = '/ihack/reg';
    } else if (event_tag === 'ijf' || name.includes('internship') || name.includes('job fair')) {
      pageURL = '/ijf';
    } else if (event_tag === 'compi' || name.includes('competition')) {
      pageURL = '/compi/reg';
    } else if (event_tag === 'cl' || name.includes('contingent')) {
      pageURL = '/cl/dash';
    } else if (event_tag) {
      pageURL = `/${event_tag}/reg`;
    } else {
      pageURL = '/events';
    }

    if (event.requires_login && !this.auth.isLoggedIn()) {
      this.auth.redirectToLogin({ returnUrl: pageURL });
    } else {
      this.router.navigate([pageURL]);
    }
  }

  GetNotified(event: any) {
    if (!this.auth.isLoggedIn()) {
      this.auth.redirectToLogin();
    } else {
      Swal.fire({
        title: 'Get Notified?',
        text: `Do you want to get notified when registrations open for ${event.name}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, notify me!',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.http
            .post(
              `${environment.API_URL}/${Endpoint.GET_NOTIFIED}`,
              {
                event: event.id,
              },
              {
                headers: this.auth.headers,
              }
            )
            .subscribe({
              next: (res) => {
                Swal.fire({
                  title: 'Success!',
                  text: 'You will be notified when registrations open for this event.',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 2000,
                });
              },
              error: (err: HttpErrorResponse) => {
                handleAPIException(getErrorMessage(err));
              },
            });
        }
      });
    }
  }
}
