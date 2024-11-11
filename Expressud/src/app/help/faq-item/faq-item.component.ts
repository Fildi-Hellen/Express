import { Component } from '@angular/core';

@Component({
  selector: 'app-faq-item',
  templateUrl: './faq-item.component.html',
  styleUrl: './faq-item.component.css'
})
export class FaqItemComponent {
  faqQuestions = [
    { question: 'What is Expressud?', answer: 'Expressud is a delivery platform that allows users to order a wide range of products from local stores and restaurants.' },
    { question: 'How does Expressud work for partners?', answer: 'Expressud partners with local businesses to offer delivery services to its customers. Partners receive orders through the Expressud platform and fulfill them accordingly.' },
    { question: 'How long does it take to become a partner?', answer: 'The time it takes to become a partner with Expressud varies depending on the location and the specific requirements of the partnership agreement. Generally, the process involves signing up, providing necessary documentation, and completing any training or onboarding processes.' },
    { question: 'How will I receive the orders??', answer: 'We will give you access to our platform and once you confirm the order, you will have about 15 minutes until the courier arrives to pick it up.' }
  ];

}

