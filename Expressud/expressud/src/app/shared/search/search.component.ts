import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/Services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {

  query: string = '';
  results: any[] = [];

  constructor(private searchService: SearchService, private router: Router) {}

  onSearch() {
    if (this.query.trim()) {
      this.searchService.search(this.query).subscribe((response) => {
        this.results = response;
        if (this.results.length === 0) {
          this.router.navigate(['/home']);
        }
      });
    }
  }

}
