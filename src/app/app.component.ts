import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentRoute: string = '';

  constructor(private router: Router, private titleService: Title) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        this.updateTitle();
      }
    });
  }

  ngOnInit() {
    this.updateTitle();
  }

  updateTitle() {
    switch (this.currentRoute) {
      case '/':
        this.titleService.setTitle('devbook');
        break;
      case '/books':
        this.titleService.setTitle('Explore Books - devbook');
        break;
      case '/books/publish':
        this.titleService.setTitle('Publish Book - devbook');
        break;
      case '/auth/login':
        this.titleService.setTitle('Login - devbook');
        break;
      case '/auth/register':
        this.titleService.setTitle('Create Account - devbook');
        break;
      case '/published-books':
        this.titleService.setTitle('Published Books - devbook');
        break;
      case '/published-books':
        this.titleService.setTitle('Published Books - devbook');
        break;
      case '/reading-list':
        this.titleService.setTitle('My List - devbook');
        break;
      default:
        if (this.currentRoute.startsWith('/books/edit/')) {
          this.titleService.setTitle('Edit Book - devbook');
        } else if (this.currentRoute.startsWith('/published-books/')) {
          this.titleService.setTitle('Published Books - devbook');
        }
        else {
          this.titleService.setTitle('devbook');
        }
        break;
    }
  }
}
