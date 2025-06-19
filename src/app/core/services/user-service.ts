import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_BACK = environment.API_BACK;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BACK}/get-all-users`);
  }

  addUser(body: any): Observable<any> {
    return this.http.post<any>(`${this.API_BACK}/create-user`, body);
  }

  recoverPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.API_BACK}/send-reset-password/${email}`, {});
  }

  /**
   * @param userId
   * @param password
   * @param token
   */

  changePasword(userId: string, password: string, token?: string): Observable<any> {
    let url = '';
    let body: any = { password };

    if (token) {
      url = `${this.API_BACK}/reset-password/${userId}/${token}`;
    } else {
      url = `${this.API_BACK}/change-password/${userId}`;
    }
    return this.http.put<any>(url, body);
  }

}
