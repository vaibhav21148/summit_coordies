import { Question } from '@shared/form/question/question';
import { Validators } from '@angular/forms';

export const VSM_QUESTIONS: Question<any>[] = [
  new Question<string>({
    controlType: 'textbox',
    key: 'full_name',
    type: 'text',
    label: 'Full Name',
    placeholder: 'Enter your full name',
    validators: [Validators.required],
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
    validators: [Validators.required, Validators.email],
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'contact',
    label: 'Contact Number',
    type: 'tel',
    placeholder: 'Enter your contact number',
    validators: [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.minLength(10),
      Validators.maxLength(10),
    ],
  }),
];