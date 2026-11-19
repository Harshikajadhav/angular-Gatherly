import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RegisteredEvent, VolunteeredEvent, CitizenDataService } from '../../../core/services/citizen-data.service';

type EventTab = 'REGISTERED' | 'VOLUNTEERED';

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
    { label: 'Registered Events', value: 'REGISTERED' },
    { label: 'Volunteered Events', value: 'VOLUNTEERED' }
  ];
  activeTab: EventTab = 'REGISTERED';
  registrations: RegisteredEvent[] = [];
  volunteeredEvents: VolunteeredEvent[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.citizenData.getRegisteredEvents().subscribe({
      next: (registrations) => { this.registrations = registrations; this.isLoading = false; },
      error: () => this.isLoading = false
    });
    this.citizenData.getVolunteeredEvents().subscribe({
      next: (events) => this.volunteeredEvents = events,
      error: () => this.volunteeredEvents = []
    });
  }

  get visibleRegisteredEvents(): RegisteredEvent[] {
    return this.registrations;
  }

  get visibleVolunteeredEvents(): VolunteeredEvent[] {
    return this.volunteeredEvents;
  }

  openEvent(id: number): void {
    void this.router.navigate(['/citizen/events', id]);
  }

  exploreEvents(): void {
    void this.router.navigate(['/citizen/discover-events']);
  }
}
