import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
import { User } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';
import { SetUserAction } from './auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubscription: Subscription = new Subscription();

  constructor(private afAuth: AngularFireAuth,
              private afDB: AngularFirestore,
              private router: Router,
              private store: Store<AppState> ) { }

  initAuthListener() {
    this.afAuth.authState
    .subscribe( fbUser => {
      if (fbUser == null) {
        this.userSubscription.unsubscribe();
        this.router.navigate(['/login']);
      } else {
        this.userSubscription = this.afDB.doc(`${fbUser.uid}/usuario`).valueChanges()
        .subscribe( (objUser: any) => {
          const user = new User(objUser);
          this.store.dispatch(new SetUserAction(user));
        });
      }
    });
  }

  isAuth() {
    return this.afAuth.authState.pipe(
      map( fbUser => fbUser != null)
    );
  }

  crearUsuario( nombre, email, password) {
    this.store.dispatch(new ActivarLoadingAction());
    this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then( resp => {
        const newUser: User = {
          uid: resp.user.uid,
          nombre: nombre,
          email: resp.user.email
        };
        this.afDB.doc(`${ newUser.uid }/usuario`)
        .set(newUser)
        .then(() => {
          this.store.dispatch(new DesactivarLoadingAction());
          this.router.navigate(['/']);
        });
      })
      .catch( error => {
        this.store.dispatch(new DesactivarLoadingAction());
        Swal.fire({
          title: 'Error!',
          text: error.message,
          type: 'error',
          confirmButtonText: 'Ok'
        });
      });
  }

  logIn(email: string, password: string) {
    this.store.dispatch(new ActivarLoadingAction());
    this.afAuth.auth
    .signInWithEmailAndPassword(email, password)
    .then( resp => {
      this.store.dispatch(new DesactivarLoadingAction());
      this.router.navigate(['/']);
    })
    .catch(error => {
      this.store.dispatch(new DesactivarLoadingAction());
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
