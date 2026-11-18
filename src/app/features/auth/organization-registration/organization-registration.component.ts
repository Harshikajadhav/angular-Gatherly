import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-organization-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './organization-registration.component.html',
  styleUrl: './organization-registration.component.css'
})
export class OrganizationRegistrationComponent {
  readonly today = new Date().toISOString().split('T')[0];
  registrationForm: FormGroup;
  profilePreview = '';
  profileFileName = '';
  supportingDocuments: File[] = [];
  isDragging = false;
  isSubmitting = false;
  submitted = false;

  constructor(private readonly formBuilder: FormBuilder) {
    this.registrationForm = this.formBuilder.group({
      organization_name: ['', [Validators.required, Validators.minLength(2)]],
      registration_number: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9][A-Za-z0-9\-\/]{4,29}$/)]],
      start_date: ['', [Validators.required, this.notFutureDateValidator]],
      organization_address: ['', [Validators.required, Validators.minLength(10)]],
      website_url: ['', this.optionalUrlValidator],
      email_id: ['', [Validators.required, Validators.email]],
      phone_no: ['', [Validators.required, Validators.pattern(/^(?:\+91[\s-]?)?[6-9]\d{9}$/)]],
      profile_pic: [null],
      supporting_documents: [null, Validators.required]
    });
  }

  get f() {
    return this.registrationForm.controls;
  }

  optionalUrlValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.trim();
    if (!value) return null;
    try {
      const url = new URL(value);
      return ['http:', 'https:'].includes(url.protocol) ? null : { invalidUrl: true };
    } catch {
      return { invalidUrl: true };
    }
  }

  notFutureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const selected = new Date(`${control.value}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected > today ? { futureDate: true } : null;
  }

  onProfileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      this.profileFileName = '';
      this.registrationForm.patchValue({ profile_pic: null });
      return;
    }
    this.profileFileName = file.name;
    this.registrationForm.patchValue({ profile_pic: file });
    const reader = new FileReader();
    reader.onload = () => this.profilePreview = String(reader.result);
    reader.readAsDataURL(file);
  }

  removeProfilePicture(): void {
    this.profilePreview = '';
    this.profileFileName = '';
    this.registrationForm.patchValue({ profile_pic: null });
  }

  onDocumentSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) this.addDocuments(Array.from(input.files));
    input.value = '';
  }

  onDocumentDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDocumentDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files) this.addDocuments(Array.from(event.dataTransfer.files));
  }

  addDocuments(files: File[]): void {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const validFiles = files.filter(file =>
      allowedTypes.includes(file.type) && file.size <= 10 * 1024 * 1024
    );
    this.supportingDocuments = [...this.supportingDocuments, ...validFiles];
    this.registrationForm.patchValue({ supporting_documents: this.supportingDocuments.length ? this.supportingDocuments : null });
  }

  removeDocument(index: number): void {
    this.supportingDocuments.splice(index, 1);
    this.registrationForm.patchValue({ supporting_documents: this.supportingDocuments.length ? this.supportingDocuments : null });
  }

  formatFileSize(bytes: number): string {
    return bytes < 1024 * 1024 ? `${Math.ceil(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  resetForm(): void {
    this.registrationForm.reset();
    this.profilePreview = '';
    this.profileFileName = '';
    this.supportingDocuments = [];
  }

  submit(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    window.setTimeout(() => {
      this.isSubmitting = false;
      this.submitted = true;
    }, 900);
  }

  submitAnother(): void {
    this.submitted = false;
    this.resetForm();
  }
}
