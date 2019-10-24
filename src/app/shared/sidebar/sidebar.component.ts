import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/user.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { IngresoEgresoService } from '../../ingreso-egreso/ingreso-egreso.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit, OnDestroy {

  subscription = new Subscription();
  user: User = new User({ uid: '0', nombre: '', email: '' });


  constructor(private ingresoegresoService: IngresoEgresoService,
              private store: Store<AppState>,
              private authService: AuthService) { }

  ngOnInit() {
    this.subscription = this.store.select('auth')
                                  .pipe(
                                    filter( auth => auth.user != null)
                                  )
                                  .subscribe( auth => this.user = auth.user );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  logOut() {
    this.authService.logOut();
    this.ingresoegresoService.cancelarSubscriptions();
  }
}
