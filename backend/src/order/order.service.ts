import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import {
  CreateOrderDto,
  OrderResultDto,
  OrderTicketRequestDto,
  OrderTicketsEnvelope,
} from './dto/order.dto';
import { ListResponseDto } from '../common/dto/list-response.dto';
import { FilmsRepository } from '../films/films.repository';
import { FilmDocument, FilmSession } from '../films/films.document';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(
    dto: CreateOrderDto,
  ): Promise<ListResponseDto<OrderResultDto>> {
    const normalized = this.normalizeOrder(dto);
    const tickets = normalized.tickets;

    if (!tickets.length) {
      throw new BadRequestException('Не выбраны места для бронирования');
    }

    const filmsCache = new Map<string, FilmDocument>();
    const sessionsToSave: FilmSession[] = [];
    const items: OrderResultDto[] = [];

    for (const ticket of tickets) {
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
      sessionsToSave.push(session);

      items.push({
        ...ticket,
        id: randomUUID(),
        daytime: session.daytime,
        price: session.price,
      });
    }

    await this.filmsRepository.saveTakenSeats(sessionsToSave);

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
    const session = film.schedule?.find((item) => item.id === sessionId);

    if (!session) {
      throw new NotFoundException(
        `Сеанс ${sessionId} не найден у фильма ${film.id}`,
      );
    }

    return session;
  }

  private normalizeOrder(dto: CreateOrderDto): OrderTicketsEnvelope {
    if (Array.isArray(dto)) {
      return {
        tickets: dto.map(this.stripClientProvidedSeatMeta),
      };
    }

    return {
      tickets: (dto.tickets ?? []).map(this.stripClientProvidedSeatMeta),
      email: dto.email,
      phone: dto.phone,
    };
  }

  private stripClientProvidedSeatMeta(
    ticket: OrderTicketRequestDto,
  ): OrderTicketRequestDto {
    const { film, session, row, seat } = ticket;
    return { film, session, row, seat };
  }
}
