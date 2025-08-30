import React, { useState } from 'react';
import { ArrowLeft, Send, MessageSquare } from 'lucide-react';

interface TeacherRequestFormProps {
  onBack: () => void;
  isDark: boolean;
}

const TeacherRequestForm: React.FC<TeacherRequestFormProps> = ({ onBack, isDark }) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('Пожалуйста, напишите ваш вопрос');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('psyhologovo_token');
      if (!token) {
        setError('Токен не найден. Пожалуйста, войдите в систему.');
        return;
      }

      console.log('Отправляем вопрос на:', 'https://n8n.bitcoinlimb.com/webhook/anonymous-question-submit');
      console.log('Данные вопроса:', { question_message: message.trim() });
      
      const response = await fetch('https://n8n.bitcoinlimb.com/webhook/anonymous-question-submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question_message: message.trim()
        })
      });

      console.log('Ответ от сервера:', response);
      console.log('Статус:', response.status);
      console.log('Статус текст:', response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ошибка HTTP:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Данные ответа:', data);
      
      if (data.success) {
        setIsSubmitted(true);
      } else {
        setError(data.message || 'Ошибка отправки вопроса');
      }
    } catch (error) {
      console.error('Детали ошибки:', error);
      setError(`Ошибка отправки вопроса: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-psyhologovo-dark-900 via-psyhologovo-dark-800 to-psyhologovo-dark-900 text-white' : 'bg-gradient-to-br from-psyhologovo-50 via-psyhologovo-100 to-psyhologovo-200 text-gray-900'}`}>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="text-6xl mb-6">✅</div>
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-psyhologovo-300' : 'text-psyhologovo-600'}`}>Вопрос отправлен!</h2>
            <p className={`text-lg mb-6 ${isDark ? 'text-psyhologovo-300' : 'text-psyhologovo-600'}`}>
              Ваш анонимный вопрос успешно отправлен психологам центра. 
              Мы ответим вам в течение 24 часов.
            </p>
            <button
              onClick={onBack}
              className="bg-psyhologovo-500 hover:bg-psyhologovo-600 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
            >
              Вернуться в профиль
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-psyhologovo-dark-900 via-psyhologovo-dark-800 to-psyhologovo-dark-900 text-white' : 'bg-gradient-to-br from-psyhologovo-50 via-psyhologovo-100 to-psyhologovo-200 text-gray-900'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 ${isDark ? 'bg-psyhologovo-dark-900/80 backdrop-blur-md' : 'bg-white/80 backdrop-blur-md'} border-b ${isDark ? 'border-psyhologovo-dark-700' : 'border-psyhologovo-300'}`}>
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onBack}
            className={`p-2 rounded-lg ${isDark ? 'hover:bg-psyhologovo-dark-700 text-psyhologovo-400' : 'hover:bg-psyhologovo-100 text-psyhologovo-600'} transition-colors`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className={`text-lg font-semibold ${isDark ? 'text-psyhologovo-100' : 'text-psyhologovo-800'}`}>
            Анонимный вопрос
          </h1>
          <div className="w-9"></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">💭</div>
          <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-psyhologovo-100' : 'text-psyhologovo-800'}`}>Задать анонимный вопрос</h2>
          <p className={`text-sm ${isDark ? 'text-psyhologovo-300' : 'text-psyhologovo-600'}`}>
            Получите профессиональный ответ от психологов центра Психологово
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className={`rounded-xl p-4 ${isDark ? 'bg-red-900/20 border border-red-600/30' : 'bg-red-50 border border-red-200'} shadow-sm`}>
            <div className="flex items-start space-x-3">
              <div className="text-red-600 text-lg">❌</div>
              <div>
                <h4 className={`font-semibold mb-1 ${isDark ? 'text-red-400' : 'text-red-800'}`}>Ошибка</h4>
                <p className={`text-sm ${isDark ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-psyhologovo-200' : 'text-psyhologovo-700'}`}>
              Ваш вопрос *
            </label>
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Опишите ваш вопрос или ситуацию, с которой нужна помощь психолога..."
                rows={6}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-psyhologovo-500 focus:border-transparent resize-none ${
                  isDark ? 'bg-psyhologovo-dark-800 border-psyhologovo-dark-600 text-white placeholder-psyhologovo-dark-400' : 'bg-white border-psyhologovo-300 text-gray-900 placeholder-psyhologovo-500'
                }`}
                disabled={isSubmitting}
              />
              <div className="absolute bottom-3 right-3">
                <MessageSquare className={`w-5 h-5 ${isDark ? 'text-psyhologovo-dark-400' : 'text-psyhologovo-400'}`} />
              </div>
            </div>
            <p className={`text-xs mt-2 ${isDark ? 'text-psyhologovo-dark-300' : 'text-psyhologovo-500'}`}>
              Минимум 50 символов. Опишите вашу ситуацию подробно для лучшего понимания.
            </p>
          </div>

          <div className={`rounded-lg p-4 ${isDark ? 'bg-psyhologovo-dark-800/50 border border-psyhologovo-dark-600' : 'bg-psyhologovo-50 border border-psyhologovo-200'}`}>
            <h4 className={`font-medium mb-2 ${isDark ? 'text-psyhologovo-200' : 'text-psyhologovo-800'}`}>💡 Как лучше описать ситуацию?</h4>
            <ul className={`text-sm space-y-1 ${isDark ? 'text-psyhologovo-300' : 'text-psyhologovo-700'}`}>
              <li>• Что именно вас беспокоит или интересует</li>
              <li>• Как давно длится эта ситуация</li>
              <li>• Что вы уже пробовали сделать</li>
              <li>• Какой результат хотите получить</li>
              <li>• Есть ли конкретные вопросы к психологу</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || message.trim().length < 50}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
              isSubmitting || message.trim().length < 50
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-psyhologovo-500 hover:bg-psyhologovo-600 text-white hover:shadow-lg shadow-md hover:shadow-xl'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Отправка...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Отправить вопрос</span>
              </>
            )}
          </button>
        </form>

        <div className={`text-center text-sm ${isDark ? 'text-psyhologovo-dark-300' : 'text-psyhologovo-500'}`}>
          <p>После отправки вопроса психологи центра ответят вам в течение 24 часов</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherRequestForm;
