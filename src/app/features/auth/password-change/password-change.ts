import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service';
import { AlertService } from '../../../core/services/alert-service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../core/services/user-service';

@Component({
  selector: 'app-password-change',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './password-change.html',
  styleUrl: './password-change.scss'
})
export class PasswordChange implements OnInit {

  @Input() userId!: string;
  @Input() token?: string;
  loading: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  passwordForm = new FormGroup({
    password: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl<string>('', [Validators.required]),
  })

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id') || '';
      this.token = params.get('token') || undefined;
    })
  }

  newPassword() {
    if (this.passwordForm.invalid) {
      this.alertService.showAlert('error', 'Verifique los campos', 5000);
    } else if (this.passwordForm.value.password !== this.passwordForm.value.confirmPassword) {
      this.alertService.showAlert('warning', 'La contraseña no coincide', 5000);
    } else {
      const password = this.passwordForm.value.password || '';
      this.loading = true;
      this.userService.changePasword(this.userId, password, this.token).subscribe({
        next: () => {
          this.passwordForm.reset()
          this.alertService.showAlert('success', 'Contraseña actualizada correctamente', 5000);
          this.router.navigate(['/modules/bussines']);
          this.loading = false;
        },
        error: () => {
          this.alertService.showAlert('error', 'Algo salió mal, intente nuevamente', 5000);
          this.loading = false;
        }
      })
    }
  }

  cancelChange() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/modules/bussines']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

}
