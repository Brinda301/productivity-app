'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const modules = [
  { name: 'Dashboard', path: '/', icon: '📊' },
  { name: 'Diet', path: '/diet', icon: '🥗' },
  { name: 'Job Hunt', path: '/employment', icon: '💼' },
  { name: 'Fitness', path: '/fitness', icon: '💪' },
  { name: 'Tasks', path: '/tasks', icon: '✅' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
      <h1 className="text-xl font-bold mb-8 px-2">🚀 Productivity</h1>
      <nav className="space-y-1 flex-1">
        {modules.map((mod) => (
          <Link
            key={mod.path}
            href={mod.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
              ${pathname === mod.path
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <span className="text-lg">{mod.icon}</span>
            <span>{mod.name}</span>
          </Link>
        ))}
      </nav>
      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-400 px-2">Local-first productivity</p>
      </div>
    </aside>
  );
}
