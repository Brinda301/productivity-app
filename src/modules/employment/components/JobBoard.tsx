'use client';
import type { JobApplication, JobStatus, STATUS_CONFIG } from '../types';

interface JobBoardProps {
  applications: JobApplication[];
  loading?: boolean;
  onEdit: (app: JobApplication) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: JobStatus) => void;
}

const statusConfig: Record<JobStatus, { label: string; color: string; bgColor: string }> = {
  saved: { label: 'Saved', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  applied: { label: 'Applied', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  phone_screen: { label: 'Phone Screen', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  interview: { label: 'Interview', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  offer: { label: 'Offer', color: 'text-green-700', bgColor: 'bg-green-100' },
  rejected: { label: 'Rejected', color: 'text-red-700', bgColor: 'bg-red-100' },
  withdrawn: { label: 'Withdrawn', color: 'text-gray-500', bgColor: 'bg-gray-50' },
};

export default function JobBoard({ applications, loading, onEdit, onDelete, onStatusChange }: JobBoardProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-4 animate-pulse border border-gray-200">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-4xl mb-2">💼</p>
        <p className="text-lg">No job applications yet</p>
        <p className="text-sm mt-1">Start tracking your job hunt</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {applications.map((app) => {
        const config = statusConfig[app.status as JobStatus];
        const upcomingInterview = app.interviews.find(
          (i) => new Date(i.scheduledAt) > new Date()
        );

        return (
          <div
            key={app.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-900">{app.company}</h3>
                <p className="text-sm text-gray-600">{app.position}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${config.bgColor} ${config.color}`}>
                {config.label}
              </span>
            </div>

            {/* Details */}
            <div className="text-xs text-gray-500 space-y-1 mb-3">
              {app.location && (
                <p>📍 {app.location} {app.remote && '(Remote)'}</p>
              )}
              {app.salary && <p>💰 {app.salary}</p>}
              {app.appliedDate && (
                <p>📅 Applied {new Date(app.appliedDate).toLocaleDateString()}</p>
              )}
              {upcomingInterview && (
                <p className="text-blue-600">
                  🗓️ Interview: {new Date(upcomingInterview.scheduledAt).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
              <span>👥 {app.contacts.length} contacts</span>
              <span>📞 {app.interviews.length} interviews</span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <select
                value={app.status}
                onChange={(e) => onStatusChange(app.id, e.target.value as JobStatus)}
                className="text-xs border border-gray-300 rounded px-2 py-1"
              >
                {Object.entries(statusConfig).map(([status, { label }]) => (
                  <option key={status} value={status}>{label}</option>
                ))}
              </select>
              
              <div className="flex items-center gap-1">
                {app.url && (
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
                <button
                  onClick={() => onEdit(app)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(app.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
