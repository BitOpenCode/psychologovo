import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { ArrowLeft, Clock, Calendar, Globe, Award, Users, CheckCircle, Heart, Brain, Star, MessageCircle, CreditCard, BookOpen } from 'lucide-react';

interface CourseDetailsProps {
  courseId: number;
  onBack: () => void;
}

interface ServiceModule {
  id: number;
  title: string;
  description: string;
  content: string[];
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ courseId, onBack }) => {
  const { isDark } = useTheme();
  const [expandedModules, setExpandedModules] = useState<number[]>([]);

  // Данные об услугах
  const services = {
    1: {
      id: 1,
      title: 'Сопровождение от команды Психологово',
      type: 'Комплексная программа',
      startDate: 'В любое время',
      duration: '3 месяца',
      format: 'Онлайн + Офлайн',
      document: 'Сертификат',
      price: '160 000 ₽',
      monthlyPrice: '53 333 ₽/мес',
      image: '/logo.svg',
      features: [
        'Личный чат 24/7',
        'Есть рассрочка',
        'Самостоятельные практики',
        'Индивидуальный подход',
        'Поддержка команды'
      ]
    },
    2: {
      id: 2,
      title: 'Разовая консультация',
      type: 'Точечная помощь',
      startDate: 'В любое время',
      duration: '1-1.5 часа',
      format: 'Онлайн',
      document: 'Консультация',
      price: '5 000 ₽',
      monthlyPrice: null,
      image: '/logo.svg',
      features: [
        'Точечное решение проблемы',
        'Знакомство с подходом',
        'Быстрый результат',
        'Конкретная помощь'
      ]
    },
    3: {
      id: 3,
      title: 'Тройничок',
      type: 'Авторская программа',
      startDate: 'В любое время',
      duration: '3 месяца',
      format: 'Онлайн + Офлайн',
      document: 'Сертификат',
      price: '270 000 ₽',
      monthlyPrice: '90 000 ₽/мес',
      image: '/logo.svg',
      features: [
        'Два психолога одновременно',
        'Авторская программа',
        'Максимальная поддержка',
        'Индивидуальный чат на троих'
      ]
    },
    4: {
      id: 4,
      title: 'Консультация с основателями',
      type: 'Премиум',
      startDate: 'В любое время',
      duration: '1 час',
      format: 'Онлайн',
      document: 'Консультация',
      price: '10 000 ₽',
      monthlyPrice: null,
      image: '/logo.svg',
      features: [
        'Опыт 1000+ положительных отзывов',
        'Авторские методики',
        'Международный опыт',
        'Психологи выездных ретритов'
      ]
    }
  };

  // Модули программы сопровождения
  const accompanimentModules: ServiceModule[] = [
    {
      id: 1,
      title: 'Диагностика и постановка целей',
      description: 'Первичная встреча и определение направления работы',
      content: [
        'Анализ текущей ситуации',
        'Выявление ключевых проблем',
        'Постановка SMART-целей',
        'Планирование терапевтического процесса'
      ]
    },
    {
      id: 2,
      title: 'Работа с уязвимыми частями личности',
      description: 'Исследование и принятие сложных аспектов себя',
      content: [
        'Идентификация уязвимых зон',
        'Техники самопринятия',
        'Работа со страхами и тревогами',
        'Развитие внутренней силы'
      ]
    },
    {
      id: 3,
      title: 'Развитие масштаба личности',
      description: 'Расширение границ возможностей и потенциала',
      content: [
        'Техники самопознания',
        'Развитие уверенности',
        'Построение здоровых границ',
        'Увеличение личностного влияния'
      ]
    },
    {
      id: 4,
      title: 'Практические инструменты',
      description: 'Конкретные техники для ежедневного применения',
      content: [
        'Дыхательные практики',
        'Медитативные техники',
        'Когнитивно-поведенческие методы',
        'Телесно-ориентированные подходы'
      ]
    }
  ];

  // Модули программы "Тройничок"
  const troynichokModules: ServiceModule[] = [
    {
      id: 1,
      title: 'Еженедельные темы',
      description: 'Новая тема каждую неделю для системного развития',
      content: [
        'Тема 1: Встреча с собой настоящим',
        'Тема 2: Работа с уязвимостью',
        'Тема 3: Развитие внутренней силы',
        'Тема 4: Построение здоровых отношений'
      ]
    },
    {
      id: 2,
      title: 'Двойная поддержка',
      description: 'Работа с двумя психологами одновременно',
      content: [
        'Мужское и женское видение',
        'Мягкость и прямолинейность',
        'Рациональное и иррациональное',
        'Духовное и материальное'
      ]
    },
    {
      id: 3,
      title: 'Индивидуальный чат на троих',
      description: 'Постоянная поддержка между сессиями',
      content: [
        'Регулярные ответы на вопросы',
        'Поддержка в сложные моменты',
        'Радость за победы',
        'Помощь в разборе чувств'
      ]
    }
  ];

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const currentService = services[courseId as keyof typeof services];
  const modules = courseId === 1 ? accompanimentModules : courseId === 3 ? troynichokModules : [];

  if (!currentService) {
    return (
      <div className="max-w-md mx-auto px-4 py-6 md:max-w-4xl md:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Услуга не найдена</h1>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-psyhologovo-500 text-white rounded hover:bg-psyhologovo-600"
          >
            Вернуться назад
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 md:max-w-4xl md:px-8 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className={`p-2 rounded-lg shadow-sm hover:shadow-md transition-all ${
            isDark ? 'bg-psyhologovo-dark-800' : 'bg-white'
          }`}
        >
          <ArrowLeft className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
        </button>
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {currentService.title}
          </h1>
        </div>
      </div>

      {/* Service Image */}
      <div className="mb-8">
        <div className="w-full h-64 bg-gradient-to-br from-psyhologovo-100 to-psyhologovo-200 rounded-xl shadow-lg flex items-center justify-center">
          <img 
            src={currentService.image} 
            alt={currentService.title}
            className="w-32 h-32 object-contain"
          />
        </div>
      </div>

      {/* Service Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className={`p-4 rounded-xl ${isDark ? 'bg-psyhologovo-dark-800' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-4 h-4 text-psyhologovo-500" />
            <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Старт программы
            </span>
          </div>
          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {currentService.startDate}
          </p>
        </div>

        <div className={`p-4 rounded-xl ${isDark ? 'bg-psyhologovo-dark-800' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-psyhologovo-500" />
            <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Длительность
            </span>
          </div>
          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {currentService.duration}
          </p>
        </div>

        <div className={`p-4 rounded-xl ${isDark ? 'bg-psyhologovo-dark-800' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center space-x-2 mb-2">
            <Globe className="w-4 h-4 text-psyhologovo-500" />
            <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Формат
            </span>
          </div>
          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {currentService.format}
          </p>
        </div>

        <div className={`p-4 rounded-xl ${isDark ? 'bg-psyhologovo-dark-800' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center space-x-2 mb-2">
            <Award className="w-4 h-4 text-psyhologovo-500" />
            <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Результат
            </span>
          </div>
          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {currentService.document}
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className={`p-6 rounded-xl ${isDark ? 'bg-psyhologovo-dark-800' : 'bg-white'} shadow-sm mb-8`}>
        <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Что включено:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentService.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-psyhologovo-500 flex-shrink-0" />
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* For Whom Section */}
      <div className={`p-6 rounded-xl ${isDark ? 'bg-psyhologovo-dark-800' : 'bg-white'} shadow-sm mb-8`}>
        <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Для кого подходит:
        </h2>
        <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {courseId === 1 ? 'Для тех, кто готов к глубокой работе над собой и хочет:' :
           courseId === 2 ? 'Для тех, кто хочет точечно разобрать один запрос:' :
           courseId === 3 ? 'Для тех, кто хочет получить максимальную поддержку:' :
           'Для тех, кто хочет работать с основателями центра:'}
        </p>
        <ul className="space-y-2 mb-4">
          {courseId === 1 ? [
            'Встретиться с собой настоящим и увеличить масштаб личности.',
            'Получить поддержку команды психологов на протяжении всего пути.',
            'Освоить практические инструменты для ежедневного применения.',
            'Достичь устойчивых изменений в жизни и отношениях.',
            'Получить доступ к личному чату 24/7 с психологом.'
          ] : courseId === 2 ? [
            'Быстро решить конкретную проблему.',
            'Познакомиться с нашим подходом.',
            'Получить план действий для решения запроса.',
            'Понять, подходит ли вам длительная работа.',
            'Получить рекомендации по дальнейшему развитию.'
          ] : courseId === 3 ? [
            'Получить поддержку от двух психологов одновременно.',
            'Использовать разные терапевтические подходы.',
            'Получить максимальное внимание и заботу.',
            'Достичь результатов быстрее и эффективнее.',
            'Иметь постоянную поддержку в чате на троих.'
          ] : [
            'Работать с опытными психологами с международным опытом.',
            'Получить доступ к авторским методикам.',
            'Работать с психологами выездных ретритов.',
            'Получить консультацию от специалистов с 1000+ отзывами.',
            'Получить премиальный уровень обслуживания.'
          ].map((item, index) => (
            <li key={index} className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-psyhologovo-500 mt-0.5 flex-shrink-0" />
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* What You'll Learn Section */}
      <div className={`p-6 rounded-xl ${isDark ? 'bg-psyhologovo-dark-800' : 'bg-white'} shadow-sm mb-8`}>
        <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Что вы получите:
        </h2>
        <ul className="space-y-2 mb-4">
          {courseId === 1 ? [
            'Устойчивые изменения в жизни и отношениях.',
            'Увеличение масштаба личности и внутренней силы.',
            'Практические инструменты для самопомощи.',
            'Поддержку команды психологов на протяжении 3 месяцев.',
            'Доступ к личному чату 24/7.'
          ] : courseId === 2 ? [
            'Конкретное решение вашего запроса.',
            'План действий для дальнейшего развития.',
            'Понимание нашего подхода к работе.',
            'Рекомендации по выбору формата работы.',
            'Быстрый результат за 1-1.5 часа.'
          ] : courseId === 3 ? [
            'Максимальную поддержку от двух психологов.',
            'Разные терапевтические подходы и методики.',
            'Индивидуальный чат на троих для постоянной поддержки.',
            'Быстрые и устойчивые результаты.',
            'Уникальный опыт работы с двумя специалистами.'
          ] : [
            'Консультацию от опытных психологов с международным опытом.',
            'Доступ к авторским методикам и подходам.',
            'Премиальный уровень обслуживания.',
            'Работу с психологами выездных ретритов.',
            'Опыт работы с профессионалами высокого уровня.'
          ].map((item, index) => (
            <li key={index} className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-psyhologovo-500 mt-0.5 flex-shrink-0" />
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Program Structure Section - только для длительных программ */}
      {modules.length > 0 && (
        <div className={`p-6 rounded-xl ${isDark ? 'bg-psyhologovo-dark-800' : 'bg-white'} shadow-sm mb-8`}>
          <h2 className={`text-2xl font-bold mb-6 text-center ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Структура программы
          </h2>
          
          <div className="space-y-4">
            {modules.map((module) => (
              <div key={module.id} className={`border rounded-lg ${isDark ? 'border-psyhologovo-dark-700' : 'border-psyhologovo-200'}`}>
                <button
                  onClick={() => toggleModule(module.id)}
                  className={`w-full p-4 text-left flex items-center justify-between hover:bg-opacity-50 transition-colors ${
                    isDark ? 'hover:bg-psyhologovo-dark-700' : 'hover:bg-psyhologovo-50'
                  }`}
                >
                  <div>
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      Модуль {module.id}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {module.title}
                    </p>
                  </div>
                  <div className={`transform transition-transform ${expandedModules.includes(module.id) ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                {expandedModules.includes(module.id) && (
                  <div className={`p-4 border-t ${isDark ? 'border-psyhologovo-dark-700 bg-psyhologovo-dark-750' : 'border-psyhologovo-200 bg-psyhologovo-50'}`}>
                    <p className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {module.description}
                    </p>
                    <ul className="space-y-1">
                      {module.content.map((item, index) => (
                        <li key={index} className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pricing Section */}
      <div className={`p-6 rounded-xl ${isDark ? 'bg-psyhologovo-dark-800' : 'bg-white'} shadow-sm mb-8`}>
        <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Стоимость услуги
        </h2>
        <p className={`text-sm mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Выберите удобный способ оплаты или получите бесплатную консультацию
        </p>
        
        <div className={`p-6 rounded-lg ${isDark ? 'bg-psyhologovo-500/20 border border-psyhologovo-500/30' : 'bg-psyhologovo-500/10 border border-psyhologovo-500/20'}`}>
          <h3 className={`font-semibold mb-3 text-psyhologovo-600`}>
            {currentService.title}
          </h3>
          <div className="flex items-center space-x-3 mb-3">
            <span className={`text-3xl font-bold text-psyhologovo-600`}>
              {currentService.price}
            </span>
          </div>
          {currentService.monthlyPrice && (
            <p className={`text-lg font-semibold text-psyhologovo-600 mb-3`}>
              {currentService.monthlyPrice}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {currentService.features.slice(0, 4).map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-psyhologovo-500" />
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature}
                </span>
              </div>
            ))}
          </div>
          <button className={`w-full px-6 py-3 bg-psyhologovo-500 hover:bg-psyhologovo-600 text-white font-semibold rounded-lg transition-colors duration-300`}>
            Записаться на консультацию
          </button>
        </div>
      </div>

      {/* Bottom Navigation Placeholder */}
      <div className="h-20"></div>
    </div>
  );
};

export default CourseDetails;
