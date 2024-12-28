import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as GlobalConst from './../const/global.constants';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // URL = "http://172.20.10.100:3000/api/"
  URL = GlobalConst.API_URL;
  httpOptions: { headers: HttpHeaders; };

  constructor(public httpClient: HttpClient) { }

  getHeader(token) {
    return this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ token
      })
    };
  }

  login(data) {
    return this.httpClient.post(this.URL + "login" , JSON.stringify(data),{});
  }

  // For Post
  getPostList(index, token){
    if (GlobalConst.remote) {
      return this.httpClient.get(this.URL + "post?page=" + index ,this.getHeader(token));
    }else {
      return this.httpClient.get("assets/json/postList.json" );
    }
  }

  searchPostList(data,index, token){
    return this.httpClient.get(this.URL + "post/search?key="+data+"&page="+ index , this.getHeader(token));
  }

  createPost(data,token, isEdit) {
    if (isEdit){
      return this.httpClient.post(this.URL + "post/update" , data, this.getHeader(token));
    }else {
      return this.httpClient.post(this.URL + "post/create" , data, this.getHeader(token));
    }
  }

  deletePost(data,token) {
    return this.httpClient.post(this.URL + "post/delete" , data, this.getHeader(token));
  }

  getCSV() {
    return this.httpClient.get('./assets/test.csv');
  }

  //For User
  getUserList(index, token) {
    if (GlobalConst.remote) {
      return this.httpClient.get(this.URL + "user?page=" + index, this.getHeader(token));
    }else {
      return this.httpClient.get("assets/json/userList.json" );
    }
    
  }

  searchUserList(data,index, token){
    return this.httpClient.get(this.URL + "user/search?key="+data+"&page="+ index , this.getHeader(token));
  }

  createUser(data,token, isEdit) {
    if (isEdit){
      return this.httpClient.post(this.URL + "user/update" , data, this.getHeader(token));
    }else{
      return this.httpClient.post(this.URL + "user/create" , data, this.getHeader(token));
    }
  }

  deleteUser(data,token) {
    return this.httpClient.post(this.URL + "user/delete" , data, this.getHeader(token));
  }

  getProfile() {
    return this.httpClient.get(this.URL + "users?page=0");
  }

}
