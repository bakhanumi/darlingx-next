import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import MatrixAnimation from '@/components/ui/MatrixAnimation';

const AuthStatus: React.FC = () => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  // Если сессия загружается, показываем состояние загрузки
  if (loading) {
    return (
      <div className="auth-status">
        <span className="auth-status-loading">Загрузка...</span>
      </div>
    );
  }

  // Если пользователь авторизован
  if (session?.user) {
    return (
      <div className="auth-status">
        <Link href="/profile" className="auth-status-username">
          <MatrixAnimation text={session.user.name || 'Пользователь'} />
        </Link>
        
        <button 
          onClick={() => signOut({ callbackUrl: '/' })} 
          className="auth-logout-button"
        >
          <MatrixAnimation text="Выйти" />
        </button>
      </div>
    );
  }

  // Если пользователь не авторизован
  return (
    <div className="auth-status">
      <Link href="/login" className="auth-login-link">
        <MatrixAnimation text="Войти" />
      </Link>
      <Link href="/register" className="auth-register-link">
        <MatrixAnimation text="Регистрация" />
      </Link>
    </div>
  );
};

export default AuthStatus;
