import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Reservation } from 'src/app/services/models/Reservation';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  reservations: BehaviorSubject<Reservation[]> = new BehaviorSubject([] as Reservation[]);

  constructor(
    private http: HttpClient
  ) { }

  getReservationsByInterval(startDate: number, endDate: number) {
    return new Promise<Reservation[]>((resolve) => {
      this.http.get(`${environment.API_BASE_URL}/reservations/${startDate}/${endDate}`)
        .subscribe({
          next: (res: any) => {
            if (res.status) {
              const reservations = res.reservations;
              this.reservations.next(reservations);
              console.log(reservations);
              resolve(reservations)
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

  createReservation(reservation: Reservation) {
    return new Promise<Reservation | null>((resolve) => {
      this.http.post(`${environment.API_BASE_URL}/reservations`, reservation)
        .subscribe({
          next: (res: any) => {
            if (res.status) {
              const reservation = res.reservation;
              const reservations = this.reservations.getValue();
              reservations.push(reservation);
              console.log('here is the new list !! ',reservations)
              this.reservations.next(reservations);
              resolve(reservation);
            } else {
              resolve(null);
            }
          },
          error: (err) => {
            console.error(err);
            resolve(null)
          }
        });
    });
  }

  updateReservation(reservation: Reservation) {
    return new Promise<Reservation | null>((resolve) => {
      this.http.put(`${environment.API_BASE_URL}/reservations`, reservation)
        .subscribe({
          next: (res: any) => {
            if (res.status) {
              const reservation = res.reservation;
              const reservations = this.reservations.getValue();
              const index = reservations.findIndex(item => item.id === reservation.id);
              reservations[index] = reservation;
              this.reservations.next(reservations);
              resolve(reservation)
            } else {
              resolve(null);
            }
          },
          error: (err) => {
            console.error(err);
            resolve(null)
          }
        });
    });
  }

  deleteReservation(reservation: Reservation) {
    return new Promise<boolean>((resolve) => {
      this.http.delete(`${environment.API_BASE_URL}/reservations/${reservation.id}`)
        .subscribe({
          next: (res: any) => {
            if (res.status) {
              const reservation = res.reservation;
              const reservations = this.reservations.getValue();
              const index = reservations.findIndex(item => item.id === reservation.id);
              reservations.splice(index, 1);
              this.reservations.next(reservations);
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

}
