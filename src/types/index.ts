export interface BookBasic {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  dateRead: string;
}

export interface BookDetails extends BookBasic {
  description: string;
  pages: number;
  publishDate: string;
  genre: string;
}

export interface BookDatabase {
  [key: string]: BookDetails;
}

export interface SortType {
  value: string;
  label: string;
}

export interface NavLink {
  href: string;
  label: string;
}
