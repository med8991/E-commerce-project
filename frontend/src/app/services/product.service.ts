import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
export class ProductService {

  private baseURL: string = "http://localhost:8888/";
  
  constructor(private http: HttpClient) { }

  loadProductsStore():Observable<any> {
    return this.http.get(this.baseURL+'loadProductsStore');
  }

  loadProductsCart(email : Object):Observable<any> {
    return this.http.post(this.baseURL+'loadProductsCart', JSON.stringify(email), httpOptions);
  }

  verifyProduct(product : Object):Observable<any> {
    return this.http.post(this.baseURL+'verifyProduct', JSON.stringify(product), httpOptions);
  }

  addProduct(objectSend: Object): Observable<any> {
    return this.http.post(this.baseURL+'addProduct', JSON.stringify(objectSend), httpOptions);
  }

  removeProduct(objectSend: Object): Observable<any> {
    return this.http.post(this.baseURL+'removeProduct', JSON.stringify(objectSend), httpOptions);
  }

  updateProduct(objectSend: Object): Observable<any> {
    return this.http.post(this.baseURL+'updateProduct', JSON.stringify(objectSend), httpOptions);
  }
  
  descQuantityProduct(objectSend: Object): Observable<any> {
    return this.http.post(this.baseURL+'descQuantityProduct', JSON.stringify(objectSend), httpOptions);
  }
}
