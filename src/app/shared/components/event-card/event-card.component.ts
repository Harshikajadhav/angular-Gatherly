import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventEmitter, Input, Output } from '@angular/core';
import { GatherlyEvent } from '../../../core/models/event.model';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css'
})
export class EventCardComponent {
  @Input({ required: true }) event!: GatherlyEvent;
  @Output() details = new EventEmitter<GatherlyEvent>();

  openDetails(): void {
    this.details.emit(this.event);
  }
}
