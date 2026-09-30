import { FormArray } from '@angular/forms';
import { Question } from '@shared/form/question/question';
import {
  SECTOR_CHOICES,
  STAGE_CHOICES,
  YES_NO_CHOICES,
  COMPANY_TYPE_CHOICES,
} from '@shared/form/question/question-options';
import { Validators } from '@angular/forms';

export const TTMM_QUESTIONS: Question<any>[] = [
  new Question<string>({
    controlType: 'textbox',
    key: 'startup_name',
    type: 'text',
    label: 'Name of the Startup',
    placeholder: 'Name of the Startup',
  }),
  new Question<string>({
    controlType: 'list',
    key: 'cofounders',
    label: 'Founder/Cofounders',
    type: 'Cofounder',
    info: "Name and LinkedIn profile URL of each co-founder<br /><br />Type NA if you don't have a LinkedIn Profile",
    subQuestions: [
      new Question<string>({
        controlType: 'textbox',
        type: 'text',
        key: 'name',
        label: 'Name',
        placeholder: 'Enter Full Name',
      }),
      new Question<string>({
        controlType: 'textbox',
        type: 'text',
        key: 'linkedin',
        label: 'LinkedIn Profile Link',
        placeholder: 'Enter LinkedIn Profile Link (Type NA if not available)',
      }),
    ],
    validators: [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(4),
    ],
    listTypeOptions: {
      max: 4,
      min: 1,
    },
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
    controlType: 'textarea',
    key: 'description',
    label: 'Brief Description of the Startup',
    placeholder: 'Enter a brief description of the startup',
  }),
  new Question<string>({
    controlType: 'radio',
    key: 'previously_registered',
    label: 'Have you registered for TTMM previously?',
    placeholder: 'Select an option',
    options: YES_NO_CHOICES,
  }),
  new Question<string>({
    controlType: 'dropdown',
    key: 'sector',
    label: 'Sector',
    placeholder: 'Select your sector',
    options: SECTOR_CHOICES,
  }),
  new Question<string>({
    controlType: 'dropdown',
    key: 'reg_status',
    label: 'Current Registration Status',
    placeholder: 'Select registration status',
    options: COMPANY_TYPE_CHOICES,
  }),
  new Question<string>({
    controlType: 'textarea',
    key: 'founder_background',
    label: 'Educational Background of Founders and Experience',
    placeholder: 'Enter Educational Background of Founders and Experience',
    validators: [],
  }),
  new Question<string>({
    controlType: 'dropdown',
    key: 'stage_of_startup',
    label: 'Stage of Startup',
    placeholder: 'Select stage of startup',
    options: STAGE_CHOICES,
  }),
  new Question<string>({
    controlType: 'radio',
    key: 'full_time',
    label: 'Are all founders full-time?',
    placeholder: 'Select an option',
    validators: [],
    options: YES_NO_CHOICES,
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'date_of_incorporation',
    type: 'date',
    label: 'Date of Incorporation',
    placeholder: 'Enter date of incorporation',
    validators: [],
  }),
  new Question<number | null>({
    value: null,
    controlType: 'textbox',
    key: 'revenue',
    label: 'Revenue Generated Since Inception (in INR)',
    type: 'number',
    placeholder: 'Enter your revenue',
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'is_startup_funded',
    label: 'Is your startup funded?',
    type: 'number',
    placeholder: 'Mention current funding amount in INR else 0',

    cols: 2,
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'website',
    type: 'text',
    label: 'Website',
    placeholder: 'Enter your website',
    validators: [],
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'head_office',
    type: 'text',
    label: 'Head Office Location',
    placeholder: 'Enter your head office location',
  }),
  new Question<File | null>({
    controlType: 'file',
    key: 'pitch_deck',
    label: 'Upload Pitch Deck',
    placeholder: 'Upload Pitch Deck',

    fileOptions: {
      accept: [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-powerpoint',
      ],
      max_size: 10 * 1024 * 1024,
    },
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'last_funded_valuation',
    label: 'Valuation of the last funded round (in INR)',
    type: 'number',
    placeholder: '',
    validators: [],
  }),
  new Question<string>({
    controlType: 'textarea',
    key: 'additional_info',
    label: 'Anything else you want us to know?',
    placeholder: '',
    validators: [],
  }),
];
