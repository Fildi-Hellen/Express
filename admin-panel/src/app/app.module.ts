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
    LanguageComponent
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
