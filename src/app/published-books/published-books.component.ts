import { Component } from '@angular/core';
import { AuthenticationService } from '../auth/authentication.service';
import { Role, Book } from '@/lib/types';
import { BooksService } from '../books.service';
import { BookService } from '../book.service';
import { PublishedBooksService } from '../published-books.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-published-books',
  templateUrl: './published-books.component.html',
  styleUrls: ['./published-books.component.css']
})
export class PublishedBooksComponent {
  auth: boolean = false;
  role: Role = Role.default;
  username: string = '';
  books: Book[] = [];
  selectedBook: Book | undefined;
  Role = Role;
  author: boolean = false;

  constructor(private authService: AuthenticationService, private bookService: BookService, private booksService: BooksService, private publishedBooksService: PublishedBooksService, private route: ActivatedRoute) { }
  ngOnInit(): void {
    const token = this.authService.getToken();

    if (token) {
      // Fetch user info and set values
      this.authService.fetchSelf(token).subscribe(() => {
        // Now that the values are set, we can subscribe
        this.authService.isAuthenticated.subscribe((auth: boolean) => {
          this.auth = auth;
        });

        this.authService.userRole.subscribe((role: Role) => {
          this.role = role;
        });

        this.authService.userName.subscribe((username: string) => {
          this.username = username;
        });
        // Check if the user is authenticated again in case the token changed during fetchSelf
        if (this.auth) {
          this.route.params.subscribe((params) => {
            // Check if the URL includes a username parameter
            if (params['id']) {
              this.getBooks(params['id']);
              this.author = true;
            } else {
              this.getMyBooks();
              this.author = false;
            }
          });
        }
      });
    }
  }
  async handleDeleteBook(bookId: string, author: string): Promise<void> {
    if (this.auth && ((this.role === Role.admin) || (this.role === Role.author && this.username === author))) {
      this.bookService.deleteBook(bookId).subscribe()
      this.route.params.subscribe((params) => {
        // Check if the URL includes a username parameter

        if (params['id']) {
          this.getBooks(params['id']);
          this.author = true;
        } else {
          this.getMyBooks();
          this.author = false;
        }
      });
    }
  }
  getMyBooks(): void {
    const token = this.authService.getToken(); // Retrieve the token
    if (token) {
      this.publishedBooksService.fetchMyPublishedBooks(token).subscribe({
        next: (books: Book[]) => {
          this.books = books;
        },
        error: (error) => {
          console.error('Error retrieving my published books:', error);
        },
      });
    }
  }
  getBooks(username: string): void {
    const token = this.authService.getToken(); // Retrieve the token
    if (token) {
      this.publishedBooksService.fetchPublishedBooks(token, username).subscribe({
        next: (books: Book[]) => {
          this.books = books;
        },
        error: (error) => {
          console.error('Error retrieving published books:', error);
        },
      });
    }
  }
}
