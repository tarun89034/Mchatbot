import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  MessageCircle, 
  BarChart3, 
  Calendar, 
  BookOpen, 
  Settings,
  TrendingUp
} from 'lucide-react';

const navigation = [
  { name: 'Chat', href: '/chat', icon: MessageCircle },
  { name: 'Mood Tracker', href: '/mood', icon: Calendar },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Progress', href: '/progress', icon: TrendingUp },
  { name: 'Resources', href: '/resources', icon: BookOpen },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 h-full">
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;