import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  signUpForm: FormGroup;
  errorMessage: string = "";
  successMessage: string = "";
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
    this.signUpForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
      passwordValidate: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    })
  }

  verifyForm() {
    const name = this.signUpForm.get('name').value;
    const email = this.signUpForm.get('email').value;
    const password = this.signUpForm.get('password').value;
    const passwordValidate = this.signUpForm.get('passwordValidate').value;
    
    // Verification générale

    if(name == "" || email == "" || password == "" || passwordValidate == "") {
      return "Tous les champs sont requis";
    }

    // Verfication email

    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!email.match(mailformat)) {
      return "Adresse email invalide"
    }

    // Verfication mot de passe 

    const alphabetFormat = /[a-zA-Z]/;
    const numberFormat= /[0-9]/;
    if((password.length < 6) || (password.length > 16)) {
      return "Mot de passe doit être compris entre 6 à 16 caratères"
    }
    if((password.search(alphabetFormat) === -1) || (password.search(numberFormat) === -1)) {
      return "Mot de passe doit contenir au moins un chiffre et une lettre";
    }

    // Verfifcation confirmation mot de passe

    if(password !== passwordValidate) {
      return "Les mots de passe ne correspondent pas";
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

    const name = this.signUpForm.get('name').value;
    const email = this.signUpForm.get('email').value;
    const password = this.signUpForm.get('password').value;

    var user = new User(name, email, password);
    var emailSend = {email : ""};
    emailSend.email = email;

    this.authService.verifyEmailAndConnection(emailSend).subscribe(reponse =>{
      if(!reponse.resultat) {
        this.authService.createNewUser(user).subscribe((reponse) => {
          this.loading = false;
        },(error) => {
          this.loading = false;
          if(error.message == "Http failure response for http://localhost:8888/inscription: 0 Unknown Error"){
            alert("Impossible de contacter le serveur");
          }
          else {
            if(error.message !== "Http failure during parsing for http://localhost:8888/inscription") {
              alert(error.message);
            }
            else {
              alert("Inscription effectué avec succès");
              this.router.navigate(['/login']);
            }
          }
        })
      }
      else {
        this.loading = false;
        this.errorMessage = "Cette adresse email est déjà utilisé";
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