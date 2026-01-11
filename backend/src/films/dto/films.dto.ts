export class FilmDto {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  posterUrl: string;
  genres: string[];
}

export class FilmScheduleDto {
  filmId: string;
  showTimes: FilmSessionDto[];
}

export class FilmSessionDto {
  id: string;
  startsAt: string;
  hall: string;
  price: number;
}

export class FilmsQueryDto {
  date?: string;
}
