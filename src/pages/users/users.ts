import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { LoadingController } from 'ionic-angular';
import { DetailPage } from '../detail/detail';
import { AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {

  users: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userProvider: UserProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
  ) {
  }

  ionViewDidLoad() {

    let loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loader.present();

    this.userProvider.getUsers()
      .subscribe((res: any) => {
        // success
        if (res.ok) {
          this.users = res.rows;
        } else {
          if (res.code === 401) {
            this.navCtrl.setRoot(LoginPage);
          }
        }
        loader.dismiss();
      }, (error: any) => {
        // error
        console.log(error);
        let alert = this.alertCtrl.create({
          title: 'Connection error!',
          subTitle: 'ไม่สามารถเชื่อมต่อ Net ได้!',
          buttons: ['ตกลง']
        });
        alert.present();

        loader.dismiss();
      });
  }

  getDetail(user: any) {
    this.navCtrl.push(DetailPage, user);
  }

}
