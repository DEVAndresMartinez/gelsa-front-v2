import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BussinesService } from '../../../core/services/bussines-service';
import { AlertService } from '../../../core/services/alert-service';
import { FormsModule } from '@angular/forms';
import { ExportReportsService } from '../../../core/services/export-reports-service';
import { AuthService } from '../../../core/services/auth-service';
import { filter, take } from 'rxjs/operators';
import { DraggableDirective } from '../../../core/directives/draggable-directive';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bussines',
  standalone: true,
  imports: [CommonModule, FormsModule, DraggableDirective],
  templateUrl: './bussines.html',
  styleUrl: './bussines.scss'
})
export class Bussines implements OnInit {

  user$: typeof this.authService.user$;
  roles: any[] = [];
  permissions: any[] = [];
  havePermission: boolean = false;

  loading: boolean = false;
  bussinesData: any[] = [];
  bussinesDataCopy: any[] = [];
  searchTerm: string = '';
  fecha_fin: string = '';
  fecha_inicio: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  totalTx: number = 0;
  totalSale: number = 0;
  selected: any[] = [];
  deactiveDialog: boolean = false;

  constructor(
    private bussinesService: BussinesService,
    private authService: AuthService,
    private alertService: AlertService,
    private reportsService: ExportReportsService,
    private router: Router
  ) { 
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
    this.generateDates();
    this.user$.pipe(
      filter(user => !!user && !!user.roles && !!user.permissions),take(1)).subscribe(user => {
        this.roles = user.roles.map((role: any) => role.name);
        this.permissions = user.permissions.map((permission: any) => permission.name);

      if (this.permissions.includes('view_business_cundinamarca') || this.permissions.includes('view_business_bogota') || this.roles.includes('Administrador')) {
        this.loadBusinessData();
      } else {
        this.alertService.showAlert('warning', 'No tiene permisos para ver los comercios.', 5000);
      }
    });
  }

  generateDates(){
    const today = new Date();
    this.fecha_fin = today.toISOString().slice(0, 10);

    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 30);
    this.fecha_inicio = pastDate.toISOString().slice(0, 10)
  }

  loadBusinessData(startDate: string = this.fecha_inicio, endDate: string = this.fecha_fin) {
    this.loading = true;
    const body = {
      fecha_fin: endDate,
      fecha_inicio: startDate
    }
    const token = localStorage.getItem('access_token');
    if (!token) return;
    this.bussinesService.getBusinessData(body).subscribe({
      next: (data: any) => {
        this.bussinesDataCopy = data.data.data;
        this.bussinesData = [...this.bussinesDataCopy];

        if (this.bussinesData.length === 0) {
          this.alertService.showAlert('info', 'No hay comercios disponibles.', 5000);
        } else {
          this.alertService.showAlert('success', 'Comercios cargados correctamente.', 5000);
        }
        this.loading = false;
      },
      error: (error) => {
        this.alertService.showAlert('error', 'Error al cargar los comercios, inente nuevamente.', 5000);
        this.loading = false;
      }
    });
  }

  getTotalTx(): number {
    this.totalTx = this.bussinesData.reduce((sum, item) => sum + (item.total_transacciones || 0), 0);
    return this.totalTx;
  }
  
  getTotalSale(): number {
    this.totalSale = this.bussinesData.reduce((sum, item) => sum + (parseInt(item.total_ventas) || 0), 0);
    return this.totalSale;
  }

  globalFilter() {
    if (!this.searchTerm) {
      this.bussinesData = [...this.bussinesDataCopy];
      return;
    }
    const lowerFilter = this.searchTerm.toLowerCase();
    this.bussinesData = this.bussinesDataCopy.filter(item =>
      Object.values(item).some(value =>
        value !== null &&
        value !== undefined &&
        value.toString().toLowerCase().includes(lowerFilter)
      )
    );
  }

  filterByDateRange() {
    if (!this.fecha_inicio || !this.fecha_fin) {
      this.bussinesData = [...this.bussinesDataCopy];
      return;
    }
    
    this.loadBusinessData(this.fecha_inicio, this.fecha_fin);
  }

  orderBy(key: string) {
    if (this.sortColumn === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = key;
      this.sortDirection = 'asc';
    }

    this.bussinesData.sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return this.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      const comparison = aValue.toString().localeCompare(bValue.toString(), 'es', { numeric: true });

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  onSelect(event: any, bussines: any) {
    const index = this.selected.findIndex((row: any) => row.business_id === bussines.business_id);
    if (index !== -1) {
      this.selected.splice(index, 1);
    } else {
      this.selected.push(bussines);
    }
  }

  downloadExcel() {
    const today = new Date();
    this.reportsService.exportToExcelBusiness(this.bussinesData, `reporte_comercios_${today.toISOString().slice(0, 10)}`);
  }

  isSelected(bussines: any): boolean {
    return this.selected.some(row => row.business_id === bussines.business_id);
  }

  get paginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.bussinesData.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.bussinesData.length / this.itemsPerPage);
  }

  viewTransactions(bussines: any) {
    const body = {
      business_id: bussines.business_id,
      date_final: this.fecha_fin,
      date_ini: this.fecha_inicio
    }
    this.router.navigate([`modules/bussines/${body.business_id}/transactions/${body.date_ini}/${body.date_final}`]);
  }

  openDeactiveDialog() {
    if (this.selected.length === 0) {
      this.alertService.showAlert('info', 'No hay comercios seleccionados.', 5000) 
    } else {
      this.deactiveDialog = true;
    }
  }

  closeDeactiveDialog() {
    this.deactiveDialog = false;
  }

  deactiveBusiness() {
    const id_bussines = this.selected.map(item => item.business_id);
    const body = {
      id_bussines: id_bussines
    }
    console.log(body)
    this.bussinesService.deactiveBusiness(body).subscribe({
      next: () => {
        this.alertService.showAlert('success', 'Comercios desactivados correctamente.', 5000);
        this.loadBusinessData();
        this.currentPage = 1;
        this.closeDeactiveDialog();
      },
      error: () => {
        this.alertService.showAlert('error', 'Error al desactivar los comercios, intente nuevamente.', 5000);
        this.closeDeactiveDialog();
      }
    })
  }
}
