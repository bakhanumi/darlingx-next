import React, { useEffect, useRef } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    
    // Проверка на существование элементов
    if (!cursor || !cursorDot) return;
    
    // Включаем класс для кастомного курсора на html-элементе
    document.documentElement.classList.add('custom-cursor-enabled');
    
    // Функция для отслеживания движения мыши и обновления элементов курсора
    const updateCursorPosition = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
      });
    };
    
    // Эффект при нажатии мыши - уменьшаем курсор
    const handleMouseDown = () => {
      cursor.style.width = '15px';
      cursor.style.height = '15px';
      cursor.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
    };
    
    // Эффект при отпускании кнопки мыши - восстанавливаем курсор
    const handleMouseUp = () => {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      cursor.style.backgroundColor = 'transparent';
    };
    
    // Получаем все интерактивные элементы для специальных эффектов курсора
    const getInteractiveElements = () => 
      document.querySelectorAll('a, button, input, [role="button"], .animate_letters');
    
    // Устанавливаем эффекты для интерактивных элементов
    const setupInteractiveElements = () => {
      const interactiveElements = getInteractiveElements();
      
      interactiveElements.forEach(element => {
        // Эффект при наведении - расширяем курсор
        element.addEventListener('mouseover', () => {
          cursor.style.width = '30px';
          cursor.style.height = '30px';
          cursor.style.borderColor = 'var(--accent-color)';
          cursorDot.style.transform = 'translate(-50%, -50%) scale(2)';
        });
        
        // Мышь вне элемента - восстанавливаем курсор
        element.addEventListener('mouseout', () => {
          cursor.style.width = '20px';
          cursor.style.height = '20px';
          cursor.style.borderColor = 'var(--primary-color)';
          cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
      });
    };
    
    // Обработчик при покидании окна
    const handleMouseLeave = () => {
      cursor.style.opacity = '0';
      cursorDot.style.opacity = '0';
    };
    
    // Обработчик при входе в окно
    const handleMouseEnter = () => {
      cursor.style.opacity = '1';
      cursorDot.style.opacity = '1';
    };
    
    // Добавляем все обработчики событий
    document.addEventListener('mousemove', updateCursorPosition);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    // Устанавливаем эффекты для интерактивных элементов
    setupInteractiveElements();
    
    // Функция для мутации DOM - реагируем на новые элементы
    const observer = new MutationObserver(setupInteractiveElements);
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Очистка при размонтировании компонента
    return () => {
      document.removeEventListener('mousemove', updateCursorPosition);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      
      // Отключаем наблюдатель за DOM
      observer.disconnect();
      
      // Удаляем класс кастомного курсора
      document.documentElement.classList.remove('custom-cursor-enabled');
    };
  }, []);

  // Стили для кастомного курсора
  const cursorStyle: React.CSSProperties = {
    position: 'fixed',
    width: '20px',
    height: '20px',
    border: '1px solid var(--primary-color)',
    borderRadius: '50%',
    pointerEvents: 'none',
    transform: 'translate(-50%, -50%)',
    transition: 'width 0.2s, height 0.2s, background-color 0.2s, border-color 0.2s',
    zIndex: 9999,
    display: 'block'
  };

  // Стили для точки курсора
  const cursorDotStyle: React.CSSProperties = {
    position: 'fixed',
    width: '4px',
    height: '4px',
    backgroundColor: 'var(--primary-color)',
    borderRadius: '50%',
    pointerEvents: 'none',
    transform: 'translate(-50%, -50%)',
    transition: 'transform 0.2s',
    zIndex: 10000,
    display: 'block'
  };

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" style={cursorStyle}></div>
      <div ref={cursorDotRef} className="cursor-dot" style={cursorDotStyle}></div>
    </>
  );
};

export default CustomCursor;
