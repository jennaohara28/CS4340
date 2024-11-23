import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// Import components
import { AboutComponent } from './pages/about/about.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NotificationSettingsComponent } from './pages/notification-settings/notification-settings.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { RegisterComponent } from './pages/register/register.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { routes } from './app.routes';

@NgModule({
  // Declare components here
  declarations: [
    AboutComponent,
    AppComponent,
    LoginComponent,
    NotificationSettingsComponent,
    RegisterComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NavbarComponent,
    NgxChartsModule,
    PieChartComponent,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),

  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
