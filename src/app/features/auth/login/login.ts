import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { AlertService } from '../../../core/services/alert-service';
import { DraggableDirective } from '../../../core/directives/draggable-directive';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, DraggableDirective],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {

  protected showPassword: boolean = false;
  showAlert: boolean = false;
  showRecoveryDialog: boolean = false;

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  recoveryForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {

  }

  onSubmit(form: any) {
    const formData = new FormData();
    formData.append('username', form.username);
    formData.append('password', form.password);
    this.authService.login(formData).subscribe({
      next: (response) => {
        this.alertService.showAlert('success', 'Inicio de sesión exitoso.', 3000);
        localStorage.setItem('access_token', response.access_token);
        this.router.navigate(['/modules/home']);
      },
      error: (error) => {
        this.alertService.showAlert('error', 'Error al iniciar sesión. Verifique sus credenciales.', 5000);
      }
    })
  }
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  openRecoveryDialog() {
    this.showRecoveryDialog = true;
  }

  closeRecoveryDialog() {
    this.showRecoveryDialog = false;
    this.recoveryForm.reset();
  }

  onRecoverPassword() {
    if (this.recoveryForm.invalid) {
      this.alertService.showAlert('error', 'Por favor, ingrese un correo valido.', 3000);
    } else {
      const email = this.recoveryForm.get('email')?.value;
      this.authService.recoverPassword(email).subscribe({
        next: () => {
          this.alertService.showAlert('success', 'Correo de recuperación enviado', 3000);
          this.showRecoveryDialog = false;
        },
        error: (error) => {
          this.alertService.showAlert('error', 'Error al enviar el correo de recuperación.', 5000);
        }
      });
    }
  }

}
