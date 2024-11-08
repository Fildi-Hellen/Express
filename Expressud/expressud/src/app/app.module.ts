import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AppComponent } from './app.component';
import  {HomeComponent} from './components/home/home.component';
import { InstagramComponent } from './components/instagram/instagram.component';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { BannerComponent } from './components/banner/banner.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { ProductComponent } from './components/product/product.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BusComponent } from './shared/courier/bus/bus.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { FaqComponent } from './help/faq/faq.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatExpansionModule } from '@angular/material/expansion';
import { PrivacyPolicyComponent } from './help/privacy-policy/privacy-policy.component';
import { ContactComponent } from './components/contact/contact.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ContactService } from './Services/contact.service';
import { AboutUsComponent } from './about/about-us/about-us.component';
import { AboutUsContentComponent } from './about/about-us-content/about-us-content.component';
import { AboutUsDescriptionComponent } from './about/about-us-description/about-us-description.component';
import { AboutUsTitleComponent } from './about/about-us-title/about-us-title.component';
import { FormComponent } from './shared/courier/form/form.component';
import { ServiceSectionComponent } from './shared/courier/service-section/service-section.component';
import { HeroCourierComponent } from './shared/courier/hero-courier/hero-courier.component';
import { ToastrModule } from 'ngx-toastr';
import { AuthInterceptor } from './auth/auth.interceptor';
import { LoadingInterceptor } from './Shared1/interceptors/loading.interceptor';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { AddressComponent } from './components/address/address.component';
import { BlogComponent } from './Blog/blog/blog.component';
import { BlogDetailsComponent } from './Blog/blog-details/blog-details.component';
import { CreateBlogComponent } from './Blog/create-blog/create-blog.component';
import { EditBlogComponent } from './Blog/edit-blog/edit-blog.component';
import { StoreComponent } from './components/store/store.component';
import { StoreItemComponent } from './components/store-item/store-item.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { PartnerComponent } from './components/partner/partner.component';
import { DeliverComponent } from './components/deliver/deliver.component';
import { DFaqComponent } from './components/d-faq/d-faq.component';
import { FaqItemComponent } from './help/faq-item/faq-item.component';
import { TestimonyComponent } from './components/testimony/testimony.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { SellComponent } from './Sub/sell/sell.component';
import { ManageComponent } from './Sub/manage/manage.component';
import { GrowComponent } from './Sub/grow/grow.component';
import { BlogHeaderComponent } from './Blog/blog-header/blog-header.component';
import { TabComponent } from './Blog/tab/tab.component';
import { SwiperComponent } from './Blog/swiper/swiper.component';
import { FillFormComponent } from './shared/courier/fill-form/fill-form.component';
import { TrackingComponent } from './shared/courier/tracking/tracking.component';
import { PartnerDocumentsComponent } from './help/partner-documents/partner-documents.component';
import { ImageCarouselComponent } from './components/image-carousel/image-carousel.component';
import { AuthComponent } from './components/auth/auth.component';
import { GoogleComponent } from './pages/google/google.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MoneyComponent } from './Delivery/Drivers/money/money.component';
import { PageLandingComponent } from './Delivery/Drivers/page-landing/page-landing.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { WalletComponent } from './Delivery/Drivers/wallet/wallet.component';
import { NavigationComponent } from './Delivery/Drivers/navigation/navigation.component';
import { FilterDriverComponent } from './Delivery/Drivers/filter-driver/filter-driver.component';
import { HeroDriverComponent } from './Delivery/Drivers/hero-driver/hero-driver.component';
import { HeaderDriverComponent } from './Delivery/Drivers/header-driver/header-driver.component';
import { TrackingStatusComponent } from './Delivery/Drivers/tracking-status/tracking-status.component';
import { ProcessComponent } from './Delivery/Drivers/process/process.component';
import { PopformComponent } from './components/popform/popform.component';
import { ConfirmBtnComponent } from './Page/confirm-btn/confirm-btn.component';
import { ConfirmMessageComponent } from './Page/confirm-message/confirm-message.component';
import { FeedbackComponent } from './Page/feedback/feedback.component';
import { RecipientComponent } from './Page/recipient/recipient.component';
import { GiftsComponent } from './Page/gifts/gifts.component';
import { StoreItemPageComponent } from './Stores/store-item-page/store-item-page.component';
import { CartsPageComponent } from './Stores/carts-page/carts-page.component';
import { CheckoutComponent } from './Stores/checkout/checkout.component';
import { FoodsComponent } from './shared/Components/foods/foods.component';
import { RestaurantFoodItemComponent } from './shared/Components/restaurant-food-item/restaurant-food-item.component';
import { RestaurantServingFoodComponent } from './shared/Components/restaurant-serving-food/restaurant-serving-food.component';
import { LoginComponent } from './auth/login/login.component';
import { UnauthorizedComponent } from './auth/unauthorized/unauthorized.component';
import { AdminComponent } from './Admin/admin/admin.component';
import { RegisterComponent } from './auth/register/register.component';
import { CategoryFormComponent } from './Admin/category-form/category-form.component';
import { CategoryListComponent } from './Admin/category-list/category-list.component';
import { MenuComponent } from './shared/Components/menu/menu.component';
import { MenuItemListComponent } from './Admin/menu-item-list/menu-item-list.component';
import { VendorListComponent } from './Admin/vendor-list/vendor-list.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { AdminRegistrationComponent } from './Admin/admin-registration/admin-registration.component';
import { OrderSummaryComponent } from './Stores/order-summary/order-summary.component';
import { MatIconModule } from '@angular/material/icon';

import { PharmacyComponent } from './shared/Pharm/pharmacy/pharmacy.component';
import { PharmacyItemsComponent } from './shared/Pharm/pharmacy-items/pharmacy-items.component';
import { PharmacyServingComponent } from './shared/Pharm/pharmacy-serving/pharmacy-serving.component';
import { SearchComponent } from './shared/search/search.component';
import { VLoginComponent } from './auth/v-login/v-login.component';







@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    StoreComponent,
    GoogleComponent,
    PopformComponent,
    GiftsComponent,
    StoreItemPageComponent,
    RecipientComponent,
    FeedbackComponent,
    ConfirmBtnComponent,
    LoginComponent,
    UnauthorizedComponent,
    AdminComponent,
    ConfirmMessageComponent,
    ProcessComponent,
    PaymentsComponent,
    StoreItemComponent,
    HeaderComponent,
    HeroComponent,
    ImageCarouselComponent,
    PartnerDocumentsComponent,
    BannerComponent,
    FillFormComponent,
    TrackingComponent,
    CategoriesComponent,
    InstagramComponent,
    ProductComponent,
    NavbarComponent,
    VendorListComponent,
    MenuComponent,
    MenuItemListComponent,
    FooterComponent,
    BusComponent,
    CategoryFormComponent,
    CategoryListComponent,
    RegisterComponent,
    FaqItemComponent,
    TestimonyComponent,
    FaqComponent,
    PrivacyPolicyComponent,
   ContactComponent,
   AboutUsComponent,
   AboutUsContentComponent,
   AboutUsDescriptionComponent,
   AboutUsTitleComponent,
   FormComponent,
   ServiceSectionComponent,
  HeroCourierComponent,
  DFaqComponent,
  FoodsComponent,
  RestaurantFoodItemComponent,
    RestaurantServingFoodComponent,
      RegistrationComponent,
    PartnerComponent,
    DeliverComponent,
    LandingPageComponent,
    AddressComponent,
    BlogComponent,
    BlogDetailsComponent,
    CreateBlogComponent,
    EditBlogComponent,
    SubscriptionComponent,
    SellComponent,
    ManageComponent,
    GrowComponent,
    BlogHeaderComponent,
    TabComponent,
    SwiperComponent,
    AuthComponent,
    MoneyComponent,
    PageLandingComponent,
    WalletComponent,
    NavigationComponent,
    FilterDriverComponent,
    HeroDriverComponent,
    HeaderDriverComponent,
    TrackingStatusComponent,
    CartsPageComponent,
    CheckoutComponent,
    LogoutComponent,
    ProfileComponent,
    AdminRegistrationComponent,
    OrderSummaryComponent,
    PharmacyItemsComponent,
    PharmacyServingComponent,
    PharmacyComponent,
    SearchComponent,
    VLoginComponent
  

    
  ],

  imports: [
     NgbModule,
     BrowserModule,
     AppRoutingModule,
     SlickCarouselModule,
     HttpClientModule,
     BrowserAnimationsModule,
     CommonModule,
     MatExpansionModule,
     FontAwesomeModule,
     ReactiveFormsModule,
     GoogleMapsModule,
     MatDialogModule,
     FormsModule,
     MatIconModule,
    MatIconModule,
     IonicModule.forRoot(),
     ToastrModule.forRoot({
      timeOut:3000,
      positionClass:'toast-bottom-right',
      preventDuplicates: true,
      newestOnTop:false
    })

     

    
  ],
  providers: [
    provideAnimationsAsync(),
    DatePipe,
    ContactService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {provide:HTTP_INTERCEPTORS, useClass:AuthInterceptor, multi: true },
    {provide:HTTP_INTERCEPTORS, useClass:LoadingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
