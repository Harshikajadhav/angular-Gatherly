export interface DashboardNavItem {
  label: string;
  route: string;
  icon: string;
}

export interface CitizenProfile {
  first_name: string;
  last_name: string;
  email_id: string;
  phone_number: string;
  address: string;
  profile_pic: string;
}

export type RegistrationStatus = 'REGISTERED' | 'COMPLETED' | 'CANCELLED';
