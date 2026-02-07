'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardCardProps {
  title: string;
  href: string;
  children: React.ReactNode;
}

function DashboardCard({ title, href, children }: DashboardCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <Link
          href={href}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          View All →
        </Link>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

interface DashboardStats {
  tasks: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
  };
  diet: {
    todayCalories: number;
    goalCalories: number;
    todayProtein: number;
    goalProtein: number;
  };
  employment: {
    totalApplications: number;
    activeApplications: number;
    upcomingInterviews: number;
    contacts: number;
  };
  fitness: {
    workoutsThisWeek: number;
    weeklyGoal: number;
    activeGoals: number;
    completedGoals: number;
  };
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    tasks: { total: 0, completed: 0, pending: 0, overdue: 0 },
    diet: { todayCalories: 0, goalCalories: 2000, todayProtein: 0, goalProtein: 150 },
    employment: { totalApplications: 0, activeApplications: 0, upcomingInterviews: 0, contacts: 0 },
    fitness: { workoutsThisWeek: 0, weeklyGoal: 4, activeGoals: 0, completedGoals: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch tasks
        const tasksRes = await fetch('/api/tasks');
        const tasks = tasksRes.ok ? await tasksRes.json() : [];
        const now = new Date();
        const taskStats = {
          total: tasks.length,
          completed: tasks.filter((t: { status: string }) => t.status === 'done').length,
          pending: tasks.filter((t: { status: string }) => t.status !== 'done').length,
          overdue: tasks.filter((t: { dueDate: string; status: string }) => 
            t.dueDate && new Date(t.dueDate) < now && t.status !== 'done'
          ).length,
        };

        // Fetch diet summary
        const today = new Date().toISOString().split('T')[0];
        const dietSummaryRes = await fetch(`/api/diet/summary?startDate=${today}&endDate=${today}`);
        const dietSummary = dietSummaryRes.ok ? await dietSummaryRes.json() : [];
        const todayDiet = dietSummary[0] || { totalCalories: 0, totalProtein: 0 };
        
        const dietGoalsRes = await fetch('/api/diet/goals');
        const dietGoals = dietGoalsRes.ok ? await dietGoalsRes.json() : null;

        // Fetch employment
        const applicationsRes = await fetch('/api/employment/applications');
        const applications = applicationsRes.ok ? await applicationsRes.json() : [];
        
        const interviewsRes = await fetch('/api/employment/interviews');
        const interviews = interviewsRes.ok ? await interviewsRes.json() : [];
        const upcomingInterviews = interviews.filter((i: { scheduledAt: string }) => 
          new Date(i.scheduledAt) >= now
        );
        
        const contactsRes = await fetch('/api/employment/contacts');
        const contacts = contactsRes.ok ? await contactsRes.json() : [];

        // Fetch fitness
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        const workoutsRes = await fetch(`/api/fitness/workouts`);
        const workouts = workoutsRes.ok ? await workoutsRes.json() : [];
        const workoutsThisWeek = workouts.filter((w: { date: string }) => 
          new Date(w.date) >= weekStart
        ).length;
        
        const goalsRes = await fetch('/api/fitness/goals');
        const goals = goalsRes.ok ? await goalsRes.json() : [];
        const activeGoals = goals.filter((g: { status: string }) => g.status === 'active').length;
        const completedGoals = goals.filter((g: { status: string }) => g.status === 'completed').length;

        setStats({
          tasks: taskStats,
          diet: {
            todayCalories: Math.round(todayDiet.totalCalories || 0),
            goalCalories: dietGoals?.calories || 2000,
            todayProtein: Math.round(todayDiet.totalProtein || 0),
            goalProtein: dietGoals?.protein || 150,
          },
          employment: {
            totalApplications: applications.length,
            activeApplications: applications.filter((a: { status: string }) => 
              !['rejected', 'withdrawn', 'offer_accepted'].includes(a.status)
            ).length,
            upcomingInterviews: upcomingInterviews.length,
            contacts: contacts.length,
          },
          fitness: {
            workoutsThisWeek,
            weeklyGoal: 4,
            activeGoals,
            completedGoals,
          },
        });
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    { label: 'Add Task', href: '/tasks', icon: '✓' },
    { label: 'Log Meal', href: '/diet', icon: '🍽️' },
    { label: 'Add Application', href: '/employment', icon: '💼' },
    { label: 'Log Workout', href: '/fitness', icon: '💪' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-500">
            Welcome back! Here&apos;s your productivity overview.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
          >
            <span className="text-2xl">{action.icon}</span>
            <span className="font-medium text-gray-700">{action.label}</span>
          </Link>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tasks Widget */}
          <DashboardCard title="Tasks" href="/tasks">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{stats.tasks.pending}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{stats.tasks.completed}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-gray-600">{stats.tasks.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-3xl font-bold text-red-600">{stats.tasks.overdue}</div>
                <div className="text-sm text-gray-600">Overdue</div>
              </div>
            </div>
          </DashboardCard>

          {/* Diet Widget */}
          <DashboardCard title="Diet Today" href="/diet">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Calories</span>
                  <span>{stats.diet.todayCalories} / {stats.diet.goalCalories}</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (stats.diet.todayCalories / stats.diet.goalCalories) * 100)}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Protein</span>
                  <span>{stats.diet.todayProtein}g / {stats.diet.goalProtein}g</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (stats.diet.todayProtein / stats.diet.goalProtein) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </DashboardCard>

          {/* Employment Widget */}
          <DashboardCard title="Job Search" href="/employment">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">
                  {stats.employment.activeApplications}
                </div>
                <div className="text-sm text-gray-600">Active Applications</div>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <div className="text-3xl font-bold text-indigo-600">
                  {stats.employment.upcomingInterviews}
                </div>
                <div className="text-sm text-gray-600">Upcoming Interviews</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-gray-600">
                  {stats.employment.totalApplications}
                </div>
                <div className="text-sm text-gray-600">Total Applied</div>
              </div>
              <div className="text-center p-4 bg-teal-50 rounded-lg">
                <div className="text-3xl font-bold text-teal-600">
                  {stats.employment.contacts}
                </div>
                <div className="text-sm text-gray-600">Contacts</div>
              </div>
            </div>
          </DashboardCard>

          {/* Fitness Widget */}
          <DashboardCard title="Fitness" href="/fitness">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Workouts This Week</span>
                  <span>{stats.fitness.workoutsThisWeek} / {stats.fitness.weeklyGoal}</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (stats.fitness.workoutsThisWeek / stats.fitness.weeklyGoal) * 100)}%`,
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.fitness.activeGoals}
                  </div>
                  <div className="text-sm text-gray-600">Active Goals</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.fitness.completedGoals}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>
      )}
    </div>
  );
}
