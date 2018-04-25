import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

  name: string = 'Ionic framework';
  age = 10;

  username: string;
  password: string;

  fruits: any = ['Apple', 'Orange', 'Mango'];

  users: any = [
    { id: 1, name: 'Satit Rianpit', type: 'Admin' },
    { id: 2, name: 'John Doe', type: 'Guest' }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
  }

}
