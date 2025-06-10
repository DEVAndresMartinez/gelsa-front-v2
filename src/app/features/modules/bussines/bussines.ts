import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BussinesService } from '../../../core/services/bussines-service';
import { AlertService } from '../../../core/services/alert-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bussines',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bussines.html',
  styleUrl: './bussines.scss'
})
export class Bussines implements OnInit {
  
  loading: boolean = false;
  bussinesData: any[] = [];
  searchTerm: string = '';

  constructor(
    private bussinesService: BussinesService,
    private alertService: AlertService
  ) {

  }

  ngOnInit(): void {
    this.loadBusinessData();
  }

  loadBusinessData() {
    this.loading = true;
    this.bussinesService.getBusinessData().subscribe({
      next: (data) => {
        this.bussinesData = data;
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


}
