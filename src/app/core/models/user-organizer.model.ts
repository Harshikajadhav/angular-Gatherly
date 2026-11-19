import { CitizenProfile } from './dashboard.model';
import { GatherlyEvent } from './event.model';
import { GatherlyService } from './service.model';
import { OrganizationRegistration } from './organization-dashboard.model';

export interface UserOrganizerProfile extends CitizenProfile {
  bio: string;
  interests: string;
}

export interface UserOrganizerDashboardData {
  profile: UserOrganizerProfile;
  services: GatherlyService[];
  events: GatherlyEvent[];
  registrations: OrganizationRegistration[];
}
