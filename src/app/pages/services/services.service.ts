import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Attachments } from 'src/app/services/models/Attachments';
import { Service } from 'src/app/services/models/Service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  services: BehaviorSubject<Service[]> = new BehaviorSubject([] as Service[]);

  constructor(
    private http: HttpClient
  ) { }


  getAllServices() {
    return new Promise<Service[]>((resolve, reject) => {
      this.http.get(`${environment.API_BASE_URL}/services`).subscribe({
        next: (res: any) => {
          if (res.status) {
            const services = res.services;
            console.log(services);
            this.services.next(services);
            resolve(services as Service[])
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

  createService(service: Service) {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post(`${environment.API_BASE_URL}/services`, { ...service }).subscribe({
        next: (res: any) => {
          if (res.status) {
            const services = this.services.getValue();
            services.push(res.service);
            this.services.next(services);
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


  updateService(service: Service) {
    return new Promise<boolean>((resolve, reject) => {
      this.http.put(`${environment.API_BASE_URL}/services`, { ...service }).subscribe({
        next: (res: any) => {
          if (res.status) {
            const products = this.services.getValue();
            const index = products.findIndex(u => u.id === res.service.id);
            products[index] = res.service;
            this.services.next(products);
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

  deleteService(service: Service) {
    return new Promise<boolean>((resolve, reject) => {
      this.http.delete(`${environment.API_BASE_URL}/services/${service.id}`).subscribe({
        next: (res: any) => {
          if (res.status) {
            const services = this.services.getValue();
            const index = services.findIndex(u => u.id === res.service.id);
            services.splice(index, 1);
            this.services.next(services);
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
