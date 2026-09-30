import { FormArray, Validators } from '@angular/forms';
import { Question } from '@shared/form/question/question';
import {
  GENDER_CHOICES,
} from '@shared/form/question/question-options';

export const GROUP_ACCO_REG_QUESTIONS: Question<any>[] = [
  new Question<string>({
    controlType: 'list',
    key: 'members',
    label: 'Group Members',
    type: 'Member',
    info: 'Add details for each member. The user having the email will receive gold pass.<br /><br />Maximum 20 members allowed.',
    subQuestions: [
      new Question<string>({
        controlType: 'textbox',
        type: 'text',
        key: 'name',
        placeholder: 'Full Name',
        validators: [Validators.required],
      }),
      new Question<string>({
        controlType: 'textbox',
        type: 'email',
        key: 'email',
        placeholder: 'Email Address (Gold pass will be sent to this email)',
        validators: [Validators.required, Validators.email],
      }),
      new Question<string>({
        controlType: 'textbox',
        type: 'tel',
        key: 'contact',
        placeholder: 'Contact Number',
        validators: [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      }),
      new Question<string>({
        controlType: 'dropdown',
        key: 'gender',
        placeholder: 'Gender',
        options: GENDER_CHOICES,
        validators: [Validators.required],
      }),
    ],
    validators: [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(20),
    ],
    listTypeOptions: {
      max: 20,
      min: 1,
    },
  }),
];