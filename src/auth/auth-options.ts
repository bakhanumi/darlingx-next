import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getUserByEmail } from './db/users';
import { comparePasswords } from './password-utils';

export const authOptions: NextAuthOptions = {
  // Настройка провайдеров аутентификации
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@example.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        // Находим пользователя в базе данных по email
        const user = getUserByEmail(credentials.email);
        
        // Если пользователь не найден, возвращаем null
        if (!user) {
          return null;
        }
        
        // Проверяем пароль
        const isPasswordValid = await comparePasswords(
          credentials.password,
          user.password
        );
        
        // Если пароль неверный, возвращаем null
        if (!isPasswordValid) {
          return null;
        }
        
        // Возвращаем данные пользователя без пароля
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  
  // Настройка страниц аутентификации
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login', // Error code passed in query string as ?error=
    newUser: '/register', // New users will be directed here on first sign in
  },
  
  // Настройка сессий
  session: {
    strategy: 'jwt', // Используем JWT для сессий
    maxAge: 30 * 24 * 60 * 60, // 30 дней в секундах
  },
  
  // Настройка JWT токенов
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 дней в секундах
  },
  
  // Обратные вызовы для расширения или переопределения поведения по умолчанию
  callbacks: {
    // Настраиваем JWT токен с дополнительными данными
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    
    // Настраиваем сессию с данными из JWT токена
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  
  // Включаем отладку только в режиме разработки
  debug: process.env.NODE_ENV === 'development',
};
