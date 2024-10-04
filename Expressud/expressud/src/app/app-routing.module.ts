import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ContactComponent } from './components/contact/contact.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductComponent } from './components/product/product.component';
import { HeroComponent } from './components/hero/hero.component';
import { InstagramComponent } from './components/instagram/instagram.component';
import { BannerComponent } from './components/banner/banner.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { HeaderComponent } from './components/header/header.component';
import { BusComponent } from './shared/courier/bus/bus.component';
import { FaqComponent } from './help/faq/faq.component';
import { PrivacyPolicyComponent } from './help/privacy-policy/privacy-policy.component';
import { AboutUsComponent } from './about/about-us/about-us.component';
import { AboutUsContentComponent } from './about/about-us-content/about-us-content.component';
import { AboutUsTitleComponent } from './about/about-us-title/about-us-title.component';
import { AboutUsDescriptionComponent } from './about/about-us-description/about-us-description.component';
import { ServiceSectionComponent } from './shared/courier/service-section/service-section.component';
import { FormComponent } from './shared/courier/form/form.component';
import { HeroCourierComponent } from './shared/courier/hero-courier/hero-courier.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { AddressComponent } from './components/address/address.component';
import { BlogDetailsComponent } from './Blog/blog-details/blog-details.component';
import { CreateBlogComponent } from './Blog/create-blog/create-blog.component';
import { EditBlogComponent } from './Blog/edit-blog/edit-blog.component';
import { BlogComponent } from './Blog/blog/blog.component';
import { StoreComponent } from './components/store/store.component';
import { StoreItemComponent } from './components/store-item/store-item.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { DeliverComponent } from './components/deliver/deliver.component';
import { PartnerComponent } from './components/partner/partner.component';
import { DFaqComponent } from './components/d-faq/d-faq.component';
import { FaqItemComponent } from './help/faq-item/faq-item.component';
import { TestimonyComponent } from './components/testimony/testimony.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { SellComponent } from './Sub/sell/sell.component';
import { GrowComponent } from './Sub/grow/grow.component';
import { ManageComponent } from './Sub/manage/manage.component';
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
import { FilterDriverComponent } from './Delivery/Drivers/filter-driver/filter-driver.component';
import { HeaderDriverComponent } from './Delivery/Drivers/header-driver/header-driver.component';
import { HeroDriverComponent } from './Delivery/Drivers/hero-driver/hero-driver.component';
import { MoneyComponent } from './Delivery/Drivers/money/money.component';
import { NavigationComponent } from './Delivery/Drivers/navigation/navigation.component';
import { PageLandingComponent } from './Delivery/Drivers/page-landing/page-landing.component';
import { TrackingStatusComponent } from './Delivery/Drivers/tracking-status/tracking-status.component';
import { WalletComponent } from './Delivery/Drivers/wallet/wallet.component';
import { ProcessComponent } from './Delivery/Drivers/process/process.component';
import { PopformComponent } from './components/popform/popform.component';
import { ConfirmMessageComponent } from './Page/confirm-message/confirm-message.component';
import { ConfirmBtnComponent } from './Page/confirm-btn/confirm-btn.component';
import { FeedbackComponent } from './Page/feedback/feedback.component';
import { RecipientComponent } from './Page/recipient/recipient.component';
import { GiftsComponent } from './Page/gifts/gifts.component';
import { StoreItemPageComponent } from './Stores/store-item-page/store-item-page.component';
import { CheckoutComponent } from './Stores/checkout/checkout.component';
import { CartsPageComponent } from './Stores/carts-page/carts-page.component';
import { FoodsComponent } from './shared/Components/foods/foods.component';
import { RestaurantFoodItemComponent } from './shared/Components/restaurant-food-item/restaurant-food-item.component';
import { RestaurantServingFoodComponent } from './shared/Components/restaurant-serving-food/restaurant-serving-food.component';
import { AdminComponent } from './Admin/admin/admin.component';
import { LoginComponent } from './auth/login/login.component';
import { UnauthorizedComponent } from './auth/unauthorized/unauthorized.component';
import { RoleGuard } from './auth/role.guard';
import { RegisterComponent } from './auth/register/register.component';
import { CategoryListComponent } from './Admin/category-list/category-list.component';
import { CategoryFormComponent } from './Admin/category-form/category-form.component';
import { MenuComponent } from './shared/Components/menu/menu.component';
import { MenuItemListComponent } from './Admin/menu-item-list/menu-item-list.component';
import { VendorListComponent } from './Admin/vendor-list/vendor-list.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { AdminRegistrationComponent } from './Admin/admin-registration/admin-registration.component';
import { OrderSummaryComponent } from './Stores/order-summary/order-summary.component';
import { PharmacyComponent } from './shared/Pharm/pharmacy/pharmacy.component';
import { PharmacyServingComponent } from './shared/Pharm/pharmacy-serving/pharmacy-serving.component';
import { PharmacyItemsComponent } from './shared/Pharm/pharmacy-items/pharmacy-items.component';
import { SearchComponent } from './shared/search/search.component';
import { VLoginComponent } from './auth/v-login/v-login.component';





const routes: Routes = [
  {path:'',component:HomeComponent},
  // {path:'home',component:HomeComponent,canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'customer' }},
  {path:'home',component:HomeComponent},
   {path:'auth',component:AuthComponent},
  {path:'contact',component:ContactComponent},
  {path:'navbar',component:NavbarComponent},
  {path:'footer',component:FooterComponent},
  {path:'blog',component:BlogComponent},
  {path:'product',component:ProductComponent},
  {path:'hero',component:HeroComponent},
  {path:'instagram',component:InstagramComponent},
  {path:'banner',component:BannerComponent},
  {path:'categories',component:CategoriesComponent},
  {path:'header',component:HeaderComponent},
  {path:'bus',component:BusComponent},
  {path:'faq',component:FaqComponent},
  {path:'store',component:StoreComponent},
  {path:'store-item',component:StoreItemComponent},
  {path:'privacy-policy',component:PrivacyPolicyComponent},
  {path:'about-us',component:AboutUsComponent},
  {path:'about-us-content',component:AboutUsContentComponent},
  {path:'about-us-title',component:AboutUsTitleComponent},
  {path:'about-us-description',component:AboutUsDescriptionComponent},
  {path:'hero-courier',component:HeroCourierComponent},
  {path:'service-section',component:ServiceSectionComponent},
  {path:'form',component:FormComponent},
  {path:'landing-page',component:LandingPageComponent},
  {path:'address',component:AddressComponent},
  {path:'blog-details', component:BlogDetailsComponent},
  {path:'create-blog',component:CreateBlogComponent},
  {path:'edit-blog',component:EditBlogComponent},
  {path:'google',component:GoogleComponent},
  {path:'registration',component:RegistrationComponent},
  {path:'deliver',component:DeliverComponent},
  {path:'partner',component:PartnerComponent},
  {path:'d-faq',component:DFaqComponent},
  {path:'faq-item',component:FaqItemComponent},
  {path:'testimony',component:TestimonyComponent},
  {path:'subscription',component:SubscriptionComponent},
  {path:'sell',component:SellComponent},
  {path:'grow',component:GrowComponent},
  {path:'manage',component:ManageComponent},
  { path: '', redirectTo: '/sell', pathMatch: 'full' },
  {path:'blog-header',component:BlogHeaderComponent},
  {path:'tab',component:TabComponent},
  {path:'swiper',component:SwiperComponent},
  {path:'fill-form',component:FillFormComponent},
  {path:'tracking',component:TrackingComponent},
  {path:'partner-documents',component:PartnerDocumentsComponent},
  {path:'image-carousel',component:ImageCarouselComponent},
  {path:'payments',component:PaymentsComponent},
 
  // { path: '', redirectTo: '/login', pathMatch: 'full' },

 
  {path:'filter-driver',component:FilterDriverComponent},
  {path:'header-driver',component:HeaderDriverComponent},
  // {path:'hero-driver',component:HeroDriverComponent,  canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'driver' }},
  {path:'hero-driver',component:HeroDriverComponent},
  {path:'money',component:MoneyComponent},
  {path:'navigation',component:NavigationComponent},
  {path:'page-landing',component:PageLandingComponent},
  {path:'tracking-status',component:TrackingStatusComponent},
  {path:'wallet',component:WalletComponent},
  {path:'process',component:ProcessComponent},
  {path:'popform',component:PopformComponent},
  {path:'confirm-message',component:ConfirmMessageComponent},
  {path:'confirm-btn',component:ConfirmBtnComponent},
  {path:'feedback',component:FeedbackComponent},
  {path:'recipient',component:RecipientComponent},
  {path:'gifts',component:GiftsComponent},
  {path:'store-item-page',component:StoreItemPageComponent},
  {path:'checkout',component:CheckoutComponent, canActivate: [AuthGuard]},
  {path:'carts-page',component:CartsPageComponent},
  {path:'foods',component:FoodsComponent},
  {path:'restaurant-food-item/:restaurantId/:categoryId',component:RestaurantFoodItemComponent},
  {path:'restaurant-foods/:categoryId',component:RestaurantServingFoodComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // { path: 'admin', component: AdminComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'admin' } },
  {path:'admin',component:AdminComponent},
  { path: 'unauthorized', component: UnauthorizedComponent },
  //  { path: '**', redirectTo: '/login' },
  {path:'category-list',component:CategoryListComponent},
  {path:'category-form',component:CategoryFormComponent},
  {path:'menu',component:MenuComponent},
  {path:'menu-item-list',component:MenuItemListComponent},
  {path:'vendor-list',component:VendorListComponent},
  {path:'logout',component:LogoutComponent},
  {path:'profile',component:ProfileComponent},
  {path:'admin-registration',component:AdminRegistrationComponent},
  {path:'order-summary',component:OrderSummaryComponent},
  {path:'pharmacy',component:PharmacyComponent},
  {path:'pharmacy-item/:categoryId',component:PharmacyServingComponent},
  {path:'pharmacy-items/:pharmacyId/:categoryId',component:PharmacyItemsComponent},
  { path: '', redirectTo: '/carts-page', pathMatch: 'full' },
  { path: '**', redirectTo: '/carts-page' },
  {path:'search',component:SearchComponent},
  {path:'v-login',component:VLoginComponent}



  // { path: 'featured', loadChildren: () => import('./routes/featured/featured.module').then(m => m.FeaturedModule) }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


