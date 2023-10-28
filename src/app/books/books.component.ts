import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Book, Role } from '@/lib/types';
import { BooksService } from '../books.service';
import { AuthenticationService } from '../auth/authentication.service';
import { Title } from '@angular/platform-browser';

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
  showModal: boolean = false;
  selectedBook: Book | undefined;
  Role = Role;

  constructor(
    private router: Router,
    private booksService: BooksService,
    private authService: AuthenticationService,
    private titleService: Title
  ) {
    this.updateTitle();
  }
  updateTitle() {
    if (this.router.url === '/') {
      this.titleService.setTitle('devbook');
    } else if (this.router.url === '/books') {
      this.titleService.setTitle('Explore - devbook');
    }
    // Add more conditions for other routes as needed
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


  toggleModal(book: Book): void {
    if (book) {
      this.selectedBook = book;
      this.showModal = !this.showModal;
    }
  }

  async handleDeleteBook(bookId: string, author: string): Promise<void> {
    if (this.auth && ((this.role === Role.admin) || (this.role === Role.author && this.username === author))) {
      // Implement your delete book logic using your service
      // For example:
      // await this.bookService.deleteBook(bookId);
      // Fetch books after deletion
      this.fetchBooks();
    }
  }

  async addToList(book: Book): Promise<void> {
    if (this.auth) {
      // Implement your add to list logic using your service
      // For example:
      // await this.savedBooksService.updateList(book);
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

