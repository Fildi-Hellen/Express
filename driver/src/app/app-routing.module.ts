import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import all components
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { PaymentComponent } from './components/payment/payment.component';
import { MoreNotificationComponent } from './components/more-notification/more-notification.component';
import { AvailableComponent } from './components/available/available.component';
import { CommunicationsComponent } from './components/communications/communications.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { LanguageComponent } from './components/language/language.component';
import { NavigationsComponent } from './components/navigations/navigations.component';
import { OrderComponent } from './components/order/order.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SupportComponent } from './components/support/support.component';
import { TripHistoryComponent } from './components/trip-history/trip-history.component';
import { TripRequestsComponent } from './components/trip-requests/trip-requests.component';
import { DriverAuthComponent } from './components/driver-auth/driver-auth.component';

import { DriverMessagingComponent, MessagingComponent } from './components/messaging/messaging.component';

// Define routes
const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'sidenav', component: SidenavComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'more-notification', component: MoreNotificationComponent },
  { path: 'available', component: AvailableComponent },
  { path: 'communications', component: CommunicationsComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'language', component: LanguageComponent },
  { path: 'navigations', component: NavigationsComponent },
  { path: 'order', component: OrderComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'support', component: SupportComponent },
  { path: 'trip-history', component: TripHistoryComponent },
  { path: 'trip-requests', component: TripRequestsComponent },
  { path: 'driver-auth', component: DriverAuthComponent },
  { path: 'messaging/:userId', component: MessagingComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
