export interface FilmSession {
  id: string;
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export interface FilmDocument {
  id: string;
  title: string;
  about: string;
  description: string;
  director: string;
  rating: number;
  tags: string[];
  image: string;
  cover: string;
  schedule?: FilmSession[];
}
