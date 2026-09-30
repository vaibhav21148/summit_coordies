import { FormArray } from '@angular/forms';
import { Question } from '@shared/form/question/question';
import {
  SECTOR_CHOICES,
  STAGE_CHOICES,
  YES_NO_CHOICES,
  COMPANY_TYPE_CHOICES,
  IHACK_SUB_TRACKS,
} from '@shared/form/question/question-options';
import { Validators } from '@angular/forms';

export const IHACK_SUB_QUESTIONS: Question<any>[] = [
  new Question<string>({
    controlType: 'textbox',
    key: 'name',
    type: 'text',
    label: 'Team Name',
    placeholder: 'Team Name',
  }),
  new Question<string>({
    controlType: 'list',
    key: 'team_members',
    label: 'Team Members',
    type: 'Member',
    info: "Name and Email of each team member",
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
        key: 'email',
        label: 'Email',
        placeholder: 'Enter Email Address',
      }),
    ],
    validators: [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(2),
    ],
    listTypeOptions: {
      max: 2,
      min: 1,
    },
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
    label: 'College',
    type: 'text',
    placeholder: 'Enter your Collge/School Name',
  }),
  new Question<string>({
    controlType: 'dropdown',
    key: 'track',
    label: 'Track',
    placeholder: 'Select the track you are submitting your solution for',
    options: IHACK_SUB_TRACKS,
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'git_profile',
    type: 'text',
    label: 'GitLab Profile',
    placeholder: 'Enter your GitLab profile link',
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'git_submission',
    type: 'text',
    label: 'GitLab Submission',
    placeholder: 'Enter your GitLab submission link',
  }),
  new Question<File | null>({
    controlType: 'file',
    key: 'solution_deck',
    label: 'Upload Solution Deck',
    placeholder: 'Upload Solution Deck',

    fileOptions: {
      accept: [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-powerpoint',
      ],
      max_size: 10 * 1024 * 1024,
    },
  }),
];
