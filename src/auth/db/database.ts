import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

// Определяем путь к базе данных - из переменной окружения или по умолчанию
const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'database.sqlite');

// Убедимся, что директория для БД существует
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Инициализация соединения с базой данных
let db: Database.Database;

// Функция инициализации базы данных
export function initDatabase() {
  if (db) return db;
  
  console.log(`Initializing SQLite database at ${dbPath}`);
  
  try {
    // Создаем экземпляр базы данных
    db = new Database(dbPath);
    
    // Устанавливаем pragmas для оптимальной работы SQLite
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    // Загружаем и выполняем SQL-скрипт для создания таблиц
    const schemaPath = path.join(process.cwd(), 'src/auth/db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Выполняем схему (создаем таблицы, если их нет)
    db.exec(schema);
    
    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

// Функция получения соединения с базой данных
export function getDatabase(): Database.Database {
  if (!db) {
    return initDatabase();
  }
  return db;
}

// Явно закрываем соединение при завершении работы приложения
process.on('exit', () => {
  if (db) {
    console.log('Closing database connection');
    db.close();
  }
});
