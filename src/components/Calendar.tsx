import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface CalendarProps {
  onDateSelect: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect }) => {
  const { isDark } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayWeekday = (firstDay.getDay() + 6) % 7; // Adjust for Monday start
    
    const days = [];
    
    // Previous month days
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Current month days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true });
    }
    
    // Next month days to fill the grid
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({ date: nextDate, isCurrentMonth: false });
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const hasWorkout = (date: Date) => {
    // Mock data - in real app this would come from API
    const workoutDays = [1, 3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26, 29];
    return workoutDays.includes(date.getDate()) && date.getMonth() === currentDate.getMonth();
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className={`rounded-2xl p-6 shadow-sm transition-colors duration-300 ${
      isDark ? 'bg-gray-800' : 'bg-white'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className={`p-2 rounded-lg transition-colors ${
            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <ChevronLeft className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
        </button>
        
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        
        <button
          onClick={() => navigateMonth('next')}
          className={`p-2 rounded-lg transition-colors ${
            isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <ChevronRight className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {dayNames.map((day) => (
          <div key={day} className={`text-center text-sm font-medium py-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const isWorkoutDay = hasWorkout(day.date);
          const isTodayDate = isToday(day.date);
          
          return (
            <button
              key={index}
              onClick={() => onDateSelect(day.date)}
              className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-all relative
                ${day.isCurrentMonth 
                  ? isDark
                    ? 'text-gray-200 hover:bg-gray-700 hover:text-orange-400'
                    : 'text-gray-800 hover:bg-orange-50 hover:text-orange-600'
                  : isDark
                    ? 'text-gray-600'
                    : 'text-gray-300'
                }
                ${isTodayDate 
                  ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold' 
                  : ''
                }
                ${isWorkoutDay && !isTodayDate 
                  ? isDark
                    ? 'bg-orange-900/30 text-orange-400 font-medium'
                    : 'bg-orange-100 text-orange-600 font-medium'
                  : ''
                }`}
            >
              {day.date.getDate()}
              {isWorkoutDay && (
                <div className="absolute bottom-1 w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-6 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full"></div>
          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Сегодня</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full border ${
            isDark ? 'bg-orange-900/30 border-orange-500' : 'bg-orange-100 border-orange-300'
          }`}></div>
          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Есть занятия</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;