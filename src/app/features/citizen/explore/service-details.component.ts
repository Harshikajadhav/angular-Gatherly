import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GatherlyService } from '../../../core/models/service.model';
import { ServiceDiscoveryService } from '../../../core/services/service-discovery.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './service-details.component.html',
  styleUrl: './service-details.component.css'
})
export class ServiceDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly discoveryService = inject(ServiceDiscoveryService);

  service?: GatherlyService;
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadService();
  }

  loadService(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(id)) {
      this.errorMessage = 'This service could not be found.';
      this.isLoading = false;
      return;
    }

    this.discoveryService.getService(id).subscribe({
      next: (service) => {
        this.service = service;
        if (!service) this.errorMessage = 'This service could not be found.';
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'We could not load this service right now.';
        this.isLoading = false;
      }
    });
  }
}
