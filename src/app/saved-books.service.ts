import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import config from '@/lib/config';
import { Book } from '@/lib/types';
import { AuthenticationService } from './auth/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class SavedBooksService {
  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  fetchSavedBooks(token: string | null): Observable<Book[]> {
    if (token) {
      const headers = new HttpHeaders({
        'bearer': token,
      });

      return this.http
        .get<Book[]>(`${config.api}/user/list/find`, { headers })
        .pipe(
          map((response: Book[]) => {
            return response;
          }),
          catchError((error: any) => {
            console.error('Error retrieving saved books:', error);
            return [];
          })
        );
    } else {
      return new Observable<Book[]>();
    }
  }

  updateList(book: Book): Observable<any> {
    return this.authService.isAuthenticated.pipe(
      take(1), // Take only one value to avoid ongoing subscriptions
      switchMap((isAuthenticated) => {
        if (!isAuthenticated) {
          return throwError(() => 'Unauthorized');
        }

        const token = this.authService.getToken();

        if (!token) {
          return throwError(() => 'Unauthorized');
        }

        const bookId: string = book._id;
        const title: string = book.title;
        const headers = new HttpHeaders({
          'bearer': token,
        });

        return this.http.get<Book[]>(`${config.api}/user/list/find`, { headers }).pipe(
          catchError((error: any) => {
            console.error('Error retrieving user list:', error);
            return throwError(() => 'Something went wrong');
          }),
          switchMap((myBooks: Book[]) => {
            const bookInList: Book | undefined = myBooks.find(b => b._id === bookId);

            if (bookInList) {
              // If the book is in the list, delete it
              return this.http.delete(`${config.api}/user/list/delete/${bookId}`, { headers }).pipe(
                tap(() => {
                  // Handle successful removal
                  console.log(`Successfully removed "${bookInList.title}" from Saved Books`);
                }),
                catchError((error) => {
                  console.error(error);
                  // Handle removal error
                  return throwError(() => 'Failed to remove book from Saved Books');
                })
              );
            } else {
              // If the book is not in the list, add it
              return this.http.get(`${config.api}/user/list/save/${bookId}`, { headers }).pipe(
                tap(() => {
                  // Handle successful addition
                  console.log(`Successfully added "${title}" to Saved Books`);
                }),
                catchError((error) => {
                  console.error(error);
                  // Handle addition error
                  return throwError(() => 'Failed to add book to Saved Books');
                })
              );
            }
          })
        );
      })
    );
  }
}
