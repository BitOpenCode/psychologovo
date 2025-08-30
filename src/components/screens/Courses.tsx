import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Clock, Award, Users, Play, BookOpen, Heart, Brain, Star } from 'lucide-react';
import EventsList from '../EventsList';
import CourseDetails from './CourseDetails';

const Courses: React.FC = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  
  const isAdmin = user?.role === 'admin';

  const handleCourseSelect = (courseId: number) => {
    setSelectedCourse(courseId);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
  };

  const services = [
    {
      id: 1,
      title: 'Сопровождение от команды Психологово',
      duration: '3 месяца',
      type: 'Комплексная программа',
      price: '160 000 ₽',
      startDate: 'В любое время',
      description: 'Индивидуальная работа с командой психологов. 12 сессий с личным чатом 24/7, самостоятельными практиками и рассрочкой.',
      features: [
        'Личный чат 24/7',
        'Есть рассрочка',
        'Самостоятельные практики',
        'Индивидуальный подход',
        'Поддержка команды'
      ],
      icon: Heart,
      benefits: [
        'Каждый член команды глубоко работает с определенной темой',
        'Подбор специалиста под твой запрос',
        'Супервизия каждые 2 недели',
        'Общие ценности и видение процесса'
      ]
    },
    {
      id: 2,
      title: 'Разовая консультация',
      duration: '1-1.5 часа',
      type: 'Точечная помощь',
      price: '5 000 ₽',
      startDate: 'В любое время',
      description: 'Подойдет тем, кто хочет точечно разобрать один запрос или познакомиться с нашим подходом.',
      features: [
        'Точечное решение проблемы',
        'Знакомство с подходом',
        'Быстрый результат',
        'Конкретная помощь'
      ],
      icon: Brain,
      benefits: [
        'Помогает увидеть ситуацию в целом',
        'Осознать назревшие цели и задачи',
        'Понять, что мешает реализации',
        'Найти внутренние и внешние ресурсы'
      ]
    },
    {
      id: 3,
      title: 'Тройничок',
      duration: '3 месяца',
      type: 'Авторская программа',
      price: '270 000 ₽',
      startDate: 'В любое время',
      description: 'Уникальный терапевтический опыт с двумя психологами одновременно. Каждую неделю новая тема для работы.',
      features: [
        'Два психолога одновременно',
        'Авторская программа',
        'Максимальная поддержка',
        'Индивидуальный чат на троих'
      ],
      icon: Star,
      benefits: [
        'Две пары мозгов - минимум слепых зон',
        'Мужское и женское видение',
        'Мягкость и прямолинейность',
        'Рациональное и иррациональное'
      ]
    },
    {
      id: 4,
      title: 'Консультация с основателями',
      duration: '1 час',
      type: 'Премиум',
      price: '10 000 ₽',
      startDate: 'В любое время',
      description: 'Сессия с основателями центра Иваном и Светланой Бобровыми. Создатели авторской методики краткосрочной работы с травмами.',
      features: [
        'Опыт 1000+ положительных отзывов',
        'Авторские методики',
        'Международный опыт',
        'Психологи выездных ретритов'
      ],
      icon: Users,
      benefits: [
        'Частная практика с 2018 года',
        'Коучи ICF и ICU',
        'Гипнотерапия и психосоматика',
        'Опыт работы на Мальдивах, Бали, в Таиланде'
      ]
    }
  ];

  // Если выбран курс, показываем детальный экран
  if (selectedCourse) {
    return (
      <CourseDetails 
        courseId={selectedCourse}
        onBack={handleBackToCourses}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 md:max-w-4xl">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-psyhologovo-500 to-psyhologovo-700 bg-clip-text text-transparent">
          Наши услуги
        </h1>
        <p className={`text-lg ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Индивидуальная работа без долгой диагностики и воды
        </p>
      </div>

      {/* Services Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-psyhologovo-500 to-psyhologovo-700 bg-clip-text text-transparent">
          Психологические услуги
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.id} className={`p-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 ${
                isDark 
                  ? 'bg-psyhologovo-dark-800 border border-psyhologovo-dark-700 hover:border-psyhologovo-500' 
                  : 'bg-white border border-gray-200 hover:border-psyhologovo-500 shadow-xl'
              }`}>
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-lg bg-psyhologovo-500/10 dark:bg-psyhologovo-500/20 mr-4">
                    <Icon className="w-6 h-6 text-psyhologovo-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                      {service.title}
                    </h3>
                    <span className="text-sm text-psyhologovo-500 font-medium">
                      {service.type}
                    </span>
                  </div>
                </div>
                
                <p className={`text-sm mb-4 leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {service.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {service.duration}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {service.startDate}
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-psyhologovo-100 text-psyhologovo-800 dark:bg-psyhologovo-900/30 dark:text-psyhologovo-400 text-sm font-medium rounded-full">
                    {service.price}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  {service.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-psyhologovo-500 rounded-full"></div>
                      <span className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => handleCourseSelect(service.id)}
                  className={`w-full mt-4 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isDark
                      ? 'bg-psyhologovo-500 hover:bg-psyhologovo-600 text-white'
                      : 'bg-psyhologovo-500 hover:bg-psyhologovo-600 text-white'
                  }`}>
                  Подробнее
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className={`p-6 rounded-2xl mb-8 ${
        isDark 
          ? 'bg-gradient-to-r from-psyhologovo-900/50 to-psyhologovo-800/50 border border-psyhologovo-700' 
          : 'bg-gradient-to-r from-psyhologovo-100 to-psyhologovo-50 border border-psyhologovo-300'
      }`}>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-psyhologovo-600">
            Почему выбирают нас?
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-psyhologovo-500 rounded-full mt-2 flex-shrink-0"></div>
            <span className={`text-sm leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Мы сами были клиентами у наших психологов и прочувствовали результаты терапии на себе
            </span>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-psyhologovo-500 rounded-full mt-2 flex-shrink-0"></div>
            <span className={`text-sm leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Каждые 2 недели психологи проходят супервизию у Светланы и Ивана Бобровых
            </span>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-psyhologovo-500 rounded-full mt-2 flex-shrink-0"></div>
            <span className={`text-sm leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              У нас общие ценности и видение терапевтического процесса
            </span>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-psyhologovo-500 rounded-full mt-2 flex-shrink-0"></div>
            <span className={`text-sm leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Мы не ждем, пока у вас появятся проблемы - помогаем стать сильнее уже сейчас
            </span>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className={`p-6 rounded-2xl ${
        isDark 
          ? 'bg-gradient-to-r from-psyhologovo-900/50 to-psyhologovo-800/50 border border-psyhologovo-700' 
          : 'bg-gradient-to-r from-psyhologovo-100 to-psyhologovo-50 border border-psyhologovo-300'
      }`}>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-psyhologovo-600">
            Ближайшие события
          </h2>
        </div>
        
        <EventsList 
          onEditEvent={undefined}
          onDeleteEvent={undefined}
        />
      </div>
    </div>
  );
};

export default Courses;