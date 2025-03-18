import React, { ReactNode, useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import ConstellationAnimation from '../ui/ConstellationAnimation';
import CustomCursor from '../ui/CustomCursor';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  ogImage?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'Suleymanov Bobur',
  description = 'AI, SE, Assistive Tech',
  ogImage = '/darling.webp',
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Имитация загрузки страницы
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => {
      clearTimeout(loadingTimeout);
    };
  }, []);

  const siteName = 'Suleymanov Bobur';
  const fullTitle = `${title} | ${siteName}`;

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon180.png" />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImage} />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet" />
      </Head>

      <ConstellationAnimation />
      <CustomCursor />

      {isLoading && (
        <div className="loading">
          <div className="loading-text">Initializing...</div>
        </div>
      )}

      <main>
        <div className="container">
          <Navbar />
          {children}
          <Footer />
        </div>
      </main>
    </>
  );
};

export default Layout;
