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

    getBusinessData(): Observable<any[]> {
        return this.http.get<any[]>(`${this.API_BACK}/bussines-all/`);
    }
}