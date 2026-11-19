import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

interface Category {
  name: string;
  slug: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-discover-services',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './discover-services.component.html',
  styleUrl: './discover-services.component.css'
})
export class DiscoverServicesComponent {
  constructor(private readonly router: Router) {}

  searchText = '';

  readonly categories: Category[] = [
    {
      name: 'NGO and Support',
      slug: 'ngo-support',
      icon: 'ngo',
      description: 'Discover NGOs, social welfare initiatives, and support services.'
    },
    {
      name: 'Health Centers',
      slug: 'health-centers',
      icon: 'health',
      description: 'Find healthcare facilities, medical assistance, and wellness services.'
    },
    {
      name: 'Learning Centers',
      slug: 'learning-centers',
      icon: 'learning',
      description: 'Explore educational institutions, learning opportunities, and skill development programs.'
    },
    {
      name: 'Community Events',
      slug: 'community-events',
      icon: 'events',
      description: 'Discover local events, volunteering opportunities, and community activities.'
    }
  ];

  openCategory(category: Category): void {
    void this.router.navigate(['/discover-services', category.slug]);
  }
}
