import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GatherlyEvent } from '../../../core/models/event.model';
import { OrganizationRegistration } from '../../../core/models/organization-dashboard.model';
import { GatherlyService } from '../../../core/models/service.model';
import { UserOrganizerProfile } from '../../../core/models/user-organizer.model';
import { UserOrganizerDataService } from '../../../core/services/user-organizer-data.service';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

type OrganizerPageKind = 'organizer-profile' | 'services' | 'events' | 'participants';

@Component({
  selector: 'app-user-organizer-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, ConfirmationDialogComponent],
  templateUrl: './management.component.html',
  styleUrl: '../../organization/management/organization-management.component.css'
})
export class UserOrganizerManagementComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly data = inject(UserOrganizerDataService);
  private readonly formBuilder = inject(FormBuilder);
  kind: OrganizerPageKind = 'organizer-profile';
  profile?: UserOrganizerProfile;
  services: GatherlyService[] = [];
  events: GatherlyEvent[] = [];
  registrations: OrganizationRegistration[] = [];
  searchText = '';
  category = '';
  status = '';
  showServiceForm = false;
  serviceToDelete?: GatherlyService;
  message = '';
  readonly categories = ['NGO and Support', 'Health Centers', 'Learning Centers', 'Community Events'];
  readonly serviceForm = this.formBuilder.nonNullable.group({
    service_name: ['', Validators.required],
    description: ['', [Validators.required, Validators.maxLength(240)]],
    category: ['', Validators.required],
    location: ['', Validators.required]
  });

  ngOnInit(): void {
    this.kind = (this.route.snapshot.data['kind'] || 'organizer-profile') as OrganizerPageKind;
    this.data.getProfile().subscribe((profile) => this.profile = profile);
    if (this.kind === 'services') this.data.getServices().subscribe((services) => this.services = services);
    if (this.kind === 'events') this.data.getEvents().subscribe((events) => this.events = events);
    if (this.kind === 'participants') this.data.getRegistrations().subscribe((registrations) => this.registrations = registrations);
  }

  get filteredServices(): GatherlyService[] {
    return this.services.filter((service) => (!this.searchText || `${service.service_name} ${service.description}`.toLowerCase().includes(this.searchText.toLowerCase())) && (!this.category || service.category === this.category));
  }
  get filteredEvents(): GatherlyEvent[] {
    return this.events.filter((event) => (!this.searchText || `${event.title} ${event.description}`.toLowerCase().includes(this.searchText.toLowerCase())) && (!this.category || event.category === this.category));
  }
  get filteredRegistrations(): OrganizationRegistration[] {
    return this.registrations.filter((registration) => (!this.searchText || `${registration.citizen_name} ${registration.email_id}`.toLowerCase().includes(this.searchText.toLowerCase())) && (!this.status || registration.status === this.status));
  }
  saveProfile(): void {
    if (!this.profile) return;
    this.data.updateProfile(this.profile).subscribe((profile) => { this.profile = profile; this.message = 'Organizer profile changes are ready for the connected user API.'; });
  }
  submitService(): void {
    if (this.serviceForm.invalid) { this.serviceForm.markAllAsTouched(); return; }
    this.message = 'The service form is ready for the connected service API.';
    this.showServiceForm = false;
    this.serviceForm.reset();
  }
  askDelete(service: GatherlyService): void { this.serviceToDelete = service; }
  confirmDelete(): void {
    if (this.serviceToDelete) this.services = this.services.filter((service) => service.id !== this.serviceToDelete?.id);
    this.serviceToDelete = undefined;
    this.message = 'The service was removed from this mock view.';
  }
}
