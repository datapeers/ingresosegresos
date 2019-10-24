import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IngresoEgreso } from './ingreso-egreso.model';
import { IngresoEgresoService } from './ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  forma: FormGroup;
  tipo = 'ingreso';
  loadingSubscription: Subscription = new Subscription();
  cargando: boolean;

  constructor(private ingresoegresoService: IngresoEgresoService,
              private store: Store<AppState>) { }

  ngOnInit() {
    this.forma = new FormGroup({
      descripcion: new FormControl('', Validators.required),
      monto: new FormControl(0, Validators.min(1))
    });

    this.loadingSubscription = this.store.select('ui')
                                .subscribe( ui => this.cargando = ui.isLoading);
  }

  ngOnDestroy(): void {
     this.loadingSubscription.unsubscribe();
  }

  crearMovimiento() {
    this.store.dispatch(new ActivarLoadingAction());
    const ingresoegreso = new IngresoEgreso({ ...this.forma.value, tipo: this.tipo});
    this.ingresoegresoService.crearMovimiento(ingresoegreso)
    .then(() => {
      this.store.dispatch(new DesactivarLoadingAction());
      this.forma.reset({
        monto: 0
      });
      Swal.fire({
        title: 'Creado!',
        text: ingresoegreso.descripcion,
        type: 'success',
        confirmButtonText: 'Ok'
      });
    })
    .catch( err => {
      this.store.dispatch(new DesactivarLoadingAction());
      Swal.fire({
        title: 'Error!',
        text: ingresoegreso.descripcion,
        type: 'error',
        confirmButtonText: 'Ok'
      });
    });
  }

}
