import { Question } from '@shared/form/question/question';
import {
  SECTOR_CHOICES,
  STATE_CHOICES,
  STAGE_CHOICES,
  YES_NO_CHOICES,
  COMPANY_TYPE_CHOICES,
} from '@shared/form/question/question-options';

export const IJF_STUD_QUESTIONS: Question<any>[] = [
  new Question<string>({
    controlType: 'dropdown',
    key: 'state',
    label: 'State',
    placeholder: 'Select your state',
    options: STATE_CHOICES,
    order: 1,
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'city',
    type: 'text',
    label: 'City',
    placeholder: 'Enter your city',
    order: 2,
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'college',
    type: 'text',
    label: 'College',
    placeholder: 'Enter your College Name',
    order: 3,
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'year',
    type: 'text',
    label: 'Year of Study',
    placeholder: 'Enter your Year of Study',
    order: 4,
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'degree',
    type: 'text',
    label: 'Degree pursuing',
    placeholder: 'Enter your Degree',
    order: 5,
  }),
  new Question<string>({
    controlType: 'textarea',
    key: 'opportunity',
    type: 'text',
    label: 'What opportunities you are seeking?',
    placeholder: 'What are your expectations from IJF?',
    order: 6,
  }),
];
