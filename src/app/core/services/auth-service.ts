import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_AUTH = environment.API_AUTH;
  private API_BACK = environment.API_BACK;

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(body: any): Observable<any> {
    return this.http.post<any>(`${this.API_AUTH}/token`, body);
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.API_AUTH}/logout`, {});
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    if (token !== null) {
      return true;
    }
    return false;
  }

  recoverPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.API_BACK}/send-reset-password/${email}`, {});
  }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.API_AUTH}/users/me/`).pipe(
      tap(user => this.userSubject.next(user))
    );
  }
  
  get currentUser(): any {
    return this.userSubject.value;
  }

}
