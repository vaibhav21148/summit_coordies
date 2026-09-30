import { Question } from '@shared/form/question/question';
import { Validators } from '@angular/forms';
import {
  STATE_CHOICES,
  COMPI_YEAR_CHOICES,
  COMPI_NAME,
} from '@shared/form/question/question-options';

export const COMPI_QUESTIONS: Question<any>[] = [
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
    key: 'college',
    type: 'text',
    label: 'College/School',
    placeholder: 'Enter your college/school name',
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'city',
    type: 'text',
    label: 'City',
    placeholder: 'Enter your city',
  }),
  new Question<string>({
    controlType: 'dropdown',
    key: 'state',
    label: 'State',
    placeholder: 'Select your state',
    options: STATE_CHOICES,
  }),
  new Question<string>({
    controlType: 'dropdown',
    key: 'year_study',
    type: 'text',
    label: 'Year of Study',
    placeholder: 'Select your year of study',
    options: COMPI_YEAR_CHOICES,
  }),
  new Question<string>({
    controlType: 'dropdown',
    key: 'compi_name',
    type: 'text',
    label: 'Competition Name',
    placeholder: 'Select the compitetion you want to register for',
    options: COMPI_NAME,
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'team_code',
    type: 'text',
    label: 'Join an Existing Team(Team Code)',
    placeholder: 'Enter your Team Code',
    info: 'If you are joining an existing team, enter the team code here. If you are creating a new team, leave this field empty.',
    textBoxOptions: {
      uppercase: true,
    },
    validators: [],
  }),
  new Question<string>({
    controlType: 'file',
    key: 'deck_submission',
    label: 'Submit your deck -- optional, to upload pdf',
    placeholder: 'Upload PDF',
    validators: [],
    fileOptions: {
      accept: ['application/pdf'],
      max_size: 10 * 1024 * 1024,
    },
  }),
];
