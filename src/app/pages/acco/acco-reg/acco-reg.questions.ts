import { Validators } from '@angular/forms';
import { Question } from '@shared/form/question/question';
import {
  GENDER_CHOICES,
} from '@shared/form/question/question-options';

export const ACCO_REG_QUESTIONS: Question<any>[] = [
  new Question<string>({
    controlType: 'list',
    key: 'members',
    label: 'Members',
    type: 'Member',
    order: 1,
    info: '👥 Add details for each member. 🏆 <strong style="color: #FFD700;">GOLD PASS will be sent to the email provided</strong><br /><br />',
    subQuestions: [
      new Question<string>({
        controlType: 'textbox',
        type: 'text',
        key: 'name',
        placeholder: 'Full Name',
        validators: [Validators.required],
        order: 1,
      }),
      new Question<string>({
        controlType: 'textbox',
        type: 'email',
        key: 'email',
        placeholder: 'Email Address (🏆 GOLD PASS will be sent to this email)',
        validators: [Validators.required, Validators.email],
        order: 2,
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
        order: 3,
      }),
      new Question<string>({
        controlType: 'dropdown',
        key: 'gender',
        placeholder: 'Gender',
        options: GENDER_CHOICES,
        validators: [Validators.required],
        order: 4,
      }),
    ],
    validators: [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(100),
    ],
    listTypeOptions: {
      max: 100,
      min: 1,
    },
  }),
];
