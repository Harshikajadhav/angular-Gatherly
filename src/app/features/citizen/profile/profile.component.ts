import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CitizenDataService } from '../../../core/services/citizen-data.service';
import { AdminDataService } from '../../../core/services/admin-data.service';

@Component({
  selector: 'app-citizen-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class CitizenProfileComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly citizenData = inject(CitizenDataService);
  private readonly adminData = inject(AdminDataService);
  private readonly route = inject(ActivatedRoute);

  readonly profileForm = this.formBuilder.nonNullable.group({
    first_name: ['', [Validators.required, Validators.maxLength(50)]],
    last_name: ['', [Validators.required, Validators.maxLength(50)]],
    email_id: ['', [Validators.required, Validators.email]],
    phone_number: ['', [Validators.required, Validators.pattern(/^[+0-9 ()-]{8,20}$/)]],
    address: ['', [Validators.required, Validators.maxLength(160)]],
    profile_pic: ['']
  });
  profilePreview = '/assets/images/logo/gatherly-mark.svg';
  isLoading = true;
  isSaving = false;
  statusMessage = '';
  isAdmin = false;
  isOrganization = false;

  ngOnInit(): void {
    this.isAdmin = this.route.snapshot.parent?.data['role'] === 'admin';
    this.isOrganization = this.route.snapshot.parent?.data['role'] === 'organization';
    const profileRequest = this.isAdmin || this.isOrganization ? this.adminData.getProfile() : this.citizenData.getProfile();
    profileRequest.subscribe((profile) => {
      this.profileForm.patchValue(profile);
      this.profilePreview = profile.profile_pic;
      this.isLoading = false;
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.profilePreview = String(reader.result);
      this.profileForm.controls.profile_pic.setValue(this.profilePreview);
    };
    reader.readAsDataURL(file);
  }

  save(): void {
    this.statusMessage = '';
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.isSaving = true;
    const updateRequest = this.isAdmin || this.isOrganization
      ? this.adminData.updateProfile(this.profileForm.getRawValue())
      : this.citizenData.updateProfile(this.profileForm.getRawValue());
    updateRequest.subscribe((profile) => {
      this.profilePreview = profile.profile_pic;
      this.statusMessage = 'Your profile changes are ready for the connected account service.';
      this.isSaving = false;
    });
  }

  cancel(): void {
    const profileRequest = this.isAdmin || this.isOrganization ? this.adminData.getProfile() : this.citizenData.getProfile();
    profileRequest.subscribe((profile) => {
      this.profileForm.reset(profile);
      this.profilePreview = profile.profile_pic;
      this.statusMessage = '';
    });
  }
}
