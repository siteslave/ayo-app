import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { RegisterPage } from '../register/register';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { NotifyProvider } from '../../providers/notify/notify';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cid: any;
  profiles: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    private platform: Platform,
    private sqlite: SQLite,
    private alertCtrl: AlertController,
    private notifyProvider: NotifyProvider
  ) {
  }

  ionViewWillEnter() {
    this.getCid();
    this.getProfile();
  }

  doScan() {
    if (this.cid) {
      this.barcodeScanner.scan().then(barcodeData => {
        if (barcodeData.text) {
          this.notifyProvider.register(this.cid)
            .subscribe((res: any) => {
              console.log(res);
              if (res.ok) {
                console.log(res);
                this.checkHospcode(res.hospcode, res.hospname, res.hn);
              } else {

              }
            }, (error: any) => { 
              console.error(error);
             });
        }
        // let alert = this.alertCtrl.create({
        //   title: 'สำเร็จ!',
        //   subTitle: 'ลงทะเบียนเสร็จเรียบร้อย : ' + barcodeData.text + '?cid=' + this.cid,
        //   buttons: ['ตกลง']
        // });
        // alert.present();

      }).catch(err => {
        console.log('Error', err);
      });
    } else {
      let alert = this.alertCtrl.create({
        title: 'เกิดข้อผิดพลาด!',
        subTitle: 'ไม่พบเลขบัตรประชาชน',
        buttons: ['ตกลง']
      });
      alert.present();
    }
  }

  doRegister() {
    this.navCtrl.push(RegisterPage)
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
                for (let i = 0; i < rows.length; i++) {
                  this.cid = rows.item(i).cid;
                }
              }
            })
            .catch(e => console.log(e));

        })
        .catch(e => console.log(e));
    });
  }

  getProfile() {
    this.platform.ready().then(() => {

      this.sqlite.create({
        name: 'drugnotify.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {

          let sql = `
            SELECT * FROM profile WHERE hospcode <> '' and hn <> '';
            `;

          db.executeSql(sql, [])
            .then((res: any) => {
              let rows = res.rows;
              console.log(rows);
              if (rows.length > 0) {
                for (let i = 0; i < rows.length; i++) {
                  console.log(rows.item(i));
                  let obj: any = {};
                  obj.hospcode = rows.item(i).hospcode;
                  obj.hospname = rows.item(i).hospname;
                  obj.hn = rows.item(i).hn;
                  this.profiles.push(obj);
                }
              }
            })
            .catch(e => console.log(e));

        })
        .catch(e => console.log(e));
    });
  }

  checkHospcode(hospcode: any, hospname: any, hn: any) {
    this.platform.ready().then(() => {

      this.sqlite.create({
        name: 'drugnotify.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {

          let sql = `SELECT * FROM profile WHERE hospcode=?;`;

          db.executeSql(sql, [hospcode])
            .then((res: any) => {
              let rows = res.rows;
              if (rows.length > 0) {
                // update HN
                this.updateRegister(this.cid, hospcode, hn);
              } else {
                // New record
                this.saveRegister(this.cid, hospcode, hospname, hn);
              }
            })
            .catch(e => console.log(e));

        })
        .catch(e => console.log(e));
    });
  }

  saveRegister(cid: any, hospcode: any, hospname: any, hn: any) {
    this.platform.ready().then(() => {

      this.sqlite.create({
        name: 'drugnotify.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {

          let sql = `
          INSERT INTO profile(cid, hospcode, hospname, hn)
          VALUES(?, ?, ?, ?);
          `;
          console.log(hospcode, hospname, hn);
          db.executeSql(sql, [cid, hospcode, hospname, hn])
            .then((res: any) => {
              // success
              console.log('Save success')
              this.getProfile();
            })
            .catch(e => console.log(e));

        })
        .catch(e => console.log(e));
    });
  }

  updateRegister(cid: any, hospcode: any, hn: any) {
    this.platform.ready().then(() => {

      this.sqlite.create({
        name: 'drugnotify.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {

          let sql = `
          UPDATE profile SET hn=? WHERE cid=? AND hospcode=?;
          `;

          db.executeSql(sql, [hn, cid, hospcode])
            .then((res: any) => {
              // success
              console.log('Update success');
              this.getProfile();
            })
            .catch(e => console.log(e));

        })
        .catch(e => console.log(e));
    });
  }


}
