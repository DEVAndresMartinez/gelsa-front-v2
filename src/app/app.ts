import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Sidebar } from './layout/sidebar/sidebar';
import { AuthService } from './core/services/auth-service';
import { AlertContainer } from './shared/alert-container/alert-container';
import { CommonModule } from '@angular/common';
import { Logo } from './layout/logo/logo';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Header, Sidebar, AlertContainer, Logo],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {

  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

}
