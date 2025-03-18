import { BookDatabase, BookBasic, SortType } from '@/types';

// База данных с детальной информацией о книгах
export const bookDatabase: BookDatabase = {
  'the-48-laws-of-power': {
    id: 'the-48-laws-of-power',
    title: 'The 48 Laws of Power',
    author: 'Robert Greene',
    coverImage: '/book48.webp',
    description: 'Amoral, cunning, ruthless, and instructive, this multi-million-copy New York Times bestseller combines three thousand years of the history of power into 48 essential laws.',
    pages: 452,
    publishDate: '1998',
    genre: 'Self-help, Psychology',
    dateRead: 'March 1, 2025'
  },
  'transurfing-of-reality': {
    id: 'transurfing-of-reality',
    title: 'Transerfing of reality I-V',
    author: 'Vadim Zeland',
    coverImage: '/book2.jpg',
    description: 'Reality Transurfing I-V offers a revolutionary technique for understanding the nature of reality and your place in it. Vadim Zeland combines metaphysical ideas with practical strategies that allow you to change your perception of the world, use your personal energy and create a reality that matches your inner intentions.',
    pages: 1500,
    publishDate: '2004-2007',
    genre: 'Metaphysics, Self-development, Philosophy',
    dateRead: 'November 1, 2024'
  },
  'dune': {
    id: 'dune',
    title: 'Dune',
    author: 'Frank Herbert',
    coverImage: '/dune.webp',
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange, a drug capable of extending life and enhancing consciousness.',
    pages: 896,
    publishDate: '1965',
    genre: 'Science Fiction',
    dateRead: 'March 1, 2024'
  }
};

// Базовый список книг для отображения в сетке
export const booksData: BookBasic[] = Object.values(bookDatabase).map(({ id, title, author, coverImage, dateRead }) => ({
  id,
  title,
  author,
  coverImage,
  dateRead
}));

// Доступные опции сортировки
export const sortOptions: SortType[] = [
  { value: 'Date Read', label: 'Date Read' },
  { value: 'Author (A-Z)', label: 'Author (A-Z)' },
  { value: 'Title (A-Z)', label: 'Title (A-Z)' }
];

// Функция сортировки массива книг
export const sortBooksArray = (books: BookBasic[], sortType: string): BookBasic[] => {
  return [...books].sort((a, b) => {
    if (sortType === 'Author (A-Z)') {
      return a.author.localeCompare(b.author);
    } 
    else if (sortType === 'Title (A-Z)') {
      return a.title.localeCompare(b.title);
    }
    else if (sortType === 'Date Read') {
      // Предполагаем, что даты в формате 'Month DD, YYYY'
      return new Date(b.dateRead).getTime() - new Date(a.dateRead).getTime();
    }
    return 0;
  });
};
