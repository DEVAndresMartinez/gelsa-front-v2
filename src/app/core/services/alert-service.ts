import { Injectable } from '@angular/core';
import { AlertModel } from '../models/alert';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private alerts: AlertModel[] = [];
  private alersSubject = new BehaviorSubject<AlertModel[]>([]);
  alerts$ = this.alersSubject.asObservable();

  private idCounter = 0;

  showAlert(type: AlertModel['type'], message: string, duration: number){
    const alert: AlertModel = {
      id: ++this.idCounter,
      type,
      message
    };
    this.alerts.push(alert);
    this.alersSubject.next(this.alerts);

    if (duration > 0) {
      setTimeout(() => this.removeAlert(alert.id), duration);
    }
  }

  removeAlert(id: number) {
    this.alerts = this.alerts.filter(alert => alert.id !== id);
    this.alersSubject.next(this.alerts);
  }
}
