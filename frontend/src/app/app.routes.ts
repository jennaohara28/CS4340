import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { AssignmentsComponent } from "./pages/assignments/assignments.component";
import { CalendarComponent } from "./pages/calendar/calendar.component";
import {LoginComponent} from "./pages/login/login.component";

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'assignments', component: AssignmentsComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },

];
