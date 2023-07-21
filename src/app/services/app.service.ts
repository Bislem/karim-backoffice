import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  readonly defaultAction = '';
  readonly defaultSnackbarConfig: MatSnackBarConfig = {
    horizontalPosition: 'end',
    verticalPosition: 'top'
  }

  constructor(
    private snackbar: MatSnackBar,
  ) { }

  showError(msg: string){
    this.snackbar.open(
      msg,
      undefined,
      {
        ...this.defaultSnackbarConfig,
        panelClass: ['']

      }
    )
  }
}
