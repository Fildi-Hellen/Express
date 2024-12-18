import { Component, OnInit } from '@angular/core';
import { SupportService } from '../../Services/support.service';

@Component({
    selector: 'app-support',
    templateUrl: './support.component.html',
    styleUrl: './support.component.css',
    standalone: false
})
export class SupportComponent implements OnInit {
    helpData: any = {};
  issue = {
    category: 'Technical',
    description: ''
  };

  constructor(private supportService: SupportService) {}

  ngOnInit(): void {
    this.loadHelpData();
  }

  loadHelpData(): void {
    this.supportService.getHelpTopics().subscribe(data => {
      this.helpData = data;
    });
  }

  submitIssue(): void {
    if (this.issue.description.trim().length > 0) {
      this.supportService.submitIssueReport(this.issue).subscribe(response => {
        if (response.success) {
          alert('Issue reported successfully!');
          this.issue.description = '';
        }
      });
    } else {
      alert('Please provide a description of the issue.');
    }
  }
  

}
