import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-go-to-top',
  standalone: true,
  imports: [CommonModule],
  template: '<button *ngIf="visible" type="button" class="go-to-top" aria-label="Go to top" title="Go to top" (click)="goToTop()">↑</button>',
  styleUrl: './go-to-top.component.css'
})
export class GoToTopComponent {
  visible = false;

  @HostListener('window:scroll')
  onScroll(): void {
    this.visible = window.scrollY > 260;
  }

  goToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
