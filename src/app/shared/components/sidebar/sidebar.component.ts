import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Input, Output, EventEmitter } from '@angular/core';
import { DashboardNavItem } from '../../../core/models/dashboard.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() items: DashboardNavItem[] = [];
  @Input() roleLabel = 'Citizen Portal';
  @Input() userName = 'Aarav Sharma';
  @Input() homeRoute = '/citizen/dashboard';
  @Input() open = false;
  @Output() close = new EventEmitter<void>();

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
