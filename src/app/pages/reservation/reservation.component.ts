import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/services/models/User';
import { ReservationService } from './reservation.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit{
  firstFormGroup : FormGroup = new FormGroup([]) ; 
  secondFormGroup: FormGroup = new FormGroup([]) ; 
  currentUser  : User | null 
  isLinear = false;

  constructor(private _formBuilder: FormBuilder , private authService : AuthService , private reservationService:ReservationService , private router :Router) {}
  ngOnInit(): void {
   this.currentUser= this.authService.getCurrentUser()
    this.initForms() ; 
  }
  initForms (){
    if(this.reservationService.reservation){      
      this.firstFormGroup = this._formBuilder.group({
        projectName: [this.reservationService.reservation.reservation.projectName, Validators.required],
        projectPlaces : [this.reservationService.reservation.reservation.place, Validators.required],
        startDate : [new Date(this.reservationService.reservation.reservation.startDate*1000), Validators.required],
        endDate : [new Date(this.reservationService.reservation.reservation.endDate*1000), Validators.required],
      });
      this.secondFormGroup = this._formBuilder.group({
        secondCtrl: ['', Validators.required],
    
      });

    }else {
      this.firstFormGroup = this._formBuilder.group({
        projectName: ['', Validators.required],
        projectPlaces : ['', Validators.required],
        startDate : ['', Validators.required],
        endDate : ['', Validators.required],
      });
      this.secondFormGroup = this._formBuilder.group({
        secondCtrl: ['', Validators.required],
    
      });
    }
    
  }
  submitForm(){
    
   
    if(this.reservationService.reservation){  
      const reservation = {
        id : this.reservationService.reservation.reservation.id , 
        projectName : this.firstFormGroup.value.projectName , 
        place:this.firstFormGroup.value.projectPlaces , 
        startDate : moment(this.firstFormGroup.value.startDate).unix() , 
        endDate :moment( this.firstFormGroup.value.endDate).unix() , 
        status : "pending" , 
        products :  [{
          "hello": 1
        }] , 
        total:0 , 
        description : "hello world " , 
        userId : this.currentUser?.id
  
      } 
      console.log("this is an update " , reservation);
      this.reservationService.updateReservation(reservation).subscribe(res => {
        console.log(res );
        this.router.navigate(['/home'])
        
      })
     }else {
      const reservation = {
       
        projectName : this.firstFormGroup.value.projectName , 
        place:this.firstFormGroup.value.projectPlaces , 
        startDate : moment(this.firstFormGroup.value.startDate).unix() , 
        endDate :moment( this.firstFormGroup.value.endDate).unix() , 
        status : "pending" , 
        products :  [{
          "hello": 1
        }] , 
        total:0 , 
        description : "hello world " , 
        userId : this.currentUser?.id
  
      }
      console.log(reservation);
      this.reservationService.addReservation(reservation).subscribe(res => {
        console.log(res );
        this.router.navigate(['/home'])
        
      })
     }
   
    
  }

}
