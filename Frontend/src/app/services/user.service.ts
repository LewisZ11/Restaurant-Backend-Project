import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) {
  }

  // TODO: Don't forget check this error
  signUp(data: any) {
    return this.httpClient.post(this.url + '/user/signup', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json') // 写错了出了个bug
    });
  }

  forgotPassword(data: any) {
    return this.httpClient.post(this.url + '/user/forgotPassword', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json') // 写错了出了个bug
    });
  }

  login(data: any) {
    return this.httpClient.post(this.url + '/user/login', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json') // 写错了出了个bug
    });
  }

  checkToken() {
    return this.httpClient.get(this.url + '/user/checkToken');
  }

  changePassword(data: any) {
    return this.httpClient.post(this.url + '/user/changePassword', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json') // 写错了出了个bug
    });
  }

  getUsers() {
    return this.httpClient.get(this.url + '/user/get');
  }

  update(data: any) {
    return this.httpClient.post(this.url + '/user/update', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

}
