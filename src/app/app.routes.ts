import {Routes} from '@angular/router';
import {HomePageComponent} from '../pages/home-page/home-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'json-difference',
    title: 'Json Difference',
    loadComponent: () => import('../pages/json-difference-page/json-difference-page.component').then((c) => c)
  },
  {
    path: '*',
    redirectTo: '',
  },
  {
    path: '*/*',
    redirectTo: '',
  },
];
