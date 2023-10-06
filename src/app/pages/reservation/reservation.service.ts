import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from './../../../environments/environment.development' ; 
import {Observable, from } from 'rxjs'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  URL_ADD_RESERVATION ="/reservations" ;
  reservation : any ;  
  constructor(private http:HttpClient) { }
  resolvedata(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Promise<void>{
    return new Promise((resolve,reject)=>{
       const id = route.params['id'];
       if(id){
        this.getReservation(id).subscribe(res => {
          console.log("there is id " , res );
          this.reservation = res ; 
          resolve();
        })
      

       }else {
        console.log("no Data ");
        
        resolve()
       }
      
    })
  }
    addReservation(reservation:any){
    return from(this.http.post(`${environment.API_BASE_URL}${this.URL_ADD_RESERVATION}` ,reservation )) 
  }
  getReservation(id:string){
    return from(this.http.get(`${environment.API_BASE_URL}${this.URL_ADD_RESERVATION}/${id}`))
  }
  updateReservation(reservation:any){
    return from(this.http.put(`${environment.API_BASE_URL}${this.URL_ADD_RESERVATION}` ,reservation )) 
  }

  
}
