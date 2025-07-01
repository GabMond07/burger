import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, NavParams } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToolbarComponent } from './shared/toolbar/toolbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NgxsModule } from '@ngxs/store';
import { CategoriesState } from './state/categories/categories.state';
import { ProductsState } from './state/products/products.state';
import { AuthState } from './state/auth/auth.state';
import { LoginComponent } from './shared/login/login.component';
import { UsersState } from './state/users/users.state';
import { CreateAccountComponent } from './shared/create-account/create-account.component';
import { ListProductsOrderComponent } from './shared/list-products-order/list-products-order.component';
import { StripeState } from './state/stripe/stripe.state';
import { OrdersState } from './state/orders/orders.state';
import { ServiceWorkerModule } from '@angular/service-worker';

export function HttpLoaderFactory(http: HttpClient){
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgxsModule.forRoot([
      CategoriesState,
      ProductsState,
      AuthState,
      UsersState,
      StripeState,
      OrdersState
    ]),
    ToolbarComponent,
    FooterComponent,
    LoginComponent,
    CreateAccountComponent,
    ListProductsOrderComponent,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    NavParams
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
