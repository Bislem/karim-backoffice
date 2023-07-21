import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  readonly defaultAction = '';
  readonly defaultSnackbarConfig: MatSnackBarConfig = {
    horizontalPosition: 'end',
    verticalPosition: 'top',
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
        panelClass: ['bg-red-500'],
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
