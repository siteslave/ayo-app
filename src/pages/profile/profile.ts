import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { RegisterPage } from '../register/register';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    private platform: Platform,
    private sqlite: SQLite,
    private alertCtrl: AlertController
  ) {
  }

  ionViewWillEnter() {
    this.getCid();
  }

  doScan() {
    if (this.cid) {
      this.barcodeScanner.scan().then(barcodeData => {
        console.log('Barcode data', barcodeData);
        let alert = this.alertCtrl.create({
          title: 'สำเร็จ!',
          subTitle: 'ลงทะเบียนเสร็จเรียบร้อย : ' + barcodeData.text + '?cid=' + this.cid,
          buttons: ['ตกลง']
        });
        alert.present();

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

}
