'use client';
import { useState } from 'react';
import { useTasks } from '@/modules/tasks/hooks/useTasks';
import Checklist from '@/modules/tasks/components/Checklist';
import TaskForm from '@/modules/tasks/components/TaskForm';
import KanbanBoard from '@/modules/tasks/components/KanbanBoard';
import CalendarView from '@/modules/tasks/components/CalendarView';
import Modal from '@/shared/components/Modal';
import type { Task, TaskFormData, TaskStatus } from '@/modules/tasks/types';

type ViewMode = 'list' | 'kanban' | 'calendar';

export default function TasksPage() {
  const { tasks, loading, createTask, updateTask, deleteTask, toggleComplete, refetch } = useTasks();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleCreateTask = async (data: TaskFormData) => {
    await createTask(data);
    setIsModalOpen(false);
  };

  const handleUpdateTask = async (data: TaskFormData) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
      setEditingTask(null);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
    }
  };

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    await updateTask(id, { 
      status, 
      completed: status === 'done',
      completedAt: status === 'done' ? new Date() : null,
    });
  };

  const handleCalendarSlotSelect = (slotInfo: { start: Date; end: Date }) => {
    setEditingTask({
      id: '',
      title: '',
      description: null,
      status: 'todo',
      priority: 'medium',
      dueDate: slotInfo.start,
      dueTime: null,
      category: null,
      tags: null,
      recurring: null,
      completed: false,
      completedAt: null,
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Task);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['list', 'kanban', 'calendar'] as ViewMode[]).map((mode) => (
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
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' && (
        <Checklist
          tasks={tasks.filter((t) => !t.parentId)}
          loading={loading}
          onToggle={toggleComplete}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      )}

      {viewMode === 'kanban' && (
        <KanbanBoard
          tasks={tasks.filter((t) => !t.parentId)}
          onUpdateStatus={handleStatusChange}
          onEdit={handleEditTask}
        />
      )}

      {viewMode === 'calendar' && (
        <CalendarView
          tasks={tasks}
          onSelectTask={handleEditTask}
          onSelectSlot={handleCalendarSlotSelect}
        />
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen && !editingTask}
        onClose={() => setIsModalOpen(false)}
        title="Create Task"
        size="lg"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title={editingTask?.id ? 'Edit Task' : 'Create Task'}
        size="lg"
      >
        <TaskForm
          initialData={editingTask ? {
            title: editingTask.title,
            description: editingTask.description || '',
            priority: editingTask.priority as any,
            category: editingTask.category as any,
            dueDate: editingTask.dueDate,
            dueTime: editingTask.dueTime || '',
            tags: editingTask.tags || '',
            recurring: editingTask.recurring as any,
          } : undefined}
          onSubmit={editingTask?.id ? handleUpdateTask : handleCreateTask}
          onCancel={() => setEditingTask(null)}
          submitLabel={editingTask?.id ? 'Save Changes' : 'Create Task'}
        />
      </Modal>
    </div>
  );
}
