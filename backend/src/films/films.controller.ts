import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';

import { FilmsService } from './films.service';
import { FilmDto, FilmSessionDto, FilmsQueryDto } from './dto/films.dto';
import { ListResponseDto } from '../common/dto/list-response.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getFilms(
    @Query() query: FilmsQueryDto,
  ): Promise<ListResponseDto<FilmDto>> {
    return this.filmsService.findAll(query);
  }

  @Get(':id/schedule')
  async getSchedule(
    @Param('id') id: string,
  ): Promise<ListResponseDto<FilmSessionDto>> {
    const schedule = await this.filmsService.findSchedule(id);

    if (!schedule) {
      throw new NotFoundException(`Schedule for film ${id} not found`);
    }

    return schedule;
  }
}
