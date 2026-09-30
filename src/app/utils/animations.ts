import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

// Angular Animations
export const fadeInOut = trigger('fadeInOut', [
  state('void', style({ opacity: 0, height: 0 })),
  transition(':enter', [animate('300ms ease-in-out', style({ opacity: 1 }))]),
  transition(':leave', [animate('300ms ease-in-out', style({ opacity: 0 }))]),
]);

export const fadeDelayInNormOut = trigger('fadeDelayInNormOut', [
  state('void', style({ opacity: 0, height: 0 })),
  transition(':enter', [
    animate('300ms 300ms ease-in-out', style({ opacity: 1 })),
  ]),
  transition(':leave', [animate('300ms ease-in-out', style({ opacity: 0 }))]),
]);
