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
import { HeroComponent } from './Components/hero/hero.component';
import { DriversComponent } from './Components/drivers/drivers.component';
import { FeedbackComponent } from './Components/feedback/feedback.component';
import { LanguageComponent } from './Components/language/language.component';
import { VendorloginComponent } from './Components/vendorlogin/vendorlogin.component';
import { VendorAuthGuard } from './guards/vendor-auth.guard';

const routes: Routes = [

  {path:'',component:DashboardComponent},
  {path:'dashboard',component:DashboardComponent},
  {path:'order-managements',component:OrderManagementsComponent, canActivate: [VendorAuthGuard]},
  {path:'notifications',component:NotificationsComponent},
  {path:'hero-heading',component:HeroHeadingComponent},
  {path:'footer',component:FooterComponent},
  {path:'sidenav',component:SidenavComponent},
  {path:'payments',component:PaymentsComponent, canActivate: [VendorAuthGuard]},
  {path:'profile',component:ProfileComponent},
  {path:'settings',component:SettingsComponent},
  {path:'support',component:SupportComponent},
  {path:'menu',component:MenuComponent, canActivate: [VendorAuthGuard]},
  {path:'analytics',component:AnalyticsComponent},
  {path:'hero',component:HeroComponent},
  {path:'driver',component:DriversComponent, canActivate: [VendorAuthGuard]},
  {path:'feedback',component:FeedbackComponent},
  {path:'language',component:LanguageComponent},
  {path:'vendorlogin',component:VendorloginComponent},
  { path: '**', redirectTo: 'vendor/dashboard' }




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
