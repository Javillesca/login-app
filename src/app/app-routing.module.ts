import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LogupComponent } from './pages/logup/logup.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'home' , component: HomeComponent, canActivate: [ AuthGuard ] },
  { path: 'registro' , component: LogupComponent },
  { path: 'login' , component: LoginComponent },
  { path: '**' , redirectTo: 'registro' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
