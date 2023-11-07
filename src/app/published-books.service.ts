import { Book } from '@/lib/types';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError } from 'rxjs';
import config from '@/lib/config';

@Injectable({
  providedIn: 'root'
})
export class PublishedBooksService {

  constructor(private http: HttpClient) { }

  fetchPublishedBooks(token: string | null, username: string): Observable<Book[]> {
    if (token) {
      const headers = new HttpHeaders({
        'bearer': token,
      });

      return this.http
        .get<Book[]>(`${config.api}/user/publish/find/${username}`, { headers })
        .pipe(
          map((response: Book[]) => {
            return response;
          }),
          catchError((error: any) => {
            console.error(`Error retrieving published books for ${username}:`, error);
            return [];
          })
        );
    } else {
      return new Observable<Book[]>();
    }
  }
  fetchMyPublishedBooks(token: string | null): Observable<Book[]> {
    if (token) {
      const headers = new HttpHeaders({
        'bearer': token,
      });

      return this.http
        .get<Book[]>(`${config.api}/user/publish/find`, { headers })
        .pipe(
          map((response: Book[]) => {
            return response;
          }),
          catchError((error: any) => {
            console.error('Error retrieving published books:', error);
            return [];
          })
        );
    } else {
      return new Observable<Book[]>();
    }
  }
}
