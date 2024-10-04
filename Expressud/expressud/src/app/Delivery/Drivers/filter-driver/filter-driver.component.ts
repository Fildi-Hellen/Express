import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-filter-driver',
  templateUrl: './filter-driver.component.html',
  styleUrl: './filter-driver.component.css'
})
export class FilterDriverComponent {
  selectedItem: string | undefined; // Define selectedItem property
  entries: any[] = []; // Define entries property
  search(): void {
    // Define search method
    // This method should contain the logic to perform the search
  }

}
