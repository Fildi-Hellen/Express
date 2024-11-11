import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./Components/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./Components/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./Components/orders/orders.module').then( m => m.OrdersPageModule)
  },
  {
    path: 'order-details',
    loadChildren: () => import('./Components/order-details/order-details.module').then( m => m.OrderDetailsPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./Components/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./Components/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./Components/notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'faq',
    loadChildren: () => import('./Support/faq/faq.module').then( m => m.FaqPageModule)
  },
  {
    path: 'contact',
    loadChildren: () => import('./Support/contact/contact.module').then( m => m.ContactPageModule)
  },
  {
    path: 'header',
    loadChildren: () => import('./Shared/header/header.module').then( m => m.HeaderPageModule)
  },
  {
    path: 'footer',
    loadChildren: () => import('./Shared/footer/footer.module').then( m => m.FooterPageModule)
  },
  {
    path: 'earnings',
    loadChildren: () => import('./Shared/earnings/earnings.module').then( m => m.EarningsPageModule)
  },
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
