import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovedComponent } from './Components/approved/approved.component';
import { VendorManagementComponent } from './Components/vendor-management/vendor-management.component';
import { FooterComponent } from './Components/footer/footer.component';
import { HeaderComponent } from './Components/header/header.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { SideNavComponent } from './Components/Components/side-nav/side-nav.component';
import { HeroHeadingComponent } from './Components/hero-heading/hero-heading.component';

const routes: Routes = [
  {path:'',component:DashboardComponent},
  { path: 'approved', component: ApprovedComponent },
  {path:'vendor-management',component:VendorManagementComponent},
  {path:'footer',component:FooterComponent},
  {path:'header',component:HeaderComponent},
  {path:'dashboard',component:DashboardComponent},
  {path:'side-nav',component:SideNavComponent},
  {path:'hero-heading',component:HeroHeadingComponent}
 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
