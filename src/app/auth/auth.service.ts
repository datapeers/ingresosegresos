import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
import { User } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth,
              private afDB: AngularFirestore,
              private router: Router ) { }

  initAuthListener() {
    this.afAuth.authState
    .subscribe( fbUser => {
      if (fbUser == null) {
        this.router.navigate(['/login']);
      }
    });
  }

  isAuth() {
    return this.afAuth.authState.pipe(
      map( fbUser => fbUser != null)
    );
  }

  crearUsuario( nombre, email, password) {
    this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then( resp => {
        const newUser: User = {
          uid: resp.user.uid,
          nombre: nombre,
          email: resp.user.email
        };
        this.afDB.doc(`${ newUser.uid }/newUser`)
        .set(newUser)
        .then(() => this.router.navigate(['/']));
      })
      .catch( error => {
        Swal.fire({
          title: 'Error!',
          text: error.message,
          type: 'error',
          confirmButtonText: 'Ok'
        });
      });
  }

  logIn(email: string, password: string) {
    this.afAuth.auth
    .signInWithEmailAndPassword(email, password)
    .then( resp => {
      this.router.navigate(['/']);
    })
    .catch(error => {
      Swal.fire({
        title: 'Error!',
        text: error.message,
        type: 'error',
        confirmButtonText: 'Ok'
      });
    });
  }

  logOut() {
    this.router.navigate(['/login']);
    this.afAuth.auth.signOut();
  }
}
