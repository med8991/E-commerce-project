import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  signInForm: FormGroup;
  errorMessage: string = "";
  loading: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    let dataUser = localStorage.getItem("user");
    if(dataUser !== null){
      this.router.navigate(['/store']);
    }

    this.initForm();
  }

  initForm() {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    })
  }

  verifyForm() {
    const email = this.signInForm.get('email').value;
    const password = this.signInForm.get('password').value;

    if(email == "" || password == "") {
      return "Tous les champs sont requis";
    }
  }

  onSubmit(){
    this.loading = true;
    const reponse = this.verifyForm();
    if(reponse) {
      this.errorMessage = reponse;
      this.loading = false;
      return;
    }

    this.errorMessage = "";

    const email = this.signInForm.get('email').value;
    const password = this.signInForm.get('password').value;

    var user = new User("", email, password);
    var objectSend = {email : "", password : ""};
    objectSend.email = email;
    objectSend.password = password;

    this.authService.verifyEmailAndConnection(objectSend).subscribe(reponse =>{
      if(reponse.resultat) {
        user.name = reponse.name;
        this.authService.emitUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        this.router.navigate(['/store']);
      }
      else {
        this.loading = false;
        this.errorMessage = "Votre email ou mot de passe est incorrecte";
      }
    },(error) => {
      this.loading = false;
      if(error.message == "Http failure response for http://localhost:8888/verifyEmailAndConnection: 0 Unknown Error"){
        alert("Impossible de contacter le serveur");
      }
      else {
        alert(error.message);
      }
    });
  }
}
