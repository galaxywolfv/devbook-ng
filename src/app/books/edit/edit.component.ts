import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Role, Book } from '@/lib/types';
import { AuthenticationService } from '../../auth/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookService } from '../../book.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  auth: boolean = false;
  role: Role = Role.author;
  book: Partial<Book> = {
    title: '',
    description: ''
  };

  editForm: FormGroup;
  bookId: string = '';

  constructor(
    private authService: AuthenticationService,
    private bookService: BookService,
    private titleService: Title,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.titleService.setTitle('Edit Book - devbook');
    this.initializeData();
    this.editForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.bookId = params['id'];
      this.fetchBookDetails(this.bookId);
    });
  }

  async initializeData() {
    this.authService.isAuthenticated.subscribe((auth: boolean) => {
      this.auth = auth;
    });

    if (this.auth) {
      this.authService.userRole.subscribe((userRole: Role) => {
        this.role = userRole;
      });
    }
  }

  fetchBookDetails(bookId: string) {
    if (this.auth && this.role === Role.author) {
      this.bookService.fetchBook(bookId).subscribe((book: Partial<Book>) => {
        this.book = book;
        this.editForm.patchValue({
          title: book.title,
          description: book.description
        });
      });
    }
  }

  handleEditBook(): void {
    if (this.auth && this.role === Role.author && this.editForm.valid) {
      // You can access the form values using this.editForm.value
      const { title, description } = this.editForm.value;

      this.bookService.editBook(this.bookId, title, description).subscribe(() => {
        // Handle success or navigation after editing
      });
    }
  }
}
