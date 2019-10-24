import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../ingreso-egreso.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {

  itemsSubcripcion: Subscription = new Subscription();
  items: IngresoEgreso[];

  constructor(private store: Store<AppState>,
              private ingresoegresoService: IngresoEgresoService) { }

  ngOnInit() {
     this.itemsSubcripcion = this.store.select('ingresoegreso')
                                        .subscribe( ingresoegreso => {
                                          this.items = ingresoegreso.items; });
  }

  ngOnDestroy() {
    this.itemsSubcripcion.unsubscribe();
  }

  borrarItem(uid: string) {
    Swal.fire({
      title: '¿Está Seguro?',
      text: 'Esto no se puede revertir',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar!'
    }).then((result) => {
      if (result.value) {
        this.ingresoegresoService.borrarMovimiento(uid);
      }
    });
  }

}
