import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Subject, BehaviorSubject} from 'rxjs';
import {Observable } from 'rxjs';
import { User } from '../models/user.model';

const httpOptions = {
  headers: new HttpHeaders ({
  "Access-Control-Allow-Methods": "GET, POST",
  "Access-Control-Allow-Headers" : "Content-type",
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin":"*"
  })
};  

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  
  userSubject:Subject<User> = new BehaviorSubject<User>(undefined);
  private baseURL: string = "http://localhost:8888/";
  
  constructor(private http: HttpClient) { }
  
  createNewUser(user : User):Observable<any>{
    return this.http.post(this.baseURL+'inscription', JSON.stringify(user), httpOptions);
  }

  verifyEmailAndConnection(string : Object):Observable<any> {
    return this.http.post(this.baseURL+'verifyEmailAndConnection', JSON.stringify(string), httpOptions);
  }

  emitUser(user: User) { 
    this.userSubject.next(user); 
  }

  getUser() { 
    return this.userSubject; 
  }
  
  disconnectUser() { 
    localStorage.removeItem("user");
    this.userSubject.next(null); 
  }
}
