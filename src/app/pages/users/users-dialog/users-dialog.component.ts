import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app/services/app.service';
import { User } from 'src/app/services/models/User';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-users-dialog',
  templateUrl: './users-dialog.component.html',
  styleUrls: ['./users-dialog.component.scss']
})
export class UsersDialogComponent implements OnInit {
  title: string;
  mode: 'create' | 'update';
  user?: User;
  userForm: UntypedFormGroup;
  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<UsersDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { user?: User, mode: 'create' | 'update', title: string },
    private appService: AppService,
    private userService: UsersService
  ) {
    this.mode = data.mode;
    this.user = data.user;
    this.title = data.title
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    if (this.mode === 'create') {
      this.userForm = new UntypedFormGroup({
        firstName: new FormControl(null, Validators.required),
        lastName: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email]),
        role: new FormControl(null, Validators.required),
        password: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
      });
    } else {
      this.userForm = new UntypedFormGroup({
        firstName: new FormControl(this.user?.firstName, Validators.required),
        lastName: new FormControl(this.user?.lastName, Validators.required),
        email: new FormControl(this.user?.email, [Validators.required, Validators.email]),
        role: new FormControl(this.user?.role, Validators.required),
      });
    }
  }

  submit() {
    if (this.userForm.invalid) {
      this.appService.showError('merci de bien remplir le formulaire');
      return;
    }
    const user = {
      ...this.userForm.value
    } as User;
    if (this.mode === 'create') {
      this.userService.createUser(user).then(res => {
        if (res) {
          this.appService.showSuccess('utilisateur créé avec succès');
        } else {
          this.appService.showError('Une erreur est survenue');
        }
        this.doAction();
      });
    } else {
      this.userService.updateUser({...user,id: this.user?.id as any}).then(res => {
        if (res) {
          this.appService.showSuccess('utilisateur modifié avec succès');
        } else {
          this.appService.showError('Une erreur est survenue');
        }
        this.doAction();
      });
    }
  }

  doAction(): void {
    this.dialogRef.close({ event: 'submit' });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

}
