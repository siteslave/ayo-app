import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';

@Injectable()
export class NotifyProvider {

  constructor(public http: HttpClient, @Inject('API_URL') private url: string) {

  }

  register(url: any, cid: any) {
    let apiUrl = `${this.url}/notify/register`;
    return this.http.post(apiUrl, { cid: cid });
  }

  checkAuth(url: any, hn: any) {
    let apiUrl = `${this.url}/notify/auth`;
    return this.http.post(apiUrl, { hn: hn });
  }

}
