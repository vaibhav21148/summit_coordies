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
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { DialogModule } from 'primeng/dialog';

import { GeneralDataService } from '@services/general-data.service';
import { ContactComponent } from '@shared/contact/contact.component';

import { EventCardComponent as NormalGradCard } from '@shared/normal-grad-card/event-card.component';
import { TimelineComponent } from '@shared/timeline/timeline.component';
import { AccordionComponent } from '@shared/accordion/accordion.component';
import { Endpoint } from '@constants/enums/endpoints.enum';
import { EvervaultCardComponent } from '@shared/evervault-card/evervault-card.component';
import { VantaBgComponent } from '@shared/vanta-bg/vanta-bg.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-influencer-summit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FooterComponent,
    NavbarComponent,
    RouterLink,
    DialogModule,
    ContactComponent,
    NormalGradCard,
    TimelineComponent,
    AccordionComponent,
    EvervaultCardComponent,
    VantaBgComponent
  ],
  templateUrl: './influencer-summit.component.html',
  styleUrls: ['./influencer-summit.component.scss'],
})
export class InfluencerSummitComponent implements OnInit {

  backgroundImage: any;
  responsiveOptions: any;
  isScrolled = false;
  visible = false;
  event_title: any;
  event_description: any;
  event_image: any;
  faqs: any = [];
  arena_events_details: any = [];
  voteVisible = false;
  otpSent = false;
  voteForm = {
    email: '',
    otp: '',
    nomineeCode: '',
    award: ''
  };
  awardOptions = [
    { value: 'fashionbeauty', viewValue: 'Best Fashion & Beauty Influencer' },
    { value: 'fitness', viewValue: 'Fitness Influencer of the Year' },
    { value: 'tech', viewValue: 'Best Tech Influencer' },
    { value: 'travel', viewValue: 'Best Travel Influencer' },
    { value: 'art', viewValue: 'Best Art & Photography Influencer' },
    { value: 'business', viewValue: 'Business & Finance Guru' },
    { value: 'gaming', viewValue: 'Best Gaming Influencer' },
    { value: 'entertainment', viewValue: 'Best Entertainment Influencer' },
    { value: 'social', viewValue: 'Social Influencer of the Year' },
    { value: 'food', viewValue: 'Best Food Influencer' },
    { value: 'health', viewValue: 'Best Health & Wellbeing Influencer' },
    { value: 'meme', viewValue: 'Best Meme Creator' },
    { value: 'motivation', viewValue: 'Motivational Influencer of the Year' },
    { value: 'campus', viewValue: 'Best Campus Influencer' },
    { value: 'education', viewValue: 'Best Education Influencer' }
  ];

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    const scrollY = window.scrollY;
    this.isScrolled = scrollY > 200;
  }

  ShowDetails(i: any) {
    this.event_title = this.arena_events_details[i].title;
    this.event_description = this.arena_events_details[i].description;
    this.event_image = this.arena_events_details[i].image;
    this.visible = true;
  }
  constructor(
    private http: HttpClient,
    private dataService: GeneralDataService
  ) {}

  ngOnInit(): void {
    localStorage.setItem('influencer', 'true');
    this.getData();
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

  getData() {
    this.dataService.getData('influencer_awards').subscribe((res: any) => {
      console.log(res);
      this.arena_events_details = res;
    });
  }

  getFaqs() {
    this.dataService.getFAQs('infsummit').subscribe((res: any) => {
      this.faqs = res.map((faq: any, index: number) => ({
        number: (index + 1).toString().padStart(2, '0'),
        title: faq.question,
        content: faq.answer
      }));
    });
  }

  agenda = [
    {
      status: 'Content Creators Talks (Panel 1)',
      date: '30 minutes'
    },
    {
      status: 'Entertainment (Part 1)',
      date: '15 minutes'
    },
    {
      status: 'Award Distribution (Part 1)',
      date: '10 minutes'
    },
    {
      status: 'Platform Power Talks (Panel 2)',
      date: '30 minutes'
    },
    {
      status: 'Entertainment (Part 2)',
      date: '15 minutes'
    },
    {
      status: 'Award Distribution (Part 2)',
      date: '10 mins'
    },
    {
      status: 'Closing Notes',
      date: '10 mins'
    },
    {
      status: 'High Tea & Fan Meetup',
      date: '20 mins'
    },
  ];

  openVoteForm() {
    this.voteVisible = true;
  }

  closeVoteModal() {
    this.voteVisible = false;
    this.otpSent = false;
    this.voteForm = { email: '', otp: '', nomineeCode: '', award: '' };
  }

  sendOTP() {
    if (!this.voteForm.email) return;
    
    this.http.post(`${environment.API_URL}/inf-otp/`, { email: this.voteForm.email })
      .subscribe({
        next: () => {
          this.otpSent = true;
          Swal.fire('OTP Sent', 'Check your email for the OTP', 'success');
        },
        error: () => {
          Swal.fire('Error', 'Failed to send OTP', 'error');
        }
      });
  }

  isVoteFormValid() {
    return this.voteForm.email && this.voteForm.otp && 
           this.voteForm.nomineeCode && this.voteForm.award;
  }

  submitVote() {
    if (!this.isVoteFormValid()) return;
    
    const voteData = {
      otp: this.voteForm.otp,
      mail: this.voteForm.email,
      nominee_code: this.voteForm.nomineeCode,
      award: this.voteForm.award
    };

    this.http.post(`${environment.API_URL}/infsummit/vote/`, voteData)
      .subscribe({
        next: () => {
          Swal.fire('Vote Registered', 'Your vote has been successfully registered!', 'success');
          this.closeVoteModal();
        },
        error: () => {
          Swal.fire('Error', 'Failed to register vote', 'error');
        }
      });
  }
}