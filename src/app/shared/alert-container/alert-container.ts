import { Component, OnInit } from '@angular/core';
import { AlertModel } from '../../core/models/alert';
import { AlertService } from '../../core/services/alert-service';
import { Alert } from '../alert/alert';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert-container',
  standalone: true,
  imports: [CommonModule, Alert],
  templateUrl: './alert-container.html',
  styleUrl: './alert-container.scss'
})
export class AlertContainer implements OnInit {

  alerts: AlertModel[] = [];

  constructor(
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.alertService.alerts$.subscribe(alerts => {
      this.alerts = alerts;
    });
  }

  onClose(id: number) {
    this.alertService.removeAlert(id);
  }

}
