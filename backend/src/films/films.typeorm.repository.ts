import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FilmsRepository } from './films.repository';
import { FilmsQueryDto } from './dto/films.dto';
import { FilmDocument, FilmSession } from './films.document';
import { FilmEntity } from './entities/film.entity';
import { ScheduleEntity } from './entities/schedule.entity';

@Injectable()
export class TypeormFilmsRepository extends FilmsRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly filmsRepository: Repository<FilmEntity>,
    @InjectRepository(ScheduleEntity)
    private readonly schedulesRepository: Repository<ScheduleEntity>,
  ) {
    super();
  }

  async findAll(query: FilmsQueryDto = {}): Promise<FilmDocument[]> {
    const qb = this.filmsRepository
      .createQueryBuilder('film')
      .leftJoinAndSelect('film.schedule', 'schedule');

    if (query.date) {
      qb.andWhere('schedule.daytime LIKE :date', { date: `${query.date}%` });
    }

    const films = await qb.getMany();

    return films.map((film) => this.mapFilmEntity(film));
  }

  async findById(id: string): Promise<FilmDocument | null> {
    const film = await this.filmsRepository.findOne({
      where: { id },
      relations: ['schedule'],
    });

    if (!film) {
      return null;
    }

    return this.mapFilmEntity(film);
  }

  private mapFilmEntity(entity: FilmEntity): FilmDocument {
    const schedule = (entity.schedule ?? []).map((session) =>
      this.mapScheduleEntity(session),
    );

    return {
      id: entity.id,
      title: entity.title,
      about: entity.about,
      description: entity.description,
      director: entity.director,
      rating: entity.rating,
      tags: this.normalizeTags(entity.tags),
      image: entity.image,
      cover: entity.cover,
      schedule,
    };
  }

  private mapScheduleEntity(entity: ScheduleEntity): FilmSession {
    return {
      id: entity.id,
      daytime: entity.daytime,
      hall: entity.hall,
      rows: entity.rows,
      seats: entity.seats,
      price: entity.price,
      taken: this.deserializeTaken(entity.taken),
    };
  }

  private normalizeTags(value: string | null | undefined): string[] {
    if (!value) {
      return [];
    }

    return value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  private deserializeTaken(value: string | null | undefined): string[] {
    if (!value) {
      return [];
    }

    return value
      .split(',')
      .map((token) => token.trim())
      .filter(Boolean);
  }

  async saveTakenSeats(sessions: FilmSession[]): Promise<void> {
    if (!sessions.length) {
      return;
    }

    await Promise.all(
      sessions.map((session) =>
        this.schedulesRepository.update(session.id, {
          taken: session.taken.join(','),
        }),
      ),
    );
  }
}
