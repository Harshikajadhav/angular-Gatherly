import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GatherlyEvent } from '../../../core/models/event.model';
import { EventDiscoveryService } from '../../../core/services/event-discovery.service';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { EventCardComponent } from '../../../shared/components/event-card/event-card.component';

interface CategoryDetails {
  name: string;
  description: string;
}

const CATEGORY_DETAILS: Record<string, CategoryDetails> = {
  'ngo-support': {
    name: 'NGO and Support',
    description: 'Explore events organized by NGOs and organizations working towards community welfare and social support.'
  },
  'health-centers': {
    name: 'Health Centers',
    description: 'Explore health, wellness and medical support events hosted by trusted community organizations.'
  },
  'learning-centers': {
    name: 'Learning Centers',
    description: 'Explore workshops, classes and learning opportunities for every stage of life.'
  },
  'community-events': {
    name: 'Community Events',
    description: 'Explore local gatherings, volunteering opportunities and activities that bring neighbors together.'
  }
};

@Component({
  selector: 'app-category-events',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent, EventCardComponent],
  templateUrl: './category-events.component.html',
  styleUrl: './category-events.component.css'
})
export class CategoryEventsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly eventService = inject(EventDiscoveryService);

  category?: CategoryDetails;
  events: GatherlyEvent[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.loadCategory(params.get('category') || '');
    });
  }

  loadCategory(slug: string): void {
    this.category = CATEGORY_DETAILS[slug];
    this.events = [];
    this.errorMessage = this.category ? '' : 'This event category is not available.';
    this.isLoading = Boolean(this.category);
    if (!this.category) return;

    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events = events.filter((event) => event.category === this.category?.name);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'We could not load events right now. Please try again.';
        this.isLoading = false;
      }
    });
  }

  openEvent(event: GatherlyEvent): void {
    void this.router.navigate(['/events', event.id]);
  }
}
