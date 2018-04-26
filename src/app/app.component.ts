import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { UsersPage } from '../pages/users/users';
import { LoginPage } from '../pages/login/login';

import { SQLite, SQLiteObject, SQLiteTransaction } from '@ionic-native/sqlite';
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
          // let sqlDelete = 'DROP TABLE IF EXISTS profile;';
          let sqlDelete = 'SELECT 1 as t;';
          let sqlCid = `
              CREATE TABLE IF NOT EXISTS info(
                cid TEXT,
                first_name TEXT,
                last_name TEXT,
                telephone TEXT)
            `;
          let sqlProfile = `
              CREATE TABLE IF NOT EXISTS profile(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                hn TEXT,
                hospcode TEXT,
                hospname TEXT,
                url TEXT)
            `;
          let sqlDrugs = `
              CREATE TABLE IF NOT EXISTS drug_profiles(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                vstdate TEXT,
                drug_name TEXT,
                usage_line1 TEXT,
                usage_line2 TEXT,
                usage_line3 TEXT,
                unit TEXT,
                amount TEXT,
                hospcode TEXT,
                next_date TEXT)
            `;
          
          db.sqlBatch([sqlDelete, sqlCid, sqlDrugs, sqlProfile])
            .then(() => { console.log('Executed SQL') })
            .catch((e) => { console.log(e) });

        })
        .catch(e => console.log(e));

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

