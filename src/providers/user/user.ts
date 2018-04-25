import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';

@Injectable()
export class UserProvider {

  constructor(public http: HttpClient, @Inject('API_URL') private url: string) {
   
  }

  getUsers() {
    let token = sessionStorage.getItem('token');

    let url = `${this.url}/students?token=${token}`;
    return this.http.get(url);
  }

}
