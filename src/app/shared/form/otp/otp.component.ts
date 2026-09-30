import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss',
})
export class OtpComponent {
  @Input() length = 6;
  @Output() onOtpChange = new EventEmitter<string>();

  otp: string[] = Array(this.length).fill('');

  constructor() {}

  // Helper function to check if a value is numeric
  isNumeric(value: string): boolean {
    return /^-?\d+$/.test(value);
  }

  get otpString(): string {
    return this.otp.join('');
  }

  get inputs() {
    return document.querySelectorAll<HTMLInputElement>('.otp-box');
  }

  onClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    // Focus the first unfilled box or the last box
    const inputs = this.inputs;
    for (let i = 0; i < this.length; i++) {
      if (this.otp[i] === '') {
        inputs[i].focus();
        return;
      }
    }

    inputs[this.length - 1].focus();
  }

  // Handle backspace functionality
  onBackSpace(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && this.otp[index] === '' && index > 0) {
      event.preventDefault();
      event.stopPropagation();

      const inputs = this.inputs;
      inputs[index - 1].focus(); // Focus the previous box
      this.otp[index - 1] = ''; // Focus the previous box
      this.onOtpChange.emit(this.otpString);
    }
  }

  // Move focus to the next box when a digit is entered
  moveToNextBox(index: number): void {
    const value = this.otp[index];
    const maxLength = 1;

    // Allow only numbers
    if (this.isNumeric(value) || value.length === 0) {
      this.otp[index] = value; // Update the OTP array
      const inputs = this.inputs;

      if (value.length >= maxLength && index < this.length - 1) {
        inputs[index + 1].focus(); // Move to the next box
      }

      if (value.length === 0 && index > 0 && index < this.length - 1) {
        inputs[index - 1].focus(); // Move back to the previous box
      }
      this.onOtpChange.emit(this.otpString);
    } else {
      this.otp[index] = ''; // Clear invalid input
    }
  }
}
