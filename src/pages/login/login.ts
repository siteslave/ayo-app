import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { UsersPage } from '../users/users';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  username: string;
  password: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loginProvider: LoginProvider
  ) {
  }

  doLogin() {
    this.loginProvider.doLogin(this.username, this.password)
      .subscribe((res: any) => {
        console.log(res);
        if (res.ok) {
          sessionStorage.setItem('token', res.token);
          this.navCtrl.setRoot(UsersPage);
        }
      }, (error: any) => {
         
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
