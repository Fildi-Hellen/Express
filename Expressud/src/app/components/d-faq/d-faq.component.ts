import { Component } from '@angular/core';

@Component({
  selector: 'app-d-faq',
  templateUrl: './d-faq.component.html',
  styleUrl: './d-faq.component.css'
})
export class DFaqComponent {
  
  faqQuestions = [
    { question: 'What do you need to start delivering with Expressud?', answer: 'You need to be at least 18 years old, hold a valid work permit, have a smartphone, and have access to a motorcycle or bicycle.' },
    { question: 'How long does the registration process take?', answer: 'The registration process usually takes less than 30 minutes to complete the form and upload the required documents. After registration, your documents will be verified for security purposes.' },
    { question: 'How do I get my profits?', answer: 'Your earnings will be transferred to the bank account you provided during Expressud registration.' },
    { question: 'Why should I use the Expressud delivery person app?', answer: 'The Expressud delivery person app allows you to be in control of your decisions and schedule. You can determine your own schedule and deliver when it suits you.' }
  ];

}
