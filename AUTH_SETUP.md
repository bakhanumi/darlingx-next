# Настройка и использование системы аутентификации

Эта инструкция поможет вам настроить и использовать систему аутентификации пользователей на основе NextAuth.js, bcryptjs и better-sqlite3.

## Начальная настройка

1. **Установите зависимости**

   ```bash
   npm install
   ```

2. **Настройте переменные окружения**

   Создайте файл `.env.local` в корне проекта и заполните следующие переменные:

   ```
   NEXTAUTH_SECRET=ваш_случайный_секретный_ключ_для_jwt
   NEXTAUTH_URL=http://localhost:3000
   ```

   Для генерации надежного секретного ключа можно использовать:
   ```bash
   openssl rand -base64 32
   ```

3. **Инициализируйте базу данных**

   ```bash
   npm run init-db
   ```

   Или с тестовым пользователем:
   ```bash
   npm run init-db:test
   ```
   
   Данные тестового пользователя:
   - Email: test@example.com
   - Пароль: Test@123

4. **Запустите приложение**

   ```bash
   npm run dev
   ```

## Структура системы аутентификации

```
📁 src
├── 📁 auth
│   ├── 📁 db                    # Работа с базой данных
│   │   ├── database.ts          # Настройка SQLite
│   │   ├── schema.sql           # SQL-схема таблиц
│   │   └── users.ts             # Функции для работы с пользователями
│   ├── auth-options.ts          # Настройки next-auth
│   ├── password-utils.ts        # Утилиты для хеширования паролей
│   └── withAuth.tsx             # HOC для защиты маршрутов
├── 📁 components
│   ├── 📁 auth
│   │   ├── LoginForm.tsx        # Форма входа
│   │   ├── RegisterForm.tsx     # Форма регистрации
│   │   └── AuthStatus.tsx       # Отображение статуса авторизации
└── 📁 pages
    ├── 📁 api
    │   ├── 📁 auth
    │   │   ├── [...nextauth].ts # API-обработчик NextAuth.js
    │   │   └── register.ts      # API-эндпоинт для регистрации
    ├── login.tsx                # Страница входа
    ├── register.tsx             # Страница регистрации
    └── profile.tsx              # Защищенная страница профиля
```

## Как создать новую защищенную страницу

1. **Защита на стороне сервера с использованием withAuth**

   ```tsx
   // pages/admin.tsx
   import React from 'react';
   import { GetServerSideProps } from 'next';
   import Layout from '@/components/layout/Layout';
   import { withAuth } from '@/auth/withAuth';

   export default function AdminPage() {
     return (
       <Layout title="Admin Panel">
         <h1>Admin Panel</h1>
         <p>This page is only visible to authorized users.</p>
       </Layout>
     );
   }

   // Защищаем страницу с помощью HOC
   export const getServerSideProps: GetServerSideProps = withAuth();
   ```

2. **Защита на стороне клиента с использованием useAuth**

   ```tsx
   // pages/dashboard.tsx
   import React from 'react';
   import Layout from '@/components/layout/Layout';
   import useAuth from '@/hooks/useAuth';

   export default function DashboardPage() {
     // Хук перенаправит на страницу входа, если пользователь не авторизован
     const { session, loading } = useAuth();

     if (loading) {
       return (
         <Layout title="Загрузка...">
           <div>Загрузка...</div>
         </Layout>
       );
     }

     return (
       <Layout title="Dashboard">
         <h1>Dashboard</h1>
         <p>Привет, {session?.user.name}!</p>
       </Layout>
     );
   }
   ```

## Доступ к данным пользователя

1. **На стороне клиента**

   ```tsx
   import { useSession } from 'next-auth/react';

   export default function MyComponent() {
     const { data: session } = useSession();

     return (
       <div>
         {session?.user && (
           <p>Вы вошли как {session.user.name} ({session.user.email})</p>
         )}
       </div>
     );
   }
   ```

2. **На стороне сервера**

   ```tsx
   import { getSession } from 'next-auth/react';
   import { GetServerSideProps } from 'next';

   export default function Page({ user }) {
     return <div>Привет, {user.name}!</div>;
   }

   export const getServerSideProps: GetServerSideProps = async (context) => {
     const session = await getSession(context);
     
     if (!session) {
       return {
         redirect: {
           destination: '/login',
           permanent: false,
         },
       };
     }
     
     return {
       props: {
         user: session.user,
       },
     };
   };
   ```

## Расширение функциональности

### Добавление новых полей для пользователя

1. Обновите схему базы данных в `src/auth/db/schema.sql`
2. Добавьте новые поля в интерфейс User в `src/auth/db/users.ts`
3. Обновите формы регистрации/профиля

### Добавление сторонних провайдеров (OAuth)

Добавьте новые провайдеры в `src/auth/auth-options.ts`:

```tsx
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    // Существующий CredentialsProvider
    CredentialsProvider({ ... }),
    
    // Добавляем Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
  ],
  ...
};
```

## Решение проблем

- **База данных не создается**: Проверьте права доступа к директории и убедитесь, что скрипт имеет права на запись
- **Ошибки NextAuth**: Проверьте правильность настройки NEXTAUTH_SECRET и NEXTAUTH_URL
- **Ошибки аутентификации**: Проверьте логи приложения для более детальной информации

## Безопасность в продакшн-окружении

1. Используйте длинный случайный NEXTAUTH_SECRET
2. Настройте NEXTAUTH_URL на ваш продакшн-домен с HTTPS
3. Настройте политики безопасности паролей
4. Рассмотрите возможность установки rate limiting для API эндпоинтов

## Дополнительные ресурсы

- [Документация NextAuth.js](https://next-auth.js.org/getting-started/introduction)
- [Документация better-sqlite3](https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/api.md)
- [Безопасность веб-приложений OWASP](https://owasp.org/www-project-top-ten/)
