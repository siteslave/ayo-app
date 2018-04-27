import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  getDrugProfiles(url: any) {
    let token: any = sessionStorage.getItem('token');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    };
    
    let apiUrl = `${this.url}/api/drug-profiles`;
    return this.http.get(apiUrl, httpOptions);
  }

}
