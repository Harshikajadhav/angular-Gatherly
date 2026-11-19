import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GatherlyEvent } from '../../../core/models/event.model';
import { EventDiscoveryService } from '../../../core/services/event-discovery.service';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent, ConfirmationDialogComponent],
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
  volunteerDialogOpen = false;
  isCitizenPortal = false;

  ngOnInit(): void {
    this.isCitizenPortal = this.route.snapshot.data['portal'] === 'citizen';
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
    this.volunteerDialogOpen = true;
  }

  confirmVolunteer(): void {
    this.volunteerDialogOpen = false;
    this.confirmationMessage = `Thank you for volunteering. Contact ${this.event?.organization.organization_name || 'the organization'} at ${this.event?.organization.email_id || this.event?.organization.phone_no || 'their listed contact'} to coordinate.`;
  }

  cancelVolunteer(): void {
    this.volunteerDialogOpen = false;
  }

  get categoryRoute(): string {
    return this.event?.category.toLowerCase().replace(/ and /g, '-').replace(/\s+/g, '-') || 'discover-services';
  }

  get portalPrefix(): string {
    return this.route.snapshot.data['portal'] === 'citizen' ? '/citizen' : '';
  }
}
