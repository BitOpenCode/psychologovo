import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { LOGO_PATH } from '../../utils/paths';

const Home: React.FC = () => {
  const { isDark } = useTheme();

  const psyhologovoCards = [
    {
      title: "Что такое Психологово?",
      icon: "🧠",
      content: "Психологово - это индивидуальная работа без долгой диагностики и воды. Мы создали эффективное сообщество опытных психологов, попадая в которое, ты получишь решение именно твоего запроса."
    },
    {
      title: "Для кого?",
      icon: "👥",
      content: "Для тех, кто готов встретиться с собой настоящим. Для тех, кто хочет увеличить свой масштаб личности и почувствовать новое состояние, чтобы предпринимать новые действия и получать новые результаты."
    },
    {
      title: "Зачем?",
      icon: "💎",
      content: "С тобой все хорошо! Мы не будем менять и исправлять тебя. Мы сделаем тебя больше, увеличим масштаб личности через присвоение уязвимых частей, с которыми было страшно встречаться."
    },
    {
      title: "Как это работает?",
      icon: "🚀",
      content: "Уже через месяц работы ты увидишь изменения и результат. В твоей слабости много силы, которой ты не пользуешься. С нами ты проживешь новый опыт, который поможет получить сильные результаты в личностном росте и бизнесе."
    }
  ];

  const problemsList = [
    "Тащишь все на себе? Кажется, что если ты ослабишь хватку, жизнь выйдет из под контроля?",
    "Живешь не свою жизнь? Ставишь интересы других выше своих?",
    "Страшно поменять работу/мужчину/место жительства?",
    "Тяжело переживаешь неудачи, рост только через боль?",
    "Боишься поставить справедливую цену за свою работу?",
    "Хочешь развиваться, но нет сил?",
    "Хочешь творить, но приходится делать как говорят другие?",
    "Страшно сближаться? Не можешь отпустить контроль?",
    "Надоело сомневаться в себе и правильности принятых решений?",
    "Пережил тяжелое потрясение в прошлом и постоянно в мыслях возвращаешься к нему?",
    "Не любишь себя и свое тело?"
  ];

  const resultsList = [
    "Ощутишь уверенность в себе и внутренний стержень",
    "Почувствуешь свою нужность и независимость от чужого мнения",
    "Твоя жизнь станет ярче, вкуснее и насыщеннее",
    "Построишь теплые отношения с партнером, родителями и друзьями",
    "Перестанешь сравнивать себя с другими и начнёшь жить своей жизнью",
    "Успокоишься, отпустишь контроль, тревожность и наконец сосредоточишься на важных вещах",
    "Сдвинешься с мертвой точки. Поймешь свои достижения, забудешь про синдром самозванца"
  ];

  const services = [
    {
      title: "Сопровождение от команды Психологово",
      duration: "3 месяца",
      sessions: "12 сессий",
      price: "160 000 ₽",
      features: [
        "Личный чат 24/7",
        "Есть рассрочка",
        "Самостоятельные практики"
      ]
    },
    {
      title: "Разовая консультация",
      duration: "1-1.5 часа",
      sessions: "1 сессия",
      price: "5 000 ₽",
      features: [
        "Точечное решение проблемы",
        "Знакомство с подходом",
        "Быстрый результат"
      ]
    },
    {
      title: "Тройничок",
      duration: "3 месяца",
      sessions: "10 сессий",
      price: "270 000 ₽",
      features: [
        "Два психолога одновременно",
        "Авторская программа",
        "Максимальная поддержка"
      ]
    }
  ];

  return (
    <div className="max-w-md mx-auto px-4 py-6 md:max-w-4xl">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-psyhologovo-500 shadow-2xl bg-white p-1">
            <img 
              src={LOGO_PATH} 
              alt="Психологово π Logo" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-psyhologovo-500 to-psyhologovo-700 bg-clip-text text-transparent">
          ПСИХОЛОГОВО
        </h1>
        <p className={`text-lg md:text-xl ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          для тех, кто готов встретиться с собой настоящим
        </p>
      </div>

      {/* 4 Main Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {psyhologovoCards.map((card, index) => (
          <div key={index} className={`p-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 ${
            isDark 
              ? 'bg-psyhologovo-dark-800 border border-psyhologovo-dark-700 hover:border-psyhologovo-500' 
              : 'bg-white border border-gray-200 hover:border-psyhologovo-500 shadow-xl'
          }`}>
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">{card.icon}</span>
              <h3 className="text-xl font-bold bg-gradient-to-r from-psyhologovo-500 to-psyhologovo-700 bg-clip-text text-transparent">
                {card.title}
              </h3>
            </div>
            <p className={`leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {card.content}
            </p>
          </div>
        ))}
      </div>

      {/* Problems Section */}
      <div className={`p-8 rounded-2xl mb-8 ${
        isDark 
          ? 'bg-gradient-to-r from-psyhologovo-dark-800 to-psyhologovo-dark-900 border border-psyhologovo-dark-700' 
          : 'bg-gradient-to-r from-psyhologovo-50 to-white border border-psyhologovo-200'
      }`}>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-psyhologovo-500 to-psyhologovo-700 bg-clip-text text-transparent">
          Мы знаем, что внутри каждого из вас есть силы справиться с этими трудностями
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {problemsList.map((problem, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-psyhologovo-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className={`text-sm leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {problem}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className={`p-8 rounded-2xl mb-8 ${
        isDark 
          ? 'bg-gradient-to-r from-psyhologovo-900/50 to-psyhologovo-800/50 border border-psyhologovo-700' 
          : 'bg-gradient-to-r from-psyhologovo-100 to-psyhologovo-50 border border-psyhologovo-300'
      }`}>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-psyhologovo-600">
          Вот, что будет на выходе:
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resultsList.map((result, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-psyhologovo-600 rounded-full mt-2 flex-shrink-0"></div>
              <span className={`text-sm leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {result}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div className={`p-8 rounded-2xl mb-8 ${
        isDark 
          ? 'bg-gradient-to-r from-psyhologovo-dark-800 to-psyhologovo-dark-900 border border-psyhologovo-dark-700' 
          : 'bg-gradient-to-r from-gray-50 to-white border border-gray-200'
      }`}>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-psyhologovo-500 to-psyhologovo-700 bg-clip-text text-transparent">
          Наши услуги
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div key={index} className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105 ${
              isDark 
                ? 'bg-psyhologovo-dark-700 border-psyhologovo-dark-600 hover:border-psyhologovo-500' 
                : 'bg-white border-gray-200 hover:border-psyhologovo-500 shadow-lg'
            }`}>
              <h3 className="text-lg font-bold mb-3 text-psyhologovo-600">
                {service.title}
              </h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {service.duration} • {service.sessions}
                </p>
                <p className="text-2xl font-bold text-psyhologovo-600 mt-2">
                  {service.price}
                </p>
              </div>
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-psyhologovo-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className={`text-center p-8 rounded-2xl ${
        isDark 
          ? 'bg-gradient-to-r from-psyhologovo-900/50 to-psyhologovo-800/50 border border-psyhologovo-700' 
          : 'bg-gradient-to-r from-psyhologovo-100 to-psyhologovo-50 border border-psyhologovo-300'
      }`}>
        <h3 className="text-2xl font-bold mb-4 text-psyhologovo-600">
          Готовы встретиться с собой настоящим?
        </h3>
        <p className={`text-lg mb-6 ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Наша команда поможет почувствовать в себе эту силу и будет сопровождать тебя на этом пути
        </p>
        <button className={`px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-psyhologovo-500 to-psyhologovo-700 hover:from-psyhologovo-600 hover:to-psyhologovo-800 transition-all duration-300 transform hover:scale-105 shadow-lg`}>
          Получить бесплатную консультацию
        </button>
      </div>
    </div>
  );
};

export default Home;