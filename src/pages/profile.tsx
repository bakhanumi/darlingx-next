import React from 'react';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import Layout from '@/components/layout/Layout';
import MatrixAnimation from '@/components/ui/MatrixAnimation';
import { withAuth } from '@/auth/withAuth';

export default function ProfilePage() {
  const { data: session } = useSession();
  
  return (
    <Layout 
      title="Профиль"
      description="Профиль пользователя - Suleymanov Bobur"
    >
      <div className="about">
        <h1 className="about-name">
          <MatrixAnimation text="Профиль" animateOnMount={true} />
        </h1>
        
        <div className="profile-container">
          <div className="profile-header">
            <h2 className="profile-title">Добро пожаловать, {session?.user?.name}!</h2>
            <p className="profile-email">{session?.user?.email}</p>
          </div>
          
          <div className="profile-content">
            <div className="profile-section">
              <h3 className="section-title">Информация о пользователе</h3>
              <div className="profile-info">
                <div className="info-item">
                  <span className="info-label">ID:</span>
                  <span className="info-value">{session?.user?.id}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Имя:</span>
                  <span className="info-value">{session?.user?.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{session?.user?.email}</span>
                </div>
              </div>
            </div>
            
            <div className="profile-section">
              <h3 className="section-title">Действия</h3>
              <div className="profile-actions">
                <button className="profile-action-button">
                  <MatrixAnimation text="Изменить профиль" />
                </button>
                <button className="profile-action-button">
                  <MatrixAnimation text="Изменить пароль" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Защищаем страницу профиля с помощью HOC withAuth
export const getServerSideProps: GetServerSideProps = withAuth();
