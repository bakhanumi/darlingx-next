import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';
import { useMatrixAnimationEffect } from '@/utils/helpers';
import '@/styles/globals.css';
import '@/styles/constellation.css';
import '@/styles/books.css';
import '@/styles/book-details.css';
import '@/styles/auth.css';
import '@/styles/profile.css'; // Добавляем стили для профиля

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Применяем матричную анимацию ко всем подходящим элементам
  useMatrixAnimationEffect();
  
  // Добавляем обработчик для анимаций при переходе между страницами
  useEffect(() => {
    const handleRouteChangeStart = () => {
      document.body.classList.add('page-loading');
    };
    
    const handleRouteChangeComplete = () => {
      document.body.classList.remove('page-loading');
    };
    
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router.events]);
  
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
