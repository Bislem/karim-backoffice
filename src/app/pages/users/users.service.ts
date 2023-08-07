import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/services/models/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  users: BehaviorSubject<User[]> = new BehaviorSubject([] as User[]);

  constructor(
    private http: HttpClient
  ) { }


  getAllUsers() {
    return new Promise<User[]>((resolve, reject) => {
      this.http.get(`${environment.API_BASE_URL}/users`).subscribe({
        next: (res: any) => {
          if (res.status) {
            const users = res.users;
            console.log(users);
            this.users.next(users);
            resolve(users as User[])
          } else {
            resolve([]);
          }
        },
        error: (err) => {
          console.error(err);
          resolve([])
        }
      });
    });
  }

  createUser(user: User) {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post(`${environment.API_BASE_URL}/users`, { ...user }).subscribe({
        next: (res: any) => {
          if (res.status) {
            const users = this.users.getValue();
            users.push(res.user);
            this.users.next(users);
            resolve(true)
          } else {
            resolve(false);
          }
        },
        error: (err) => {
          console.error(err);
          resolve(false)
        }
      });
    });
  }


  updateUser(user: User) {
    return new Promise<boolean>((resolve, reject) => {
      this.http.put(`${environment.API_BASE_URL}/users`, { ...user }).subscribe({
        next: (res: any) => {
          if (res.status) {
            const users = this.users.getValue();
            const index = users.findIndex(u => u.id === res.user.id);
            users[index] = res.user;
            this.users.next(users);
            resolve(true)
          } else {
            resolve(false);
          }
        },
        error: (err) => {
          console.error(err);
          resolve(false)
        }
      });
    });
  }

  deleteUser(user: User) {
    return new Promise<boolean>((resolve, reject) => {
      this.http.delete(`${environment.API_BASE_URL}/users/${user.id}`).subscribe({
        next: (res: any) => {
          if (res.status) {
            const users = this.users.getValue();
            const index = users.findIndex(u => u.id === res.user.id);
            users.splice(index, 1);
            this.users.next(users);
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error: (err) => {
          console.error(err);
          resolve(false);
        }
      });
    });
  }



}
