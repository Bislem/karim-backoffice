import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';
import { User } from './models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private JWT_TOKEN = 'JWT_TOKEN';
  private USER_KEY = 'USER_KEY';

  constructor(
    private http: HttpClient
  ) {
  }

  async signIn(credentials: { email: string; password: string }): Promise<User> {
    return new Promise((resolve, reject) => {
      this.http.post('auth/login', credentials).subscribe({
        next: (obj) => {
          const res = obj as HttpResponse<any>
          const data = res.body as User;
          localStorage.setItem(this.JWT_TOKEN, JSON.stringify(data.token));
          localStorage.setItem(this.USER_KEY, JSON.stringify(data));
          resolve(data);
        },
        error: (obj: HttpErrorResponse) => {
          const err = obj as HttpErrorResponse;
          reject(err)
        }
      });
    });
  }

  signOut(): Promise<void> {
    return of().toPromise();
  }
  getCurrentUser(): Promise<User | null> {
    return of(null).toPromise() as Promise<null>;
  }

  async getAssociatedUser(id: string): Promise<User | null> {
    return of(null).toPromise() as Promise<null>;
  }

  forgotPassword(email: string) {
  }
  resetPassword(oobCode: string, password: string) {
  }
}
