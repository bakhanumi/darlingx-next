/**
 * Скрипт для инициализации базы данных
 * Запуск: node scripts/init-db.js
 */

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Загружаем переменные окружения из .env.local
dotenv.config({ path: '.env.local' });

// Определяем путь к базе данных
const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'database.sqlite');
const dbDir = path.dirname(dbPath);

// Убедимся, что директория существует
if (!fs.existsSync(dbDir)) {
  console.log(`Creating directory: ${dbDir}`);
  fs.mkdirSync(dbDir, { recursive: true });
}

// Удаляем существующую базу данных, если она есть
if (fs.existsSync(dbPath)) {
  console.log(`Removing existing database: ${dbPath}`);
  fs.unlinkSync(dbPath);
}

console.log(`Initializing new database at: ${dbPath}`);
const db = new Database(dbPath);

// Устанавливаем pragmas
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Загружаем схему
const schemaPath = path.join(process.cwd(), 'src/auth/db/schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// Выполняем схему
console.log('Creating tables...');
db.exec(schema);
console.log('Tables created successfully');

// Создаем тестового пользователя если нужно
if (process.argv.includes('--with-test-user')) {
  console.log('Creating test user...');
  
  // Здесь пароль: Test@123
  const hashedPassword = '$2a$10$XN9hPtuLaIbE1I1ayxKLtO3dNtJTAV9fJxU5dxBzwO9gApyFPgNQK';
  
  const stmt = db.prepare(`
    INSERT INTO users (name, email, password)
    VALUES (?, ?, ?)
  `);
  
  stmt.run(
    'Test User',
    'test@example.com',
    hashedPassword
  );
  
  console.log('Test user created:');
  console.log('Email: test@example.com');
  console.log('Password: Test@123');
}

// Закрываем соединение
db.close();
console.log('Database initialized successfully!');
