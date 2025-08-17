import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Calendar from '../Calendar';
import ScheduleDetails from '../ScheduleDetails';

const Schedule: React.FC = () => {
  const { isDark } = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div className="max-w-md mx-auto px-4 py-6 md:max-w-4xl md:px-8 transition-colors duration-300">
      {selectedDate ? (
        <ScheduleDetails 
          date={selectedDate} 
          onBack={() => setSelectedDate(null)} 
        />
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>Расписание тренировок</h2>
            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Выберите день для просмотра расписания</p>
          </div>
          
          <Calendar onDateSelect={setSelectedDate} />
          
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
            <h3 className="font-semibold mb-2">💡 Подсказка</h3>
            <p className="text-sm text-blue-100">
              Нажмите на любой день в календаре, чтобы увидеть расписание занятий, 
              информацию о тренерах и доступных аудиториях.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;