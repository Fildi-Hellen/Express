import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovedComponent } from './Components/approved/approved.component';
import { VendorManagementComponent } from './Components/vendor-management/vendor-management.component';
import { FooterComponent } from './Components/footer/footer.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { MainContentComponent } from './Components/main-content/main-content.component';
import { BlogWritingComponent } from './Components/blog-writing/blog-writing.component';
import { ConfigurationComponent } from './Components/configuration/configuration.component';
import { DriverManagementComponent } from './Components/driver-management/driver-management.component';
import { FeedbackComponent } from './Components/feedback/feedback.component';
import { NotificationsComponent } from './Components/notifications/notifications.component';
import { ReportingComponent } from './Components/reporting/reporting.component';
import { SettingsComponent } from './Components/settings/settings.component';
import { SupportComponent } from './Components/support/support.component';
import { UserManagementComponent } from './Components/user-management/user-management.component';
import { AuthComponent } from './Components/auth/auth.component';




const routes: Routes = [
  
  {path:'',component:DashboardComponent},
  { path: 'approved', component: ApprovedComponent },
  {path:'vendor-management',component:VendorManagementComponent},
  {path:'footer',component:FooterComponent},
  {path:'dashboard',component:DashboardComponent},
  {path:'navbar',component:NavbarComponent},
  {path:'sidebar',component:SidebarComponent},
  {path:'main-content',component:MainContentComponent},
  {path:'blog-writing',component:BlogWritingComponent},
  {path:'configuration',component:ConfigurationComponent},
  {path:'driver-management',component:DriverManagementComponent},
  {path:'feedback',component:FeedbackComponent},
  {path:'notifications',component:NotificationsComponent},
  {path:'reporting',component:ReportingComponent},
  {path:'settings',component:SettingsComponent},
  {path:'support',component:SupportComponent},
  {path:'user-management',component:UserManagementComponent},
  {path:'auth',component:AuthComponent}
 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
