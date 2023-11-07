import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import config from '@/lib/config';
import { AuthenticationService } from './auth/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  constructor(private http: HttpClient, private router: Router, private authService: AuthenticationService) { }

  fetchBook(bookId: string): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error("Unauthorized"));
    }

    const headers = new HttpHeaders({
      'bearer': token
    });

    return this.http.post<any>(`${config.api}/book/get/${bookId}`, {}, { headers }).pipe(
      tap((response) => {
        // Handle the book data here
      }),
      catchError((error) => {
        console.error('Error retrieving book:', error);
        return throwError(() => error);
      })
    );
  }

  createBook(title: string, description: string): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error("Unauthorized"));
    }

    const data = { title, description };
    const headers = new HttpHeaders({
      'bearer': token
    });

    return this.http.post<any>(`${config.api}/book/save`, data, { headers }).pipe(
      tap(() => {
        this.router.navigate(['/published-books']);
        // Handle success here
      }),
      catchError((error) => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  editBook(bookId: string, title: string, description: string): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error("Unauthorized"));
    }

    const data = { title, description };
    const headers = new HttpHeaders({
      'bearer': token
    });

    return this.http.put<any>(`${config.api}/book/update/${bookId}`, data, { headers }).pipe(
      tap(() => {
        this.router.navigate(['/published-books']);
        // Handle success here
      }),
      catchError((error) => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }

  deleteBook(bookId: string): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error("Unauthorized"));
    }

    const headers = new HttpHeaders({
      'bearer': token
    });

    return this.http.delete<any>(`${config.api}/book/delete/${bookId}`, { headers }).pipe(
      tap((response) => {
        // Handle success here
      }),
      catchError((error) => {
        console.error(error);
        return throwError(() => error);
      })
    );
  }
}
