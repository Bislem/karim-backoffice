import { inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { ResolveFn, RouterModule, Routes } from '@angular/router';
import { User } from 'src/app/services/models/User';
import { UsersService } from './users.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import * as TablerIcons from 'angular-tabler-icons/icons';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UsersDialogComponent } from './users-dialog/users-dialog.component';

const userResolver: ResolveFn<User[]> = (route, state) => {
  return inject(UsersService).getAllUsers();
}

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    resolve: { main: userResolver },
    data: {
      title: 'Manage Users'
    }
  }
]


@NgModule({
  declarations: [
    UsersComponent,
    UsersDialogComponent,
    UsersDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    FormsModule, 
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    TablerIconsModule.pick(TablerIcons),
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatRadioModule,
    MatCheckboxModule,

  ],
  exports:[
    RouterModule
  ]
})
export class UsersModule { }
