import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { dashboardsRoutes } from './dashboard.routers';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: dashboardsRoutes
  }
];

@NgModule({
  declarations: [],
  exports: [
    RouterModule
  ],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class DashboardRountigModule { }
