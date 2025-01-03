import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidenavComponent } from './Components/sidenav/sidenav.component';
import { NotificationsComponent } from './Components/notifications/notifications.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { HeroHeadingComponent } from './Components/hero-heading/hero-heading.component';
import { FooterComponent } from './Components/footer/footer.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrderManagementsComponent } from './Components/order-managements/order-managements.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MenuComponent } from './Components/menu/menu.component';
import { SettingsComponent } from './Components/settings/settings.component';
import { PaymentsComponent } from './Components/payments/payments.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { SupportComponent } from './Components/support/support.component';
import { AnalyticsComponent } from './Components/analytics/analytics.component';
import { HeroComponent } from './Components/hero/hero.component';
import { DriversComponent } from './Components/drivers/drivers.component';
import { FeedbackComponent } from './Components/feedback/feedback.component';
import { LanguageComponent } from './Components/language/language.component';
import { ProfileSettingComponent } from './Components/profile-setting/profile-setting.component';
import { AccountSettingComponent } from './Components/account-setting/account-setting.component';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    NotificationsComponent,
    DashboardComponent,
    HeroHeadingComponent,
    FooterComponent,
    OrderManagementsComponent,
    MenuComponent,
    SettingsComponent,
    PaymentsComponent,
    ProfileComponent,
    SupportComponent,
    AnalyticsComponent,
    HeroComponent,
    DriversComponent,
    FeedbackComponent,
    LanguageComponent,
    ProfileSettingComponent,
    AccountSettingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatDividerModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
