'use client';
import type { Task, TaskStatus } from '../types';

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateStatus: (id: string, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
}

const columns: { status: TaskStatus; title: string; color: string }[] = [
  { status: 'todo', title: 'To Do', color: 'bg-gray-100' },
  { status: 'in_progress', title: 'In Progress', color: 'bg-yellow-100' },
  { status: 'done', title: 'Done', color: 'bg-green-100' },
];

export default function KanbanBoard({ tasks, onUpdateStatus, onEdit }: KanbanBoardProps) {
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    onUpdateStatus(taskId, status);
  };

  const getTasksByStatus = (status: TaskStatus) => 
    tasks.filter((task) => task.status === status);

  const priorityOrder: Record<string, number> = {
    urgent: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div
          key={column.status}
          className="flex-1 min-w-[280px]"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.status)}
        >
          <div className={`rounded-t-lg px-4 py-2 ${column.color}`}>
            <h3 className="font-semibold text-gray-800">
              {column.title}
              <span className="ml-2 text-sm font-normal text-gray-600">
                ({getTasksByStatus(column.status).length})
              </span>
            </h3>
          </div>
          
          <div className="bg-gray-50 rounded-b-lg p-2 min-h-[400px] space-y-2">
            {getTasksByStatus(column.status)
              .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
              .map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onClick={() => onEdit(task)}
                  className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
                >
                  <p className="font-medium text-gray-900 text-sm">{task.title}</p>
                  
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      task.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                      task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      task.priority === 'medium' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {task.priority}
                    </span>
                    
                    {task.category && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                        {task.category}
                      </span>
                    )}
                  </div>
                  
                  {task.dueDate && (
                    <p className="mt-2 text-xs text-gray-500">
                      📅 {new Date(task.dueDate).toLocaleDateString()}
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
