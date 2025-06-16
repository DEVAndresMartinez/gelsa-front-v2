import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth-service';
import { Router } from '@angular/router';
import { AlertService } from '../../core/services/alert-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {

  user$: typeof this.authService.user$;
  isNew: boolean = false;
  userId: string = '';

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
    if (!this.authService.currentUser) {
      this.authService.getUserProfile().subscribe();

      this.user$.subscribe(user => {
        this.userId = user?.user.id;
        this.isNew = user?.user.is_new;

        if (this.isNew) {
          this.router.navigate([`/auth/change-password/${this.userId}`]);
        }
      })
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('access_token');
        window.location.reload();
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.alertService.showAlert('error', 'Error al cerrar sesión. Inténtalo de nuevo.', 5000);
      }
    })
  }

}
