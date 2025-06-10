import { Routes } from '@angular/router';

export const routes: Routes = [

    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
    { path: 'auth', loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes) },
    { path: 'modules', loadChildren: () => import('./features/modules/modules.routes').then(m => m.modulesRoutes)},
    { path: '**', redirectTo: 'auth/login' }

];
