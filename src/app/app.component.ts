import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { UsersPage } from '../pages/users/users';
import { LoginPage } from '../pages/login/login';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ProfilePage } from '../pages/profile/profile';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = ProfilePage;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private sqlite: SQLite
  ) {
    platform.ready().then(() => {

      this.sqlite.create({
        name: 'drugnotify.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {

          let sql = `
              CREATE TABLE IF NOT EXISTS profile(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cid TEXT,
                hn TEXT,
                hospcode TEXT,
                url TEXT)
            `;

          db.executeSql(sql, {})
            .then(() => console.log('Executed SQL'))
            .catch(e => console.log(e));


        })
        .catch(e => console.log(e));

      // let token = sessionStorage.getItem('token');
      // if (token) {
      //   this.rootPage = UsersPage;
      // } else {
      //   this.rootPage = LoginPage;
      // }
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

