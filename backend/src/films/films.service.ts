import { Injectable } from '@nestjs/common';

import { ListResponseDto } from '../common/dto/list-response.dto';
import {
  FilmDto,
  FilmSessionDto,
  FilmsQueryDto,
} from './dto/films.dto';
import { FilmsRepository } from './films.repository';
import { filmToDto, filmToScheduleDto } from './films.mapper';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async findAll(query: FilmsQueryDto = {}): Promise<ListResponseDto<FilmDto>> {
    const films = await this.filmsRepository.findAll(query);
    const items = films.map(filmToDto);

    return {
      total: items.length,
      items,
    };
  }

  async findSchedule(
    id: string,
  ): Promise<ListResponseDto<FilmSessionDto> | undefined> {
    const film = await this.filmsRepository.findById(id);
    if (!film) {
      return undefined;
    }

    const schedule = filmToScheduleDto(film);
    return {
      total: schedule.showTimes.length,
      items: schedule.showTimes,
    };
  }
}
