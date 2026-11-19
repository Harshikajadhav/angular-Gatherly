import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { GatherlyEvent } from '../../../core/models/event.model';
import { EventDiscoveryService } from '../../../core/services/event-discovery.service';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { GoToTopComponent } from '../../../shared/components/go-to-top/go-to-top.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-public-events',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent, FooterComponent, GoToTopComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class PublicEventsComponent implements OnInit {
  events: GatherlyEvent[] = [];
  search = '';
  constructor(private readonly eventService: EventDiscoveryService) {}
  ngOnInit(): void {
    this.eventService.getEvents().subscribe({ next: (events) => this.events = events, error: () => this.events = [] });
  }
  get filteredEvents(): GatherlyEvent[] {
    const query = this.search.trim().toLowerCase();
    return this.events.filter((event) => !query || `${event.title} ${event.description} ${event.location}`.toLowerCase().includes(query));
  }
}
