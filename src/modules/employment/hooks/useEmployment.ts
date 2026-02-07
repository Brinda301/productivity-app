'use client';
import { useState, useEffect, useCallback } from 'react';
import type { JobApplication, JobApplicationFormData, JobStatus, ContactFormData, InterviewFormData } from '../types';

export function useEmployment(filters?: { status?: JobStatus }) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const params = new URLSearchParams();
    if (filters?.status) params.set('status', filters.status);

    try {
      const res = await fetch(`/api/employment/applications?${params}`);
      if (!res.ok) throw new Error('Failed to fetch applications');
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters?.status]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const createApplication = async (data: JobApplicationFormData) => {
    const res = await fetch('/api/employment/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create application');
    const newApp = await res.json();
    setApplications((prev) => [...prev, newApp]);
    return newApp;
  };

  const updateApplication = async (id: string, updates: Partial<JobApplication>) => {
    const res = await fetch(`/api/employment/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update application');
    const updated = await res.json();
    setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
    return updated;
  };

  const deleteApplication = async (id: string) => {
    const res = await fetch(`/api/employment/applications/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete application');
    setApplications((prev) => prev.filter((a) => a.id !== id));
  };

  const addContact = async (data: ContactFormData) => {
    const res = await fetch('/api/employment/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add contact');
    await fetchApplications();
    return res.json();
  };

  const addInterview = async (data: InterviewFormData) => {
    const res = await fetch('/api/employment/interviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add interview');
    await fetchApplications();
    return res.json();
  };

  return {
    applications,
    loading,
    error,
    createApplication,
    updateApplication,
    deleteApplication,
    addContact,
    addInterview,
    refetch: fetchApplications,
  };
}
