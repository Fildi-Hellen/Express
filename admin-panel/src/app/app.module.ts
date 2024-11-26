import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApprovedComponent } from './Components/approved/approved.component';
import { HttpClientModule } from '@angular/common/http';
import { VendorManagementComponent } from './Components/vendor-management/vendor-management.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { FooterComponent } from './Components/footer/footer.component';
import { HeaderComponent } from './Components/header/header.component';
import { SideNavComponent } from './Components/Components/side-nav/side-nav.component';
import { HeroHeadingComponent } from './Components/hero-heading/hero-heading.component';

@NgModule({
  declarations: [
    AppComponent,
    ApprovedComponent,
    VendorManagementComponent,
    DashboardComponent,
    FooterComponent,
    HeaderComponent,
    SideNavComponent,
    HeroHeadingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
