import { Routes } from '@angular/router';
import { LandingPageComponent } from './composants/landing-page/landing-page.component';
import { AdminDashboardComponent } from './composants/admin-dashboard/admin-dashboard.component';
import { ClassManagementComponent } from './composants/class-management/class-management.component';
import { LoginComponent } from './composants/login/login.component';
import { StudentProfileComponent } from './composants/student-profile/student-profile.component';
import { UserManagementComponent } from './composants/user-management/user-management.component';

export const routes: Routes = [
    { 
        path: '',
        component: LandingPageComponent
    },
    {
        path:'admin',
        component: AdminDashboardComponent
    },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'user-management',
        component: UserManagementComponent
      },
      {
        path: 'class-management',
        component: ClassManagementComponent
      },
      {
        path: 'etudiant',
        component: StudentProfileComponent
      },
    { 
        path: '**', 
        redirectTo: '' 
    }
];
