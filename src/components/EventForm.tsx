import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { EventItem, CreateEventData } from '../types/events';
import { X, Save, Plus } from 'lucide-react';

interface EventFormProps {
  event?: EventItem | null;
  onSave: (eventData: CreateEventData) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({ 
  event, 
  onSave, 
  onCancel, 
  isEditing = false 
}) => {
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  // Блокируем скролл на фоновом контенте
  useEffect(() => {
    // Блокируем скролл для body
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Восстанавливаем скролл для body
      document.body.style.overflow = 'auto';
    };
  }, []);
  const [formData, setFormData] = useState<CreateEventData>({
    title: '',
    event_type: 'online',
    event_date: '',
    start_time: '',
    description: '',
    event_link: '',
    show_button: false,
    button_text: 'Присоединиться',
    is_active: true
  });

  // Заполняем форму данными события при редактировании
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        event_type: event.event_type,
        event_date: event.event_date,
        start_time: event.start_time,
        description: event.description,
        event_link: event.event_link || '',
        show_button: event.show_button,
        button_text: event.button_text,
        is_active: event.is_active
      });
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.event_date || !formData.start_time || !formData.description.trim()) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    try {
      setIsLoading(true);
      await onSave(formData);
    } catch (error) {
      console.error('Ошибка сохранения события:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateEventData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-start justify-center pt-2 pb-20 px-4 ${
      isDark ? 'bg-black/50' : 'bg-black/30'
    }`}>
      <div className={`w-full max-w-2xl max-h-[calc(100vh-5rem)] overflow-y-auto rounded-2xl shadow-2xl ${
        isDark ? 'bg-psyhologovo-dark-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDark ? 'border-psyhologovo-dark-600' : 'border-psyhologovo-200'
        }`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-psyhologovo-100' : 'text-psyhologovo-800'}`}>
            {isEditing ? 'Редактировать событие' : 'Добавить новое событие'}
          </h2>
          <button
            onClick={onCancel}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-psyhologovo-dark-700 text-psyhologovo-400' : 'hover:bg-psyhologovo-100 text-psyhologovo-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Название события */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-psyhologovo-200' : 'text-psyhologovo-700'}`}>
              Название события *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-psyhologovo-500 focus:border-transparent ${
                isDark 
                  ? 'bg-psyhologovo-dark-700 border-psyhologovo-dark-600 text-white placeholder-psyhologovo-dark-400' 
                  : 'bg-white border-psyhologovo-300 text-gray-900 placeholder-psyhologovo-500'
              }`}
              placeholder="Например: День открытых дверей"
              required
            />
          </div>

          {/* Тип события и дата */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-psyhologovo-200' : 'text-psyhologovo-700'}`}>
                Тип события *
              </label>
              <select
                value={formData.event_type}
                onChange={(e) => handleInputChange('event_type', e.target.value as 'online' | 'offline')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-psyhologovo-500 focus:border-transparent ${
                  isDark 
                    ? 'bg-psyhologovo-dark-700 border-psyhologovo-dark-600 text-white' 
                    : 'bg-white border-psyhologovo-300 text-gray-900'
                }`}
              >
                <option value="online">Онлайн</option>
                <option value="offline">Офлайн</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-psyhologovo-200' : 'text-psyhologovo-700'}`}>
                Дата проведения *
              </label>
              <input
                type="date"
                value={formData.event_date}
                onChange={(e) => handleInputChange('event_date', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-psyhologovo-500 focus:border-transparent ${
                  isDark 
                    ? 'bg-psyhologovo-dark-700 border-psyhologovo-dark-600 text-white' 
                    : 'bg-white border-psyhologovo-300 text-gray-900'
                }`}
                required
              />
            </div>
          </div>

          {/* Время и активность */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-psyhologovo-200' : 'text-psyhologovo-700'}`}>
                Время начала *
              </label>
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) => handleInputChange('start_time', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-psyhologovo-500 focus:border-transparent ${
                  isDark 
                    ? 'bg-psyhologovo-dark-700 border-psyhologovo-dark-600 text-white' 
                    : 'bg-white border-psyhologovo-300 text-gray-900'
                }`}
                required
              />
            </div>

            <div className="flex items-center space-x-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="w-4 h-4 text-psyhologovo-500 border-psyhologovo-300 rounded focus:ring-psyhologovo-500"
                />
                <span className={`ml-2 text-sm ${isDark ? 'text-psyhologovo-200' : 'text-psyhologovo-700'}`}>
                  Активное событие
                </span>
              </label>
            </div>
          </div>

          {/* Описание */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-psyhologovo-200' : 'text-psyhologovo-700'}`}>
              Описание события *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-psyhologovo-500 focus:border-transparent ${
                isDark 
                  ? 'bg-psyhologovo-dark-700 border-psyhologovo-dark-600 text-white placeholder-psyhologovo-dark-400' 
                  : 'bg-white border-psyhologovo-300 text-gray-900 placeholder-psyhologovo-500'
              }`}
              placeholder="Подробное описание события..."
              required
            />
          </div>

          {/* Ссылка и кнопка */}
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-psyhologovo-200' : 'text-psyhologovo-700'}`}>
                Ссылка на мероприятие
              </label>
              <input
                type="url"
                value={formData.event_link}
                onChange={(e) => handleInputChange('event_link', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-psyhologovo-500 focus:border-transparent ${
                  isDark 
                    ? 'bg-psyhologovo-dark-700 border-psyhologovo-dark-600 text-white placeholder-psyhologovo-dark-400' 
                    : 'bg-white border-psyhologovo-300 text-gray-900 placeholder-psyhologovo-500'
                }`}
                placeholder="https://example.com/event"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.show_button}
                  onChange={(e) => handleInputChange('show_button', e.target.checked)}
                  className="w-4 h-4 text-psyhologovo-500 border-psyhologovo-300 rounded focus:ring-psyhologovo-500"
                />
                <span className={`ml-2 text-sm ${isDark ? 'text-psyhologovo-200' : 'text-psyhologovo-700'}`}>
                  Показывать кнопку присоединения
                </span>
              </label>
            </div>

            {formData.show_button && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-psyhologovo-200' : 'text-psyhologovo-700'}`}>
                  Текст кнопки
                </label>
                <input
                  type="text"
                  value={formData.button_text}
                  onChange={(e) => handleInputChange('button_text', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-psyhologovo-500 focus:border-transparent ${
                    isDark 
                      ? 'bg-psyhologovo-dark-700 border-psyhologovo-dark-600 text-white placeholder-psyhologovo-dark-400' 
                      : 'bg-white border-psyhologovo-300 text-gray-900 placeholder-psyhologovo-500'
                  }`}
                  placeholder="Присоединиться"
                />
              </div>
            )}
          </div>

          {/* Кнопки действий */}
          <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 pb-8 border-t ${isDark ? 'border-psyhologovo-dark-600' : 'border-psyhologovo-200'}`}>
            <button
              type="button"
              onClick={onCancel}
              className={`px-4 sm:px-6 py-3 rounded-lg font-medium transition-colors ${
                isDark 
                  ? 'bg-psyhologovo-dark-700 text-psyhologovo-200 hover:bg-psyhologovo-dark-600' 
                  : 'bg-psyhologovo-200 text-psyhologovo-700 hover:bg-psyhologovo-300'
              }`}
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 sm:px-6 py-3 rounded-lg font-medium text-white transition-colors flex items-center justify-center space-x-2 ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-psyhologovo-500 hover:bg-psyhologovo-600 shadow-md hover:shadow-lg'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Сохранение...</span>
                </>
              ) : (
                <>
                  {isEditing ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{isEditing ? 'Сохранить' : 'Добавить'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
