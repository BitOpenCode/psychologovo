import React, { useState, useEffect } from 'react';
import { ArrowLeft, UserPlus, Mail, Calendar, MessageSquare, CheckCircle, XCircle } from 'lucide-react';

interface AnonymousQuestion {
  id: number;
  user_id: number;
  user_email: string;
  user_name: string;
  question_message?: string;
  status: 'pending' | 'answered' | 'archived';
  admin_answer?: string;
  created_at: string;
  updated_at: string;
  answered_by?: number;
  answered_at?: string;
}

interface AnonymousQuestionsProps {
  onBack: () => void;
  isDark: boolean;
}

const AnonymousQuestions: React.FC<AnonymousQuestionsProps> = ({ onBack, isDark }) => {
  const [questions, setQuestions] = useState<AnonymousQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загружаем анонимные вопросы при открытии экрана
  useEffect(() => {
    fetchAnonymousQuestions();
  }, []);

  const fetchAnonymousQuestions = async () => {
    setIsLoadingData(true);
    try {
      const token = localStorage.getItem('psyhologovo_token');
      if (!token) {
        setError('Токен не найден');
        return;
      }

      const response = await fetch('https://n8n.bitcoinlimb.com/webhook/anonymous-questions-take', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.questions)) {
        setQuestions(data.questions);
      } else if (Array.isArray(data)) {
        setQuestions(data);
      } else if (data.questions && Array.isArray(data.questions)) {
        setQuestions(data.questions);
      } else {
        setQuestions([]);
      }
    } catch (error) {
      console.error('Ошибка загрузки анонимных вопросов:', error);
      setError('Ошибка загрузки анонимных вопросов');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleAnswer = async (questionId: number) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('psyhologovo_token');
      if (!token) {
        setError('Токен не найден');
        return;
      }

      const response = await fetch('https://n8n.bitcoinlimb.com/webhook/anonymous-question-answer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question_id: questionId,
          action: 'answer',
          admin_answer: 'Вопрос обработан и ответ дан'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        // Обновляем локальное состояние
        setRequests(prev => prev.map(req => 
          req.id === requestId ? { ...req, status: 'approved' } : req
        ));
        // Перезагружаем данные
        fetchTeacherRequests();
      } else {
        setError('Ошибка одобрения заявки');
      }
    } catch (error) {
      console.error('Ошибка одобрения запроса:', error);
      setError('Ошибка одобрения заявки');
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchive = async (questionId: number) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('psyhologovo_token');
      if (!token) {
        setError('Токен не найден');
        return;
      }

      const response = await fetch('https://n8n.bitcoinlimb.com/webhook/anonymous-question-archive', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question_id: questionId,
          action: 'archive',
          admin_answer: 'Вопрос архивирован'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        // Обновляем локальное состояние
        setRequests(prev => prev.map(req => 
          req.id === requestId ? { ...req, status: 'rejected' } : req
        ));
        // Перезагружаем данные
        fetchTeacherRequests();
      } else {
        setError('Ошибка отклонения заявки');
      }
    } catch (error) {
      console.error('Ошибка отклонения запроса:', error);
      setError('Ошибка отклонения заявки');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Не указана';
    const dateOnly = dateString.split('T')[0];
    const [year, month, day] = dateOnly.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'answered':
        return 'Отвечено';
      case 'archived':
        return 'Архивировано';
      default:
        return 'Ожидает ответа';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'answered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (isLoadingData) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-psyhologovo-dark-900 via-psyhologovo-dark-800 to-psyhologovo-dark-900 text-white' : 'bg-gradient-to-br from-psyhologovo-50 via-psyhologovo-100 to-psyhologovo-200 text-gray-900'}`}>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-psyhologovo-500 mb-4"></div>
            <p className={isDark ? 'text-psyhologovo-200' : 'text-psyhologovo-700'}>Загрузка анонимных вопросов...</p>
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
            Анонимные вопросы пользователей
          </h1>
                      <button
              onClick={fetchAnonymousQuestions}
            disabled={isLoadingData}
            className={`p-2 rounded-lg ${isDark ? 'hover:bg-psyhologovo-dark-700 text-psyhologovo-400' : 'hover:bg-psyhologovo-100 text-psyhologovo-600'} transition-colors disabled:opacity-50`}
            title="Обновить данные"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">❓</div>
          <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-psyhologovo-100' : 'text-psyhologovo-800'}`}>Анонимные вопросы пользователей</h2>
          <p className={`text-sm ${isDark ? 'text-psyhologovo-300' : 'text-psyhologovo-600'}`}>
            Просмотрите и ответьте на анонимные вопросы от пользователей
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

        <div className="space-y-4">
          {questions.map((question) => (
            <div
              key={question.id}
              className={`rounded-xl p-4 ${isDark ? 'bg-psyhologovo-dark-800/50' : 'bg-white'} shadow-sm border ${
                isDark ? 'border-psyhologovo-dark-600' : 'border-psyhologovo-200'
              } transition-all duration-300 hover:shadow-md`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-psyhologovo-dark-700' : 'bg-psyhologovo-100'} flex items-center justify-center`}>
                    <UserPlus className="w-5 h-5 text-psyhologovo-500" />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-lg ${isDark ? 'text-psyhologovo-100' : 'text-psyhologovo-800'}`}>{question.user_name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-psyhologovo-500">
                      <Mail className="w-4 h-4" />
                      <span>{question.user_email}</span>
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(question.status)}`}>
                  {getStatusText(question.status)}
                </div>
              </div>

              {/* Вопрос пользователя */}
              {question.question_message && (
                <div className={`mb-3 p-3 rounded-lg ${isDark ? 'bg-psyhologovo-dark-700/50' : 'bg-psyhologovo-50'}`}>
                  <div className="flex items-start space-x-2">
                    <MessageSquare className={`w-4 h-4 ${isDark ? 'text-psyhologovo-400' : 'text-psyhologovo-500'} mt-0.5`} />
                    <div>
                      <div className={`text-xs mb-1 ${isDark ? 'text-psyhologovo-300' : 'text-psyhologovo-600'}`}>Вопрос пользователя:</div>
                      <p className={`text-sm ${isDark ? 'text-psyhologovo-100' : 'text-psyhologovo-800'}`}>{question.question_message}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Ответ администратора */}
              {question.admin_answer && (
                <div className={`mb-3 p-3 rounded-lg ${isDark ? 'bg-psyhologovo-500/20' : 'bg-psyhologovo-100'}`}>
                  <div className={`text-xs mb-1 ${isDark ? 'text-psyhologovo-300' : 'text-psyhologovo-600'}`}>Ответ администратора:</div>
                  <p className={`text-sm ${isDark ? 'text-psyhologovo-200' : 'text-psyhologovo-700'}`}>{question.admin_answer}</p>
                </div>
              )}

              <div className="flex items-center space-x-2 text-sm text-psyhologovo-500 mb-4">
                <Calendar className="w-4 h-4" />
                <span>Вопрос задан: {formatDate(question.created_at)}</span>
              </div>

              {question.status === 'pending' && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleAnswer(question.id)}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-psyhologovo-500 hover:bg-psyhologovo-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Ответить</span>
                  </button>
                  <button
                    onClick={() => handleArchive(question.id)}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-psyhologovo-600 hover:bg-psyhologovo-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Архивировать</span>
                  </button>
                </div>
              )}

              {/* Информация об обработке */}
              {question.status !== 'pending' && question.answered_at && (
                <div className={`mt-3 pt-3 border-t ${isDark ? 'border-psyhologovo-dark-600' : 'border-psyhologovo-200'}`}>
                  <div className={`text-xs ${isDark ? 'text-psyhologovo-400' : 'text-psyhologovo-500'}`}>
                    Обработано: {formatDate(question.answered_at)}
                  </div>
                </div>
              )}
            </div>
          ))}

          {questions.length === 0 && (
            <div className={`text-center py-12 ${isDark ? 'text-psyhologovo-400' : 'text-psyhologovo-500'}`}>
              <div className="text-6xl mb-4">📭</div>
              <p className={`text-lg ${isDark ? 'text-psyhologovo-200' : 'text-psyhologovo-700'}`}>Нет активных вопросов</p>
              <p className={`text-sm ${isDark ? 'text-psyhologovo-300' : 'text-psyhologovo-600'}`}>Все анонимные вопросы обработаны</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnonymousQuestions;
