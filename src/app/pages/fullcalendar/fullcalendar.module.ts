import { inject, NgModule } from '@angular/core';
import { ResolveFn, RouterModule, Routes } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { NgScrollbarModule } from 'ngx-scrollbar';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { MatNativeDateModule } from '@angular/material/core';
import { AppFullcalendarComponent } from './fullcalendar.component';
import { CalendarFormDialogComponent } from './calendar-form-dialog/calendar-form-dialog.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxPaginationModule } from 'ngx-pagination';
import { Reservation } from 'src/app/services/models/Reservation';
import { ReservationService } from './reservation.service';
import * as moment from 'moment';
import { MatStepperModule } from '@angular/material/stepper';


const resolver: ResolveFn<Reservation[]> = () => {
  const start = moment().startOf('month').unix();
  const end = moment().endOf('year').unix();
  return inject(ReservationService).getReservationsByInterval(start, end);
}

const routes: Routes = [
  {
    path: '',
    component: AppFullcalendarComponent,
    resolve: { main: resolver },
    data: {
      title: 'Calendrier des réservations'
    }
  }
]


@NgModule({
  declarations: [
    AppFullcalendarComponent,
    CalendarFormDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPermissionsModule.forRoot(),
    NgApexchartsModule,
    TablerIconsModule.pick(TablerIcons),
    DragDropModule,
    NgxPaginationModule,
    HttpClientModule,
    AngularEditorModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatNativeDateModule,
    NgScrollbarModule,
    MatStepperModule,
  ],
  providers: [DatePipe],
})
export class FullcalendarModule { }
