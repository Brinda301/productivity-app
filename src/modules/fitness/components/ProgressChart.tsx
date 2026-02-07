'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import type { ProgressData } from '../types';

interface ProgressChartProps {
  progress: ProgressData | null;
}

export default function ProgressChart({ progress }: ProgressChartProps) {
  if (!progress || progress.workouts.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-500">
        <p>No workout data to display</p>
        <p className="text-sm mt-1">Log workouts to see your progress</p>
      </div>
    );
  }

  const volumeData = progress.workouts.map((w) => ({
    date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    volume: w.totalVolume,
    duration: w.duration || 0,
  }));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">30-Day Progress</h3>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{progress.totalWorkouts}</p>
          <p className="text-xs text-gray-600">Workouts</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{progress.averageDuration}</p>
          <p className="text-xs text-gray-600">Avg Duration (min)</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-2xl font-bold text-purple-600">
            {Object.keys(progress.personalRecords).length}
          </p>
          <p className="text-xs text-gray-600">PRs Set</p>
        </div>
      </div>

      {/* Volume chart */}
      <div style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={volumeData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip
              formatter={(value, name) => [
                name === 'volume' ? `${Number(value).toLocaleString()} kg` : `${value} min`,
                name === 'volume' ? 'Volume' : 'Duration',
              ]}
            />
            <Bar dataKey="volume" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Personal Records */}
      {Object.keys(progress.personalRecords).length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Personal Records 🏆</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(progress.personalRecords).slice(0, 4).map(([exercise, pr]) => (
              <div key={exercise} className="text-xs bg-yellow-50 p-2 rounded">
                <p className="font-medium text-gray-900">{exercise}</p>
                <p className="text-gray-600">
                  {pr.weight}kg × {pr.reps} reps
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
