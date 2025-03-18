import { useCallback } from 'react';

/**
 * Хук для создания эффекта матричного декодирования текста
 */
export const useMatrixEffect = () => {
  // Латинские символы и символы для матричного эффекта
  const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,./<>?~`";
  
  // Функция анимации
  const animateText = useCallback((element: HTMLElement) => {
    // Получаем оригинальный текст
    const originalText = element.getAttribute('data-original') || element.innerText;
    
    // Сохраняем оригинальный текст
    if (!element.getAttribute('data-original')) {
      element.setAttribute('data-original', originalText);
    }
    
    // Очищаем существующую анимацию
    if ((element as any).interval) {
      clearInterval((element as any).interval);
    }
    
    // Подход к анимации:
    // 1. Фаза случайных символов
    // 2. Фаза постепенного раскрытия текста
    let phase = 'random';
    let iteration = 0;
    const originalLength = originalText.length;
    const randomDuration = 400; // 400мс случайных символов
    const startTime = Date.now();
    
    const step = () => {
      const currentTime = Date.now();
      
      // Переключение фазы
      if (phase === 'random' && currentTime - startTime > randomDuration) {
        phase = 'reveal';
        iteration = 0;
      }
      
      if (phase === 'random') {
        // Отображаем только случайные символы
        element.innerText = originalText
          .split("")
          .map(letter => {
            if (letter === ' ') return ' ';
            const randomChar = Math.random() > 0.5 
              ? matrixChars[Math.floor(Math.random() * matrixChars.length)]
              : matrixChars[Math.floor(Math.random() * (matrixChars.length / 2))];
            return randomChar;
          })
          .join("");
      } else {
        // Постепенно раскрываем оригинальный текст
        element.innerText = originalText
          .split("")
          .map((letter, index) => {
            if (letter === ' ') return ' ';
            if (index < iteration) {
              return originalText[index];
            }
            const randomChar = Math.random() > 0.5 
              ? matrixChars[Math.floor(Math.random() * matrixChars.length)]
              : matrixChars[Math.floor(Math.random() * (matrixChars.length / 2))];
            return randomChar;
          })
          .join("");
        
        if (iteration >= originalLength) {
          clearInterval((element as any).interval);
        }
        
        iteration += 0.25;
      }
    };
    
    (element as any).interval = setInterval(step, 25);
  }, []);

  return { animateText };
};

export default useMatrixEffect;
