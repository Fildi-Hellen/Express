import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApprovedComponent } from './Components/approved/approved.component';
import { HttpClientModule } from '@angular/common/http';
import { VendorManagementComponent } from './Components/vendor-management/vendor-management.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { FooterComponent } from './Components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { MainContentComponent } from './Components/main-content/main-content.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { HeroComponent } from './Components/hero/hero.component';
import { NotificationsComponent } from './Components/notifications/notifications.component';
import { LanguageComponent } from './Components/language/language.component';
import { BlogWritingComponent } from './Components/blog-writing/blog-writing.component';
import { ConfigurationComponent } from './Components/configuration/configuration.component';
import { FeedbackComponent } from './Components/feedback/feedback.component';
import { ReportingComponent } from './Components/reporting/reporting.component';
import { DriverManagementComponent } from './Components/driver-management/driver-management.component';
import { UserManagementComponent } from './Components/user-management/user-management.component';
import { SettingsComponent } from './Components/settings/settings.component';
import { SupportComponent } from './Components/support/support.component';
import { AuthComponent } from './Components/auth/auth.component';

@NgModule({
  declarations: [
    AppComponent,
    ApprovedComponent,
    VendorManagementComponent,
    DashboardComponent,
    FooterComponent,
    MainContentComponent,
    NavbarComponent,
    SidebarComponent,
    HeroComponent,
    NotificationsComponent,
    LanguageComponent,
    BlogWritingComponent,
    ConfigurationComponent,
    FeedbackComponent,
    ReportingComponent,
    DriverManagementComponent,
    UserManagementComponent,
    SettingsComponent,
    SupportComponent,
    AuthComponent
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
