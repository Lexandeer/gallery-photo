import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Gallery } from './pages/gallery/gallery';
import { Details } from './pages/details/details';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: Home},
  {path: 'gallery', component: Gallery},
  {path: 'dashboard', component: Dashboard},
  {path: 'details/:id', component: Details},
];
