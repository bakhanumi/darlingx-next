import React from 'react';
import Layout from '@/components/layout/Layout';
import BooksGrid from '@/components/books/BooksGrid';
import { booksData } from '@/data/books';
import MatrixAnimation from '@/components/ui/MatrixAnimation';

export default function Books() {
  return (
    <Layout 
      title="Bookshelf"
      description="Books - Suleymanov Bobur"
    >
      <div className="about">
        <h1 className="about-name">
          <MatrixAnimation text="Bookshelf" animateOnMount={true} />
        </h1>
        
        <BooksGrid books={booksData} />
      </div>
    </Layout>
  );
}
