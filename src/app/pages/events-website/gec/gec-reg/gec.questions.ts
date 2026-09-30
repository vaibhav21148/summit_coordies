import { Question } from '@shared/form/question/question';
import { Validators } from '@angular/forms';

export const GEC_QUESTIONS: Question<any>[] = [
  new Question<string>({
    controlType: 'textbox',
    key: 'full_name',
    type: 'text',
    label: 'Name (as on passport)',
    placeholder: 'Enter your full name',
    validators: [Validators.required]
  }),
  new Question<string>({
    controlType: 'dropdown',
    key: 'gender',
    label: 'Gender',
    placeholder: 'Select Gender',
    options: [
      { value: 'Male', viewValue: 'Male' },
      { value: 'Female', viewValue: 'Female' },
      { value: 'Non Binary', viewValue: 'Non Binary' },
      { value: 'Prefer Not to Say', viewValue: 'Prefer Not to Say' }
    ],
    validators: [Validators.required]
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    validators: [Validators.required, Validators.email]
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'contact',
    type: 'tel',
    label: 'Contact',
    placeholder: 'Enter contact number',
    validators: [Validators.required]
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'nationality',
    type: 'text',
    label: 'Passport Nationality',
    placeholder: 'Enter your nationality',
    validators: [Validators.required]
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'university_name',
    type: 'text',
    label: 'University Name',
    placeholder: 'Enter university name',
    validators: [Validators.required]
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'university_country',
    type: 'text',
    label: 'Country of University',
    placeholder: 'Enter country',
    validators: [Validators.required]
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'department',
    type: 'text',
    label: 'Department/School Name',
    placeholder: 'Enter department name',
    validators: [Validators.required]
  }),
  new Question<string>({
    controlType: 'dropdown',
    key: 'affiliation_type',
    label: 'University Affiliation Type',
    placeholder: 'Select Affiliation Type',
    options: [
      { value: 'SATU Partner', viewValue: 'SATU Partner' },
      { value: 'AUA Partner', viewValue: 'AUA Partner' },
      { value: 'GCC Region', viewValue: 'GCC Region' },
      { value: 'Other', viewValue: 'Other' }
    ],
    validators: [Validators.required]
  }),
  new Question<string>({
    controlType: 'dropdown',
    key: 'role',
    label: 'Role/Designation in University',
    placeholder: 'Select Role',
    options: [
      { value: 'Undergraduate Student', viewValue: 'Undergraduate Student' },
      { value: 'Graduate Student', viewValue: 'Graduate Student' },
      { value: 'Research Scholar', viewValue: 'Research Scholar' },
      { value: 'Faculty', viewValue: 'Faculty' },
      { value: 'Other', viewValue: 'Other' }
    ],
    validators: [Validators.required]
  })
];
