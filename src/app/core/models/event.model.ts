import { OrganizationSummary } from './service.model';

export interface GatherlyEvent {
  id: number;
  title: string;
  description: string;
  full_description: string;
  category: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  image_url?: string;
  organization: OrganizationSummary;
}
