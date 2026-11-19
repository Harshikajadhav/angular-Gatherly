import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrganizationSummary } from '../../../core/models/service.model';
import { EventDiscoveryService } from '../../../core/services/event-discovery.service';
import { GoToTopComponent } from '../../../shared/components/go-to-top/go-to-top.component';

@Component({
  selector: 'app-organization-details',
  standalone: true,
  imports: [CommonModule, RouterLink, GoToTopComponent],
  templateUrl: './organization-details.component.html',
  styleUrl: './organization-details.component.css'
})
export class OrganizationDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly eventService = inject(EventDiscoveryService);
  organization?: OrganizationSummary;
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('organizationId'));
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.organization = events.find((event) => event.organization.id === id)?.organization;
        this.errorMessage = this.organization ? '' : 'This organization could not be found.';
        this.isLoading = false;
      },
      error: () => { this.errorMessage = 'We could not load this organization right now.'; this.isLoading = false; }
    });
  }
}
