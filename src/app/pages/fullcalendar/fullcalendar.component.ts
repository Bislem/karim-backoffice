import { Component, ChangeDetectionStrategy, Inject, TemplateRef, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { UntypedFormGroup } from '@angular/forms';
import { CalendarFormDialogComponent } from './calendar-form-dialog/calendar-form-dialog.component';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarMonthViewComponent,
  CalendarView,
} from 'angular-calendar';
import { ReservationService } from './reservation.service';
import { Reservation } from 'src/app/services/models/Reservation';
import * as moment from 'moment';

const colors: any = {
  red: {
    primary: '#fa896b',
    secondary: '#fdede8',
  },
  blue: {
    primary: '#5d87ff',
    secondary: '#ecf2ff',
  },
  yellow: {
    primary: '#ffae1f',
    secondary: '#fef5e5',
  },
};



@Component({
  selector: 'app-fullcalendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fullcalendar.component.html',
  styleUrls: ['./fullcalendar.component.scss'],
})
export class AppFullcalendarComponent implements OnInit {

  @ViewChild('calendar') calendar: CalendarMonthViewComponent;

  dialogRef2: MatDialogRef<CalendarFormDialogComponent> = Object.create(TemplateRef);

  lastCloseResult = '';
  actionsAlignment = '';

  config: MatDialogConfig = {
    disableClose: false,
    width: '',
    height: '',
    position: {
      top: '',
      bottom: '',
      left: '',
      right: '',
    },
    data: {
      action: '',
      event: [],
    },
  };
  numTemplateOpens = 0;

  view: any = 'month';
  viewDate: Date = new Date();

  actions: CalendarEventAction[] = [
    {
      label: '<span class="text-white link m-l-5">: Edit</span>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edit', event);
      },
    },
    {
      label: '<span class="text-danger m-l-5">Delete</span>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[];

  activeDayIsOpen = true;

  constructor(
    public dialog: MatDialog,
    @Inject(DOCUMENT) doc: any,
    private reservationService: ReservationService,
    private changeRefDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.events = this.getEvents(this.reservationService.reservations.getValue());
    this.reservationService.reservations.subscribe(res => {
      this.events = this.getEvents(res);
      this.refresh.next(res);
    })
  }

  getEvents(reservations: Reservation[]): CalendarEvent[] {
    return reservations.map(res => {
      return {
        start: new Date(res.startDate * 1000),
        end: new Date(res.endDate * 1000),
        title: res.projectName,
        meta: res
      } as CalendarEvent;
    })
  }

  changeMonth() {

    const start = moment(this.calendar.view.period.start).unix();
    const end = moment(this.calendar.view.period.end).unix();

    console.log(start, end);
    this.reservationService.getReservationsByInterval(start, end).then(res => {
      this.events = this.getEvents(res);
      this.changeRefDetector.detectChanges();
      this.refresh.next(res);
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });

    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.dialogRef2 = this.dialog.open(CalendarFormDialogComponent, {
      panelClass: 'calendar-form-dialog',
      maxWidth: '700px',
      data: {
        action: 'edit',
        reservation: event.meta,
      }
    });
    this.dialogRef2.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      const dialogAction = res.action;
      const responseEvent = res.event;
      responseEvent.actions = this.actions;
      this.events.push(responseEvent);
      this.dialogRef2 = Object.create(null);
      this.refresh.next(res);
    });
  }

  addEvent(): void {
    this.dialogRef2 = this.dialog.open(CalendarFormDialogComponent, {
      panelClass: 'calendar-form-dialog',
      maxWidth: '700px',
      data: {
        action: 'add',
        reservation: null,
      }
    });
    this.dialogRef2.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      const dialogAction = res.action;
      const responseEvent = res.event;
      responseEvent.actions = this.actions;
      this.events.push(responseEvent);
      this.dialogRef2 = Object.create(null);
      this.refresh.next(res);
    });
  }

  deleteEvent(eventToDelete: CalendarEvent): void {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView): void {
    this.view = view;
  }
}
