import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';

@Injectable()
export class LoginProvider {

  constructor(public http: HttpClient, @Inject('API_URL') private url: string) { }

  doLogin(username: string, password: string) {
    let url = `${this.url}/login`;
    return this.http.post(url, {
      username: 'admin',
      password: '123456'
     });
  }
}