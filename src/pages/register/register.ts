import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  cid: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private platform: Platform,
    private sqlite: SQLite
  ) { }

  doRegister() {
    this.platform.ready().then(() => {

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
    });
  }

}
