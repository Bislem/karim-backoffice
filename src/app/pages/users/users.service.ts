import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { USERS_COLLECTION_NAME } from 'src/app/common/fire/collections-names';
import { User } from 'src/app/services/models/User';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) { }

  async createNewUser(user: User, password: string) {
    const colRef = collection(this.firestore, USERS_COLLECTION_NAME);
    const newFireUser = await createUserWithEmailAndPassword(this.auth, user.email, password);
    const newUserToInsert: User = {
      ...user,
      uid: newFireUser.user.uid,
    };
    const inserted = await addDoc(colRef, newUserToInsert);
    if (inserted.id) {
      newUserToInsert.documentId = inserted.id;
      return newUserToInsert;
    } else {
      return null;
    }
  }
}
