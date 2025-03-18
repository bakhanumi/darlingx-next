import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookBasic } from '@/types';

interface BookCardProps {
  book: BookBasic;
  index: number;
  showCover: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ book, index, showCover }) => {
  const { id, title, author, coverImage, dateRead } = book;
  
  return (
    <div 
      className="book-card" 
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <Link href={`/book/${id}`} className="book-link">
        {showCover && (
          <div style={{ position: 'relative', width: '100%', paddingBottom: '150%' }}>
            <Image
              src={coverImage}
              alt={title}
              className="book-cover"
              fill
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={index < 2} // Приоритет загрузки для первых двух книг
            />
          </div>
        )}
        <h2 className="book-title">{title}</h2>
        <h3 className="book-author">{author}</h3>
      </Link>
    </div>
  );
};

export default BookCard;
