'use client';
import { useState } from 'react';
import { useEmployment } from '@/modules/employment/hooks/useEmployment';
import JobBoard from '@/modules/employment/components/JobBoard';
import ApplicationTracker from '@/modules/employment/components/ApplicationTracker';
import InterviewSchedule from '@/modules/employment/components/InterviewSchedule';
import Modal from '@/shared/components/Modal';
import type { JobApplication, JobStatus, JobApplicationFormData } from '@/modules/employment/types';

type ViewMode = 'grid' | 'kanban';

export default function EmploymentPage() {
  const { applications, loading, createApplication, updateApplication, deleteApplication, refetch } = useEmployment();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);

  const [formData, setFormData] = useState<JobApplicationFormData>({
    company: '',
    position: '',
    url: '',
    salary: '',
    location: '',
    remote: false,
    status: 'saved',
    notes: '',
  });

  const resetForm = () => {
    setFormData({
      company: '',
      position: '',
      url: '',
      salary: '',
      location: '',
      remote: false,
      status: 'saved',
      notes: '',
    });
  };

  const handleCreateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    await createApplication(formData);
    setIsModalOpen(false);
    resetForm();
  };

  const handleStatusChange = async (id: string, status: JobStatus) => {
    await updateApplication(id, { 
      status,
      appliedDate: status === 'applied' ? new Date() : undefined,
    });
  };

  const handleEditApp = (app: JobApplication) => {
    setEditingApp(app);
    setFormData({
      company: app.company,
      position: app.position,
      url: app.url || '',
      salary: app.salary || '',
      location: app.location || '',
      remote: app.remote,
      status: app.status as JobStatus,
      notes: app.notes || '',
    });
  };

  const handleUpdateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingApp) {
      await updateApplication(editingApp.id, formData);
      setEditingApp(null);
      resetForm();
    }
  };

  const handleDeleteApp = async (id: string) => {
    if (confirm('Are you sure you want to delete this application?')) {
      await deleteApplication(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Job Hunt</h1>
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['grid', 'kanban'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 text-sm rounded-md capitalize transition-colors ${
                  viewMode === mode
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>+</span>
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
          <p className="text-sm text-gray-500">Total</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {applications.filter((a) => a.status === 'applied').length}
          </p>
          <p className="text-sm text-gray-500">Applied</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {applications.filter((a) => ['phone_screen', 'interview'].includes(a.status)).length}
          </p>
          <p className="text-sm text-gray-500">In Progress</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {applications.filter((a) => a.status === 'offer').length}
          </p>
          <p className="text-sm text-gray-500">Offers</p>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {viewMode === 'grid' && (
            <JobBoard
              applications={applications}
              loading={loading}
              onEdit={handleEditApp}
              onDelete={handleDeleteApp}
              onStatusChange={handleStatusChange}
            />
          )}
          {viewMode === 'kanban' && (
            <ApplicationTracker
              applications={applications}
              onUpdateStatus={handleStatusChange}
              onEdit={handleEditApp}
            />
          )}
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Upcoming Interviews</h3>
          <InterviewSchedule />
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen || !!editingApp}
        onClose={() => { setIsModalOpen(false); setEditingApp(null); resetForm(); }}
        title={editingApp ? 'Edit Application' : 'Add Application'}
        size="lg"
      >
        <form onSubmit={editingApp ? handleUpdateApplication : handleCreateApplication} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job URL</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
              <input
                type="text"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="$80k - $120k"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="City, State"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.remote}
                onChange={(e) => setFormData({ ...formData, remote: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Remote</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => { setIsModalOpen(false); setEditingApp(null); resetForm(); }}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editingApp ? 'Save Changes' : 'Add Application'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
