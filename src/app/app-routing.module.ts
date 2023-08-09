import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './common/auth/auth.guard';
import { guestGuard } from './common/auth/guest.guard';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';

const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadChildren: () => import('./pages/pages.module').then((m) => m.PagesModule),
      },
      {
        path: 'users',
        loadChildren: () => import("./pages/users/users.module").then(res => res.UsersModule)
      },
      {
        path: 'products',
        loadChildren: () => import("./pages/products/products.module").then(res => res.ProductsModule)
      },
      // {
      //   path: '',
      //   redirectTo: '/home',
      //   pathMatch: 'full',
      // },
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
