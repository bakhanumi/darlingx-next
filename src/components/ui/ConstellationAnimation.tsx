import React, { useEffect, useRef } from 'react';

interface Star {
  element: HTMLDivElement;
  size: string;
  isPremium: boolean;
}

interface ConstellationConfig {
  starCount: number;
  minSize: number;
  maxSize: number;
  transitionSpeed: number;
  constellationDuration: number;
  fadeInDuration: number;
  premiumStarCount: number;
  maxConnections: number;
  connectionDistance: number;
  connectionOpacity: number;
}

// Позиции для паттернов звезд
const starPositions = [
  // Группа 1 - Треугольник
  [
    {top: 20, left: 20}, {top: 40, left: 40}, {top: 20, left: 60},
    {top: 30, left: 30}, {top: 35, left: 45}, {top: 25, left: 50}
  ],
  // Группа 2 - Квадрат
  [
    {top: 20, left: 20}, {top: 20, left: 60},
    {top: 60, left: 20}, {top: 60, left: 60},
    {top: 40, left: 40}, {top: 30, left: 30}
  ],
  // Группа 3 - Круг
  [
    {top: 40, left: 20}, {top: 20, left: 40},
    {top: 40, left: 60}, {top: 60, left: 40},
    {top: 40, left: 40}, {top: 30, left: 30}
  ],
  // Группа 4 - Зигзаг
  [
    {top: 20, left: 20}, {top: 30, left: 30},
    {top: 40, left: 20}, {top: 50, left: 30},
    {top: 60, left: 20}, {top: 35, left: 45}
  ]
];

const ConstellationAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentPatternRef = useRef<number>(0);
  
  useEffect(() => {
    // Конфигурация для анимации
    const config: ConstellationConfig = {
      starCount: 30,
      minSize: 1,
      maxSize: 3,
      transitionSpeed: 5000,
      constellationDuration: 12000,
      fadeInDuration: 2000,
      premiumStarCount: 10,
      maxConnections: 3,
      connectionDistance: 150,
      connectionOpacity: 0.3
    };

    // Проверяем возможности устройства
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const hasLowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    const isLowPowerDevice = isMobile || hasLowCPU;
    
    if (isLowPowerDevice) {
      config.starCount = 20;
      config.constellationDuration = 15000;
    }
    
    // Инициализация звездного фона
    const initConstellationBackground = () => {
      if (!containerRef.current) return;
      
      containerRef.current.innerHTML = '';
      starsRef.current = [];
      
      // Создаем звезды
      for (let i = 0; i < config.starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const isPremium = i < config.premiumStarCount;
        if (isPremium) {
          star.classList.add('premium-star');
        }
        
        const size = config.minSize + Math.random() * (config.maxSize - config.minSize);
        let sizeClass = 'size-medium';
        if (size < 2.5) {
          sizeClass = 'size-small';
          star.classList.add('size-small');
        } else if (size < 3.5) {
          sizeClass = 'size-medium';
          star.classList.add('size-medium');
        } else {
          sizeClass = 'size-large';
          star.classList.add('size-large');
        }
        
        const randomDelay = Math.random() * 4;
        const randomDuration = 3 + Math.random() * 2;
        
        Object.assign(star.style, {
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: `${size}px`,
          height: `${size}px`,
          '--twinkle-delay': `${randomDelay}s`,
          '--twinkle-duration': `${randomDuration}s`,
          transition: `all ${config.transitionSpeed}ms cubic-bezier(0.4, 0, 0.6, 1)`
        } as React.CSSProperties);
        
        containerRef.current.appendChild(star);
        starsRef.current.push({ 
          element: star, 
          size: sizeClass, 
          isPremium 
        });

        // Добавляем интерактивность
        star.addEventListener('mouseenter', () => {
          if (!isLowPowerDevice) {
            createStarConnections(star);
          }
        });

        star.addEventListener('click', (e) => {
          if (!isLowPowerDevice) {
            createStarExplosion(e.clientX, e.clientY);
            star.style.transform = 'scale(2.5) rotate(180deg)';
            setTimeout(() => {
              star.style.transform = '';
            }, 1000);
          }
        });
      }
      
      // Начало цикла анимации
      setTimeout(() => {
        changeStarPositions();
        animationTimerRef.current = setInterval(changeStarPositions, config.constellationDuration);
      }, config.fadeInDuration);
    };

    // Смена позиций звезд
    const changeStarPositions = () => {
      if (!containerRef.current) return;
      
      const stars = starsRef.current.map(star => star.element);
      const pattern = starPositions[currentPatternRef.current];
      
      stars.forEach((star, index) => {
        const randomOffset = () => (Math.random() - 0.5) * 5;
        
        if (pattern && index < pattern.length) {
          Object.assign(star.style, {
            top: `${pattern[index].top + randomOffset()}%`,
            left: `${pattern[index].left + randomOffset()}%`,
            transition: `all ${config.transitionSpeed}ms cubic-bezier(0.4, 0, 0.6, 1)`
          });
        } else {
          Object.assign(star.style, {
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transition: `all ${config.transitionSpeed}ms cubic-bezier(0.4, 0, 0.6, 1)`
          });
        }
      });
      
      currentPatternRef.current = (currentPatternRef.current + 1) % starPositions.length;
    };

    // Создание соединений между звездами
    const createStarConnections = (star: HTMLDivElement) => {
      if (!containerRef.current) return;
      
      const stars = Array.from(containerRef.current.querySelectorAll('.star'));
      const starRect = star.getBoundingClientRect();
      const starCenter = {
        x: starRect.left + starRect.width / 2,
        y: starRect.top + starRect.height / 2
      };

      // Удаляем старые соединения
      containerRef.current.querySelectorAll('.constellation-line').forEach(line => line.remove());

      // Находим ближайшие звезды
      const nearbyStars = stars
        .filter(s => s !== star)
        .map(s => {
          const rect = s.getBoundingClientRect();
          const center = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
          };
          const distance = Math.hypot(center.x - starCenter.x, center.y - starCenter.y);
          return { star: s, distance, center };
        })
        .filter(s => s.distance < config.connectionDistance)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, config.maxConnections);

      // Создаем соединения
      nearbyStars.forEach(({ star: targetStar, center: targetCenter }) => {
        const line = document.createElement('div');
        line.className = 'constellation-line';
        
        // Вычисляем параметры линии
        const angle = Math.atan2(targetCenter.y - starCenter.y, targetCenter.x - starCenter.x);
        const length = Math.hypot(targetCenter.x - starCenter.x, targetCenter.y - starCenter.y);
        
        // Применяем стили
        Object.assign(line.style, {
          width: `${length}px`,
          transform: `translate(${starCenter.x}px, ${starCenter.y}px) rotate(${angle}rad)`,
          opacity: `${config.connectionOpacity}`
        });
        
        containerRef.current?.appendChild(line);
        
        // Добавляем класс для анимации
        targetStar.classList.add('connecting');
        setTimeout(() => targetStar.classList.remove('connecting'), 1200);
      });
    };

    // Special effect: Create star explosion
    const createStarExplosion = (x: number, y: number) => {
      if (!containerRef.current || isLowPowerDevice) return;
      
      const particleCount = 12;
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'star size-small';
        
        Object.assign(particle.style, {
          top: `${y}px`,
          left: `${x}px`,
          position: 'absolute',
          width: '2px',
          height: '2px',
          transition: 'all 0.8s cubic-bezier(0.1, 0.8, 0.3, 1)'
        });
        
        containerRef.current.appendChild(particle);
        
        setTimeout(() => {
          const angle = (i / particleCount) * Math.PI * 2;
          const distance = 50 + Math.random() * 50;
          const newX = x + Math.cos(angle) * distance;
          const newY = y + Math.sin(angle) * distance;
          
          Object.assign(particle.style, {
            top: `${newY}px`,
            left: `${newX}px`,
            opacity: '0'
          });
          
          setTimeout(() => particle.remove(), 800);
        }, 10);
      }
    };

    // Инициализация
    initConstellationBackground();
    
    // Предпочтение уменьшенного движения
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && animationTimerRef.current) {
      clearInterval(animationTimerRef.current);
    }
    
    // Обработка изменения видимости страницы
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationTimerRef.current) {
          clearInterval(animationTimerRef.current);
        }
      } else {
        changeStarPositions();
        animationTimerRef.current = setInterval(changeStarPositions, config.constellationDuration);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Очистка при размонтировании
    return () => {
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return <div className="constellation-container" ref={containerRef}></div>;
};

export default ConstellationAnimation;
