import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  sortForm: FormGroup;
  products: Object[] = new Array();
  originalProducts: Object[];
  tmpProducts1: Object[];
  tmpProducts2: Object[];
  loading: boolean = false;
  successMessage: boolean = false;
  
  constructor(private formBuilder: FormBuilder,
              private productService: ProductService,
              private router: Router) { }

  ngOnInit() {
    this.initForm();
    this.productService.loadProductsStore().subscribe(products => {
      this.originalProducts = products;
      this.products = products;
      this.products.sort(this.compare);
    })
  }

  initForm() {
    this.sortForm = this.formBuilder.group({
      prix: ['', []],
      categorie: ['', []],
      marque: ['', []] 
    })
  }

  compare(a, b) {
    const genreA = a.titre.toUpperCase();
    const genreB = b.titre.toUpperCase();
    
    let comparison = 0;
    if (genreA > genreB) {
      comparison = 1;
    } else if (genreA < genreB) {
      comparison = -1;
    }
    return comparison;
  }

  onAddProduct(product: Object) {
    let dataUser = localStorage.getItem("user");
    if(dataUser === null){
      this.router.navigate(['/login']);
    }
    else {
      this.loading = true;
      this.successMessage = false;
    
      let objectSend = {email : "", 
                        titre : "", 
                        prix : "", 
                        categorie : "", 
                        marque : "", 
                        description : "",
                        promotion : "",
                        target : ""};

      objectSend.email = JSON.parse(dataUser).email;
      objectSend.titre = product['titre'];
      objectSend.prix = product['prix'];
      objectSend.categorie = product['categorie'];
      objectSend.marque = product['marque'];
      objectSend.description = product['description'];
      objectSend.promotion = product['promotion'];
      objectSend.target = product['target'];
      
      this.productService.verifyProduct(objectSend).subscribe((reponse) => {
        if(reponse.resultat) {
          this.loading = false;
          this.productService.updateProduct(objectSend).subscribe((reponse) => {
            this.successMessage = true;
          }, (error) => {
            this.loading = false;
            if(error.message === "Http failure response for http://localhost:8888/updateProduct: 0 Unknown Error") {
              alert("Impossible de contacter le serveur");
            }
            else {
              alert(error.message);
            }
          })
        }
        else {
          objectSend['quantite'] = 1;
          this.productService.addProduct(objectSend).subscribe((reponse) => {
            this.loading = false;
          }, (error) => {
            this.loading = false;
            if(error.message === "Http failure during parsing for http://localhost:8888/addProduct") {
              this.successMessage = true;
            }
            else {
              if(error.message === "Http failure response for http://localhost:8888/addProduct: 0 Unknown Error") {
                alert("Impossible de contacter le serveur");
              }
              else {
                alert(error.message);
              }
            }
          })
        }
      }, (error) => { 
        this.loading = false;
        if(error.message === "Http failure response for http://localhost:8888/verifyProduct: 0 Unknown Error") {
          alert("Impossible de contacter le serveur");
        }
        else {
          alert(error.message);
        }
      })
    }
  }

  onChange() {
    this.successMessage = false;
    this.products = new Array();
    this.tmpProducts1 = new Array();
    this.tmpProducts2 = new Array();

    const prix = this.sortForm.get('prix').value;
    const categorie = this.sortForm.get('categorie').value;
    const marque = this.sortForm.get('marque').value;

    const prix1 = prix.split("/")[0];
    const prix2 = prix.split("/")[1];
    
    if(prix === "default" || prix === "") {
      this.tmpProducts1 = this.originalProducts;
    }
    else {
      for(let i = 0; i < this.originalProducts.length; i++) {
        let currentProduct = this.originalProducts[i];
  
        if(prix === "sup200") {
          if(Number.parseInt(currentProduct['prix']) >= 200) {
            this.tmpProducts1.push(currentProduct);
          }
        } 
        else {
          if(Number.parseInt(currentProduct['prix']) >= prix1 && Number.parseInt(currentProduct['prix']) <= prix2) {
            this.tmpProducts1.push(currentProduct);
          } 
        }
      }
    }

    if(categorie === "default" || categorie === "") {
      this.tmpProducts2 = this.tmpProducts1;
    }
    else {
      console.log(this.tmpProducts1);
      for(let i = 0; i < this.tmpProducts1.length; i++) {
        let currentProduct = this.tmpProducts1[i];
        if(currentProduct['categorie'] === categorie) {
          this.tmpProducts2.push(currentProduct);
        }
      }
    }

    if(marque === "default" || marque === "") {
      this.products = this.tmpProducts2;
    }
    else {
      for(let i = 0; i < this.tmpProducts2.length; i++) {
        let currentProduct = this.tmpProducts2[i];

        if(currentProduct['marque'] === marque) {
          this.products.push(currentProduct);
        }
      }
    }
  }
}
