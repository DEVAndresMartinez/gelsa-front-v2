import { Routes } from "@angular/router";
import { authGuard } from "../../core/guards/auth.guard";

export const modulesRoutes: Routes = [

    { path: 'users', loadComponent: () => import('./users/users').then(m => m.Users) },
    { path: 'roles-permissions', loadComponent: () => import('./roles-permissions/roles-permissions').then(m => m.RolesPermissions) },
    { path: 'business', loadComponent: () => import('./bussines/bussines').then(m => m.Bussines), canActivate: [authGuard] },
    { path: 'business/:id_bussines/transactions/:date_ini/:date_final', loadComponent: () => import('./transactions/transactions').then(m => m.Transactions) },

];