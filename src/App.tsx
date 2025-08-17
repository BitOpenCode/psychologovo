import React, { useState } from 'react';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Home from './components/screens/Home';
import Schedule from './components/screens/Schedule';
import Profile from './components/screens/Profile';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [activeScreen, setActiveScreen] = useState<'home' | 'schedule' | 'profile'>('home');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <Home />;
      case 'schedule':
        return <Schedule />;
      case 'profile':
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-purple-50 via-orange-50 to-blue-50'
    }`}>
      {/* Header */}
      <header className={`backdrop-blur-md shadow-sm sticky top-0 z-40 transition-colors duration-300 ${
        isDark ? 'bg-gray-900/80' : 'bg-white/80'
      }`}>
        <div className="max-w-md mx-auto px-4 py-4 md:max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IR</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
                IRFIT APP
              </h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20 md:pb-8">
        {renderScreen()}
      </main>

      {/* Bottom Navigation */}
      <Navigation activeScreen={activeScreen} onScreenChange={setActiveScreen} />
    </div>
  );
}

export default App;