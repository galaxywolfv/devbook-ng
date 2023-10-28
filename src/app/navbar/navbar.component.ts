import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '@/lib/types';
import { AuthenticationService } from '../auth/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  auth: boolean = false; // Initialize with your authentication logic
  role: Role = Role.author; // Initialize with your role
  currentRoute: string = '';
  Role = Role;

  constructor(private router: Router, private authService: AuthenticationService) {
    // Subscribe to router events to track the current route
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  logout() {
    // Implement your logout logic here
    this.authService.logout();
  }

  ngOnInit(): void {
    // Subscribe to user authentication status changes
    this.authService.isAuthenticated.subscribe((auth: boolean) => {
      this.auth = auth;
    });

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

      });
    }
  }
}
