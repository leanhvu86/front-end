import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './admin/home/home.component';
import { LoginComponent } from './admin/login/login.component';
import { AuthGuardGuard } from './shared/guards/AuthGuard/auth-guard.guard';
import { LoginGuard } from './shared/guards/Login/login.guard';
import { NoAccessComponent } from './error/no-access/no-access.component';
import { PageNotFoundComponent } from './error/page-not-found/page-not-found.component';
import { AdminModule } from './admin/admin.module';
import { DashboardModule } from './dashboard/dashboard.module';
// const routes: Routes = [
//   { path: "", redirectTo: '', pathMatch: 'full', canActivate: [LoginGuard] },
//   { path: "login", component: LoginComponent, canActivate: [LoginGuard] },
//   { path: "home", component: HomeComponent, canActivate: [AuthGuardGuard] },
//   { path: "register", component: RegisterComponent, canActivate: [LoginGuard] },
//   { path: "**", redirectTo: '/login', pathMatch: 'full', canActivate: [LoginGuard] }
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }
export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule'
    //loadChildren: () => AdminModule
  },
  {
    path: '',
    loadChildren: './dashboard/dashboard.module#DashboardModule'
    //loadChildren: () => DashboardModule
  },
  { path: 'no-access', component: NoAccessComponent },
  { path: '**', component: PageNotFoundComponent }
];
