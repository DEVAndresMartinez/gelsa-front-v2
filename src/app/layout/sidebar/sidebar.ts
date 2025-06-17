import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar implements OnInit {

  menuItems = [
    {
      title: 'Usuarios',
      icon: 'fa fa-users',
      link: '/modules/users'
    },
    {
      title: 'Roles y Permisos',
      icon: 'fa fa-shield',
      link: '/modules/roles-permissions'
    
    },
    {
      title: 'Comercios',
      icon: 'fa fa-store',
      link: '/modules/bussines'
    }
  ];

  constructor() {}

  ngOnInit(): void {
    
  }

}

