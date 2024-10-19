import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { AssignmentsComponent } from './pages/assignments/assignments.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/login/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'assignments', component: AssignmentsComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'about', component: AboutComponent },
  { path: 'register', component: RegisterComponent },
];
