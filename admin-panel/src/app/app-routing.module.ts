import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovedComponent } from './Components/approved/approved.component';
import { VendorManagementComponent } from './Components/vendor-management/vendor-management.component';
import { FooterComponent } from './Components/footer/footer.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { MainContentComponent } from './Components/main-content/main-content.component';

const routes: Routes = [
  
  {path:'',component:DashboardComponent},
  { path: 'approved', component: ApprovedComponent },
  {path:'vendor-management',component:VendorManagementComponent},
  {path:'footer',component:FooterComponent},
  {path:'dashboard',component:DashboardComponent},
  {path:'navbar',component:NavbarComponent},
  {path:'sidebar',component:SidebarComponent},
  {path:'main-content',component:MainContentComponent}
 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
