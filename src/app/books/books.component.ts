import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Book, Role } from '@/lib/types';
import { BooksService } from '../books.service';
import { AuthenticationService } from '../auth/authentication.service';
import { Title } from '@angular/platform-browser';
import { BookService } from '../book.service';
import { SavedBooksService } from '../saved-books.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'] // You can adjust the style URL as needed
})
export class BooksComponent implements OnInit {
  auth: boolean = false;
  role: Role = Role.default;
  username: string = '';
  books: Book[] = [];
  selectedBook: Book | undefined;
  Role = Role;

  constructor(
    private bookService: BookService,
    private booksService: BooksService,
    private savedBooksService: SavedBooksService,
    private authService: AuthenticationService,
  ) {
  }

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
          this.fetchBooks();
        }
      });
    }
  }

  async handleDeleteBook(bookId: string, author: string): Promise<void> {
    if (this.auth && ((this.role === Role.admin) || (this.role === Role.author && this.username === author))) {
      // Implement your delete book logic using your service
      // For example:
      // await this.bookService.deleteBook(bookId);
      // Fetch books after deletion
      this.bookService.deleteBook(bookId).subscribe()
      this.fetchBooks();
    }
  }

  async addToList(book: Book): Promise<void> {
    if (this.auth) {
      this.savedBooksService.updateList(book).subscribe();
    }
  }

  fetchBooks(): void {
    const token = this.authService.getToken(); // Retrieve the token
    if (token) {
      this.booksService.getBooks(token).subscribe({
        next: (books: Book[]) => {
          this.books = books;
        },
        error: (error) => {
          console.error('Error retrieving books:', error);
        },
      });
    }
  }

}

