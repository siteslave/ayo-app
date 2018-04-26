import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';

@Injectable()
export class NotifyProvider {

  constructor(public http: HttpClient, @Inject('API_URL') private url: string) {

  }

  register(cid: any) {
    let url = `${this.url}/notify/register`;
    return this.http.post(url, { cid: cid });
  }

}
