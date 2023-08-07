import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public JWT_TOKEN = 'JWT_TOKEN';
  public USER_KEY = 'USER_KEY';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
  }

  async signIn(credentials: { email: string; password: string }): Promise<User> {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.API_BASE_URL}/auth/login`, credentials).subscribe({
        next: (obj: any) => {
          localStorage.setItem(this.JWT_TOKEN, JSON.stringify(obj.token));
          localStorage.setItem(this.USER_KEY, JSON.stringify(obj.user));
          resolve(obj);
        },
        error: (obj: HttpErrorResponse) => {
          const err = obj as HttpErrorResponse;
          reject(err)
        }
      });
    });
  }

  signOut(): void {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/auth/login']);
  }
  getCurrentUser(): User | null {
    const user = localStorage.getItem(this.USER_KEY);
    if(user){
      return JSON.parse(user) as User;
    }else{
      return null;
    }
  }

  async getAssociatedUser(id: string): Promise<User | null> {
    return of(null).toPromise() as Promise<null>;
  }

  forgotPassword(email: string) {
  }
  resetPassword(oobCode: string, password: string) {
  }
}
