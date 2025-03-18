import { getDatabase } from './database';

// Интерфейс для пользователя
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  image?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Интерфейс для создания пользователя
export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  image?: string;
}

// Интерфейс для публичного профиля пользователя (без пароля)
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  image?: string | null;
}

/**
 * Создает нового пользователя в базе данных
 */
export function createUser(userData: CreateUserData): User | null {
  const db = getDatabase();
  
  try {
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password, image)
      VALUES (?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      userData.name,
      userData.email.toLowerCase(),
      userData.password,
      userData.image || null
    );
    
    if (result.lastInsertRowid) {
      return getUserById(Number(result.lastInsertRowid));
    }
    
    return null;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

/**
 * Получает пользователя по email
 */
export function getUserByEmail(email: string): User | null {
  const db = getDatabase();
  
  try {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
    return stmt.get(email.toLowerCase()) as User || null;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
}

/**
 * Получает пользователя по ID
 */
export function getUserById(id: number): User | null {
  const db = getDatabase();
  
  try {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
    return stmt.get(id) as User || null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
}

/**
 * Возвращает публичный профиль пользователя (без пароля)
 */
export function getUserProfile(user: User): UserProfile {
  const { password, ...profile } = user;
  return profile as UserProfile;
}

/**
 * Проверяет, существует ли пользователь с указанным email
 */
export function emailExists(email: string): boolean {
  const user = getUserByEmail(email);
  return user !== null;
}

/**
 * Обновляет информацию о пользователе
 */
export function updateUser(id: number, userData: Partial<User>): boolean {
  const db = getDatabase();
  
  try {
    // Создаем части SQL запроса динамически на основе переданных полей
    const fields: string[] = [];
    const values: any[] = [];
    
    Object.entries(userData).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    // Добавляем обновление updated_at
    fields.push('updated_at = CURRENT_TIMESTAMP');
    
    // Добавляем ID в конец массива значений
    values.push(id);
    
    const stmt = db.prepare(`
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = ?
    `);
    
    const result = stmt.run(...values);
    return result.changes > 0;
  } catch (error) {
    console.error('Error updating user:', error);
    return false;
  }
}
