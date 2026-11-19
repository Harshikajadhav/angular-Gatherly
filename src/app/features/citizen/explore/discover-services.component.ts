import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GatherlyService } from '../../../core/models/service.model';
import { ServiceDiscoveryService } from '../../../core/services/service-discovery.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { ServiceCardComponent } from '../../../shared/components/service-card/service-card.component';

interface Category {
  name: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-discover-services',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent, ServiceCardComponent],
  templateUrl: './discover-services.component.html',
  styleUrl: './discover-services.component.css'
})
export class DiscoverServicesComponent implements OnInit {
  private readonly discoveryService = inject(ServiceDiscoveryService);
  private readonly router = inject(Router);

  searchText = '';
  category = '';
  organizationType = '';
  location = '';
  verificationStatus = '';
  services: GatherlyService[] = [];
  isLoading = true;
  errorMessage = '';

  readonly categories: Category[] = [
    {
      name: 'NGO and Support',
      icon: 'ngo',
      description: 'Discover NGOs, social welfare initiatives, and support services.'
    },
    {
      name: 'Health Centers',
      icon: 'health',
      description: 'Find healthcare facilities, medical assistance, and wellness services.'
    },
    {
      name: 'Learning Centers',
      icon: 'learning',
      description: 'Explore educational institutions, learning opportunities, and skill development programs.'
    },
    {
      name: 'Community Events',
      icon: 'events',
      description: 'Discover local events, volunteering opportunities, and community activities.'
    }
  ];

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.discoveryService.getServices().subscribe({
      next: (services) => {
        this.services = services;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'We could not load services right now. Please try again.';
        this.isLoading = false;
      }
    });
  }

  get locations(): string[] {
    return [...new Set(this.services.map((service) => service.location))].sort();
  }

  get organizationTypes(): string[] {
    return [...new Set(this.services.map((service) => service.organization.organization_type))].sort();
  }

  get categoryCounts(): Record<string, number> {
    return this.categories.reduce<Record<string, number>>((counts, item) => {
      counts[item.name] = this.services.filter((service) => service.category === item.name).length;
      return counts;
    }, {});
  }

  get filteredServices(): GatherlyService[] {
    const query = this.searchText.trim().toLowerCase();
    return this.services.filter((service) => {
      const searchable = [
        service.service_name,
        service.description,
        service.category,
        service.location,
        service.organization.organization_name
      ].join(' ').toLowerCase();

      return (!query || searchable.includes(query))
        && (!this.category || service.category === this.category)
        && (!this.organizationType || service.organization.organization_type === this.organizationType)
        && (!this.location || service.location === this.location)
        && (!this.verificationStatus || service.organization.verification_status === this.verificationStatus);
    });
  }

  get activeFilterCount(): number {
    return [this.category, this.organizationType, this.location, this.verificationStatus]
      .filter(Boolean).length;
  }

  selectCategory(categoryName: string): void {
    this.category = this.category === categoryName ? '' : categoryName;
  }

  clearFilters(): void {
    this.searchText = '';
    this.category = '';
    this.organizationType = '';
    this.location = '';
    this.verificationStatus = '';
  }

  openDetails(service: GatherlyService): void {
    void this.router.navigate(['/discover-services', service.id]);
  }
}
