import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Attachments } from 'src/app/services/models/Attachments';
import { Product } from 'src/app/services/models/Product';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  products: BehaviorSubject<Product[]> = new BehaviorSubject([] as Product[]);

  constructor(
    private http: HttpClient
  ) { }


  getAllProducts() {
    return new Promise<Product[]>((resolve, reject) => {
      this.http.get(`${environment.API_BASE_URL}/products`).subscribe({
        next: (res: any) => {
          if (res.status) {
            const products = res.products;
            console.log(products);
            this.products.next(products);
            resolve(this.products.getValue() as Product[])
          } else {
            resolve([]);
          }
        },
        error: (err) => {
          console.error(err);
          resolve([])
        }
      });
    });
  }

  createProduct(product: Product) {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post(`${environment.API_BASE_URL}/products`, { ...product }).subscribe({
        next: (res: any) => {
          if (res.status) {
            const products = this.products.getValue();
            products.push(res.product);
            this.products.next(products);
            resolve(true)
          } else {
            resolve(false);
          }
        },
        error: (err) => {
          console.error(err);
          resolve(false)
        }
      });
    });
  }


  updateProduct(product: Product) {
    return new Promise<boolean>((resolve, reject) => {
      this.http.put(`${environment.API_BASE_URL}/products`, { ...product }).subscribe({
        next: (res: any) => {
          if (res.status) {
            const products = this.products.getValue();
            const index = products.findIndex(u => u.id === res.product.id);
            products[index] = res.product;
            this.products.next(products);
            resolve(true)
          } else {
            resolve(false);
          }
        },
        error: (err) => {
          console.error(err);
          resolve(false)
        }
      });
    });
  }

  deleteProduct(product: Product) {
    return new Promise<boolean>((resolve, reject) => {
      this.http.delete(`${environment.API_BASE_URL}/products/${product.id}`).subscribe({
        next: (res: any) => {
          if (res.status) {
            const products = this.products.getValue();
            const index = products.findIndex(u => u.id === res.product.id);
            products.splice(index, 1);
            this.products.next(products);
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error: (err) => {
          console.error(err);
          resolve(false);
        }
      });
    });
  }


  uploadFiles(files: any[]) {
    return new Promise<Attachments[] | null>((resolve, reject) => {
      const formData = new FormData();

      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        formData.append('files[]', file);
      }

      const headers = new HttpHeaders();
      headers.append('Accept', 'application/json'); // Optional headers


      this.http.post(`${environment.API_BASE_URL}/upload`, formData, { headers }).subscribe({
        next: (res: any) => {
          if (res.urls) {
            let attachements: Attachments[] = [];
            for (let index = 0; index < res.urls.length; index++) {
              const url = res.urls[index];
              attachements.push({ url, fileName: files[index].name, mimeType: files[index].type });
            }
            console.log(attachements);
            resolve(attachements)
          } else {
            resolve([]);
          }
        },
        error: (err) => {
          console.error(err);
          resolve(null)
        }
      });
    });
  }


}
