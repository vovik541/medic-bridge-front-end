import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { RegisterComponent } from './features/auth/register/register.component';
export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'register', component: RegisterComponent }
    // { path: '', redirectTo: '/login', pathMatch: 'full' }
];
