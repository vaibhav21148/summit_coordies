import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '@services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Endpoint } from '@constants/enums/endpoints.enum';
import { getErrorMessage, handleAPIException } from 'src/app/utils/error';

@Component({
  selector: 'app-grad-card',
  standalone: true,
  // imports: [RouterLink],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss',
})
export class EventCardComponent {
  @Input() event!: any;

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  eventReg(event: any) {
    const event_tag = event.event_tag;
    const pageURL =
      event_tag == 'workshops' ? `/${event_tag}` : `/${event_tag}/reg`;

    if (!this.auth.isLoggedIn()) {
      this.auth.redirectToLogin({ returnUrl: pageURL });
    } else {
      this.router.navigate([pageURL]);
    }
  }

  GetNotified(event: any) {
    if (!this.auth.isLoggedIn()) {
      this.auth.redirectToLogin();
    } else {
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
  }
}
