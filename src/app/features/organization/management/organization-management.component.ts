import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminOrganization } from '../../../core/models/admin.model';
import { GatherlyEvent } from '../../../core/models/event.model';
import { OrganizationRegistration } from '../../../core/models/organization-dashboard.model';
import { GatherlyService } from '../../../core/models/service.model';
import { OrganizationDataService } from '../../../core/services/organization-data.service';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

type OrganizationPageKind = 'organization' | 'services' | 'events' | 'participants';

@Component({
  selector: 'app-organization-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, ConfirmationDialogComponent],
  templateUrl: './organization-management.component.html',
  styleUrl: './organization-management.component.css'
})
export class OrganizationManagementComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly data = inject(OrganizationDataService);
  private readonly formBuilder = inject(FormBuilder);

  kind: OrganizationPageKind = 'organization';
  organization?: AdminOrganization;
  services: GatherlyService[] = [];
  events: GatherlyEvent[] = [];
  registrations: OrganizationRegistration[] = [];
  searchText = '';
  category = '';
  status = '';
  showServiceForm = false;
  serviceToDelete?: GatherlyService;
  message = '';
  readonly serviceForm = this.formBuilder.nonNullable.group({
    service_name: ['', Validators.required],
    description: ['', [Validators.required, Validators.maxLength(240)]],
    category: ['', Validators.required],
    location: ['', Validators.required]
  });

  ngOnInit(): void {
    this.kind = (this.route.snapshot.data['kind'] || 'organization') as OrganizationPageKind;
    this.data.getOrganization().subscribe((organization) => this.organization = organization);
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
  get categories(): string[] { return ['NGO and Support', 'Health Centers', 'Learning Centers', 'Community Events']; }
  saveOrganization(): void {
    if (!this.organization) return;
    this.data.updateOrganization(this.organization).subscribe((organization) => { this.organization = organization; this.message = 'Permitted organization details updated for this mock session.'; });
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
