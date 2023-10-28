import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Book } from '@/lib/types'; // Import your Book type here
import config from '@/lib/config';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  constructor(private http: HttpClient) { }

  getBooks(token: string | null): Observable<Book[]> {
    if (token) {
      const headers = new HttpHeaders({
        'bearer': token,
      });

      return this.http
        .get<Book[]>(`${config.api}/book/get-all`, { headers })
        .pipe(
          map((response: Book[]) => {
            return response;
          }),
          catchError((error: any) => {
            console.error('Error retrieving books:', error);
            return [];
          })
        );
    } else {
      return new Observable<Book[]>();
    }
  }
}
