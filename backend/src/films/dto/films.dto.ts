export class FilmDto {
  id: string;
  title: string;
  about: string;
  description: string;
  director: string;
  rating: number;
  tags: string[];
  image: string;
  cover: string;
}

export class FilmScheduleDto {
  filmId: string;
  showTimes: FilmSessionDto[];
}

export class FilmSessionDto {
  id: string;
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export class FilmsQueryDto {
  date?: string;
}
