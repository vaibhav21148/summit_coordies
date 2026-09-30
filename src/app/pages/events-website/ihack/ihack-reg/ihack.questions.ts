import { Question } from '@shared/form/question/question';
import { Validators, FormArray } from '@angular/forms';
import { STATE_CHOICES, IHACK_REG_TRACKS, YES_NO_CHOICES } from '@shared/form/question/question-options';

export const IHACK_QUESTIONS: Question<any>[] = [
  new Question<string>({
    controlType: 'textbox',
    key: 'team_name',
    type: 'text',
    label: 'Team Name',
    placeholder: 'Enter team name',
    validators: [Validators.required]
  }),
  new Question({
    key: 'team_members',
    label: 'Team Members',
    value: [],
    controlType: 'list',
    type: 'Member',
    info: 'Name and Email of each team member',
    subQuestions: [
      new Question({
        controlType: 'textbox',
        type: 'text',
        key: 'name',
        placeholder: 'Enter name',
        validators: [Validators.required]
      }),
      new Question({
        controlType: 'textbox',
        type: 'email',
        key: 'email',
        placeholder: 'Enter email',
        validators: [Validators.required, Validators.email]
      })
    ],
    validators: [Validators.required, Validators.minLength(1), Validators.maxLength(4)],
    listTypeOptions: { min: 1, max: 4 }
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
    controlType: 'dropdown',
    key: 'track',
    label: 'Track',
    placeholder: 'Select the track you want to register for',
    options: IHACK_REG_TRACKS,
    validators: [Validators.required]
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'college',
    type: 'text',
    label: 'College/School',
    placeholder: 'Enter your college/school name',
    validators: [Validators.required]
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'city',
    type: 'text',
    label: 'City',
    placeholder: 'Enter your city',
    validators: [Validators.required]
  }),
  new Question<string>({
    controlType: 'dropdown',
    key: 'state',
    label: 'State',
    placeholder: 'Select your state',
    options: STATE_CHOICES,
    validators: [Validators.required]
  }),
];
