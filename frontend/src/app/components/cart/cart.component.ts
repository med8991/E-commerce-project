import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  products : Object[] = new Array();
  dataUser : string;
  ifOrder : boolean = false;
  totaleQuantity : number;

  constructor(private router : Router,
              private productService : ProductService) { }

  ngOnInit() {
    this.dataUser = localStorage.getItem("user");
    if(this.dataUser === null){
      this.router.navigate(['/login']);
    }

    let objectSend = {email : ""};
    objectSend.email = JSON.parse(this.dataUser).email;

    this.productService.loadProductsCart(objectSend).subscribe((productsCart) => {
      this.products = productsCart;
    })
  }

  onDeleteProduct(i : number) {
    let objectSend = {email : "", 
                      titre : "", 
                      prix : "", 
                      categorie : "", 
                      marque : "", 
                      description : "",
                      promotion : "",
                      target : ""};

      objectSend.email = JSON.parse(this.dataUser).email;
      objectSend.titre = this.products[i]['titre'];
      objectSend.prix = this.products[i]['prix'];
      objectSend.categorie = this.products[i]['categorie'];
      objectSend.marque = this.products[i]['marque'];
      objectSend.description = this.products[i]['description'];
      objectSend.promotion = this.products[i]['promotion'];
      objectSend.target = this.products[i]['target'];
  
      console.log(objectSend);

    this.productService.removeProduct(objectSend).subscribe((reponse) => {
  
    }, (error) => {
      if(error.message !== "Http failure during parsing for http://localhost:8888/removeProduct") {
        if(error.message === "Http failure response for http://localhost:8888/removeProduct: 0 Unknown Error") {
          alert("Impossible de contacter le serveur");
        }
        else {
          alert(error.message);
        }
      }
    })

    let array = new Array();

    for(let j = 0; j < this.products.length; j++) {
      if(j != i) {
        array.push(this.products[j]);   
      }
    }

    this.products = array;
  }

  onIncreProduct(i : number) {
    let objectSend = {email : "", 
                      titre : "", 
                      prix : "", 
                      categorie : "", 
                      marque : "", 
                      description : "",
                      promotion : "",
                      target : ""};

      objectSend.email = JSON.parse(this.dataUser).email;
      objectSend.titre = this.products[i]['titre'];
      objectSend.prix = this.products[i]['prix'];
      objectSend.categorie = this.products[i]['categorie'];
      objectSend.marque = this.products[i]['marque'];
      objectSend.description = this.products[i]['description'];
      objectSend.promotion = this.products[i]['promotion'];
      objectSend.target = this.products[i]['target'];
  
      console.log(objectSend);

    this.productService.updateProduct(objectSend).subscribe((reponse) => {
  
    }, (error) => {
      if(error.message !== "Http failure during parsing for http://localhost:8888/removeProduct") {
        if(error.message === "Http failure response for http://localhost:8888/removeProduct: 0 Unknown Error") {
          alert("Impossible de contacter le serveur");
        }
        else {
          alert(error.message);
        }
      }
    })

    this.products[i]['quantite'] = Number.parseInt(this.products[i]['quantite']) + 1;
  }



  onDescProduct(i : number) {
    let objectSend = {email : "", 
                    titre : "", 
                    prix : "", 
                    categorie : "", 
                    marque : "", 
                    description : "",
                    promotion : "",
                    target : ""};

    objectSend.email = JSON.parse(this.dataUser).email;
    objectSend.titre = this.products[i]['titre'];
    objectSend.prix = this.products[i]['prix'];
    objectSend.categorie = this.products[i]['categorie'];
    objectSend.marque = this.products[i]['marque'];
    objectSend.description = this.products[i]['description'];
    objectSend.promotion = this.products[i]['promotion'];
    objectSend.target = this.products[i]['target'];

    console.log(objectSend);

  this.productService.descQuantityProduct(objectSend).subscribe((reponse) => {

  }, (error) => {
    if(error.message !== "Http failure during parsing for http://localhost:8888/removeProduct") {
      if(error.message === "Http failure response for http://localhost:8888/removeProduct: 0 Unknown Error") {
        alert("Impossible de contacter le serveur");
      }
      else {
        alert(error.message);
      }
    }
  })

    this.products[i]['quantite'] = Number.parseInt(this.products[i]['quantite']) - 1;
  }

  onOrder() {
    let quantity = 0;
    for(let i = 0; i < this.products.length; i++) {
      quantity = quantity + (Number.parseInt(this.products[i]['prix']) * Number.parseInt(this.products[i]['quantite']));
    }

    this.products = new Array();
    this.ifOrder = true;
    this.totaleQuantity = quantity;
    let objectSend = {email : ""};
    objectSend.email = JSON.parse(this.dataUser).email;

    this.productService.removeProduct(objectSend).subscribe((reponse) => {
  
    }, (error) => {
      if(error.message !== "Http failure during parsing for http://localhost:8888/removeProduct") {
        if(error.message === "Http failure response for http://localhost:8888/removeProduct: 0 Unknown Error") {
          alert("Impossible de contacter le serveur");
        }
        else {
          alert(error.message);
        }
      }
    })
  }
}
