import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VantaBgComponent } from '@shared/vanta-bg/vanta-bg.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, VantaBgComponent],
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})

export class AuthLayoutComponent {
  @Input() currentStep: number = 1;
  @Input() steps: string[] = ['Step number one', 'Step number two', 'Step number three'];
  @Input() heading: string = 'Get started with us';
  @Input() description: string = 'Complete these easy step to register your account';
  @Input() bgImage?: 'login' | 'register';
}