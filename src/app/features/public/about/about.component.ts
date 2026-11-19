import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { GoToTopComponent } from '../../../shared/components/go-to-top/go-to-top.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { PUBLIC_ASSETS } from '../public-assets';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, HeaderComponent, FooterComponent, GoToTopComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  readonly heroImage = PUBLIC_ASSETS.hero;
  readonly fallbackImage = PUBLIC_ASSETS.fallback;

  useFallbackImage(event: Event): void {
    const image = event.target as HTMLImageElement;
    if (image.src.endsWith(this.fallbackImage)) return;
    image.src = this.fallbackImage;
  }
}
