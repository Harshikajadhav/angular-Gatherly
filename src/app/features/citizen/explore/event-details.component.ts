import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GatherlyEvent } from '../../../core/models/event.model';
import { EventDiscoveryService } from '../../../core/services/event-discovery.service';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly eventService = inject(EventDiscoveryService);

  event?: GatherlyEvent;
  isLoading = true;
  errorMessage = '';
  confirmationMessage = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => this.loadEvent(Number(params.get('eventId'))));
  }

  loadEvent(id: number): void {
    this.event = undefined;
    this.confirmationMessage = '';
    if (!Number.isInteger(id)) {
      this.errorMessage = 'This event could not be found.';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.eventService.getEvent(id).subscribe({
      next: (event) => {
        this.event = event;
        this.errorMessage = event ? '' : 'This event could not be found.';
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'We could not load this event right now. Please try again.';
        this.isLoading = false;
      }
    });
  }

  register(): void {
    this.confirmationMessage = 'Your participation request has been recorded. The organization will contact you with next steps.';
  }

  volunteer(): void {
    this.confirmationMessage = 'Thank you for volunteering. The organization will contact you about this opportunity.';
  }

  get categoryRoute(): string {
    return this.event?.category.toLowerCase().replace(/ and /g, '-').replace(/\s+/g, '-') || 'discover-services';
  }
}
