import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { filter, take } from 'rxjs/operators';

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
      requiredPermission: ['get_all_users']
    },
    {
      title: 'Roles y Permisos',
      icon: 'fa fa-shield',
      link: '/modules/roles-permissions',
      requiredPermission: ['read_roles']
    },
    {
      title: 'Comercios',
      icon: 'fa fa-store',
      link: '/modules/business',
      requiredPermission: ['view_business_bogota', 'view_business_cundinamarca']
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

    this.user$.pipe(filter(user => !!user && !!user.permissions), take(1)).subscribe(user => {
    this.permissions = user.permissions.map((permission: any) => permission.name);
    
    this.menuItems = this.menuItemsCopy.filter(item => {
      if (!item.requiredPermission) return true;
      const required = Array.isArray(item.requiredPermission) ? item.requiredPermission : [item.requiredPermission];
      return required.some((perm: string) => this.permissions.includes(perm));
    });
    this.loading = false;
  });
  }
}

