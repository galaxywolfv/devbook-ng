import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Role, Book } from '@/lib/types';
import { AuthenticationService } from '../../auth/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.css']
})
export class PublishComponent {
  auth: boolean = false;
  role: Role = Role.author;
  book: Partial<Book> = {
    title: '',
    description: ''
  };

  publishForm: FormGroup;

  constructor(private authService: AuthenticationService, private titleService: Title, private formBuilder: FormBuilder) {
    this.titleService.setTitle('Publish Book - devbook');
    this.initializeData();
    this.createForm();
    this.publishForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
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

  createForm() {
    this.publishForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  handleCreateBook(): void {
    if (this.auth && this.role === Role.author && this.publishForm.valid) {
      // You can access the form values using this.publishForm.value
      const { title, description } = this.publishForm.value;
      // hier serviec maken
    }
  }
}
