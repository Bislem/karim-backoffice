import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../common/components/confirmation-dialog/confirmation-dialog.component';

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
    private dialog: MatDialog
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

  openConfirmationDialog(title: string, description?: string) {
    return new Promise<boolean>((resolve) => {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title,
          description
        }
      });
      dialogRef.afterClosed().subscribe(res => {
        resolve(res);
      });
    })
  }
}
