import { Question } from '@shared/form/question/question';
import { Validators } from '@angular/forms';

export const INF_SUMMIT_QUESTIONS: Question<any>[] = [
  new Question<string>({
    controlType: 'textbox',
    key: 'name',
    type: 'text',
    label: 'Name',
    placeholder: 'Your name',
    validators: [Validators.required],
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
    key: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
    validators: [Validators.required, Validators.email],
  }),
];

export const INF_SUMMIT_TWO_QUESTIONS: Question<any>[] = [
  new Question<string>({
    controlType: 'list',
    key: 'handles',
    label: 'Social Media Handles',
    type: 'handle',
    validators: [Validators.required],
    subQuestions: [
      new Question<string>({
        controlType: 'dropdown',
        key: 'platform',
        type: 'text',
        placeholder: 'Choose platform',
        validators: [Validators.required],
        options: [
          { value: 'Instagram', viewValue: 'Instagram' },
          { value: 'Youtube', viewValue: 'Youtube' },
          { value: 'Twitter', viewValue: 'X/Twitter' },
          { value: 'Facebook', viewValue: 'Facebook' },
          { value: 'LinkedIn', viewValue: 'LinkedIn' },
          { value: 'Other', viewValue: 'Other' },
        ],
      }),
      new Question<string>({
        controlType: 'textbox',
        key: 'handle',
        type: 'text',
        placeholder: 'Enter handle',
        validators: [Validators.required],
      }),
      new Question<string>({
        controlType: 'textbox',
        key: 'followers',
        type: 'number',
        placeholder: 'Enter number of followers',
        validators: [Validators.required, Validators.pattern('^[0-9]*$')],
      }),
    ],
    listTypeOptions: {
      min: 1,
      max: 5,
    },
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'website',
    type: 'text',
    label: 'Website (if any)',
    placeholder: 'Enter your website',
    validators: [],
  }),
];

export const INF_SUMMIT_NOMINATE_QUESTIONS: Question<any>[] = [
  new Question<string>({
    controlType: 'checkbox',
    key: 'awards',
    type: 'category',
    label: 'Nominate for Awards (Upto 3)',
    info: 'Pick up to 3 award categories that are most relevant to your content',
    validators: [Validators.required],
    options: [
      { value: 'fashionbeauty', viewValue: 'Best Fashion & Beauty Influencer' },
      { value: 'fitness', viewValue: 'Fitness Influencer of the Year' },
      { value: 'tech', viewValue: 'Best Tech Influencer' },
      { value: 'travel', viewValue: 'Best Travel Influencer' },
      { value: 'art', viewValue: 'Best Art & Photography Influencer' },
      { value: 'business', viewValue: 'Business & Finance Guru' },
      { value: 'gaming', viewValue: 'Best Gaming Influencer' },
      { value: 'entertainment', viewValue: 'Best Entertainment Influencer' },
      { value: 'social', viewValue: 'Social Influencer of the Year' },
      { value: 'food', viewValue: 'Best Food Influencer' },
      { value: 'health', viewValue: 'Best Health & Wellbeing Influencer' },
      { value: 'meme', viewValue: 'Best Meme Creator' },
      { value: 'motivation', viewValue: 'Motivational Influencer of the Year' },
      { value: 'campus', viewValue: 'Best Campus Influencer' },
      { value: 'education', viewValue: 'Best Education Influencer' },
    ],
    listTypeOptions: {
      min: 1,
      max: 3,
    },
  }),
  new Question<string>({
    controlType: 'textbox',
    key: 'coupon',
    type: 'text',
    label: 'Coupon Code',
    placeholder: 'Enter coupon code (optional)',
    validators: [],
  }),
];
