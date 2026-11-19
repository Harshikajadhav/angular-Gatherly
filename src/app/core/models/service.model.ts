export type VerificationStatus = 'VERIFIED' | 'PENDING' | 'UNVERIFIED';

export interface OrganizationSummary {
  id: number;
  organization_name: string;
  organization_address: string;
  website_url?: string;
  profile_pic?: string;
  email_id?: string;
  phone_no?: string;
  verification_status: VerificationStatus;
  verified_by_admin?: string;
  verification_date?: string;
  description?: string;
  organization_type: string;
}

export interface GatherlyService {
  id: number;
  service_name: string;
  description: string;
  full_description: string;
  category: string;
  location: string;
  image_url?: string;
  supporting_information?: string[];
  organization: OrganizationSummary;
}
