import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { FooterComponent } from './components/footer/footer.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { PaymentComponent } from './components/payment/payment.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MoreNotificationComponent } from './components/more-notification/more-notification.component';
import { TripHistoryComponent } from './components/trip-history/trip-history.component';
import { TripRequestsComponent } from './components/trip-requests/trip-requests.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SupportComponent } from './components/support/support.component';
import { AvailableComponent } from './components/available/available.component';
import { LanguageComponent } from './components/language/language.component';
import { CommunicationsComponent } from './components/communications/communications.component';
import { NavigationsComponent } from './components/navigations/navigations.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { OrderComponent } from './components/order/order.component';
import { DriverAuthComponent } from './components/driver-auth/driver-auth.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidenavComponent,
    FooterComponent,
    NotificationsComponent,
    PaymentComponent,
    DashboardComponent,
    MoreNotificationComponent,
    TripHistoryComponent,
    TripRequestsComponent,
    SettingsComponent,
    SupportComponent,
    AvailableComponent,
    LanguageComponent,
    CommunicationsComponent,
    NavigationsComponent,
    FeedbackComponent,
    // ProfileComponent,
    OrderComponent,
    DriverAuthComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
     
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

