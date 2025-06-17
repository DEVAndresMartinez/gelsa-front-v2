import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class BussinesService {

    private API_BACK = environment.API_BACK;

    constructor(private http: HttpClient) {}

    getBusinessData(body: any): Observable<any[]> {
        return this.http.post<any[]>(`${this.API_BACK}/bussines/`, body);
    }

    getTransaccioens(body: any): Observable<any> {
    const httpOptions = {
      headers: {
        'accept': 'application/json'
      }
    };
    return this.http.post<any>('https://comercialapptest.practisistemas.com:8087/api/get-transactions', body, httpOptions);
  }

}