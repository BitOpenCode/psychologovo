import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Plus } from 'lucide-react';
import EventsList from '../EventsList';
import EventForm from '../EventForm';
import { EventItem, CreateEventData } from '../../types/events';

interface EventsManagementProps {
  onBack: () => void;
  isDark: boolean;
}

const EventsManagement: React.FC<EventsManagementProps> = ({ onBack, isDark }) => {
  const { user } = useAuth();
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const isAdmin = user?.role === 'admin';

  // Функции для управления событиями
  const handleSaveEvent = async (eventData: CreateEventData) => {
    try {
      setIsLoading(true);
      
      const token = localStorage.getItem('psyhologovo_token');
      if (!token) {
        alert('Ошибка: пользователь не авторизован');
        return;
      }

      // Определяем, создаем новое событие или редактируем существующее
      const isEditing = !!editingEvent;
      const webhookUrl = isEditing 
        ? 'https://n8n.bitcoinlimb.com/webhook/event-edit'
        : 'https://n8n.bitcoinlimb.com/webhook/events-write';

      // Для редактирования добавляем ID события
      const requestBody = isEditing 
        ? { ...eventData, id: editingEvent?.id }
        : eventData;

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        alert(isEditing ? 'Событие успешно обновлено!' : 'Событие успешно создано!');
        setShowEventForm(false);
        setEditingEvent(null);
        // Принудительно обновляем список событий
        setRefreshKey(prev => prev + 1);
      } else {
        alert(`Ошибка: ${data.message || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('Ошибка сохранения события:', error);
      alert(`Ошибка сохранения: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditEvent = (event: EventItem) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!confirm('Вы уверены, что хотите удалить это событие?')) {
      return;
    }

    try {
      setIsLoading(true);
      
      const token = localStorage.getItem('psyhologovo_token');
      if (!token) {
        alert('Ошибка: пользователь не авторизован');
        return;
      }

      console.log('Отправляем запрос на удаление события:', eventId);
      console.log('Токен:', token.substring(0, 20) + '...');

      const response = await fetch('https://n8n.bitcoinlimb.com/webhook/events-delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: eventId })
      });

      console.log('Ответ от сервера:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ошибка HTTP:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Данные ответа:', data);
      
      if (data.success) {
        alert('Событие успешно удалено!');
        // Принудительно обновляем список событий
        setRefreshKey(prev => prev + 1);
      } else {
        alert(`Ошибка: ${data.message || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      console.error('Ошибка удаления события:', error);
      alert(`Ошибка удаления: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEventForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
  };

  // Блокируем скролл для фонового экрана когда открыта форма
  useEffect(() => {
    if (showEventForm) {
      // Блокируем скролл для body
      document.body.style.overflow = 'hidden';
    } else {
      // Восстанавливаем скролл
      document.body.style.overflow = 'auto';
    }

    // Очистка при размонтировании
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showEventForm]);

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
            Управление сессиями
          </h1>
          <button
            onClick={() => setShowEventForm(true)}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-psyhologovo-500 hover:bg-psyhologovo-600 text-white shadow-md hover:shadow-lg'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Добавить событие</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">📅</div>
          <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-psyhologovo-100' : 'text-psyhologovo-800'}`}>Управление сессиями</h2>
          <p className={`text-sm ${isDark ? 'text-psyhologovo-300' : 'text-psyhologovo-600'}`}>
            Создавайте, редактируйте и удаляйте сессии для пользователей
          </p>
        </div>

        {/* Список событий */}
        <EventsList 
          key={refreshKey}
          onEditEvent={isAdmin ? handleEditEvent : undefined}
          onDeleteEvent={isAdmin ? handleDeleteEvent : undefined}
        />
      </div>

      {/* Форма добавления/редактирования событий */}
      {showEventForm && (
        <EventForm
          event={editingEvent}
          onSave={handleSaveEvent}
          onCancel={handleCancelEventForm}
          isEditing={!!editingEvent}
        />
      )}
    </div>
  );
};

export default EventsManagement;
