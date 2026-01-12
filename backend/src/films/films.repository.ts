import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { FilmsQueryDto } from './dto/films.dto';
import { Film, FilmDocument } from './films.schema';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectModel(Film.name)
    private readonly filmModel: Model<FilmDocument>,
  ) {}

  async findAll(query: FilmsQueryDto = {}): Promise<FilmDocument[]> {
    const filter: FilterQuery<FilmDocument> = {};

    if (query.date) {
      filter.schedule = {
        $elemMatch: {
          daytime: {
            $regex: `^${query.date}`,
          },
        },
      };
    }

    return this.filmModel.find(filter).exec();
  }

  async findById(id: string): Promise<FilmDocument | null> {
    return this.filmModel.findOne({ id }).exec();
  }
}
