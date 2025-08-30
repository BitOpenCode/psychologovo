import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { ArrowLeft, Settings, User, Mail, Lock } from 'lucide-react';
import ChangePasswordConfirmation from './ChangePasswordConfirmation';

interface ProfileSettingsProps {
  user: {
    email: string;
    name?: string;
    role?: string;
  } | null;
  onBack: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onBack }) => {
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType] = useState<'success' | 'error'>('success');
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleChangePassword = async () => {
    if (!user?.email) {
      setMessage('Ошибка: email пользователя не найден');
      setMessageType('error');
      return;
    }

    try {
      const token = localStorage.getItem('psyhologovo_token');
      if (!token) {
        setMessage('Ошибка: пользователь не авторизован');
        setMessageType('error');
        return;
      }

      // Отправляем запрос на отправку кода подтверждения
      const response = await fetch('https://n8n.bitcoinlimb.com/webhook/change-password-request-psyhologovo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: user.email,
          resend: false
        })
      });

      const data = await response.json();

      if (data.success) {
        setShowChangePassword(true);
        setMessage('');
      } else {
        setMessage(data.error || 'Ошибка отправки кода подтверждения');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Ошибка отправки кода:', error);
      setMessage('Ошибка сети. Попробуйте еще раз.');
      setMessageType('error');
    }
  };

  const handlePasswordChangeSuccess = () => {
    setShowChangePassword(false);
    setMessage('Пароль успешно изменен!');
    setMessageType('success');
  };

  // Если открыт экран изменения пароля, показываем его
  if (showChangePassword) {
    return (
      <ChangePasswordConfirmation
        email={user?.email || ''}
        onBack={() => setShowChangePassword(false)}
        onSuccess={handlePasswordChangeSuccess}
        isDark={isDark}
      />
    );
  }



  return (
    <div className="max-w-md mx-auto px-4 py-6 md:max-w-lg transition-colors duration-300">
      {/* Заголовок с кнопкой назад */}
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className={`p-2 rounded-lg mr-4 transition-colors ${
            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <ArrowLeft className={`w-6 h-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
        </button>
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Настройки профиля
          </h1>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Управление настройками аккаунта
          </p>
        </div>
      </div>

      {/* Информация о пользователе */}
      <div className={`mb-6 p-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 ${
        isDark 
          ? 'bg-gradient-to-r from-psyhologovo-900/50 to-psyhologovo-800/50 border border-psyhologovo-700' 
          : 'bg-gradient-to-r from-psyhologovo-100 to-psyhologovo-50 border border-psyhologovo-300'
      }`}>
        <div className="flex items-center space-x-3 mb-3">
          <User className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {user?.name || 'Имя не указано'}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <Mail className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {user?.email}
          </span>
        </div>
      </div>

      {/* Настройки аватара */}
      <div className={`mb-6 rounded-xl p-6 shadow-lg transition-all duration-300 hover:scale-105 ${
        isDark 
          ? 'bg-gradient-to-r from-psyhologovo-900/50 to-psyhologovo-800/50 border border-psyhologovo-700' 
          : 'bg-gradient-to-r from-psyhologovo-100 to-psyhologovo-50 border border-psyhologovo-300'
      }`}>
        <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Настройки аватара
        </h3>
        <div className="flex items-center space-x-4">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <User className={`w-10 h-10 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <div className="flex-1">
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
              Текущий аватар
            </p>
            <button 
              onClick={() => alert('Функция в разработке. Скоро вы сможете выбрать аватар или загрузить свое фото!')}
              className={`px-4 py-2 rounded-lg text-sm ${
                isDark ? 'bg-psyhologovo-500 text-white hover:bg-psyhologovo-600' : 'bg-psyhologovo-500 text-white hover:bg-psyhologovo-600'
              } transition-colors`}
            >
              Изменить аватар
            </button>
          </div>
        </div>
      </div>

      {/* Изменение пароля */}
      <div className={`rounded-xl p-6 shadow-lg transition-all duration-300 hover:scale-105 ${
        isDark 
          ? 'bg-gradient-to-r from-psyhologovo-900/50 to-psyhologovo-800/50 border border-psyhologovo-700' 
          : 'bg-gradient-to-r from-psyhologovo-100 to-psyhologovo-50 border border-psyhologovo-300'
      }`}>
        <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Изменить пароль
        </h3>
        <div className="space-y-4">
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Мы отправим код подтверждения на ваш email: <strong>{user?.email}</strong>
          </p>
          
          {message && (
            <div className={`p-3 rounded-lg text-sm text-center ${
              messageType === 'success' 
                ? (isDark ? 'bg-psyhologovo-900/50 text-psyhologovo-300' : 'bg-psyhologovo-50 text-psyhologovo-600')
                : (isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-50 text-red-600')
            }`}>
              {message}
            </div>
          )}

          <button
            onClick={handleChangePassword}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-gradient-to-r from-psyhologovo-500 to-psyhologovo-700 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:from-psyhologovo-600 hover:to-psyhologovo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Lock className="w-5 h-5" />
            <span>{isLoading ? 'Отправка кода...' : 'Отправить код подтверждения'}</span>
          </button>
        </div>
      </div>




    </div>
  );
};

export default ProfileSettings; 