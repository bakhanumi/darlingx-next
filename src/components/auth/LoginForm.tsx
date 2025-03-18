import React, { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import MatrixAnimation from '@/components/ui/MatrixAnimation';

const LoginForm: React.FC = () => {
  const router = useRouter();
  
  // Состояния для формы
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Состояния для обработки ошибок и загрузки
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  
  // Обработка параметров URL
  useEffect(() => {
    // Показываем сообщение об успешной регистрации, если пользователь только что зарегистрировался
    if (router.query.registered === 'true') {
      setMessage('Регистрация успешна! Теперь вы можете войти.');
    }
    
    // Показываем сообщение об ошибке, если есть параметр error
    if (router.query.error) {
      switch (router.query.error) {
        case 'CredentialsSignin':
          setError('Неверный email или пароль');
          break;
        default:
          setError('Произошла ошибка при входе');
          break;
      }
    }
  }, [router.query]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Сбрасываем сообщения
    setError(null);
    setMessage(null);
    
    // Валидация формы на стороне клиента
    if (!email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    
    try {
      setLoading(true);
      
      // Выполняем вход с помощью NextAuth.js
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      
      if (result?.error) {
        setError('Неверный email или пароль');
      } else {
        // При успешном входе перенаправляем на главную страницу
        // или на страницу, с которой пользователь пришел
        const callbackUrl = router.query.callbackUrl as string || '/';
        router.push(callbackUrl);
      }
    } catch (err) {
      setError('Произошла ошибка при входе');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-header">
        <h1 className="auth-title">
          <MatrixAnimation text="Вход" animateOnMount={true} />
        </h1>
      </div>
      
      {error && (
        <div className="auth-error-message">
          {error}
        </div>
      )}
      
      {message && (
        <div className="auth-success-message">
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            disabled={loading}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className={`auth-submit-button ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>
      
      <div className="auth-links">
        <Link href="/register" className="auth-link">
          <MatrixAnimation text="Еще нет аккаунта? Зарегистрироваться" />
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
