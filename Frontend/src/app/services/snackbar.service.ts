import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackbar: MatSnackBar) {}

  openSnackBar(message: string, action: string) {
    if (action === 'error') {
      this.snackbar.open(message, '',{
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 400,
        panelClass: ['black-snackbar']
      });
    } else {
      this.snackbar.open(message, '',{
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 200,
        panelClass: ['green-snackbar']
      });
    }
  }
}
