import React, { useState, useEffect } from 'react';
import BookCard from './BookCard';
import { BookBasic, SortType } from '@/types';
import { sortBooksArray, sortOptions } from '@/data/books';

interface BooksGridProps {
  books: BookBasic[];
}

const BooksGrid: React.FC<BooksGridProps> = ({ books }) => {
  // Состояние для отображения обложек
  const [showCovers, setShowCovers] = useState(true);
  
  // Состояние для сортировки
  const [sortType, setSortType] = useState<string>('Date Read');
  
  // Состояние для отсортированных книг
  const [sortedBooks, setSortedBooks] = useState<BookBasic[]>(books);
  
  // Эффект для инициализации состояния из localStorage
  useEffect(() => {
    // Восстанавливаем состояние показа обложек
    const savedShowCovers = localStorage.getItem('showCovers');
    if (savedShowCovers !== null) {
      setShowCovers(savedShowCovers !== 'false');
    }
    
    // Восстанавливаем тип сортировки
    const savedSortType = localStorage.getItem('bookSort');
    if (savedSortType) {
      setSortType(savedSortType);
    }
  }, []);
  
  // Эффект для пересортировки книг при изменении параметров
  useEffect(() => {
    setSortedBooks(sortBooksArray(books, sortType));
  }, [books, sortType]);
  
  // Обработчик изменения типа сортировки
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortType = e.target.value;
    setSortType(newSortType);
    localStorage.setItem('bookSort', newSortType);
  };
  
  // Обработчик переключения показа обложек
  const handleCoverToggle = () => {
    const newShowCovers = !showCovers;
    setShowCovers(newShowCovers);
    localStorage.setItem('showCovers', String(newShowCovers));
  };
  
  return (
    <>
      <div className="books-controls">
        <select 
          className="sort-select"
          value={sortType}
          onChange={handleSortChange}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <label className="switch" role="switch">
          <input 
            type="checkbox" 
            checked={showCovers} 
            onChange={handleCoverToggle}
            id="coverToggle"
          />
          <span className="slider"></span>
        </label>
      </div>

      <div className={`books-grid ${showCovers ? '' : 'hide-covers'} initialized`}>
        {sortedBooks.map((book, index) => (
          <BookCard 
            key={book.id} 
            book={book} 
            index={index} 
            showCover={showCovers}
          />
        ))}
      </div>
    </>
  );
};

export default BooksGrid;
