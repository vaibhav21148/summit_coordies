import { Question } from '@shared/form/question/question';
import { Validators } from '@angular/forms';

export const EXPO_QUESTIONS: Question<any>[] = [
  
  new Question<string>({
    controlType: 'textbox',
    key: 'name',
    type: 'text',
    label: 'Name',
    placeholder: 'Your name',
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'contact',
    label: 'Contact (WhatsApp preferred)',
    type: 'tel',
    placeholder: 'Enter Your Contact Number',
    validators: [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.minLength(10),
      Validators.maxLength(10),
    ],
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'startup_name',
    type: 'text',
    label: 'Name of the Startup',
    placeholder: 'Name of the Startup',
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'pitch_deck_or_website',
    type: 'text',
    label: "Startup's Pitch Deck/Website",
    placeholder: 'Enter drive link or website URL',
    note: '*Enter the drive link with view access of the pitch deck or the website link',
    validators: [],
  }),
  new Question<string>({
    controlType: 'dropdown',
    key: 'stall_type',
    label: 'Which stall category are you interested in?',
    placeholder: 'Select stall category',
    options: [
      { value: 'Silver', viewValue: 'Silver' },
      { value: 'Gold', viewValue: 'Gold' },
      { value: 'Platinum', viewValue: 'Platinum' },
    ],
  }),
];
