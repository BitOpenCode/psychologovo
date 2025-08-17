import React from 'react';
import { ArrowLeft, Clock, MapPin, User, Star } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ScheduleDetailsProps {
  date: Date;
  onBack: () => void;
}

const ScheduleDetails: React.FC<ScheduleDetailsProps> = ({ date, onBack }) => {
  const { isDark } = useTheme();
  
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('ru-RU', options);
  };

  // Mock schedule data - in real app this would come from API
  const schedule = [
    {
      id: 1,
      time: '09:00 - 10:30',
      title: 'Утренняя йога',
      instructor: 'Елена Петрова',
      room: 'Зал №1',
      location: '2 этаж',
      type: 'Йога',
      level: 'Начинающий',
      participants: 12,
      maxParticipants: 15,
      rating: 4.8,
    },
    {
      id: 2,
      time: '11:00 - 12:00',
      title: 'Функциональный тренинг',
      instructor: 'Александр Иванов',
      room: 'Зал №2',
      location: '1 этаж',
      type: 'Силовая',
      level: 'Средний',
      participants: 8,
      maxParticipants: 10,
      rating: 4.9,
    },
    {
      id: 3,
      time: '14:00 - 15:00',
      title: 'Кардио HIIT',
      instructor: 'Мария Смирнова',
      room: 'Зал №3',
      location: '1 этаж',
      type: 'Кардио',
      level: 'Продвинутый',
      participants: 15,
      maxParticipants: 15,
      rating: 4.7,
    },
    {
      id: 4,
      time: '18:00 - 19:30',
      title: 'Пилатес',
      instructor: 'Анна Козлова',
      room: 'Зал №1',
      location: '2 этаж',
      type: 'Пилатес',
      level: 'Начинающий',
      participants: 9,
      maxParticipants: 12,
      rating: 4.6,
    },
    {
      id: 5,
      time: '19:45 - 21:00',
      title: 'Вечерняя йога',
      instructor: 'Елена Петрова',
      room: 'Зал №1',
      location: '2 этаж',
      type: 'Йога',
      level: 'Средний',
      participants: 6,
      maxParticipants: 15,
      rating: 4.8,
    },
  ];

  const getTypeColor = (type: string) => {
    const colors = {
      'Йога': 'bg-purple-100 text-purple-600',
      'Силовая': 'bg-orange-100 text-orange-600',
      'Кардио': 'bg-red-100 text-red-600',
      'Пилатес': 'bg-blue-100 text-blue-600',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  const getLevelColor = (level: string) => {
    const colors = {
      'Начинающий': 'bg-green-100 text-green-600',
      'Средний': 'bg-yellow-100 text-yellow-600',
      'Продвинутый': 'bg-red-100 text-red-600',
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="space-y-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className={`p-2 rounded-lg shadow-sm hover:shadow-md transition-all ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          <ArrowLeft className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
        </button>
        <div>
          <h2 className={`text-xl font-bold capitalize ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {formatDate(date)}
          </h2>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Расписание занятий</p>
        </div>
      </div>

      {/* Schedule List */}
      <div className="space-y-4">
        {schedule.map((class_) => (
          <div key={class_.id} className={`rounded-xl p-6 shadow-sm transition-colors duration-300 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            {/* Time and Title */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{class_.time}</span>
                </div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{class_.title}</h3>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{class_.rating}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center space-x-2 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(class_.type)}`}>
                {class_.type}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(class_.level)}`}>
                {class_.level}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4">
              <div className={`flex items-center space-x-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <User className="w-4 h-4" />
                <span>Тренер: <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{class_.instructor}</span></span>
              </div>
              <div className={`flex items-center space-x-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <MapPin className="w-4 h-4" />
                <span>{class_.room}, {class_.location}</span>
              </div>
            </div>

            {/* Participants and Action */}
            <div className="flex items-center justify-between">
              <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Участников: <span className="font-medium">{class_.participants}/{class_.maxParticipants}</span>
              </div>
              
              {class_.participants < class_.maxParticipants ? (
                <button className="bg-gradient-to-r from-orange-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all">
                  Записаться
                </button>
              ) : (
                <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                }`}>
                  Мест нет
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className={`rounded-xl p-4 ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
        <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
          💡 <strong>Совет:</strong> Приходите за 10-15 минут до начала занятия для разминки. 
          Отмена записи возможна не позднее чем за 2 часа до начала.
        </p>
      </div>
    </div>
  );
};

export default ScheduleDetails;