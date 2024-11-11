import { Component } from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css'
})
export class TabComponent {
  categories: string[] = [
    'All stories',
    'Business',
    'Consumer',
    'Environment',
    'Life at Expressud',
    'Security',
    
  ];

}
