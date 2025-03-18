import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import MatrixAnimation from '@/components/ui/MatrixAnimation';

const RegisterForm: React.FC = () => {
  const router = useRouter();
  
  // Состояния для формы
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Состояния для обработки ошибок и загрузки
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Сбрасываем ошибку
    setError(null);
    
    // Валидация формы на стороне клиента
    if (!name || !email || !password || !confirmPassword) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    
    // Проверка сложности пароля
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Пароль должен содержать не менее 8 символов, включая заглавные и строчные буквы, и цифры');
      return;
    }
    
    // Отправка данных формы на API
    try {
      setLoading(true);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Что-то пошло не так');
      }
      
      // При успешной регистрации перенаправляем на страницу входа
      router.push('/login?registered=true');
      
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-header">
        <h1 className="auth-title">
          <MatrixAnimation text="Регистрация" animateOnMount={true} />
        </h1>
      </div>
      
      {error && (
        <div className="auth-error-message">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="name">Имя</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ваше имя"
            disabled={loading}
            required
          />
        </div>
        
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
        
        <div className="form-group">
          <label htmlFor="confirm-password">Подтвердите пароль</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {loading ? 'Создание аккаунта...' : 'Создать аккаунт'}
        </button>
      </form>
      
      <div className="auth-links">
        <Link href="/login" className="auth-link">
          <MatrixAnimation text="У вас уже есть аккаунт? Войти" />
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
