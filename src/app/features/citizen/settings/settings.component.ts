import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-citizen-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class CitizenSettingsComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  isAdmin = false;
  isOrganization = false;
  isUserOrganizer = false;
  accountEmail = 'aarav.sharma@example.com';
  emailNotifications = true;
  eventReminders = true;
  profileVisibility = false;
  statusMessage = '';
  passwordForm = this.formBuilder.nonNullable.group({
    current: ['', Validators.required],
    next: ['', [Validators.required, Validators.minLength(8)]],
    confirm: ['', Validators.required]
  });

  constructor() {
    this.isAdmin = this.route.snapshot.parent?.data['role'] === 'admin';
    this.isOrganization = this.route.snapshot.parent?.data['role'] === 'organization';
    this.isUserOrganizer = this.route.snapshot.parent?.data['role'] === 'user-organizer';
    this.accountEmail = this.isAdmin ? 'priya.menon@gatherly.org' : this.isOrganization ? 'hello@carebridge.org' : this.isUserOrganizer ? 'rohan.organizer@example.com' : this.accountEmail;
  }

  savePreferences(): void {
    this.statusMessage = 'Your notification and privacy preferences are updated for this session.';
  }

  changePassword(): void {
    if (this.passwordForm.invalid || this.passwordForm.controls.next.value !== this.passwordForm.controls.confirm.value) {
      this.passwordForm.markAllAsTouched();
      this.statusMessage = 'Enter matching passwords with at least 8 characters.';
      return;
    }
    this.passwordForm.reset();
    this.statusMessage = 'Password change is ready for the connected account service.';
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
