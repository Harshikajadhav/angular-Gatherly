import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventDiscoveryService } from '../../../core/services/event-discovery.service';
import { GatherlyEvent } from '../../../core/models/event.model';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { GoToTopComponent } from '../../../shared/components/go-to-top/go-to-top.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { PUBLIC_ASSETS } from '../public-assets';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent, GoToTopComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  events: GatherlyEvent[] = [];
  readonly heroImage = PUBLIC_ASSETS.hero;
  readonly fallbackImage = PUBLIC_ASSETS.fallback;

  constructor(private readonly eventService: EventDiscoveryService) {}

  ngOnInit(): void {
    this.eventService.getEvents().subscribe({
      next: (events) => this.events = events.slice(0, 3),
      error: () => this.events = []
    });
  }

  useFallbackImage(event: Event): void {
    const image = event.target as HTMLImageElement;
    if (image.src.endsWith(this.fallbackImage)) return;
    image.src = this.fallbackImage;
  }
}
