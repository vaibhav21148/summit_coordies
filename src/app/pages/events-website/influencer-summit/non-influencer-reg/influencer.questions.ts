import { Question } from '@shared/form/question/question';
import { Validators } from '@angular/forms';

export const INF_SUMMIT_QUESTIONS: Question<any>[] = [
  new Question<string>({
    controlType: 'textbox',
    key: 'name',
    type: 'text',
    label: 'Name',
    placeholder: 'Your name',
    validators: [Validators.required],
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
    key: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
    validators: [Validators.required, Validators.email],
  }),
  new Question<string>({
    controlType: 'list',
    key: 'handles',
    label: 'Social Media Handles',
    type: 'handle',
    validators: [Validators.required],
    subQuestions: [
      new Question<string>({
        controlType: 'dropdown',
        key: 'platform',
        type: 'text',
        placeholder: 'Choose platform',
        validators: [Validators.required],
        options: [
          { value: 'Instagram', viewValue: 'Instagram' },
          { value: 'Youtube', viewValue: 'Youtube' },
          { value: 'Twitter', viewValue: 'X/Twitter' },
          { value: 'Facebook', viewValue: 'Facebook' },
          { value: 'LinkedIn', viewValue: 'LinkedIn' },
          { value: 'Other', viewValue: 'Other' },
        ],
      }),
      new Question<string>({
        controlType: 'textbox',
        key: 'handle',
        type: 'text',
        placeholder: 'Enter link (URL)',
        validators: [Validators.required],
      }),
      new Question<string>({
        controlType: 'textbox',
        key: 'follower_count',
        type: 'number',
        placeholder: 'Enter number of followers',
        validators: [Validators.required, Validators.pattern('^[0-9]*$')],
      }),
    ],
    listTypeOptions: {
      min: 1,
      max: 5,
    },
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'website',
    type: 'url',
    label: 'Website (if any)',
    placeholder: 'Enter your website',
    validators: [],
  }),
];
