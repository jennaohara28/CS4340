import { NgModule } from '@angular/core';
import { AboutComponent } from './pages/about/about.component';
import { AuthGuard } from './components/auth.guard';
import { AuthRedirectGuard } from './components/auth-redirect.guard';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { ClassesComponent } from "./pages/classes/classes.component";
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { NoAuthGuard } from './components/no-auth.guard';
import { RegisterComponent } from './pages/register/register.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { RouterModule, Routes } from '@angular/router';
import { TasksComponent } from './pages/tasks/tasks.component';

export const routes: Routes = [
  { path: '', canActivate: [AuthRedirectGuard], component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'assignments', component: TasksComponent, canActivate: [AuthGuard] },
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
  { path: 'classes', component: ClassesComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard] },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
