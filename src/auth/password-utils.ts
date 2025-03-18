import bcrypt from 'bcryptjs';

// Количество раундов для хеширования пароля (оптимальный баланс безопасности и производительности)
const SALT_ROUNDS = 10;

/**
 * Хеширует пароль используя bcrypt
 * @param password Пароль в виде обычного текста
 * @returns Хешированный пароль
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
}

/**
 * Проверяет, соответствует ли пароль в виде обычного текста хешированному паролю
 * @param password Пароль в виде обычного текста
 * @param hashedPassword Хешированный пароль
 * @returns true, если пароль соответствует хешу, иначе false
 */
export async function comparePasswords(
  password: string, 
  hashedPassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
}

/**
 * Проверяет надежность пароля по базовым критериям
 * @param password Пароль для проверки
 * @returns Объект с результатом проверки и сообщением
 */
export function validatePassword(password: string): { valid: boolean; message?: string } {
  // Минимальная длина пароля
  if (password.length < 8) {
    return { 
      valid: false, 
      message: 'Пароль должен содержать не менее 8 символов' 
    };
  }
  
  // Проверка наличия хотя бы одной цифры
  if (!/\d/.test(password)) {
    return { 
      valid: false, 
      message: 'Пароль должен содержать хотя бы одну цифру' 
    };
  }
  
  // Проверка наличия хотя бы одной заглавной буквы
  if (!/[A-Z]/.test(password)) {
    return { 
      valid: false, 
      message: 'Пароль должен содержать хотя бы одну заглавную букву' 
    };
  }
  
  // Проверка наличия хотя бы одной строчной буквы
  if (!/[a-z]/.test(password)) {
    return { 
      valid: false, 
      message: 'Пароль должен содержать хотя бы одну строчную букву' 
    };
  }
  
  return { valid: true };
}
