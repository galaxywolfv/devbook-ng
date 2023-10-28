import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '@/lib/types';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  auth: boolean = false; // Initialize with your authentication logic
  role: Role = Role.author; // Initialize with your role
  currentRoute: string = '';

  constructor(private router: Router) {
    // Subscribe to router events to track the current route
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  logout() {
    // Implement your logout logic here
    localStorage.removeItem('token');
  }
}
