import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-stat-card',
  standalone: true,
  templateUrl: './dashboard-stat-card.component.html',
  styleUrl: './dashboard-stat-card.component.css'
})
export class DashboardStatCardComponent {
  @Input() label = '';
  @Input() value: number | string = 0;
  @Input() detail = '';
  @Input() icon = '•';
  @Input() accent = 'blue';
}
