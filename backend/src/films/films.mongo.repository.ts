import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { FilmsRepository } from './films.repository';
import { FilmsQueryDto } from './dto/films.dto';
import { FilmDocument, FilmSession } from './films.document';
import { Film, FilmDocument as MongoFilmDocument } from './films.schema';

@Injectable()
export class MongoFilmsRepository extends FilmsRepository {
  constructor(
    @InjectModel(Film.name)
    private readonly filmModel: Model<MongoFilmDocument>,
  ) {
    super();
  }

  async findAll(query: FilmsQueryDto = {}): Promise<FilmDocument[]> {
    const filter: FilterQuery<MongoFilmDocument> = {};

    if (query.date) {
      filter.schedule = {
        $elemMatch: {
          daytime: {
            $regex: `^${query.date}`,
          },
        },
      };
    }

    const films = await this.filmModel.find(filter).exec();
    return films.map((film) => this.mapFilm(film));
  }

  async findById(id: string): Promise<FilmDocument | null> {
    const film = await this.filmModel.findOne({ id }).exec();
    return film ? this.mapFilm(film) : null;
  }

  async saveTakenSeats(sessions: FilmSession[]): Promise<void> {
    if (!sessions.length) {
      return;
    }

    await Promise.all(
      sessions.map((session) =>
        this.filmModel.updateOne(
          { 'schedule.id': session.id },
          { $set: { 'schedule.$.taken': session.taken } },
        ),
      ),
    );
  }

  private mapFilm(film: MongoFilmDocument): FilmDocument {
    const data = film.toObject();

    return {
      id: data.id,
      title: data.title,
      about: data.about,
      description: data.description,
      director: data.director,
      rating: data.rating,
      tags: data.tags ?? [],
      image: data.image,
      cover: data.cover,
      schedule: (data.schedule ?? []).map((session) => ({
        id: session.id,
        daytime: session.daytime,
        hall: session.hall,
        rows: session.rows,
        seats: session.seats,
        price: session.price,
        taken: session.taken ?? [],
      })),
    };
  }
}
