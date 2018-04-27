import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { SQLite } from '@ionic-native/sqlite';
import { NotifyProvider } from '../../providers/notify/notify';

@IonicPage()
@Component({
  selector: 'page-drugs',
  templateUrl: 'drugs.html',
})
export class DrugsPage {

  hn: any;
  url: any;
  hospcode: any;
  hospname: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    private platform: Platform,
    private sqlite: SQLite,
    private alertCtrl: AlertController,
    private notifyProvider: NotifyProvider
  ) {
    this.hn = this.navParams.get('hn');
    // this.url = this.navParams.get('url');
    this.hospcode = this.navParams.get('hospcode');
    this.hospname = this.navParams.get('hospname');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DrugsPage');
  }

  doScan() {
    if (this.hn && this.hospcode) {
      this.barcodeScanner.scan().then(barcodeData => {
        if (barcodeData.text) {
          this.notifyProvider.getDrugProfiles(barcodeData.text)
            .subscribe((res: any) => {
              console.log(res);
              if (res.ok) {
                // console.log(res.rows);
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


}
