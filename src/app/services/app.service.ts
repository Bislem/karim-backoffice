import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  readonly defaultAction = '';
  readonly defaultSnackbarConfig: MatSnackBarConfig = {
    horizontalPosition: 'center',
    verticalPosition: 'top',
    duration: 1200,
  }

  constructor(
    private snackbar: MatSnackBar,
  ) { }

  showError(msg: string) {
    this.snackbar.open(
      msg,
      undefined,
      {
        ...this.defaultSnackbarConfig,
        panelClass: ['bg-red-400'],
      }
    )
  }

  showSuccess(msg: string) {
    this.snackbar.open(
      msg,
      undefined,
      {
        ...this.defaultSnackbarConfig,
        panelClass: ['bg-green-500'],
      }
    )
  }

  showWarning(msg: string) {
    this.snackbar.open(
      msg,
      undefined,
      {
        ...this.defaultSnackbarConfig,
        panelClass: ['bg-orange-500'],
      }
    )
  }

  showInfo(msg: string) {
    this.snackbar.open(
      msg,
      undefined,
      {
        ...this.defaultSnackbarConfig,
        panelClass: ['bg-blue-500'],
      }
    )
  }
}
