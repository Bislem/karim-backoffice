import { NgModule,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationComponent } from './reservation.component';
import { ActivatedRouteSnapshot, ResolveFn, Route, RouterModule, RouterStateSnapshot } from '@angular/router';
import {MatStepperModule} from '@angular/material/stepper';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatButtonModule} from '@angular/material/button';
import { ReservationService } from './reservation.service';
const reservationResolver: ResolveFn<void> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(ReservationService).resolvedata(route , state);
}
const routes : Route[] = [
  {
    path: '' , 
    component : ReservationComponent , 
    resolve : {main :reservationResolver },
    data : {
      title:"Reservation"
    }
  },
  {
    path: 'update/:id' , 
    component : ReservationComponent , 
    resolve : {main :reservationResolver },
    data : {
      title:"Mise a jour d'un reservation"
    }
  }
]

@NgModule({
  declarations: [
    ReservationComponent
  ],
  imports: [
    CommonModule, 
    MatStepperModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class ReservationModule { }
