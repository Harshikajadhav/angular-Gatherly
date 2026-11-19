import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { CitizenDataService } from '../../../core/services/citizen-data.service';
import { EventDiscoveryService } from '../../../core/services/event-discovery.service';
import { GatherlyEvent } from '../../../core/models/event.model';
import { DashboardStatCardComponent } from '../../../shared/components/dashboard-stat-card/dashboard-stat-card.component';
import { EventCardComponent } from '../../../shared/components/event-card/event-card.component';

@Component({
  selector: 'app-citizen-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DashboardStatCardComponent, EventCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class CitizenDashboardComponent implements OnInit {
  private readonly citizenData = inject(CitizenDataService);
  private readonly eventService = inject(EventDiscoveryService);
  private readonly router = inject(Router);

  citizenName = 'Aarav';
  upcomingEvents: GatherlyEvent[] = [];
  recommendedEvents: GatherlyEvent[] = [];
  recentlyAddedEvents: GatherlyEvent[] = [];
  registeredCount = 0;
  completedCount = 0;
  isLoading = true;

  ngOnInit(): void {
    this.citizenData.getProfile().subscribe((profile) => {
      this.citizenName = profile.first_name;
    });
    this.citizenData.getRegisteredEvents().subscribe((registrations) => {
      this.registeredCount = registrations.length;
      this.completedCount = registrations.filter((item) => item.status === 'COMPLETED').length;
      this.upcomingEvents = registrations
        .filter((item) => item.status === 'REGISTERED')
        .map((item) => item.event);
    });
    this.eventService.getEvents().subscribe({
      next: (events) => {
        const registeredIds = new Set([101, 202, 301]);
        this.recommendedEvents = events.filter((event) => !registeredIds.has(event.id)).slice(0, 3);
        this.recentlyAddedEvents = events.slice(-3).reverse();
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  openEvent(event: GatherlyEvent): void {
    void this.router.navigate(['/citizen/events', event.id]);
  }
}
