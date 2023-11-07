import { Book, Role } from '@/lib/types';
import { Component } from '@angular/core';
import { SavedBooksService } from '../saved-books.service';
import { AuthenticationService } from '../auth/authentication.service';

@Component({
  selector: 'app-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.css']
})
export class ReadingListComponent {
  auth: boolean = false;
  role: Role = Role.default;
  username: string = '';
  books: Book[] = [];
  selectedBook: Book | undefined;
  Role = Role;

  constructor(
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
          this.getMyList();
        }
      });
    }
  }
  async addToList(book: Book): Promise<void> {
    if (this.auth) {
      this.savedBooksService.updateList(book).subscribe(()=>{
        this.getMyList();
      });
    }
  }
  getMyList(): void {
    const token = this.authService.getToken(); // Retrieve the token
    if (token) {
      this.savedBooksService.fetchSavedBooks(token).subscribe({
        next: (books: Book[]) => {
          this.books = books;
        },
        error: (error) => {
          console.error('Error retrieving my saved books:', error);
        },
      });
    }
  }
}
