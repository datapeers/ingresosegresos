import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { filter, map } from 'rxjs/operators';
import { SetItemsAction, UnsetItemsAction } from './ingreso-egreso.actions';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  ingresoEgresoListenerSubscribe: Subscription = new Subscription();
  ingresoEgresoItemsSubscribe: Subscription = new Subscription();

  constructor(private afDB: AngularFirestore,
              private authService: AuthService,
              private store: Store<AppState>) { }

  initIngresoEgresoListener() {
    this.ingresoEgresoListenerSubscribe = this.store.select('auth')
                                                    .pipe(
                                                      filter( auth => auth.user != null )
                                                    )
                                                    .subscribe( auth => {
                                                      this.ingresoegresoItems(auth.user.uid);
                                                    });
  }

  private ingresoegresoItems(uid: string) {
    this.ingresoEgresoItemsSubscribe = this.afDB.collection(`${uid}/ingresos-egresos/items`)
                                                .snapshotChanges()
                                                .pipe(
                                                  map( docData => {
                                                    return docData.map( doc => {
                                                      return {
                                                        uid: doc.payload.doc.id,
                                                        ...doc.payload.doc.data()
                                                      };
                                                    });
                                                  })
                                                 )
                                                .subscribe( (collection: any[]) => {
                                                  this.store.dispatch(new SetItemsAction(collection));
                                                });
  }

  cancelarSubscriptions() {
    this.ingresoEgresoListenerSubscribe.unsubscribe();
    this.ingresoEgresoItemsSubscribe.unsubscribe();
    this.store.dispatch(new UnsetItemsAction());
  }

  crearMovimiento(movimiento: IngresoEgreso) {
    const user = this.authService.getUser();

    return this.afDB.doc(`${user.uid}/ingresos-egresos`)
    .collection('items').add({...movimiento});
  }

  borrarMovimiento(uid: string) {
    const user = this.authService.getUser();

    this.afDB.doc(`${user.uid}/ingresos-egresos/items/${uid}`)
              .delete()
              .then(() => {
                Swal.fire('Exito!', 'Item Borrado', 'success');
              })
              .catch(() => {
                Swal.fire('Error!', 'Item no pudo ser borrado', 'error');
              });
  }


}
