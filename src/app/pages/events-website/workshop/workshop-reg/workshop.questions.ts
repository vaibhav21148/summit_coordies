import { FormArray } from '@angular/forms';
import { Question } from '@shared/form/question/question';
import {
  SECTOR_CHOICES,
  STAGE_CHOICES,
  YES_NO_CHOICES,
  COMPANY_TYPE_CHOICES,
} from '@shared/form/question/question-options';
import { Validators } from '@angular/forms';

const WORKSHOP_SELECT_OPTIONS = [
    {
    value: 'upstock_workshop',
    viewValue: 'Upstock - Invest like a Pro Workshop',
  },
  {
    value: 'nvidia_workshop',
    viewValue: 'NVIDIA - Physical AI for the next wave of Industrial Digitalizatiomon Workshop',
  },
  {
    value: 'wadhwani_workshop',
    viewValue: 'Wadhwani Foundation - AI Tools for Early Entrepreneurs Workshop',
  },

];

export const WORKSHOP_QUESTIONS: Question<any>[] = [
  new Question<string>({
    controlType: 'textbox',
    key: 'name',
    type: 'text',
    label: 'Name',
    placeholder: 'Enter your name',
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
    controlType: 'checkbox',
    key: 'workshops',
    label: 'Workshops',
    placeholder: 'Select the workshop of interest',
    options: WORKSHOP_SELECT_OPTIONS,
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'coupon_code',
    label: 'Referral Code',
    placeholder: 'Have a referral code? Enter here',
    textBoxOptions: { uppercase: true },
    validators: [Validators.minLength(6)],
  }),
  new Question<string>({
    controlType: 'list',
    key: 'friends',
    label: 'Add Friends',
    type: 'Friends',
    // info: 'Refer freinds and get discounts!',
    subQuestions: [
      new Question<string>({
        controlType: 'textbox',
        type: 'text',
        key: 'name',
        placeholder: 'Name of Friend',
      }),
      new Question<string>({
        controlType: 'textbox',
        type: 'email',
        key: 'email',
        placeholder: 'Email of Friend',
      }),
      new Question<string>({
        controlType: 'textbox',
        key: 'contact',
        type: 'tel',
        placeholder: 'Contact Number of Friend',
        validators: [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      }),
      new Question<string>({
        controlType: 'checkbox',
        key: 'workshops',
        label: 'Workshops',
        placeholder: 'Select the workshop of interest',
        options: WORKSHOP_SELECT_OPTIONS,
      }),
    ],
    validators: [Validators.maxLength(4)],
    listTypeOptions: {
      max: 4,
    },
  }),
];
