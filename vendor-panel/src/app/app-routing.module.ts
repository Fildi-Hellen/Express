import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { OrderManagementsComponent } from './Components/order-managements/order-managements.component';
import { NotificationsComponent } from './Components/notifications/notifications.component';
import { HeroHeadingComponent } from './Components/hero-heading/hero-heading.component';
import { FooterComponent } from './Components/footer/footer.component';
import { SidenavComponent } from './Components/sidenav/sidenav.component';
import { PaymentsComponent } from './Components/payments/payments.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { SettingsComponent } from './Components/settings/settings.component';
import { SupportComponent } from './Components/support/support.component';
import { MenuComponent } from './Components/menu/menu.component';
import { AnalyticsComponent } from './Components/analytics/analytics.component';

const routes: Routes = [

  {path:'',component:DashboardComponent},
  {path:'dashboard',component:DashboardComponent},
  {path:'order-managements',component:OrderManagementsComponent},
  {path:'notifications',component:NotificationsComponent},
  {path:'hero-heading',component:HeroHeadingComponent},
  {path:'footer',component:FooterComponent},
  {path:'sidenav',component:SidenavComponent},
  {path:'payments',component:PaymentsComponent},
  {path:'profile',component:ProfileComponent},
  {path:'settings',component:SettingsComponent},
  {path:'support',component:SupportComponent},
  {path:'menu',component:MenuComponent},
  {path:'analytics',component:AnalyticsComponent}




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
