import React from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Layout from '@/components/layout/Layout';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <Layout 
      title="Регистрация"
      description="Регистрация нового аккаунта - Suleymanov Bobur"
    >
      <div className="auth-page">
        <RegisterForm />
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
