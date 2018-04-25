import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { DashboardPageModule } from '../pages/dashboard/dashboard.module';
import { UsersPageModule } from '../pages/users/users.module';
import { UserProvider } from '../providers/user/user';
import { HttpClientModule } from '@angular/common/http';
import { DetailPageModule } from '../pages/detail/detail.module';
import { LoginPageModule } from '../pages/login/login.module';
import { LoginProvider } from '../providers/login/login';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    DashboardPageModule,
    UsersPageModule,
    DetailPageModule,
    LoginPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: 'API_URL', useValue: 'http://localhost:3000' },
    UserProvider,
    LoginProvider
  ]
})
export class AppModule { }
