import { Injectable } from '@nestjs/common';

import {
  FilmDto,
  FilmScheduleDto,
  FilmSessionDto,
  FilmsQueryDto,
} from './dto/films.dto';

@Injectable()
export class FilmsService {
  private readonly films: FilmDto[] = [
    {
      id: 'dune-2',
      title: 'Dune: Part Two',
      description:
        'Paul Atreides объединяет силы с фременами, чтобы отомстить за семью.',
      durationMinutes: 166,
      posterUrl: '/content/afisha/bg1c.jpg',
      genres: ['sci-fi', 'adventure'],
    },
    {
      id: 'poor-things',
      title: 'Poor Things',
      description:
        'Фантастическая история о девушке, переживающей второе рождение.',
      durationMinutes: 141,
      posterUrl: '/content/afisha/bg2c.jpg',
      genres: ['drama', 'fantasy'],
    },
  ];

  private readonly schedules: Record<string, FilmScheduleDto> = {
    'dune-2': {
      filmId: 'dune-2',
      showTimes: [
        this.createSession('session-1', '2026-01-12T17:00:00.000Z', 'Hall 1'),
        this.createSession('session-2', '2026-01-12T21:00:00.000Z', 'Hall 2'),
      ],
    },
    'poor-things': {
      filmId: 'poor-things',
      showTimes: [
        this.createSession('session-3', '2026-01-13T15:30:00.000Z', 'Hall 3'),
        this.createSession('session-4', '2026-01-13T19:00:00.000Z', 'Hall 1'),
      ],
    },
  };

  findAll(query: FilmsQueryDto = {}): FilmDto[] {
    if (!query.date) {
      return this.films;
    }

    // простая фильтрация: оставить фильмы, у которых есть сеанс на дату
    return this.films.filter((film) => {
      const schedule = this.schedules[film.id];
      return schedule?.showTimes.some((session) =>
        session.startsAt.startsWith(query.date as string),
      );
    });
  }

  findSchedule(id: string): FilmScheduleDto | undefined {
    return this.schedules[id];
  }

  private createSession(
    id: string,
    startsAt: string,
    hall: string,
  ): FilmSessionDto {
    return {
      id,
      startsAt,
      hall,
      price: 450,
    };
  }
}
