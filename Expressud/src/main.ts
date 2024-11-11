/// <reference types="@angular/localize" />
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import {register as registerSwiperElements } from 'swiper/element/bundle'

if (environment.production) {
  enableProdMode();
}
registerSwiperElements();
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));



platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
