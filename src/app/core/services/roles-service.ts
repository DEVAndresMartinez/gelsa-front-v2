import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private API_BACK = environment.API_BACK;

  constructor(private http: HttpClient) {}

  getAllRoles(all: boolean = false): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BACK}/api/roles/?include_inactive=${all}`);
  }

  
  addRole(body: any): Observable<any> {
    return this.http.post<any>(`${this.API_BACK}/api/roles/`, body);
  }

  updateRole(role_id: number, body: any): Observable<any> {
    return this.http.put<any>(`${this.API_BACK}/api/roles/${role_id}/`, body);
  }

  asssignRole(body: any): Observable<any> {
    return this.http.post<any>(`${this.API_BACK}/api/user-roles/assign`, body);
  }
  
  getPermissions(include_inactive: boolean = false): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BACK}/api/permissions/?include_inactive=${include_inactive}`);
  }

  getPermissionsByRole(role_id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BACK}/api/role-permissions/role/${role_id}`);
  }

  assignPermission(body: any): Observable<any> {
    return this.http.post<any>(`${this.API_BACK}/api/role-permissions/assign`, body);
  }

}
