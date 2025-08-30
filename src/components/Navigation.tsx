import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Home, BookOpen, Calendar, User } from 'lucide-react';

interface NavigationProps {
  activeScreen: 'home' | 'courses' | 'schedule' | 'profile' | 'email-confirmation' | 'password-reset';
  onScreenChange: (screen: 'home' | 'courses' | 'schedule' | 'profile' | 'email-confirmation' | 'password-reset') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeScreen, onScreenChange }) => {
  const { isDark } = useTheme();

  const navItems = [
    {
      id: 'home',
      label: 'Главная',
      icon: Home,
      description: 'О нас'
    },
    {
      id: 'courses',
      label: 'Услуги',
      icon: BookOpen,
      description: 'Консультации'
    },
    {
      id: 'schedule',
      label: 'Расписание',
      icon: Calendar,
      description: 'Сессии'
    },
    {
      id: 'profile',
      label: 'Профиль',
      icon: User,
      description: 'Аккаунт'
    }
  ] as const;

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 transition-colors duration-300 ${
      isDark ? 'bg-psyhologovo-dark-900/90 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md'
    } border-t ${isDark ? 'border-psyhologovo-dark-700' : 'border-gray-200'}`}>
      <div className="max-w-md mx-auto px-4 py-2 md:max-w-4xl">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onScreenChange(item.id)}
                className={`flex flex-col items-center py-2 px-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-psyhologovo-500 bg-psyhologovo-500/10 dark:bg-psyhologovo-500/20'
                    : `text-gray-600 dark:text-gray-400 hover:text-psyhologovo-500 dark:hover:text-psyhologovo-500`
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 transition-transform duration-200 ${
                  isActive ? 'scale-110' : 'scale-100'
                }`} />
                <span className="text-xs font-medium">{item.label}</span>
                <span className="text-xs opacity-75">{item.description}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;