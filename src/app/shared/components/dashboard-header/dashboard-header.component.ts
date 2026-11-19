import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.css'
})
export class DashboardHeaderComponent {
  @Input() title = 'Citizen Dashboard';
  @Input() portalLabel = 'Citizen Portal';
  @Input() userName = 'Aarav Sharma';
  @Input() profilePic = '/assets/images/logo/gatherly-mark.svg';
  @Input() rootPath = '/citizen';
  @Output() menuToggle = new EventEmitter<void>();

  profileOpen = false;
  notificationsOpen = false;
}
