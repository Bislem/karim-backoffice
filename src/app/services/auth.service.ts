import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { addDoc, doc, Firestore, getDoc } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { signInWithEmailAndPassword, UserCredential } from '@firebase/auth';
import { User } from './models/User';
import { USERS_COLLECTION_NAME } from '../common/fire/collections-names';
import { firstValueFrom, from, map } from 'rxjs';
import { collection } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private auth: Auth,
    private afAuth: AngularFireAuth,
    private firestore: Firestore
  ) {
  }

  signIn(credentials: { email: string; password: string }): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, credentials.email, credentials.password);
  }

  signOut(): Promise<void> {
    return signOut(this.auth);
  }
  getCurrentUser(): Promise<User | null> {
    return new Promise(async (resolve) => {
      this.afAuth.user.subscribe(async (user) => {
        if (user) {
          const associatedUser = await this.getAssociatedUser(user.uid);
          if (associatedUser) {
            const u: User = {
              uid: user.uid,
              firstName: associatedUser.firstName,
              lastName: associatedUser.lastName,
              email: user.email as string,
              role: associatedUser.role
            };
            resolve(u);
          } else {
            const u: User = {
              uid: user.uid,
              firstName: '????',
              lastName: '?????',
              email: user.email as string,
              role: null
            };
            resolve(u);
          }
        } else {
          resolve(null);
        }
      });
    })
  }

  async getAssociatedUser(id: string): Promise<User | null> {
    const docRef = doc(this.firestore, USERS_COLLECTION_NAME, id);
    return firstValueFrom(from(getDoc(docRef)).pipe(map(res => ({ id: res.id, ...res.data() as any } as User))));
  }

  forgotPassword(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }
  resetPassword(oobCode: string, password: string) {
    return this.afAuth.confirmPasswordReset(oobCode, password);
  }
}
