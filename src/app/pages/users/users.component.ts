import { Component, Inject, Optional, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { User } from 'src/app/services/models/User';
import { UsersService } from './users.service';
import { UsersDialogComponent } from './users-dialog/users-dialog.component';
import { AppService } from 'src/app/services/app.service';

@Component({
  templateUrl: './users.component.html',
})
export class UsersComponent implements AfterViewInit, OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: any;
  displayedColumns: string[] = [
    '#',
    'name',
    'role',
    'email',
    // 'createdAt',
    'action',
  ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator = Object.create(null);

  dataSource: MatTableDataSource<User>;
  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private userService: UsersService,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.userService.users.getValue() as User[]);
    this.userService.users.subscribe(res => {
      this.dataSource = new MatTableDataSource(res as User[]);
    });

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async openDialog(action: 'create' | 'update', user: User | null) {
    const dialogRef = this.dialog.open(UsersDialogComponent, {
      data: {
        user: user,
        mode: action,
        title: 'Nouveau Utilisateur'
      },

    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  async deleteUser(user: User) {
    const yes = await this.appService.openConfirmationDialog('voulez-vous supprimer cet utilisateur ?', `${user.firstName}  ${user.lastName} `)
    if (yes) {
      const res = await this.userService.deleteUser(user);
      if (res) {
        this.appService.showSuccess('utilisateur supprimé avec succès');
      } else {
        this.appService.showError('utilisateur non supprimé, une erreur s\'est produite');
      }
    }
  }

}

