import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormControl, Validators, UntypedFormGroup, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule, MaterialModule, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class AppLoginComponent {
  options = this.settings.getOptions();
  from: UntypedFormGroup;
  isLoading: boolean = false;

  constructor(
    private settings: CoreService,
    private router: Router,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private appService: AppService
  ) { }

  form = new UntypedFormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      this.appService.showSuccess('Veuillez remplir le formulaire');
    }
    this.isLoading = true;
    this.authService.signIn({ ...this.form.value }).then(res => {
      this.isLoading = false;
      if (res) {
        this.router.navigate(['/services']);
      } else {
        this.appService.showError('email ou mot de passe erroné');
      }
    }).catch(err => {
      console.error(err);
      this.appService.showError('email ou mot de passe erroné');
      this.form.reset();
      this.form.get('email')?.setErrors({ wrongEmail: true });
      this.form.get('password')?.setErrors({ wrongPassword: true });
      this.isLoading = false;
    })
  }
}
