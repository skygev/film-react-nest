import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';

import { FilmsService } from './films.service';
import { FilmDto, FilmScheduleDto, FilmsQueryDto } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  getFilms(@Query() query: FilmsQueryDto): FilmDto[] {
    return this.filmsService.findAll(query);
  }

  @Get(':id/schedule')
  getSchedule(@Param('id') id: string): FilmScheduleDto {
    const schedule = this.filmsService.findSchedule(id);

    if (!schedule) {
      throw new NotFoundException(`Schedule for film ${id} not found`);
    }

    return schedule;
  }
}
