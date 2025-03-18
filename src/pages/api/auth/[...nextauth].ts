import NextAuth from 'next-auth';
import { authOptions } from '@/auth/auth-options';
import { initDatabase } from '@/auth/db/database';

// Инициализируем базу данных при первом запуске API
initDatabase();

// Экспортируем обработчик NextAuth с нашими настройками
export default NextAuth(authOptions);
