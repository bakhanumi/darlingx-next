import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Layout from '@/components/layout/Layout';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <Layout 
      title="Вход"
      description="Вход в личный кабинет - Suleymanov Bobur"
    >
      <div className="auth-page">
        <LoginForm />
      </div>
    </Layout>
  );
}

// Проверяем, авторизован ли пользователь, и если да, перенаправляем его
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  
  // Если пользователь уже вошел в систему, перенаправляем на главную страницу
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  
  return {
    props: {},
  };
};
