import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BooksComponent } from './books/books.component';
import { PublishedBooksComponent } from './published-books/published-books.component';
import { ReadingListComponent } from './reading-list/reading-list.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { PublishComponent } from './books/publish/publish.component';
import { EditComponent } from './books/edit/edit.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'books', component: BooksComponent },
  { path: 'published-books', component: PublishedBooksComponent },
  { path: 'published-books/:id', component: PublishedBooksComponent },
  { path: 'reading-list', component: ReadingListComponent },
  { path: 'books/publish', component: PublishComponent },
  { path: 'books/edit/:id', component: EditComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
