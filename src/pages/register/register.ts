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
  isUpdate: boolean;

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

          let sql = null;
          
          if (this.isUpdate) {
            sql = `
            UPDATE profile SET cid=?;
            `;
          } else {
            sql = `
            INSERT INTO profile(cid)
            VALUES(?);
            `;
          }

          db.executeSql(sql, [this.cid])
            .then(() => this.navCtrl.pop())
            .catch(e => console.log(e));

        })
        .catch(e => console.log(e));
    });
  }

  ionViewWillEnter() {
    this.getCid();
  }

  getCid() {
    this.platform.ready().then(() => {

      this.sqlite.create({
        name: 'drugnotify.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {

          let sql = `
            SELECT cid FROM profile LIMIT 1;
            `;

          db.executeSql(sql, [])
            .then((res: any) => {
              let rows = res.rows;
              if (rows.length > 0) {
                this.isUpdate = true;
                for (let i = 0; i < rows.length; i++) {
                  this.cid = rows.item(i).cid;
                }
              } else {
                this.isUpdate = false;
              }
            })
            .catch(e => console.log(e));

        })
        .catch(e => console.log(e));
    });
  }

}
