import * as fromIngresoEgreso from './ingreso-egreso.actions';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AppState } from '../app.reducer';

export interface IngresoEgresoState {
    items: IngresoEgreso[];
}

export interface AppState extends AppState {
    ingresoegreso: IngresoEgresoState;
}

const estadoInicial: IngresoEgresoState = {
    items: []
};

export function ingresoEgresoReducer( state = estadoInicial, action: fromIngresoEgreso.Actions ): IngresoEgresoState {
    switch (action.type) {
        case fromIngresoEgreso.SET_ITEMS: return {
            items: [
                    ...action.items.map( item => {
                        return { ...item };
                    })
                ]
        };
        case fromIngresoEgreso.UNSET_ITEMS: return estadoInicial;
        default: return state;
    }
}
