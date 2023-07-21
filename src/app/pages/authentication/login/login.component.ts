import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormControl, Validators, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class AppLoginComponent {
  options = this.settings.getOptions();
  from: UntypedFormGroup;

  constructor(
    private settings: CoreService,
    private router: Router,
    private authService: AuthService,
    private snackbar: MatSnackBar
  ) { }

  form = new UntypedFormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      this.snackbar.open('Please fill the form', undefined, {
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      });
    }
    this.router.navigate(['/home']);
  }
}
