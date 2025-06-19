import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BussinesService } from '../../../core/services/bussines-service';
import { AlertService } from '../../../core/services/alert-service';
import { AuthService } from '../../../core/services/auth-service';
import { filter, take } from 'rxjs/operators';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExportReportsService } from '../../../core/services/export-reports-service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss'
})
export class Transactions implements OnInit {

  @Input() id_bussines!: string;
  @Input() date_ini!: string;
  @Input() date_final!: string;
  user$: typeof this.authService.user$;
  roles: any[] = [];
  permissions: any[] = [];
  loading: boolean = false;
  transactionsData: any[] = [];
  transactionsDataCopy: any[] = [];
  
  searchTerm: string = '';
  fecha_fin: string = '';
  fecha_inicio: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bussinesService: BussinesService,
    private authService: AuthService,
    private alertService: AlertService,
    private reportsService: ExportReportsService
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id_bussines = params.get('id_bussines') || '';
      this.date_ini = params.get('date_ini') || '',
        this.date_final = params.get('date_final') || ''
    })

    this.user$.pipe(
      filter(user => !!user && !!user.roles && !!user.permissions), take(1)).subscribe(user => {
        this.roles = user.roles.map((role: any) => role.name);
        this.permissions = user.permissions.map((permission: any) => permission.name);

        if (this.permissions.includes('get_business_id') || this.roles.includes('Administrador')) {
          this.loadTransactions();
        } else {
          this.alertService.showAlert('warning', 'No tiene permisos para ver las transacciones.', 5000);
        }
      });
  }

  loadTransactions(startDate: string = this.fecha_inicio, endDate: string = this.fecha_fin) {
    this.loading = true;
    const body = {
      business_id: parseInt(this.id_bussines),
      date_ini: startDate || this.date_ini,
      date_final: endDate || this.date_final
    }
    this.bussinesService.getTransactions(body).subscribe({
      next: (data: any) => {
        this.loading = false;
        const rawTransactions = Object.values(data.data.transactions);
        this.transactionsDataCopy = rawTransactions.map((item: any) => ({
          id: item.id,
          fecha: item.fecha,
          documento: item.documento,
          autorizacion: item.autorizacion,
          cantidad: item.cantidad
        }));
        this.transactionsData = [...this.transactionsDataCopy];
      },
      error: (error) => {
        if (error.error.message.includes('No se encontraron transacciones')) {
          this.loading = false;
          this.alertService.showAlert('info', 'No se encontraron transacciones', 5000);
          this.transactionsData = [];
        }
      }
    });
  }

  filterByDateRange() {
    if (!this.fecha_inicio || !this.fecha_fin) {
      this.transactionsData = [...this.transactionsDataCopy];
      return;
    }
    this.loadTransactions(this.fecha_inicio, this.fecha_fin);
  }

  globalFilter() {
    if (!this.searchTerm) {
      this.transactionsData = [...this.transactionsDataCopy];
      return;
    }
    const lowerFilter = this.searchTerm.toLowerCase();
    this.transactionsData = this.transactionsDataCopy.filter(item =>
      Object.values(item).some(value =>
        value !== null &&
        value !== undefined &&
        value.toString().toLowerCase().includes(lowerFilter)
      )
    );
  }

  orderBy(key: string) {
    if (this.sortColumn === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = key;
      this.sortDirection = 'asc';
    }

    this.transactionsData.sort((a, b) => {
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

  get paginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.transactionsData.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.transactionsData.length / this.itemsPerPage);
  }

  downloadExcel() {
    const today = new Date();
    this.reportsService.exportToExcelTx(this.transactionsData, `reporte_transacciones_${today.toISOString().slice(0, 10)}`);
  }

  backBusiness() {
    this.router.navigate(['/modules/business'])
  }

}
