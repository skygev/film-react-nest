import { FilmDto, FilmScheduleDto, FilmSessionDto } from './dto/films.dto';
import { FilmDocument, FilmSession } from './films.schema';

export const filmToDto = (film: FilmDocument): FilmDto => ({
  id: film.id,
  title: film.title,
  about: film.about ?? '',
  description: film.description ?? '',
  director: film.director ?? '',
  rating: film.rating ?? 0,
  tags: film.tags ?? [],
  image: film.image ?? film.posterUrl ?? '',
  cover: film.cover ?? film.posterUrl ?? '',
});

export const filmToScheduleDto = (film: FilmDocument): FilmScheduleDto => ({
  filmId: film.id,
  showTimes: (film.schedule ?? []).map(filmSessionToDto),
});

const filmSessionToDto = (session: FilmSession): FilmSessionDto => ({
  id: session.id,
  daytime: session.daytime,
  hall: String(session.hall),
  rows: session.rows,
  seats: session.seats,
  price: session.price,
  taken: session.taken ?? [],
});
