import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import config from '@/lib/config';
import { Role } from '@/lib/types';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private authSubject = new BehaviorSubject<boolean>(false);
  private roleSubject = new BehaviorSubject<Role>(Role.default);
  private usernameSubject = new BehaviorSubject<string>('');

  constructor(private http: HttpClient, private router: Router) {
    this.checkToken(); // Check if the user has a valid token on initialization.
  }

  get isAuthenticated(): Observable<boolean> {
    return this.authSubject.asObservable();
  }

  get userRole(): Observable<Role> {
    return this.roleSubject.asObservable();
  }

  get userName(): Observable<string> {
    return this.usernameSubject.asObservable();
  }

  login(username: string, password: string): Observable<any> {
    const data = { username, password };

    return this.http.post<any>(`${config.api}/user/login`, data).pipe(
      tap((response) => {
        localStorage.setItem('token', response);
        this.fetchSelf(response).subscribe((res) => {
          this.authSubject.next(true)
          this.roleSubject.next(res.role);
          this.usernameSubject.next(res.username);
          this.router.navigate(['/']);
        });
      })
    );
  }

  register(username: string, password: string): Observable<any> {
    const data = { username, password };

    return this.http.post<any>(`${config.api}/user/save`, data).pipe(
      tap((response) => {
        localStorage.setItem('token', response);
        this.authSubject.next(true);
        this.router.navigate(['/']);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.authSubject.next(false); // Update the auth status to false
    this.roleSubject.next(Role.default); // Reset the role to the default
    this.usernameSubject.next(''); // Reset the username
    this.router.navigate(['']);
  }

  // Add a method to get the token
  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  private checkToken(): void {
    const token = this.getToken();

    if (token) {
      this.authSubject.next(true);
    }
  }

  // Update the fetchSelf method in your AuthenticationService
  fetchSelf(token: string): Observable<any> {
    return this.http.get<any>(`${config.api}/user/get-self`, {
      headers: {
        bearer: token,
      }
    }).pipe(
      tap((response) => {
        this.authSubject.next(true)
        this.roleSubject.next(response.role);
        this.usernameSubject.next(response.username);
      }),
      catchError((error) => {
        console.error('Error fetching user info:', error);
        return throwError(error);
      })
    );
  }
}
