import { Question } from '@shared/form/question/question';
import {
  SECTOR_CHOICES,
  STAGE_CHOICES,
  YES_NO_CHOICES,
  COMPANY_TYPE_CHOICES,
} from '@shared/form/question/question-options';
import { Validators } from '@angular/forms';

export const NA_QUESTIONS: Question<any>[] = [
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
    label: 'Cofounders',
    type: 'Cofounder',
    info: "Name and LinkedIn profile URL of each co-founder<br /><br />Type NA if you don't have a LinkedIn Profile",
    subQuestions: [
      new Question<string>({
        controlType: 'textbox',
        type: 'text',
        key: 'name',
        placeholder: 'Name of Cofounder',
      }),
      new Question<string>({
        controlType: 'textbox',
        type: 'text',
        key: 'linkedin',
        placeholder:
          'Linkedin Profile Link of Cofounder (Type NA if not available)',
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
    controlType: 'dropdown',
    key: 'sector',
    label: 'Sector',
    placeholder: 'Select your sector',
    options: SECTOR_CHOICES,
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
    controlType: 'textarea',
    key: 'is_startup_funded',
    label: 'Is your startup funded?',
    placeholder: 'If funded, mention current funding amount in INR',

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
    key: 'people_coming',
    type: 'number',
    label: 'Number of People from Your Startup coming in Networking Arena',
    placeholder: 'Number of Participants in NA',
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
    controlType: 'radio',
    key: 'debt_financing',
    label: 'Are you interested in Debt Financing?',
    placeholder: 'Select an option',
    options: YES_NO_CHOICES,
  }),
];
