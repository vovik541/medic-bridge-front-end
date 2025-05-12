import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { HomeComponent } from './shared/ui/home/home.component';
import { UserComponent } from './shared/ui/user/user.component';
import { AdminComponent } from './shared/ui/admin/admin.component';
import { SupportComponent } from './shared/ui/support/support.component';
import { PhysicianComponent } from './shared/ui/physician/physician.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'user', component: UserComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'support', component: SupportComponent },
    { path: 'physician', component: PhysicianComponent },
    // { path: 'login', component: LoginComponent },
    // { path: 'dashboard', component: DashboardComponent },
    // { path: 'register', component: RegisterComponent }
    // { path: '', redirectTo: '/login', pathMatch: 'full' }
];
