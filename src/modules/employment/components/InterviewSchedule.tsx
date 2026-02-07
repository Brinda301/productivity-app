'use client';
import { useState, useEffect } from 'react';
import type { Interview } from '@prisma/client';

interface InterviewScheduleProps {
  applicationId?: string;
}

export default function InterviewSchedule({ applicationId }: InterviewScheduleProps) {
  const [interviews, setInterviews] = useState<(Interview & { jobApplication?: { company: string; position: string } })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      const params = new URLSearchParams();
      if (applicationId) params.set('applicationId', applicationId);
      
      // Get upcoming interviews
      params.set('from', new Date().toISOString());
      
      const res = await fetch(`/api/employment/interviews?${params}`);
      if (res.ok) {
        setInterviews(await res.json());
      }
      setLoading(false);
    };
    fetchInterviews();
  }, [applicationId]);

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded-lg"></div>;
  }

  if (interviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
        <p>No upcoming interviews</p>
      </div>
    );
  }

  const interviewTypeIcons: Record<string, string> = {
    phone: '📞',
    technical: '💻',
    behavioral: '🗣️',
    onsite: '🏢',
    final: '🎯',
  };

  return (
    <div className="space-y-3">
      {interviews.map((interview) => {
        const date = new Date(interview.scheduledAt);
        const isToday = date.toDateString() === new Date().toDateString();
        
        return (
          <div
            key={interview.id}
            className={`bg-white rounded-lg border p-4 ${isToday ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{interviewTypeIcons[interview.type] || '📅'}</span>
                  <span className="font-medium text-gray-900 capitalize">{interview.type} Interview</span>
                  {isToday && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Today</span>
                  )}
                </div>
                {interview.jobApplication && (
                  <p className="text-sm text-gray-600 mt-1">
                    {interview.jobApplication.company} - {interview.jobApplication.position}
                  </p>
                )}
              </div>
              <div className="text-right text-sm">
                <p className="font-medium text-gray-900">
                  {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>
                <p className="text-gray-500">
                  {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  {interview.duration && ` (${interview.duration} min)`}
                </p>
              </div>
            </div>
            {interview.location && (
              <p className="text-xs text-gray-500 mt-2">
                📍 {interview.location.startsWith('http') ? (
                  <a href={interview.location} className="text-blue-600 hover:underline">Join Meeting</a>
                ) : interview.location}
              </p>
            )}
            {interview.notes && (
              <p className="text-xs text-gray-500 mt-1">📝 {interview.notes}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
