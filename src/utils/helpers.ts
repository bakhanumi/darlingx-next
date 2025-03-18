import { useEffect } from 'react';

/**
 * Хук для добавления матричной анимации к текстовым элементам
 */
export const useMatrixAnimationEffect = () => {
  useEffect(() => {
    // Символы для матричного эффекта
    const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,./<>?~`";
    
    // Функция анимации для элемента
    const animateElement = (element: HTMLElement) => {
      // Получаем оригинальный текст
      const originalText = element.getAttribute('data-original') || element.innerText;
      
      // Сохраняем оригинальный текст, если его еще нет
      if (!element.getAttribute('data-original')) {
        element.setAttribute('data-original', originalText);
      }
      
      // Удаляем предыдущую анимацию, если она существует
      if ((element as any).interval) {
        clearInterval((element as any).interval);
      }
      
      // Настройки анимации
      let phase = 'random'; // Начальная фаза - случайные символы
      let iteration = 0;
      const originalLength = originalText.length;
      const randomDuration = 400; // 400мс случайных символов
      const startTime = Date.now();
      
      // Функция одного шага анимации
      const step = () => {
        const currentTime = Date.now();
        
        // Переключаемся на фазу раскрытия текста после случайной фазы
        if (phase === 'random' && currentTime - startTime > randomDuration) {
          phase = 'reveal';
          iteration = 0;
        }
        
        if (phase === 'random') {
          // Фаза случайных символов
          element.innerText = originalText
            .split("")
            .map(letter => {
              if (letter === ' ') return ' ';
              return matrixChars[Math.floor(Math.random() * matrixChars.length)];
            })
            .join("");
        } else {
          // Фаза постепенного раскрытия
          element.innerText = originalText
            .split("")
            .map((letter, index) => {
              if (letter === ' ') return ' ';
              if (index < iteration) {
                return originalText[index];
              }
              return matrixChars[Math.floor(Math.random() * matrixChars.length)];
            })
            .join("");
          
          // Заканчиваем анимацию, когда весь текст раскрыт
          if (iteration >= originalLength) {
            clearInterval((element as any).interval);
          }
          
          iteration += 0.25;
        }
      };
      
      // Запускаем интервал анимации
      (element as any).interval = setInterval(step, 25);
    };

    // Добавляем обработчики событий к элементам с классом animate_letters
    const setupAnimations = () => {
      document.querySelectorAll('.animate_letters').forEach((element) => {
        if (!element.hasAttribute('data-animation-setup')) {
          element.setAttribute('data-animation-setup', 'true');
          
          element.addEventListener('mouseenter', () => {
            // Проверяем, что элемент не в карточке книги
            if (!element.closest('.book-card')) {
              animateElement(element as HTMLElement);
            }
          });
        }
      });
    };
    
    // Настраиваем начальные анимации
    setupAnimations();
    
    // Используем MutationObserver для отслеживания новых элементов
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          setupAnimations();
        }
      });
    });
    
    // Начинаем наблюдение за DOM
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Очистка при размонтировании
    return () => {
      observer.disconnect();
      
      // Очищаем все интервалы анимации
      document.querySelectorAll('.animate_letters').forEach((element) => {
        if ((element as any).interval) {
          clearInterval((element as any).interval);
        }
      });
    };
  }, []);
};

/**
 * Функция для форматирования даты в читаемый формат
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return dateString; // Возвращаем исходную строку, если парсинг не удался
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

/**
 * Хук для имитации анимации загрузки страницы
 */
export const usePageLoadEffect = () => {
  useEffect(() => {
    // Добавляем класс загрузки
    document.body.classList.add('page-loading');
    
    // Удаляем класс после короткой задержки
    const timeout = setTimeout(() => {
      document.body.classList.remove('page-loading');
    }, 300);
    
    return () => {
      clearTimeout(timeout);
      document.body.classList.remove('page-loading');
    };
  }, []);
};
