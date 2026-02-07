'use client';
import { useState } from 'react';
import type { Task, TaskPriority, PRIORITY_COLORS, STATUS_COLORS } from '../types';

interface ChecklistProps {
  tasks: Task[];
  loading?: boolean;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

export default function Checklist({ tasks, loading, onToggle, onEdit, onDelete }: ChecklistProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No tasks yet</p>
        <p className="text-sm mt-1">Create your first task to get started</p>
      </div>
    );
  }

  const formatDueDate = (date: Date | null) => {
    if (!date) return null;
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`bg-white rounded-lg border transition-all ${
            task.completed ? 'border-gray-200 opacity-60' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="p-4 flex items-start gap-3">
            {/* Checkbox */}
            <button
              onClick={() => onToggle(task.id)}
              className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                task.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {task.completed && (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {task.title}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority as TaskPriority]}`}>
                  {task.priority}
                </span>
                {task.category && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                    {task.category}
                  </span>
                )}
              </div>
              
              {task.description && expandedId === task.id && (
                <p className="mt-2 text-sm text-gray-600">{task.description}</p>
              )}
              
              <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                {task.dueDate && (
                  <span className={new Date(task.dueDate) < new Date() && !task.completed ? 'text-red-500' : ''}>
                    📅 {formatDueDate(task.dueDate)}
                    {task.dueTime && ` at ${task.dueTime}`}
                  </span>
                )}
                {task.tags && (
                  <span>🏷️ {task.tags.split(',').slice(0, 2).join(', ')}</span>
                )}
                {task.subtasks && task.subtasks.length > 0 && (
                  <span>📋 {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {task.description && (
                <button
                  onClick={() => setExpandedId(expandedId === task.id ? null : task.id)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d={expandedId === task.id ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                  </svg>
                </button>
              )}
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(task.id)}
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
      ))}
    </div>
  );
}
