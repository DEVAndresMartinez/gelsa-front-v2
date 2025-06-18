import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar implements OnInit {

  loading: boolean = false;
  user$: typeof this.authService.user$;
  permissions: any[] = [];

  menuItemsCopy: any[] = [];

  menuItems = [
    {
      title: 'Usuarios',
      icon: 'fa fa-users',
      link: '/modules/users',
      requiredPermission: ['Administrador']
    },
    {
      title: 'Roles y Permisos',
      icon: 'fa fa-shield',
      link: '/modules/roles-permissions',
      requiredPermission: ['Administrador']
    },
    {
      title: 'Comercios',
      icon: 'fa fa-store',
      link: '/modules/bussines',
      requiredPermission: ['Administrador', 'tat bogotá']
    }
  ];

  constructor(
    private authService: AuthService
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
    this.loading = true;
    this.menuItemsCopy = [...this.menuItems];

    if (!this.authService.currentUser) {
      this.authService.getUserProfile().subscribe();
    }

    this.user$.pipe(filter(user => !!user && !!user.roles)).subscribe(user => {
      const userPermissions = user.roles.map((permission: any) => permission.name);

      this.menuItems = this.menuItemsCopy.filter(item =>
        item.requiredPermission.some((required: string) => userPermissions.includes(required))
      );
      this.loading = false;
    });
  }
}

