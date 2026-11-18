import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, CitizenRegistrationRequest } from '../../../core/services/auth.service';

@Component({
  selector: 'app-citizen-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './citizen-registration.component.html',
  styleUrl: './citizen-registration.component.css'
})
export class CitizenRegistrationComponent {
  registrationForm: FormGroup;
  isPasswordVisible = false;
  isLoading = false;
  profilePreview = '';
  profileFileName = '';
  statusMessage = '';
  statusType: 'success' | 'error' | '' = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService
  ) {
    this.registrationForm = this.formBuilder.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email_id: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern(/^(?:\+91[\s-]?)?[6-9]\d{9}$/)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
      ]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      profile_pic: [null, Validators.required]
    });
  }

  get f() {
    return this.registrationForm.controls;
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onProfileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.statusMessage = '';
    this.statusType = '';

    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      this.profilePreview = '';
      this.profileFileName = '';
      this.registrationForm.patchValue({ profile_pic: null });
      this.statusType = 'error';
      this.statusMessage = 'Profile picture must be a JPG, JPEG or PNG image.';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.profilePreview = '';
      this.profileFileName = '';
      this.registrationForm.patchValue({ profile_pic: null });
      this.statusType = 'error';
      this.statusMessage = 'Profile picture must be smaller than 5 MB.';
      return;
    }

    this.profileFileName = file.name;
    this.registrationForm.patchValue({ profile_pic: file });
    const reader = new FileReader();
    reader.onload = () => this.profilePreview = String(reader.result);
    reader.readAsDataURL(file);
  }

  removeProfile(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.profilePreview = '';
    this.profileFileName = '';
    this.registrationForm.patchValue({ profile_pic: null });
  }

  submit(): void {
    this.statusMessage = '';
    this.statusType = '';

    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValue = this.registrationForm.getRawValue();
    const request: CitizenRegistrationRequest = {
      ...formValue,
      role: 'CITIZEN'
    };

    this.authService.registerCitizen(request).subscribe({
      next: (response) => {
        this.statusType = 'success';
        this.statusMessage = response.message;
        this.isLoading = false;
      },
      error: (error: Error) => {
        this.statusType = 'error';
        this.statusMessage = error.message;
        this.isLoading = false;
      }
    });
  }
}
