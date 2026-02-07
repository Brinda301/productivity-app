'use client';
import type { JobApplication, JobStatus } from '../types';

interface ApplicationTrackerProps {
  applications: JobApplication[];
  onUpdateStatus: (id: string, status: JobStatus) => void;
  onEdit: (app: JobApplication) => void;
}

const columns: { status: JobStatus; title: string; color: string }[] = [
  { status: 'saved', title: 'Saved', color: 'bg-gray-100' },
  { status: 'applied', title: 'Applied', color: 'bg-blue-100' },
  { status: 'phone_screen', title: 'Phone Screen', color: 'bg-purple-100' },
  { status: 'interview', title: 'Interview', color: 'bg-yellow-100' },
  { status: 'offer', title: 'Offer', color: 'bg-green-100' },
];

export default function ApplicationTracker({ applications, onUpdateStatus, onEdit }: ApplicationTrackerProps) {
  const handleDragStart = (e: React.DragEvent, appId: string) => {
    e.dataTransfer.setData('appId', appId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: JobStatus) => {
    e.preventDefault();
    const appId = e.dataTransfer.getData('appId');
    onUpdateStatus(appId, status);
  };

  const getAppsByStatus = (status: JobStatus) =>
    applications.filter((app) => app.status === status);

  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div
          key={column.status}
          className="flex-1 min-w-[200px]"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.status)}
        >
          <div className={`rounded-t-lg px-3 py-2 ${column.color}`}>
            <h3 className="text-sm font-semibold text-gray-800">
              {column.title}
              <span className="ml-2 font-normal text-gray-600">
                ({getAppsByStatus(column.status).length})
              </span>
            </h3>
          </div>

          <div className="bg-gray-50 rounded-b-lg p-2 min-h-[300px] space-y-2">
            {getAppsByStatus(column.status).map((app) => (
              <div
                key={app.id}
                draggable
                onDragStart={(e) => handleDragStart(e, app.id)}
                onClick={() => onEdit(app)}
                className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
              >
                <p className="font-medium text-gray-900 text-sm">{app.company}</p>
                <p className="text-xs text-gray-600 mt-0.5">{app.position}</p>
                {app.interviews.length > 0 && (
                  <p className="text-xs text-blue-600 mt-1">
                    📞 {app.interviews.length} interview{app.interviews.length > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
