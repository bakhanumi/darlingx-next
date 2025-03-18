import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Layout from '@/components/layout/Layout';
import BookDetails from '@/components/books/BookDetails';
import { bookDatabase } from '@/data/books';
import { BookDetails as BookDetailsType } from '@/types';
import { useRouter } from 'next/router';

interface BookPageProps {
  book: BookDetailsType;
}

export default function BookPage({ book }: BookPageProps) {
  const router = useRouter();
  
  // Показываем состояние загрузки при переходе между книгами
  if (router.isFallback) {
    return (
      <Layout title="Loading...">
        <div className="loading">
          <div className="loading-text">Loading book details...</div>
        </div>
      </Layout>
    );
  }
  
  // Если книга не найдена, перенаправляем на страницу книг
  if (!book) {
    if (typeof window !== 'undefined') {
      router.push('/books');
    }
    return null;
  }
  
  return (
    <Layout 
      title={`${book.title}`}
      description={`${book.title} by ${book.author} - Suleymanov Bobur`}
      ogImage={book.coverImage}
    >
      <BookDetails book={book} />
    </Layout>
  );
}

// Генерируем пути для всех книг на этапе сборки
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Object.keys(bookDatabase).map((id) => ({
    params: { id }
  }));
  
  return {
    paths,
    fallback: false // При запросе несуществующей книги вернуть 404
  };
};

// Получаем данные о конкретной книге
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id as string;
  const book = bookDatabase[id];
  
  // Если книги нет, возвращаем 404
  if (!book) {
    return {
      notFound: true
    };
  }
  
  return {
    props: {
      book
    },
    // Перегенерируем страницу раз в день (для обновления даты прочтения и т.д.)
    revalidate: 86400
  };
};
