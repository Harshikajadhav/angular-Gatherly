import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CitizenDataService } from '../../../core/services/citizen-data.service';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-citizen-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ConfirmationDialogComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class CitizenSettingsComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly citizenData = inject(CitizenDataService);

  isAdmin = false;
  isOrganization = false;
  isUserOrganizer = false;
  accountEmail = 'aarav.sharma@example.com';
  emailNotifications = true;
  eventReminders = true;
  profileVisibility = false;
  statusMessage = '';
  organizerConfirmOpen = false;
  organizerApplicationOpen = false;
  organizerApplicationStatus = '';
  organizerConsent = false;
  organizerFiles: File[] = [];
  readonly organizerResponsibilities = [
    'Create and manage events hosted by the organizer.',
    'Provide accurate event titles, descriptions, dates, timings, and locations.',
    'Ensure event information is kept updated.',
    'Communicate relevant event information to participants.',
    'Review participant and volunteer information only for events hosted by the organizer and only as permitted by the platform.',
    'Follow Gatherly platform rules and event guidelines.',
    'Report cancellations or important changes to registered participants.',
    'Maintain appropriate conduct and ensure submitted event information is genuine.'
  ];
  passwordForm = this.formBuilder.nonNullable.group({
    current: ['', Validators.required],
    next: ['', [Validators.required, Validators.minLength(8)]],
    confirm: ['', Validators.required]
  });

  constructor() {
    this.isAdmin = this.route.snapshot.parent?.data['role'] === 'admin';
    this.isOrganization = this.route.snapshot.parent?.data['role'] === 'organization';
    this.isUserOrganizer = this.route.snapshot.parent?.data['role'] === 'user-organizer';
    this.accountEmail = this.isAdmin ? 'priya.menon@gatherly.org' : this.isOrganization ? 'hello@carebridge.org' : this.isUserOrganizer ? 'rohan.organizer@example.com' : this.accountEmail;
    this.organizerApplicationStatus = this.citizenData.getOrganizerApplication()?.status || '';
  }

  startOrganizerApplication(): void { this.organizerConfirmOpen = true; }
  proceedToOrganizerApplication(): void {
    this.organizerConfirmOpen = false;
    this.organizerApplicationOpen = true;
  }
  onOrganizerFilesSelected(event: Event): void {
    const files = Array.from((event.target as HTMLInputElement).files || []);
    this.organizerFiles = [...this.organizerFiles, ...files];
  }
  removeOrganizerFile(index: number): void { this.organizerFiles = this.organizerFiles.filter((_, fileIndex) => fileIndex !== index); }
  submitOrganizerApplication(): void {
    if (!this.organizerConsent) return;
    this.citizenData.submitOrganizerApplication(this.organizerFiles.map((file) => file.name), this.organizerConsent).subscribe({
      next: (application) => { this.organizerApplicationStatus = application.status; this.organizerApplicationOpen = false; this.statusMessage = 'Your organizer application was submitted for admin review.'; },
      error: (error: Error) => this.statusMessage = error.message
    });
  }

  savePreferences(): void {
    this.statusMessage = 'Your notification and privacy preferences are updated for this session.';
  }

  changePassword(): void {
    if (this.passwordForm.invalid || this.passwordForm.controls.next.value !== this.passwordForm.controls.confirm.value) {
      this.passwordForm.markAllAsTouched();
      this.statusMessage = 'Enter matching passwords with at least 8 characters.';
      return;
    }
    this.passwordForm.reset();
    this.statusMessage = 'Password change is ready for the connected account service.';
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
