import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/ingreso-egreso/ingreso-egreso.reducer';
import { Subscription } from 'rxjs';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { MultiDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: []
})
export class EstadisticaComponent implements OnInit {

  ingresos: number;
  egresos: number;

  cantidadIngresos: number;
  cantidadEgresos: number;

  subscription: Subscription = new Subscription();

  public doughnutChartLabels: Label[] = ['Ingresos', 'Egresos'];
  public doughnutChartData: MultiDataSet = [];

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.subscription = this.store.select('ingresoegreso')
                                  .subscribe( ingresoegreso => {
                                    this.contarIngresoEgreso(ingresoegreso.items);
                                  });
  }

  contarIngresoEgreso( items: IngresoEgreso[]) {
    this.ingresos = 0;
    this.egresos = 0;

    this.cantidadEgresos = 0;
    this.cantidadIngresos = 0;

    items.forEach( item => {
        if (item.tipo === 'ingreso') {
          this.ingresos += item.monto;
          this.cantidadIngresos++;
        } else {
          this.egresos += item.monto;
          this.cantidadEgresos++;
        }
    });

    this.doughnutChartData = [[this.ingresos, this.egresos]];
  }
}
