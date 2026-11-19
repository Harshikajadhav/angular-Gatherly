import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GatherlyEvent } from '../../../core/models/event.model';
import { EventDiscoveryService } from '../../../core/services/event-discovery.service';
import { EventCardComponent } from '../../../shared/components/event-card/event-card.component';

@Component({
  selector: 'app-citizen-discover-events',
  standalone: true,
  imports: [CommonModule, FormsModule, EventCardComponent],
  templateUrl: './discover-events.component.html',
  styleUrl: './discover-events.component.css'
})
export class CitizenDiscoverEventsComponent implements OnInit {
  private readonly eventService = inject(EventDiscoveryService);
  private readonly router = inject(Router);

  events: GatherlyEvent[] = [];
  searchText = '';
  location = '';
  category = '';
  date = '';
  sort = 'date';
  isLoading = true;

  ngOnInit(): void {
    this.eventService.getEvents().subscribe({
      next: (events) => { this.events = events; this.isLoading = false; },
      error: () => this.isLoading = false
    });
  }

  get categories(): string[] {
    return [...new Set(this.events.map((event) => event.category))].sort();
  }

  get locations(): string[] {
    return [...new Set(this.events.map((event) => event.location))].sort();
  }

  get filteredEvents(): GatherlyEvent[] {
    const query = this.searchText.trim().toLowerCase();
    return this.events
      .filter((event) => (!query || `${event.title} ${event.description} ${event.organization.organization_name}`.toLowerCase().includes(query))
        && (!this.location || event.location === this.location)
        && (!this.category || event.category === this.category)
        && (!this.date || event.date === this.date))
      .sort((a, b) => this.sort === 'name'
        ? a.title.localeCompare(b.title)
        : a.date.localeCompare(b.date));
  }

  openEvent(event: GatherlyEvent): void {
    void this.router.navigate(['/citizen/events', event.id]);
  }
}
