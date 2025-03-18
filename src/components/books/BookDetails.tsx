import React from 'react';
import Image from 'next/image';
import { BookDetails as BookDetailsType } from '@/types';

interface BookDetailsProps {
  book: BookDetailsType;
}

const BookDetails: React.FC<BookDetailsProps> = ({ book }) => {
  const { title, author, coverImage, description, pages, publishDate, genre, dateRead } = book;

  return (
    <div className="book-details">
      <div className="book-header">
        <div style={{ position: 'relative', width: '300px', height: '450px' }}>
          <Image
            src={coverImage}
            alt={title}
            className="book-cover"
            fill
            style={{ objectFit: 'contain' }}
            sizes="(max-width: 768px) 100vw, 300px"
            priority
          />
        </div>
        <div className="book-info">
          <h1 className="book-title">{title}</h1>
          <h2 className="book-author">By {author}</h2>
          <p className="date-read">Finished reading: {dateRead}</p>
        </div>
      </div>
      
      <div className="book-description">
        <p>{description}</p>
      </div>
      
      <div className="book-metadata">
        <div className="metadata-item">
          <span className="label">Pages:</span>
          <span>{pages}</span>
        </div>
        <div className="metadata-item">
          <span className="label">Published:</span>
          <span>{publishDate}</span>
        </div>
        <div className="metadata-item">
          <span className="label">Genre:</span>
          <span>{genre}</span>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
