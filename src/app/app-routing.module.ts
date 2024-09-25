import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './auth/login/login.component';
import { AdminGuard } from './auth/admin-guard/admin-guard.component';





const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AdminGuard] 
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },

  {
    path: 'shared',
    loadChildren: () => import('./shared/shared.module').then(m => m.SharedModule)
  },
  { path: 'login', component: LoginComponent },

  { path: '**', redirectTo: 'login' }, 
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    AuthRoutingModule,
  ],
  declarations: [], 
  exports: [RouterModule],
})
export class AppRoutingModule {}