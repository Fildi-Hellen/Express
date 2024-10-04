// animations.ts
import { trigger, state, style, animate, transition } from '@angular/animations';

export const slideFromLeft = trigger('slideFromLeft', [
  state('void', style({ transform: 'translateX(-100%)' })),
  transition(':enter, :leave', [
    animate('0.5s ease-in-out')
  ]),
]);

export const slideFromRight = trigger('slideFromRight', [
  state('void', style({ transform: 'translateX(100%)' })),
  transition(':enter, :leave', [
    animate('0.5s ease-in-out')
  ]),
]);
