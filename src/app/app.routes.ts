import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { HomeComponent } from './shared/ui/home/home.component';
import { UserComponent } from './shared/ui/user/user.component';
import { AdminComponent } from './shared/ui/admin/admin.component';
import { SupportComponent } from './shared/ui/support/support.component';
import { PhysicianComponent } from './shared/ui/physician/physician.component';
import { SpecialistDetailComponent } from './shared/ui/specialist-detail/specialist-detail.component';
import { SettingsComponent } from './settings/settings.component';
import { DoctorPageComponent } from './shared/ui/doctor-page/doctor-page.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'user', component: UserComponent },
    // { path: 'user/specialist/:id', component: SpecialistDetailComponent },
    { path: 'user/specialist/:specialistType/:id', loadComponent: () => import('../app/shared/ui/specialist-detail/specialist-detail.component').then(m => m.SpecialistDetailComponent)},
    { path: 'admin', component: AdminComponent },
    { path: 'support', component: SupportComponent },
    { path: 'physician', component: PhysicianComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'doctor', component: DoctorPageComponent },
    // { path: 'login', component: LoginComponent },
    // { path: 'dashboard', component: DashboardComponent },
    // { path: 'register', component: RegisterComponent }
    // { path: '', redirectTo: '/login', pathMatch: 'full' }
];
