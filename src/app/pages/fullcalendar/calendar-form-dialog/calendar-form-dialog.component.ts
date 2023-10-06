import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';
import { FormGroup, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { EgretCalendarEvent } from '../event.model';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth.service';
import { ReservationService } from '../reservation.service';
import { User } from 'src/app/services/models/User';
import { Reservation } from 'src/app/services/models/Reservation';
import { Product } from 'src/app/services/models/Product';
import { ProductsService } from '../../products/products.service';
import { AppService } from 'src/app/services/app.service';

interface DialogData {
  event?: CalendarEvent;
  action?: string;
  date?: Date;
}

@Component({
  selector: 'app-calendar-form-dialog',
  templateUrl: './calendar-form-dialog.component.html',
  styleUrls: ['./calendar-form-dialog.component.scss'],
})
export class CalendarFormDialogComponent {
  reservationForm: UntypedFormGroup;
  currentUser: User | null;

  isLinear = false;

  reservation?: Reservation;
  action: 'edit' | 'add';
  products: Product[] = [];
  allProducts: Product[] = [];
  total: number = 0;


  constructor(
    public dialogRef: MatDialogRef<CalendarFormDialogComponent>,
    private _formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private reservationService: ReservationService,
    @Inject(MAT_DIALOG_DATA) public data: { reservation?: Reservation, action: 'add' | 'edit' },
    private productsService: ProductsService,
    private appService: AppService

  ) {
    this.reservation = data.reservation;
    this.action = data.action;
  }



  async ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.initForms();
    this.allProducts = (await this.productsService.getAllProducts()).map(p => ({ ...p, selectedQte: 0 }));
    if (this.action === 'edit') {
      this.products = (this.reservation?.products as Product[]).map(p => {
        const qt = Number(this.allProducts.find(p2 => p2.id === p.id)?.quantity);
        return {
          ...p,
          quantity: qt === 0 ? p.quantity : p.quantity + qt
        }
      });
    } else {
      this.products = this.allProducts;
    }
    console.log(this.products);
  }
  initForms() {
    if (this.action === 'edit' && this.reservation) {
      this.reservationForm = this._formBuilder.group({
        step1: this._formBuilder.group({
          projectName: [this.reservation.projectName, Validators.required],
          place: [this.reservation.place, Validators.required],
          startDate: [new Date(this.reservation.startDate * 1000), Validators.required],
          endDate: [new Date(this.reservation.endDate * 1000), Validators.required],
        }),
        step2: this._formBuilder.array([], Validators.minLength(0)),
        step3: this._formBuilder.group({
          description: [this.reservation.description, Validators.required],
        }),
      });
    } else {
      this.reservationForm = this._formBuilder.group({
        step1: this._formBuilder.group({
          projectName: ['', Validators.required],
          place: ['', Validators.required],
          startDate: ['', Validators.required],
          endDate: ['', Validators.required],
        }),
        step2: this._formBuilder.array([], Validators.minLength(0)),
        step3: this._formBuilder.group({
          description: ['Description here', Validators.required],
        }),
      });
    }

  }
  submitForm() {
    if (this.reservationForm.invalid) {
      this.appService.showError("veuillez remplir correctement le formulaire");
      return;
    }
    if (this.products.filter(p => Number(p.selectedQte) > 0).length === 0) {
      this.appService.showError("veuillez sélectionner au moins un produit");
      return;
    }
    if (this.action === 'edit' && this.reservation) {
      const reservation = {
        id: this.reservation.id,
        projectName: this.reservationForm.value.step1.projectName,
        description: this.reservationForm.value.step3.description,
        place: this.reservationForm.value.step1.place,
        startDate: moment(this.reservationForm.value.step1.startDate).unix(),
        endDate: moment(this.reservationForm.value.step1.endDate).unix(),
        status: "pending",
        products: this.products.filter(p => Number(p.selectedQte) > 0),
        total: this.total,
        userId: this.currentUser?.id,
      } as Reservation;

      console.log("Reservation updated !", reservation);
      this.reservationService.updateReservation(reservation).then(res => {
        this.appService.showSuccess("réservation mise à jour avec succès");
        console.log(res);
        this.dialogRef.close();
      })
    } else {
      const reservation = {
        projectName: this.reservationForm.value.step1.projectName,
        description: this.reservationForm.value.step3.description,
        place: this.reservationForm.value.step1.place,
        startDate: moment(this.reservationForm.value.step1.startDate).unix(),
        endDate: moment(this.reservationForm.value.step1.endDate).unix(),
        status: "pending",
        products: this.products.filter(p => Number(p.selectedQte) > 0),
        total: this.total,
        userId: this.currentUser?.id,
      } as Reservation;
      console.log(reservation);
      this.reservationService.createReservation(reservation).then(res => {
        this.appService.showSuccess("réservation créée avec succès");
        console.log(res);
        this.dialogRef.close();
      });
    }
  }
  getPoster(images: any) {
    return images[0].url;
  }

  updateQte(p: Product, qte: number) {
    if (!p.selectedQte) {
      p.selectedQte = 0;
    }
    if (p.selectedQte + qte >= 0 && p.selectedQte + qte <= p.quantity) {
      p.selectedQte = p.selectedQte + qte;
    }
    this.getTotatlPrice();
  }

  applyFilter(txt: string) {
    console.log(txt);
    this.products.map((res: any) => {
      if (res.name.toLowerCase().includes(txt.toLowerCase()) ||
        res.ref.toLowerCase().includes(txt.toLowerCase()) ||
        res.description.toLowerCase().includes(txt.toLowerCase())) {
        res.filtred = true;
      } else {
        res.filtred = false;
      }
    });
  }

  applayFilterByCategory(category: string) {
    console.log(category);

    this.products.map((res: any) => {
      if (res.category.toLowerCase().includes(category.toLowerCase())) {
        res.filtred = true;
      } else {
        res.filtred = false;
      }
    });
  }

  getTotatlPrice() {
    var total = 0;
    for (let i = 0; i < this.products.length; i++) {
      const p = this.products[i];
      total += (Number(p.selectedQte ? p.selectedQte : 0) * p.price)
    }
    this.total = total;
  }

}
