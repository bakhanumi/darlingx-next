import type { NextApiRequest, NextApiResponse } from 'next';
import { createUser, emailExists } from '@/auth/db/users';
import { hashPassword, validatePassword } from '@/auth/password-utils';
import { initDatabase } from '@/auth/db/database';

// Убедимся, что база данных инициализирована
initDatabase();

type ResponseData = {
  success: boolean;
  message?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Поддерживаем только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { name, email, password } = req.body;

    // Проверка наличия всех необходимых полей
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Пожалуйста, заполните все поля'
      });
    }

    // Проверка валидности email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Пожалуйста, введите корректный email'
      });
    }

    // Проверка существования пользователя с таким email
    if (emailExists(email)) {
      return res.status(409).json({
        success: false,
        message: 'Пользователь с таким email уже существует'
      });
    }

    // Проверка надежности пароля
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message
      });
    }

    // Хеширование пароля
    const hashedPassword = await hashPassword(password);

    // Создание пользователя
    const user = createUser({
      name,
      email,
      password: hashedPassword
    });

    if (!user) {
      return res.status(500).json({
        success: false,
        message: 'Не удалось создать пользователя'
      });
    }

    // Возвращаем успешный результат, но без пароля пользователя
    return res.status(201).json({
      success: true,
      message: 'Пользователь успешно зарегистрирован',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Произошла ошибка при регистрации'
    });
  }
}
