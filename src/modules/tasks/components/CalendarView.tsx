'use client';
import { useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import type { Task } from '../types';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onSelectSlot: (slotInfo: { start: Date; end: Date }) => void;
}

export default function CalendarView({ tasks, onSelectTask, onSelectSlot }: CalendarViewProps) {
  const events = useMemo(() => 
    tasks
      .filter((task) => task.dueDate)
      .map((task) => {
        const start = new Date(task.dueDate!);
        if (task.dueTime) {
          const [hours, minutes] = task.dueTime.split(':').map(Number);
          start.setHours(hours, minutes);
        }
        const end = new Date(start);
        end.setHours(end.getHours() + 1);
        
        return {
          id: task.id,
          title: task.title,
          start,
          end,
          resource: task,
        };
      }),
    [tasks]
  );

  const eventStyleGetter = (event: any) => {
    const task = event.resource as Task;
    let backgroundColor = '#3b82f6'; // blue
    
    if (task.completed) {
      backgroundColor = '#22c55e'; // green
    } else if (task.priority === 'urgent') {
      backgroundColor = '#ef4444'; // red
    } else if (task.priority === 'high') {
      backgroundColor = '#f97316'; // orange
    }
    
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: task.completed ? 0.6 : 1,
        color: 'white',
        border: 'none',
        display: 'block',
      },
    };
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4" style={{ height: 600 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        defaultView={Views.MONTH}
        selectable
        onSelectEvent={(event) => onSelectTask(event.resource)}
        onSelectSlot={onSelectSlot}
        eventPropGetter={eventStyleGetter}
        popup
      />
    </div>
  );
}
