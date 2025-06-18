import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BussinesService {

  private API_BACK = environment.API_BACK;

  constructor(private http: HttpClient) { }

  getBusinessData(body: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.API_BACK}/bussines/`, body);
  }

  getTransactions(body: any): Observable<any> {
    return this.http.post<any>(`${this.API_BACK}/bussines/search`, body);
  }

  activeBusiness(id_bussines: any): Observable<any> {
    return this.http.put<any>(`${this.API_BACK}/bussines/activate`, id_bussines);
  }

  deactiveBusiness(id_bussines: any): Observable<any> {
    return this.http.put<any>(`${this.API_BACK}/bussines/deactivate`, id_bussines);
  }

}