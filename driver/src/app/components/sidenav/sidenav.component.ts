import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.css',
    standalone: false
})
export class SidenavComponent {
  @Input() isSidenavOpen: boolean = false;


}