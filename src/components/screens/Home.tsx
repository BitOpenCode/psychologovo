import React from 'react';
import { TrendingUp, Users, Award, Play, Clock, Star } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Home: React.FC = () => {
  const { isDark } = useTheme();
  
  const newsItems = [
    {
      id: 1,
      title: 'Новая программа похудения "FIT TRANSFORMATION"',
      excerpt: 'Эксклюзивная 30-дневная программа для быстрого и безопасного похудения',
      image: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Программы',
      readTime: '5 мин',
    },
    {
      id: 2,
      title: 'Топ-5 упражнений для укрепления кора',
      excerpt: 'Эффективные упражнения для развития мышц пресса и спины',
      image: 'https://images.pexels.com/photos/416717/pexels-photo-416717.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Упражнения',
      readTime: '7 мин',
    },
    {
      id: 3,
      title: 'Правильное питание после тренировки',
      excerpt: 'Что есть после тренировки для максимального эффекта',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Питание',
      readTime: '4 мин',
    },
  ];

  const reviews = [
    {
      id: 1,
      name: 'Анна Петрова',
      rating: 5,
      text: 'Отличное приложение! За 2 месяца сбросила 8 кг. Очень удобное расписание и мотивирующие тренеры.',
      program: 'FIT TRANSFORMATION',
    },
    {
      id: 2,
      name: 'Дмитрий Сидоров',
      rating: 5,
      text: 'Профессиональный подход и отличные результаты. Набрал 5 кг мышечной массы за 3 месяца.',
      program: 'MUSCLE BUILDING',
    },
  ];

  const stats = [
    { label: 'Активных пользователей', value: '25,000+', icon: Users },
    { label: 'Программ тренировок', value: '150+', icon: TrendingUp },
    { label: 'Сертифицированных\nтренеров', value: '50+', icon: Award },
  ];

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6 md:max-w-4xl md:px-8 transition-colors duration-300">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-purple-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Добро пожаловать в IRFIT!</h2>
        <p className="text-orange-100 mb-4">Твой путь к идеальной форме начинается здесь</p>
        <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full font-medium transition-all hover:bg-white/30">
          <Play className="w-4 h-4 inline mr-2" />
          Начать тренировку
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`rounded-xl p-4 text-center shadow-sm transition-colors duration-300 ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}>
              <Icon className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{stat.value}</div>
              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} whitespace-pre-line leading-tight`}>{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* News & Articles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Статьи и новости</h3>
          <button className="text-orange-500 text-sm font-medium">Все статьи</button>
        </div>
        
        <div className="space-y-4">
          {newsItems.map((item) => (
            <div key={item.id} className={`rounded-xl overflow-hidden shadow-sm transition-colors duration-300 ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="md:flex">
                <div className="md:w-32 md:flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="p-4 md:flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                    <div className={`flex items-center text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Clock className="w-3 h-3 mr-1" />
                      {item.readTime}
                    </div>
                  </div>
                  <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>{item.title}</h4>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{item.excerpt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Отзывы пользователей</h3>
        
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className={`rounded-xl p-4 shadow-sm transition-colors duration-300 ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{review.name}</div>
                  <div className="text-sm text-orange-600">{review.program}</div>
                </div>
                <div className="flex items-center">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;