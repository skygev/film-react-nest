import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { CreateOrderDto, OrderResultDto } from './dto/order.dto';
import { ListResponseDto } from '../common/dto/list-response.dto';
import { FilmsRepository } from '../films/films.repository';
import { FilmDocument, FilmSession } from '../films/films.schema';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(
    dto: CreateOrderDto,
  ): Promise<ListResponseDto<OrderResultDto>> {
    if (!dto.tickets?.length) {
      throw new BadRequestException('Не выбраны места для бронирования');
    }

    const filmsCache = new Map<string, FilmDocument>();
    const filmsToSave = new Set<FilmDocument>();
    const items: OrderResultDto[] = [];

    for (const ticket of dto.tickets) {
      const film = await this.getFilm(ticket.film, filmsCache);
      const session = this.getSession(film, ticket.session);
      const seatKey = `${ticket.row}:${ticket.seat}`;

      if (!session.taken) {
        session.taken = [];
      }

      if (session.taken.includes(seatKey)) {
        throw new ConflictException(
          `Место ${seatKey} уже занято на сеансе ${ticket.session}`,
        );
      }

      session.taken.push(seatKey);
      filmsToSave.add(film);

      items.push({
        ...ticket,
        id: randomUUID(),
        daytime: session.daytime,
        price: session.price,
      });
    }

    await Promise.all([...filmsToSave].map((film) => film.save()));

    return {
      total: items.length,
      items,
    };
  }

  private async getFilm(
    filmId: string,
    cache: Map<string, FilmDocument>,
  ): Promise<FilmDocument> {
    if (!cache.has(filmId)) {
      const film = await this.filmsRepository.findById(filmId);
      if (!film) {
        throw new NotFoundException(`Фильм ${filmId} не найден`);
      }
      cache.set(filmId, film);
    }

    return cache.get(filmId)!;
  }

  private getSession(film: FilmDocument, sessionId: string): FilmSession {
    const session = film.schedule?.find(
      (item) => item.id === sessionId,
    );

    if (!session) {
      throw new NotFoundException(
        `Сеанс ${sessionId} не найден у фильма ${film.id}`,
      );
    }

    return session;
  }
}
