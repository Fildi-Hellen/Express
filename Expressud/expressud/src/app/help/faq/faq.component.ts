import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  faqData: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('assets/faq-data.json').subscribe((data: any) => {
      this.faqData = data;
    });
  }
}
