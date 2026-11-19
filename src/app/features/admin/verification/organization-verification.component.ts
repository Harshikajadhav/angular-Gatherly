import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminOrganization } from '../../../core/models/admin.model';
import { AdminDataService } from '../../../core/services/admin-data.service';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-admin-organization-verification',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ConfirmationDialogComponent],
  templateUrl: './organization-verification.component.html',
  styleUrl: './organization-verification.component.css'
})
export class OrganizationVerificationComponent implements OnInit {
  private readonly adminData = inject(AdminDataService);
  private readonly route = inject(ActivatedRoute);

  applications: AdminOrganization[] = [];
  selected?: AdminOrganization;
  dialogOpen = false;
  dialogAction: 'approve' | 'reject' = 'approve';
  rejectionReason = '';
  statusMessage = '';

  ngOnInit(): void {
    this.applications = this.adminData.getPendingOrganizations();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (Number.isInteger(id)) this.selected = this.applications.find((application) => application.id === id);
  }

  select(application: AdminOrganization): void {
    this.selected = application;
    this.statusMessage = '';
  }

  ask(action: 'approve' | 'reject'): void {
    this.dialogAction = action;
    this.dialogOpen = true;
  }

  confirm(): void {
    if (!this.selected) return;
    const organization = this.selected;
    this.adminData.updateOrganizationStatus(organization.id, this.dialogAction === 'approve' ? 'VERIFIED' : 'UNVERIFIED', this.rejectionReason || 'Verification requirements were not met.');
    this.applications = this.applications.filter((application) => application.id !== organization.id);
    this.selected = undefined;
    this.dialogOpen = false;
    this.rejectionReason = '';
    this.statusMessage = `The organization was ${this.dialogAction === 'approve' ? 'approved' : 'rejected'} in this mock admin session.`;
  }
}
