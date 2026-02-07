import type { JobApplication as PrismaJobApplication, Contact, Interview } from '@prisma/client';

export type JobApplication = PrismaJobApplication & {
  contacts: Contact[];
  interviews: Interview[];
};

export type JobStatus = 'saved' | 'applied' | 'phone_screen' | 'interview' | 'offer' | 'rejected' | 'withdrawn';

export interface JobApplicationFormData {
  company: string;
  position: string;
  url?: string;
  salary?: string;
  location?: string;
  remote?: boolean;
  status?: JobStatus;
  appliedDate?: Date;
  notes?: string;
  resumeUsed?: string;
  coverLetter?: string;
}

export interface ContactFormData {
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  company?: string;
  notes?: string;
  jobApplicationId?: string;
}

export interface InterviewFormData {
  type: string;
  scheduledAt: Date;
  duration?: number;
  location?: string;
  notes?: string;
  jobApplicationId: string;
}

export const STATUS_CONFIG: Record<JobStatus, { label: string; color: string; bgColor: string }> = {
  saved: { label: 'Saved', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  applied: { label: 'Applied', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  phone_screen: { label: 'Phone Screen', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  interview: { label: 'Interview', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  offer: { label: 'Offer', color: 'text-green-700', bgColor: 'bg-green-100' },
  rejected: { label: 'Rejected', color: 'text-red-700', bgColor: 'bg-red-100' },
  withdrawn: { label: 'Withdrawn', color: 'text-gray-500', bgColor: 'bg-gray-50' },
};

export const INTERVIEW_TYPES = ['phone', 'technical', 'behavioral', 'onsite', 'final'] as const;
