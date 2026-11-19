import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GatherlyEvent } from '../../../core/models/event.model';
import { EventDiscoveryService } from '../../../core/services/event-discovery.service';
import { CitizenDataService } from '../../../core/services/citizen-data.service';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { GoToTopComponent } from '../../../shared/components/go-to-top/go-to-top.component';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent, FooterComponent, ConfirmationDialogComponent, GoToTopComponent],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly eventService = inject(EventDiscoveryService);
  private readonly citizenData = inject(CitizenDataService);

  event?: GatherlyEvent;
  isLoading = true;
  errorMessage = '';
  confirmationMessage = '';
  volunteerDialogOpen = false;
  registrationDialogOpen = false;
  isRegistered = false;
  isCompleted = false;
  reportDialogOpen = false;
  reportDescription = '';
  reportImage?: File;
  reportImagePreview = '';
  reportSubmitting = false;
  reportError = '';
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
        this.citizenData.getRegisteredEvents().subscribe((registrations) => {
          const registration = registrations.find((item) => item.event.id === id);
          this.isRegistered = !!registration;
          this.isCompleted = registration?.status === 'COMPLETED';
        });
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
    if (!this.isRegistered) this.registrationDialogOpen = true;
  }

  confirmRegistration(): void {
    if (!this.event) return;
    this.citizenData.registerForEvent(this.event.id).subscribe({
      next: () => { this.registrationDialogOpen = false; this.isRegistered = true; this.confirmationMessage = 'You are registered for this event.'; },
      error: (error: Error) => { this.registrationDialogOpen = false; this.confirmationMessage = error.message; }
    });
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

  openReport(): void {
    if (!this.isCompleted) return;
    this.reportError = '';
    this.reportDialogOpen = true;
  }

  onReportImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
      this.reportError = 'Please choose an image file smaller than 5 MB.';
      return;
    }
    this.reportError = '';
    this.reportImage = file;
    const reader = new FileReader();
    reader.onload = () => this.reportImagePreview = String(reader.result);
    reader.readAsDataURL(file);
  }

  removeReportImage(): void {
    this.reportImage = undefined;
    this.reportImagePreview = '';
  }

  submitReport(): void {
    if (!this.event || !this.reportDescription.trim() || this.reportSubmitting) {
      this.reportError = 'Please describe the issue before submitting.';
      return;
    }
    this.reportSubmitting = true;
    this.reportError = '';
    this.citizenData.submitIssueReport(this.event.id, this.reportDescription, this.reportImage?.name).subscribe({
      next: () => {
        this.reportSubmitting = false;
        this.reportDialogOpen = false;
        this.reportDescription = '';
        this.removeReportImage();
        this.confirmationMessage = 'Your issue report has been submitted successfully.';
      },
      error: (error: Error) => {
        this.reportSubmitting = false;
        this.reportError = error.message;
      }
    });
  }

  get categoryRoute(): string {
    return this.event?.category.toLowerCase().replace(/ and /g, '-').replace(/\s+/g, '-') || 'discover-services';
  }

  get portalPrefix(): string {
    return this.route.snapshot.data['portal'] === 'citizen' ? '/citizen' : '';
  }
}
