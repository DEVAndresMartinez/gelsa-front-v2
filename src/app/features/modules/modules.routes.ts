import { Routes } from "@angular/router";
import { authGuard } from "../../core/guards/auth.guard";

export const modulesRoutes: Routes = [

    { path: 'home', loadComponent: () => import('./home/home').then(m => m.Home), canActivate: [authGuard] },
    { path: 'prueba', loadComponent: () => import('./prueba/prueba').then(m => m.Prueba), canActivate: [authGuard] },
    { path: 'bussines', loadComponent: () => import('./bussines/bussines').then(m => m.Bussines), canActivate: [authGuard] },

];