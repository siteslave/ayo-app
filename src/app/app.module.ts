import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { DashboardPageModule } from '../pages/dashboard/dashboard.module';
import { UsersPageModule } from '../pages/users/users.module';
import { UserProvider } from '../providers/user/user';
import { HttpClientModule } from '@angular/common/http';
import { DetailPageModule } from '../pages/detail/detail.module';
import { LoginPageModule } from '../pages/login/login.module';
import { LoginProvider } from '../providers/login/login';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { RegisterPageModule } from '../pages/register/register.module';
import { NotifyProvider } from '../providers/notify/notify';
import { DrugsPageModule } from '../pages/drugs/drugs.module';

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
    LoginPageModule,
    ProfilePageModule,
    RegisterPageModule,
    DrugsPageModule
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
    { provide: 'API_URL', useValue: 'http://192.168.43.142:3000' },
    UserProvider,
    LoginProvider,
    SQLite,
    BarcodeScanner,
    NotifyProvider,
    LocalNotifications
  ]
})
export class AppModule { }
