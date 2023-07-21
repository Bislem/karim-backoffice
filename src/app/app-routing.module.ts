import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { AuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard'

const redirectUnauthorized = () => redirectUnauthorizedTo(['sign-in']);
const redirectLoggedIn = () => redirectLoggedInTo(['home']);


const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    // canActivate: [AuthGuard],
    // data: { authGuardPipe: redirectLoggedIn },
    children: [
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadChildren: () => import('./pages/pages.module').then((m) => m.PagesModule),
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    // canActivate: [AuthGuard],
    // data: { authGuardPipe: redirectUnauthorized },
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
