import React, { useState, useEffect } from 'react';
import { ArrowLeft, Filter, Calendar, User, BookOpen, Search, X } from 'lucide-react';

interface ScheduleItem {
  id: string;
  title: string;
  psychologist: string;
  date: string;
  start_time: string;
  end_time: string;
  room: string;
  session_type: string;
  level: string;
  participants: number;
  max_participants: number;
  rating: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by_name?: string;
  created_by_id?: number;
  updated_by_id?: number;
  updated_by_name?: string;
  update_reason?: string;
}

interface ScheduleHistoryProps {
  onBack: () => void;
  isDark: boolean;
}

const ScheduleHistory: React.FC<ScheduleHistoryProps> = ({ onBack, isDark }) => {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);

  const [filteredSchedules, setFilteredSchedules] = useState<ScheduleItem[]>(schedules);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    psychologist: '',
    sessionType: '',
    creator: '',
    updateReason: '',
    searchQuery: ''
  });

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchSchedules();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, schedules]);

  const fetchSchedules = async () => {
    setIsLoadingData(true);
    try {
      const token = localStorage.getItem('psyhologovo_token');
      
      if (!token) {
        console.error('Токен не найден');
        setSchedules([]);
        setFilteredSchedules([]);
        return;
      }

      const response = await fetch('https://n8n.bitcoinlimb.com/webhook/schedules-take', {
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
      console.log('Полученные данные расписаний:', data);

                      if (data.success && Array.isArray(data.schedules)) {
                  setSchedules(data.schedules);
                  setFilteredSchedules(data.schedules);
                } else if (Array.isArray(data)) {
                  setSchedules(data);
                  setFilteredSchedules(data);
                } else if (data.schedules && Array.isArray(data.schedules)) {
                  setSchedules(data.schedules);
                  setFilteredSchedules(data.schedules);
                } else {
                  console.error('Неверный формат данных:', data);
                  setSchedules([]);
                  setFilteredSchedules([]);
                }
    } catch (error) {
      console.error('Ошибка загрузки расписаний:', error);
      setSchedules([]);
      setFilteredSchedules([]);
    } finally {
      setIsLoadingData(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...schedules];

    // Фильтр по поисковому запросу
    if (filters.searchQuery) {
      filtered = filtered.filter(schedule =>
        schedule.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        schedule.psychologist.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        schedule.room.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        (schedule.created_by_name && schedule.created_by_name.toLowerCase().includes(filters.searchQuery.toLowerCase())) ||
        (schedule.update_reason && schedule.update_reason.toLowerCase().includes(filters.searchQuery.toLowerCase()))
      );
    }

    // Фильтр по психологу
    if (filters.psychologist) {
      filtered = filtered.filter(schedule =>
        schedule.psychologist.toLowerCase().includes(filters.psychologist.toLowerCase())
      );
    }

    // Фильтр по типу сессии
    if (filters.sessionType) {
      filtered = filtered.filter(schedule =>
        schedule.session_type.toLowerCase().includes(filters.sessionType.toLowerCase())
      );
    }

    // Фильтр по создателю
    if (filters.creator) {
      filtered = filtered.filter(schedule =>
        schedule.created_by_name && schedule.created_by_name.toLowerCase().includes(filters.creator.toLowerCase())
      );
    }

    // Фильтр по причине изменения
    if (filters.updateReason) {
      filtered = filtered.filter(schedule =>
        schedule.update_reason && schedule.update_reason.toLowerCase().includes(filters.updateReason.toLowerCase())
      );
    }

    // Фильтр по дате создания
    if (filters.dateFrom) {
      filtered = filtered.filter(schedule =>
        new Date(schedule.created_at) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(schedule =>
        new Date(schedule.created_at) <= new Date(filters.dateTo)
      );
    }

    setFilteredSchedules(filtered);
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      psychologist: '',
      sessionType: '',
      creator: '',
      updateReason: '',
      searchQuery: ''
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Не указана';
    
    // Убираем T00:00:00.000Z и форматируем только дату
    const dateOnly = dateString.split('T')[0];
    const [year, month, day] = dateOnly.split('-');
    
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUniquePsychologists = () => {
    return [...new Set(schedules.map(s => s.psychologist))];
  };

  const getUniqueSessionTypes = () => {
    return [...new Set(schedules.map(s => s.session_type))];
  };

  const getUniqueCreators = () => {
    return [...new Set(schedules.map(s => s.created_by_name).filter(Boolean))];
  };

  const getUniqueUpdateReasons = () => {
    return [...new Set(schedules.map(s => s.update_reason).filter(Boolean))];
  };

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
            История изменений сессий
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={fetchSchedules}
              disabled={isLoadingData}
              className={`p-2 rounded-lg ${isDark ? 'hover:bg-psyhologovo-dark-700 text-psyhologovo-400' : 'hover:bg-psyhologovo-100 text-psyhologovo-600'} transition-colors disabled:opacity-50`}
              title="Обновить данные"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg ${isDark ? 'hover:bg-psyhologovo-dark-700 text-psyhologovo-400' : 'hover:bg-psyhologovo-100 text-psyhologovo-600'} transition-colors`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-psyhologovo-400' : 'text-psyhologovo-500'}`} />
          <input
            type="text"
            placeholder="Поиск по названию, психологу или залу..."
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-psyhologovo-500 focus:border-transparent ${
              isDark ? 'bg-psyhologovo-dark-800 border-psyhologovo-dark-600 text-white placeholder-psyhologovo-dark-400' : 'bg-white border-psyhologovo-300 text-gray-900 placeholder-psyhologovo-500'
            }`}
          />
        </div>



        {/* Filters */}
        {showFilters && (
          <div className={`rounded-xl p-4 ${isDark ? 'bg-psyhologovo-dark-800/50' : 'bg-white'} shadow-sm border ${
            isDark ? 'border-psyhologovo-dark-600' : 'border-psyhologovo-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${isDark ? 'text-psyhologovo-100' : 'text-psyhologovo-800'}`}>Фильтры</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-psyhologovo-500 hover:underline"
              >
                Очистить все
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Фильтр по дате создания */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-psyhologovo-200' : 'text-psyhologovo-700'}`}>
                  Дата создания (от)
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-psyhologovo-500 focus:border-transparent ${
                    isDark ? 'bg-psyhologovo-dark-700 border-psyhologovo-dark-600 text-white' : 'bg-white border-psyhologovo-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-psyhologovo-200' : 'text-psyhologovo-700'}`}>
                  Дата создания (до)
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-psyhologovo-500 focus:border-transparent ${
                    isDark ? 'bg-psyhologovo-dark-700 border-psyhologovo-dark-600 text-white' : 'bg-white border-psyhologovo-300 text-gray-900'
                  }`}
                />
              </div>

              {/* Фильтр по учителю */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-psyhologovo-200' : 'text-psyhologovo-700'}`}>
                  Учитель
                </label>
                <select
                  value={filters.psychologist}
                  onChange={(e) => setFilters(prev => ({ ...prev, psychologist: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-psyhologovo-500 focus:border-transparent ${
                    isDark ? 'bg-psyhologovo-dark-700 border-psyhologovo-dark-600 text-white' : 'bg-white border-psyhologovo-300 text-gray-900'
                  }`}
                >
                  <option value="">Все психологи</option>
                  {getUniquePsychologists().map(psychologist => (
                    <option key={psychologist} value={psychologist}>{psychologist}</option>
                  ))}
                </select>
              </div>

              {/* Фильтр по типу занятия */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-psyhologovo-200' : 'text-psyhologovo-700'}`}>
                  Тип сессии
                </label>
                <select
                  value={filters.sessionType}
                  onChange={(e) => setFilters(prev => ({ ...prev, sessionType: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-psyhologovo-500 focus:border-transparent ${
                    isDark ? 'bg-psyhologovo-dark-700 border-psyhologovo-dark-600 text-white' : 'bg-white border-psyhologovo-300 text-gray-900'
                  }`}
                >
                  <option value="">Все типы</option>
                  {getUniqueSessionTypes().map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Фильтр по создателю */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-psyhologovo-200' : 'text-psyhologovo-700'}`}>
                  Создатель
                </label>
                <select
                  value={filters.creator}
                  onChange={(e) => setFilters(prev => ({ ...prev, creator: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-psyhologovo-500 focus:border-transparent ${
                    isDark ? 'bg-psyhologovo-dark-700 border-psyhologovo-dark-600 text-white' : 'bg-white border-psyhologovo-300 text-gray-900'
                  }`}
                >
                  <option value="">Все создатели</option>
                  {getUniqueCreators().map(creator => (
                    <option key={creator} value={creator}>{creator}</option>
                  ))}
                </select>
              </div>

              {/* Фильтр по причине изменения */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-psyhologovo-200' : 'text-psyhologovo-700'}`}>
                  Причина изменения
                </label>
                <select
                  value={filters.updateReason}
                  onChange={(e) => setFilters(prev => ({ ...prev, updateReason: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-psyhologovo-500 focus:border-transparent ${
                    isDark ? 'bg-psyhologovo-dark-700 border-psyhologovo-dark-600 text-white' : 'bg-white border-psyhologovo-300 text-gray-900'
                  }`}
                >
                  <option value="">Все причины</option>
                  {getUniqueUpdateReasons().map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className={`text-sm ${isDark ? 'text-psyhologovo-400' : 'text-psyhologovo-600'}`}>
          {isLoadingData ? 'Загрузка...' : `Найдено: ${filteredSchedules.length} из ${schedules.length} сессий`}
        </div>



        {/* Schedules List */}
        <div className="space-y-4">
                      {filteredSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className={`rounded-xl p-4 ${isDark ? 'bg-psyhologovo-dark-800/50' : 'bg-white'} shadow-sm border ${
                  isDark ? 'border-psyhologovo-dark-600' : 'border-psyhologovo-200'
                } transition-all duration-300 hover:shadow-md`}
              >
                {/* Заголовок карточки */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2 text-psyhologovo-500">{schedule.title}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <User className={`w-4 h-4 ${isDark ? 'text-psyhologovo-400' : 'text-psyhologovo-500'}`} />
                        <span className={`font-medium ${isDark ? 'text-psyhologovo-200' : 'text-psyhologovo-700'}`}>{schedule.psychologist}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <BookOpen className={`w-4 h-4 ${isDark ? 'text-psyhologovo-400' : 'text-psyhologovo-500'}`} />
                        <span className={isDark ? 'text-psyhologovo-300' : 'text-psyhologovo-600'}>{schedule.session_type} - {schedule.level}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm font-bold text-psyhologovo-500 mb-1">
                      {formatDate(schedule.date)}
                    </div>
                    <div className="text-xs bg-psyhologovo-500/10 text-psyhologovo-500 px-2 py-1 rounded-full font-medium">
                      {schedule.start_time?.substring(0, 5)} - {schedule.end_time?.substring(0, 5)}
                    </div>
                  </div>
                </div>

                {/* Основная информация */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-psyhologovo-dark-700/50' : 'bg-psyhologovo-50'}`}>
                    <div className={`text-xs mb-1 ${isDark ? 'text-psyhologovo-400' : 'text-psyhologovo-600'}`}>Зал</div>
                    <div className={`font-semibold ${isDark ? 'text-psyhologovo-100' : 'text-psyhologovo-800'}`}>{schedule.room}</div>
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-psyhologovo-dark-700/50' : 'bg-psyhologovo-50'}`}>
                    <div className={`text-xs mb-1 ${isDark ? 'text-psyhologovo-400' : 'text-psyhologovo-600'}`}>Участники</div>
                    <div className={`font-semibold ${isDark ? 'text-psyhologovo-100' : 'text-psyhologovo-800'}`}>{schedule.participants}/{schedule.max_participants}</div>
                  </div>
                </div>

                {/* Дополнительная информация */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-psyhologovo-dark-700/50' : 'bg-psyhologovo-50'}`}>
                    <div className={`text-xs mb-1 ${isDark ? 'text-psyhologovo-400' : 'text-psyhologovo-600'}`}>Создано</div>
                    <div className={`font-semibold text-sm ${isDark ? 'text-psyhologovo-100' : 'text-psyhologovo-800'}`}>{formatDate(schedule.created_at)}</div>
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-psyhologovo-dark-700/50' : 'bg-psyhologovo-50'}`}>
                    <div className={`text-xs mb-1 ${isDark ? 'text-psyhologovo-400' : 'text-psyhologovo-600'}`}>Рейтинг</div>
                    <div className={`font-semibold text-sm ${isDark ? 'text-psyhologovo-100' : 'text-psyhologovo-800'}`}>{schedule.rating || 'Нет'}</div>
                  </div>
                </div>

                {/* Информация о создателе */}
                <div className={`p-3 rounded-lg mb-3 ${isDark ? 'bg-psyhologovo-500/20 border border-psyhologovo-500/30' : 'bg-psyhologovo-100 border border-psyhologovo-300'}`}>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-psyhologovo-500 rounded-full"></div>
                      <span className={`text-xs font-medium ${isDark ? 'text-psyhologovo-300' : 'text-psyhologovo-600'}`}>Создано</span>
                    </div>
                    <div className="ml-4 space-y-1">
                      {schedule.created_by_name && schedule.created_by_name.trim() !== '' ? (
                        <div className={`text-xs ${isDark ? 'text-psyhologovo-300' : 'text-psyhologovo-600'}`}>
                          <span className="font-medium">Кем:</span> {schedule.created_by_name}
                          {schedule.created_by_id && (
                            <span className={`ml-1 ${isDark ? 'text-psyhologovo-400' : 'text-psyhologovo-500'}`}>(ID: {schedule.created_by_id})</span>
                          )}
                        </div>
                      ) : (
                        <div className={`text-xs ${isDark ? 'text-psyhologovo-400' : 'text-psyhologovo-500'}`}>Не указано</div>
                      )}
                      <div className={`text-xs ${isDark ? 'text-psyhologovo-300' : 'text-psyhologovo-600'}`}>
                        <span className="font-medium">Когда:</span> {formatDate(schedule.created_at)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Информация об изменениях */}
                {schedule.updated_at !== schedule.created_at && (
                  <div className={`p-3 rounded-lg mb-3 ${isDark ? 'bg-psyhologovo-600/20 border border-psyhologovo-600/30' : 'bg-psyhologovo-200 border border-psyhologovo-400'}`}>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-psyhologovo-600 rounded-full"></div>
                        <span className={`text-xs font-medium ${isDark ? 'text-psyhologovo-300' : 'text-psyhologovo-600'}`}>Изменено</span>
                      </div>
                      <div className="ml-4 space-y-1">
                        {schedule.updated_by_name && schedule.updated_by_name.trim() !== '' ? (
                          <div className={`text-xs ${isDark ? 'text-psyhologovo-300' : 'text-psyhologovo-600'}`}>
                            <span className="font-medium">Кем:</span> {schedule.updated_by_name}
                            {schedule.updated_by_id && (
                              <span className={`ml-1 ${isDark ? 'text-psyhologovo-400' : 'text-psyhologovo-500'}`}>(ID: {schedule.updated_by_id})</span>
                            )}
                          </div>
                        ) : (
                          <div className={`text-xs ${isDark ? 'text-psyhologovo-400' : 'text-psyhologovo-500'}`}>Не указано</div>
                        )}
                        <div className={`text-xs ${isDark ? 'text-psyhologovo-300' : 'text-psyhologovo-600'}`}>
                          <span className="font-medium">Когда:</span> {formatDate(schedule.updated_at)}
                        </div>
                        {schedule.update_reason && (
                          <div className={`text-xs ${isDark ? 'text-psyhologovo-300' : 'text-psyhologovo-600'}`}>
                            <span className="font-medium">Причина:</span> {schedule.update_reason}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Статус */}
                <div className={`p-3 rounded-lg ${schedule.is_active ? 
                  (isDark ? 'bg-psyhologovo-500/20 border border-psyhologovo-500/30' : 'bg-psyhologovo-100 border border-psyhologovo-300') :
                  (isDark ? 'bg-red-900/20 border border-red-700/30' : 'bg-red-50 border border-red-200')
                }`}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${schedule.is_active ? 'bg-psyhologovo-500' : 'bg-red-500'}`}></div>
                    <span className={`text-xs font-medium ${schedule.is_active ? (isDark ? 'text-psyhologovo-300' : 'text-psyhologovo-600') : 'text-red-600'}`}>
                      Статус: {schedule.is_active ? 'Активно' : 'Неактивно'}
                    </span>
                  </div>
                </div>
              </div>
            ))}

          {isLoadingData ? (
            <div className={`text-center py-12 ${isDark ? 'text-psyhologovo-400' : 'text-psyhologovo-500'}`}>
              <div className="text-6xl mb-4">⏳</div>
              <p className={`text-lg ${isDark ? 'text-psyhologovo-200' : 'text-psyhologovo-700'}`}>Загрузка расписаний...</p>
              <p className={`text-sm ${isDark ? 'text-psyhologovo-300' : 'text-psyhologovo-600'}`}>Пожалуйста, подождите</p>
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div className={`text-center py-12 ${isDark ? 'text-psyhologovo-400' : 'text-psyhologovo-500'}`}>
              <div className="text-6xl mb-4">📋</div>
              <p className={`text-lg ${isDark ? 'text-psyhologovo-200' : 'text-psyhologovo-700'}`}>Расписания не найдены</p>
              <p className={`text-sm ${isDark ? 'text-psyhologovo-300' : 'text-psyhologovo-600'}`}>Попробуйте изменить фильтры поиска</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ScheduleHistory;
