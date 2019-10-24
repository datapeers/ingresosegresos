import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../auth/user.model';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: []
})
export class NavbarComponent implements OnInit, OnDestroy {

  subscription = new Subscription();
  user: User = new User({ uid: '0', nombre: '', email: '' });

  constructor(private store: Store<AppState>) { }

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

}
