import React, { useState } from 'react';
import { User, Eye, EyeOff, Coins, Trophy, Target, Calendar, Settings, LogOut, Crown, GraduationCap, Users } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth, UserRole } from '../../contexts/AuthContext';

const Profile: React.FC = () => {
  const { isDark } = useTheme();
  const { user, isAuthenticated, login, logout, register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    email: '', 
    password: '', 
    name: '', 
    role: 'student' as UserRole 
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const achievements = [
    { id: 1, title: 'Первый онлайн урок', description: 'Завершили первое занятие', icon: '🎯', unlocked: true },
    { id: 2, title: 'Неделя активности', description: 'Пройдено уроков 7 дней подряд', icon: '🔥', unlocked: true },
    { id: 3, title: 'Марафонец', description: '30 дней активности', icon: '🏃‍♂️', unlocked: false },
    { id: 4, title: 'Силач', description: 'Заработал 1000 FIT COIN', icon: '💪', unlocked: true },
    { id: 5, title: 'Кардио мастер', description: '100 уроков отсмотрено', icon: '❤️', unlocked: false },
    { id: 6, title: 'Йога гуру', description: '50 заданий выполнено', icon: '🧘‍♀️', unlocked: false },
  ];

  const stats = [
    { label: 'Уроков завершено', value: '24', icon: Target },
    { label: 'Дней активности', value: '18', icon: Calendar },
    { label: 'Место в лидерборде', value: '#15', icon: Trophy },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(loginData.email, loginData.password);
    if (!success) {
      alert('Неверный email или пароль');
    }
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await register(registerData.email, registerData.password, registerData.name, registerData.role);
    if (!success) {
      alert('Ошибка регистрации. Возможно, пользователь уже существует.');
    }
    setIsLoading(false);
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'teacher':
        return <GraduationCap className="w-4 h-4 text-blue-500" />;
      case 'student':
        return <User className="w-4 h-4 text-green-500" />;
    }
  };

  const getRoleName = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Администратор';
      case 'teacher':
        return 'Тренер';
      case 'student':
        return 'Ученик';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-6 md:max-w-lg transition-colors duration-300">
        <div className={`rounded-2xl p-6 shadow-lg transition-colors duration-300 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>Вход в личный кабинет</h2>
            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Войдите, чтобы получить доступ к своему профилю</p>
          </div>

          {!isRegistering ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                  }`}
                  placeholder="Введите ваш email"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Пароль
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                      isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                    }`}
                    placeholder="Введите пароль"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Имя
                </label>
                <input
                  type="text"
                  required
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                  }`}
                  placeholder="Введите ваше имя"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                  }`}
                  placeholder="Введите ваш email"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Пароль
                </label>
                <input
                  type="password"
                  required
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                  }`}
                  placeholder="Введите пароль"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Роль
                </label>
                <select
                  value={registerData.role}
                  onChange={(e) => setRegisterData({ ...registerData, role: e.target.value as UserRole })}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                    isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'
                  }`}
                >
                  <option value="student">Ученик</option>
                  <option value="teacher">Тренер</option>
                  <option value="admin">Администратор</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center space-y-2">
            {!isRegistering ? (
              <>
                <button className="text-orange-500 text-sm hover:underline">
                  Забыли пароль?
                </button>
                <div>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Нет аккаунта?{' '}
                  </span>
                  <button 
                    onClick={() => setIsRegistering(true)}
                    className="text-orange-500 text-sm hover:underline"
                  >
                    Регистрация
                  </button>
                </div>
              </>
            ) : (
              <div>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Уже есть аккаунт?{' '}
                </span>
                <button 
                  onClick={() => setIsRegistering(false)}
                  className="text-orange-500 text-sm hover:underline"
                >
                  Войти
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6 md:max-w-4xl md:px-8 transition-colors duration-300">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-orange-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <div className="flex items-center space-x-2">
                {getRoleIcon(user?.role || 'student')}
                <p className="text-orange-100">{getRoleName(user?.role || 'student')}</p>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            title="Выйти"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        
        {/* FIT COIN - только для учеников */}
        {user?.role === 'student' && (
          <div className="mt-6 flex items-center justify-between bg-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <Coins className="w-6 h-6 text-yellow-300" />
              <span className="font-semibold">FIT COIN</span>
            </div>
            <div className="text-2xl font-bold">1,250</div>
          </div>
        )}
      </div>

      {/* Stats - только для учеников */}
      {user?.role === 'student' && (
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`rounded-xl p-4 text-center shadow-sm transition-colors duration-300 ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}>
                <Icon className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{stat.value}</div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Achievements - только для учеников */}
      {user?.role === 'student' && (
        <div className="space-y-4">
          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Ваши достижения</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`rounded-xl p-4 shadow-sm transition-all ${
                  isDark ? 'bg-gray-800' : 'bg-white'
                } ${
                  achievement.unlocked
                    ? isDark 
                      ? 'border-2 border-orange-500/30 bg-gradient-to-br from-orange-900/20 to-purple-900/20'
                      : 'border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-purple-50'
                    : 'opacity-50 grayscale'
                }`}
              >
                <div className="text-2xl mb-2">{achievement.icon}</div>
                <h4 className={`font-semibold text-sm mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {achievement.title}
                </h4>
                <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{achievement.description}</p>
                {achievement.unlocked && (
                  <div className="mt-2">
                    <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">
                      Получено
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin/Teacher Stats */}
      {(user?.role === 'admin' || user?.role === 'teacher') && (
        <div className="grid grid-cols-3 gap-4">
          {user?.role === 'admin' ? (
            // Статистика для администратора
            <>
              <div className={`rounded-xl p-4 text-center shadow-sm transition-colors duration-300 ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}>
                <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>1,250</div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Всего пользователей</div>
              </div>
              <div className={`rounded-xl p-4 text-center shadow-sm transition-colors duration-300 ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}>
                <GraduationCap className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>25</div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Тренеров</div>
              </div>
              <div className={`rounded-xl p-4 text-center shadow-sm transition-colors duration-300 ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}>
                <Calendar className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>150+</div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Программ</div>
              </div>
            </>
          ) : (
            // Статистика для тренера
            <>
              <div className={`rounded-xl p-4 text-center shadow-sm transition-colors duration-300 ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}>
                <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>45</div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Мои ученики</div>
              </div>
              <div className={`rounded-xl p-4 text-center shadow-sm transition-colors duration-300 ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}>
                <Calendar className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>12</div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Занятий сегодня</div>
              </div>
              <div className={`rounded-xl p-4 text-center shadow-sm transition-colors duration-300 ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}>
                <Trophy className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>4.8</div>
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Рейтинг</div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Admin/Teacher Controls */}
      {(user?.role === 'admin' || user?.role === 'teacher') && (
        <div className={`rounded-xl p-6 shadow-sm space-y-4 transition-colors duration-300 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {user?.role === 'admin' ? 'Панель администратора' : 'Панель тренера'}
            </h3>
            <div className="flex items-center space-x-2">
              {user?.role === 'admin' && <Crown className="w-5 h-5 text-yellow-500" />}
              {user?.role === 'teacher' && <GraduationCap className="w-5 h-5 text-blue-500" />}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button className={`p-4 rounded-xl border-2 border-dashed transition-all hover:border-orange-500 hover:bg-orange-50 ${
              isDark ? 'border-gray-600 hover:bg-orange-900/20' : 'border-gray-300'
            }`}>
              <div className="text-center">
                <Calendar className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Управление расписанием
                </span>
              </div>
            </button>
            
            <button className={`p-4 rounded-xl border-2 border-dashed transition-all hover:border-orange-500 hover:bg-orange-50 ${
              isDark ? 'border-gray-600 hover:bg-orange-900/20' : 'border-gray-300'
            }`}>
              <div className="text-center">
                <Trophy className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Добавить задание
                </span>
              </div>
            </button>
            
            {user?.role === 'admin' && (
              <>
                <button className={`p-4 rounded-xl border-2 border-dashed transition-all hover:border-orange-500 hover:bg-orange-50 ${
                  isDark ? 'border-gray-600 hover:bg-orange-900/20' : 'border-gray-300'
                }`}>
                  <div className="text-center">
                    <Users className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      Управление пользователями
                    </span>
                  </div>
                </button>
                
                <button className={`p-4 rounded-xl border-2 border-dashed transition-all hover:border-orange-500 hover:bg-orange-50 ${
                  isDark ? 'border-gray-600 hover:bg-orange-900/20' : 'border-gray-300'
                }`}>
                  <div className="text-center">
                    <Settings className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      Настройки системы
                    </span>
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Personal Data */}
      <div className={`rounded-xl p-6 shadow-sm space-y-4 transition-colors duration-300 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Личные данные</h3>
          <button className="text-orange-500">
            <Settings className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Email:</span>
            <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Роль:</span>
            <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{getRoleName(user?.role || 'student')}</span>
          </div>
          <div className="flex justify-between">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Дата регистрации:</span>
            <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : 'Не указана'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Статус:</span>
            <span className="font-medium text-green-600">Активен</span>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className={`w-full py-3 rounded-xl font-medium transition-all ${
          isDark 
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Выйти из аккаунта
      </button>
    </div>
  );
};

export default Profile;