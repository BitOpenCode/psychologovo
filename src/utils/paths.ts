// Утилиты для правильных путей к статическим файлам
// Работает как локально, так и в GitHub Pages

export const getStaticPath = (path: string): string => {
  // Если мы в GitHub Pages, добавляем имя репозитория
  if (window.location.hostname === 'bitopencode.github.io') {
    return `/psychologovo${path}`;
  }
  
  // Локально используем обычный путь
  return path;
};

// Пути к основным статическим файлам
export const LOGO_PATH = getStaticPath('/logo.svg');
export const PROFILE_IMAGE_PATH = getStaticPath('/profile-default.png');
