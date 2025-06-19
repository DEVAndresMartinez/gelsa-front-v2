import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../../core/services/alert-service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user-service';
import { CommonModule } from '@angular/common';
import { DraggableDirective } from '../../../core/directives/draggable-directive';
import { RolesService } from '../../../core/services/roles-service';
import { AuthService } from '../../../core/services/auth-service';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DraggableDirective],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users implements OnInit {

  user$: typeof this.authService.user$;
  loading: boolean = false;
  usersData: any[] = [];
  userDialog: boolean = false;
  permissions: any[] = [];
  userSelected: any = [];
  rolesData: any[] = [];
  rolesDialog: boolean = false;
  roleSelected: number | null = null;

  userForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.maxLength(80)]),
    full_name: new FormControl<string>('', [Validators.required, Validators.maxLength(80)])
  });

  constructor(
    private userService: UserService,
    private rolesService: RolesService,
    private authService: AuthService,
    private alertService: AlertService
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
    this.user$.pipe(
      filter(user => !!user && !!user.permissions), take(1)).subscribe(user => {
        this.permissions = user.permissions.map((permission: any) => permission.name);
        this.loadUsersData();
      });
  }

  loadUsersData() {
    this.loading = true;
    const token = localStorage.getItem('access_token');
    if (!token) return;
    this.userService.getUsers().subscribe({
      next: (data: any) => {
        this.usersData = data;
        this.alertService.showAlert('success', 'Usuarios cargados correctamente.', 5000);
        this.loading = false;
      },
      error: () => {
        this.alertService.showAlert('error', 'Error al cargar los usuarios, intente nuevamente.', 5000);
        this.loading = false;
      }
    });
  }

  openNewUser() {
    this.userForm.reset();
    this.userDialog = true;
  }

  hideDialog() {
    this.userDialog = false;
    this.userForm.reset();
  }

  saveUser() {
    const body = this.userForm.value;
    this.userService.addUser(body).subscribe({
      next: (data: any) => {
        this.alertService.showAlert('success', 'Usuario creado correctamente.', 5000);
        this.loadUsersData();
        this.hideDialog();
      },
      error: (error) => {
        this.alertService.showAlert('error', 'Error al crear el usuario, intente nuevamente.', 5000);
      }
    });
  }

  loadRoles() {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    this.rolesService.getAllRoles().subscribe({
      next: (data: any) => {
        this.rolesData = data;
      },
      error: () => {
        this.alertService.showAlert('error', 'Error al cargar los roles, intente nuevamente.', 5000);
      }
    });
  }

  openEditRoles(user: any) {
    this.loadRoles();
    this.userSelected = user;
    this.roleSelected = user.roles?.[0]?.id || null;
    this.rolesDialog = true;
  }

  hideRolesDialog() {
    this.rolesDialog = false;
    this.roleSelected = 0;
    this.userSelected = null;
  }


  selectedRole(roleId: number) {
    if (this.roleSelected === roleId) {
      this.roleSelected = null;
    } else {
      this.roleSelected = roleId;
    }
  }

  saveRoles() {
    const assigned_by = this.authService.currentUser.user.id;
    const body = {
      assigned_by: assigned_by,
      user_id: this.userSelected?.id,
      role_id: this.roleSelected
    };
    if (body.role_id === null) {
      this.alertService.showAlert('warning', 'Debe seleccionar un rol.', 5000);
    } else {
      this.rolesService.asssignRole(body).subscribe({
        next: () => {
          this.alertService.showAlert('success', 'Roles asignados correctamente.', 5000);
          this.loadUsersData();
          this.hideRolesDialog();
        },
        error: () => {
          this.alertService.showAlert('error', 'Error al asignar los roles, intente nuevamente.', 5000);
          this.hideRolesDialog();
        }
      });
    }
  }
}
