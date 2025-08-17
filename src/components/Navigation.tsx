import React from 'react';
import { Home, Calendar, Star } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface NavigationProps {
  activeScreen: 'home' | 'schedule' | 'profile';
  onScreenChange: (screen: 'home' | 'schedule' | 'profile') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeScreen, onScreenChange }) => {
  const { isDark } = useTheme();
  
  const navItems = [
    {
      id: 'home' as const,
      label: 'Главная',
      icon: Home,
    },
    {
      id: 'schedule' as const,
      label: 'Расписание',
      icon: Calendar,
    },
    {
      id: 'profile' as const,
      label: 'Профиль',
      icon: Star,
    },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 backdrop-blur-md border-t z-50 md:relative md:bg-transparent md:border-0 md:backdrop-blur-none transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-900/95 border-gray-700' 
        : 'bg-white/95 border-gray-200'
    }`}>
      <div className="max-w-md mx-auto px-4 md:max-w-4xl md:px-8">
        <div className="flex justify-around py-2 md:justify-center md:space-x-8 md:py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onScreenChange(item.id)}
                className={`flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg transition-all duration-300 w-[100px] h-[60px] ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : isDark
                      ? 'text-gray-400 hover:text-orange-400 hover:bg-gray-800'
                      : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium text-center leading-tight max-w-full whitespace-pre-line">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;