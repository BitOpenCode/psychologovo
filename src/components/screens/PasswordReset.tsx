import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordResetProps {
  onBack: () => void;
}

const PasswordReset: React.FC<PasswordResetProps> = ({ onBack }) => {
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Состояния для этапов восстановления - только 2 этапа
  const [currentStep, setCurrentStep] = useState<'email' | 'new-password'>('email');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Состояния для валидации в реальном времени
  const [codeError, setCodeError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  // Таймер валидности кода (15 минут)
  const [timeLeft, setTimeLeft] = useState(15 * 60); // в секундах

  // Таймер обратного отсчета
  useEffect(() => {
    if (currentStep === 'new-password' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [currentStep, timeLeft]);

  // Валидация в реальном времени
  useEffect(() => {
    // Валидация кода
    if (resetCode.length > 0 && resetCode.length < 6) {
      setCodeError('Код должен содержать 6 цифр');
    } else if (resetCode.length === 6 && !/^\d{6}$/.test(resetCode)) {
      setCodeError('Код должен содержать только цифры');
    } else {
      setCodeError('');
    }

    // Валидация пароля
    if (newPassword.length > 0 && newPassword.length < 6) {
      setPasswordError('Пароль должен содержать минимум 6 символов');
    } else {
      setPasswordError('');
    }

    // Валидация подтверждения пароля
    if (confirmPassword.length > 0 && newPassword !== confirmPassword) {
      setConfirmPasswordError('Пароли не совпадают');
    } else if (confirmPassword.length > 0 && newPassword === confirmPassword) {
      setConfirmPasswordError('');
    }
  }, [resetCode, newPassword, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Введите email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://n8n.bitcoinlimb.com/webhook/reset-request-irfit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          timestamp: new Date().toISOString(),
          action: 'password_reset_request',
          source: 'irfit_app'
        })
      });

      const responseData = await response.json();

      if (responseData.success) {
        setCurrentStep('new-password'); // Сразу переходим к вводу пароля
        setError('');
      } else {
        setError(responseData.error || 'Ошибка отправки кода восстановления');
      }
    } catch (error) {
      console.error('Ошибка восстановления пароля:', error);
      setError('Ошибка соединения. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };



  // Объединенная функция для установки пароля
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Проверяем, что все поля заполнены и валидны
    if (!resetCode.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setError('Все поля обязательны для заполнения');
      return;
    }

    if (resetCode.length !== 6 || !/^\d{6}$/.test(resetCode)) {
      setError('Код должен содержать 6 цифр');
      return;
    }

    if (newPassword.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (timeLeft <= 0) {
      setError('Время действия кода истекло. Запросите новый код.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://n8n.bitcoinlimb.com/webhook/reset-confirm-irfit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          code: resetCode,
          newPassword: newPassword,
          timestamp: new Date().toISOString(),
          action: 'password_reset_confirm',
          source: 'irfit_app'
        })
      });

      const responseData = await response.json();
      
      // Логируем ответ сервера для отладки
      console.log('Ответ сервера:', responseData);

      if (responseData.success) {
        setIsSuccess(true);
        setError('');
        // Через 2 секунды переходим на страницу входа
        setTimeout(() => {
          onBack();
        }, 2000);
      } else {
        // Показываем более понятное сообщение об ошибке
        if (responseData.error) {
          const err = String(responseData.error).toLowerCase();
          console.log('Ошибка от сервера:', responseData.error);
          console.log('Приведенная к нижнему регистру:', err);
          if (err.includes('код') || err.includes('code') || err.includes('invalid') || 
              err.includes('неверный') || err.includes('неправильный') || err.includes('wrong') ||
              err.includes('ошибка') || err.includes('error')) {
            setError('Не верный код восстановления');
          } else {
            setError(responseData.error);
          }
        } else {
          // Если нет поля error, но success: false, то это неверный код
          setError('Не верный код восстановления');
        }
      }
    } catch (error) {
      console.error('Ошибка изменения пароля:', error);
      setError('Ошибка соединения. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  // Рендерим этап ввода пароля
  if (currentStep === 'new-password') {
    return (
      <div className="max-w-md mx-auto px-4 py-6 md:max-w-lg transition-colors duration-300">
        <div className={`w-full p-8 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 ${
          isDark 
            ? 'bg-gradient-to-r from-psyhologovo-900/50 to-psyhologovo-800/50 border border-psyhologovo-700' 
            : 'bg-gradient-to-r from-psyhologovo-100 to-psyhologovo-50 border border-psyhologovo-300'
        }`}>
          {/* Заголовок */}
          <div className="text-center mb-8">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              isDark ? 'bg-psyhologovo-500/20' : 'bg-psyhologovo-500/10'
            }`}>
              <Lock className="w-8 h-8 text-psyhologovo-500" />
            </div>
            <h1 className={`text-2xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              Восстановление пароля
            </h1>
            <p className={`text-sm ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Введите код и новый пароль
            </p>
            <p className={`text-sm font-medium text-psyhologovo-500 ${
              isDark ? 'text-psyhologovo-500' : 'text-psyhologovo-600'
            }`}>
              {email}
            </p>
            {error && (
              <div className={`mt-3 p-2 rounded-lg text-sm ${
                isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-50 text-red-600'
              }`}>
                <p className="mb-2">{error}</p>
                <p className="text-xs opacity-80">Нажмите "Вернуться к восстановлению" для повторной отправки кода</p>
              </div>
            )}
          </div>

          {/* Форма */}
          <form onSubmit={handlePasswordReset} className="space-y-6">
            {/* Код восстановления */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Код восстановления
              </label>
              <input
                type="text"
                required
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-psyhologovo-500 focus:border-transparent transition-all text-center text-xl font-mono tracking-widest ${
                  isDark 
                    ? 'bg-psyhologovo-800/30 border-psyhologovo-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                }`}
              />
              {codeError && (
                <p className={`text-sm mt-1 ${
                  isDark ? 'text-red-400' : 'text-red-600'
                }`}>
                  {codeError}
                </p>
              )}
            </div>

            {/* Новый пароль */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Новый пароль
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-psyhologovo-500 focus:border-transparent transition-all ${
                    isDark 
                      ? 'bg-psyhologovo-800/30 border-psyhologovo-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                  }`}
                  placeholder="Минимум 6 символов"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && (
                <p className={`text-sm mt-1 ${
                  isDark ? 'text-red-400' : 'text-red-600'
                }`}>
                  {passwordError}
                </p>
              )}
            </div>

            {/* Подтверждение пароля */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Подтвердите пароль
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-psyhologovo-500 focus:border-transparent transition-all ${
                    isDark 
                      ? 'bg-psyhologovo-800/30 border-psyhologovo-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                  }`}
                  placeholder="Повторите пароль"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPasswordError && (
                <p className={`text-sm mt-1 ${
                  isDark ? 'text-red-400' : 'text-red-600'
                }`}>
                  {confirmPasswordError}
                </p>
              )}
            </div>

            {/* Ошибка уже показывается в заголовке */}

            {/* Кнопка подтверждения */}
            <button
              type="submit"
              disabled={isLoading || !resetCode.trim() || !newPassword.trim() || !confirmPassword.trim()}
              className="w-full px-4 py-3 bg-gradient-to-r from-psyhologovo-500 to-psyhologovo-700 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:from-psyhologovo-600 hover:to-psyhologovo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Обновление...' : 'Подтвердить новый пароль'}
            </button>
          </form>

          {/* Таймер и кнопка повторной отправки */}
          <div className={`mt-6 p-3 rounded-lg text-xs text-center ${
            isDark ? 'bg-psyhologovo-800/30 text-psyhologovo-300' : 'bg-psyhologovo-50 text-psyhologovo-600'
          }`}>
            {timeLeft > 0 ? (
              <div className="space-y-2">
                <p>Код действителен еще: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
                {error && (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      isDark ? 'bg-psyhologovo-500 text-white hover:bg-psyhologovo-600' : 'bg-psyhologovo-500 text-white hover:bg-psyhologovo-600'
                    } transition-colors`}
                  >
                    Отправить код повторно
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-red-400">Время действия кода истекло</p>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    isDark ? 'bg-psyhologovo-500 text-white hover:bg-psyhologovo-600' : 'bg-psyhologovo-500 text-white hover:bg-psyhologovo-600'
                  } transition-colors`}
                >
                  Отправить новый код
                </button>
              </div>
            )}
            <div className="mt-3 pt-2 border-t border-current border-opacity-20">
              <button
                onClick={onBack}
                className={`inline-flex items-center space-x-1 text-xs hover:underline transition-colors ${
                  isDark ? 'text-psyhologovo-200 hover:text-psyhologovo-100' : 'text-psyhologovo-500 hover:text-psyhologovo-600'
                }`}
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Вернуться к восстановлению</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto px-4 py-6 md:max-w-lg transition-colors duration-300">
        <div className={`w-full p-8 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 ${
          isDark 
            ? 'bg-gradient-to-r from-psyhologovo-900/50 to-psyhologovo-800/50 border border-psyhologovo-700' 
            : 'bg-gradient-to-r from-psyhologovo-100 to-psyhologovo-50 border border-psyhologovo-300'
        }`}>
          {/* Заголовок */}
          <div className="text-center mb-8">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              isDark ? 'bg-psyhologovo-500/20' : 'bg-psyhologovo-500/10'
            }`}>
              <Lock className="w-8 h-8 text-psyhologovo-500" />
            </div>
            <h1 className={`text-2xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              Пароль изменен!
            </h1>
            <p className={`text-sm ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Ваш пароль успешно изменен
            </p>
            <p className={`text-xs mt-2 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Через 2 секунды вы будете перенаправлены на страницу входа
            </p>
          </div>

          {/* Кнопки */}
          <div className="space-y-3">
            <button
              onClick={onBack}
              className="w-full px-4 py-3 bg-gradient-to-r from-psyhologovo-500 to-psyhologovo-700 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:from-psyhologovo-600 hover:to-psyhologovo-500"
            >
              Вернуться к входу сейчас
            </button>
            
            <div className="text-center">
              <button
                onClick={onBack}
                className={`inline-flex items-center space-x-1 text-xs hover:underline transition-colors ${
                  isDark ? 'text-psyhologovo-200 hover:text-psyhologovo-100' : 'text-psyhologovo-500 hover:text-psyhologovo-600'
                }`}
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Вернуться к восстановлению</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 md:max-w-lg transition-colors duration-300">
      <div className={`w-full p-8 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 ${
        isDark 
          ? 'bg-gradient-to-r from-psyhologovo-900/50 to-psyhologovo-800/50 border border-psyhologovo-700' 
          : 'bg-gradient-to-r from-psyhologovo-100 to-psyhologovo-50 border border-psyhologovo-300'
      }`}>
        {/* Заголовок */}
        <div className="text-center mb-8">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            isDark ? 'bg-psyhologovo-500/20' : 'bg-psyhologovo-500/10'
          }`}>
            <Mail className="w-8 h-8 text-psyhologovo-500" />
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            Восстановление пароля
          </h1>
          <p className={`text-sm ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Введите email для получения кода восстановления
          </p>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-psyhologovo-500 focus:border-transparent transition-all ${
                isDark 
                  ? 'bg-psyhologovo-800/30 border-psyhologovo-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
              }`}
              placeholder="Введите ваш email"
            />
          </div>

          {/* Ошибка */}
          {error && (
            <div className={`p-3 rounded-lg text-sm text-center ${
              isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-50 text-red-600'
            }`}>
              {error}
            </div>
          )}

          {/* Кнопка отправки */}
          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="w-full px-4 py-3 bg-gradient-to-r from-psyhologovo-500 to-psyhologovo-700 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:from-psyhologovo-600 hover:to-psyhologovo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Отправка...' : 'Отправить код восстановления'}
          </button>
        </form>

        {/* Подсказка */}
        <div className={`mt-6 p-3 rounded-lg text-xs text-center ${
          isDark ? 'bg-psyhologovo-800/30 text-psyhologovo-300' : 'bg-psyhologovo-50 text-psyhologovo-600'
        }`}>
          Код будет отправлен на указанный email
        </div>

        {/* Кнопка возврата */}
        <div className="mt-3 text-center">
          <button
            onClick={onBack}
            className={`inline-flex items-center space-x-1 text-xs hover:underline transition-colors ${
              isDark ? 'text-psyhologovo-200 hover:text-psyhologovo-100' : 'text-psyhologovo-500 hover:text-psyhologovo-600'
            }`}
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Вернуться к входу</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset; 