import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-organization-create-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class OrganizationCreateEventComponent {
  private readonly formBuilder = inject(FormBuilder);
  readonly categories = ['NGO and Support', 'Health Centers', 'Learning Centers', 'Community Events'];
  readonly eventForm = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    category: ['', Validators.required],
    date: ['', Validators.required],
    start_time: ['', Validators.required],
    end_time: ['', Validators.required],
    location: ['', Validators.required],
    registration_information: ['', Validators.maxLength(240)]
  });
  coverPreview = '/assets/images/services/community.svg';
  message = '';

  onCoverSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.coverPreview = String(reader.result);
    reader.readAsDataURL(file);
  }

  submit(): void {
    this.message = '';
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }
    this.message = 'The event is ready to be submitted through the connected organization API.';
  }
}
