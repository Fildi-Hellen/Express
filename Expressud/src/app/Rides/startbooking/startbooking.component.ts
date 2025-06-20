import { Component } from '@angular/core';

@Component({
  selector: 'app-startbooking',
 
  templateUrl: './startbooking.component.html',
  styleUrls: ['./startbooking.component.css']
})
export class StartbookingComponent {
  steps = [
    {
      icon: '/assets/img/courier/fare.png',
      title: 'Offer your fare',
      description: "Agree, bargain, decline – it's your choice"
    },
    {
      icon: '/assets/img/courier/bus-driver.png',
      title: 'Choose a driver',
      description: 'Compare drivers by ratings and completed rides'
    },
    {
      icon: '/assets/img/courier/encrypted.png',
      title: 'Feel secure in your choice',
      description: 'We verify driver documents and identities before they can offer rides'
    }
  ];

  imageSrc = '/assets/img/courier/uber.gif';


}
