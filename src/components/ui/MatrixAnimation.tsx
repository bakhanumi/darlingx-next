import React, { useEffect, useState } from 'react';

// Хук для использования матричной анимации
export const useMatrixEffect = () => {
  // Латинские символы и символы для матричного эффекта
  const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,./<>?~`";
  
  // Функция анимации текста
  const animateText = (element: HTMLElement) => {
    // Получаем оригинальный текст
    const originalText = element.getAttribute('data-original') || element.innerText;
    
    // Сохраняем оригинальный текст, если он еще не сохранен
    if (!element.getAttribute('data-original')) {
      element.setAttribute('data-original', originalText);
    }
    
    // Очищаем существующую анимацию
    if ((element as any).interval) {
      clearInterval((element as any).interval);
    }
    
    // Новый подход к анимации:
    // 1. Первая фаза: чисто случайные символы в течение 1 секунды
    // 2. Вторая фаза: постепенное раскрытие оригинального текста
    
    let phase = 'random'; // Начинаем со случайной фазы
    let iteration = 0;
    const originalLength = originalText.length;
    const randomDuration = 400; // 0.4 секунды чисто случайных символов
    const startTime = Date.now();
    
    const step = () => {
      const currentTime = Date.now();
      
      // Проверяем, нужно ли переключиться на фазу раскрытия
      if (phase === 'random' && currentTime - startTime > randomDuration) {
        phase = 'reveal';
        iteration = 0; // Сбрасываем итерацию для фазы раскрытия
      }
      
      if (phase === 'random') {
        // Отображаем только случайные символы во время первой фазы
        element.innerText = originalText
          .split("")
          .map(letter => {
            if (letter === ' ') return ' ';
            // Добавляем больше случайных символов для более богатого эффекта
            const randomChar = Math.random() > 0.5 
              ? matrixChars[Math.floor(Math.random() * matrixChars.length)]
              : matrixChars[Math.floor(Math.random() * (matrixChars.length / 2))];
            return randomChar;
          })
          .join("");
      } else {
        // Фаза раскрытия: постепенно показываем оригинальный текст
        element.innerText = originalText
          .split("")
          .map((letter, index) => {
            if (letter === ' ') return ' ';
            if (index < iteration) {
              return originalText[index];
            }
            // Добавляем больше случайных символов для более богатого эффекта
            const randomChar = Math.random() > 0.5 
              ? matrixChars[Math.floor(Math.random() * matrixChars.length)]
              : matrixChars[Math.floor(Math.random() * (matrixChars.length / 2))];
            return randomChar;
          })
          .join("");
        
        if (iteration >= originalLength) {
          clearInterval((element as any).interval);
        }
        
        iteration += 0.25; // Уменьшаем шаг для более плавной анимации
      }
    };
    
    (element as any).interval = setInterval(step, 25); // Уменьшаем интервал для большей частоты обновления
  };

  return { animateText };
};

interface MatrixAnimationProps {
  text: string;
  className?: string;
  animateOnMount?: boolean;
}

const MatrixAnimation: React.FC<MatrixAnimationProps> = ({ 
  text, 
  className = "animate_letters", 
  animateOnMount = false 
}) => {
  const { animateText } = useMatrixEffect();
  const [currentText, setCurrentText] = useState(text);
  
  // Ref для доступа к DOM элементу
  const textRef = React.useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    if (animateOnMount && textRef.current) {
      animateText(textRef.current);
    }
  }, [animateOnMount, animateText]);

  const handleMouseEnter = () => {
    if (textRef.current) {
      animateText(textRef.current);
    }
  };

  return (
    <span 
      ref={textRef}
      className={className}
      onMouseEnter={handleMouseEnter}
      data-original={text}
    >
      {currentText}
    </span>
  );
};

export default MatrixAnimation;
