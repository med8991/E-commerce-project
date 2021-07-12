import { Component, OnInit } from '@angular/core';
import { User } from './models/user.model';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  userObservable : Observable<User>;
  dataUser : string;

  constructor(private authService : AuthService,
              private router : Router) { }

  ngOnInit() {
    this.userObservable = this.authService.getUser();
    
    this.dataUser = localStorage.getItem("user");
    if(this.dataUser !== null){
      this.authService.emitUser(JSON.parse(this.dataUser));
    }
  }

  onSignOut() {
    this.authService.disconnectUser();
    this.router.navigate(['/store']);
  }
}
