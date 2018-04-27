import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { NotifyProvider } from '../../providers/notify/notify';
import { LocalNotifications, ILocalNotificationTrigger, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications';
import * as _ from 'lodash';
import * as moment from 'moment';
@IonicPage()
@Component({
  selector: 'page-drugs',
  templateUrl: 'drugs.html',
})
export class DrugsPage {
  drugs: any = [];
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
    private notifyProvider: NotifyProvider,
    private localNotifications: LocalNotifications
  ) {
    this.hn = this.navParams.get('hn');
    // this.url = this.navParams.get('url');
    this.hospcode = this.navParams.get('hospcode');
    this.hospname = this.navParams.get('hospname');
  }

  ionViewDidLoad() { 
    this.platform.ready()
      .then(() => {
        this.localNotifications.schedule({
          text: 'Test alert',
          trigger: { at: new Date(new Date().getTime() + 5000) },
          led: 'FF0000',
          vibrate: true
        });
      });
  }

  doScan() {
    if (this.hn && this.hospcode) {
      this.barcodeScanner.scan().then(barcodeData => {
        if (barcodeData.text) {
          this.notifyProvider.getDrugProfiles(barcodeData.text)
            .subscribe(async (res: any) => {
              console.log(res);
              if (res.ok) {
                // console.log(res.rows);
                await this.deleteDrug();
                await this.saveDrug(res.rows);
              } else {
                // error
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

  deleteDrug() {
    this.platform.ready().then(() => {

      this.sqlite.create({
        name: 'drugnotify.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {

          let sql = `DELETE FROM drug_profiles;`;

          db.executeSql(sql, [])
            .then((res: any) => {
              // success
              console.log('Delete success');
            })
            .catch(e => console.log(e));

        })
        .catch(e => console.log(e));
    });
  }

  saveDrug(items: any) {
    let sql = [];

    items.forEach(item => {
      let _sql = `INSERT INTO drug_profiles(vstdate, drug_name, usage_line1, 
        usage_line2, usage_line3, unit, amount, next_date)
        VALUES('${item.vstdate}', '${item.drug_name}', '${item.usage_line1}', 
        '${item.usage_line2}', '${item.usage_line3}', '${item.unit}', 
        '${item.amount}', '${item.next_date}');`;
      sql.push(_sql);
    });

    this.platform.ready().then(() => {

      this.sqlite.create({
        name: 'drugnotify.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {

          db.sqlBatch(sql)
            .then((res: any) => {
              // success
              console.log('Save success');
              this.getDrugs();
            })
            .catch(e => console.log(e));

        })
        .catch(e => console.log(e));
    });
  }

  getDrugs() {

    this.drugs = [];

    this.platform.ready().then(() => {

      this.sqlite.create({
        name: 'drugnotify.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {

          let sql = `
            SELECT * FROM drug_profiles;
            `;

          db.executeSql(sql, [])
            .then((res: any) => {
              let rows = res.rows;
              if (rows.length > 0) {
                for (let i = 0; i < rows.length; i++) {
                  console.log(rows.item(i));
                  let obj: any = {};
                  obj.vstdate = moment(rows.item(i).vstdate).format('YYYY-MM-DD');
                  obj.next_date = moment(rows.item(i).next_date).format('YYYY-MM-DD');
                  obj.drug_name = rows.item(i).drug_name;
                  obj.usage_line1 = rows.item(i).usage_line1;
                  obj.usage_line2 = rows.item(i).usage_line2;
                  obj.usage_line3 = rows.item(i).usage_line3;
                  obj.unit = rows.item(i).unit;
                  obj.amount = rows.item(i).amount;
                  this.drugs.push(obj);
                }

                let groups: any = [];
                groups = _.uniqBy(this.drugs, 'next_date');
                console.log(groups);
                let notifies = [];

                groups.forEach(item => {
                  // console.log(nextdate);
                  let total = 0;
                  this.drugs.forEach(v => {
                    if (v.next_date === item.next_date) {
                      total++;
                    }
                  });

                  let datediff = moment(item.next_date).diff(moment(), 'days');

                  notifies.push({
                    id: moment(item.next_date).format('x'),
                    message: 'มีรายการยาที่ต้องรับประทาน ' + total + ' รายการ',
                    countDate: datediff,
                    next_date: item.next_date
                  });

                });

                console.log(notifies);
                this.setNotifies(notifies);
              }
            })
            .catch(e => console.log(e));

        })
        .catch(e => console.log(e));
    });
  }

  setNotifies(notifies: any) {

    notifies.forEach(v => {

      // countDate
      for (let x = 1; x <= v.countDate; x++) {

        let nextAlertDate = moment().add(x, 'day');

        let options: ILocalNotificationTrigger = {
          at: new Date(nextAlertDate.get('year'), nextAlertDate.get('month'), nextAlertDate.get('date'), 9),
          before: new Date(moment(v.next_date).get('year'), moment(v.next_date).get('month'), moment(v.next_date).get('date'))
        };

        // let alert = {
        //   next_date: v.next_date,
        //   message: v.message,
        //   notify: options
        // };

        console.log(alert);

        this.localNotifications.schedule({
          id: +v.id++,
          text: v.message,
          vibrate: true,
          trigger: options
        });
        
      }

    });
  }

  getAllNotify() {
    this.platform.ready()
      .then(() => {
        this.localNotifications.getAll()
          .then(notify => {
            console.log(notify);
          })
          .catch(error => {
            console.error(error);
          });
      });
  }

  removeAllNotify() {
    let confirm = this.alertCtrl.create({
      title: 'ยกเลิกการแจ้งเตือน?',
      message: 'ต้องการยกเลิการแจ้งเตือนทั้งหมด ใช่หรือไม่?',
      buttons: [
        {
          text: 'ตกลง',
          handler: () => {
            this.localNotifications.cancelAll()
              .then(() => {
                let alert = this.alertCtrl.create({
                  title: 'ยกเลิกเสร็จเรียบร้อยแล้ว',
                  buttons: ['ตกลง']
                });

                alert.present();

              })
              .catch((error) => {
                console.log(error)
              });
          }
        },
        {
          text: 'ยกเลิก',
          handler: () => { }
        }
      ]
    });
    confirm.present();
  }

}
