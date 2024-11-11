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
import { ReactiveFormsModule } from '@angular/forms';
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
    AnalyticsComponent
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
    MatDialogModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
