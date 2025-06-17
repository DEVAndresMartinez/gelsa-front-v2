import { Component, OnInit } from '@angular/core';
import { RolesService } from '../../../core/services/roles-service';
import { AlertService } from '../../../core/services/alert-service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DraggableDirective } from '../../../core/directives/draggable-directive';

@Component({
  selector: 'app-roles-permissions',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DraggableDirective],
  templateUrl: './roles-permissions.html',
  styleUrl: './roles-permissions.scss'
})
export class RolesPermissions implements OnInit {

  loading: boolean = false;
  loadingPermissions: boolean = false;
  rolesData: any[] = [];
  permissionsData: any[] = [];
  roleDialog: boolean = false;
  roleId: number | null = null;
  roleName: string = '';
  isEditRole: boolean = false;
  permissionSelected: number[] = [];
  roleSelected: any[] = [];
  permissionsByRole: any[] = [];
  permissionsDialog: boolean = false;

  roleForm = new FormGroup({
    role_name: new FormControl<string>('', [Validators.required, Validators.maxLength(80)]),
    description: new FormControl<string>('', [Validators.required, Validators.maxLength(250)]),
    status: new FormControl<boolean>(true)
  });

  constructor(
    private rolesService: RolesService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    this.loading = true;
    this.rolesService.getAllRoles(true).subscribe({
      next: (data: any) => {
        this.rolesData = data;
        this.alertService.showAlert('success', 'Roles cargados correctamente.', 5000);
        this.loading = false;
      },
      error: (error) => {
        this.alertService.showAlert('error', 'Error al cargar los roles, intente nuevamente.', 5000);
        this.loading = false;
      }
    });
  }

  openNewRole(isEditRole: boolean = false, roleSelected: any = null) {
    this.roleDialog = true;
    this.isEditRole = isEditRole;
    if (isEditRole) {
      this.roleId = roleSelected?.id;
      this.roleForm.patchValue({
        role_name: roleSelected?.role_name,
        description: roleSelected?.description,
      });
    } else {
      this.roleForm.reset();
    }
  }

  hideDialog() {
    this.roleDialog = false;
    this.roleForm.reset();
  }

  saveRole() {
    const body = this.roleForm.value;
    if (this.isEditRole) {
      this.rolesService.updateRole(this.roleId!, body).subscribe({
        next: () => {
          this.alertService.showAlert('success', 'Rol actualziado correctamente.', 5000);
          this.reloadValues();
        },
        error: (error: any) => {
          if (error.error.detail.includes('Ya existe un rol con el nombre')) {
            this.alertService.showAlert('warning', 'Ya existe un rol con el nombre', 5000);
            return;
          }
          this.alertService.showAlert('error', 'Error al actualizar el rol, intente nuevamente.', 5000);
        }
      });
    } else {
      this.rolesService.addRole(body).subscribe({
        next: () => {
          this.alertService.showAlert('success', 'Rol creado correctamente.', 5000);
          this.reloadValues();
        },
        error: (error: any) => {
          if (error.error.detail.includes('Ya existe un rol con el nombre')) {
            this.alertService.showAlert('warning', 'Ya existe un rol con el nombre', 5000);
            return;
          }
          this.alertService.showAlert('error', 'Error al crear el rol, intente nuevamente.', 5000);
        }
      });
    }
  }

  reloadValues() {
    this.loadRoles();
    this.hideDialog();
    this.isEditRole = false;
    this.roleId = null;
  }

  loadPermissions() {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    this.loadingPermissions = true;
    this.rolesService.getPermissions().subscribe({
      next: (data: any) => {
        this.permissionsData = data;
        this.loadingPermissions = false;
      },
      error: () => {
        this.alertService.showAlert('error', 'Error al cargar los permisos, intente nuevamente.', 5000)
      }
    });
  }

  openEditPermissions(role: any) {
    this.loadPermissions();
    this.roleSelected = role;
    this.roleId = role.id;
    this.roleName = role.role_name;
    this.loadingPermissions = true;
    this.rolesService.getPermissionsByRole(role.id).subscribe({
      next: (data: any) => {
        this.permissionsByRole = data;
        this.permissionSelected = data.map((item: any) => item.permission_id);
        this.loadingPermissions = false;
      },
      error: () => {
        this.alertService.showAlert('error', 'Error al cargar los permisos, intente nuevamente.', 5000);
      }
    });
    this.permissionsDialog = true;
  }

  hidePermissionsDialog() {
    this.permissionsDialog = false;
    this.roleSelected = [];
    this.permissionsByRole = [];
  }

  selectedRole(roleId: number) {
    if (this.permissionSelected.find(item => item === roleId)) {
      this.permissionSelected = this.permissionSelected.filter(item => item !== roleId);
    } else {
      this.permissionSelected.push(roleId);
    }
  }

  savePermissions() {
    const body = {
      role_id: this.roleId,
      permission_ids: this.permissionSelected
    };

    this.rolesService.assignPermission(body).subscribe({
      next: () => {
        this.alertService.showAlert('success', 'Permisos asignados correctamente.', 5000);
        this.loadRoles();
        this.hidePermissionsDialog();
      },
      error: () => {
        this.alertService.showAlert('error', 'Error al asignar los permisos, intente nuevamente.', 5000);
        this.hidePermissionsDialog();
      }
    });
  }

}
