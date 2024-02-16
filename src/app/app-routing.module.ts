import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './common/auth/auth.guard';
import { guestGuard } from './common/auth/guest.guard';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';

const routes: Routes = [
  {
    path: '', pathMatch: 'full', redirectTo: '/services',
  },
  {
    path: '',
    component: FullComponent,
    // canActivate: [authGuard],
    children: [
      // {
      //   path: 'users',
      //   loadChildren: () => import("./pages/users/users.module").then(res => res.UsersModule)
      // },
      {
        path: 'services',
        loadChildren: () => import("./pages/services/services.module").then(res => res.ServicesModule)
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    canActivate: [guestGuard],
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./pages/authentication/authentication.module').then((m) => m.AuthenticationModule),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'auth/error',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
