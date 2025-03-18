# Personal Website Next.js Version

Персональный веб-сайт на основе Next.js с системой аутентификации пользователей.

## Технологии

- **Next.js** - React-фреймворк для серверного рендеринга и статической генерации
- **TypeScript** - Строго типизированный язык программирования на основе JavaScript
- **NextAuth.js** - Система аутентификации для Next.js
- **bcryptjs** - Библиотека для хеширования паролей
- **better-sqlite3** - Клиент для работы с SQLite3 из Node.js

## Функции аутентификации

- Регистрация пользователей
- Вход в систему
- Защищенные маршруты
- Хранение сессий с помощью JWT
- Безопасное хранение паролей с использованием bcrypt

## Запуск проекта

1. Клонируйте репозиторий
2. Установите зависимости: `npm install`
3. Запустите проект в режиме разработки: `npm run dev`
4. Откройте [http://localhost:3000](http://localhost:3000)

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
├── 📁 hooks
│   └── useAuth.ts               # Хук для проверки авторизации
├── 📁 pages
│   ├── 📁 api
│   │   ├── 📁 auth
│   │   │   ├── [...nextauth].ts # API-обработчик NextAuth.js
│   │   │   └── register.ts      # API-эндпоинт для регистрации
│   ├── login.tsx                # Страница входа
│   ├── register.tsx             # Страница регистрации
│   └── profile.tsx              # Защищенная страница профиля
└── 📁 types
    └── next-auth.d.ts           # Типы для Next Auth
```

## Настройка новых защищенных маршрутов

Для создания новых защищенных маршрутов используйте HOC `withAuth` в функции `getServerSideProps`:

```typescript
import { withAuth } from '@/auth/withAuth';

export const getServerSideProps = withAuth();
```

Для клиентской защиты используйте хук `useAuth`:

```typescript
import useAuth from '@/hooks/useAuth';

export default function ProtectedPage() {
  // Перенаправит на страницу входа, если пользователь не авторизован
  const { session, loading } = useAuth();
  
  if (loading) return <div>Загрузка...</div>;
  
  return <div>Защищенный контент</div>;
}
```
