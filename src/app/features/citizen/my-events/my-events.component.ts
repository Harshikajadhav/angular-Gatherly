import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RegisteredEvent, CitizenDataService } from '../../../core/services/citizen-data.service';

type EventTab = 'UPCOMING' | 'COMPLETED' | 'CANCELLED';

@Component({
  selector: 'app-citizen-my-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.css'
})
export class CitizenMyEventsComponent implements OnInit {
  private readonly citizenData = inject(CitizenDataService);
  private readonly router = inject(Router);

  readonly tabs: { label: string; value: EventTab }[] = [
    { label: 'Upcoming', value: 'UPCOMING' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' }
  ];
  activeTab: EventTab = 'UPCOMING';
  registrations: RegisteredEvent[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.citizenData.getRegisteredEvents().subscribe({
      next: (registrations) => { this.registrations = registrations; this.isLoading = false; },
      error: () => this.isLoading = false
    });
  }

  get visibleEvents(): RegisteredEvent[] {
    return this.registrations.filter((registration) =>
      this.activeTab === 'UPCOMING'
        ? registration.status === 'REGISTERED'
        : registration.status === this.activeTab
    );
  }

  openEvent(id: number): void {
    void this.router.navigate(['/citizen/events', id]);
  }
}
