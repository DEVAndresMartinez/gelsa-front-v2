import { Routes } from "@angular/router";
import { authGuard } from "../../core/guards/auth.guard";

export const authRoutes: Routes = [

    { path: 'login', loadComponent: () => import('./login/login').then(m => m.Login) },
    { path: 'change-password/:id', loadComponent: () => import('./password-change/password-change').then(m => m.PasswordChange), canActivate: [authGuard] },
    { path: 'change-password/:id/:token', loadComponent: () => import('./password-change/password-change').then(m => m.PasswordChange) }

];